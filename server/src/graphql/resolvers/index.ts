import merge from "lodash.merge";

import { memberResolvers } from "./Members";
import { messagesResolver } from "./Messages";
import { viewerResolvers } from "./Viewer";
import { organizationResovers } from "./Organizations";

export const resolvers = merge(
    memberResolvers, 
    viewerResolvers,
    messagesResolver,
    organizationResovers
);