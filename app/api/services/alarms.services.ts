import * as AlarmsHelper from "../helper/alarms.helper.ts"
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";

export const getAlarmListService = async (user: any): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return await AlarmsHelper.getAlarmList(db)
    }
    return await AlarmsHelper.getAlarmListByCompany(db, user.companyid);
}