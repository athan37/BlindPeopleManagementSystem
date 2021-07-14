import { Member, Organization, User  } from "../src/lib/types";
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
import { createHashFromUser } from "../src/lib/utils";

 




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

export const users : User[] = [
    {"_id":"112830123241869383734","token":"298ace3bbdcb5f2a48327bf57ce0d364","name":"Anh Than","avatar":"https://lh3.googleusercontent.com/a/AATXAJxi_2t2ID6KZBEDMGJ9tCCA_5KncNtf6v1hAhwo=s100","contact":"athan@bates.edu","isAdmin":true},
    {"_id":"115147470592336775121","token":"c9bf5d38aa794e7cbdc1dc130705e932","name":"Văn Ngáo Nguyễn","avatar":"https://lh3.googleusercontent.com/a-/AOh14GgbwOMDsJ21KYB26DIbk25MLMmYzJlwPjvs-_gn=s100","contact":"vanngao09@gmail.com","isAdmin":false,"registering":false,"organization_id":"CầuTiêu"},
    {"_id":"107589725800820759904","token":"567607039bdd37834da8811139b5030c","name":"Royale Clash","avatar":"https://lh3.googleusercontent.com/a/AATXAJwl0WM6RpTdoIFjvzC4QBONMMrMAPmCntlItEPe=s100","contact":"clashroyale.singapore@gmail.com","isAdmin":false,"registering":false,"organization_id":"Maidịch"},
    {"_id":"110033170455996289118","token":"6d4404643642c2dd68201c2bf5a3f350","name":"than thang","avatar":"https://lh3.googleusercontent.com/a/AATXAJwlhFa6B4fuevt92NIMpfRTjJQMDEl3Jm6JdapY=s100","contact":"cloneel0002@gmail.com","isAdmin":false,"registering":false,"organization_id":"MaiTyson"}
];

export const organizations : Organization[] = [
    {"_id":"CầuTiêu","name":"Cầu Tiêu"},
    {"_id":"Maidịch","name":"Mai dịch"},
    {"_id":"MaiTyson","name":"Mai Tyson"}
];

const generateMembers = ( num : number) =>  {
    const members : Member[] = []

    const randomChoice = (arr : any[]) => arr[Math.floor(Math.random() * arr.length)]
    const getRandomIntInclusive = (min : number, max : number) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
      }


    for (let index = 0; index <= num; index++) {
        const i = `${index}`
        const obj = {
            firstName : randomChoice([
                "soap","smooth","led","hair","time","improve", "potatoes",
                "probably","meet","alike","fifty","sad", "service","tax","brave","near","badly","trap",
                "fireplace","dress","steam","including","cattle","lips",
                "selection","can","education","check","bean","independent",
                "officer","feet","stepped","conversation","wherever","rope",
                "program","pleasure","gold","some","addition","secret",
            ]),
            lastName : randomChoice([
                "soap","smooth","led","hair","time","improve", "potatoes",
                "probably","meet","alike","fifty","sad", "service","tax","brave","near","badly","trap",
                "fireplace","dress","steam","including","cattle","lips",
                "selection","can","education","check","bean","independent",
                "officer","feet","stepped","conversation","wherever","rope",
                "program","pleasure","gold","some","addition","secret",
            ]),
            birthYear: getRandomIntInclusive(1960, 2010),
            gender : randomChoice(Object.keys(Gender)),
            address : "Hanoi",
            image: "https://google.com",
            ethnicity : randomChoice(Object.keys(Ethnicity)),
            religion : randomChoice(Object.keys(Religion)),
            occupation : randomChoice(Object.keys(Occupation)),
            isCommunistPartisan : randomChoice([true, false]), 
            marriage : randomChoice([true, false]), 
            eyeCondition : randomChoice(Object.keys(EyeCondition)),
            education : randomChoice(Object.keys(Education)),
            postEducation : randomChoice(Object.keys(PostEducation)),
            politicalEducation : randomChoice(Object.keys(PoliticalEducation)),
            brailleComprehension : randomChoice(Object.keys(BrailleComprehension)),
            languages : [Language.ENGLISH, Language.JAPANESE],
            familiarWIT : randomChoice([true, false]),
            healthInsuranceCard : randomChoice([true, false]),
            disabilityCert : randomChoice([true, false]),
            busCard: randomChoice([true, false]),
            supportType : randomChoice(Object.keys(SupportType)),
            incomeType : randomChoice(Object.keys(IncomeType)),
            organization_id: randomChoice(["CầuTiêu", "Maidịch", "MaiTyson"])
        }

        const hash = createHashFromUser(obj);
        obj["_id"] = hash
        
        //@ts-expect-error already added it
        members.push(obj)

    }

    return members;
}

const seed = async () => {
    try { 
        console.log('[seed] : running...');

        const db = await connectDatabase();

        for (const member of generateMembers(100)) {
            await db.members.insertOne(member);
        }

        //Comment this at the moment, the token is not guaranteed to be newest
        // for (const user of users) {
        //     await db.users.insertOne(user);
        // }


        // for (const organization of organizations ) {
        //     await db.organizations.insertOne(organization);
        // }

        console.log('[seed] : completed') ;
    } catch {
        throw new Error("failed to seed db");
    }
}
seed()
