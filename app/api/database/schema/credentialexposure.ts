import { pgTable, varchar, serial, integer, boolean } from "drizzle-orm/pg-core";
import { alarms } from "./alarms";

export const credentialexposure = pgTable("credentialexposure", {
    credentialexposureid: serial("credentialexposureid").primaryKey(),
    alarmid: integer("alarmid").references(() => alarms.alarmid, { onDelete: "cascade" }),
    status: boolean(),
    url: varchar("url", { length: 255 }).notNull(),
    login: varchar("login", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    channelname: varchar("channelname", { length: 255 }).notNull(),
    channeluserid: varchar("channeluserid", { length: 255 }).notNull(),
});

export type credentialexposureModel = typeof credentialexposure.$inferInsert;