import { gql } from "@apollo/client";

export const DECLINE_REQUEST = gql`
    mutation DeclineRequest($message_id: ID!) {
        declineRequest(message_id: $message_id) 
    }
`;