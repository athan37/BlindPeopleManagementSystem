/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LogInInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: LogIn
// ====================================================

export interface LogIn_logIn {
  __typename: "Viewer";
  id: string | null;
  name: string | null;
  token: string | null;
  avatar: string | null;
  isAdmin: boolean | null;
  organization_id: string | null;
  didRequest: boolean;
  registering: boolean | null;
}

export interface LogIn {
  logIn: LogIn_logIn;
}

export interface LogInVariables {
  input?: LogInInput | null;
}
