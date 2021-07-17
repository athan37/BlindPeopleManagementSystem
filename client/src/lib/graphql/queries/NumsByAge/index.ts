import { gql } from "@apollo/client";

export const NUMS_BY_AGE = gql`
    query NumsByAge($organizationId : String, $start: Int!, $end: Int!) {
        numsByAge(organizationId: $organizationId, start: $start, end: $end)
    }
`;