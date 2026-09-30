// 게임(Client) 페이지와 시뮬레이터를 잇는 로컬 WebSocket 서버. Electron 없이 테스트할 수 있게 분리했다.
//
// 프로토콜 (JSON 한 줄)
//   시뮬레이터 → Client
//     { type: "chat", platform, nickname, content }        가짜 채팅 1건
//     { type: "batch", messages: [{ platform, nickname, content }] }  여러 건(부하 테스트)
//     { type: "fakeConnection", platforms: ["chzzk", ...] }  채팅 연결 흉내 대상
//   Client → 시뮬레이터
//     { type: "hello", app: "galashow-client", url }
//     { type: "state", lobby: { status, participantCount, capacity, excluded }, connections }
const { WebSocketServer } = require("ws");

const DEFAULT_PORT = 47800;
const PLATFORMS = ["chzzk", "soop", "youtube"];
const OUTGOING_TYPES = ["chat", "batch", "fakeConnection"];

// 로컬 개발 서버와 GalaShow 개발 배포만 접속을 허용한다.
const ALLOWED_ORIGINS = [
    /^http:\/\/localhost(:\d+)?$/,
    /^http:\/\/127\.0\.0\.1(:\d+)?$/,
    /^https:\/\/([a-z0-9-]+\.)*galashow\.cloud$/,
];

const isAllowedOrigin = (origin) => typeof origin === "string" && ALLOWED_ORIGINS.some((re) => re.test(origin));

const isChat = (m) =>
    m && PLATFORMS.includes(m.platform) && typeof m.nickname === "string" && m.nickname.trim() &&
    m.nickname.length <= 100 && typeof m.content === "string" && m.content.length <= 500;

/** 시뮬레이터 UI가 보내는 메시지를 검증한다. 잘못된 메시지는 null. */
function validateOutgoing(message) {
    if (!message || !OUTGOING_TYPES.includes(message.type)) return null;
    if (message.type === "chat") return isChat(message) ? message : null;
    if (message.type === "batch") {
        return Array.isArray(message.messages) && message.messages.length <= 5000 && message.messages.every(isChat) ? message : null;
    }
    return Array.isArray(message.platforms) && message.platforms.every((p) => PLATFORMS.includes(p)) ? message : null;
}

/**
 * @param {{ port?: number, host?: string, onStatus?: (s) => void, onState?: (s) => void }} options
 */
function createSimulatorServer({ port = DEFAULT_PORT, host = "127.0.0.1", onStatus = () => {}, onState = () => {} } = {}) {
    const clients = new Map(); // ws -> { url, origin }
    let error = "";
    let listening = false;

    const status = () => ({
        port,
        listening,
        error,
        clients: [...clients.values()].map((c) => ({ url: c.url, origin: c.origin })),
    });
    const emitStatus = () => onStatus(status());

    const wss = new WebSocketServer({
        port,
        host,
        maxPayload: 64 * 1024,
        verifyClient: ({ origin }) => isAllowedOrigin(origin),
    });

    wss.on("listening", () => {
        listening = true;
        error = "";
        emitStatus();
    });
    wss.on("error", (e) => {
        listening = false;
        error = e.code === "EADDRINUSE" ? `포트 ${port}를 이미 사용 중입니다. 시뮬레이터가 이미 실행 중인지 확인하세요.` : e.message;
        emitStatus();
    });
    wss.on("connection", (ws, req) => {
        clients.set(ws, { url: "", origin: req.headers.origin });
        emitStatus();
        ws.on("message", (data) => {
            let message;
            try { message = JSON.parse(String(data)); } catch { return; }
            if (message?.type === "hello") {
                clients.set(ws, { url: String(message.url ?? "").slice(0, 300), origin: req.headers.origin });
                emitStatus();
            } else if (message?.type === "state") {
                onState(message);
            }
        });
        ws.on("close", () => {
            clients.delete(ws);
            emitStatus();
        });
    });

    return {
        status,
        /** 접속한 모든 게임 페이지에 보낸다. 보낸 페이지 수를 반환(검증 실패 시 -1). */
        send(message) {
            const valid = validateOutgoing(message);
            if (!valid) return -1;
            const payload = JSON.stringify(valid);
            let sent = 0;
            for (const ws of clients.keys()) {
                if (ws.readyState === ws.OPEN) {
                    ws.send(payload);
                    sent++;
                }
            }
            return sent;
        },
        close: () => new Promise((resolve) => {
            for (const ws of clients.keys()) ws.terminate();
            wss.close(() => resolve());
        }),
    };
}

module.exports = { createSimulatorServer, validateOutgoing, isAllowedOrigin, DEFAULT_PORT };
