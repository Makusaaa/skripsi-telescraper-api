import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "./users";

export const alarms = pgTable("alarms", {
    AlarmID: serial("alarmid").primaryKey(),
    FileID: integer("fileid").references(() => files.FileID, { onDelete: "cascade" }),
    Status: varchar("status", { length: 255 }).notNull(),
    AssignTo: integer("assignto").references(() => users.UserID, { onDelete: "set null" }),
    DiscoveryDate: timestamp("discoverydate").notNull()
});