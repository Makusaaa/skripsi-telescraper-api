import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { files } from "./files";

export const credentials = pgTable("credentials", {
    CredentialID: serial("credentialid").primaryKey(),
    FileID: integer("fileid").references(() => files.FileID, { onDelete: "cascade" }),
    URL: varchar("url", { length: 255 }).notNull(),
    Login: varchar("login", { length: 255 }).notNull(),
    Password: varchar("password", { length: 255 }).notNull()
});