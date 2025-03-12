import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { company } from "./company";

export const users = pgTable("users", {
    UserID: serial("userid").primaryKey(),
    CompanyID: integer("companyid").references(() => company.CompanyID, { onDelete: "cascade" }),
    Username: varchar("username", { length: 255 }).notNull().unique(),
    Fullname: varchar("fullname", { length: 255 }).notNull(),
    Password: varchar("password", { length: 255 }).notNull(),
    Role: integer("role").notNull()
});