import { gql } from "@apollo/client";

export const NUMS_BY_AGE = gql`
    query NumsByAge($organizationId : String, $gender: String!, $start: Int!, $end: Int!) {
        numsByAge(organizationId: $organizationId, gender: $gender, start: $start, end: $end)
    }
`;