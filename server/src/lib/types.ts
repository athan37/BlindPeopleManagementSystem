import { ObjectId } from "bson";
import { Collection } from "mongodb";
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
    _id : ObjectId;
    firstName : string;
    lastName : string;
    birthYear : number;
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
    organization_id : ObjectId;
}

export interface Admin {
    _id : ObjectId;
    member_id : ObjectId;
}

export interface OrganizationAdmin {
    member_id : ObjectId;
}

export interface Organization {
    _id : ObjectId;
    name : string;
    admins: OrganizationAdmin[];
}


export interface Database {
    members       : Collection<Member>;
    admins        : Collection<Admin>;
    organizations : Collection<Organization>
}

export interface Viewer {
    _id?: string;
    token?: string;
    avatar?: string;
    didRequest: boolean;
    isAdmin: boolean;
    organization_id: string
}