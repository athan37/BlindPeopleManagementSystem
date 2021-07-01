import merge from "lodash.merge";

import { memberResolvers } from "./Members";
import { viewerResolvers } from "./Viewer";

export const resolvers = merge(
    memberResolvers, 
    viewerResolvers
);