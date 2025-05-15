import { Request, Response } from 'express';
import status from "http-status";
import * as AlarmsService from '../services/alarms.services';
import { CustomError } from '../middleware/error-handler.middleware';

export const getAlarmListController = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals;
    const result: any = await AlarmsService.getAlarmListService(user);
    res.status(status.OK).json({ data: result });
}

export const updateAlarmStatusController = async (req: Request, res: Response): Promise<void> => {
    const { alarmid, status: newstatus } = req.body;
    if (alarmid == undefined || newstatus == undefined || isNaN(+alarmid) || isNaN(+newstatus))
        throw new CustomError("Require alarm id and status!", status.BAD_REQUEST)
    const { user } = res.locals;
    
    const result: any = await AlarmsService.updateAlarmStatusService(user, alarmid, newstatus);
    
    res.status(status.OK).json({ data: result });
}

export const updateAlarmAssignmentController = async (req: Request, res: Response): Promise<void> => {
    const { alarmid, assignto } = req.body;
    if (alarmid == undefined || isNaN(+alarmid))
        throw new CustomError("Require alarm id and user id!", status.BAD_REQUEST)
    const { user } = res.locals;
    
    const result: any = await AlarmsService.updateAlarmAssignmentService(user, alarmid, assignto);
    
    res.status(status.OK).json({ data: result });
}