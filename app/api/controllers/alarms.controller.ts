import { Request, Response } from 'express';
import status from "http-status";
import * as AlarmsService from '../services/alarms.services';

export const getAlarmListController = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals;
    const result: any = await AlarmsService.getAlarmListService(user);
    res.status(status.OK).json({ data: result });
}