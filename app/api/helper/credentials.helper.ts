import { DB } from '../database/client';
import { credentials, credentialsModel } from '../database/schema/credentials'

export async function insertCredentials(db: DB, data: credentialsModel[], fileid: number){
    return await db.insert(credentials).values([...data.map((d): credentialsModel  => {
        return {
            fileid: fileid,
            url: d.url,
            login: d.login,
            password: d.password,
        };
    })]).returning()
}

export async function getAllCredentials(db: DB): Promise<credentialsModel[]>{
    return await db.select().from(credentials);
}