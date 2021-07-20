import { gql } from "@apollo/client";

export const UPDATE_ORGANIZATION = gql`
    mutation UpdateOrganization($organizationId : String!, $input: OrganizationInput!) {
        updateOrganization( organizationId : $organizationId, input: $input) 
    }
`;