/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SearchFilter } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Members
// ====================================================

export interface Members_members_results {
  __typename: "Member";
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
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
  organization_id: string;
}

export interface Members_members {
  __typename: "MembersData";
  total: number;
  results: Members_members_results[];
}

export interface Members {
  members: Members_members;
}

export interface MembersVariables {
  organizationId: string;
  limit: number;
  page: number;
  input?: SearchFilter | null;
}
