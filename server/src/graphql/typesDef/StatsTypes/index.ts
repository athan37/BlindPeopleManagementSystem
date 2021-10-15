import { gql } from "apollo-server-express";

export const StatsTypes = gql`
    type GraphData {
        _id : String!, 
        value: Int!
    }

    type Stats {
        total: Int!
        totalMale : Int!
        totalFemale : Int!
        avgAge: Int!
        totalBusCard: Int!
        totalFWIT: Int!
        totalDisabilityCert: Int!
        totalICP: Int! #Is Communist partisan count
        totalHS: Int! #Health insurance count
        totalBMC: Int!
        totalMoreThan2Languages: Int!
        medianIncome: GraphData!
        maxOrganization: GraphData #Only return if it is admin
        minOrganization: GraphData #Only return if it is admin
        medianReligion: GraphData!
        medianEducation: GraphData!
        jobs: [GraphData!]!
        brailleData: [GraphData!]!
        #Add more from the blind requests
        educations: [GraphData!]!
        postEducations: [GraphData!]!
        politicalEducations: [GraphData!]!
        governLevels: [GraphData!]!
        languages: [GraphData!]!
        socialWorkLevels: [GraphData!]!
    }
`;