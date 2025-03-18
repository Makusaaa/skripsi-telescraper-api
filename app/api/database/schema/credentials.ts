import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { files } from "./files";

export const credentials = pgTable("credentials", {
    credentialid: serial("credentialid").primaryKey(),
    fileid: integer("fileid").references(() => files.fileid, { onDelete: "cascade" }),
    url: varchar("url", { length: 255 }).notNull(),
    login: varchar("login", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull()
});

export type credentialsModel = typeof credentials.$inferInsert;