import { Organization } from "../../../../lib/types";

export enum ServerMessageAction {
        REQUEST = "REQUEST",
        APPROVE = "APPROVE",
        DECLINE = "DECLINE",
        DELETE = "DELETE"
}

export enum MessageType {
        TRANSFER = "TRANSFER",
        REGISTER = "REGISTER"
}

export enum ClientMessageAction {
        APPROVE_DECLINE = "APPROVE_DECLINE",
        INFO = "INFO"
}

export interface Message {
    _id: string | undefined;
    type: MessageType;
    from_id: string;
    to_id?: string;
    content: string;
}

export interface ClientMessage extends Message {
    action: ServerMessageAction;
    to_organizationId: string;
}


export interface ServerMessage extends Message {
    action: ClientMessageAction;
    from_organizationId: string;
}
