export type Direction = "U2R" | "R2U";
export type UnityMsgType = "REQ" | "ACK" | "NTY";
export type LocalStatus = "pending" | "success" | "error";
export type StatusType = "success" | "In progress" | "fail";

export interface UnityMsg {
    id: number;
    type: UnityMsgType;
    route: string;
    data: any;
    direction: Direction;
    status?: LocalStatus;
}

export interface UnityTransport {
    send: (text: string) => void;
    subscribe: (fn: (text: string) => void) => () => void;
}