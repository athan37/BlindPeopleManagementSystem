/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LogOut
// ====================================================

export interface LogOut_logOut {
  __typename: "Viewer";
  id: string | null;
  name: string | null;
  token: string | null;
  avatar: string | null;
  isAdmin: boolean | null;
  organization_id: string | null;
  didRequest: boolean;
}

export interface LogOut {
  logOut: LogOut_logOut;
}
