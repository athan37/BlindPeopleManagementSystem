import { gql } from "apollo-server-express";

export const OrganizationTypes = gql`
    type Organization {
        _id : String!
        name: String!
        address: String
        phone: String
    }
    type OrganizationData {
        total : Int!
        results : [Organization]!
    }
    input OrganizationInput {
        name: String
        address: String
        phone: String
    }
`;