import type {UnityMessage} from "../unityConfig";
import {splitRoute} from "../unityConfig";

export type ReqHandler = (action: string, data: any) => Promise<any> | any;
export type NtyHandler = (action: string, data: any) => Promise<void> | void;
export type AckHandler = (action: string, data: any) => Promise<void> | void;

export interface BridgeHandler {
    route: string;
    onRequest?: ReqHandler;
    onNotify?: NtyHandler;
    onAck?: AckHandler;
}

class MainHandlerRegistry {
    private handlers = new Map<string, BridgeHandler>();

    register(handler: BridgeHandler) {
        this.handlers.set(handler.route, handler);
    }

    unregister(namespace: string) {
        this.handlers.delete(namespace);
    }

    async handleIncomingRequest(envelope: UnityMessage): Promise<any> {
        const {namespace, action} = splitRoute(envelope.route);
        const h = this.handlers.get(namespace);
        if (!h?.onRequest) throw new Error(`No request handler for ${namespace}`);
        return await h.onRequest(action, envelope.data);
    }

    async handleIncomingNotify(envelope: UnityMessage): Promise<void> {
        const {namespace, action} = splitRoute(envelope.route);
        const h = this.handlers.get(namespace);
        if (h?.onNotify) await h.onNotify(action, envelope.data);
    }

    async handleIncomingAck(envelope: UnityMessage): Promise<void> {
        const {namespace, action} = splitRoute(envelope.route);
        const h = this.handlers.get(namespace);
        if (h?.onAck) await h.onAck(action, envelope.data);
    }
}

export const MainHandler = new MainHandlerRegistry();