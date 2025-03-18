import { db } from '../database/client';
import { credentials, credentialsModel } from '../database/schema/credentials'

export async function insertCredentials(data: credentialsModel[], fileid: number){
    const chunkSize = 10000;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await db.insert(credentials).values([...chunk.map((d): credentialsModel  => {
            return {
                fileid: fileid,
                url: d.url,
                login: d.login,
                password: d.password,
            };
        })])
    }
}

export async function getAllCredentials(): Promise<credentialsModel[]>{
    return await db.select().from(credentials);
}