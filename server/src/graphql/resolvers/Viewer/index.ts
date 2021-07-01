import { IResolvers } from "apollo-server-express";
import { Google } from "../../../lib/api";
import { Viewer } from "../../../lib/types";

export interface LogInArgs {
    input: { code: string } | null;
}

export const viewerResolvers: IResolvers = {
    Query : {
        authUrl: () => {
            try { 
                return Google.authUrl
            } catch(err) {
                throw new Error(`Failed to get auth url from Google Api: [ ${err} ]`)
            }
        }
    },
    Mutation : { 
        logIn: (string) =>  console.log(string)
    },
    Viewer : {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id;
        },

    }

}

   