export interface UnityMessage {
    ok: boolean;
    data: any;
    type?: 'REQ' | 'ACK' | 'NTY';
    route?: string;
    id?: string;
    ref?: string;
    timestamp?: number;
}

export interface MessageLog {
    id: string;
    direction: 'R2U' | 'U2R';
    type: 'REQ' | 'ACK' | 'NTY';
    route: string;
    data: any;
    timestamp: number;
    status?: 'pending' | 'success' | 'error';
}

export interface UnityContextConfig {
    loaderUrl: string;
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
}

export interface PerformanceInfo {
    fps: number;
    memoryUsage: number;
    qualityLevel: number;
    targetFrameRate: number;
}

export type UnityRoute =
    | 'SampleModule_HelloWorld'
    | 'GameManager_PlayerAction'
    | 'UIManager_UpdateInterface'
    | 'SceneManager_LoadScene'
    | 'Unity_GameState_Update'
    | 'Unity_System_Ready'
    | 'React_UserAction_Notify';

