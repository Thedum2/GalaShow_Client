export interface UnityMessage {
    ok: boolean;
    data: any;
    type: MessageSendType;
    route: string;
    id: string;
    ref?: string;
    timestamp: number;
    status?: 'pending' | 'success' | 'error';
    direction?: 'R2U' | 'U2R';
}

export type MessageSendType = 'REQ' | 'ACK' | 'NTY';

interface UnityContextConfig {
    loaderUrl: string;
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
}

export const unityConfig: UnityContextConfig = {
    loaderUrl: './build/unity/WebGL.loader.js',
    dataUrl: './build/unity/WebGL.data',
    frameworkUrl: './build/unity/WebGL.framework.js',
    codeUrl: './build/unity/WebGL.wasm',
};

export type UnityRoute = 'SampleManager_HelloWorld';