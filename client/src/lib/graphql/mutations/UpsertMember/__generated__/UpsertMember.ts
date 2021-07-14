/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputMember } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpsertMember
// ====================================================

export interface UpsertMember {
  upsertMember: string | null;
}

export interface UpsertMemberVariables {
  old?: InputMember | null;
  new: InputMember;
}
