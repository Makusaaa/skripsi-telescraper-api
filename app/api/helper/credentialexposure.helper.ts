import { eq } from 'drizzle-orm';
import { DB } from '../database/client';
import { alarms } from '../database/schema/alarms';
import { credentialexposure, credentialexposureModel } from '../database/schema/credentialexposure'

export async function insertExposedCredentials(db: DB, newFile: credentialexposureModel[]){
    return (await db.insert(credentialexposure).values(newFile).returning())[0];
}

export async function getCredentialExposureList(db: DB){
    return (await db.select({
        credentialexposureid: credentialexposure.credentialexposureid,
        url: credentialexposure.url,
        login: credentialexposure.login,
        password: credentialexposure.password,
        discoverydate: alarms.discoverydate,
        status: credentialexposure.status,
        alarmid: alarms.alarmid
    }).from(credentialexposure)
    .innerJoin(alarms, eq(credentialexposure.alarmid, alarms.alarmid)));
}

export async function getCredentialExposureListByCompany(db: DB, companyid: number){
    return (await db.select({
        credentialexposureid: credentialexposure.credentialexposureid,
        url: credentialexposure.url,
        login: credentialexposure.login,
        password: credentialexposure.password,
        discoverydate: alarms.discoverydate,
        status: credentialexposure.status,
        alarmid: alarms.alarmid
    }).from(credentialexposure)
    .innerJoin(alarms, eq(credentialexposure.alarmid, alarms.alarmid))
    .where(eq(alarms.companyid,companyid)));
}