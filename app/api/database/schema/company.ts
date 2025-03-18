import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const company = pgTable("company", {
    companyid: serial("companyid").primaryKey(),
    companyname: varchar("companyname", { length: 255 }).notNull()
});

export type companyModel = typeof company.$inferInsert;