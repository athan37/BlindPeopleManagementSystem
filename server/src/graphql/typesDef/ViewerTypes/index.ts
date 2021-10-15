import { gql } from "apollo-server-express";

export const ViewerTypes = gql`
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
`;