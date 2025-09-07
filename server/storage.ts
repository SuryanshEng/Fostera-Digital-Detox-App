import { 
  type User, 
  type InsertUser,
  type ScreenTimeEntry,
  type InsertScreenTimeEntry,
  type AppUsageEntry,
  type InsertAppUsageEntry,
  type FocusSession,
  type InsertFocusSession,
  type DailyQuote,
  type InsertDailyQuote,
  type UserAchievement,
  type InsertUserAchievement,
  type UserSettings,
  type InsertUserSettings,
  getClassificationFromMinutes
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Screen Time
  getScreenTimeEntry(userId: string, date: string): Promise<ScreenTimeEntry | undefined>;
  createScreenTimeEntry(entry: InsertScreenTimeEntry): Promise<ScreenTimeEntry>;
  updateScreenTimeEntry(id: string, updates: Partial<ScreenTimeEntry>): Promise<ScreenTimeEntry>;
  getWeeklyScreenTime(userId: string, startDate: string): Promise<ScreenTimeEntry[]>;

  // App Usage
  getAppUsageForScreenTime(screenTimeId: string): Promise<AppUsageEntry[]>;
  createAppUsageEntry(entry: InsertAppUsageEntry): Promise<AppUsageEntry>;

  // Focus Sessions
  getActiveFocusSession(userId: string): Promise<FocusSession | undefined>;
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  updateFocusSession(id: string, updates: Partial<FocusSession>): Promise<FocusSession>;
  getUserFocusSessions(userId: string, date?: string): Promise<FocusSession[]>;

  // Daily Quotes
  getRandomDailyQuote(): Promise<DailyQuote | undefined>;
  getAllQuotes(): Promise<DailyQuote[]>;
  createDailyQuote(quote: InsertDailyQuote): Promise<DailyQuote>;

  // Achievements
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;

  // Settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private screenTimeEntries: Map<string, ScreenTimeEntry> = new Map();
  private appUsageEntries: Map<string, AppUsageEntry> = new Map();
  private focusSessions: Map<string, FocusSession> = new Map();
  private dailyQuotes: Map<string, DailyQuote> = new Map();
  private userAchievements: Map<string, UserAchievement> = new Map();
  private userSettings: Map<string, UserSettings> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username: "sarah_johnson",
      email: "sarah.johnson@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      isPremium: true,
      dailyGoalMinutes: 240,
      createdAt: new Date(),
    };
    this.users.set(userId, user);

    // Create default quotes
    const quotes = [
      { quote: "The real opportunity for success lies within the person and not in the job.", author: "Zig Ziglar", category: "motivation" },
      { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss", category: "productivity" },
      { quote: "Digital minimalism is a philosophy that helps you question what digital communication tools add value to your life.", author: "Cal Newport", category: "wellness" },
      { quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey", category: "productivity" },
      { quote: "Technology is best when it brings people together.", author: "Matt Mullenweg", category: "wellness" },
    ];

    quotes.forEach(q => {
      const id = randomUUID();
      const quote: DailyQuote = { id, ...q, isActive: true };
      this.dailyQuotes.set(id, quote);
    });

    // Create current day's screen time entry
    const today = new Date().toISOString().split('T')[0];
    const screenTimeId = randomUUID();
    const screenTime: ScreenTimeEntry = {
      id: screenTimeId,
      userId,
      date: today,
      totalMinutes: 154, // 2h 34m
      pickups: 47,
      focusMinutes: 105, // 1h 45m
      classification: getClassificationFromMinutes(154),
      createdAt: new Date(),
    };
    this.screenTimeEntries.set(screenTimeId, screenTime);

    // Create app usage entries
    const appUsages = [
      { appName: "Facebook", appIcon: "fab fa-facebook-f", minutes: 45, category: "social" },
      { appName: "Instagram", appIcon: "fab fa-instagram", minutes: 38, category: "social" },
      { appName: "YouTube", appIcon: "fab fa-youtube", minutes: 32, category: "entertainment" },
      { appName: "WhatsApp", appIcon: "fab fa-whatsapp", minutes: 28, category: "communication" },
      { appName: "Games", appIcon: "fas fa-gamepad", minutes: 21, category: "entertainment" },
    ];

    appUsages.forEach(app => {
      const id = randomUUID();
      const usage: AppUsageEntry = { id, screenTimeId, ...app };
      this.appUsageEntries.set(id, usage);
    });

    // Create user settings
    const settingsId = randomUUID();
    const settings: UserSettings = {
      id: settingsId,
      userId,
      notifications: true,
      darkMode: false,
      usageAlerts: true,
      focusReminders: true,
      weeklyReports: true,
    };
    this.userSettings.set(settingsId, settings);

    // Create sample achievements
    const achievements = [
      { achievementType: "streak", achievementName: "12-Day Streak", description: "You've maintained healthy screen time for 12 consecutive days!" },
      { achievementType: "focus_master", achievementName: "Focus Master", description: "Completed 10 focus sessions this week" },
    ];

    achievements.forEach(ach => {
      const id = randomUUID();
      const achievement: UserAchievement = { id, userId, ...ach, unlockedAt: new Date() };
      this.userAchievements.set(id, achievement);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Screen Time
  async getScreenTimeEntry(userId: string, date: string): Promise<ScreenTimeEntry | undefined> {
    return Array.from(this.screenTimeEntries.values()).find(
      entry => entry.userId === userId && entry.date === date
    );
  }

  async createScreenTimeEntry(insertEntry: InsertScreenTimeEntry): Promise<ScreenTimeEntry> {
    const id = randomUUID();
    const entry: ScreenTimeEntry = { ...insertEntry, id, createdAt: new Date() };
    this.screenTimeEntries.set(id, entry);
    return entry;
  }

  async updateScreenTimeEntry(id: string, updates: Partial<ScreenTimeEntry>): Promise<ScreenTimeEntry> {
    const entry = this.screenTimeEntries.get(id);
    if (!entry) throw new Error("Screen time entry not found");
    
    const updatedEntry = { ...entry, ...updates };
    this.screenTimeEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async getWeeklyScreenTime(userId: string, startDate: string): Promise<ScreenTimeEntry[]> {
    const start = new Date(startDate);
    const entries: ScreenTimeEntry[] = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry = await this.getScreenTimeEntry(userId, dateStr);
      if (entry) {
        entries.push(entry);
      }
    }
    
    return entries;
  }

  // App Usage
  async getAppUsageForScreenTime(screenTimeId: string): Promise<AppUsageEntry[]> {
    return Array.from(this.appUsageEntries.values()).filter(
      entry => entry.screenTimeId === screenTimeId
    );
  }

  async createAppUsageEntry(insertEntry: InsertAppUsageEntry): Promise<AppUsageEntry> {
    const id = randomUUID();
    const entry: AppUsageEntry = { ...insertEntry, id };
    this.appUsageEntries.set(id, entry);
    return entry;
  }

  // Focus Sessions
  async getActiveFocusSession(userId: string): Promise<FocusSession | undefined> {
    return Array.from(this.focusSessions.values()).find(
      session => session.userId === userId && !session.endTime
    );
  }

  async createFocusSession(insertSession: InsertFocusSession): Promise<FocusSession> {
    const id = randomUUID();
    const session: FocusSession = { ...insertSession, id };
    this.focusSessions.set(id, session);
    return session;
  }

  async updateFocusSession(id: string, updates: Partial<FocusSession>): Promise<FocusSession> {
    const session = this.focusSessions.get(id);
    if (!session) throw new Error("Focus session not found");
    
    const updatedSession = { ...session, ...updates };
    this.focusSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserFocusSessions(userId: string, date?: string): Promise<FocusSession[]> {
    const sessions = Array.from(this.focusSessions.values()).filter(
      session => session.userId === userId
    );

    if (date) {
      const targetDate = new Date(date);
      return sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0];
      });
    }

    return sessions;
  }

  // Daily Quotes
  async getRandomDailyQuote(): Promise<DailyQuote | undefined> {
    const activeQuotes = Array.from(this.dailyQuotes.values()).filter(q => q.isActive);
    if (activeQuotes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * activeQuotes.length);
    return activeQuotes[randomIndex];
  }

  async getAllQuotes(): Promise<DailyQuote[]> {
    return Array.from(this.dailyQuotes.values());
  }

  async createDailyQuote(insertQuote: InsertDailyQuote): Promise<DailyQuote> {
    const id = randomUUID();
    const quote: DailyQuote = { ...insertQuote, id };
    this.dailyQuotes.set(id, quote);
    return quote;
  }

  // Achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      achievement => achievement.userId === userId
    );
  }

  async createUserAchievement(insertAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = randomUUID();
    const achievement: UserAchievement = { ...insertAchievement, id, unlockedAt: new Date() };
    this.userAchievements.set(id, achievement);
    return achievement;
  }

  // Settings
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      settings => settings.userId === userId
    );
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = randomUUID();
    const settings: UserSettings = { ...insertSettings, id };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    if (!existing) throw new Error("User settings not found");
    
    const updatedSettings = { ...existing, ...updates };
    this.userSettings.set(existing.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
