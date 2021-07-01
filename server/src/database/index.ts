require('dotenv').config()
import { MongoClient } from "mongodb";
import { Admin, Member, Organization } from "../lib/types";
import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

export const connectDatabase = async () : Promise<Database> => {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = await client.db('BPMS');

    return { 
        members: db.collection<Member>("members"),
        admins: db.collection<Admin>("admins"),
        organizations: db.collection<Organization>("organizations")
    }
}