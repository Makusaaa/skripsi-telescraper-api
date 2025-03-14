import { Request, Response } from 'express';

import { client } from '../../telebot/startBot';

export const send = async (req: Request, res: Response): Promise<void> => {
    const { to, message } = req.query;

    if (!to || !message) {
        res.status(400).json({ error: "Both 'to' and 'message' are required" });
        return;
    }

    try {
        await client.sendMessage(to as string, { message: message as string });
        res.json({ success: `Sent message '${message}' to ${to}` });
    } 
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: `Failed to send message to ${to}` });
    }
};