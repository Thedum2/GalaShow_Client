/**
 * React ↔ Unity RGF 메시지 모델 (docs/interface.md 5~7절)
 */

export type GamePhase = "READY" | "SETUP" | "PRESENT" | "INPUT" | "WAIT" | "EXECUTE" | "REVEAL" | "CLEANUP";

export const GAME_PHASES: GamePhase[] = ["READY", "SETUP", "PRESENT", "INPUT", "WAIT", "EXECUTE", "REVEAL", "CLEANUP"];

// ── React → Unity ──

export interface RgfPlayerInfo {
    playerIdx: number;
    playerType: "human";
    playerName: string;
    /** Admin viewer_avatars.name (선택) */
    avatarName?: string;
}

export interface RgfInitializeReq {
    sessionId: string;
    playerInfo: RgfPlayerInfo[];
    config: {
        enableDebugLog: boolean;
        /** 로비에서 고른 시청자 아바타 이름. avatarName이 없는 참가자에게 순서대로 배정 */
        avatarNames?: string[];
    };
}

export interface RgfInitializeAck {
    initialized: boolean;
    version: string;
}

export interface RgfRegisterPluginReq {
    miniGameIdx: number;
    /** 플러그인 ID (API game_data.pluginId, 예: galashow.trolley) */
    miniGameName: string;
}

export interface RgfRegisterPluginAck {
    miniGameIdx: number;
    miniGameName: string;
    miniGamePluginIdx: string;
}

/** 단계 시간(초, 소수 허용). -1은 무한 대기(게임이 완료 조건을 채울 때까지) */
export type RgfPhaseDuration = Record<GamePhase, number>;

export interface RgfStartRoundReq {
    miniGamePluginIdx: string;
    roundNumber: number;
    gameData: unknown;
    phaseDuration: RgfPhaseDuration;
    /** 연습 라운드 (Tutorial). 판정·연출은 같지만 탈락이 반영되지 않는다 */
    practice?: boolean;
}

export interface RgfStartRoundAck {
    started: boolean;
    roundNumber: number;
}

export interface RgfAbortRoundReq {
    roundNumber: number;
}

export interface RgfChatInputNty {
    roundNumber: number;
    inputEventTime: number;
    inputIdx: number;
    chatInfo: { playerIdx: number; message: string }[];
}

export interface RgfHostInputNty {
    roundNumber: number;
    command: string;
    value: string;
}

// ── Unity → React ──

export interface RgfPhaseChangedNty {
    roundNumber: number;
    miniGamePluginIdx: string;
    fromPhase: GamePhase;
    toPhase: GamePhase;
}

export interface RgfPhaseStartedNty {
    phase: GamePhase;
    duration: number;
}

export interface RgfRoundStartedNty {
    roundNumber: number;
    miniGamePluginIdx: string;
    gameName: string;
}

export interface RgfRoundResult {
    survivorsUserIdx: number[];
    eliminatedUserIdx: number[];
    totalParticipants: number;
    remainingPlayers: number;
    totalPlayTime: number;
    /** 게임별 결과 상세 (트롤리: hostChoice, distribution, results[]) */
    detail?: any;
}

export interface RgfRoundCompletedNty {
    roundNumber: number;
    miniGamePluginIdx: string;
    gameName: string;
    result: RgfRoundResult;
    practice?: boolean;
}

/** 호스트 선택 팝업 선택지 (게임 공통) */
export interface RgfPromptOption {
    /** 고르면 HostInput value로 보낸다 */
    id: string;
    /** 화면 번호 (시청자 채팅 번호와 같음) */
    number: number;
    label: string;
    description?: string;
}

/** Unity → React: 호스트 선택 팝업 열기. 고른 값은 RGFManager_HostInput(command, value=option.id) */
export interface RgfPromptOpenedNty {
    roundNumber: number;
    promptId: string;
    command: string;
    title: string;
    description?: string;
    actionLabel?: string;
    hint?: string;
    options: RgfPromptOption[];
}

export interface RgfPromptClosedNty {
    roundNumber: number;
    promptId: string;
}

export type RgfEvent =
    | { type: "InitializeProgress"; data: { currentProgress: number } }
    | { type: "PhaseChanged"; data: RgfPhaseChangedNty }
    | { type: "PhaseStarted"; data: RgfPhaseStartedNty }
    | { type: "PhaseEnded"; data: RgfPhaseStartedNty }
    | { type: "RoundStarted"; data: RgfRoundStartedNty }
    | { type: "RoundCompleted"; data: RgfRoundCompletedNty }
    | { type: "PromptOpened"; data: RgfPromptOpenedNty }
    | { type: "PromptClosed"; data: RgfPromptClosedNty };
