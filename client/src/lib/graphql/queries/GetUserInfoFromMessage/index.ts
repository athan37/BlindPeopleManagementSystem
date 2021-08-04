import { gql } from "@apollo/client";

export const GET_USER_INFO_FROM_MESSAGE = gql`
    query MessageUserInfo (
            $fromId : String!, 
            $fromOrganizationId : String!,
            $content: String!
            $type: MessageType!)
    {
        getUserInfoFromMessage(
                fromId : $fromId, 
                fromOrganizationId : $fromOrganizationId
                content: $content,
                type: $type,
            ) 
        {
            userName
            organizationName
            memberName
    }
}`;
