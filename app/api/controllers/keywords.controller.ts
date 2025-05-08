import { Request, Response } from 'express';
import status from "http-status";
import { CustomError } from '../middleware/error-handler.middleware';
import * as KeywordsService from '../services/keywords.services';
import { Roles } from '../constraints/constants';

export const getKeywordListController = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals;
    const result: any = await KeywordsService.getKeywordListService(user);
    res.status(status.OK).json({ data: result });
}

export const registerKeywordController = async (req: Request, res: Response): Promise<void> => {
    const { keyword, companyid } = req.body;
    if (!keyword) throw new CustomError("Require keyword!", status.BAD_REQUEST)
    const { user } = res.locals;
    if (user.role == Roles.SuperAdmin && (!companyid || isNaN(+companyid))) throw new CustomError("Require companyid!", status.BAD_REQUEST)

    const result: any = await KeywordsService.registerKeywordService(user, keyword, companyid);

    res.status(status.OK).json({ data: result });
};

export const deleteKeywordController = async (req: Request, res: Response): Promise<void> => {
    const { keywordid } = req.body;
    if (!keywordid ||  isNaN(+keywordid)) throw new CustomError("ID Invalid!", status.BAD_REQUEST)
    const { user } = res.locals;

    const result: any = await KeywordsService.deleteKeywordService(user, keywordid);
    
    res.status(status.OK).json({ data: result });
}