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


    input InputMember {
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
        organization_id : String!
    }



    type MembersData {
        total : Int!
        results : [Member!]!
    }


    type Message {
        id: ID!
        user_id: ID!
        avatar: String
        isAdmin: Boolean!
        organization_id: ID
        organization_name: String!
        content: String!
    }

    type MessagesData {
        total : Int!
        results : [Message!]!
    }

    type Organization {
        _id : String!
        name: String!
        address: String
    }

    type OrganizationData {
        total : Int!
        results : [Organization]!
    }


    input OrganizationInput {
        name: String
        address: String
    }

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
        medianIncome: GraphData!
        maxOrganization: GraphData #Only return if it is admin
        medianReligion: GraphData!
        medianEducation: GraphData!
        totalMoreThan2Languages: Int!
        jobs: [GraphData!]!
        brailleData: [GraphData!]!
    }

    input LogInInput  {
        code: String!
    }

    type Viewer {
        id: ID
        token: String
        avatar: String
        didRequest: Boolean!
        isAdmin: Boolean
        organization_id: String
        registering: Boolean
    }

    input ApprovalRequest {
        id: ID
        user_id: String
        avatar: String
        isAdmin: Boolean
        organization_id: String
        organization_name: String
        content: String!
    }

    type Mutation {
        #Both admin and users
        logIn(input: LogInInput) : Viewer!
        logOut: Viewer!
        register(input: ApprovalRequest!) : Boolean
        approveRequest(message_id: ID!): Boolean
        declineRequest(message_id: ID!): Boolean
        # Old is optional 
        upsertMember(old : InputMember, new : InputMember!) : String
        deleteMember(memberId: String!) : Boolean
        updateOrganization(organizationId: String!, input: OrganizationInput!) : Boolean
    }

    type Query {
        authUrl: String!
        members(organizationId : String!) : MembersData!
        member(organizationId : String, id : String!) : Member
        # Admin login only
        loadMessages(limit: Int!, page: Int!): MessagesData!
        organizations: OrganizationData!
        organization(organizationId : String!): Organization
        #Stats page
        getOrganizationsStats(organizationId : String) : Stats!
        numsByAge(organizationId : String, start: Int!, end: Int!) : Int!
    }

`;