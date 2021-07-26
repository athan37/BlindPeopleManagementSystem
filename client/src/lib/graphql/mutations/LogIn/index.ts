import { gql } from "@apollo/client";

export const LOG_IN = gql`
    mutation LogIn($input: LogInInput) {
        logIn(input: $input) {
            id
            name
            token
            avatar
            isAdmin 
            organization_id 
            didRequest
            registering
        }
    }
`;