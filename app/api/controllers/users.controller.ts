import { Request, Response } from 'express';
import status from "http-status";
import { CustomError } from '../middleware/error-handler.middleware';
import * as UserService from '../services/users.services';
import { Roles } from '../constraints/constants';

export const getUserListController = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals;
    const result: any = await UserService.getUserListService(user);
    res.status(status.OK).json({ data: result });
}

export const registerUserController = async (req: Request, res: Response): Promise<void> => {
    const { fullname, email, role, companyid } = req.body;
    if (!fullname || !email || !role) throw new CustomError("Require fullname, email and role!", status.BAD_REQUEST)
    const { user } = res.locals;
    if (!companyid && user.role == Roles.SuperAdmin && role != Roles.SuperAdmin) throw new CustomError("Require company id!", status.BAD_REQUEST)

    const result: any = await UserService.registerUserService({
        user: user,
        role: role,
        fullname: fullname,
        email: email,
        companyid: companyid,
    });

    res.status(status.OK).json({ data: result });
};

export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
    const { userid } = req.body;
    if (!userid ||  isNaN(+userid)) throw new CustomError("ID Invalid!", status.BAD_REQUEST)
    const { user } = res.locals;

    const result: any = await UserService.deleteUserService(user,userid);
    
    res.status(status.OK).json({ data: result });
}