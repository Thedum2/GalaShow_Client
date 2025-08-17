import {MessageSendType, UnityMessage, UnityRoute} from './unityConfig';

export class UnityService {
    private sendMessage?: (gameObject: string, methodName: string, parameter: string) => void;
    private eventListeners: Map<string, (message: UnityMessage) => void> = new Map();
    private messageCounter = 0;
    private enableLogging = true;

    constructor() {
        this.setupGlobalEventHandler();
    }

    setLogging(enabled: boolean) {
        this.enableLogging = enabled;
    }

    sendRequest(message: UnityMessage): Promise<UnityMessage> {
        return new Promise((resolve, reject) => {
            if (!this.sendMessage) {
                reject(new Error('Unity Not Loaded'));
                return;
            }

            this.log('R2U', message);

            const responseHandler = (response: UnityMessage) => {
                if (response.type === 'ACK' && response.ref === message.id) {
                    this.removeEventListener('U2R', responseHandler);
                    if (response.ok) {
                        this.log('U2R', response, 'SUCCESS');
                        resolve(response);
                    } else {
                        this.log('U2R', response, 'ERROR');
                        reject(new Error(`Unity Fail: ${JSON.stringify(response.data)}`));
                    }
                }
            };

            this.addEventListener('U2R', responseHandler);

            try {
                this.sendMessage('BridgeManager', 'ReceiveMessage', JSON.stringify(message));
            } catch (error) {
                this.removeEventListener('U2R', responseHandler);
                this.log('R2U', message, 'ERROR');
                reject(error);
            }

            setTimeout(() => {
                this.removeEventListener('U2R', responseHandler);
                this.log('R2U', message, 'TIMEOUT');
                reject(new Error('Unity 응답 타임아웃'));
            }, 10000);
        });
    }

    setSendMessage(sendMessageFn: (gameObject: string, methodName: string, parameter: string) => void) {
        this.sendMessage = sendMessageFn;
    }

    sendNotification(message: UnityMessage): void {
        if (!this.sendMessage) {
            console.error('Unity Not Loaded');
            return;
        }

        this.log('R2U', message);

        try {
            this.sendMessage('ReactBridge', 'OnReactMessage', JSON.stringify(message));
        } catch (error) {
            this.log('R2U', message, 'ERROR');
            console.error('Unity NTY Failed:', error);
        }
    }

    private log(direction: 'R2U' | 'U2R', message: UnityMessage, status?: 'SUCCESS' | 'ERROR' | 'TIMEOUT') {
        if (!this.enableLogging) return;

        const prefix = direction === 'R2U' ? '[BRIDGE] [REACT TO UNITY]:' : '[BRIDGE] [UNITY TO REACT]:';
        const statusColor = status === 'ERROR' ? 'color: #ff6b6b' :
            status === 'SUCCESS' ? 'color: #51cf66' :
                status === 'TIMEOUT' ? 'color: #ffd43b' :
                    'color: #339af0';

        console.groupCollapsed(`%c${prefix} ${message.type} ${message.route}`, statusColor);
        console.log('Message ID:', message.id);
        console.log('Route:', message.route);
        console.log('Type:', message.type);
        console.log('Data:', message.data);
        console.log('Timestamp:', new Date(message.timestamp).toISOString());
        if (message.ref) console.log('Reference:', message.ref);
        if (status) console.log('Status:', status);
        console.trace('Stack Trace');
        console.groupEnd();
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
            this.log('U2R', messageData);
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