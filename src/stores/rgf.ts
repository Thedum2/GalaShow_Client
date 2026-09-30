import { create } from "zustand";
import type { GamePhase, RgfPromptOpenedNty } from "@/types/rgf";

/** 열린 호스트 선택 팝업 (Unity가 열고, 호스트가 고르거나 Unity가 닫으면 사라진다) */
export type HostPromptState = RgfPromptOpenedNty;

/**
 * Unity 미니게임 진행 상태 (화면 표시·시뮬레이터 상태 공유용)
 */
export type RgfStatus = "idle" | "loading" | "initializing" | "ready" | "running" | "completed" | "unsupported" | "error";

type RgfState = {
    status: RgfStatus;
    phase: GamePhase | null;
    pluginId: string | null;
    gameName: string | null;
    /** 연습(Tutorial) 진행 중인지 */
    practice: boolean;
    /** 이번 라운드에 Unity로 보낸 참가자 입력 수 */
    forwardedInputs: number;
    prompt: HostPromptState | null;
    set: (patch: Partial<Omit<RgfState, "set" | "reset">>) => void;
    reset: () => void;
};

const initial = {
    status: "idle" as RgfStatus,
    phase: null as GamePhase | null,
    pluginId: null as string | null,
    gameName: null as string | null,
    practice: false,
    forwardedInputs: 0,
    prompt: null as HostPromptState | null,
};

export const useRgfStore = create<RgfState>()((set) => ({
    ...initial,
    set: (patch) => set(patch),
    reset: () => set(initial),
}));
