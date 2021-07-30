import { gql } from "@apollo/client";
export const CUSTOM_COUNT = gql`
    query CustomCount($organizationId : String, $input: FilterArgs!) {
        customCount(organizationId: $organizationId, input: $input)
    }
`;