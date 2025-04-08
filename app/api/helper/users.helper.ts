import { db } from '../database/client';
import { eq } from 'drizzle-orm';
import { users, usersModel } from '../database/schema/users'

export async function getUserByEmail(email: string): Promise<usersModel> {
    return (await db.select().from(users).where(eq(users.email, email)))[0]
}