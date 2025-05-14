import { pgTable, serial, varchar, integer, text } from "drizzle-orm/pg-core";
import { files } from "./files";

export const credentials = pgTable("credentials", {
    credentialid: serial("credentialid").primaryKey(),
    fileid: integer("fileid").references(() => files.fileid, { onDelete: "cascade" }),
    url: text("url").notNull(),
    login: text("login").notNull(),
    password: text("password").notNull()
});

export type credentialsModel = typeof credentials.$inferInsert;