import { pgTable, varchar, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "./users";
import { company } from "./company";

export const alarms = pgTable("alarms", {
    alarmid: serial("alarmid").primaryKey(),
    companyid: integer("companyid").references(() => company.companyid, { onDelete: "cascade" }),
    status: boolean(),
    assignto: integer("assignto").references(() => users.userid, { onDelete: "set null" }),
    discoverydate: timestamp("discoverydate").defaultNow(),
    filename: varchar("filename", { length: 255 }).notNull(),
    channelname: varchar("channelname", { length: 255 }).notNull(),
    channeluserid: varchar("channeluserid", { length: 255 }).notNull(),
});

export type alarmsModel = typeof alarms.$inferInsert;