import { db } from '../database/client';
import { eq } from 'drizzle-orm';
import { channels, channelsModel } from '../database/schema/channels'

export async function getChannelByNumber(channelNumber: string): Promise<channelsModel> {
    return (await db.select().from(channels).where(eq(channels.channelnumber, channelNumber)))[0]
}

export async function getChannelByUserId(channelUserId: string): Promise<channelsModel> {
    return (await db.select().from(channels).where(eq(channels.channeluserid, channelUserId)))[0]
}

export async function insertChannel(insertChannel: channelsModel): Promise<channelsModel> {
    return (await db.insert(channels).values(insertChannel).returning())[0];
}