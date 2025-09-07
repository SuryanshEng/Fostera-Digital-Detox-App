import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  isPremium: boolean("is_premium").default(false),
  dailyGoalMinutes: integer("daily_goal_minutes").default(240), // 4 hours default
  createdAt: timestamp("created_at").defaultNow(),
});

export const screenTimeEntries = pgTable("screen_time_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  totalMinutes: integer("total_minutes").notNull(),
  pickups: integer("pickups").default(0),
  focusMinutes: integer("focus_minutes").default(0),
  classification: text("classification").notNull(), // blue, yellow, orange, purple, red, brown, flag
  createdAt: timestamp("created_at").defaultNow(),
});

export const appUsageEntries = pgTable("app_usage_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  screenTimeId: varchar("screen_time_id").notNull().references(() => screenTimeEntries.id),
  appName: text("app_name").notNull(),
  appIcon: text("app_icon").notNull(), // CSS class or icon name
  minutes: integer("minutes").notNull(),
  category: text("category").notNull(), // social, productivity, entertainment, etc.
});

export const focusSessions = pgTable("focus_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  targetMinutes: integer("target_minutes").notNull(),
  actualMinutes: integer("actual_minutes").default(0),
  isCompleted: boolean("is_completed").default(false),
  blockedApps: jsonb("blocked_apps").$type<string[]>().default([]),
});

export const dailyQuotes = pgTable("daily_quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(), // motivation, productivity, wellness, etc.
  isActive: boolean("is_active").default(true),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementType: text("achievement_type").notNull(), // streak, goal_met, focus_master, etc.
  achievementName: text("achievement_name").notNull(),
  description: text("description").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  notifications: boolean("notifications").default(true),
  darkMode: boolean("dark_mode").default(false),
  usageAlerts: boolean("usage_alerts").default(true),
  focusReminders: boolean("focus_reminders").default(true),
  weeklyReports: boolean("weekly_reports").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertScreenTimeSchema = createInsertSchema(screenTimeEntries).omit({ id: true, createdAt: true });
export const insertAppUsageSchema = createInsertSchema(appUsageEntries).omit({ id: true });
export const insertFocusSessionSchema = createInsertSchema(focusSessions).omit({ id: true });
export const insertDailyQuoteSchema = createInsertSchema(dailyQuotes).omit({ id: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, unlockedAt: true });
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ScreenTimeEntry = typeof screenTimeEntries.$inferSelect;
export type InsertScreenTimeEntry = z.infer<typeof insertScreenTimeSchema>;
export type AppUsageEntry = typeof appUsageEntries.$inferSelect;
export type InsertAppUsageEntry = z.infer<typeof insertAppUsageSchema>;
export type FocusSession = typeof focusSessions.$inferSelect;
export type InsertFocusSession = z.infer<typeof insertFocusSessionSchema>;
export type DailyQuote = typeof dailyQuotes.$inferSelect;
export type InsertDailyQuote = z.infer<typeof insertDailyQuoteSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

// Classification helper
export function getClassificationFromMinutes(minutes: number): string {
  if (minutes >= 720) return "flag"; // 12+ hours
  if (minutes >= 480) return "brown"; // 8-12 hours
  if (minutes >= 360) return "red"; // 6-8 hours
  if (minutes >= 240) return "purple"; // 4-6 hours
  if (minutes >= 180) return "orange"; // 3-4 hours
  if (minutes >= 120) return "yellow"; // 2-3 hours
  return "blue"; // 0-2 hours
}
