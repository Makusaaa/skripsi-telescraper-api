import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { CustomError } from './errorHandler'

export default async function auth(req: Request, res: Response, next: NextFunction) {
    try
    {
        if (!req.headers.authorization) {
            next(new CustomError('Invalid authorization token', httpStatus.UNAUTHORIZED));
            return;
        }
        const token = (req.headers.authorization ?? '').replace(/Bearer /, '');
        const decodedPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
        jwt.verify(token, process.env.secret!);
        res.locals.user = decodedPayload;
        next();
    }
    catch(error: any)
    {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError)
            next(new CustomError('Invalid authorization token',httpStatus.UNAUTHORIZED));
        else if (error instanceof jwt.TokenExpiredError)
            next(new CustomError('Authorization token expired',httpStatus.UNAUTHORIZED));
        else next(error);
    }
}