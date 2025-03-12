import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const keywords = pgTable("keywords", {
    KeywordID: serial("keywordid").primaryKey(),
    CompanyID: varchar("companyid", { length: 255 }).notNull(),
    UserID: integer("userid").references(() => users.UserID, { onDelete: "cascade" }),
    Keyword: varchar("keyword", { length: 255 }).notNull()
});