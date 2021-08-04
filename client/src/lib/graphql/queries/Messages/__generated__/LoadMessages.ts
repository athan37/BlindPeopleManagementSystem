/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ClientMessageAction, MessageType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: LoadMessages
// ====================================================

export interface LoadMessages_loadMessages_results {
  __typename: "ServerMessage";
  action: ClientMessageAction;
  type: MessageType;
  from_id: string;
  from_organizationId: string;
  content: string;
}

export interface LoadMessages_loadMessages {
  __typename: "MessagesData";
  total: number;
  results: LoadMessages_loadMessages_results[];
  avatars: string[];
}

export interface LoadMessages {
  loadMessages: LoadMessages_loadMessages;
}

export interface LoadMessagesVariables {
  viewerId: string;
}
