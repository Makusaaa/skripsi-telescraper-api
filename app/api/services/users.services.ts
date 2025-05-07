import { CustomError } from "../middleware/error-handler.middleware.ts";
import status from "http-status";
import * as CompanyHelper from "../helper/company.helper.ts"
import * as UsersHelper from "../helper/users.helper.ts"
import { usersModel } from "../database/schema/users.ts";
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";

export const registerUserService = async (input: { user: any, role: number, fullname: string, email: string, companyid?: number }): Promise<Object> => {
    const userCheck = await UsersHelper.getUserByEmail(db,input.email)
    if(userCheck) throw new CustomError("User already registered!", status.BAD_REQUEST);

    return await db.transaction(async (tx) => {
        if(input.user.role == Roles.SuperAdmin)
        {
            if(input.role == Roles.SuperAdmin){
                return await UsersHelper.insertUser(tx,{
                    email: input.email,
                    fullname: input.fullname,
                    role: input.role,
                } as usersModel)
            }
            else if(input.companyid){
                const companyCheck = await CompanyHelper.getCompanyByID(tx,input.companyid)
                if(!companyCheck) throw new CustomError("Company is not registered!", status.BAD_REQUEST);

                return await UsersHelper.insertUser(tx,{
                    companyid: companyCheck.companyid,
                    email: input.email,
                    fullname: input.fullname,
                    role: input.role,
                } as usersModel)
            }
        }
        else {
            const userCheck = await UsersHelper.getUserByEmail(tx,input.user.email)
            if(!userCheck) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);

            return await UsersHelper.insertUser(tx,{
                companyid: userCheck.companyid,
                email: input.email,
                fullname: input.fullname,
                role: input.role,
            } as usersModel)
        }
        throw new CustomError("Failed to register user!",status.BAD_REQUEST)
    });
};
