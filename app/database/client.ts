import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle("postgresql://ScraperApp:12345678@localhost/MyDB");