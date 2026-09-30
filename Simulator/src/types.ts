export type PlatformType = "chzzk" | "soop" | "youtube";

export type ChatPayload = { platform: PlatformType; nickname: string; content: string };

export type OutgoingMessage =
    | ({ type: "chat" } & ChatPayload)
    | { type: "batch"; messages: ChatPayload[] }
    | { type: "fakeConnection"; platforms: PlatformType[] };

export type ServerStatus = {
    port: number;
    listening: boolean;
    error: string;
    clients: { url: string; origin: string }[];
};

/** Client가 보내는 로비·연결 상태 */
export type GameState = {
    type: "state";
    lobby: { status: "ready" | "open" | "closed"; participantCount: number; capacity: number; excluded: string[] };
    connections: Record<PlatformType, "real" | "fake" | "off">;
    /** Unity 미니게임 진행 상태 (구버전 Client는 보내지 않음) */
    game?: {
        status: string;
        phase: string | null;
        gameName: string | null;
        practice?: boolean;
        round: number;
        survivorCount: number;
        forwardedInputs: number;
    };
};

declare global {
    interface Window {
        simulator: {
            send: (message: OutgoingMessage) => Promise<number>;
            getStatus: () => Promise<ServerStatus>;
            onStatus: (callback: (status: ServerStatus) => void) => () => void;
            onState: (callback: (state: GameState) => void) => () => void;
        };
    }
}
