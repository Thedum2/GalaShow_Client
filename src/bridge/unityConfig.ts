import {v4 as uuidv4} from "uuid";

export type Direction = "U2R" | "R2U"; // Unity→React, React→Unity
export type MsgType = "REQ" | "ACK" | "NTY";
export type StatusType = "success" | "In progress" | "fail";

export interface UnityMessage<T = any> {
    ok: boolean;
    type: MsgType;
    route: string; // e.g. "SampleManager_CalculateAdd"
    id: string; // e.g. "r2u_80ce..._1755419288448_1"
    data: T;
    timestamp: number;
}

export interface UnityFrame<T = any> {
    topic: string; // e.g. "R2U_SampleManager_CalculateAdd_REQ"
    payload: UnityMessage<T>;
}

/**
 * Unity WebGL Build 위치(예시). 실제 프로젝트에 맞게 수정하세요.
 */
export const UNITY_BUILD = {
    loaderUrl: "/build/unity/WebGL.loader.js",
    dataUrl: "/build/unity/WebGL.data",
    frameworkUrl: "/build/unity/WebGL.framework.js",
    codeUrl: "/build/unity/WebGL.wasm",
} as const;

/**
 * topic 문자열 생성.
 */
export function toTopic(direction: Direction, route: string, type: MsgType) {
    return `${direction}_${route}_${type}`;
}

/**
 * direction 문자열에서 id prefix를 구함.
 */
export function dirToPrefix(direction: Direction) {
    return direction.toLowerCase() as "u2r" | "r2u";
}

/**
 * 메시지 id 생성기: "u2r|r2u_uuid_timestamp_seq"
 */
const seq: Record<"u2r" | "r2u", number> = {u2r: 0, r2u: 0};

export function makeId(direction: Direction) {
    const prefix = dirToPrefix(direction);
    seq[prefix] += 1;
    return `${prefix}_${uuidv4()}_${Date.now()}_${seq[prefix]}`;
}

/**
 * UnityFrame 직렬화: `topic\n{json}` 형태로 합쳐 전송.
 */
export function serializeFrame(frame: UnityFrame): string {
    return `${frame.topic}\n${JSON.stringify(frame.payload)}`;
}

/**
 * UnityFrame 역직렬화. 실패 시 null 반환.
 */
export function parseFrame(raw: string): UnityFrame | null {
    const [topic, ...rest] = raw.split(/\r?\n/);
    if (!topic || rest.length === 0) return null;
    try {
        const payload = JSON.parse(rest.join("\n")) as UnityMessage;
        return {topic, payload};
    } catch (err) {
        console.warn("[bridge] parseFrame error:", err);
        return null;
    }
}

/**
 * route를 "Namespace_Action" 으로 가정하고 분리.
 */
export function splitRoute(route: string): { namespace: string; action: string } {
    const idx = route.indexOf("_");
    if (idx === -1) return {namespace: route, action: ""};
    return {namespace: route.slice(0, idx), action: route.slice(idx + 1)};
}

/**
 * 기본 Envelope 생성 유틸.
 */
export function makeEnvelope<T>(
    direction: Direction,
    type: MsgType,
    route: string,
    data: T,
    id?: string,
): UnityMessage<T> {
    return {
        ok: true,
        type,
        route,
        id: id ?? makeId(direction),
        data,
        timestamp: Date.now(),
    };
}
