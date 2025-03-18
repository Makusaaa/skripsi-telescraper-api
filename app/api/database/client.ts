import { drizzle } from 'drizzle-orm/node-postgres';
import { defineConfig } from "drizzle-kit";

export const db = drizzle("postgresql://ScraperApp:12345678@localhost/MyDB");

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema'
})