import { Request, Response } from 'express';
import status from "http-status";
import * as CredentialExposureService from '../services/credentialexposure.services';

export const getCredentialExposureListController = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals;
    const result: any = await CredentialExposureService.getCredentialExposureListService(user);
    res.status(status.OK).json({ data: result });
}