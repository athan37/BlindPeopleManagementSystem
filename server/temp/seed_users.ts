import { Member, Organization, User  } from "../src/lib/types";
import { connectDatabase } from '../src/database'

const generateData = (num: number) => {
    const users = [];
    const messages = [];

    try {
    users.push(
        {
            _id : "112830123241869383734",
            token : "75fbd593b9b2afba716f08ee246bd612",
            name : "Anh Than",
            avatar : "https://lh3.googleusercontent.com/a/AATXAJxi_2t2ID6KZBEDMGJ9tCCA_5KncN...",
            contact : "athan@bates.edu",
            isAdmin : true,
        }
    )

    for (let index = 0; index < num; index ++){
        const i = `${index}`;
        users.push({ 
            _id : i,
            token : i,
            name : i,
            avatar : "https://lh3.googleusercontent.com/a-/AOh14GgbwOMDsJ21KYB26DIbk25MLMmYz...",
            contact : i +"@gmail.com",
            isAdmin : false,
            registering : true,
        })
        messages.push({
            id : i,
            user_id : i, 
            avatar : "https://lh3.googleusercontent.com/a/AATXAJwl0WM6RpTdoIFjvzC4QBONMMrMAP...",
            isAdmin : false,
            organization_id : i,
            organization_name : i,
            content : "Thành viên hội người mù xin được cấp quyền từ admin",
        })
    }

    return { 
        messages,
        users
    }

    } catch (e) {
        throw e
    }

}

const seed = async () => {
    try { 
        const { messages, users } = generateData(20) 
        console.log('[seed-user] : running...');

        const db = await connectDatabase();

        for (const user of users) {
            await db.users.insertOne(user);
        }

        for (const message of messages) {
            await db.messages.insertOne(message);
        }

        console.log('[seed-user] : completed') ;
    } catch {
        throw new Error("failed to seed db");
    }
}

seed()