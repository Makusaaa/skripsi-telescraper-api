import { DB } from '../database/client';
import { alarms, alarmsModel } from '../database/schema/alarms'
import { eq, desc } from 'drizzle-orm';
import { users } from '../database/schema/users';
import { credentialexposure } from '../database/schema/credentialexposure';
import { company } from '../database/schema/company';

export async function insertAlarm(db: DB, newFile: alarmsModel){
    return (await db.insert(alarms).values(newFile).returning())[0];
}

export async function getAlarmByID(db: DB, alarmid: number){
    return (await db.select().from(alarms).where(eq(alarms.alarmid,alarmid)))[0];
}

export async function updateAlarmStatus(db: DB, alarmid: number, newstatus: number){
    return (await db.update(alarms).set({ status: newstatus }).where(eq(alarms.alarmid,alarmid)).returning())[0];
}

export async function updateAlarmAssignment(db: DB, alarmid: number, assignto: number){
    return (await db.update(alarms).set({ assignto: assignto }).where(eq(alarms.alarmid,alarmid)).returning())[0];
}

export async function getAlarmList(db: DB): Promise<object[]> {
    const data = (await db.select({
        alarmid: alarms.alarmid,
        companyid: alarms.companyid,
        companyname: company.companyname,
        status: alarms.status,
        assignto: alarms.assignto,
        channelname: alarms.channelname,
        channeluserid: alarms.channeluserid,
        filename: alarms.filename,
        messageid: alarms.messageid,
        discoverydate: alarms.discoverydate,
        notes: alarms.notes,
        assigneduser: {
            userid: users.userid,
            fullname: users.fullname,
            email: users.email,
        },
        credentialexposure,
    }).from(alarms).orderBy(desc(alarms.discoverydate))
    .leftJoin(users, eq(alarms.assignto, users.userid))
    .leftJoin(company, eq(alarms.companyid, company.companyid))
    .leftJoin(credentialexposure, eq(alarms.alarmid, credentialexposure.alarmid)));

    const result: any[] = [];
    data.forEach((item: any) => {
        let alarm = result.find((c: any) => c.alarmid === item.alarmid);
        if(!alarm) {
            result.push({
                alarmid: item.alarmid,
                companyid: item.companyid,
                companyname: item.companyname,
                status: item.status,
                assignto: item.assignto,
                channelname: item.channelname,
                channeluserid: item.channeluserid,
                filename: item.filename,
                messageid: item.messageid,
                discoverydate: item.discoverydate,
                notes: item.notes,
                assigneduser: item.assigneduser,
                credentials: [
                    {
                        credentialexposureid: item.credentialexposure.credentialexposureid,
                        alarmid: item.credentialexposure.alarmid,
                        status: item.credentialexposure.status,
                        url: item.credentialexposure.url,
                        login: item.credentialexposure.login,
                        password: item.credentialexposure.password,
                    }
                ]
            });
        } else {
            alarm.credentials.push({
                credentialexposureid: item.credentialexposure.credentialexposureid,
                alarmid: item.credentialexposure.alarmid,
                status: item.credentialexposure.status,
                url: item.credentialexposure.url,
                login: item.credentialexposure.login,
                password: item.credentialexposure.password,
            });
        }
    })
    return result;
}

export async function getAlarmListByCompany(db: DB, companyid: number): Promise<object[]> {
    const data = (await db.select({
        alarmid: alarms.alarmid,
        companyid: alarms.companyid,
        companyname: company.companyname,
        status: alarms.status,
        assignto: alarms.assignto,
        channelname: alarms.channelname,
        channeluserid: alarms.channeluserid,
        filename: alarms.filename,
        messageid: alarms.messageid,
        discoverydate: alarms.discoverydate,
        notes: alarms.notes,
        assigneduser: {
            userid: users.userid,
            fullname: users.fullname,
            email: users.email,
        },
        credentialexposure,
    }).from(alarms).where(eq(alarms.companyid, companyid))
    .orderBy(desc(alarms.discoverydate))
    .leftJoin(users, eq(alarms.assignto, users.userid))
    .leftJoin(company, eq(alarms.companyid, company.companyid))
    .leftJoin(credentialexposure, eq(alarms.alarmid, credentialexposure.alarmid)));

    const result: any[] = [];
    data.forEach((item: any) => {
        let alarm = result.find((c: any) => c.alarmid === item.alarmid);
        if(!alarm) {
            result.push({
                alarmid: item.alarmid,
                companyid: item.companyid,
                companyname: item.companyname,
                status: item.status,
                assignto: item.assignto,
                channelname: item.channelname,
                channeluserid: item.channeluserid,
                filename: item.filename,
                messageid: item.messageid,
                discoverydate: item.discoverydate,
                notes: item.notes,
                assigneduser: item.assigneduser,
                credentials: [
                    {
                        credentialexposureid: item.credentialexposure.credentialexposureid,
                        alarmid: item.credentialexposure.alarmid,
                        status: item.credentialexposure.status,
                        url: item.credentialexposure.url,
                        login: item.credentialexposure.login,
                        password: item.credentialexposure.password,
                    }
                ]
            });
        } else {
            alarm.credentials.push({
                credentialexposureid: item.credentialexposure.credentialexposureid,
                alarmid: item.credentialexposure.alarmid,
                status: item.credentialexposure.status,
                url: item.credentialexposure.url,
                login: item.credentialexposure.login,
                password: item.credentialexposure.password,
            });
        }
    })
    return result;
}