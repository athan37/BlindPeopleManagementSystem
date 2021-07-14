import { gql } from "@apollo/client";

export const APPROVE_REQUEST = gql`
    mutation ApproveRequest($message_id: ID!) {
        approveRequest(message_id: $message_id) 
    }
`;