import { migrate } from "drizzle-orm/node-postgres/migrator";
import config, { db } from "./client";

await migrate(db,{
    migrationsFolder: './drizzle',
    migrationsSchema: config.schema as string
});