import { IResolvers } from "apollo-server-express";
import { InputMember, Member } from "../../../lib/types";
import { createHashFromUser } from "../../../lib/utils";

interface MembersData {
    total : number;
    results : Member[];
}

interface FilterArgs {
    gender ?: string
    ethnicity ?: string
    religion ?: string
    occupation ?: string
    isCommunistPartisan ?: boolean
    marriage?: string
    eyeCondition?: string
    education ?: string
    postEducation ?: string
    politicalEducation ?: string
    governmentAgencyLevel ?: string
    brailleComprehension ?: string
    languages ?: string
    familiarWIT?: boolean
    healthInsuranceCard ?: boolean
    disabilityCert ?: boolean
    busCard ?: boolean
    supportType ?: string
    incomeType ?: string
}

interface SearchFilter {
    keyword: string,
    filter: FilterArgs;
}

interface MembersArgs {
    organizationId : string,
    limit: number,
    page: number, 
    input?: SearchFilter
}

interface UpsertMemberArgs {
    old ?: InputMember
    new  : InputMember
}

export const memberResolvers : IResolvers = {
    Query : {
        members : async(
            _root: undefined,
            { organizationId, limit, page, input } :  MembersArgs , 
            { db } 
        ) : Promise<MembersData> => {
            try { 

                let initialInput = {
                    keyword: undefined,
                    filter: undefined,
                }

                const data = {
                    total : 0,
                    results  : []
                }

                if (input) {
                    initialInput = input
                }

                const { filter, keyword } = initialInput;

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
                    {
                        '$sort' : { 'firstName' : 1 }
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

                // console.log("This is the args", agg)
                
                const cursor = await db.members.aggregate(agg).next()

                // cursor.filter(item => item.score >= 0.70)

                data.total  = cursor.totalCount["count"];
                data.results = cursor.results;

            return data
                
            } catch (err ) {
                // Error is mostly because cannot read the totalCount when there
                // is no data
                // throw new Error(`Failed to query members ${err}`);
                return {
                    total : 0,
                    results  : []
                }
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
        // searchMember : async(_root: undefined, { filter, keyword } : { filter: any, keyword: string }, { db }) : Promise<MembersData> => {


        //     return null
        // }
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