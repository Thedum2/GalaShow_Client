import {v4 as uuidv4} from "uuid";

export type Direction = "U2R" | "R2U";
export type MsgType = "REQ" | "ACK" | "NTY";
export type StatusType = "success" | "In progress" | "fail";


export const DEFAULT_TIMEOUT_MS = 10_000;

export interface UnityMessage<T = any> {
    ok: boolean;
    type: MsgType;
    route: string;
    id: string;
    data: T;
    timestamp: number;
}

export interface UnityFrame<T = any> {
    topic: string;
    payload: UnityMessage<T>;
}

export const UNITY_BUILD = {
    loaderUrl: "/build/unity/WebGL.loader.js",
    dataUrl: "/build/unity/WebGL.data",
    frameworkUrl: "/build/unity/WebGL.framework.js",
    codeUrl: "/build/unity/WebGL.wasm",
} as const;

export function toTopic(direction: Direction, route: string, type: MsgType) {
    return `${direction}_${route}_${type}`;
}

export function dirToPrefix(direction: Direction) {
    return direction.toLowerCase() as "u2r" | "r2u";
}

const seq: Record<"u2r" | "r2u", number> = {u2r: 0, r2u: 0};

export function makeId(direction: Direction) {
    const prefix = dirToPrefix(direction);
    seq[prefix] += 1;
    return `${prefix}_${uuidv4()}_${Date.now()}_${seq[prefix]}`;
}


export function serializeFrame(frame: UnityFrame): string {
    return `${frame.topic}\n${JSON.stringify(frame.payload)}`;
}

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

export function splitRoute(route: string): { namespace: string; action: string } {
    const idx = route.indexOf("_");
    if (idx === -1) return {namespace: route, action: ""};
    return {namespace: route.slice(0, idx), action: route.slice(idx + 1)};
}

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

