import { gql } from "@apollo/client";

export const MEMBERS = gql`
    query Members (
            $organizationId: String!,
            $limit: Int!, 
            $page: Int!, 
            $input: SearchFilter)
        {
        members (
            organizationId: $organizationId,
            limit: $limit,
            page: $page,
            input: $input)
        {
            total
            results {
                id
                firstName
                lastName
                birthYear
                phone
                gender
                address 
                ethnicity 
                religion
                occupation
                isCommunistPartisan
                marriage
                eyeCondition
                education
                postEducation
                politicalEducation
                governmentAgencyLevel
                brailleComprehension
                languages
                familiarWIT
                healthInsuranceCard
                disabilityCert
                busCard
                supportType
                incomeType
                organization_id
            }
        },
    }
`;
