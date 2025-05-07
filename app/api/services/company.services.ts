import { CustomError } from "../middleware/error-handler.middleware.ts";
import status from "http-status";
import * as CompanyHelper from "../helper/company.helper"
import * as UsersHelper from "../helper/users.helper"
import { companyModel } from "../database/schema/company";
import { usersModel } from "../database/schema/users";
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";

export const getCompanyListService = async (): Promise<Object[]> => {
    return CompanyHelper.getCompanyList(db);
};

export const getCompanyByIDService = async (companyId: number): Promise<Object> => {
    return CompanyHelper.getCompanyByID(db,companyId);
};

export const registerCompanyService = async (input: { companyname: string, email: string, fullname: string,}): Promise<Object> => {
    const userCheck = await UsersHelper.getUserByEmail(db,input.email)
    if(userCheck) throw new CustomError("User already registered", status.BAD_REQUEST);

    return await db.transaction(async (tx) => {
        const newCompany = await CompanyHelper.insertCompany(tx, {
            companyname: input.companyname
        } as companyModel)

        const newCompanyAdmin = await UsersHelper.insertUser(tx, {
            email: input.email,
            fullname: input.fullname,
            companyid: newCompany.companyid,
            role: Number(Roles.CompanyAdmin)
        } as usersModel)

        return {
            newCompany: newCompany,
            newCompanyAdmin: newCompanyAdmin
        };
    });
};

export const deleteCompanyService = async (companyId: number): Promise<Object> => {
    return CompanyHelper.deleteCompany(db,companyId);
};
