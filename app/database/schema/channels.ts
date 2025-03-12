import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const channels = pgTable("channels", {
    channelid: serial("channelid").primaryKey(),
    channelnumber: varchar("channelnumber", { length: 255 }).notNull(),
    channelname: varchar("channelname", { length: 255 }).notNull(),
    channellink: varchar("channellink", { length: 255 }).notNull()
});

export type channelsModel = typeof channels.$inferInsert;