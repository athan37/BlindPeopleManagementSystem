import { IResolvers } from "apollo-server-express";
import { Google} from "../../../lib/api";
import { Database, User, Viewer } from "../../../lib/types";
import crypto from "crypto";
import { Request, Response } from "express";

export interface LogInArgs {
    input: { code: string } | null;
}

const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_END == "development" ? false : true
}

const logInViaCookie = async (token: string, db: Database, req: Request, res: Response) : Promise<User | undefined> => {

    console.log("This is the signed cookie, let see the diff", req.signedCookies.viewer)
    const updateRes = await db.users.findOneAndUpdate(
        { _id : req.signedCookies.viewer },
        { $set: { token }},
        { returnOriginal: false}
    )

    const viewer = updateRes.value;

    if (!viewer) {
        res.clearCookie("viewer", cookieOptions);
    }

    console.log("Viewer from login via cookie", viewer)
    return viewer;
}

const logInViaGoogle = async (
    code: string, 
    token: string, 
    db: Database,
    res: Response
) : Promise<User | undefined> => {
    const { user } = await Google.logIn(code);

    if (!user) throw new Error("Google login error, try again");

    //https://developers.google.com/people/api/rest/v1/people?hl=vi#Person
    const userNamesList = user.names && user.names.length ? user.names : null;
    const userPhotosList = user.photos && user.photos.length ? user.photos : null;
    const userEmailsList = user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;

    const userName = userNamesList ? userNamesList[0].displayName : null;
    //https://developers.google.com/people/api/rest/v1/people?hl=vi#Person.Source
    const userId = userNamesList && userNamesList[0].metadata && userNamesList[0].metadata.source
        ? userNamesList[0].metadata.source.id
        : null;

    const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
    const userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

    if (!userId || !userName || !userAvatar || !userEmail) {
        throw new Error("Google login error");
    }

    console.log("This is the user id", userId);

    const updateUser = await db.users.findOneAndUpdate(
        { _id: userId },
        { 
            $set: {
                name: userName,
                avatar: userAvatar,
                contact: userEmail,
                token 
            }
        },
        { returnOriginal: false}
    );


    let viewer = updateUser.value;

    console.log("This is the viewer I'm looking for", viewer)

    if (!viewer) {
        const insertResult = await db.users.insertOne({
            _id: userId,
            token, 
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            isAdmin: undefined,
        })
        //Get data here and make another form to update it
        //=> Make another resolver, may be called it add additional user data
        viewer = insertResult.ops[0]

        return viewer;
    }

    //Set the cookie after login using google, this removes the need to login again when you are not using google
    res.cookie("viewer", userId, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60 * 1000
    });


    return viewer;


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
        logIn: async (_root : undefined, { input } : LogInArgs, { db, req, res } : { db : Database, req: Request, res: Response }) : Promise<Viewer> => {
            try {
                const code = input ? input.code : null;
                //Make a session token
                const token = crypto.randomBytes(16).toString("hex");

                const viewer: User | undefined = code ? await logInViaGoogle(code, token, db, res) : await logInViaCookie(token, db, req, res);

                if (!viewer) {
                    return { didRequest: true };
                }

                return { 
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    isAdmin: viewer.isAdmin,
                    organization_id: viewer.organization_id,
                    registering: viewer.registering,
                    didRequest: true
                }
            } catch (e) {
                throw e
            }
        },
        
        logOut: async (_root: undefined, {}, { res } : { res: Response }) : Promise<Viewer> =>  { 
            try {
                res.clearCookie("viewer", cookieOptions);
                return { didRequest: true };
            } catch (err) {
                throw new Error(`Failed to log out: ${err}`)
            }
        },
    },
    //Notes: viewer is not inside mutation, it's just a type
    Viewer : {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id;
        },
    }

}

   