import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { channels } from "./channels";

export const files = pgTable("files", {
    FileID: serial("fileid").primaryKey(),
    FileName: varchar("filename", { length: 255 }).notNull(),
    ChannelID: integer("channelid").notNull().references(() => channels.ChannelID, { onDelete: "cascade" }),
    MessageID: varchar("messageid", { length: 255 }).notNull()
});