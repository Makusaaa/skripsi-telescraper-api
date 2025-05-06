import { db } from '../database/client';
import { eq } from 'drizzle-orm';
import { company, companyModel } from '../database/schema/company'

export async function getCompanyList(): Promise<companyModel[]> {
    return (await db.select().from(company))
}

export async function getCompanyByID(companyId: number): Promise<companyModel> {
    return (await db.select().from(company).where(eq(company.companyid,companyId)))[0]
}

export async function insertCompany(newCompany: companyModel): Promise<companyModel> {
    return (await db.insert(company).values(newCompany).returning())[0];
}

export async function updateCompany(updateCompany: companyModel): Promise<companyModel> {
    return (await db.update(company).set(updateCompany).where(eq(company.companyid, updateCompany.companyid!)))[0];
}

export async function deleteCompany(companyId: number): Promise<companyModel> {
    return (await db.delete(company).where(eq(company.companyid, companyId)))[0];
}