import { 
  users, 
  compressionHistory, 
  savedPresets,
  type User, 
  type UpsertUser,
  type CompressionHistory,
  type InsertCompressionHistory,
  type SavedPreset,
  type InsertSavedPreset
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Compression history operations
  saveCompressionHistory(history: InsertCompressionHistory): Promise<CompressionHistory>;
  getUserCompressionHistory(userId: string, limit?: number): Promise<CompressionHistory[]>;
  
  // Saved presets operations
  createPreset(preset: InsertSavedPreset): Promise<SavedPreset>;
  getUserPresets(userId: string): Promise<SavedPreset[]>;
  deletePreset(id: string): Promise<void>;
  updatePreset(id: string, preset: Partial<InsertSavedPreset>): Promise<SavedPreset>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async saveCompressionHistory(history: InsertCompressionHistory): Promise<CompressionHistory> {
    const [saved] = await db
      .insert(compressionHistory)
      .values(history)
      .returning();
    return saved;
  }

  async getUserCompressionHistory(userId: string, limit: number = 50): Promise<CompressionHistory[]> {
    return await db
      .select()
      .from(compressionHistory)
      .where(eq(compressionHistory.userId, userId))
      .orderBy(desc(compressionHistory.createdAt))
      .limit(limit);
  }

  async createPreset(preset: InsertSavedPreset): Promise<SavedPreset> {
    const [created] = await db
      .insert(savedPresets)
      .values(preset)
      .returning();
    return created;
  }

  async getUserPresets(userId: string): Promise<SavedPreset[]> {
    return await db
      .select()
      .from(savedPresets)
      .where(eq(savedPresets.userId, userId))
      .orderBy(desc(savedPresets.createdAt));
  }

  async deletePreset(id: string): Promise<void> {
    await db.delete(savedPresets).where(eq(savedPresets.id, id));
  }

  async updatePreset(id: string, preset: Partial<InsertSavedPreset>): Promise<SavedPreset> {
    const [updated] = await db
      .update(savedPresets)
      .set(preset)
      .where(eq(savedPresets.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
