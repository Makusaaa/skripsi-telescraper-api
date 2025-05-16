import * as CredentialExposureHelper from "../helper/credentialexposure.helper.ts"
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";

export const getCredentialExposureListService = async (user: any): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return await CredentialExposureHelper.getCredentialExposureList(db)
    }
    return await CredentialExposureHelper.getCredentialExposureListByCompany(db, user.companyid);
}