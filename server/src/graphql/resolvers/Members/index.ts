import { IResolvers } from "apollo-server-express";
import { Member } from "../../../lib/types";
import { ObjectId } from "mongodb";

interface MembersData {
    total : number;
    results : Member[];
}
interface MembersArgs {
    organizationId : string
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

                const memberQuery = {};

                if (organizationId) {
                    memberQuery["organization_id"] = new ObjectId(organizationId);
                }


                console.log("Hello", memberQuery)

                const cursor = await db.members.find(memberQuery);

                cursor.sort({
                    name : 1
                })

                data.total = cursor.count();
                data.results = cursor.toArray();

                return data;
                
            } catch (err ) {
                throw new Error(`Failed to query members ${err}`);
            }
        }
    },
    Member : {
        //Have to write sub-resolver for id because it's orginally id_
        id : (member: Member) : string => {
            return member._id.toString();
        },
    }
}