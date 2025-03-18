import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const keywords = pgTable("keywords", {
    keywordid: serial("keywordid").primaryKey(),
    companyid: varchar("companyid", { length: 255 }).notNull(),
    userid: integer("userid").references(() => users.userid, { onDelete: "cascade" }),
    keyword: varchar("keyword", { length: 255 }).notNull()
});

export type keywordsModel = typeof keywords.$inferInsert;