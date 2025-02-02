import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Auto-incrementing primary key
});

export const chats = pgTable('chats', {
  id: serial("id").primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: varchar("user_id").references(() => users.id).notNull(), 
});