import type {BridgeHandler} from "./MainHandler";
import {unityService} from "../unityService";
import {UIBus} from "../unityConfig";

export const SampleApi = {
    changeSphereColor(color: string) {
        return unityService.sendNty('SampleHandler_ChangeSphereColor', {color});
    },
    calculateAdd(
        a: number,
        b: number,
        onAck: (ack: { result: number }) => void,
        onError?: (err: any) => void
    ) {
        unityService
            .sendReq('SampleHandler_CalculateAdd', {a, b})
            .then(onAck)
            .catch(onError ?? (() => {
            }));
    },
}
export const SampleHandler: BridgeHandler = {
    route: "SampleHandler",
    async onRequest(action, data) {
        console.log("[SampleHandler] onRequest", action, data);

        if (action == 'CalculateMultiply') {
            const result = data.a * data.b;
            return {result};
        }
    },

    onNotify(action, data) {
        console.log("[SampleHandler] onNotify", action, data);

        if (action === 'ChangeBorderColor') {
            UIBus.changeBorderColor(data.color);   
        }
    },

    onAck(action, data) {
        console.log("[SampleHandler] onAck", action, data);
    },
};