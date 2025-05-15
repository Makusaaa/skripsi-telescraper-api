import { CustomError } from "../middleware/error-handler.middleware.ts";
import status from "http-status";
import * as CompanyHelper from "../helper/company.helper.ts"
import * as UsersHelper from "../helper/users.helper.ts"
import { usersModel } from "../database/schema/users.ts";
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";

export const getUserListService = async (user: any): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return await UsersHelper.getUserList(db);
    }
    return await UsersHelper.getUserListByCompany(db, user.companyid);
}

export const getUserListByCompanyIDService = async (user: any, companyid: number): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return await UsersHelper.getUserListByCompany(db, companyid);
    }
    return await UsersHelper.getUserListByCompany(db, user.companyid);
}

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

                return {
                    ...(await UsersHelper.insertUser(tx,{
                        companyid: companyCheck.companyid,
                        email: input.email,
                        fullname: input.fullname,
                        role: input.role,
                    } as usersModel)),
                    companyname: companyCheck.companyname
                }
            }
        }
        else {
            const userCheck = await UsersHelper.getUserByEmail(tx,input.user.email)
            if(!userCheck || !userCheck.companyid) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);

            const companyCheck = await CompanyHelper.getCompanyByID(tx,userCheck.companyid)
            if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);

            return {
                ...await UsersHelper.insertUser(tx,{
                    companyid: userCheck.companyid,
                    email: input.email,
                    fullname: input.fullname,
                    role: input.role,
                } as usersModel),
                companyname: companyCheck.companyname
            }
        }
        throw new CustomError("Failed to register user!",status.BAD_REQUEST)
    });
};

export const deleteUserService = async (user,userid): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        if(user.user_id == userid) throw new CustomError("Don't delete yourself :(", status.BAD_REQUEST);
        return UsersHelper.deleteUser(db,userid)
    }
    const userCheck = await UsersHelper.getUserByEmail(db,user.email)
    if(!userCheck || !userCheck.companyid) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);

    if(userCheck.userid == userid) throw new CustomError("Don't delete yourself :(", status.BAD_REQUEST);
    
    const companyCheck = await CompanyHelper.getCompanyByID(db,userCheck.companyid)
    if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);
    
    const deleteUserCheck = await UsersHelper.getUserByUserID(db,userid)
    if(deleteUserCheck.companyid != userCheck.companyid) throw new CustomError("This user is not from your company!", status.BAD_REQUEST);
    
    return UsersHelper.deleteUser(db,userid)
}