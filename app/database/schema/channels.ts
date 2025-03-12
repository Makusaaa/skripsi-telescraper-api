import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const channels = pgTable("channels", {
    ChannelID: serial("channelid").primaryKey(),
    ChannelNumber: varchar("channelnumber", { length: 255 }).notNull(),
    ChannelName: varchar("channelname", { length: 255 }).notNull(),
    ChannelLink: varchar("channellink", { length: 255 }).notNull()
});