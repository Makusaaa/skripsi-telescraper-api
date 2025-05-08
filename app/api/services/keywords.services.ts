import { CustomError } from "../middleware/error-handler.middleware.ts";
import status from "http-status";
import * as UsersHelper from "../helper/users.helper.ts"
import * as KeywordsHelper from "../helper/keywords.helper.ts"
import * as CompanyHelper from "../helper/company.helper.ts"
import { keywordsModel } from "../database/schema/keywords.ts";
import { Roles } from '../constraints/constants.ts';
import { db } from "../database/client.ts";

export const getKeywordListService = async (user: any): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return await KeywordsHelper.getKeywordList(db)
    }
    return await KeywordsHelper.getKeywordListByCompany(db, user.companyid);
}

export const registerKeywordService = async (user: any, keyword: string, companyid: number): Promise<Object> => {
    const keywordCheck = await KeywordsHelper.getKeywordByCompanyIDKeyword(db, keyword, companyid)
    if(keywordCheck) throw new CustomError("Keyword already registered to this company!", status.BAD_REQUEST);

    const userCheck = await UsersHelper.getUserByEmail(db, user.email)
    if(!userCheck) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);

    return await db.transaction(async (tx) => {
        if(user.role == Roles.SuperAdmin){
            const companyCheck = await CompanyHelper.getCompanyByID(tx, companyid)
            if(!companyCheck) throw new CustomError("Failed to find the company data!", status.BAD_REQUEST);

            return {
                ...(await KeywordsHelper.insertKeyword(tx,{
                    companyid: companyCheck.companyid,
                    userid: userCheck.userid,
                    keyword: keyword,
                } as keywordsModel)),
                companyname: companyCheck.companyname,
                userfullname: userCheck.fullname,
            }
        }
        else if(userCheck.companyid){
            const companyCheck = await CompanyHelper.getCompanyByID(tx, userCheck.companyid)
            if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);

            return {
                ...(await KeywordsHelper.insertKeyword(tx,{
                    companyid: companyCheck.companyid,
                    userid: userCheck.userid,
                    keyword: keyword,
                } as keywordsModel)),
                companyname: companyCheck.companyname,
                userfullname: userCheck.fullname,
            }
        }
        throw new CustomError("Failed to register keyword!",status.BAD_REQUEST)
    });
};

export const deleteKeywordService = async (user: any, keywordid: number): Promise<Object> => {
    if(user.role == Roles.SuperAdmin){
        return KeywordsHelper.deleteKeyword(db,keywordid)
    }
    const userCheck = await UsersHelper.getUserByEmail(db, user.email)
    if(!userCheck || !userCheck.companyid) throw new CustomError("Failed to find your user data!", status.BAD_REQUEST);

    const companyCheck = await CompanyHelper.getCompanyByID(db,userCheck.companyid)
    if(!companyCheck) throw new CustomError("Failed to find your company data!", status.BAD_REQUEST);
    
    const deleteKeywordCheck = await KeywordsHelper.getKeywordByKeywordID(db,keywordid)
    if(deleteKeywordCheck.companyid != companyCheck.companyid) throw new CustomError("This keyword is not registered to your company!", status.BAD_REQUEST);
    
    return KeywordsHelper.deleteKeyword(db,keywordid)
}