import { DB } from '../database/client';
import { alarms, alarmsModel } from '../database/schema/alarms'
import { eq, desc } from 'drizzle-orm';

export async function insertAlarm(db: DB, newFile: alarmsModel){
    return (await db.insert(alarms).values(newFile).returning())[0];
}

export async function getAlarmList(db: DB): Promise<object[]> {
    return (await db.select({
        alarmid: alarms.alarmid,
        companyid: alarms.companyid,
        status: alarms.status,
        assignto: alarms.assignto,
        channelname: alarms.channelname,
        channeluserid: alarms.channeluserid,
        filename: alarms.filename,
        messageid: alarms.messageid,
        discoverydate: alarms.discoverydate,
        notes: alarms.notes,
    }).from(alarms).orderBy(desc(alarms.discoverydate)));
}

export async function getAlarmListByCompany(db: DB, companyid: number): Promise<object[]> {
    return (await db.select({
        alarmid: alarms.alarmid,
        companyid: alarms.companyid,
        status: alarms.status,
        assignto: alarms.assignto,
        channelname: alarms.channelname,
        channeluserid: alarms.channeluserid,
        filename: alarms.filename,
        messageid: alarms.messageid,
        discoverydate: alarms.discoverydate,
        notes: alarms.notes,
    }).from(alarms).where(eq(alarms.companyid, companyid)).orderBy(desc(alarms.discoverydate)));
}