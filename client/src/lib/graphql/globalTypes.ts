/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ClientMessageAction {
  APPROVE_DECLINE = "APPROVE_DECLINE",
  INFO = "INFO",
}

export enum MessageType {
  REGISTER = "REGISTER",
  TRANSFER = "TRANSFER",
}

export enum ServerMessageAction {
  APPROVE = "APPROVE",
  DECLINE = "DECLINE",
  DELETE = "DELETE",
  REQUEST = "REQUEST",
}

export interface ClientMessage {
  action: ServerMessageAction;
  type: MessageType;
  from_id: string;
  to_id?: string | null;
  to_organizationId: string;
  content: string;
}

export interface FilterArgs {
  gender?: string | null;
  ethnicity?: string | null;
  religion?: string | null;
  occupation?: string | null;
  isCommunistPartisan?: boolean | null;
  marriage?: string | null;
  eyeCondition?: string | null;
  education?: string | null;
  postEducation?: string | null;
  politicalEducation?: string | null;
  governmentAgencyLevel?: string | null;
  brailleComprehension?: string | null;
  languages?: string | null;
  familiarWIT?: boolean | null;
  healthInsuranceCard?: boolean | null;
  disabilityCert?: boolean | null;
  busCard?: boolean | null;
  supportType?: string | null;
  incomeType?: string | null;
}

export interface InputMember {
  firstName: string;
  lastName: string;
  birthYear: number;
  phone?: string | null;
  gender: string;
  address: string;
  ethnicity: string;
  religion: string;
  occupation: string;
  isCommunistPartisan: boolean;
  marriage: string;
  eyeCondition: string;
  education: string;
  postEducation: string;
  politicalEducation: string;
  governmentAgencyLevel: string;
  brailleComprehension: string;
  languages: string[];
  familiarWIT: boolean;
  healthInsuranceCard: boolean;
  disabilityCert?: boolean | null;
  busCard: boolean;
  supportType: string;
  incomeType: string;
  organization_id: string;
}

export interface LogInInput {
  code: string;
}

export interface OrganizationInput {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface SearchFilter {
  keyword?: string | null;
  filter?: FilterArgs | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
