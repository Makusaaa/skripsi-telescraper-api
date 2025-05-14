import { pgTable, varchar, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { company } from "./company";

export const alarms = pgTable("alarms", {
    alarmid: serial("alarmid").primaryKey(),
    companyid: integer("companyid").references(() => company.companyid, { onDelete: "cascade" }),
    status: integer("status").notNull().default(0),
    assignto: integer("assignto").references(() => users.userid, { onDelete: "set null" }),
    discoverydate: timestamp("discoverydate").default(sql`CURRENT_TIMESTAMP AT TIME ZONE 'UTC'`),
    filename: varchar("filename", { length: 255 }).notNull(),
    channelname: varchar("channelname", { length: 255 }).notNull(),
    channeluserid: varchar("channeluserid", { length: 255 }).notNull(),
    messageid: varchar("messageid", { length: 255 }).notNull(),
    notes: varchar("notes", { length: 255 }),
});

export type alarmsModel = typeof alarms.$inferInsert;