/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Gender, EyeCondition, Education, PostEducation, PoliticalEducation, BrailleComprehension, Language, SupportType, IncomeType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Members
// ====================================================

export interface Members_members_results {
  __typename: "Member";
  id: string;
  firstName: string;
  lastName: string;
  birthYear: number;
  gender: Gender;
  address: string;
  image: string;
  ethnicity: string;
  religion: string;
  occupation: string;
  isCommunistPartisan: boolean;
  marriage: boolean;
  eyeCondition: EyeCondition;
  education: Education;
  postEducation: PostEducation;
  politicalEducation: PoliticalEducation;
  brailleComprehension: BrailleComprehension;
  languages: Language[];
  familiarWIT: boolean;
  healthInsuranceCard: boolean;
  disabilityCert: boolean | null;
  busCard: boolean;
  supportType: SupportType;
  incomeType: IncomeType;
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
}
