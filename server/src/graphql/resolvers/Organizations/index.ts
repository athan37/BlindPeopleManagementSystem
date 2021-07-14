import { IResolvers } from "apollo-server-express";
import { Organization, OrganizationInput } from "../../../lib/types";


interface OraganizationData {
    total : number,
    results: Organization[]
}

interface UpdateOrganizationArgs {
    organizationId: string, 
    input: OrganizationInput
}

export const organizationResovers : IResolvers = {
    Query: {
        //This one is only for admin
        organizations: async (
            _root : undefined,
            { },
            { db }
        ) : Promise<OraganizationData> => {
            try { 
                const data = {
                     total : 0,
                     results : []
                }
                const cursor = await db.organizations.find({});

                cursor.sort({ 
                    _id: 1
                })

                const total = cursor.count();
                const results = cursor.toArray();

                data.total = total;
                data.results = results;

                return data
            } catch (e) {
                throw e
            }
        }
    }, 
    Mutation : {
        updateOrganization: async (
            _root : undefined,
            { organizationId, input }: UpdateOrganizationArgs,
            { db }
            ) : Promise<boolean> =>  {
                //When update this, all organization id in members, user,
                //orgtanization 
                //But we don't change the _id, so it will be fine
                try {
                    const updateRes = await db.organizations.updateOne(
                        { _id : organizationId}, 
                        { $set : input}
                    )

                    console.log(updateRes.result)
                    return updateRes.result.n == 1
                } catch (e) {
                    throw e
                }
            }
    }, 
    Organization : {
        //Trivial resolvers provide help for this, no need to add thing
    }
}