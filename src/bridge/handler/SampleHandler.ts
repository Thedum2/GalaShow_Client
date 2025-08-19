import type {BridgeHandler} from "./MainHandler";
import {unityService} from "@/bridge/unityService";

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
        switch (action) {

        }
    },

    onNotify(action, data) {
        switch (action) {

        }
    },

    onAck(action, data) {

    },
};