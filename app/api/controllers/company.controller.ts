import { Request, Response } from 'express';
import status from "http-status";
import { CustomError } from '../middleware/error-handler.middleware';
import { deleteCompanyService, getCompanyByIDService, getCompanyListService, registerCompanyService } from '../services/company.services';

export const getCompanyListController = async (req: Request, res: Response): Promise<void> => {
    const result: any = await getCompanyListService();
    res.status(status.OK).json({ data: result });
};

export const getCompanyByIDController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id ||  isNaN(+id)) throw new CustomError("id", status.BAD_REQUEST)

    const result: any = await getCompanyByIDService(Number(id))

    res.status(status.OK).json({ data: result });
};

export const registerCompanyController = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    if (!name) throw new CustomError("name", status.BAD_REQUEST)
        
    const result: any = await registerCompanyService(name)

    res.status(status.OK).json({ data: result });
};

export const deleteCompanyController = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;
    if (!id ||  isNaN(+id)) throw new CustomError("id", status.BAD_REQUEST)

    const result: any = await deleteCompanyService(Number(id))

    res.status(status.OK).json({ data: result });
};