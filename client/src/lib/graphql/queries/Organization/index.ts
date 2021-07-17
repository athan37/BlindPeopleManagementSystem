import { gql } from '@apollo/client';

export const QUERY_ORGANIZATION = gql`
    query Organization ($organizationId : String!) {
        organization(organizationId: $organizationId) {
            name 
            address
        }
    }`;