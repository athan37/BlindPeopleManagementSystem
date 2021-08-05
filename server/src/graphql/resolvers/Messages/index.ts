import { IResolvers } from "apollo-server-express";
import { Database } from "../../../lib/types";
import { MessageType, ClientMessage, ServerMessageAction, ClientMessageAction } from "./enums/MessageType";

interface MessagesData {
    total: number;
    results: ServerMessage[],
    avatars: string[]
}

interface ServerMessage {
    _id: string;
    type: MessageType;
    from_id: string;
    to_id?: string;
    from_organizationId: string;
    action: ClientMessageAction;
    content: string;
}


interface LoadMessagesArgs {
    viewerId: string;
    limit?: number;
    page?: number;
}

interface BaseMessage {
    _id : string;
    type: MessageType;
    from_id : string;
}

interface MessageUserInfoArgs {
    fromId: string;
    fromOrganizationId: string;
    content: string;
    type: MessageType;
}

interface MessageUserInfo {
    userName: string;
    organizationName: string;
    memberName: string;
}

const getMemberNameFromContent = async (content : string, db : Database) => {
    // content will be in format "members-member_id"
    const member_id = content;
    //Must find a result, otherwise, check again sending procedure
    const member = await db.members.findOne({ _id : member_id }) 
    return `${member.lastName} ${member.firstName}`
}

const getOrganizationNameAndIdFromUserId = async (user_id: string, db : Database) => {
    const user = await db.users.findOne({ _id: user_id });
    const organization = await db.organizations.findOne({ _id: user.organization_id });
    return { organizationName: organization.name, organizationId: organization._id};
}

const handleTransferMessage = ( baseMessage: BaseMessage, db : Database) => async (
        from_id : string, 
        // to_id : string, 
        to_organizationId : string,
        content: string,
        action: ServerMessageAction,
    ) => {

    // Get the id of the request message to delete it 
    const idMessageToDelete = baseMessage.type + content;

    const transferMemberName = await getMemberNameFromContent(content, db);
    const { organizationName : fromOrganizationName, organizationId : fromOrganizationId} = await getOrganizationNameAndIdFromUserId(from_id, db);
    const user = await db.users.findOne({ _id : from_id});

    //Generate the content base on the action that the client want the server to do

    const serverMessageContent = action === ServerMessageAction.APPROVE ?
    `Yêu cầu chuyển hội viên ${transferMemberName} đến ${fromOrganizationName} được xác nhận bởi ${user.name}` : 
    `Yêu cầu chuyển hội viên ${transferMemberName} đến ${fromOrganizationName} bị từ chối ${user.name}` ;

    //Delete the request message from the sender 
    db.users.updateMany( //delete message
        { organization_id : fromOrganizationId}, //Delete all message from all organization
        { $pull : { "messages" : { _id : idMessageToDelete } }},  
    )
    //Send back announcement so that the front end can display it
    //Client action for both case is INFO
    const serverMessage = { ...baseMessage, 
        from_organizationId : fromOrganizationId,
        action : ClientMessageAction.INFO, 
        content : serverMessageContent }
        //I prefer send all message
    // db.users.findOneAndUpdate( //send back announcement
    //     { _id : from_id },
    //     { $addToSet : { messages : serverMessage }},        
    // )

    db.users.updateMany( //send back many announcement to all user in the to organization
        { organization_id : to_organizationId },
        { $addToSet : { messages : serverMessage }},        
    )

    //Approve the member and set isTransfer to false if ServerMessageAction is APPROVE
    if (action === ServerMessageAction.APPROVE) {
        const member_id = content;
        //The current viewer has the organization that the member want to apply for
        db.members.updateOne({ _id: member_id }, { $set : { organization_id : fromOrganizationId, isTransferring : false}} , { upsert : false })
    } 

    //Update nothing if the action is decline

    return "true"
}

const handleTransferMessageRequest = async (
    baseMessage: BaseMessage,
    from_id : string, 
    to_organizationId : string,
    // to_id : string, 
    content: string,
    db : Database) : Promise<string> => {

        //Basically just send a server message to the user 
        const member_id = content;
        const member = await db.members.findOne({ _id : member_id }) 

        // const memberName = await getMemberNameFromContent(content, db);
        //organizationName : fromOrganizationName, 
        const { organizationId : fromOrganizationId } = await getOrganizationNameAndIdFromUserId(from_id, db);
        // const { organizationId : toOrganizationId }       = await getOrganizationNameAndIdFromUserId(to_id, db);

        // const serverMessageContent = `Thành viên ${fromOrganizationName} muốn chuyển hội viên ${memberName}`
        //Not modify anything except for the action
        const serverMessage = { 
            ...baseMessage, 
            from_organizationId: fromOrganizationId,
            action : ClientMessageAction.APPROVE_DECLINE, 
            content : content }

        if (!member.isTransferring || member.isTransferring === undefined || member.isTransferring === null) {
            db.users.updateMany( //send forward to all user in that organization
                { organization_id : to_organizationId },
                { $addToSet : { messages : serverMessage }},        
            )

            db.members.updateOne({ _id: member_id }, { $set: { isTransferring : true } }, { upsert : false })
            return "true";
        }

        return "this user is being transffered somewhere else";
    }

const handleTransferMessageFromClient = async (clientMessage : ClientMessage,  db :  Database) : Promise<string> => { 
    const { type, action, from_id, to_organizationId, content } = clientMessage; //From front end, so don't have the id, and it's null

    const baseMessage : BaseMessage = {
        from_id,
        _id : type+content,
        type, //Server can only set Info or approve decline for server message
    }

    const handleTransferMessageWithVariables = handleTransferMessage(baseMessage, db);

    switch (action) {
        case ServerMessageAction.APPROVE:
        case ServerMessageAction.DECLINE:
            return handleTransferMessageWithVariables( 
                from_id, to_organizationId, content, action);
        case ServerMessageAction.REQUEST:
            return handleTransferMessageRequest(baseMessage, 
                from_id, to_organizationId, content, db);
        case ServerMessageAction.DELETE:
            // const messageId = content;
            db.users.findOneAndUpdate(
                { _id : from_id}, //Delete all message from all organization
                { $pull : { "messages" : { content : content } }},  
            )
            return "true"
    }
}
const handleRegisterMessageFromClient = async (clientMessage : ClientMessage,  db :  Database) : Promise<string> => {
    const { type, action, from_id, to_id, to_organizationId, content } = clientMessage; //From front end, so don't have the id, and it's null

    //Id now is from_id because it's unique
    const baseMessage : BaseMessage = {
        from_id,
        _id : from_id,
        type, //Server can only set Info or approve decline for server message
    }

    // let serverMessageContent = "";

    switch (action) {
        case ServerMessageAction.REQUEST:
            //Update the registering user
            const registerUser = await db.users.findOne({ _id : from_id });

            await db.users.updateOne(
                { _id : from_id },
                {
                    $set: { //Only update isAdmin here to false
                        //So that the user will not be registring again
                        ...registerUser,
                        isAdmin: false,
                        registering: true
                    }
                }
            )

            const serverMessage = {
                ...baseMessage,
                content,
                action: ClientMessageAction.APPROVE_DECLINE,
                from_organizationId: "", //Nothing, havent been created
            }

            // Send a message to all admins
            await db.users.updateMany(
                { isAdmin : true }, 
                { $addToSet : { messages : serverMessage } })

            return "true";
        case ServerMessageAction.APPROVE:
            //to_organizationId pass in should be ""
            const [operation, orgContent] = content.split("-");
            let newOrganizationId = "";
            if (operation === "create" && to_organizationId === "") {
                //Create new organization by extract the org name and generate id base on that 
                newOrganizationId = orgContent.replace(/\s+/g, '').trim(); //Generate new org Id
                await db.organizations.insertOne(
                        {  
                            _id: newOrganizationId,
                            name: orgContent
                        }
                    )
            } else {
                newOrganizationId = orgContent;
            }

            //If not include "new", there should be to_organizationId provided
            const user = await db.users.updateOne(
                { _id: to_id }, //May be I will pass the to_organization id to the from_id
                //@ts-expect-error : Only push more field into the user
                [
                    { $addFields: { organization_id: newOrganizationId }}, 
                    { $set: { registering: false } }
                ] 
            )
            
            //Delete all message
            await db.users.updateMany(
                { isAdmin: true },
                { $pull : { "messages" : { _id : to_id } }},  
            )


            if (!user || user.result.nModified == 0) {
                return "Cannot find user"
            }

            return "true";
        case ServerMessageAction.DECLINE:
            //Delete the user
            await db.users.findOneAndDelete(
                { _id: to_id } //Admin is from, user register is to
            )
            await db.messages.findOneAndDelete(
                { _id: to_id }
            )
            return "true";
            //Delete the server message to the admin
    }
    return "true";
}


export const messagesResolver: IResolvers = {
    Mutation : { 
        handleMessageFromClient: async (_root: undefined, { input: clientMessage } : { input : ClientMessage}, { db } : { db : Database }) : Promise<string> => {
            switch (clientMessage.type) {
                case MessageType.REGISTER:
                    return handleRegisterMessageFromClient( clientMessage, db );
                case MessageType.TRANSFER:
                    return handleTransferMessageFromClient( clientMessage, db);
            }
        }
    }, 
    Query : {
        loadMessages: async (
            _root: undefined, 
            { viewerId, limit, page } : LoadMessagesArgs, 
            { db } : { db : Database }
            ) : Promise<MessagesData> => {
            //     try {
                    const data : MessagesData = {
                        total : 0,
                        results: [],
                        avatars: []
                    }

                    const res = await db.users.find(
                        { _id : viewerId },
                        //@ts-expect-error this is correct with mongodb
                        {  messages : 1 }
                    ).next();

                    const messages = res.messages;

                    if (messages) {
                        data.results = messages;
                        data.total   = messages.length;
                        for (const message of messages) {
                            const user = await db.users.findOne(
                                { _id : message.from_id }
                            )
                            const avatar = user.avatar;
                            data.avatars.push(avatar);
                        }
                    }

                    return data;
                    // const messages  = 
            //         //Basically load all messages
            //         let cursor = await db.users.find(
            //             { _id : viewerId },
            //             { fields: { messages : 1 } }
            //             );

            //         //No need to sort
            //         cursor.sort({ 
            //             organization_name: 1
            //         })

            //         // cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
            //         cursor = cursor.skip((page - 1) * limit );
            //         cursor = cursor.limit(limit);


            //         data.total =  await cursor.count();
            //         data.results = await cursor.toArray();

            //         return data;


            //     } catch(err) {
            //         throw new Error(`Cannot load message: ${err}`)
            //     }
            },
        getUserInfoFromMessage: async (_root: undefined, { 
            fromId, 
            fromOrganizationId, 
            content,
            type
        } : MessageUserInfoArgs, { db } : { db : Database}) : Promise<MessageUserInfo> => {
            const user = await db.users.findOne({ _id : fromId });
            const userName = user.name;
            console.log("REached")
            let organizationName = "";
            switch (type) {
                case MessageType.TRANSFER:
                    const memberId = content;
                    const organization = await db.organizations.findOne({ _id : fromOrganizationId });
                    const member = await db.members.findOne({_id : memberId });

                    organizationName = organization.name;
                    const memberName = `${member.lastName} ${member.firstName}`;

                    return { userName, organizationName, memberName  };
                case MessageType.REGISTER:
                    // let serverMessageContent = "";
                    const registerUser = await db.users.findOne({ _id : fromId });
                    const [operation, orgContent] = content.split("-");

                    //If exist, orgContent is the exist id
                    //If create, orgContent is the name
                    if (operation === "exist") {
                        const checkOrganization = await db.organizations.findOne({ _id : orgContent });
                        if (checkOrganization) {
                            organizationName = checkOrganization.name;
                        } else {
                            throw new Error("This organization does not exist");
                        }
                    } else {
                        organizationName = orgContent;
                    }
                    return { userName, organizationName,  memberName : "" };
            }
        }
    },
}
