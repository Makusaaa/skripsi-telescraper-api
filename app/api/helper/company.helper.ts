import { DB } from '../database/client';
import { eq } from 'drizzle-orm';
import { company, companyModel } from '../database/schema/company'
import { users } from '../database/schema/users';

export async function getCompanyList(db: DB): Promise<companyModel[]> {
    return (await db.select().from(company))
}

export async function getCompanyListWithCompanyAdmin(db: DB): Promise<object[]> {
    const data = (await db.select({
        companyid: company.companyid,
        companyname: company.companyname,
        adminuserid: users.userid,
        adminemail: users.email,
        adminfullname: users.fullname,
    }).from(company).leftJoin(users, eq(users.companyid, company.companyid)))

    const result: any[] = [];
    data.forEach((item: any) => {
        let company = result.find((c: any) => c.companyid === item.companyid);
        if (!company) {
            result.push({
                companyid: item.companyid,
                companyname: item.companyname,
                admins: [
                    {
                        userid: item.adminuserid,
                        fullname: item.adminfullname,
                        email: item.adminemail,
                    }
                ]
            });
        } else {
            company.admins.push({
                userid: item.adminuserid,
                fullname: item.adminfullname,
                email: item.adminemail,
            });
        }
    })
    return result;
}

export async function getCompanyByID(db: DB, companyId: number): Promise<companyModel> {
    return (await db.select().from(company).where(eq(company.companyid,companyId)))[0]
}

export async function insertCompany(db: DB, newCompany: companyModel): Promise<companyModel> {
    return (await db.insert(company).values(newCompany).returning())[0];
}

export async function updateCompany(db: DB, updateCompany: companyModel): Promise<companyModel> {
    return (await db.update(company).set(updateCompany).where(eq(company.companyid, updateCompany.companyid!)))[0];
}

export async function deleteCompany(db: DB, companyId: number): Promise<companyModel> {
    return (await db.delete(company).where(eq(company.companyid, companyId)))[0];
}