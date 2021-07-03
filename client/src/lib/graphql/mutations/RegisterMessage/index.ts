import { gql } from "@apollo/client";

export const REGISTER_MESSAGE = gql`
    mutation Register($input: ApprovalRequest!) {
        register(input: $input)
    } 
`;