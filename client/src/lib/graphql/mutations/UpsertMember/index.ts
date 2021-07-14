import { gql } from "@apollo/client";

export const UPSERT_MEMBER = gql`
    mutation UpsertMember($old: InputMember, $new: InputMember!) {
        upsertMember(old : $old, new : $new)
    }
`;