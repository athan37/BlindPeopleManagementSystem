import { gql } from "apollo-server-express";

export const MemberTypes = gql`
    type Member {
        id : ID!,
        firstName : String!
        lastName : String!
        birthYear: Int!
        phone: String
        gender : String!
        address: String!
        ethnicity : String!
        religion : String!
        occupation : String!
        isCommunistPartisan : Boolean!
        marriage: String!
        eyeCondition: String!
        education : String!
        postEducation : String!
        politicalEducation : String!
        brailleComprehension : String!
        governmentAgencyLevel : String!
        languages : [String!]!
        familiarWIT: Boolean!
        healthInsuranceCard : Boolean!
        disabilityCert : Boolean
        busCard : Boolean!
        supportType : String!
        incomeType : String!
        blindManageCert: Boolean!
        socialWorkLevel: String!
        organization_id : ID!
        isTransferring: Boolean
        yearJoin: Int
    }
    input InputMember {
        firstName : String!
        lastName : String!
        birthYear: Int!
        phone: String
        gender : String!
        address: String!
        ethnicity : String!
        religion : String!
        occupation : String!
        isCommunistPartisan : Boolean!
        marriage: String!
        eyeCondition: String!
        education : String!
        postEducation : String!
        politicalEducation : String!
        governmentAgencyLevel : String!
        brailleComprehension : String!
        languages : [String!]!
        familiarWIT: Boolean!
        healthInsuranceCard : Boolean!
        disabilityCert : Boolean
        busCard : Boolean!
        supportType : String!
        incomeType : String!
        blindManageCert: Boolean!
        socialWorkLevel: String!
        organization_id : String!
        isTransferring : Boolean
        yearJoin: Int
    }

    input FilterArgs {
        gender : String
        ethnicity : String
        religion : String
        occupation : String
        isCommunistPartisan : Boolean
        marriage: String
        eyeCondition: String
        education : String
        postEducation : String
        politicalEducation : String
        governmentAgencyLevel : String
        brailleComprehension : String
        languages : String
        familiarWIT: Boolean
        healthInsuranceCard : Boolean
        disabilityCert : Boolean
        busCard : Boolean
        supportType : String
        incomeType : String
        blindManageCert: Boolean
        socialWorkLevel: String
        yearJoin: Int
    }

    type MembersData {
        total : Int!
        results : [Member!]!
    }

    #Filter args also belong to member types
    input SearchFilter {
        keyword: String, 
        filter: FilterArgs,
    }
`;