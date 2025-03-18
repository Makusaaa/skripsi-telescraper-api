import { pgTable, integer, varchar} from "drizzle-orm/pg-core"
export const credentials = pgTable('trcredentials', {
  id: integer(),
  chatid: varchar(),
  messageid: varchar(),
  url: varchar(),
  login: varchar(),
  password: varchar()
});