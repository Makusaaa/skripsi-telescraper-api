import 'dotenv/config';
import readline from "readline";
import { TelegramClient } from "telegram";
import { eventHandler } from "./eventHandler";
import { StoreSession } from "telegram/sessions";

// Env variables
if(!process.env.API_ID) throw new Error("API_ID is not found on .env")
if(!process.env.API_HASH) throw new Error("API_HASH is not found on .env")
if(!process.env.PHONE_NUMBER) throw new Error("PHONE_NUMBER is not found on .env")

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const phoneNumber = process.env.PHONE_NUMBER;

// Session & client variables
const storeSession = new StoreSession(".session");
const client = new TelegramClient(storeSession, apiId, apiHash!, { connectionRetries: 2 });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, });

// Initialize bot start up & event handlers
export default async function initialize() {
    await client.start({
        phoneNumber: phoneNumber!,
        phoneCode: async () =>
            new Promise((resolve) =>
                rl.question("Please enter the code you received: ", resolve)
            ),
        onError: (err) => console.log(err),
    });
    client.session.save();
    storeSession.save();
    eventHandler(client);
};

export { client };