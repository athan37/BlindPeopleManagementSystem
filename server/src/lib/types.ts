import { ObjectId } from "bson";
import { Collection, MongoClient } from "mongodb";
import { MessageType, ServerMessage } from "../graphql/resolvers/Messages/enums/MessageType";
import { 
    Gender, 
    Ethnicity, 
    Religion, 
    Occupation, 
    EyeCondition, 
    Education, 
    PostEducation, 
    PoliticalEducation,
    BrailleComprehension,
    Language,
    SupportType,
    IncomeType
} from "./enum";

export interface Member {
    _id : string;
    firstName : string;
    lastName : string;
    birthYear : number;
    phone?: number;
    gender : Gender;
    address: string;
    image  : string;
    ethnicity : Ethnicity;
    religion : Religion;
    occupation : Occupation;
    isCommunistPartisan : boolean;
    marriage: boolean;
    eyeCondition: EyeCondition;
    education : Education;
    postEducation : PostEducation;
    politicalEducation : PoliticalEducation;
    brailleComprehension : BrailleComprehension;
    languages : Language[];
    familiarWIT: boolean;
    healthInsuranceCard : boolean;
    disabilityCert : boolean;
    busCard : boolean;
    supportType : SupportType;
    incomeType : IncomeType;
    organization_id : string;
    isTransferring?: boolean;
}


export interface InputMember {
    firstName : string;
    lastName : string;
    birthYear : number;
    gender : Gender;
    phone?: number;
    address: string;
    image  : string;
    ethnicity : Ethnicity;
    religion : Religion;
    occupation : Occupation;
    isCommunistPartisan : boolean;
    marriage: boolean;
    eyeCondition: EyeCondition;
    education : Education;
    postEducation : PostEducation;
    politicalEducation : PoliticalEducation;
    brailleComprehension : BrailleComprehension;
    languages : Language[];
    familiarWIT: boolean;
    healthInsuranceCard : boolean;
    disabilityCert : boolean;
    busCard : boolean;
    supportType : SupportType;
    incomeType : IncomeType;
    organization_id : ObjectId;
}

export interface Organization {
    _id : string;
    name: string;
    address?: string;
}

export interface OrganizationInput {
    //Update is optional for each field, no need to strictly type all of them
    name?: string;
    address?: string;
    phone?: string;
}

export interface Viewer {
    _id?: string;
    name?: string;
    token?: string;
    avatar?: string;
    didRequest: boolean; //Only this one we can be sure of when a user logs in
    isAdmin?: boolean;
    organization_id?: string;
    registering?: boolean;

}

export interface User {
    _id: string;
    name: string;
    token: string;
    avatar: string;
    contact: string;
    isAdmin: boolean;
    organization_id?: string;
    registering?: boolean;
    messages?: ServerMessage[];
}

export interface Message {
    // id: string;
    // user_id: string;
    // avatar: string;
    // isAdmin: boolean;
    // organization_id: string | null;
    // organization_name: string;
    // content: string;

    id : string | null;
    type: MessageType;
    from_id : string;
    to_id : string; 
    content: string;
}

export interface Database {
    client       ?: MongoClient,
    messages      : Collection<Message>
    members       : Collection<Member>;
    users         : Collection<User>;
    organizations : Collection<Organization>
}
