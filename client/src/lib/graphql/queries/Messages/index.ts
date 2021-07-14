import { gql } from "@apollo/client";

export const LOAD_MESSAGES = gql`
    query LoadMessages($limit: Int!, $page: Int!) {
        loadMessages(limit: $limit, page: $page) {
            total 
            results { 
                id 
                user_id 
                avatar 
                isAdmin 
                organization_id 
                organization_name 
                content
            }
        }
    }
`;