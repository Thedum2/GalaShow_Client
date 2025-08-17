import {makeEnvelope, parseFrame, serializeFrame, toTopic, UnityFrame, UnityMessage,} from "./unityConfig";
import {MainHandler} from "./handler/MainHandler";


export type UnityTransport = {
    send: (text: string) => void; // Unity 쪽으로 문자열 전송
    subscribe: (fn: (text: string) => void) => () => void; // Unity→React 이벤트 수신 등록/해제
};

/**
 * 10초 타임아웃 기본값
 */
const DEFAULT_TIMEOUT_MS = 10_000;

class UnityBridgeService {
    private transport: UnityTransport | null = null;
    private unsubscribe: (() => void) | null = null;

    // REQ→ACK 매칭용 딕셔너리 (id → resolver)
    private pending = new Map<string, {
        resolve: (data: any) => void;
        reject: (err: any) => void;
        timer: any;
    }>();

    /**
     * Unity와 실제 연결(transport)을 붙이는 초기화 함수.
     */
    init(transport: UnityTransport) {
        if (this.transport) return; // 중복 초기화 방지
        this.transport = transport;
        this.unsubscribe = transport.subscribe(this.onUnityMessage);
        console.log("[bridge] UnityBridgeService initialized");
    }

    /**
     * 언마운트/종료 시 호출.
     */
    dispose() {
        this.pending.forEach(p => clearTimeout(p.timer));
        this.pending.clear();
        if (this.unsubscribe) this.unsubscribe();
        this.unsubscribe = null;
        this.transport = null;
        console.log("[bridge] UnityBridgeService disposed");
    }

    /**
     * React→Unity REQ 전송 및 ACK 대기
     */
    sendReq<TReq = any, TAck = any>(route: string, data: TReq, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<TAck> {
        const env = makeEnvelope("R2U", "REQ", route, data);
        const topic = toTopic("R2U", route, "REQ");
        const frame: UnityFrame = {topic, payload: env};

        return new Promise<TAck>((resolve, reject) => {
            if (!this.transport) return reject(new Error("Unity transport not ready"));

            const timer = setTimeout(() => {
                this.pending.delete(env.id);
                reject(new Error(`ACK timeout for ${route} (id=${env.id})`));
            }, timeoutMs);

            this.pending.set(env.id, {resolve: (data: any) => resolve(data as TAck), reject, timer});

            this.transport.send(serializeFrame(frame));
        });
    }

    /**
     * React→Unity ACK 전송 (Unity에서 보낸 REQ에 대한 응답). id는 반드시 그대로 사용.
     */
    sendAck<T = any>(route: string, id: string, data: T, ok = true) {
        const envelope: UnityMessage<T> = {
            ok,
            type: "ACK",
            route,
            id, // REQ와 동일 id 사용
            data,
            timestamp: Date.now(),
        };
        const topic = toTopic("R2U", route, "ACK");
        const frame: UnityFrame = {topic, payload: envelope};
        if (!this.transport) throw new Error("Unity transport not ready");
        this.transport.send(serializeFrame(frame));
    }

    /**
     * React→Unity NTY 전송 (one-way)
     */
    sendNty<T = any>(route: string, data: T) {
        const env = makeEnvelope("R2U", "NTY", route, data);
        const topic = toTopic("R2U", route, "NTY");
        const frame: UnityFrame = {topic, payload: env};
        if (!this.transport) throw new Error("Unity transport not ready");
        this.transport.send(serializeFrame(frame));
    }

    private onUnityMessage = async (raw: string) => {
        const frame = parseFrame(raw);
        if (!frame) return;
        const {payload} = frame;

        try {
            if (payload.type === "ACK") {
                const p = this.pending.get(payload.id);
                if (p) {
                    clearTimeout(p.timer);
                    this.pending.delete(payload.id);
                    p.resolve(payload.data);
                }
                await MainHandler.handleIncomingAck(payload);
                return;
            }

            if (payload.type === "REQ") {
                try {
                    const ackData = await MainHandler.handleIncomingRequest(payload);
                    this.sendAck(payload.route, payload.id, ackData, true);
                } catch (reqErr: any) {
                    this.sendAck(payload.route, payload.id, {message: String(reqErr?.message ?? reqErr)}, false);
                }
                return;
            }

            if (payload.type === "NTY") {
                await MainHandler.handleIncomingNotify(payload);
                return;
            }
        } catch (err) {
            console.error("[bridge] onUnityMessage error:", err);
        }
    };
}

export const unityService = new UnityBridgeService();
