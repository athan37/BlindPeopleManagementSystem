import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, Message } from "../../../lib/types";


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

interface MessagesData {
    total: number;
    results: Message[]
}

interface LoadMessagesArgs {
    limit: number;
    page: number;
}

export const messagesResolver: IResolvers = {
    Mutation : { 
        register: async (
                _root : undefined,
                { input } : RegisterArgs, 
                { db } : { db : Database }) : Promise<boolean | null> =>
            { //Small notes: register equals to send messsage to admin => belong to message resolvers
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
        },
        approveRequest: async (_root: undefined, { message_id } : { message_id : string}, { db } : { db: Database })  : Promise<boolean | null> => {
            //If request is apporved, 
            //Delete message
            //Update the status of the user, registering = false
            //Update the organization => add more if not exist

            const session = db.client.startSession();
            try { 
                await session.withTransaction( async () => {
                    const message = (
                            await db.messages.findOneAndDelete({id : message_id})
                        ).value; //This operation should return an object, otherwise => sth really wrong happen
                        //Because that message id is sent from server

                    if (!message) {
                        // session.abortTransaction();
                        throw new Error("Message was not found")
                    }

                    const { organization_name } = message;
                    const organization_id = message.organization_id ? message.organization_id : organization_name.replace(/\s+/g, '').trim();
                    const organization =  await db.organizations.findOne( { _id: organization_id } )

                    if (!organization) {

                        await db.organizations.insertOne(
                                {  
                                    _id: organization_id,
                                    name: organization_name
                                 }
                            )

                    }


                    const user = await db.users.updateOne(
                        {_id: message.user_id},
                        //@ts-expect-error : Only push more field into the user
                        [
                            { $addFields: { organization_id: organization_id }}, 
                            { $set: { registering: false } }
                        ] 
                    )

                    if (!user || user.result.nModified == 0) {
                        throw new Error(`Cannot find user`)
                    }


                    console.log("Request is successfully approved")
                }, 
                { 
                    readPreference : "primary",
                    readConcern: { level: 'local' },
                    writeConcern: { w: 'majority'}
                })
                session.endSession();
                return true
            
            } catch (e) {
                // await session.abortTransaction();
                throw e
            } 
        },
        declineRequest: async (_root: undefined, {message_id } : { message_id : string }, { db } : { db: Database })  : Promise<boolean | null> => {

            try { 

                const message = (await db.messages.findOneAndDelete({id : message_id})).value;

                if (!message) throw new Error("Message expired")
                //Delete this user from the database
                const user = await db.users.findOneAndDelete(
                    {_id: message.user_id}
                )
                return user ? true : false

            } catch (e) {
                console.log("Error in decline request", e)
                return false
            }

        }

    }, 
    Query : {
        loadMessages: async (
            _root: undefined, 
            { limit, page } : LoadMessagesArgs, 
            { db } : { db : Database }
            ) : Promise<MessagesData> => {
                try {
                    const data : MessagesData = {
                        total : 0,
                        results: []
                    }
                    //Basically load all messages
                    let cursor = await db.messages.find({});

                    //No need to sort
                    cursor.sort({ 
                        organization_name: 1
                    })

                    // cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                    cursor = cursor.skip((page - 1) * limit );
                    cursor = cursor.limit(limit);


                    data.total =  await cursor.count();
                    data.results = await cursor.toArray();

                    return data;


                } catch(err) {
                    throw new Error(`Cannot load message: ${err}`)
                }

            },
    },
    Message: {
    }
}