import { gql } from "@apollo/client";

export const MEMBER = gql`
    query Member ($organizationId : String, $id : String!){
        member (organizationId: $organizationId, id : $id) {
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
        },
}
`;
