import { Request, Response } from 'express';
import { sendMessage } from '../services/message.services';
import { status } from "http-status";
import { CustomError } from '../middleware/errorHandler';

export const send = async (req: Request, res: Response): Promise<void> => {
    const { to, message } = req.query;
    if (!to || !message) throw new CustomError("Both 'to' and 'message' are required", status.BAD_REQUEST)

    const result: any = await sendMessage(to as string, message as string);

    res.status(status.OK).json(`Sent message '${result.message}' to @${to}`)
};