import { getCompanyList, deleteCompany, insertCompany, getCompanyByID } from "../helper/company.helper"
import { companyModel } from "../database/schema/company";

export const getCompanyListService = async (): Promise<Object[]> => {
    return getCompanyList();
};

export const getCompanyByIDService = async (companyId: number): Promise<Object> => {
    return getCompanyByID(companyId);
};

export const registerCompanyService = async (name: string): Promise<Object> => {
    return insertCompany({
        companyname: name
    } as companyModel);
};

export const deleteCompanyService = async (companyId: number): Promise<Object> => {
    return deleteCompany(companyId);
};
