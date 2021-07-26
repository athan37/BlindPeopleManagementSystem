import { gql } from "@apollo/client";

export const LOG_OUT = gql`
    mutation LogOut {
        logOut {
            id
            name
            token
            avatar
            isAdmin 
            organization_id 
            didRequest
        }
    }
`;