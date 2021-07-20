import { gql } from "@apollo/client";

export const MEMBERS = gql`
    query Members ($organizationId : String!){
        members (organizationId: $organizationId) {
            total
            results {
                id
                firstName
                lastName
                birthYear
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
