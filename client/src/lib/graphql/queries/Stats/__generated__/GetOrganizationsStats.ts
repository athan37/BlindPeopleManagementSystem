/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetOrganizationsStats
// ====================================================

export interface GetOrganizationsStats_getOrganizationsStats_medianIncome {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_maxOrganization {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_minOrganization {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_medianReligion {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_medianEducation {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_jobs {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_brailleData {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_educations {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_politicalEducations {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_governLevels {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_languages {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_postEducations {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats_socialWorkLevels {
  __typename: "GraphData";
  _id: string;
  value: number;
}

export interface GetOrganizationsStats_getOrganizationsStats {
  __typename: "Stats";
  total: number;
  totalMale: number;
  totalFemale: number;
  avgAge: number;
  totalBusCard: number;
  totalFWIT: number;
  totalDisabilityCert: number;
  totalICP: number;
  totalHS: number;
  totalBMC: number;
  totalMoreThan2Languages: number;
  medianIncome: GetOrganizationsStats_getOrganizationsStats_medianIncome;
  maxOrganization: GetOrganizationsStats_getOrganizationsStats_maxOrganization | null;
  minOrganization: GetOrganizationsStats_getOrganizationsStats_minOrganization | null;
  medianReligion: GetOrganizationsStats_getOrganizationsStats_medianReligion;
  medianEducation: GetOrganizationsStats_getOrganizationsStats_medianEducation;
  jobs: GetOrganizationsStats_getOrganizationsStats_jobs[];
  brailleData: GetOrganizationsStats_getOrganizationsStats_brailleData[];
  educations: GetOrganizationsStats_getOrganizationsStats_educations[];
  politicalEducations: GetOrganizationsStats_getOrganizationsStats_politicalEducations[];
  governLevels: GetOrganizationsStats_getOrganizationsStats_governLevels[];
  languages: GetOrganizationsStats_getOrganizationsStats_languages[];
  postEducations: GetOrganizationsStats_getOrganizationsStats_postEducations[];
  socialWorkLevels: GetOrganizationsStats_getOrganizationsStats_socialWorkLevels[];
}

export interface GetOrganizationsStats {
  getOrganizationsStats: GetOrganizationsStats_getOrganizationsStats;
}

export interface GetOrganizationsStatsVariables {
  organizationId?: string | null;
}
