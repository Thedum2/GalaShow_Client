import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "polychat-bridge";
import { RgfApi, onRgfEvent } from "@/bridge/handler/RGFHandler";
import { ViewerAvatarApi } from "@/api/modules/ViewerAvatarApi";
import type { MinigameDetail } from "@/api/model/response/minigame/MinigameDetail";
import { IS_DEV } from "@/api/config";
import { polyChat } from "@/stores/polychat";
import { participantId, useLobbyStore, type LobbyParticipant } from "@/stores/lobby";
import { useSessionStore } from "@/stores/session";
import { useRgfStore } from "@/stores/rgf";
import type { GamePhase, RgfRoundCompletedNty } from "@/types/rgf";
import {
    buildGameData,
    buildPlayerMapping,
    resolvePluginId,
    toPhaseDuration,
    type PlayerMapping,
} from "./minigamePlugins";

/** StartRound 후 이 시간 안에 단계 알림이 없으면 시작 실패로 보고 다시 시작할 수 있게 한다 */
const START_WATCHDOG_MS = 4000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(run: () => Promise<T>, attempts = 2): Promise<T> {
    let last: unknown;
    for (let i = 0; i < attempts; i++) {
        try {
            return await run();
        } catch (error) {
            last = error;
            await delay(500);
        }
    }
    throw last;
}

/** 로비에서 고른 시청자 아바타 이름 (Admin viewer_avatars.name) */
async function selectedAvatarNames(): Promise<string[]> {
    const selected = useLobbyStore.getState().selectedAvatarIds;
    if (selected.length === 0) return [];
    try {
        const avatars = await ViewerAvatarApi.list();
        return [...avatars]
            .sort((a, b) => a.order - b.order)
            .filter((a) => selected.includes(`avatar-${a.id}`))
            .map((a) => a.name);
    } catch (error) {
        console.warn("[RGF] 아바타 목록을 불러오지 못해 기본 캐릭터를 씁니다", error);
        return [];
    }
}

export type RoundMode = "practice" | "live";

/** 연습 한 판의 결과 요약 (세션에는 저장하지 않는다) */
export interface PracticeSummary {
    survivors: number;
    eliminated: number;
    hostChoice: string | null;
}

interface Options {
    isLoaded: boolean;
    detail: MinigameDetail | null;
    /**
     * practice: Tutorial 연습. 탈락이 반영되지 않고 몇 번이든 다시 할 수 있다.
     * live: 실전. 결과를 세션 생존자로 저장한다.
     */
    mode: RoundMode;
    /** 준비되면 바로 시작 (실전 화면) */
    autoStart?: boolean;
    /** 실전 결과가 확정되면 호출 (결과 화면 이동 등) */
    onCompleted?: () => void;
}

/**
 * 미니게임 한 판을 Unity에서 진행한다.
 * Unity 로드 → Initialize(참가자·아바타) → RegisterPlugin → StartRound(practice) → 입력 단계 채팅 전달 → RoundCompleted
 * 호스트 선택은 Unity 게임 화면의 호스트 버튼으로 한다.
 */
export function useRgfRound({ isLoaded, detail, mode, autoStart = false, onCompleted }: Options) {
    const rgf = useRgfStore();
    const [error, setError] = useState<string | null>(null);
    const [practiceSummary, setPracticeSummary] = useState<PracticeSummary | null>(null);
    const [practiceCount, setPracticeCount] = useState(0);

    const pluginId = detail ? resolvePluginId(detail.gameData) : null;
    const mappingRef = useRef<PlayerMapping | null>(null);
    const participantsRef = useRef<LobbyParticipant[]>([]);
    const pluginUuidRef = useRef<string | null>(null);
    const phaseRef = useRef<GamePhase | null>(null);
    const statusRef = useRef(rgf.status);
    const inputSeq = useRef(0);
    const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoStarted = useRef(false);
    const detailRef = useRef(detail);
    detailRef.current = detail;
    const modeRef = useRef(mode);
    modeRef.current = mode;
    const onCompletedRef = useRef(onCompleted);
    onCompletedRef.current = onCompleted;
    statusRef.current = rgf.status;

    const fail = useCallback((message: string, cause?: unknown) => {
        console.error("[RGF]", message, cause);
        setError(message);
        useRgfStore.getState().set({ status: "error" });
    }, []);

    const clearWatchdog = () => {
        if (watchdog.current) clearTimeout(watchdog.current);
        watchdog.current = null;
    };

    // 페이지를 벗어나면 상태를 비운다
    useEffect(() => () => {
        clearWatchdog();
        useRgfStore.getState().reset();
    }, []);

    // 1) Unity가 뜨면 참가자 등록·플러그인 등록
    useEffect(() => {
        if (!detail) return;
        const store = useRgfStore.getState();
        if (!pluginId) {
            store.set({ status: "unsupported", gameName: detail.name, pluginId: null, practice: mode === "practice" });
            return;
        }
        if (!isLoaded) {
            store.set({ status: "loading", gameName: detail.name, pluginId, practice: mode === "practice" });
            return;
        }
        // Unity가 상세 정보보다 먼저 뜬 경우(idle)도 한 번만 진행한다
        if (store.status !== "loading" && store.status !== "idle") return;

        let cancelled = false;
        (async () => {
            store.set({ status: "initializing", gameName: detail.name, pluginId, practice: mode === "practice" });
            const participants = useSessionStore.getState().survivors;
            if (participants.length === 0) {
                fail("참가자가 없습니다. 로비에서 참가자를 모은 뒤 시작하세요.");
                return;
            }
            participantsRef.current = participants;
            const mapping = buildPlayerMapping(participants.map((p) => ({ id: p.id, nickname: p.nickname })));
            mappingRef.current = mapping;

            try {
                const avatarNames = await selectedAvatarNames();
                // Unity 부트스트랩(AfterSceneLoad)이 끝날 시간을 준다
                await delay(300);
                await withRetry(() => RgfApi.initialize({
                    sessionId: useSessionStore.getState().sessionId,
                    playerInfo: mapping.playerInfo,
                    config: { enableDebugLog: IS_DEV, avatarNames },
                }));
                const acks = await withRetry(() => RgfApi.registerPlugin([{ miniGameIdx: detail.id, miniGameName: pluginId }]));
                const ack = acks?.find((a) => a.miniGameName === pluginId);
                if (!ack?.miniGamePluginIdx) {
                    fail(`Unity 빌드에 '${pluginId}' 게임이 없습니다. Unity를 다시 빌드했는지 확인하세요.`);
                    return;
                }
                if (cancelled) return;
                pluginUuidRef.current = ack.miniGamePluginIdx;
                useRgfStore.getState().set({ status: "ready" });
            } catch (e) {
                if (!cancelled) fail(`Unity와 연결하지 못했습니다. 새로고침 후 다시 시도하세요. (${e instanceof Error ? e.message : e})`, e);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [detail, pluginId, isLoaded, mode, fail]);

    // 2) Unity 알림: 단계·결과
    useEffect(() => {
        return onRgfEvent((event) => {
            if (event.type === "PromptOpened") {
                useRgfStore.getState().set({ prompt: event.data });
            } else if (event.type === "PromptClosed") {
                const current = useRgfStore.getState().prompt;
                if (!current || current.promptId === event.data.promptId) useRgfStore.getState().set({ prompt: null });
            } else if (event.type === "PhaseChanged") {
                clearWatchdog();
                phaseRef.current = event.data.toPhase;
                useRgfStore.getState().set({ phase: event.data.toPhase });
            } else if (event.type === "RoundCompleted") {
                completeRound(event.data);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const completeRound = (data: RgfRoundCompletedNty) => {
        const mapping = mappingRef.current;
        const detail = detailRef.current;
        const session = useSessionStore.getState();
        if (!mapping || !detail || data.roundNumber !== session.round || statusRef.current !== "running") return;
        phaseRef.current = null;
        useRgfStore.getState().set({ prompt: null });

        // 연습: 세션에 반영하지 않고 요약만 보여 준 뒤 다시 할 수 있게 한다
        if (modeRef.current === "practice" || data.practice) {
            const results: any[] = Array.isArray(data.result.detail?.results) ? data.result.detail.results : [];
            setPracticeSummary({
                survivors: results.filter((r) => r.survived).length,
                eliminated: results.filter((r) => !r.survived).length,
                hostChoice: data.result.detail?.hostChoice ?? null,
            });
            setPracticeCount((n) => n + 1);
            useRgfStore.getState().set({ status: "ready", phase: null });
            return;
        }

        const byId = new Map(participantsRef.current.map((p) => [p.id, p]));
        const toParticipants = (indices: number[]) =>
            indices.map((idx) => byId.get(mapping.idByIdx[idx])).filter((p): p is LobbyParticipant => Boolean(p));

        session.completeRound({
            round: session.round,
            gameId: detail.id,
            gameName: detail.name,
            gameLogoUrl: detail.logoUrl,
            participants: participantsRef.current,
            survivors: toParticipants(data.result.survivorsUserIdx ?? []),
            eliminated: toParticipants(data.result.eliminatedUserIdx ?? []),
            detail: data.result.detail ?? null,
        });
        useRgfStore.getState().set({ status: "completed", phase: null });
        onCompletedRef.current?.();
    };

    // 3) 채팅 → Unity (입력 단계에서만)
    useEffect(() => {
        const handleMessage = ({ platform, message }: { platform: string; message: ChatMessage }) => {
            if (statusRef.current !== "running" || phaseRef.current !== "INPUT" || message.nickname === "SYSTEM") return;
            const playerIdx = mappingRef.current?.idxById[participantId(platform as LobbyParticipant["platform"], message.nickname)];
            if (!playerIdx) return;
            try {
                RgfApi.chatInput({
                    roundNumber: useSessionStore.getState().round,
                    inputEventTime: Date.now(),
                    inputIdx: ++inputSeq.current,
                    chatInfo: [{ playerIdx, message: message.content }],
                });
                const store = useRgfStore.getState();
                store.set({ forwardedInputs: store.forwardedInputs + 1 });
            } catch (e) {
                console.warn("[RGF] chat forward failed", e);
            }
        };
        polyChat.on("message", handleMessage);
        return () => {
            polyChat.off("message", handleMessage);
        };
    }, []);

    const start = useCallback(async () => {
        if (!detail || !pluginId || !pluginUuidRef.current || statusRef.current !== "ready") return;
        const session = useSessionStore.getState();
        const practice = modeRef.current === "practice";
        try {
            const built = buildGameData(pluginId, detail.gameData, session.playedContentIds);
            // 연습 문항은 기록하지 않는다 (실전에서 다시 나올 수 있음)
            if (built.contentId && !practice) session.markContentPlayed(built.contentId);
            inputSeq.current = 0;
            phaseRef.current = null;
            setPracticeSummary(null);
            setError(null);
            useRgfStore.getState().set({ status: "running", forwardedInputs: 0, phase: null, prompt: null });
            await RgfApi.startRound({
                miniGamePluginIdx: pluginUuidRef.current,
                roundNumber: session.round,
                gameData: built.gameData,
                phaseDuration: toPhaseDuration(detail.phaseData as any, pluginId),
                practice,
            });
            // 이전 라운드가 아직 정리 중이면 Unity가 시작을 거부할 수 있다 → 단계 알림이 없으면 다시 준비 상태로
            clearWatchdog();
            watchdog.current = setTimeout(() => {
                if (statusRef.current === "running" && !phaseRef.current) {
                    setError("게임이 시작되지 않았습니다. 잠시 후 다시 눌러 주세요.");
                    useRgfStore.getState().set({ status: "ready" });
                }
            }, START_WATCHDOG_MS);
        } catch (e) {
            fail(e instanceof Error ? e.message : "게임을 시작하지 못했습니다.", e);
        }
    }, [detail, pluginId, fail]);

    const abort = useCallback(async () => {
        clearWatchdog();
        try {
            await RgfApi.abortRound({ roundNumber: useSessionStore.getState().round });
        } catch (e) {
            console.warn("[RGF] abort failed", e);
        } finally {
            phaseRef.current = null;
            useRgfStore.getState().set({ status: "ready", phase: null, prompt: null });
        }
    }, []);

    /** 호스트가 팝업에서 선택하면 Unity에 보내고 팝업을 닫는다 */
    const selectHostOption = useCallback((optionId: string) => {
        const prompt = useRgfStore.getState().prompt;
        if (!prompt || statusRef.current !== "running") return;
        try {
            RgfApi.hostInput({ roundNumber: useSessionStore.getState().round, command: prompt.command, value: optionId });
            useRgfStore.getState().set({ prompt: null });
        } catch (e) {
            console.warn("[RGF] host input failed", e);
        }
    }, []);

    /** 진행 중이면 중단하고, 정리될 시간을 둔 뒤 다시 시작한다 (연습 다시 하기) */
    const restart = useCallback(async () => {
        if (statusRef.current === "running") {
            await abort();
            await delay(1200);
        }
        statusRef.current = useRgfStore.getState().status;
        await start();
    }, [abort, start]);

    // 5) autoStart(튜토리얼·실전 화면): 준비되면 바로 시작
    useEffect(() => {
        if (!autoStart || autoStarted.current || rgf.status !== "ready") return;
        const timer = setTimeout(() => {
            autoStarted.current = true;
            void start();
        }, 800);
        return () => clearTimeout(timer);
    }, [autoStart, rgf.status, start]);

    return {
        status: rgf.status,
        phase: rgf.phase,
        error,
        pluginId,
        practiceSummary,
        practiceCount,
        prompt: rgf.prompt,
        selectHostOption,
        start,
        restart,
        abort,
    };
}
