import {
    DEFAULT_TIMEOUT_MS,
    makeEnvelope,
    parseFrame,
    serializeFrame,
    toTopic,
    UnityFrame,
    UnityMessage,
} from "./unityConfig";
import {MainHandler} from "./handler/MainHandler";


export type UnityTransport = {
    send: (text: string) => void;
    subscribe: (fn: (text: string) => void) => () => void;
};


class UnityBridgeService {
    private transport: UnityTransport | null = null;
    private unsubscribe: (() => void) | null = null;

    private pending = new Map<string, {
        resolve: (data: any) => void;
        reject: (err: any) => void;
        timer: any;
    }>();

    init(transport: UnityTransport) {
        if (this.transport) return; // 중복 초기화 방지
        this.transport = transport;
        this.unsubscribe = transport.subscribe(this.onUnityMessage);
        console.log("[bridge] UnityBridgeService initialized");
    }

    dispose() {
        this.pending.forEach(p => clearTimeout(p.timer));
        this.pending.clear();
        if (this.unsubscribe) this.unsubscribe();
        this.unsubscribe = null;
        this.transport = null;
        console.log("[bridge] UnityBridgeService disposed");
    }

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
