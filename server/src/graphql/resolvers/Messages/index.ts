import { IResolvers } from "apollo-server-express";
import { Database } from "../../../lib/types";


interface RegisterArgs {
    input: {
        id: string
        user_id: string | null
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


                const updateUser = await db.users.findOneAndUpdate(
                    {_id : input.user_id},
                    {
                        $set: { //Only update isAdmin here to false
                            //So that the user will not be registring again
                            isAdmin: false,
                            registering: true
                        }
                    }
                )

                const InsertResult = registerMessage.ops[0];
                const UpdateResult = updateUser.value;

                return InsertResult && UpdateResult ? true : false;
            } catch (err) {
                throw new Error(`Failed to insert this message to database`)
            }
        }
    }
}