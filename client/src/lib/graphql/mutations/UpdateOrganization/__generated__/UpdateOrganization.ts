/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrganizationInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateOrganization
// ====================================================

export interface UpdateOrganization {
  updateOrganization: boolean | null;
}

export interface UpdateOrganizationVariables {
  organizationId: string;
  input: OrganizationInput;
}
