import { db } from '../database/client';
import { files, filesModel } from '../database/schema/files'

export async function insertFile(fileName: string, channelId: number, messageId: string){
    const insertFile: filesModel = {
        filename: fileName,
        channelid: channelId,
        messageid: messageId,
    }
    return (await db.insert(files).values(insertFile).returning())[0];
}