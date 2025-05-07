import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { defineConfig } from "drizzle-kit";
import config from '../constraints/config'
import { PgTransaction } from 'drizzle-orm/pg-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export const db = drizzle(config.POSTGRESQL_DATABASE_URL);

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/api/database/schema/*',
})

export type DB = typeof db | (PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>);