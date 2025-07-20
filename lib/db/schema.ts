import { pgTable, text, timestamp, jsonb, uuid, boolean, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for Auth.js
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Accounts table for Auth.js OAuth
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: timestamp('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

// Sessions table for Auth.js
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: text('sessionToken').notNull().unique(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

// Verification tokens table for Auth.js
export const verificationTokens = pgTable('verificationTokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
});

// Weather data table
export const airflowWeatherData = pgTable('airflow_weather_data', {
  id: serial('id').primaryKey(),
  city: text('city').notNull(),
  requestTimestamp: timestamp('request_timestamp').defaultNow(),
  responseJson: jsonb('response_json').notNull(),
  userId: uuid('user_id').references(() => users.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  weatherData: many(airflowWeatherData),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const weatherDataRelations = relations(airflowWeatherData, ({ one }) => ({
  user: one(users, { fields: [airflowWeatherData.userId], references: [users.id] }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type WeatherData = typeof airflowWeatherData.$inferSelect;
export type NewWeatherData = typeof airflowWeatherData.$inferInsert;