import { gql } from "@apollo/client";

export const QUERY_STATS = gql`
    query GetOrganizationsStats ($organizationId : String){
        getOrganizationsStats (organizationId: $organizationId) {
            total
            totalMale
            totalFemale
            avgAge
            totalBusCard
            totalFWIT
            totalDisabilityCert
            totalMoreThan2Languages 
            medianIncome {
                _id 
                value
            }
            maxOrganization {
                _id 
                value
            }
            medianReligion {
                _id 
                value
            }
            medianEducation {
                _id 
                value
            }
            jobs {
                _id 
                value
            }
            brailleData {
                _id 
                value
            }
        }
    }
`;