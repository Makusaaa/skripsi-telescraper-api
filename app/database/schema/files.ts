import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { channels } from "./channels";

export const files = pgTable("files", {
    fileid: serial("fileid").primaryKey(),
    filename: varchar("filename", { length: 255 }).notNull(),
    channelid: integer("channelid").notNull().references(() => channels.channelid, { onDelete: "cascade" }),
    messageid: varchar("messageid", { length: 255 }).notNull()
});

export type filesModel = typeof files.$inferInsert;