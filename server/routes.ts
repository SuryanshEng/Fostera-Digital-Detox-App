import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScreenTimeSchema, insertFocusSessionSchema, getClassificationFromMinutes } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (for now, we'll use the seeded user)
  app.get("/api/user/current", async (req, res) => {
    try {
      // For demo purposes, get the first user
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get daily screen time
  app.get("/api/screen-time/today", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const today = new Date().toISOString().split('T')[0];
      const entry = await storage.getScreenTimeEntry(user.id, today);
      
      if (!entry) {
        // Create a new entry for today with minimal data
        const newEntry = await storage.createScreenTimeEntry({
          userId: user.id,
          date: today,
          totalMinutes: 0,
          pickups: 0,
          focusMinutes: 0,
          classification: getClassificationFromMinutes(0),
        });
        return res.json(newEntry);
      }

      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to get screen time" });
    }
  });

  // Update screen time
  app.post("/api/screen-time/update", async (req, res) => {
    try {
      const data = insertScreenTimeSchema.parse(req.body);
      const classification = getClassificationFromMinutes(data.totalMinutes);
      
      const existingEntry = await storage.getScreenTimeEntry(data.userId, data.date);
      
      let entry;
      if (existingEntry) {
        entry = await storage.updateScreenTimeEntry(existingEntry.id, {
          ...data,
          classification,
        });
      } else {
        entry = await storage.createScreenTimeEntry({
          ...data,
          classification,
        });
      }

      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update screen time" });
    }
  });

  // Get app usage for today
  app.get("/api/app-usage/today", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const today = new Date().toISOString().split('T')[0];
      const screenTimeEntry = await storage.getScreenTimeEntry(user.id, today);
      
      if (!screenTimeEntry) {
        return res.json([]);
      }

      const appUsage = await storage.getAppUsageForScreenTime(screenTimeEntry.id);
      res.json(appUsage);
    } catch (error) {
      res.status(500).json({ message: "Failed to get app usage" });
    }
  });

  // Get weekly screen time
  app.get("/api/screen-time/weekly", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get last 7 days
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 6);
      const startDate = weekStart.toISOString().split('T')[0];

      const weeklyData = await storage.getWeeklyScreenTime(user.id, startDate);
      res.json(weeklyData);
    } catch (error) {
      res.status(500).json({ message: "Failed to get weekly screen time" });
    }
  });

  // Get daily quote
  app.get("/api/quotes/daily", async (req, res) => {
    try {
      const quote = await storage.getRandomDailyQuote();
      if (!quote) {
        return res.status(404).json({ message: "No quotes available" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily quote" });
    }
  });

  // Start focus session
  app.post("/api/focus/start", async (req, res) => {
    try {
      const schema = z.object({
        targetMinutes: z.number().min(1),
        blockedApps: z.array(z.string()).optional(),
      });

      const data = schema.parse(req.body);
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if there's already an active session
      const activeSession = await storage.getActiveFocusSession(user.id);
      if (activeSession) {
        return res.status(400).json({ message: "Focus session already active" });
      }

      const session = await storage.createFocusSession({
        userId: user.id,
        startTime: new Date(),
        targetMinutes: data.targetMinutes,
        blockedApps: data.blockedApps || [],
        actualMinutes: 0,
        isCompleted: false,
      });

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to start focus session" });
    }
  });

  // End focus session
  app.post("/api/focus/end/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const now = new Date();
      
      const session = await storage.updateFocusSession(sessionId, {
        endTime: now,
        isCompleted: true,
      });

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to end focus session" });
    }
  });

  // Get active focus session
  app.get("/api/focus/active", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const activeSession = await storage.getActiveFocusSession(user.id);
      res.json(activeSession || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get active focus session" });
    }
  });

  // Get user achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const achievements = await storage.getUserAchievements(user.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  // Get user settings
  app.get("/api/settings", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const settings = await storage.getUserSettings(user.id);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get settings" });
    }
  });

  // Update user settings
  app.patch("/api/settings", async (req, res) => {
    try {
      const users = Array.from((storage as any).users.values());
      const user = users[0];
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const settings = await storage.updateUserSettings(user.id, req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
