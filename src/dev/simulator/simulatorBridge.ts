// GalaShow Simulator(Electron 앱, 이 저장소의 Simulator 폴더)와 잇는 개발용 연결. 프로토콜은 Simulator/electron/server.cjs 참고.
// 시뮬레이터가 보낸 가짜 채팅을 실제 채팅 경로로 흘려보내고, 로비·연결 상태를 시뮬레이터에 알린다.
import { useLobbyStore } from "@/stores/lobby";
import { usePolyChatStore } from "@/stores/polychat";
import { useRgfStore } from "@/stores/rgf";
import { useSessionStore } from "@/stores/session";
import type { PlatformType } from "@/types/common";
import { ALL_PLATFORMS, isFakeConnection, sendChat, setFakeConnection } from "./mockChat";

export const SIMULATOR_URL = import.meta.env.VITE_SIMULATOR_URL?.trim() || "ws://127.0.0.1:47800";

type ChatPayload = { platform: PlatformType; nickname: string; content: string };
type IncomingMessage =
    | ({ type: "chat" } & ChatPayload)
    | { type: "batch"; messages: ChatPayload[] }
    | { type: "fakeConnection"; platforms: PlatformType[] };

const isChat = (m: Partial<ChatPayload>): m is ChatPayload =>
    ALL_PLATFORMS.includes(m.platform as PlatformType) && typeof m.nickname === "string" && typeof m.content === "string";

function buildState() {
    const lobby = useLobbyStore.getState();
    const platforms = usePolyChatStore.getState().platforms;
    return {
        type: "state",
        lobby: {
            status: lobby.status,
            participantCount: lobby.participants.length,
            capacity: lobby.capacity,
            excluded: lobby.excludedIds,
        },
        connections: Object.fromEntries(ALL_PLATFORMS.map((p) => [
            p,
            platforms[p].status !== "connected" ? "off" : isFakeConnection(p) ? "fake" : "real",
        ])),
        game: buildGameState(),
    };
}

/** Unity 미니게임 진행 상태 (시뮬레이터가 입력 시점을 알 수 있게) */
function buildGameState() {
    const rgf = useRgfStore.getState();
    const session = useSessionStore.getState();
    return {
        status: rgf.status,
        phase: rgf.phase,
        gameName: rgf.gameName,
        practice: rgf.practice,
        round: session.round,
        survivorCount: session.survivors.length,
        forwardedInputs: rgf.forwardedInputs,
    };
}

function handle(message: IncomingMessage) {
    if (message.type === "chat" && isChat(message)) sendChat(message.platform, message.nickname, message.content);
    else if (message.type === "batch" && Array.isArray(message.messages)) {
        message.messages.filter(isChat).forEach((m) => sendChat(m.platform, m.nickname, m.content));
    } else if (message.type === "fakeConnection" && Array.isArray(message.platforms)) {
        setFakeConnection(message.platforms.filter((p) => ALL_PLATFORMS.includes(p)));
    }
}

/** 시뮬레이터에 접속하고 끊기면 다시 시도한다. 반환한 함수로 정리한다. */
export function connectSimulator(onConnectedChange: (connected: boolean) => void): () => void {
    let ws: WebSocket | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let stateTimer: ReturnType<typeof setTimeout> | undefined;
    let retryDelay = 2000;
    let stopped = false;

    const sendNow = () => {
        stateTimer = undefined;
        if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(buildState()));
    };
    // 부하 테스트 중에는 상태가 초당 수백 번 바뀌므로 200ms마다 한 번만 보낸다.
    const scheduleState = () => {
        stateTimer ??= setTimeout(sendNow, 200);
    };

    const open = () => {
        const socket = new WebSocket(SIMULATOR_URL);
        ws = socket;
        socket.onopen = () => {
            retryDelay = 2000;
            onConnectedChange(true);
            socket.send(JSON.stringify({ type: "hello", app: "galashow-client", url: window.location.href }));
            sendNow();
        };
        socket.onmessage = (event) => {
            try {
                handle(JSON.parse(String(event.data)));
            } catch {
                // 잘못된 메시지는 무시한다.
            }
        };
        socket.onclose = () => {
            if (ws === socket) ws = null;
            onConnectedChange(false);
            if (stopped) return;
            // 시뮬레이터가 꺼져 있으면 점점 느리게(최대 15초) 다시 시도한다.
            retryTimer = setTimeout(open, retryDelay);
            retryDelay = Math.min(retryDelay * 1.5, 15000);
        };
    };

    const unsubscribeLobby = useLobbyStore.subscribe(scheduleState);
    const unsubscribeChat = usePolyChatStore.subscribe(scheduleState);
    const unsubscribeRgf = useRgfStore.subscribe(scheduleState);
    const unsubscribeSession = useSessionStore.subscribe(scheduleState);
    open();

    return () => {
        stopped = true;
        clearTimeout(retryTimer);
        clearTimeout(stateTimer);
        unsubscribeLobby();
        unsubscribeChat();
        unsubscribeRgf();
        unsubscribeSession();
        ws?.close();
    };
}
