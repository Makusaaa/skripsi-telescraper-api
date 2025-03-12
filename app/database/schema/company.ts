import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const company = pgTable("company", {
    CompanyID: serial("companyid").primaryKey(),
    CompanyName: varchar("companyname", { length: 255 }).notNull()
});