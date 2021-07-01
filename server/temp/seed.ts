import { Member, Admin, Organization  } from "../src/lib/types";
import fs from "fs";
import { ObjectId }  from "mongodb";
import { connectDatabase } from '../src/database'
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
} from "../src/lib/enum";

 

const seed = async () => {
    try { 
        console.log('[seed] : running...');

        const db = await connectDatabase();

        for (const member of members) {
            await db.members.insertOne(member);
        }

        for (const admin of admins) {
            await db.admins.insertOne(admin);
        }


        for (const organization of organizations ) {
            await db.organizations.insertOne(organization);
        }

        console.log('[seed] : completed') ;
    } catch {
        throw new Error("failed to seed db");
    }
}



export const saveData = (members : Member, filename = "members.json") : void => {
    fs.writeFile(filename, JSON.stringify(members), (err) => { //Need stringnify here
        if (err) {
            throw err;
        }
        console.log("Saved data")
    }) 
}

export const loadData = (filename = "members.json") : Member[] => {
    let members : Member[] = [];
    fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        members = JSON.parse(data.toString());
    });

    return members;
}

export const admins : Admin[] = [
    {
        _id : new ObjectId(),
        member_id : new ObjectId("60d57b609454ef427c453442")
    }

];

export const organizations : Organization[] = [
    {
        _id : new ObjectId("60d57b609454ef427c453449"),
        name: "Thai Mu",
        admins: [
            {
                member_id : new ObjectId("60d57b609454ef427c453442")
            },
            {
                member_id : new ObjectId("60d57b609454ef427c453441")
            }
        ]
    },
    {
        _id : new ObjectId("60d57b609454ef427c453499"),
        name: "No one Mu",
        admins: [
            {
                member_id : new ObjectId("eeee7b609454ef427c453442")
            },
            {
                member_id : new ObjectId("eeee7b609454ef427c453443")
            }
        ]
    }
];


export const members : Member[] = [ 
    {
        _id : new ObjectId("60d57b609454ef427c453442"),
        firstName : "John ",
        lastName : "A",
        birthYear: 1999,
        gender : Gender.FM,
        address : "Hanoi",
        image: "https://google.com",
        ethnicity : Ethnicity.KINH,
        religion : Religion.BUDDHA,
        occupation : Occupation.NONE,
        isCommunistPartisan : true, 
        marriage : true, 
        eyeCondition : EyeCondition.BLIND,
        education : Education.I,
        postEducation : PostEducation.BA,
        politicalEducation : PoliticalEducation.BASIC,
        brailleComprehension : BrailleComprehension.NONE,
        languages : [Language.ENGLISH, Language.JAPANESE],
        familiarWIT : true,
        healthInsuranceCard : true,
        disabilityCert : true,
        busCard: true,
        supportType : SupportType.NONE,
        incomeType : IncomeType.EXTREME_HIGH,
        organization_id: new ObjectId("60d57b609454ef427c453449")
    }, 
    {
        _id : new ObjectId("60d57b609454ef427c453441"),
        firstName : "John ",
        lastName : "B",
        birthYear: 1999,
        gender : Gender.FM,
        address : "Hanoi",
        image: "https://google.com",
        ethnicity : Ethnicity.KINH,
        religion : Religion.BUDDHA,
        occupation : Occupation.NONE,
        isCommunistPartisan : true, 
        marriage : true, 
        eyeCondition : EyeCondition.BLIND,
        education : Education.I,
        postEducation : PostEducation.BA,
        politicalEducation : PoliticalEducation.BASIC,
        brailleComprehension : BrailleComprehension.NONE,
        languages : [Language.ENGLISH, Language.JAPANESE],
        familiarWIT : true,
        healthInsuranceCard : true,
        disabilityCert : true,
        busCard: true,
        supportType : SupportType.NONE,
        incomeType : IncomeType.EXTREME_HIGH,
        organization_id: new ObjectId("60d57b609454ef427c453449")
    }, 
    {
        _id : new ObjectId("60d57b609454ef427c453443"),
        firstName : "John ",
        lastName : "F",
        birthYear: 1977,
        gender : Gender.FM,
        address : "Ha Tinh",
        image: "https://google.com",
        ethnicity : Ethnicity.KINH,
        religion : Religion.BUDDHA,
        occupation : Occupation.NONE,
        isCommunistPartisan : true, 
        marriage : true, 
        eyeCondition : EyeCondition.BLIND,
        education : Education.I,
        postEducation : PostEducation.BA,
        politicalEducation : PoliticalEducation.BASIC,
        brailleComprehension : BrailleComprehension.NONE,
        languages : [Language.ENGLISH, Language.JAPANESE],
        familiarWIT : true,
        healthInsuranceCard : true,
        disabilityCert : true,
        busCard: true,
        supportType : SupportType.NONE,
        incomeType : IncomeType.EXTREME_HIGH,
        organization_id: new ObjectId("60d57b609454ef427c453449")
    }, 
    {
        _id : new ObjectId(),
        firstName : "John ",
        lastName : "P",
        birthYear: 1977,
        gender : Gender.FM,
        address : "Hanoi",
        image: "https://google.com",
        ethnicity : Ethnicity.KINH,
        religion : Religion.BUDDHA,
        occupation : Occupation.NONE,
        isCommunistPartisan : true, 
        marriage : true, 
        eyeCondition : EyeCondition.BLIND,
        education : Education.I,
        postEducation : PostEducation.BA,
        politicalEducation : PoliticalEducation.BASIC,
        brailleComprehension : BrailleComprehension.NONE,
        languages : [Language.ENGLISH, Language.JAPANESE],
        familiarWIT : true,
        healthInsuranceCard : true,
        disabilityCert : true,
        busCard: true,
        supportType : SupportType.NONE,
        incomeType : IncomeType.EXTREME_HIGH,
        organization_id: new ObjectId("60d57b609454ef427c453449")
    }, 
    {
        _id : new ObjectId(),
        firstName : "John ",
        lastName : "C",
        birthYear: 1987,
        gender : Gender.FM,
        address : "Hanoi",
        image: "https://google.com",
        ethnicity : Ethnicity.KINH,
        religion : Religion.BUDDHA,
        occupation : Occupation.NONE,
        isCommunistPartisan : true, 
        marriage : true, 
        eyeCondition : EyeCondition.BLIND,
        education : Education.I,
        postEducation : PostEducation.BA,
        politicalEducation : PoliticalEducation.BASIC,
        brailleComprehension : BrailleComprehension.NONE,
        languages : [Language.ENGLISH, Language.JAPANESE],
        familiarWIT : true,
        healthInsuranceCard : true,
        disabilityCert : true,
        busCard: true,
        supportType : SupportType.NONE,
        incomeType : IncomeType.EXTREME_HIGH,
        organization_id: new ObjectId("60d57b609454ef427c453449")
    }, 
    {
        _id : new ObjectId("eeee7b609454ef427c453442"),
        firstName : "John ",
        lastName : "X",
        birthYear: 1988,
        gender : Gender.M,
        address : "Hanoi",
        image: "https://google.com",
        ethnicity : Ethnicity.KINH,
        religion : Religion.BUDDHA,
        occupation : Occupation.NONE,
        isCommunistPartisan : true, 
        marriage : true, 
        eyeCondition : EyeCondition.BLIND,
        education : Education.I,
        postEducation : PostEducation.BA,
        politicalEducation : PoliticalEducation.BASIC,
        brailleComprehension : BrailleComprehension.NONE,
        languages : [Language.ENGLISH, Language.JAPANESE],
        familiarWIT : true,
        healthInsuranceCard : true,
        disabilityCert : true,
        busCard: true,
        supportType : SupportType.NONE,
        incomeType : IncomeType.EXTREME_HIGH,
        organization_id: new ObjectId("60d57b609454ef427c453499")
    }, 
    {
        _id : new ObjectId("eeee7b609454ef427c453443"),
        firstName : "John ",
        lastName : "G",
        birthYear: 1998,
        gender : Gender.M,
        address : "Ha Lao",
        image: "https://google.com",
        ethnicity : Ethnicity.KINH,
        religion : Religion.BUDDHA,
        occupation : Occupation.NONE,
        isCommunistPartisan : true, 
        marriage : true, 
        eyeCondition : EyeCondition.BLIND,
        education : Education.I,
        postEducation : PostEducation.BA,
        politicalEducation : PoliticalEducation.BASIC,
        brailleComprehension : BrailleComprehension.NONE,
        languages : [Language.ENGLISH, Language.JAPANESE],
        familiarWIT : true,
        healthInsuranceCard : true,
        disabilityCert : true,
        busCard: true,
        supportType : SupportType.NONE,
        incomeType : IncomeType.EXTREME_HIGH,
        organization_id: new ObjectId("60d57b609454ef427c453499")
    }, 
]  

seed()