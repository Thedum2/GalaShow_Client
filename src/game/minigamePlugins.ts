/**
 * API 미니게임 → Unity RGF 요청 변환 (React·Unity 의존 없는 순수 함수)
 * 계약: docs/interface.md, 게임별 game_data: docs/minigame-*.md
 */
import type { GamePhase, RgfPhaseDuration, RgfPlayerInfo } from "@/types/rgf";

const PHASES: GamePhase[] = ["READY", "SETUP", "PRESENT", "INPUT", "WAIT", "EXECUTE", "REVEAL", "CLEANUP"];

export const TROLLEY_PLUGIN_ID = "galashow.trolley";

/** phase_data 무한 대기 값: 시간 제한 없이 게임이 완료 조건을 채울 때까지 기다린다 (예: 호스트 선택) */
export const INFINITE_PHASE = -1;

/** 플러그인별 기본 단계 시간(초). API phase_data 값이 0이거나 없을 때 쓴다. */
const DEFAULT_PHASE_SECONDS: Record<string, RgfPhaseDuration> = {
    // WAIT: 호스트가 고를 때까지 무한 대기
    [TROLLEY_PLUGIN_ID]: { READY: 2, SETUP: 1.5, PRESENT: 6, INPUT: 15, WAIT: INFINITE_PHASE, EXECUTE: 1, REVEAL: 8, CLEANUP: 1.5 },
    default: { READY: 2, SETUP: 1, PRESENT: 3, INPUT: 10, WAIT: 1, EXECUTE: 1, REVEAL: 5, CLEANUP: 1 },
};

/** 연출이 잘리지 않도록 보장하는 최소 단계 시간(초) */
const MIN_PHASE_SECONDS: Record<string, Partial<RgfPhaseDuration>> = {
    [TROLLEY_PLUGIN_ID]: { PRESENT: 5, WAIT: 3, REVEAL: 8 },
};

/**
 * game_data에서 Unity 플러그인 ID를 찾는다. 없으면 null (Unity로 실행할 수 없는 게임)
 */
export function resolvePluginId(gameData: any): string | null {
    const id = gameData && typeof gameData === "object" ? gameData.pluginId : null;
    return typeof id === "string" && id.trim() ? id.trim() : null;
}

/**
 * API phase_data(ms) → StartRound phaseDuration(초). 8개 단계를 모두 채운다.
 * -1은 무한 대기로 그대로 보낸다(최소 시간을 적용하지 않음). 0·누락은 게임 기본값.
 */
export function toPhaseDuration(phaseDataMs: Partial<Record<GamePhase, number>> | null | undefined, pluginId: string): RgfPhaseDuration {
    const defaults = DEFAULT_PHASE_SECONDS[pluginId] ?? DEFAULT_PHASE_SECONDS.default;
    const minimum = MIN_PHASE_SECONDS[pluginId] ?? {};
    const result = {} as RgfPhaseDuration;
    for (const phase of PHASES) {
        const ms = Number(phaseDataMs?.[phase] ?? 0);
        const seconds = ms === INFINITE_PHASE ? INFINITE_PHASE
            : Number.isFinite(ms) && ms > 0 ? Math.round(ms / 100) / 10
            : defaults[phase];
        result[phase] = seconds === INFINITE_PHASE ? INFINITE_PHASE : Math.max(seconds, minimum[phase] ?? 0);
    }
    return result;
}

export interface SessionParticipant {
    id: string;
    nickname: string;
}

export interface PlayerMapping {
    playerInfo: RgfPlayerInfo[];
    /** playerIdx → 참가자 ID */
    idByIdx: Record<number, string>;
    /** 참가자 ID → playerIdx */
    idxById: Record<string, number>;
}

/**
 * 이번 라운드 참가자에게 1부터 playerIdx를 붙인다 (Unity 내부 번호. 플랫폼 ID와 무관)
 */
export function buildPlayerMapping(participants: SessionParticipant[]): PlayerMapping {
    const idByIdx: Record<number, string> = {};
    const idxById: Record<string, number> = {};
    const playerInfo = participants.map((p, i) => {
        const playerIdx = i + 1;
        idByIdx[playerIdx] = p.id;
        idxById[p.id] = playerIdx;
        return { playerIdx, playerType: "human" as const, playerName: p.nickname };
    });
    return { playerInfo, idByIdx, idxById };
}

export interface BuiltGameData {
    gameData: unknown;
    /** 이번에 쓴 문항 ID (다음 라운드 중복 방지용). 없으면 null */
    contentId: string | null;
}

/**
 * 플러그인별 StartRound gameData 생성
 */
export function buildGameData(pluginId: string, gameData: any, playedContentIds: string[], random: () => number = Math.random): BuiltGameData {
    if (pluginId === TROLLEY_PLUGIN_ID) {
        return buildTrolleyGameData(gameData, playedContentIds, random);
    }
    // 변환 규칙이 없는 게임은 game_data를 그대로 넘긴다 (플러그인이 IGameDataParser로 해석)
    return { gameData: gameData ?? null, contentId: null };
}

/**
 * 트롤리: API game_data(docs/minigame-trolley.md 4.2) → Unity TrolleyGameData(6.1)
 * content.pick = random_unplayed: 이번 세션에 안 나온 문항 중 무작위, 다 나왔으면 전체에서 무작위
 */
export function buildTrolleyGameData(gameData: any, playedContentIds: string[], random: () => number = Math.random): BuiltGameData {
    const dilemmas: any[] = Array.isArray(gameData?.content?.dilemmas)
        ? gameData.content.dilemmas.filter((d: any) => Array.isArray(d?.choices) && d.choices.length === 2 && d.active !== false)
        : [];
    if (dilemmas.length === 0) {
        throw new Error("트롤리 game_data에 사용할 딜레마(content.dilemmas, 선택지 2개)가 없습니다");
    }

    const fresh = dilemmas.filter((d) => !playedContentIds.includes(String(d.id)));
    const pool = fresh.length > 0 ? fresh : dilemmas;
    const dilemma = pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];

    const rule = gameData?.rule ?? {};
    return {
        contentId: dilemma.id != null ? String(dilemma.id) : null,
        gameData: {
            dilemmaId: dilemma.id != null ? String(dilemma.id) : null,
            title: String(dilemma.title ?? ""),
            description: String(dilemma.description ?? ""),
            choices: dilemma.choices.map((c: any) => ({
                id: String(c.id),
                label: String(c.label ?? c.id),
                description: String(c.description ?? ""),
            })),
            rule: {
                // 미입력: 기본은 입력 마감 때 1·2 중 자동 선택
                noInput: rule.noInput === "survive" || rule.noInput === "eliminate" ? rule.noInput : "random",
                allEliminated: rule.allEliminated === "all_eliminated" ? "all_eliminated" : "all_survive",
                hostChoiceIfMissing: rule.hostChoice?.ifMissing === "abort" ? "abort" : "random",
            },
        },
    };
}
