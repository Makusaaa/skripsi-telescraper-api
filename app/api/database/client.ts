import { drizzle } from 'drizzle-orm/node-postgres';
import { defineConfig } from "drizzle-kit";
import config from '../constraints/config'

export const db = drizzle(config.POSTGRESQL_DATABASE_URL);

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/api/database/schema/*',
})