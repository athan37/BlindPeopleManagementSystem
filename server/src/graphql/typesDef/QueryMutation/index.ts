import { gql } from "apollo-server-express";

export const QueryMutation = gql`
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
        numsByAge(organizationId : String, gender: String!, start: Int!, end: Int!) : Int!
        customCount(organizationId: String, input: FilterArgs!) : Int!
    }
`;