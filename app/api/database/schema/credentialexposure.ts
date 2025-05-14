import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";
import { alarms } from "./alarms";

export const credentialexposure = pgTable("credentialexposure", {
    credentialexposureid: serial("credentialexposureid").primaryKey(),
    alarmid: integer("alarmid").references(() => alarms.alarmid, { onDelete: "cascade" }),
    status: integer("status").notNull().default(0),
    url: text("url").notNull(),
    login: text("login").notNull(),
    password: text("password").notNull(),
});

export type credentialexposureModel = typeof credentialexposure.$inferInsert;