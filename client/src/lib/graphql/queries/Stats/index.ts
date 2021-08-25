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
            totalICP
            totalHS
            totalBMC
            totalMoreThan2Languages 
            medianIncome {
                _id 
                value
            }
            maxOrganization {
                _id 
                value
            }
            minOrganization {
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
            educations {
                _id 
                value
            }
            postEducations {
                _id 
                value
            }
            politicalEducations {
                _id 
                value
            }
            governLevels {
                _id 
                value
            }	
            languages {
                _id 
                value
            }
            socialWorkLevels {
                _id
                value
            }
        }
  }
`;