import * as AlarmsHelper from "../helper/alarms.helper.ts"
import * as CompanyHelper from "../helper/company.helper.ts"
import * as UsersHelper from "../helper/users.helper.ts"
import status from "http-status";
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";
import { CustomError } from "../middleware/error-handler.middleware.ts";

export const getAlarmListService = async (user: any): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return await AlarmsHelper.getAlarmList(db)
    }
    return await AlarmsHelper.getAlarmListByCompany(db, user.companyid);
}

export const updateAlarmStatusService = async (user: any, alarmid: number, newstatus: number): Promise<Object> => {
    if(user.role == Roles.SuperAdmin) {
        const alarmCheck = await AlarmsHelper.getAlarmByID(db, alarmid)
        if(!alarmCheck) throw new CustomError("Alarm not found!", status.BAD_REQUEST);
        return AlarmsHelper.updateAlarmStatus(db,alarmid,newstatus);
    }
    const userCheck = await UsersHelper.getUserByEmail(db,user.email)
    if(!userCheck || !userCheck.companyid) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);
    
    const companyCheck = await CompanyHelper.getCompanyByID(db,userCheck.companyid)
    if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);
    
    const alarmCheck = await AlarmsHelper.getAlarmByID(db, alarmid)
    if(!alarmCheck) throw new CustomError("Alarm not found!", status.BAD_REQUEST);
    
    if(alarmCheck.companyid != companyCheck.companyid) throw new CustomError("Alarm does not belong to your company!", status.BAD_REQUEST);
    return AlarmsHelper.updateAlarmStatus(db,alarmid,newstatus);
}

export const updateAlarmAssignmentService = async (user: any, alarmid: number, assignto: number): Promise<Object> => {
    if(user.role == Roles.SuperAdmin) {
        const alarmCheck = await AlarmsHelper.getAlarmByID(db, alarmid)
        if(!alarmCheck) throw new CustomError("Alarm not found!", status.BAD_REQUEST);
        return AlarmsHelper.updateAlarmAssignment(db,alarmid,assignto);
    }

    const userCheck = await UsersHelper.getUserByEmail(db,user.email)
    if(!userCheck || !userCheck.companyid) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);
    
    const companyCheck = await CompanyHelper.getCompanyByID(db,userCheck.companyid)
    if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);
    
    const alarmCheck = await AlarmsHelper.getAlarmByID(db, alarmid)
    if(!alarmCheck) throw new CustomError("Alarm not found!", status.BAD_REQUEST);
    
    if(assignto != null) {
        const assignmentCheck = await UsersHelper.getUserByUserID(db,assignto);
        if(!assignmentCheck) throw new CustomError("User to assign not found!", status.BAD_REQUEST);
        if(assignmentCheck.companyid != companyCheck.companyid) throw new CustomError("User does not belong to your company!", status.BAD_REQUEST);   
    }
    
    if(alarmCheck.companyid != companyCheck.companyid) throw new CustomError("Alarm does not belong to your company!", status.BAD_REQUEST);
    return AlarmsHelper.updateAlarmAssignment(db,alarmid,assignto);
}

export const updateAlarmNotesService = async (user: any, alarmid: number, notes: string): Promise<Object> => {
    if(user.role == Roles.SuperAdmin) {
        const alarmCheck = await AlarmsHelper.getAlarmByID(db, alarmid)
        if(!alarmCheck) throw new CustomError("Alarm not found!", status.BAD_REQUEST);
        return AlarmsHelper.updateAlarmNotes(db,alarmid,notes);
    }

    const userCheck = await UsersHelper.getUserByEmail(db,user.email)
    if(!userCheck || !userCheck.companyid) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);
    
    const companyCheck = await CompanyHelper.getCompanyByID(db,userCheck.companyid)
    if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);
    
    const alarmCheck = await AlarmsHelper.getAlarmByID(db, alarmid)
    if(!alarmCheck) throw new CustomError("Alarm not found!", status.BAD_REQUEST);
    
    if(alarmCheck.companyid != companyCheck.companyid) throw new CustomError("Alarm does not belong to your company!", status.BAD_REQUEST);
    return AlarmsHelper.updateAlarmNotes(db,alarmid,notes);
}