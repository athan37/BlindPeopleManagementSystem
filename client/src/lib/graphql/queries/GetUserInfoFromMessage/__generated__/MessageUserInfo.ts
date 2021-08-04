/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MessageType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: MessageUserInfo
// ====================================================

export interface MessageUserInfo_getUserInfoFromMessage {
  __typename: "MessageUserInfo";
  userName: string;
  organizationName: string;
  memberName: string;
}

export interface MessageUserInfo {
  getUserInfoFromMessage: MessageUserInfo_getUserInfoFromMessage;
}

export interface MessageUserInfoVariables {
  fromId: string;
  fromOrganizationId: string;
  content: string;
  type: MessageType;
}
