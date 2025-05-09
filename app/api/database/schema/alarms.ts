import { pgTable, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "./users";
import { company } from "./company";

export const alarms = pgTable("alarms", {
    alarmid: serial("alarmid").primaryKey(),
    companyid: integer("companyid").references(() => company.companyid, { onDelete: "cascade" }),
    fileid: integer("fileid").references(() => files.fileid, { onDelete: "cascade" }),
    status: boolean(),
    assignto: integer("assignto").references(() => users.userid, { onDelete: "set null" }),
    discoverydate: timestamp("discoverydate").defaultNow()
});

export type alarmsModel = typeof alarms.$inferInsert;