import type { BridgeHandler } from "./MainHandler";
import { unityService } from "../unityService";

export const SampleApi = {
    changeSphereColor(color: string) {
        return unityService.sendNty("SampleHandler_ChangeSphereColor", { color });
    },
    calculateAdd(a: number, b: number) {
        return unityService.sendReq("SampleHandler_CalculateAdd", { a, b });
    },
};

export const SampleHandler: BridgeHandler = {
    route: "SampleHandler",

    async onRequest(action, data) {
        if (action === "CalculateMultiply") {
        }
    },
    onNotify(action, data) {
        if (action === "ChangeBorderColor") {
        }
    },
    onAck(action, data) {
        // No-op for now
    },
};
