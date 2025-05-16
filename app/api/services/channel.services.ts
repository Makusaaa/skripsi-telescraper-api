import { Api } from 'telegram';
import { client } from '../../telebot/start-bot';
import * as ChannelHelper from '../helper/channels.helper';
import { channelsModel } from '../database/schema/channels';
import { db } from '../database/client';

export const getChannelListService = async (): Promise<Object> => {
    return await ChannelHelper.getChannelList(db);
}

export const joinChannelService = async (channelUserId: string): Promise<Object> => {
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
        await ChannelHelper.insertChannel(db,newChannel);
    }

    return result.chats[0];
};

export const leaveChannelService = async (channelId: string): Promise<void> => {
    const result = await client.invoke(
        new Api.channels.LeaveChannel({
            channel: channelId,
        })
    ) as any;
    return result.chats[0];
};