import { gql } from "apollo-server-express";

export const NormalTypes = gql`

    type Member {
        id : ID!,
        firstName : String!
        lastName : String!
        birthYear: Int!
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
        organization_id : ID!
    }


    input InputMember {
        firstName : String!
        lastName : String!
        birthYear: Int!
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