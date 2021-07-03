import merge from "lodash.merge";

import { memberResolvers } from "./Members";
import { messagesResolver } from "./Messages";
import { viewerResolvers } from "./Viewer";

export const resolvers = merge(
    memberResolvers, 
    viewerResolvers,
    messagesResolver
);