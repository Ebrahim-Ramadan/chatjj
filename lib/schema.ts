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
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  name: varchar("name", { length: 255 }).notNull(), // User's full name
  email: varchar("email", { length: 255 }).notNull().unique(), // Unique email address
  password: varchar("password", { length: 255 }).notNull(), // Hashed password
  createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp when the user was created
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Timestamp when the user was last updated
});

export const chats = pgTable('chats', {
  id: serial("id").primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: integer("user_id").references(() => users.id).notNull(), 
});