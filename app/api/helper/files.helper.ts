import { db } from '../database/client';
import { files, filesModel } from '../database/schema/files'

export async function insertFile(newFile: filesModel){
    return (await db.insert(files).values(newFile).returning())[0];
}