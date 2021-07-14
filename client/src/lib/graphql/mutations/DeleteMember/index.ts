import { gql } from "@apollo/client";

export const DELETE_MEMBER = gql`
    mutation DeleteMember($memberId : String!) {
        deleteMember(memberId: $memberId)
    }
`;
