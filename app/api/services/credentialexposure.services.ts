import * as CredentialExposureHelper from "../helper/credentialexposure.helper.ts"
import * as AlarmsHelper from "../helper/alarms.helper.ts"
import * as CompanyHelper from "../helper/company.helper.ts"
import * as UsersHelper from "../helper/users.helper.ts"
import status from "http-status";
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";
import { CustomError } from "../middleware/error-handler.middleware.ts"


export const getCredentialExposureListService = async (user: any): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return await CredentialExposureHelper.getCredentialExposureList(db)
    }
    return await CredentialExposureHelper.getCredentialExposureListByCompany(db, user.companyid);
}

export const updateCredentialExposureStatusService = async (user: any, credentialexposureid: number, newstatus: number): Promise<Object> => {
    if(user.role == Roles.SuperAdmin) {
        const credentialExposureCheck = await CredentialExposureHelper.getCredentialExposureByID(db, credentialexposureid)
        if(!credentialExposureCheck) throw new CustomError("Credential exposure not found!", status.BAD_REQUEST);
        return CredentialExposureHelper.updateCredentialExposureStatus(db,credentialexposureid,newstatus);
    }
    const userCheck = await UsersHelper.getUserByEmail(db,user.email)
    if(!userCheck || !userCheck.companyid) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);
    
    const companyCheck = await CompanyHelper.getCompanyByID(db,userCheck.companyid)
    if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);

    const credentialExposureCheck = await CredentialExposureHelper.getCredentialExposureByID(db, credentialexposureid)
    if(!credentialExposureCheck) throw new CustomError("Credential exposure not found!", status.BAD_REQUEST);

    const alarmCheck = await AlarmsHelper.getAlarmByID(db, credentialExposureCheck.alarmid)
    if(!alarmCheck) throw new CustomError("Alarm not found!", status.BAD_REQUEST);

    if(alarmCheck.companyid != companyCheck.companyid) throw new CustomError("Credential exposure does not belong to your company!", status.BAD_REQUEST);
    return CredentialExposureHelper.updateCredentialExposureStatus(db,credentialexposureid,newstatus);
}