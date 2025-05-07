import { type DB } from '../database/client';
import { eq } from 'drizzle-orm';
import { users, usersModel } from '../database/schema/users'

export async function getUserByEmail(db: DB, email: string): Promise<usersModel> {
    return (await db.select().from(users).where(eq(users.email, email)))[0]
}

export async function insertUser(db: DB, newUser: usersModel): Promise<usersModel> {
    return (await db.insert(users).values(newUser).returning())[0];
}