import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

export const login = async (req, res) => {
    console.log(req.headers.authorization);
    const tokenId = req.headers.authorization;
    const ticket = await client.verifyIdToken({
        idToken: tokenId.slice(7),
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    if (payload?.aud != process.env.GOOGLE_CLIENT_ID)
        return res.send("Unauthorised");
    const { email, name } = payload!;
    const authToken = jwt.sign({ email, name }, process.env.SECRET);

    res.json({ authToken });
}

export const access = (req, res) => {
    try {
        const authToken = req.headers.authorization;
        const decoded = jwt.verify(authToken.slice(7), process.env.SECRET);
    } catch (e) {
        return res.json({ data: "NOT Authorised" });
    }
    res.json({ data: "Authorised" });
}