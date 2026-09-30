import {useEffect, useMemo, useRef, useState} from "react";
import {useUnityContext} from "react-unity-webgl";
import {UNITY_BUILD} from "./unityConfig";
import {unityService} from "@/bridge/unityService";
import {UnityTransport} from "@/types/bridge";
/** Ready 알림이 오지 않을 때(이전 빌드) 로딩이 끝난 뒤 이만큼 기다렸다가 Unity 화면을 보인다 */
const READY_FALLBACK_MS = 8000;

export function useUnity() {
    const {
        unityProvider,
        addEventListener,
        removeEventListener,
        sendMessage,
        isLoaded,
        loadingProgression,
        initialisationError,
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

    // Unity 화면 준비: 스플래시가 끝나고 첫 화면을 그리면 Unity가 BridgeManager_Ready를 보낸다.
    // 그 전까지(스플래시 포함) Unity 영역을 로딩 화면으로 가린다. 알림이 없는 이전 빌드는 다른 메시지나 시간 초과로 대신한다.
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (isReady) return;
        const unsubscribe = transport.subscribe(() => setIsReady(true));
        return unsubscribe;
    }, [transport, isReady]);
    useEffect(() => {
        if (!isLoaded || isReady) return;
        const timer = setTimeout(() => setIsReady(true), READY_FALLBACK_MS);
        return () => clearTimeout(timer);
    }, [isLoaded, isReady]);

    useEffect(() => {
        unityService.init(transport);
        console.log("[bridge] init()");
        return () => {
            unityService.dispose();
            console.log("[bridge] dispose()");
        };
    }, [transport]);

    return {unityProvider, isLoaded: isLoaded && isReady, loadingProgression, loadError: initialisationError, bridge: unityService};
}
