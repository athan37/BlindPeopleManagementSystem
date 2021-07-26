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
    id : string;
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
    organization_id : string;
}

export interface OrganizationAdmin {
    member_id : string;
}

export interface Organization {
    _id : string;
    name : string;
}

export interface Viewer {
  id: string | null,
  name: string | null,
  token: string | null,
  avatar : string | null,
  isAdmin : boolean | null, 
  organization_id : string | null
  didRequest: boolean;
  registering?: boolean | null;
}