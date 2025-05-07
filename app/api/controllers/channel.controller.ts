import { Request, Response } from 'express';
import status from "http-status";
import * as ChannelServices from '../services/channel.services';
import { CustomError } from '../middleware/error-handler.middleware';

export const join = async (req: Request, res: Response): Promise<void> => {
    const channelId = req.query.channelid as string;
    if (!channelId) throw new CustomError("channelid is required", status.BAD_REQUEST)

    const result: any = await ChannelServices.joinChannel(channelId);

    res.status(status.OK).json({ message: `Joined channel ${result.title} (@${result.username})` });
};

export const leave = async (req: Request, res: Response): Promise<void> => {
    const channelId = req.query.channelid as string;
    if (!channelId) throw new CustomError("channelid is required", status.BAD_REQUEST)
    
    const result: any = await ChannelServices.leaveChannel(channelId)
    
    res.status(status.OK).json({ message: `Left channel ${result.title} (@${result.username})` });
}