/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Member
// ====================================================

export interface Member_member {
  __typename: "Member";
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  phone: string | null;
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
  disabilityCert: boolean | null;
  busCard: boolean;
  supportType: string;
  incomeType: string;
  socialWorkLevel: string;
  blindManageCert: boolean;
  organization_id: string;
  isTransferring: boolean | null;
  yearJoin: number | null;
}

export interface Member {
  member: Member_member | null;
}

export interface MemberVariables {
  organizationId?: string | null;
  id: string;
}
