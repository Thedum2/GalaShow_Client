import {useCallback, useEffect, useState} from 'react';
import {useUnityContext} from 'react-unity-webgl';
import {UnityService} from './unityService';
import {MessageLog, UnityContextConfig, UnityMessage, UnityRoute} from './unity';

const unityConfig: UnityContextConfig = {
    loaderUrl: './build/unity/WebGL.loader.js',
    dataUrl: './build/unity/WebGL.data',
    frameworkUrl: './build/unity/WebGL.framework.js',
    codeUrl: './build/unity/WebGL.wasm',
};

export const useUnity = () => {
    const [messages, setMessages] = useState<MessageLog[]>([]);
    const [unityService] = useState(() => new UnityService());

    const {
        unityProvider,
        isLoaded,
        loadingProgression,
        sendMessage,
        addEventListener,
        removeEventListener,
    } = useUnityContext({
        loaderUrl: unityConfig.loaderUrl,
        dataUrl: unityConfig.dataUrl,
        frameworkUrl: unityConfig.frameworkUrl,
        codeUrl: unityConfig.codeUrl,
    } as any);

    useEffect(() => {
        const on = (event: string, handler: any) => {
            if (typeof addEventListener === 'function') addEventListener(event, handler);
            else if ((unityProvider as any)?.on) (unityProvider as any).on(event, handler);
        };
        const off = (event: string, handler: any) => {
            if (typeof removeEventListener === 'function') removeEventListener(event, handler);
            else if ((unityProvider as any)?.removeEventListener) (unityProvider as any).removeEventListener(event, handler);
            else if ((unityProvider as any)?.off) (unityProvider as any).off(event, handler);
        };

        const handleU2R = (raw: unknown) => {
            try {
                const payload = typeof raw === 'string' ? (JSON.parse(raw) as UnityMessage) : (raw as UnityMessage);
                const log: MessageLog = {
                    id: `u2r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                    direction: 'U2R',
                    type: (payload.type as any) || 'NTY',
                    route: payload.route || 'unknown',
                    data: payload.data,
                    timestamp: Date.now(),
                    status: 'success',
                } as any;
                setMessages((prev) => [...prev, log]);

                (unityService as any).eventListeners?.get?.('U2R')?.(payload);
            } catch (e) {
                console.error('Unity 메시지 파싱 실패:', e, raw);
            }
        };

        on('U2R', handleU2R);

        unityService.setSendMessage((go, method, param) => {
            if (typeof sendMessage === 'function') {
                sendMessage(go, method, param);
            } else if ((unityProvider as any)?.sendMessage) {
                (unityProvider as any).sendMessage(go, method, param);
            } else if ((unityProvider as any)?.send) {
                (unityProvider as any).send(go, method, param);
            }
        });

        return () => {
            off('U2R', handleU2R);
        };
    }, [addEventListener, removeEventListener, unityProvider, sendMessage, unityService]);

    const sendRequest = useCallback(
        async (route: UnityRoute, data: any) => {
            if (!isLoaded) throw new Error('Unity가 아직 로드되지 않았습니다.');
            const id = `r2u_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

            setMessages((prev) => [
                ...prev,
                {
                    id,
                    direction: 'R2U',
                    type: 'REQ',
                    route,
                    data,
                    timestamp: Date.now(),
                    status: 'pending',
                } as any,
            ]);

            try {
                const res = await unityService.sendRequest(route, data);
                setMessages((prev) => prev.map((m) => (m.id === id ? {...m, status: 'success'} as any : m)));
                return res;
            } catch (e) {
                setMessages((prev) => prev.map((m) => (m.id === id ? {...m, status: 'error'} as any : m)));
                throw e;
            }
        },
        [isLoaded, unityService]
    );

    const sendNotification = useCallback(
        (route: UnityRoute, data: any) => {
            if (!isLoaded) return console.warn('Unity가 아직 로드되지 않았습니다.');
            setMessages((prev) => [
                ...prev,
                {
                    id: `r2u_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                    direction: 'R2U',
                    type: 'NTY',
                    route,
                    data,
                    timestamp: Date.now(),
                    status: 'success',
                } as any,
            ]);
            unityService.sendNotification(route, data);
        },
        [isLoaded, unityService]
    );

    useEffect(() => {
        if (messages.length > 100) setMessages((prev) => prev.slice(-50));
    }, [messages.length]);

    return {
        unityProvider,
        isLoaded,
        loadingProgression,
        sendRequest,
        sendNotification,
        messages,
        clearMessages: () => setMessages([]),
        unityService,
    };
};