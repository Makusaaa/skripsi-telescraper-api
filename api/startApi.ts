import 'dotenv/config';
import express from 'express';
import { client } from './../telebot/startBot'
import { Api } from 'telegram';

const app = express();
const port = Number(process.env.APP_API_PORT);

export default async function startApi() {
    app.get('/join-channel', async (req: any, res) => {
        let { channelid } = req.query
        try{
            const result = await client.invoke(
                new Api.channels.JoinChannel({
                    channel: channelid,
                })
            ) as any;
            let chat = result.chats[0];
            res.end(`joined channel ${chat.title} (@${chat.username})`);
        }
        catch{
            res.end(`failed to join channel ${channelid}`);
        }
    })

    app.get('/leave-channel', async (req: any, res) => {
        let { channelid } = req.query;
        try{
            const result = await client.invoke(
                new Api.channels.LeaveChannel({
                    channel: channelid,
                })
            ) as any;
            let chat = result.chats[0];
            res.end(`leaved channel ${chat.title} (@${chat.username})`);
        }
        catch{
            res.end(`failed to leave channel ${channelid}`);
        }
    })
    
    app.get('/send-message', async (req: any, res) =>{
        let { to, message } = req.query;
        try{
            client.sendMessage(to, { message: message });
            res.end(`sent message '${message}' to ${to}`);
        }
        catch{
            res.end();
        }
    })

    app.get('/', (_req,res) => {
        res.end("TeleScraper API 1.0")
    })
    
    app.listen(port, () => {
        console.log(`Api listening on http://localhost:${port}`)
    })
}
export { app }