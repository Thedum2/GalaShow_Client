import {v4 as uuidv4} from "uuid";
import {Direction, UnityMsgType} from "@/types/bridge";



export const DEFAULT_TIMEOUT_MS = 10_000;

export interface UnityMessage<T = any> {
    ok: boolean;
    type: UnityMsgType;
    route: string;
    id: string;
    data: T;
    timestamp: string;
}

export const UNITY_BUILD = {
    loaderUrl: "/build/unity/WebGL.loader.js",
    dataUrl: "/build/unity/WebGL.data",
    frameworkUrl: "/build/unity/WebGL.framework.js",
    codeUrl: "/build/unity/WebGL.wasm",
} as const;


export function parseUnityMessage(raw: string): UnityMessage | null {
    try {
        const parsed = JSON.parse(raw);

        return {
            ok: parsed.ok,
            type: parsed.type as UnityMsgType,
            route: parsed.route,
            id: parsed.id,
            data: parsed.data,
            timestamp: parsed.timestamp,
        };
    } catch (error) {
        console.error('[parseUnityMessage] JSON parse error:', error);
        return null;
    }
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

export function splitRoute(route: string): { namespace: string; action: string } {
    const idx = route.indexOf("_");
    if (idx === -1) return {namespace: route, action: ""};
    return {namespace: route.slice(0, idx), action: route.slice(idx + 1)};
}

export function makeEnvelope<T>(
    direction: Direction,
    type: UnityMsgType,
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
        timestamp: Date.now().toString(),
    };
}


//====================================================

let _changeBorderColorCallback: (color: string) => void = () => {
};

export const UIBus = {
    onBorderColorChange: (callback: (color: string) => void) => {
        _changeBorderColorCallback = callback;
    },
    changeBorderColor: (color: string) => {
        _changeBorderColorCallback(color);
    }
};

