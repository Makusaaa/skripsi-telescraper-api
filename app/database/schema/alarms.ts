import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "./users";

export const alarms = pgTable("alarms", {
    alarmid: serial("alarmid").primaryKey(),
    fileid: integer("fileid").references(() => files.fileid, { onDelete: "cascade" }),
    status: varchar("status", { length: 255 }).notNull(),
    assignto: integer("assignto").references(() => users.userid, { onDelete: "set null" }),
    discoverydate: timestamp("discoverydate").notNull()
});

export type alarmsModel = typeof alarms.$inferInsert;