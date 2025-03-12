import { pgTable, varchar, integer, primaryKey } from "drizzle-orm/pg-core";
import { credentials } from "./credentials";
import { alarms } from "./alarms";

export const credentialexposure = pgTable("credentialexposure", {
    credentialid: integer("credentialid").references(() => credentials.credentialid, { onDelete: "cascade" }),
    alarmid: integer("alarmid").references(() => alarms.alarmid, { onDelete: "cascade" }),
    status: varchar("status", { length: 255 }).notNull(),
}, (table) => {
    return [
        primaryKey({ columns: [table.credentialid, table.alarmid] })
    ];
});

export type credentialexposureModel = typeof credentialexposure.$inferInsert;