import { gql } from "@apollo/client";

export const QUERY_MESSAGES = gql`
    query LoadMessages($viewerId : String!) {
        loadMessages(viewerId: $viewerId) {
            total 
            results {
                action
                type
                from_id
                from_organizationId 
                content
            }
            avatars
        }
    }
`;