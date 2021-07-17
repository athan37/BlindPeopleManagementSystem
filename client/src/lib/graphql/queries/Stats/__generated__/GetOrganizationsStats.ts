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

export interface GetOrganizationsStats_getOrganizationsStats {
  __typename: "Stats";
  total: number;
  totalMale: number;
  totalFemale: number;
  avgAge: number;
  totalBusCard: number;
  totalFWIT: number;
  totalDisabilityCert: number;
  totalMoreThan2Languages: number;
  medianIncome: GetOrganizationsStats_getOrganizationsStats_medianIncome;
  maxOrganization: GetOrganizationsStats_getOrganizationsStats_maxOrganization | null;
  medianReligion: GetOrganizationsStats_getOrganizationsStats_medianReligion;
  medianEducation: GetOrganizationsStats_getOrganizationsStats_medianEducation;
  jobs: GetOrganizationsStats_getOrganizationsStats_jobs[];
  brailleData: GetOrganizationsStats_getOrganizationsStats_brailleData[];
}

export interface GetOrganizationsStats {
  getOrganizationsStats: GetOrganizationsStats_getOrganizationsStats;
}

export interface GetOrganizationsStatsVariables {
  organizationId?: string | null;
}
