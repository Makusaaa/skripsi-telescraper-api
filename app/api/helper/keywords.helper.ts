import { type DB } from '../database/client';
import { eq, and } from 'drizzle-orm';
import { keywords, keywordsModel } from '../database/schema/keywords'
import { company } from '../database/schema/company';
import { users } from '../database/schema/users';

export async function getKeywordByKeywordID(db: DB, keywordid: number): Promise<keywordsModel> {
    return (await db.select().from(keywords).where(eq(keywords.keywordid, keywordid)))[0]
}

export async function getKeywordList(db: DB): Promise<object[]> {
    return (await db.select({
        keywordid: keywords.keywordid,
        keyword: keywords.keyword,
        companyid: company.companyid,
        companyname: company.companyname,
        userid: users.userid,
        userfullname: users.fullname,
    }).from(keywords)
    .leftJoin(company, eq(company.companyid, keywords.companyid))
    .leftJoin(users, eq(users.userid, keywords.userid)))
}

export async function getKeywordListByCompany(db: DB, companyid: number): Promise<object[]> {
    return (await db.select({
        keywordid: keywords.keywordid,
        keyword: keywords.keyword,
        companyid: company.companyid,
        companyname: company.companyname,
        userid: users.userid,
        userfullname: users.fullname,
    }).from(keywords).where(eq(keywords.companyid, companyid))
    .leftJoin(company, eq(company.companyid, keywords.companyid))
    .leftJoin(users, eq(users.userid, keywords.userid)))
}

export async function getKeywordByCompanyIDKeyword(db: DB, keyword: string, companyid: number): Promise<keywordsModel> {
    return (await db.select().from(keywords).where(and(eq(keywords.keyword, keyword),eq(keywords.companyid, companyid))))[0]
}

export async function insertKeyword(db: DB, newKeyword: keywordsModel): Promise<keywordsModel> {
    return (await db.insert(keywords).values(newKeyword).returning())[0];
}

export async function deleteKeyword(db: DB, keywordid: number): Promise<keywordsModel> {
    return (await db.delete(keywords).where(eq(keywords.keywordid, keywordid)))[0];
}