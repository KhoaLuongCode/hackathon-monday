// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `hackathon_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

export const emails = createTable(
  "emails",
  {
    emailId: integer("email_id").primaryKey().generatedByDefaultAsIdentity(),
    sender: varchar("sender", { length: 256 }),
    summary: varchar("summary", { length: 512 }),
    priority: varchar("priority", { length: 10 }),
    title: varchar("title", { length: 256 }),
    time: timestamp("time", { withTimezone: true }),
    originalContent: varchar("originalContent", { length: 512 })
  },
  (example) => ({
    priorityIndex: index("priority_idx").on(example.priority),
    priorityCheck: sql`CHECK (priority IN ('high', 'mid', 'low', 'none'))`,
  })
);

