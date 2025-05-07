import { Request, Response, NextFunction } from 'express';
import { CustomError } from './error-handler.middleware';
import status from 'http-status';

export default function rolecheck(roles: Number[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        const userrole = res.locals.user.role as Number
        if(!roles.includes(userrole))
            throw new CustomError("User Role Unauthorized", status.UNAUTHORIZED)
        else next();
    }
}