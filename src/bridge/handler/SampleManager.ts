import {unityService} from "../unityService";
import type {BridgeHandler} from "./MainHandler";

const NS = "SampleManager" as const;
const R = {
    ChangeSphereColor: `${NS}_ChangeSphereColor`, // NTY
    ChangeBorderColor: `${NS}_ChangeBorderColor`, // NTY
    CalculateAdd: `${NS}_CalculateAdd`, // REQ/ACK
    CalculateMultiply: `${NS}_CalculateMultiply`, // REQ/ACK
} as const;


export const API = {
    // R2U_SampleManager_ChangeSphereColor_NTY
    changeSphereColor(color: string) {
        return unityService.sendNty(R.ChangeSphereColor, {color});
    },
    // R2U_SampleManager_CalculateAdd_REQ
    async calculateAdd(a: number, b: number) {
        return unityService.sendReq<{ a: number, b: number }, { result: number }>(R.CalculateAdd, {a, b});
    },
    // R2U_SampleManager_CalculateMultiply_ACK
    async calculateMultiply(a: number, b: number) {
        return unityService.sendReq<{ a: number, b: number }, { result: number }>(R.CalculateMultiply, {a, b});
    },
};

/**
 * Unity→React 수신 처리 핸들러 구현 예시
 */
export const SampleManagerHandler: BridgeHandler = {
    namespace: NS,

    // Unity에서 REQ가 오면 여기서 처리 후, 그 결과를 ACK로 보냅니다.
    async onRequest(action, data: any) {
        switch (action) {
            case "CalculateMultiply": {
                const {a, b} = data as { a: number; b: number };
                return {result: Number(a) * Number(b)};
            }
            default:
                throw new Error(`Unknown request action: ${action}`);
        }
    },

    // Unity에서 NTY가 오면(예: 색상 변경 통지) React 단 처리
    async onNotify(action, data: any) {
        switch (action) {
            case "ChangeBorderColor":
                console.log("[NTY] Border color changed:", data?.color);
                break;
            default:
                throw new Error(`Unknown onNotify action: ${action}`);
        }
    },

    // (선택) React→Unity로 보낸 REQ의 ACK를 핸들러 차원에서도 듣고 싶다면 사용
    async onAck(action, data: any) {
        switch (action) {
            case "CalculateAdd":
                console.log("[ACK] Border color changed:", data?.result);
                break;
            default:
                throw new Error(`Unknown onNotify action: ${action}`);
        }
    },
};