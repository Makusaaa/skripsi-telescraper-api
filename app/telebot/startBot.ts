import readline from "readline";
import { TelegramClient } from "telegram";
import { eventHandler } from "./eventHandler";
import { StoreSession } from "telegram/sessions";
import config from "../api/constraints/config";

// Env variables
const apiId = Number(config.TELEGRAM_API_ID);
const apiHash = config.TELEGRAM_API_HASH;
const phoneNumber = config.TELEGRAM_PHONE_NUMBER;

// Session & client variables
const storeSession = new StoreSession(".session");
const client = new TelegramClient(storeSession, apiId, apiHash, { connectionRetries: 2 });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, });

// Initialize bot start up & event handlers
export default async function initialize() {
    await client.start({
        phoneNumber: phoneNumber,
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