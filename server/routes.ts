import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/compression-history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.saveCompressionHistory({
        ...req.body,
        userId,
      });
      res.json(history);
    } catch (error) {
      console.error("Error saving compression history:", error);
      res.status(500).json({ message: "Failed to save compression history" });
    }
  });

  app.get("/api/compression-history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getUserCompressionHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching compression history:", error);
      res.status(500).json({ message: "Failed to fetch compression history" });
    }
  });

  app.post("/api/presets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preset = await storage.createPreset({
        ...req.body,
        userId,
      });
      res.json(preset);
    } catch (error) {
      console.error("Error creating preset:", error);
      res.status(500).json({ message: "Failed to create preset" });
    }
  });

  app.get("/api/presets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const presets = await storage.getUserPresets(userId);
      res.json(presets);
    } catch (error) {
      console.error("Error fetching presets:", error);
      res.status(500).json({ message: "Failed to fetch presets" });
    }
  });

  app.delete("/api/presets/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deletePreset(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting preset:", error);
      res.status(500).json({ message: "Failed to delete preset" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
