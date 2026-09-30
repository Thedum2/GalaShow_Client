import type { BridgeHandler } from "./MainHandler";
import { unityService } from "../unityService";
import type {
    RgfAbortRoundReq,
    RgfChatInputNty,
    RgfEvent,
    RgfHostInputNty,
    RgfInitializeAck,
    RgfInitializeReq,
    RgfRegisterPluginAck,
    RgfRegisterPluginReq,
    RgfStartRoundAck,
    RgfStartRoundReq,
} from "@/types/rgf";

type Listener = (event: RgfEvent) => void;
const listeners = new Set<Listener>();

/**
 * Unity RGF 알림 구독. 반환 함수로 해제한다.
 */
export function onRgfEvent(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * React → Unity RGF 호출 (docs/interface.md 5~6절)
 */
export const RgfApi = {
    initialize(data: RgfInitializeReq) {
        return unityService.sendReq<RgfInitializeReq, RgfInitializeAck>("RGFManager_Initialize", data);
    },
    registerPlugin(data: RgfRegisterPluginReq[]) {
        return unityService.sendReq<RgfRegisterPluginReq[], RgfRegisterPluginAck[]>("RGFManager_RegisterPlugin", data);
    },
    startRound(data: RgfStartRoundReq) {
        return unityService.sendReq<RgfStartRoundReq, RgfStartRoundAck>("RGFManager_StartRound", data);
    },
    abortRound(data: RgfAbortRoundReq) {
        return unityService.sendReq("RGFManager_AbortRound", data);
    },
    chatInput(data: RgfChatInputNty) {
        unityService.sendNty("RGFManager_ChatInput", data);
    },
    hostInput(data: RgfHostInputNty) {
        unityService.sendNty("RGFManager_HostInput", data);
    },
};

const KNOWN: RgfEvent["type"][] = [
    "InitializeProgress", "PhaseChanged", "PhaseStarted", "PhaseEnded", "RoundStarted", "RoundCompleted", "PromptOpened", "PromptClosed",
];

export const RGFHandler: BridgeHandler = {
    route: "RGFManager",

    onNotify(action, data) {
        if (!KNOWN.includes(action as RgfEvent["type"])) {
            console.debug("[RGF] unknown notify", action);
            return;
        }
        const event = { type: action, data } as RgfEvent;
        listeners.forEach((listener) => {
            try {
                listener(event);
            } catch (error) {
                console.error("[RGF] listener error", error);
            }
        });
    },
};
