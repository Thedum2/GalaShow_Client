import {UnityMessage, UnityRoute} from './unity';

export class UnityService {
    private sendMessage?: (gameObject: string, methodName: string, parameter: string) => void;
    private eventListeners: Map<string, (message: UnityMessage) => void> = new Map();

    constructor() {
        this.setupGlobalEventHandler();
    }

    setSendMessage(sendMessageFn: (gameObject: string, methodName: string, parameter: string) => void) {
        this.sendMessage = sendMessageFn;
    }

    sendRequest(route: UnityRoute, data: any): Promise<UnityMessage> {
        return new Promise((resolve, reject) => {
            if (!this.sendMessage) {
                reject(new Error('Unity가 연결되지 않았습니다.'));
                return;
            }

            const messageId = this.generateMessageId();
            const message: UnityMessage = {
                ok: true,
                type: 'REQ',
                route,
                id: messageId,
                data,
                timestamp: Date.now()
            };

            const responseHandler = (response: UnityMessage) => {
                if (response.type === 'ACK' && response.ref === messageId) {
                    this.removeEventListener('U2R', responseHandler);
                    if (response.ok) {
                        resolve(response);
                    } else {
                        reject(new Error(`Unity 처리 실패: ${JSON.stringify(response.data)}`));
                    }
                }
            };

            this.addEventListener('U2R', responseHandler);

            try {
                this.sendMessage('CommunicationManager', 'ReceiveFromReact', JSON.stringify(message));
            } catch (error) {
                this.removeEventListener('U2R', responseHandler);
                reject(error);
            }

            setTimeout(() => {
                this.removeEventListener('U2R', responseHandler);
                reject(new Error('Unity 응답 타임아웃'));
            }, 10000);
        });
    }

    sendNotification(route: UnityRoute, data: any): void {
        if (!this.sendMessage) {
            console.error('Unity가 연결되지 않았습니다.');
            return;
        }

        const message: UnityMessage = {
            ok: true,
            type: 'NTY',
            route,
            id: this.generateMessageId(),
            data,
            timestamp: Date.now()
        };

        try {
            this.sendMessage('CommunicationManager', 'ReceiveFromReact', JSON.stringify(message));
        } catch (error) {
            console.error('Unity 알림 전송 실패:', error);
        }
    }

    addEventListener(eventName: string, handler: (message: UnityMessage) => void): void {
        const listeners = this.eventListeners.get(eventName) || [];
        this.eventListeners.set(eventName, handler);
    }

    removeEventListener(eventName: string, handler: (message: UnityMessage) => void): void {
        this.eventListeners.delete(eventName);
    }

    createSampleData(message: string = 'Hello from React!'): any {
        return {
            name: 'giene',
            age: 20,
            message,
            timestamp: new Date().toISOString(),
            browserInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform
            }
        };
    }

    createUserActionData(action: string, target: string): any {
        return {
            type: 'user_action',
            action,
            target,
            timestamp: new Date().toISOString(),
            windowSize: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    private setupGlobalEventHandler(): void {
        (window as any).unityReactHandler = (eventName: string, messageData: UnityMessage) => {
            const handler = this.eventListeners.get(eventName);
            if (handler) {
                handler(messageData);
            }
        };
    }

    private generateMessageId(): string {
        return `react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}