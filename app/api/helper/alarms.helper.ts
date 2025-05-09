import { DB } from '../database/client';
import { alarms, alarmsModel } from '../database/schema/alarms'

export async function insertAlarm(db: DB, newFile: alarmsModel){
    return (await db.insert(alarms).values(newFile).returning())[0];
}