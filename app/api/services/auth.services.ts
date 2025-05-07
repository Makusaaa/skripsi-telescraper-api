import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import * as UsersHelper from "../helper/users.helper"
import { CustomError } from "../middleware/error-handler.middleware"
import status from "http-status"
import config from "../constraints/config";
import { db } from "../database/client";


const client = new OAuth2Client(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET
);

export const verifyUserLogin = async (tokenId: string): Promise<Object> => {
    const ticket = await client.verifyIdToken({
        idToken: tokenId.slice(7),
        audience: config.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload?.aud != config.GOOGLE_CLIENT_ID)
        throw new CustomError("Unauthorized Google Login",status.UNAUTHORIZED)
    
    const { email } = payload!;
    const user = await UsersHelper.getUserByEmail(db, email!);

    if(user)
    {
        const { role, userid: user_id, email, fullname: name, companyid} = user
        return jwt.sign({ email, name, role, user_id, companyid}, config.JWT_SECRET_KEY);
    }
    else
    {
        throw new CustomError("Email not registered",status.UNAUTHORIZED)
    }
};
