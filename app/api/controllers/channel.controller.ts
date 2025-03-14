import { Request, Response } from 'express';

import { Api } from 'telegram';
import { client } from '../../telebot/startBot';

export const join = async (req: Request, res: Response): Promise<void> => {
    const channelId = req.query.channelId as string;

    if (!channelId) {
        res.status(400).json({ error: "channelId is required" });
        return;
    }

    try {
        const result = await client.invoke(
            new Api.channels.JoinChannel({
                channel: channelId,
            })
        ) as any;

        let chat = result.chats[0];
        res.json({ message: `Joined channel ${chat.title} (@${chat.username})` });
    } 
    catch (error) {
        console.error("Error joining channel:", error);
        res.status(500).json({ error: `Failed to join channel ${channelId}` });
    }
};

export const leave = async (req: Request, res: Response): Promise<void> => {
    const channelId = req.query.channelId as string;

    if (!channelId) {
        res.status(400).json({ error: "channelId is required" });
        return;
    }

    try {
        const result = await client.invoke(
            new Api.channels.LeaveChannel({
                channel: channelId,
            })
        ) as any;

        if (!result.chats || result.chats.length === 0) {
            res.json({ message: `Successfully left the channel ${channelId}` });
            return;
        }

        let chat = result.chats[0];
        res.json({ message: `Left channel ${chat.title} (@${chat.username})` });
    } 
    catch (error) {
        console.error("Error leaving channel:", error);
        res.status(500).json({ error: `Failed to leave channel ${channelId}` });
    }
}