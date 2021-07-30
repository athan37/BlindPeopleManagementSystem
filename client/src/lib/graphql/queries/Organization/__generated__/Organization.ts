/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Organization
// ====================================================

export interface Organization_organization {
  __typename: "Organization";
  name: string;
  address: string | null;
  phone: string | null;
}

export interface Organization {
  organization: Organization_organization | null;
}

export interface OrganizationVariables {
  organizationId: string;
}
