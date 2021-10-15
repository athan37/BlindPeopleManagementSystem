import { ViewerTypes } from "./ViewerTypes";
import { EnumTypes } from "./MessageTypes/EnumTypes";
import { MemberTypes } from "./MemberTypes";
import { MessageTypes } from "./MessageTypes";
import { StatsTypes } from "./StatsTypes";
import { OrganizationTypes } from "./OrganizationTypes";
import { QueryMutation } from "./QueryMutation";

export const typeDefs = [ViewerTypes, EnumTypes, MemberTypes, MessageTypes, StatsTypes, OrganizationTypes, QueryMutation];