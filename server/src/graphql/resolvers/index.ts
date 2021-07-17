import merge from "lodash.merge";

import { memberResolvers } from "./Members";
import { messagesResolver } from "./Messages";
import { viewerResolvers } from "./Viewer";
import { organizationResovers } from "./Organizations";
import { statsResovers } from "./Stats";

export const resolvers = merge(
    memberResolvers, 
    viewerResolvers,
    messagesResolver,
    organizationResovers,
    statsResovers
);