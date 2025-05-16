import { Api } from 'telegram';
import { client } from '../../telebot/start-bot';
import * as ChannelHelper from '../helper/channels.helper';
import { channelsModel } from '../database/schema/channels';
import { db } from '../database/client';
import { CustomError } from '../middleware/error-handler.middleware';
import status from 'http-status';

export const getChannelListService = async (): Promise<Object> => {
    return await ChannelHelper.getChannelList(db);
}

export const joinChannelService = async (channelUserId: string): Promise<Object> => {
    try{
        const result = await client.invoke(
            new Api.channels.JoinChannel({
                channel: channelUserId,
            })
        ) as any;

        const channel = await ChannelHelper.getChannelByUserId(db,channelUserId);
        if(!channel)
        {
            const { chats } = result;
            const newChannel: channelsModel = {
                channelnumber: chats[0].id.toString(),
                channelname: chats[0].title,
                channeluserid: chats[0].username,
            }
            return await ChannelHelper.insertChannel(db,newChannel);
        }
        return channel;
    }
    catch
    {
        throw new CustomError("Failed to join channel!", status.BAD_REQUEST)
    }
};

export const leaveChannelService = async (channelId: string): Promise<void> => {
    try{
        await client.invoke(
            new Api.channels.LeaveChannel({
                channel: channelId,
            })
        ) as any;
    }
    catch
    {
        throw new CustomError("Failed to leave channel!", status.BAD_REQUEST)
    }
    const channel = await ChannelHelper.getChannelByUserId(db,channelId);
    if(channel) await ChannelHelper.deleteChannel(db,channel.channelid!);
};