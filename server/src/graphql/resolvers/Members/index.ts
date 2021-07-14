import { IResolvers } from "apollo-server-express";
import { InputMember, Member } from "../../../lib/types";
import { createHashFromUser } from "../../../lib/utils";

interface MembersData {
    total : number;
    results : Member[];
}
interface MembersArgs {
    organizationId : string
}

interface UpsertMemberArgs {
    old ?: InputMember
    new  : InputMember
}

export const memberResolvers : IResolvers = {
    Query : {
        members : async(
            _root: undefined,
            { organizationId } :  MembersArgs , 
            { db } 
        ) : Promise<MembersData> => {
            try { 
                const data = {
                    total : 0,
                    results  : []
                }

                const membersQuery = {};

                if (organizationId) {
                    membersQuery["organization_id"] = organizationId;
                }


                const cursor = await db.members.find(membersQuery);

                cursor.sort({
                    name : 1
                })

                data.total = cursor.count();
                data.results = cursor.toArray();

                return data;
                
            } catch (err ) {
                throw new Error(`Failed to query members ${err}`);
            }
        },
        member : async(_root: undefined, {  organizationId, id } : { id : number, organizationId : string}, { db }) : Promise<Member> => {
                const memberQuery = {}

                if (organizationId) {
                    memberQuery["organization_id"] = organizationId;
                }

                memberQuery["_id"] = `${id}`

                const member = db.members.findOne(memberQuery);

            return member;
        },
    },
    Mutation: {
        upsertMember : async(_root: undefined, args :  UpsertMemberArgs , { db }) : Promise<string> => {
            try {
                //On both case, we need to create new hash and set it to the _id field
                const newHash = createHashFromUser(args.new);
                args.new["_id"] = newHash;
                //If old is provided, delete it to update a new _id
                let insertRes = undefined;
                if (args.old) {
                    const oldHash = createHashFromUser(args.old)
                    const deleteRes = await db.members.deleteOne(
                        { _id : oldHash }
                    )
                    if (deleteRes.result.n == 1) {
                        insertRes = await db.members.insertOne(args.new)
                        
                        return "true"
                    } else {
                        return "Cannot delete before insert. May be due to wrong hash"
                    }
                } 

                const user = await db.members.findOne({ _id : args.new["_id"] })

                if (!user)  {
                    insertRes = await db.members.insertOne(args.new)
                    return insertRes.result.n == 1 ? "true" : "cannot insert user"
                } else {
                    return "Duplicate user"
                }

            } catch (e) {
                throw e
            }
        }, 
        deleteMember : async (_root: undefined, { memberId } : { memberId : string }, { db }) : Promise<boolean> => {
            const deleteRes = await db.members.deleteOne(
                { _id: memberId }
            )
            return deleteRes ? deleteRes.result.n == 1 : false
        }
    },
    Member : {
        //Have to write sub-resolver for id because it's orginally id_
           id : member => member._id
    }
}