import { Request, Response } from 'express';
import status from "http-status";
import * as CredentialExposureService from '../services/credentialexposure.services';
import { CustomError } from '../middleware/error-handler.middleware';

export const getCredentialExposureListController = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals;
    const result: any = await CredentialExposureService.getCredentialExposureListService(user);
    res.status(status.OK).json({ data: result });
}

export const updateCredentialExposureListController = async (req: Request, res: Response): Promise<void> => {
    const { credentialexposureid, status: newstatus } = req.body;
    if (credentialexposureid == undefined || newstatus == undefined || isNaN(+credentialexposureid) || isNaN(+newstatus))
        throw new CustomError("Require credential exposure id and status!", status.BAD_REQUEST)
    const { user } = res.locals;
    
    const result: any = await CredentialExposureService.updateCredentialExposureStatusService(user, credentialexposureid, newstatus);
    
    res.status(status.OK).json({ data: result });
}