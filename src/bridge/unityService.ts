import {MessageSendType, UnityMessage, UnityRoute} from './unityConfig';

export class UnityService {
    private sendMessage?: (gameObject: string, methodName: string, parameter: string) => void;
    private eventListeners: Map<string, (message: UnityMessage) => void> = new Map();
    private messageCounter = 0;

    constructor() {
        this.setupGlobalEventHandler();
    }

    setSendMessage(sendMessageFn: (gameObject: string, methodName: string, parameter: string) => void) {
        this.sendMessage = sendMessageFn;
    }

    sendRequest(message: UnityMessage): Promise<UnityMessage> {
        return new Promise((resolve, reject) => {
            if (!this.sendMessage) {
                reject(new Error('Unity Not Loaded'));
                return;
            }

            const responseHandler = (response: UnityMessage) => {
                if (response.type === 'ACK' && response.ref === message.id) {
                    this.removeEventListener('U2R', responseHandler);
                    if (response.ok) {
                        resolve(response);
                    } else {
                        reject(new Error(`Unity Fail: ${JSON.stringify(response.data)}`));
                    }
                }
            };

            this.addEventListener('U2R', responseHandler);

            try {
                this.sendMessage('ReactBridge', 'ReceiveFromReact', JSON.stringify(message));
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

    sendNotification(message: UnityMessage): void {
        if (!this.sendMessage) {
            console.error('Unity Not Loaded');
            return;
        }

        try {
            this.sendMessage('ReactBridge', 'ReceiveFromReact', JSON.stringify(message));
        } catch (error) {
            console.error('Unity NTY Failed:', error);
        }
    }

    addEventListener(eventName: string, handler: (message: UnityMessage) => void): void {
        this.eventListeners.set(eventName, handler);
    }

    removeEventListener(eventName: string, handler: (message: UnityMessage) => void): void {
        this.eventListeners.delete(eventName);
    }

    createMessage(
        type: MessageSendType,
        route: UnityRoute,
        data: any,
        ref?: string
    ): UnityMessage {
        return {
            ok: true,
            type,
            route,
            id: this.generateMessageId(),
            data,
            timestamp: Date.now(),
            ...(ref && {ref})
        };
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
        this.messageCounter += 1;
        const uuid = crypto.randomUUID();
        const now = Date.now();
        return `r2u_${uuid}_${now}_${this.messageCounter}`;
    }
}