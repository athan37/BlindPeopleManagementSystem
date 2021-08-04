const { index } = require('cheerio/lib/api/traversing');
const { MongoClient, session, ObjectId } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://user1234:user1234@cluster0.eupdj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = {
        messages : client.db("BPMS").collection("messages"),
        users : client.db("BPMS").collection("users"),
        organizations : client.db("BPMS").collection("organizations"),
        members : client.db("BPMS").collection("members")
    }

    // db.members.dropIndex("firstName_text")
    // db.members.createIndex({ 
    //     lastName: "text",
    //     firstName: "text",
    //     birthYear: "text",
    //     address: "text"

    //This message is generated when the user clicked on approve on the front end
    const clientMessage_Approve = {
        _id: "TRANSFER" + "bd9c672ece4c2d306bbd792a369414d938d66c35ff8f4daf09f45f88a931c060",
        type: "TRANSFER",
        action: "APPROVE", //Similar with delete, will do later
        from_id: "115147470592336775121",
        to_id: "112830123241869383734",
        content: "bd9c672ece4c2d306bbd792a369414d938d66c35ff8f4daf09f45f88a931c060"
    }

    const clientMessage_Decline = {
        _id: "TRANSFER" + "8374195adb325ca3da41ad17f44a1eeaee33c91caf2ecf5a8f347be5d42ffa70",
        type: "TRANSFER",
        action: "DECLINE", //Similar with delete, will do later
        from_id: "107589725800820759904", //Notice this is being reversed because the message is being sent back
        to_id: "112830123241869383734",
        content: "8374195adb325ca3da41ad17f44a1eeaee33c91caf2ecf5a8f347be5d42ffa70"
    }

    const clientMessage_Request = {
        //Request from vanngao to anhthan, long bien to thanh xuan
        _id: "TRANSFER" + "bd9c672ece4c2d306bbd792a369414d938d66c35ff8f4daf09f45f88a931c060",
        type: "TRANSFER",
        action: "REQUEST",
        to_id: "112830123241869383734",
        from_id: "115147470592336775121", //Notice this is being reversed because the message is being sent back
        content: "bd9c672ece4c2d306bbd792a369414d938d66c35ff8f4daf09f45f88a931c060"
    }

    const clientMessage_Request2 = {
        //Request from vanngao to anhthan, long bien to thanh xuan
        _id: "TRANSFER" + "8374195adb325ca3da41ad17f44a1eeaee33c91caf2ecf5a8f347be5d42ffa70",
        type: "TRANSFER",
        action: "REQUEST",
        to_id: "112830123241869383734",
        from_id: "107589725800820759904", //Notice this is being reversed because the message is being sent back
        content: "8374195adb325ca3da41ad17f44a1eeaee33c91caf2ecf5a8f347be5d42ffa70"
    }

    // const res = await search(db, {}, null, "", 1, 6)

    const { type, action, from_id, to_id, content } = clientMessage_Decline; //From front end, so don't have the id, and it's null

    const baseMessage = {
        _id : type+content,
        type, //Server can only set Info or approve decline for server message
        from_id, 
        to_id,
    }

    // const func = handleTransferMessage(baseMessage, db)
    // const res = await func(
    //     from_id,
    //     to_id,
    //     content, 
    //     action,
    //  );


    // const res = await handleTransferMessageRequest(
    //     baseMessage,
    //     from_id,
    //     to_id,
    //     content, 
    //     db
    //  );

    const res = await db.users.find(
        { _id : "107589725800820759904"},
        {  messages : 1 }
    ).next()

    const messages = res.messages;

    console.log(messages)

    // const func = handleTransferMessage(baseMessage, db)
    // const res = await func(
    //     from_id,
    //     to_id,
    //     content, 
    //     action
    // )

    // console.log(res)
    // console.log("Response scuk ?")
    // console.log("Successfully")
    // await acceptRequest(client, "60e56492c4eedc060286a9f9")
    // getOrganizationsStats({ organizationId: "Maidịch", db})
    // await organization({ organizationId: "CầuTiêu", db})
}

const handleTransferMessage = (baseMessage, db) => async (
        from_id ,
        to_id,
        content,
        action,
    ) => {

        console.log("Fuck")

    // Get the id of the request message to delete it 
    const idMessageToDelete = baseMessage.type + content;

    const transferMemberName = await getMemberNameFromContent(content, db);
    console.log("Readch hể,", transferMemberName)
    const { organizationName : fromOrganizationName } = await getOrganizationNameAndIdFromUserId(from_id, db);
    console.log("Readch hểdsaf,", fromOrganizationName)
    const { organizationId: toOrganizationId } = await getOrganizationNameAndIdFromUserId(to_id, db);
    console.log("Readch hểdsaf,", toOrganizationId)

    //Generate the content base on the action that the client want the server to do
    const serverMessageContent = action === "APPROVE" ?
    `Yêu cầu chuyển hội viên ${transferMemberName} đến ${fromOrganizationName} được xác nhận` : 
    `Yêu cầu chuyển hội viên ${transferMemberName} đến ${fromOrganizationName} bị từ chối` ;

    //Delete the request message from the sender 
    console.log("Ida asdf", idMessageToDelete)
    db.users.findOneAndUpdate( //delete message
        { _id : to_id }, //To is this user, or the viewer id 
        { $pull : { "messages" : { _id : idMessageToDelete } }},  
    )

    console.log("I'ma reach thisds")
    //Send back announcement so that the front end can display it
    //Client action for both case is INFO
    const serverMessage = { ...baseMessage, action : "INFO", content : serverMessageContent }
    db.users.findOneAndUpdate( //send back announcement
        { _id : from_id },
        { $addToSet : { messages : serverMessage }},        
    )

    //Approve the member and set isTransfer to false if ServerMessageAction is APPROVE
    if (action === "APPROVE") {
        const member_id = content;
        console.log("Fucking member id", member_id)
        db.members.updateOne({ _id: member_id }, { $set : { organization_id : toOrganizationId, isTransferring : false}} , { upsert : false })
    } 

    //Update nothing if the action is decline

    return "true"
}

const getMemberNameFromContent = async (content, db) => {
    // content will be in format "members-member_id"
    const member_id = content;
    //Must find a result, otherwise, check again sending procedure
    const member = await db.members.findOne({ _id : member_id }) 
    return `${member.lastName} ${member.firstName}`
}

const getOrganizationNameAndIdFromUserId = async (user_id, db) => {
    const user = await db.users.findOne({ _id: user_id });
    const organizationId = user.organization_id;
    const organization = await db.organizations.findOne({ _id: organizationId });
    const organizationName = organization.name;

    return { organizationName, organizationId };
}

const handleTransferMessageRequest = async ( baseMessage, from_id, to_id, content, db ) => {
    //Basically just send a server message to the user 
    const member_id = content;
    const member = await db.members.findOne({ _id : member_id }) 

    const memberName = await getMemberNameFromContent(content, db);
    const { organizationName : fromOrganizationName } = await getOrganizationNameAndIdFromUserId(from_id, db);
    const { organizationId : toOrganizationId }       = await getOrganizationNameAndIdFromUserId(to_id, db);
    const serverMessageContent = `Thành viên ${fromOrganizationName} muốn chuyển hội viên ${memberName}`
    //Not modify anything except for the action
    const serverMessage = { ...baseMessage, action : "APPROVE_DECLINE", content : serverMessageContent }

    if (!member.isTransferring || member.isTransferring === undefined || member.isTransferring === null) {
        db.users.findOneAndUpdate( //send forward
            { _id : to_id },
            { $addToSet : { messages : serverMessage }},        
        )

        db.members.updateOne({ _id: member_id }, { $set: { organization_id : toOrganizationId, isTransferring : true } }, { upsert : false })

        return "true";
    } else {
        return "this user is being transffered somewhere else";
    }
}























































































































async function organization({ organizationId, db } ) {
    const data = await db.organizations.findOne({ _id : organizationId });
    console.log(data)
    return data
}

async function search(db, filter, keyword, organizationId, page, limit) {

    const data = {
        total : 0,
        results  : []
    }

    let membersQuery = {};

    //Must have search before everything, rule from mongo

    if (keyword && keyword !== "") { //or input...
        membersQuery = {
            '$text': {
                '$search' : keyword
            },
        }
    }

    if (organizationId && organizationId !== "") {
        membersQuery = { ...membersQuery,  organization_id: organizationId }
    }

    if (filter) {
        membersQuery = { ...membersQuery, ...filter }
    }

    const agg = [
        {
          '$match': membersQuery
        }, 
        // {
        //   '$set': {
        //     'score': {
        //       '$meta': 'textScore'
        //     }
        //   }
        // },
        {
          '$sort' : keyword ? { 'score' : -1 } : { 'firstName' : -1}
        },
        {
            $facet: {
                results: [{
                    $skip: page > 0 ? (page - 1) * limit : 0
                }, {
                    $limit: limit 
                }],
                totalCount: [{
                    $count: 'count'
                }]
            }
        }, 
        {
            $unwind: {
                path: "$totalCount"
            }
        }
      ];

    console.log("This is the args", agg)
    
    let cursor = await db.members.aggregate(agg).next()

    // cursor.filter(item => item.score >= 0.70)

    data.total  = cursor.totalCount["count"];
    data.results = cursor.results;

    return data
}


async function getOrganizationsStats({ organizationId, db }) {
    const matchOrganization = 
        {
            "$match" : {
                organization_id : organizationId,
            }
        };

    const data = {
        total : 0,
        totalMale : 0,
        totalFemale : 0,
        avgAge : 0,
        totalBusCard: 0,
        totalFWIT: 0,
        totalDisabilityCert: 0,
        medianIncome: 0,
        maxOrganization: "",
        medianReligion: "Budhha",
        medianEducation: "",
        totalMoreThan2Languages: 0,
        jobs: {
            jobs: ["Worker"],
            numsPerJob: [90]
        },
        brailleData: {
            numsPerLevel: [9]
        }
    }

    data.totalMale   = await db.members.countDocuments({"organization_id" : organizationId, "gender": "M"})
    data.totalFemale = await db.members.countDocuments({"organization_id" : organizationId,"gender": "FM"})
    data.total       = data.totalFemale + data.totalMale;
    
    //Get ave age
    const aveYearObj     =  await db.members.aggregate(
        [
            matchOrganization,
            {
                "$group": 
                {
                    "_id": null,
                     "avgAge": {
                       "$avg": "$birthYear"
                     }
                 }
            }
        ]
    ).next();
    
    // (Sum(current year - birth year)) / N = currentyear - sum(birthYear)/N
    data.avgAge =  + (new Date().getFullYear() - aveYearObj.avgAge).toFixed(0);

    data.totalBusCard        = await db.members.countDocuments({"organization_id" : organizationId, "busCard": true})
    data.totalDisabilityCert = await db.members.countDocuments({"organization_id" : organizationId, "disabilityCert": true})
    data.totalFWIT           = await db.members.countDocuments({"organization_id" : organizationId, "familiarWIT": true})

    const maxQueryByGroup    = (field) => {
        const arr = 
        [
            {
                $match:  {
                    _id: {
                        $exists: true
                    }
                }
            },
            {
                $group : {
                        _id: `$${field}`,
                        value : {$sum : 1}
                }
            },
            {
                $sort : { 
                    value: -1
                }
            },        
            {
                $limit : 1
            }
        ]
        return arr
    }
    data.medianIncome    = await db.members.aggregate(maxQueryByGroup("incomeType")).next()
    data.maxOrganization = await db.members.aggregate(maxQueryByGroup("organization_id")).next()
    data.medianReligion  = await db.members.aggregate(maxQueryByGroup("religion")).next()
    data.medianEducation = await db.members.aggregate(maxQueryByGroup("education")).next()
    const languagesData  = await db.members.aggregate(
        [
            matchOrganization,
            {
                $group : 
                    {
                        _id: { $size: "$languages" },
                        count: { $sum : 1 }
                    }
            },
            {
                $match : 
                    {
                        _id: { $gte: 2 },
                    }
            },
            {
                $group : 
                    {
                        _id: null,
                        total: {$sum : "$count"}
                    }
            },
            {
                $unset : "_id"
                
            }
        ]
    ).next()


    data.totalMoreThan2Languages = languagesData.total;

    data.jobs = await db.members.aggregate([
        matchOrganization,
        {
            $group : 
                {
                    _id : "$occupation",
                    value: { "$sum" : 1 }
                }
        }
    ]).toArray();

    data.brailleData = await db.members.aggregate([
        matchOrganization,
        { 
            $group : 
                {
                    _id : "$brailleComprehension",
                    value: { "$sum" : 1 }
                }
        }
    ]).toArray();
    console.log(data)
}

async function acceptRequest(client, message_id) {
    const db = {
        messages : client.db("BPMS").collection("messages"),
        users : client.db("BPMS").collection("users"),
        organizations : client.db("BPMS").collection("organizations")
    }
    const session = client.startSession();
    try { 
        const transactionResults = await session.withTransaction( async () => {
            const message = (
                    await db.messages.findOneAndDelete({id : message_id})
                ).value; //This operation should return an object, otherwise => sth really wrong happen
                //Because that message id is sent from server

            if (!message) {
                // session.abortTransaction();
                throw new Error("Message was not found")
            }

            const { organization_name }  = message;
            const organization =  await db.organizations.findOne( { _id: organization_name } )

            console.log("Reached here and creating organization", organization)
            
            if (!organization) {

                await db.organizations.insertOne({  _id: organization_name })

            }


            const user = await db.users.updateOne(
                {_id: message.user_id},
                [
                    { $addFields: { orgnization_id: organization_name }}, 
                    { $set: { registering: false } }
                ] 
            )

            if (!user || user.result.nModified == 0) {
                throw new Error(`Cannot find user`)
            }


        console.log("Request is successfully approved")
        }, 
        { 
            readConcern: { level: 'majority' } 
        })


        session.commitTransaction();
    
        console.log(transactionResults)
    
    } catch (e) {
        console.log("Hey, there is an error", e)
    } finally {
        session.endSession();
    } 
}

async function updateRegistering(client, user_id) {

    const db = {
        messages : client.db("BPMS").collection("messages"),
        users : client.db("BPMS").collection("users"),
        organizations : client.db("BPMS").collection("organizations")
    }


    const organization_id = new ObjectId()
    const user = await db.users.updateOne(
        {_id: user_id},
        [
            { $addFields: { orgnization_id: organization_id.toString() }}, 
            { $set: { registering: false } }
        ]
    )

    if (!user || user.result.nModified == 0) {
        console.log("Hei, cannot found")
    }

    // console.log("You've just updated this user ", user)
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases");
    databasesList.databases.forEach(db => {
        console.log(db.name);
    })
}

async function createListing(client, user) {
    const result = await client.db("BPMS").collection("users").insertOne(user);
    console.log(result)
}



main().catch(console.error);