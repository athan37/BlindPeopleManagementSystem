import { IResolvers } from "apollo-server-express";
import { Database } from "../../../lib/types";


interface RegisterArgs {
    input: {
        id: string
        user_id: string
        avatar: string
        isAdmin: boolean
        organization_id: string | null
        organization_name: string
        content: string
    } | null;
}


export const messagesResolver: IResolvers = {
    Mutation : { 
        register: async (
                _root : undefined,
                { input } : RegisterArgs, 
                { db } : { db : Database }) : Promise<boolean | null> =>
            {
            try { 
                const registerMessage = await db.messages.insertOne(
                    input
                );

                const result = registerMessage.ops[0];

                return result ? true : false;
            } catch (err) {
                throw new Error(`Failed to insert this message to database`)
            }
        }
    }
}