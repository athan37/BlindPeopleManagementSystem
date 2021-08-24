import { gql } from "apollo-server-express";

export const NormalTypes = gql`

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
        organization_id : ID!
        isTransferring: Boolean
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
        organization_id : String!
        isTransferring : Boolean
    }



    type MembersData {
        total : Int!
        results : [Member!]!
    }

    type Message {
        id: String
    }


    type ServerMessage {
        action: ClientMessageAction!
        type: MessageType!
        from_id: String!
        # to_id: String!
        from_organizationId : String!
        content: String!
    }

    input ClientMessage {
        action: ServerMessageAction!
        type: MessageType!
        from_id: String!
        to_id: String
        to_organizationId : String!
        content: String!
    }

    type MessagesData {
        total : Int!
        results : [ServerMessage!]!
        avatars : [String!]!
    }

    type Organization {
        _id : String!
        name: String!
        address: String
        phone: String
    }

    type OrganizationData {
        total : Int!
        results : [Organization]!
    }


    input OrganizationInput {
        name: String
        address: String
        phone: String
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
        totalICP: Int! #Is Communist partisan count
        totalHS: Int! #Health insurance count
        medianIncome: GraphData!
        maxOrganization: GraphData #Only return if it is admin
        minOrganization: GraphData #Only return if it is admin
        medianReligion: GraphData!
        medianEducation: GraphData!
        totalMoreThan2Languages: Int!
        jobs: [GraphData!]!
        brailleData: [GraphData!]!
        #Add more from the blind requests
        educations: [GraphData!]!
        postEducations: [GraphData!]!
        politicalEducations: [GraphData!]!
        governLevels: [GraphData!]!
        languages: [GraphData!]!
    }

    input LogInInput  {
        code: String!
    }

    type Viewer {
        id: ID
        name: String
        token: String
        avatar: String
        didRequest: Boolean!
        isAdmin: Boolean
        organization_id: String
        registering: Boolean
        # messages: [Message!]
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
    }


    input SearchFilter {
        keyword: String, 
        filter: FilterArgs,
    }

    type MessageUserInfo {
        userName: String!
        organizationName: String!
        memberName: String!
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
        handleMessageFromClient(input : ClientMessage!) : String!
    }

    type Query {
        authUrl: String!
        members(organizationId : String!, limit: Int!, page: Int!, input: SearchFilter ) : MembersData!,
        # searchMembers(input: SearchMemberArgs) : MembersData!,
        member(organizationId : String, id : String!) : Member
        # Messages
        loadMessages(limit: Int, page: Int, viewerId : String!): MessagesData!
        getUserInfoFromMessage(
            fromId: String!, 
            fromOrganizationId: String!, 
            content: String!,
            type: MessageType!) : MessageUserInfo!
        organizations: OrganizationData!
        organization(organizationId : String!): Organization
        #Stats page
        getOrganizationsStats(organizationId : String) : Stats!
        numsByAge(organizationId : String, start: Int!, end: Int!) : Int!
        customCount(organizationId: String, input: FilterArgs!) : Int!
    }
`;