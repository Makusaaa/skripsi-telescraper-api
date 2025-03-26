import { Api } from 'telegram';
import { client } from '../../telebot/startBot';

export const joinChannel = async (channelId: string): Promise<Object> => {
    const result = await client.invoke(
        new Api.channels.JoinChannel({
            channel: channelId,
        })
    ) as any;
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