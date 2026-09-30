import { create } from "zustand";
import type { LobbyParticipant } from "@/stores/lobby";

/**
 * 한 라운드(미니게임 한 판)의 확정 결과. Unity RoundCompleted를 참가자로 바꾼 값이다.
 */
export type RoundResult = {
    round: number;
    gameId: number;
    gameName: string;
    gameLogoUrl: string;
    /** 이번 라운드에 참가한 인원 */
    participants: LobbyParticipant[];
    survivors: LobbyParticipant[];
    eliminated: LobbyParticipant[];
    /** 게임별 결과 상세 (트롤리: hostChoice, distribution, results[]) */
    detail: any;
};

/**
 * 게임 세션(로비에서 시작 ~ 최종 결과). 라운드와 생존자는 이후 화면(튜토리얼·결과)이 이어서 갱신한다.
 * PRD: 첫 라운드 대상은 확정 참가자, 이후 라운드는 생존자.
 */
type SessionState = {
    /** 세션 구분 ID (Unity Initialize sessionId) */
    sessionId: string;
    /** 세션 시작 시각(ms) */
    startedAt: number;
    /** 1부터 시작하는 현재 라운드 */
    round: number;
    survivors: LobbyParticipant[];
    /** 이번 라운드에 고른 미니게임 */
    currentGameId: number | null;
    /** 이미 진행한 미니게임. 다음 라운드 후보에서 가능하면 제외한다. */
    playedGameIds: number[];
    /** 이미 나온 게임 문항 ID (예: 트롤리 딜레마 id) */
    playedContentIds: string[];
    /** 라운드별 결과 (마지막이 가장 최근) */
    results: RoundResult[];

    /** 로비의 확정 참가자로 새 세션을 시작한다. */
    start: (participants: LobbyParticipant[]) => void;
    selectGame: (gameId: number) => void;
    markContentPlayed: (contentId: string) => void;
    /** 라운드 결과 확정: 생존자 갱신, 진행한 게임 기록 */
    completeRound: (result: RoundResult) => void;
    /** 결과 화면에서 다음 라운드로 */
    nextRound: () => void;
    reset: () => void;
};

const newSessionId = () => `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const initialState = () => ({
    sessionId: newSessionId(),
    startedAt: Date.now(),
    round: 1,
    survivors: [] as LobbyParticipant[],
    currentGameId: null as number | null,
    playedGameIds: [] as number[],
    playedContentIds: [] as string[],
    results: [] as RoundResult[],
});

export const useSessionStore = create<SessionState>()((set) => ({
    ...initialState(),

    start: (participants) => set({ ...initialState(), survivors: participants }),
    selectGame: (gameId) => set({ currentGameId: gameId }),
    markContentPlayed: (contentId) =>
        set((state) => (state.playedContentIds.includes(contentId) ? state : { playedContentIds: [...state.playedContentIds, contentId] })),
    completeRound: (result) =>
        set((state) => ({
            survivors: result.survivors,
            results: [...state.results, result],
            playedGameIds: state.playedGameIds.includes(result.gameId) ? state.playedGameIds : [...state.playedGameIds, result.gameId],
        })),
    nextRound: () => set((state) => ({ round: state.round + 1, currentGameId: null })),
    reset: () => set(initialState()),
}));

/** 가장 최근 라운드 결과 */
export const selectLastResult = (state: SessionState) => state.results[state.results.length - 1] ?? null;

const ORDINALS = ["첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];

/** 1 → "첫번째", 2 → "두번째" … 11 이상은 "11번째" */
export const roundLabel = (round: number) => `${ORDINALS[round - 1] ?? round}번째`;
