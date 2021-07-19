import { IResolvers } from "apollo-server-express";
import { Religion } from "../../../lib/enum";

interface GraphData {
    _id : string;
    value: number;
}

interface Stats {
    total: number;
    totalMale : number;
    totalFemale : number;
    avgAge: number;
    totalBusCard: number;
    totalFWIT: number;
    totalDisabilityCert: number;
    medianIncome: GraphData;
    maxOrganization?: GraphData; //May not return if is admin
    medianReligion: GraphData; 
    medianEducation: GraphData;
    totalMoreThan2Languages: number;
    jobs: GraphData[];
    brailleData: GraphData[];
}

interface OrganizationsStatsArgs {
    organizationId ?: number;
}

interface NumsByAgeArgs {
    organizationId?: string;
    start : number;
    end : number;
}

export const statsResovers : IResolvers = {
    Query : {
        getOrganizationsStats : async (_root : undefined, { organizationId } : OrganizationsStatsArgs, { db }) : Promise<Stats>=> {
            let matchOrganization =
            {
                "$match" :  
                {
                    _id: {
                        $exists: true
                    }
                }
            }; //This is only for match everything

            let queryOrganization = {};


            if (organizationId) {
                matchOrganization = 
                    {
                        "$match" : {
                            //@ts-expect-error This one is intentional
                            organization_id : organizationId,
                        }
                    };
                
                //Only add filter if there is organization Id
                queryOrganization = {
                    organization_id: organizationId
                }
            }


            const data = {
                total : 0,
                totalMale : 0,
                totalFemale : 0,
                avgAge : 0,
                totalBusCard: 0,
                totalFWIT: 0,
                totalDisabilityCert: 0,
                medianIncome: { _id: "", value: 0},
                maxOrganization: { _id: "", value: 0},
                medianReligion:  { _id: "", value: 0},
                medianEducation: { _id: "", value: 0},
                totalMoreThan2Languages: 0,
                jobs: [{_id: "", value: 0}],
                brailleData: [{_id: "", value: 0}]
            }

            const total = await db.members.find(queryOrganization).count();
            if (total === 0) { //If there is no data
                return data;
            }

            data.totalMale   = await db.members.countDocuments({...queryOrganization, "gender": "M"})
            data.totalFemale = await db.members.countDocuments({...queryOrganization, "gender": "FM"})
            data.total = data.totalFemale + data.totalMale;
            
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

            data.totalBusCard        = await db.members.countDocuments({...queryOrganization, "busCard": true})
            data.totalDisabilityCert = await db.members.countDocuments({...queryOrganization, "disabilityCert": true})
            data.totalFWIT           = await db.members.countDocuments({...queryOrganization, "familiarWIT": true})

            const maxQueryByGroup    = (field : string) => {
                const arr = 
                [
                    matchOrganization,
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
                matchOrganization ? matchOrganization : null,
                { 
                    $group : 
                        {
                            _id : "$brailleComprehension",
                            value: { "$sum" : 1 }
                        }
                }
            ]).toArray();

            return data;
        
        },
        numsByAge : async (_root : undefined, { organizationId, start, end } : NumsByAgeArgs, { db }) : Promise<number>=> {
            const query = {};

            if (organizationId) {
                query["organization_id"] = organizationId;
            }
            const currentYear = new Date().getFullYear();
            //Ex: Current year = 2021, look for person in age 18-20 => 
            //Should find in range 2003-2001, which year switched : 2001 -> 2003
            const endYear   = currentYear - start;
            const startYear = currentYear - end;

            const total = await db.members.countDocuments(
                {...query, "birthYear": {"$gte": startYear, "$lte": endYear}}
            )
            return total
        }
    },
} 
