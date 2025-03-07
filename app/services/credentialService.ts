import { db } from '../database/client';
import { credentials } from '../database/schema/trcredentials'

export async function insertCredentials(data: Object[], chatid: string, messageid: string){
    const chunkSize = 10000;
    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        await db.insert(credentials).values([...chunk.map((d) => {
            return {
                chatid: chatid,
                messageid: messageid,
                url: d['URL'] ?? null,
                login: d['Login'],
                password: d['Password'],
            };
        })])
    }
}

export async function getAllCredentials(){
    const result = await db.select().from(credentials);
    return result;
}