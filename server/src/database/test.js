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
    // await acceptRequest(client, "60e56492c4eedc060286a9f9")
    // getOrganizationsStats({ organizationId: "Maidịch", db})
    await organization({ organizationId: "CầuTiêu", db})
}

async function organization({ organizationId, db } ) {
    const data = await db.organizations.findOne({ _id : organizationId });
    console.log(data)
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