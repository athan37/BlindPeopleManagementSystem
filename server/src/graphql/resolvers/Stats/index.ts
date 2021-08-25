import { IResolvers } from "apollo-server-express";
import * as Enum from "../../../lib/enum";

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



interface CustomCountArgs {
    organizationId?: string;
    input : FilterArgs;
}

export const statsResovers : IResolvers = {
    Query : {
        getOrganizationsStats : async (_root : undefined, { organizationId } : OrganizationsStatsArgs, { db }) : Promise<Stats>=> {
            const MAX_ORGANIZATIONS = 1000; //If reached this, I will make a query to count the organizations
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

            const defaultGraphData = { _id: "", value: 0 }

            const data = {
                //Int return -> For total sth
                total : 0,
                totalMale : 0,
                totalFemale : 0,
                avgAge : 0,
                totalBusCard: 0,
                totalFWIT: 0,
                totalDisabilityCert: 0,
                totalICP: 0,
                totalHS: 0,
                totalBMC: 0,
                totalMoreThan2Languages: 0,
                //Int return with label -> For data that has a label
                medianIncome:    defaultGraphData,
                maxOrganization: defaultGraphData,
                minOrganization: defaultGraphData,
                medianReligion:  defaultGraphData,
                medianEducation: defaultGraphData,
                //List of int return with labels -> for drawing graphs
                jobs:                [ defaultGraphData ],
                brailleData:         [ defaultGraphData ],
                educations:          [ defaultGraphData ],
                postEducations:      [ defaultGraphData ],
                politicalEducations: [ defaultGraphData ],
                governLevels:        [ defaultGraphData ],
                socialWorkLevels:    [ defaultGraphData ],
                languages:           [ defaultGraphData ]
            }

            //======================= Int return ===============================

            const total = await db.members.find(queryOrganization).count();
            if (total === 0) { //If there is no data
                return data;
            }

            data.totalMale   = await db.members.countDocuments({...queryOrganization, "gender": Enum.Gender.Nam}) || 0;
            data.totalFemale = await db.members.countDocuments({...queryOrganization, "gender": Enum.Gender.Nữ}) || 0;
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
            data.totalFWIT           = await db.members.countDocuments({...queryOrganization, "familiarWIT": true})
            data.totalDisabilityCert = await db.members.countDocuments({...queryOrganization, "disabilityCert": true})
            data.totalICP = await db.members.countDocuments({...queryOrganization, "isCommunistPartisan": true})
            data.totalHS  = await db.members.countDocuments({...queryOrganization, "healthInsuranceCard": true})
            data.totalBMC  = await db.members.countDocuments({...queryOrganization, "blindManageCert": true})


            //======================= Label + Int return ===============================
            const maxQueryByGroup    = (field : string, limit = 1) => {
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
                        $limit : limit
                    }
                ]
                return arr
            }
            data.medianIncome    = await db.members.aggregate(maxQueryByGroup("incomeType")).next()
            data.medianReligion  = await db.members.aggregate(maxQueryByGroup("religion")).next()
            data.medianEducation = await db.members.aggregate(maxQueryByGroup("education")).next()
            const organizations  = await db.members.aggregate(maxQueryByGroup("organization_id", MAX_ORGANIZATIONS)).toArray()
            data.maxOrganization = organizations[0]
            data.minOrganization = organizations.slice(-1)[0]
            //Get the name of the organizaiton
            const maxOrganization   = await db.organizations.findOne({ _id : data.maxOrganization._id });
            const minOrganization   = await db.organizations.findOne({ _id : data.minOrganization._id });
            data.maxOrganization = { ...data.maxOrganization, _id: maxOrganization.name };
            data.minOrganization = { ...data.minOrganization, _id: minOrganization.name }
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

            data.totalMoreThan2Languages = languagesData && languagesData.total ? languagesData.total : 0;

            //======================= List of [Label + Int] return ===============================

            const graphAggQuery = ( field: string ) => [
                matchOrganization,
                {
                    $group : 
                        {
                            _id : `$${field}`, //Have to have an $ before the field name
                            value: { "$sum" : 1 }
                        }
                }
            ]



            data.jobs = await db.members.aggregate(
                graphAggQuery("occupation")
            ).toArray();

            data.brailleData = await db.members.aggregate(
                graphAggQuery("brailleComprehension")
            ).toArray();

            data.educations = await db.members.aggregate(
                graphAggQuery("education")
            ).toArray();

            data.postEducations = await db.members.aggregate(
                graphAggQuery("postEducation")
            ).toArray();

            data.politicalEducations = await db.members.aggregate(
                graphAggQuery("politicalEducation")
            ).toArray();

            data.governLevels = await db.members.aggregate(
                graphAggQuery("governmentAgencyLevel")
            ).toArray();

            //Problem due to some people don't have this field => add this info to database
            data.socialWorkLevels = await db.members.aggregate(
                graphAggQuery("socialWorkLevel")
            ).toArray();

            data.languages  = await db.members.aggregate(
                [
                    matchOrganization,
                    {
                        $unwind: {
                            path: "$languages"
                        }
                    },
                    {
                        $group : 
                            {
                                _id: "$languages",
                                value: { $sum : 1 }
                            }
                    },
                    {   //Filter out unexist fields
                        $match : 
                            {
                                value: { $gt: 0 },
                            }
                    },
                ]
            ).toArray()
            // data.languages = await db.members.aggregate(
            //     graphAggQuery("languages")
            // ).toArray();

            return data;
        
        },
        numsByAge : async (_root : undefined, { organizationId, start, end } : NumsByAgeArgs, { db }) : Promise<number>=> {
            const query = {};

            if (organizationId || organizationId !=="") {
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

            return total ? total : 0;
        },
        customCount : async (_root : undefined, { organizationId, input } : CustomCountArgs, { db }) : Promise<number>=> {
            let query = {};

            if (organizationId && organizationId !=="") {
                query["organization_id"] = organizationId;
            }

            query = {
                ...query, ...input
            }

            const cursor = db.members.find(query);
            const total = cursor.count();
            return total;
        }
    },
} 
