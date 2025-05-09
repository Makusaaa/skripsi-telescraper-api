import { DB } from '../database/client';
import { credentialexposure, credentialexposureModel } from '../database/schema/credentialexposure'

export async function insertExposedCredentials(db: DB, newFile: credentialexposureModel[]){
    return (await db.insert(credentialexposure).values(newFile).returning())[0];
}