/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface ApprovalRequest {
  id?: string | null;
  user_id?: string | null;
  avatar?: string | null;
  isAdmin?: boolean | null;
  organization_id?: string | null;
  organization_name?: string | null;
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
}

export interface SearchFilter {
  keyword?: string | null;
  filter?: FilterArgs | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
