/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum BrailleComprehension {
  M1 = "M1",
  M2 = "M2",
  NONE = "NONE",
}

export enum Education {
  I = "I",
  II = "II",
  III = "III",
}

export enum EyeCondition {
  BLIND = "BLIND",
  HALF_BLIND = "HALF_BLIND",
}

export enum Gender {
  FM = "FM",
  M = "M",
}

export enum IncomeType {
  EXTREME_HIGH = "EXTREME_HIGH",
  EXTREME_LOW = "EXTREME_LOW",
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export enum Language {
  CHINESE = "CHINESE",
  ENGLISH = "ENGLISH",
  JAPANESE = "JAPANESE",
  VIETNAMESE = "VIETNAMESE",
}

export enum PoliticalEducation {
  ADVANCE = "ADVANCE",
  BASIC = "BASIC",
  INTERMEDIATE = "INTERMEDIATE",
}

export enum PostEducation {
  BA = "BA",
  MS = "MS",
  PHD = "PHD",
}

export enum SupportType {
  NONE = "NONE",
}

export interface ApprovalRequest {
  id?: string | null;
  user_id?: string | null;
  avatar?: string | null;
  isAdmin?: boolean | null;
  organization_id?: string | null;
  organization_name: string;
  content: string;
}

export interface InputMember {
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
  disabilityCert?: boolean | null;
  busCard: boolean;
  supportType: SupportType;
  incomeType: IncomeType;
  organization_id: string;
}

export interface LogInInput {
  code: string;
}

export interface OrganizationInput {
  name?: string | null;
  address?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
