import {useEffect} from "react";
import {useUnityContext} from "react-unity-webgl";
import {UNITY_BUILD} from "./unityConfig";
import {unityService} from "./unityService";
import {ReactUnityEventParameter} from "react-unity-webgl/distribution/types/react-unity-event-parameters";

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

    useEffect(() => {
        if (!isLoaded) return;

        const transport = {
            send: (text: string) => {
                sendMessage("BridgeManager", "ReceiveMessage", text);
            },
            subscribe: (fn: (text: string) => void) => {
                addEventListener("BridgeMessage", (...parameters: ReactUnityEventParameter[]) => {
                    const text = parameters[0] as string;
                    fn(text);
                });
                return () => removeEventListener("BridgeMessage", (...parameters: ReactUnityEventParameter[]) => {
                    const text = parameters[0] as string;
                    fn(text);
                });

            },
        };

        unityService.init(transport);
        return () => unityService.dispose();
    }, [isLoaded, sendMessage, addEventListener, removeEventListener]);

    return {unityProvider, isLoaded, loadingProgression, bridge: unityService};
}