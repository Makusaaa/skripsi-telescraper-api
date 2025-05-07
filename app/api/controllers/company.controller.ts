import { Request, Response } from 'express';
import status from "http-status";
import { CustomError } from '../middleware/error-handler.middleware';
import * as CompanyService from '../services/company.services';

export const getCompanyListController = async (req: Request, res: Response): Promise<void> => {
    const result: any = await CompanyService.getCompanyListService();
    res.status(status.OK).json({ data: result });
};

export const getCompanyByIDController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id ||  isNaN(+id)) throw new CustomError("ID invalid!", status.BAD_REQUEST)

    const result: any = await CompanyService.getCompanyByIDService(Number(id))

    res.status(status.OK).json({ data: result });
};

export const registerCompanyController = async (req: Request, res: Response): Promise<void> => {
    const { companyname, email, fullname } = req.body;
    if (!companyname || !email || !fullname) throw new CustomError("Require company name, admin email and fullname!", status.BAD_REQUEST)
        
    const result: any = await CompanyService.registerCompanyService({
        companyname: companyname,
        email: email,
        fullname: fullname,
    })

    res.status(status.OK).json({ data: result });
};

export const deleteCompanyController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;
    if (!id ||  isNaN(+id)) throw new CustomError("ID Invalid!", status.BAD_REQUEST)

    const result: any = await CompanyService.deleteCompanyService(Number(id))

    res.status(status.OK).json({ data: result });
};