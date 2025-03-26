import { Request, Response } from 'express';
import status from "http-status";
import { joinChannel, leaveChannel } from '../services/channel.services';
import { CustomError } from '../middleware/errorHandler';

export const join = async (req: Request, res: Response): Promise<void> => {
    const channelId = req.query.channelid as string;
    if (!channelId) throw new CustomError("channelid is required", status.BAD_REQUEST)

    const result: any = await joinChannel(channelId);

    res.status(status.OK).json({ message: `Joined channel ${result.title} (@${result.username})` });
};

export const leave = async (req: Request, res: Response): Promise<void> => {
    const channelId = req.query.channelid as string;
    if (!channelId) throw new CustomError("channelid is required", status.BAD_REQUEST)
        
    const result: any = await leaveChannel(channelId)
        
    res.status(status.OK).json({ message: `Left channel ${result.title} (@${result.username})` });
}