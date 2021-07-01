require("dotenv").config();

import { connectDatabase } from "../src/database/index"

const clear = async () => {
    try{
        console.log('[clear]: running.....')

        const db = await connectDatabase();

        const members = await db.members.find({}).toArray();
        const admins = await db.admins.find({}).toArray();
        const organizations = await db.organizations.find({}).toArray();


        if (members.length > 0) {
            await db.members.drop();
        }
        if (admins.length > 0) {
            await db.admins.drop();
        }
        if (organizations.length > 0) {
            await db.organizations.drop();
        }

        console.log("[clear] successfully")
    } catch {
        throw new Error('failed to clear database');
    }
}

clear();