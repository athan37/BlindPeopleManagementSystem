const { MongoClient, session, ObjectId } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://user1234:user1234@cluster0.eupdj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // await acceptRequest(client, "60e56492c4eedc060286a9f9")
    acceptRequest(client, "60e953af45ed29f36cda87a5");

    
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