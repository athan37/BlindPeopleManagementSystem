/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LoadMessages
// ====================================================

export interface LoadMessages_loadMessages_results {
  __typename: "Message";
  id: string;
  user_id: string;
  avatar: string | null;
  isAdmin: boolean;
  organization_id: string | null;
  organization_name: string;
  content: string;
}

export interface LoadMessages_loadMessages {
  __typename: "MessagesData";
  total: number;
  results: LoadMessages_loadMessages_results[];
}

export interface LoadMessages {
  loadMessages: LoadMessages_loadMessages;
}

export interface LoadMessagesVariables {
  limit: number;
  page: number;
}
