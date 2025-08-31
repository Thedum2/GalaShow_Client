import {DEFAULT_TIMEOUT_MS, makeEnvelope, parseUnityMessage, UnityMessage,} from "./unityConfig";
import {MainHandler} from "./handler/MainHandler";
import {Direction, UnityTransport} from "@/types/bridge";

class UnityBridgeService {
    private transport: UnityTransport | null = null;
    private unsubscribe: (() => void) | null = null;
    private subscribers = new Set<(msg: UnityMessage, direction: Direction) => void>();

    private pending = new Map<string, {
        resolve: (data: any) => void;
        reject: (err: any) => void;
        timer: any;
    }>();

    subscribe(callback: (msg: UnityMessage, direction: Direction) => void): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    init(transport: UnityTransport) {
        if (this.transport) return;
        this.transport = transport;
        this.unsubscribe = transport.subscribe(this.onUnityMessage);
        console.log("[bridge] UnityBridgeService initialized");
    }

    dispose() {
        this.pending.forEach(p => clearTimeout(p.timer));
        this.pending.clear();
        this.subscribers.clear();
        if (this.unsubscribe) this.unsubscribe();
        this.unsubscribe = null;
        this.transport = null;
        console.log("[bridge] UnityBridgeService disposed");
    }

    sendReq<TReq = any, TAck = any>(route: string, data: TReq, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<TAck> {
        const env = makeEnvelope("R2U", "REQ", route, data);
        this.subscribers.forEach(cb => cb(env, "R2U"));
        return new Promise<TAck>((resolve, reject) => {
            if (!this.transport) return reject(new Error("Unity transport not ready"));

            const timer = setTimeout(() => {
                this.pending.delete(env.id);
                reject(new Error(`ACK timeout for ${route} (id=${env.id})`));
            }, timeoutMs);

            this.pending.set(env.id, {resolve: (data: any) => resolve(data as TAck), reject, timer});

            this.transport.send(JSON.stringify(env));
        });
    }

    sendAck<T = any>(route: string, id: string, data: T, ok = true) {

        const env: UnityMessage<T> = {
            ok,
            type: "ACK",
            route,
            id,
            data,
            timestamp: Date.now().toString(),
        };
        this.subscribers.forEach(cb => cb(env, "R2U"));
        if (!this.transport) throw new Error("Unity transport not ready");
        this.transport.send(JSON.stringify(env));
    }

    sendNty<T = any>(route: string, data: T) {
        const env = makeEnvelope("R2U", "NTY", route, data);
        this.subscribers.forEach(cb => cb(env, "R2U"));
        if (!this.transport) throw new Error("Unity transport not ready");
        this.transport.send(JSON.stringify(env));
    }

    public onUnityMessage = async (raw: string) => {
        const payload: UnityMessage | null = parseUnityMessage(raw);

        if (!payload) {
            console.error("[bridge] onUnityMessage invalid message:", raw);
            return;
        }

        this.subscribers.forEach(cb => cb(payload, "U2R"));

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