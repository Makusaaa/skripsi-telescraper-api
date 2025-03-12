import { pgTable, varchar, integer, primaryKey } from "drizzle-orm/pg-core";
import { credentials } from "./credentials";
import { alarms } from "./alarms";

export const credentialexposure = pgTable("credentialexposure", {
    CredentialID: integer("credentialid").references(() => credentials.CredentialID, { onDelete: "cascade" }),
    AlarmID: integer("alarmid").references(() => alarms.AlarmID, { onDelete: "cascade" }),
    Status: varchar("status", { length: 255 }).notNull(),
}, (table) => {
    return [
        primaryKey({ columns: [table.CredentialID, table.AlarmID] })
    ];
});