import { type DB } from '../database/client';
import { eq } from 'drizzle-orm';
import { users, usersModel } from '../database/schema/users'
import { company } from '../database/schema/company';

export async function getUserList(db: DB): Promise<object[]> {
    return (await db.select({
        userid: users.userid,
        companyid: users.companyid,
        email: users.email,
        fullname: users.fullname,
        role: users.role,
        companyname: company.companyname,
    }).from(users).leftJoin(company, eq(company.companyid, users.companyid)))
}

export async function getUserListByCompany(db: DB, companyid: number): Promise<object[]> {
    return (await db.select({
        userid: users.userid,
        companyid: users.companyid,
        email: users.email,
        fullname: users.fullname,
        role: users.role,
        companyname: company.companyname,
    }).from(users).where(eq(users.companyid, companyid)).leftJoin(company, eq(company.companyid, users.companyid)))
}

export async function getUserByEmail(db: DB, email: string): Promise<usersModel> {
    return (await db.select().from(users).where(eq(users.email, email)))[0]
}

export async function insertUser(db: DB, newUser: usersModel): Promise<usersModel> {
    return (await db.insert(users).values(newUser).returning())[0];
}