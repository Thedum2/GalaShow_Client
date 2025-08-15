import {useCallback, useEffect, useState} from 'react';
import {useUnityContext} from 'react-unity-webgl';
import {UnityService} from './unityService';
import {unityConfig, UnityMessage, UnityRoute} from './unityConfig';

export const useUnity = () => {
    const [messages, setMessages] = useState<UnityMessage[]>([]);
    const [unityService] = useState(() => new UnityService());

    const {
        unityProvider,
        isLoaded,
        loadingProgression,
        sendMessage,
        addEventListener,
        removeEventListener,
    } = useUnityContext(unityConfig);

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

        unityService.setSendMessage((go, method, param) => {
            if (typeof sendMessage === 'function') {
                sendMessage(go, method, param);
            } else if ((unityProvider as any)?.sendMessage) {
                (unityProvider as any).sendMessage(go, method, param);
            } else if ((unityProvider as any)?.send) {
                (unityProvider as any).send(go, method, param);
            }
        });

        const handleU2R = (raw: unknown) => {
            try {
                const payload = typeof raw === 'string' ? (JSON.parse(raw) as UnityMessage) : (raw as UnityMessage);
                const messageWithStatus: UnityMessage = {
                    ...payload,
                    id: payload.id || `u2r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                    direction: 'U2R',
                    status: 'success'
                };

                setMessages((prev) => [...prev, messageWithStatus]);
                const handler = (unityService as any).eventListeners?.get?.('U2R');
                if (handler) handler(payload);

            } catch (e) {
                console.error('Unity 메시지 파싱 실패:', e, raw);
            }
        };

        on('U2R', handleU2R);
        return () => {
            off('U2R', handleU2R);
        };
    }, [addEventListener, removeEventListener, unityProvider, sendMessage, unityService]);

    const sendRequest = useCallback(
        async (route: UnityRoute, data: any) => {
            if (!isLoaded) throw new Error('Unity Not Loaded');
            const message = unityService.createMessage('REQ', route, data);
            const messageWithStatus: UnityMessage = {
                ...message,
                direction: 'R2U',
                status: 'pending'
            };

            setMessages((prev) => [...prev, messageWithStatus]);

            try {
                const res = await unityService.sendRequest(message);
                setMessages((prev) => prev.map((m) =>
                    m.id === message.id ? {...m, status: 'success'} : m
                ));
                return res;
            } catch (e) {
                setMessages((prev) => prev.map((m) =>
                    m.id === message.id ? {...m, status: 'error'} : m
                ));
                throw e;
            }
        },
        [isLoaded, unityService]
    );

    const sendNotification = useCallback(
        (route: UnityRoute, data: any) => {
            if (!isLoaded) {
                console.warn('Unity Not Loaded');
                return;
            }
            const message = unityService.createMessage('NTY', route, data);
            const messageWithStatus: UnityMessage = {
                ...message,
                direction: 'R2U',
                status: 'success'
            };

            setMessages((prev) => [...prev, messageWithStatus]);
            unityService.sendNotification(message);
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