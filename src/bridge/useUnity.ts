import {useEffect, useMemo, useRef} from "react";
import {useUnityContext} from "react-unity-webgl";
import {UNITY_BUILD} from "./unityConfig";
import {unityService} from "@/bridge/unityService";
import {UnityTransport} from "@/types/bridge";
export function useUnity() {
    const {
        unityProvider,
        addEventListener,
        removeEventListener,
        sendMessage,
        isLoaded,
        loadingProgression,
    } = useUnityContext({
        loaderUrl: UNITY_BUILD.loaderUrl,
        dataUrl: UNITY_BUILD.dataUrl,
        frameworkUrl: UNITY_BUILD.frameworkUrl,
        codeUrl: UNITY_BUILD.codeUrl,
    });

    const sendRef = useRef(sendMessage);
    useEffect(() => {
        sendRef.current = sendMessage;
    }, [sendMessage]);

    const transport: UnityTransport = useMemo(() => {
        return {
            send: (text: string) => {
                console.log("[handler] send ←", text);
                sendRef.current("BridgeManager", "ReceiveMessage", text);
            },
            subscribe: (fn: (text: string) => void) => {
                const handler = (raw: any) => {
                    const text = typeof raw === "string" ? raw : (() => {
                        try {
                            return JSON.stringify(raw);
                        } catch {
                            return String(raw);
                        }
                    })();
                    console.log("[handler] onUnityMessage ←", text);
                    fn(text);
                };
                addEventListener("onUnityMessage", handler);
                return () => removeEventListener("onUnityMessage", handler);
            },
        };
    }, [addEventListener, removeEventListener]);

    useEffect(() => {
        unityService.init(transport);
        console.log("[bridge] init()");
        return () => {
            unityService.dispose();
            console.log("[bridge] dispose()");
        };
    }, [transport]);

    return {unityProvider, isLoaded, loadingProgression, bridge: unityService};
}
