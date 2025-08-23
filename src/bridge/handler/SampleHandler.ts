import type { BridgeHandler } from "./MainHandler";
import { unityService } from "../unityService";
import { UIBus } from "../unityConfig";

export const SampleApi = {
    changeSphereColor(color: string) {
        return unityService.sendNty("SampleHandler_ChangeSphereColor", { color });
    },
    calculateAdd(a: number, b: number, onAck: (ack: { result: number }) => void, onError?: (err: any) => void) {
        unityService.sendReq("SampleHandler_CalculateAdd", { a, b }).then(onAck).catch(onError ?? (() => {}));
    },
};

export const SampleHandler: BridgeHandler = {
    route: "SampleHandler",
    async onRequest(action, data) {
        if (typeof window !== "undefined") {
            window.postMessage({ type: "REQ", route: `SampleHandler_${action}`, data, direction: "U2R" }, "*");
        }
        if (action === "CalculateMultiply") {
            const result = data.a * data.b;
            if (typeof window !== "undefined") {
                window.postMessage({ type: "ACK", route: `SampleHandler_${action}`, data: { result }, direction: "U2R" }, "*");
            }
            return { result };
        }
    },
    onNotify(action, data) {
        if (action === "ChangeBorderColor") {
            UIBus.changeBorderColor(data.color);
        }
        if (typeof window !== "undefined") {
            window.postMessage({ type: "NTY", route: `SampleHandler_${action}`, data, direction: "U2R" }, "*");
        }
    },
    onAck(action, data) {
        if (typeof window !== "undefined") {
            window.postMessage({ type: "ACK", route: `SampleHandler_${action}`, data, direction: "U2R" }, "*");
        }
    },
};
