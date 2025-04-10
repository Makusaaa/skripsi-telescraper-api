import { Api } from 'telegram';
import { client } from '../../telebot/start-bot';
import { getChannelByUserId, insertChannel } from '../helper/channels.helper';
import { channelsModel } from '../database/schema/channels';

export const joinChannel = async (channelUserId: string): Promise<Object> => {
    const result = await client.invoke(
        new Api.channels.JoinChannel({
            channel: channelUserId,
        })
    ) as any;

    const channel = await getChannelByUserId(channelUserId);
    if(!channel)
    {
        const { chats } = result;
        const newChannel: channelsModel = {
            channelnumber: chats[0].id.toString(),
            channelname: chats[0].title,
            channeluserid: chats[0].username,
        }
        await insertChannel(newChannel);
    }

    return result.chats[0];
};

export const leaveChannel = async (channelId: string): Promise<void> => {
    const result = await client.invoke(
        new Api.channels.LeaveChannel({
            channel: channelId,
        })
    ) as any;
    return result.chats[0];
};