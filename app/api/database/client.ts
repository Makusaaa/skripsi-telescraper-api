import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { defineConfig } from "drizzle-kit";

if(!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not found on .env")
export const db = drizzle(process.env.DATABASE_URL);

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/api/database/schema/*',
})