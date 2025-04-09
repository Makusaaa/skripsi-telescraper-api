import 'dotenv/config';
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { verifyUserLogin } from '../services/auth.services';
import status from "http-status"

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

export const login = async (req, res) => {
    console.log(req.headers.authorization);
    const tokenId = req.headers.authorization;

    const authToken = await verifyUserLogin(tokenId);

    res.status(status.OK).json({ authToken });
}

export const access = (req, res) => {
    try {
        const authToken = req.headers.authorization;
        const decoded = jwt.verify(authToken.slice(7), process.env.SECRET!);
    } catch (e) {
        return res.json({ data: "NOT Authorised" });
    }
    res.json({ data: "Authorised" });
}