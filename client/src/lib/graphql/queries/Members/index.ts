import { gql } from "@apollo/client";

export const MEMBERS = gql`
    query Members ($organizationId : ID!){
        members (organizationId: $organizationId) {
            total
            results {
                id
                firstName
                lastName
                birthYear
                gender
                address 
                image 
                ethnicity 
                religion
                occupation
                isCommunistPartisan
                marriage
                eyeCondition
                education
                postEducation
                politicalEducation
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
        }
}
`;
