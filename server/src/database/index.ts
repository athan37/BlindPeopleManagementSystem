require('dotenv').config()
import { MongoClient } from "mongodb";
import { User, Member, Organization, Message } from "../lib/types";
import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

export const connectDatabase = async () : Promise<Database> => {
    const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = client.db('BPMS');

    return { 
        messages: db.collection<Message>("messages"),
        members: db.collection<Member>("members"),
        users: db.collection<User>("users"),
        organizations: db.collection<Organization>("organizations")
    }
}