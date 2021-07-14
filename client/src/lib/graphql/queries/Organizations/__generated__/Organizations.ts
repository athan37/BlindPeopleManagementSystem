/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Organizations
// ====================================================

export interface Organizations_organizations_results {
  __typename: "Organization";
  _id: string;
  name: string;
  address: string | null;
}

export interface Organizations_organizations {
  __typename: "OrganizationData";
  total: number;
  results: (Organizations_organizations_results | null)[];
}

export interface Organizations {
  organizations: Organizations_organizations;
}
