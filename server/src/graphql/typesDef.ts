import { gql } from "apollo-server-express";
// Planned to create an enum here, but it's too slow, so I used string instead
export const typeDefs = gql`

    enum EyeCondition {
        BLIND
        HALF_BLIND
    }

    enum Gender {
        M
        FM
    }


    enum BrailleComprehension {
        NONE 
        M1 
        M2 
    }

    enum IncomeType {
        EXTREME_LOW 
        LOW
        MEDIUM
        HIGH
        EXTREME_HIGH 
    }

    enum Language {
        JAPANESE
        VIETNAMESE 
        ENGLISH
        CHINESE
    }

    enum SupportType {
        NONE 
    }

    enum Religion {
        BUDDHA
        NONE
    }


    enum Education {
        I 
        II 
        III 
    }

    enum PostEducation {
        MS 
        PHD
        BA
    }

    enum PoliticalEducation {
        BASIC
        INTERMEDIATE 
        ADVANCE 
    }

    type Admin {
        id : ID!,
        memberId: ID!
    }

    type OrganizationAdmin {
        memberId: ID!
    }

    type Organization {
        id: ID!,
        name : String,
        admins : [OrganizationAdmin!]!
    }

    type Member {
        id : ID!,
        firstName : String!
        lastName : String!
        birthYear: Int!
        gender : Gender!,
        address: String!
        image  : String!,
        ethnicity : String!
        religion : String!
        occupation : String!
        isCommunistPartisan : Boolean!
        marriage: Boolean!
        eyeCondition: EyeCondition!
        education : Education!
        postEducation : PostEducation!
        politicalEducation : PoliticalEducation!
        brailleComprehension : BrailleComprehension!
        languages : [Language!]!
        familiarWIT: Boolean!
        healthInsuranceCard : Boolean!
        disabilityCert : Boolean
        busCard : Boolean!
        supportType : SupportType!
        incomeType : IncomeType!
        organization_id : ID!
    }


    type MembersData {
        total : Int!
        results : [Member!]!
    }


    type Query {
        authUrl: String!
        members(organizationId : ID!) : MembersData!
    }

    type Mutation {
        createMember : Boolean!  
        logIn(input: LogInInput) : Viewer!
        logOut: Viewer!
    }

    input LogInInput  {
        code: String!
    }

    type Viewer {
        id: ID
        token: String
        avatar: String
        didRequest: Boolean!
        isAdmin: Boolean!
        organization_id: String!
    }


`