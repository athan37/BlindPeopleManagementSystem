import { gql } from "@apollo/client";

export const QUERY_ORGANIZATIONS = gql`
    query Organizations {
        organizations { 
            total
            results {
                _id
                name
                address
            } 
        }
    }
`;