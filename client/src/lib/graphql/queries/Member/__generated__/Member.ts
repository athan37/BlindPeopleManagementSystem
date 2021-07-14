/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Gender, EyeCondition, Education, PostEducation, PoliticalEducation, BrailleComprehension, Language, SupportType, IncomeType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Member
// ====================================================

export interface Member_member {
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

export interface Member {
  member: Member_member | null;
}

export interface MemberVariables {
  organizationId?: string | null;
  id: string;
}
