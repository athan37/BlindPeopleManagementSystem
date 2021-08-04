import { gql } from "@apollo/client";

export const HANDLE_MESSSAGE = gql`
    mutation HandleMessage($input : ClientMessage!) {
        handleMessageFromClient(input: $input)
    }
`;
