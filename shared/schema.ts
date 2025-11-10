import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, integer, jsonb, index, text, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compression history table
export const compressionHistory = pgTable("compression_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  originalFileName: text("original_file_name").notNull(),
  originalSize: integer("original_size").notNull(),
  compressedSize: integer("compressed_size").notNull(),
  originalFormat: varchar("original_format").notNull(),
  targetFormat: varchar("target_format"),
  compressionRatio: integer("compression_ratio").notNull(),
  preset: varchar("preset").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved compression presets table
export const savedPresets = pgTable("saved_presets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  compressionPreset: varchar("compression_preset").notNull(),
  quality: integer("quality").notNull(),
  maxSizeMB: integer("max_size_mb").notNull(),
  resizePreset: varchar("resize_preset"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type CompressionHistory = typeof compressionHistory.$inferSelect;
export type InsertCompressionHistory = typeof compressionHistory.$inferInsert;
export type SavedPreset = typeof savedPresets.$inferSelect;
export type InsertSavedPreset = typeof savedPresets.$inferInsert;

export type ImageFormat = "jpeg" | "jpg" | "png" | "webp" | "heic" | "avif" | "bmp" | "svg" | "tiff";

export type CompressionPreset = "auto" | "200kb" | "100kb" | "50kb" | "custom";

export type ResizePreset = 
  | "instagram-square"
  | "instagram-portrait"
  | "shopify"
  | "etsy"
  | "web-hd"
  | "web-thumbnail"
  | "custom";

export const resizePresets: Record<ResizePreset, { width: number; height: number; label: string }> = {
  "instagram-square": { width: 1080, height: 1080, label: "Instagram Square (1080×1080)" },
  "instagram-portrait": { width: 1080, height: 1350, label: "Instagram Portrait (1080×1350)" },
  "shopify": { width: 2048, height: 2048, label: "Shopify (2048×2048)" },
  "etsy": { width: 2000, height: 2000, label: "Etsy (2000×2000)" },
  "web-hd": { width: 1920, height: 1080, label: "Web HD (1920×1080)" },
  "web-thumbnail": { width: 400, height: 400, label: "Web Thumbnail (400×400)" },
  "custom": { width: 0, height: 0, label: "Custom Dimensions" },
};

export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalPreview: string;
  compressedFile: File | null;
  compressedPreview: string | null;
  originalSize: number;
  compressedSize: number | null;
  compressionRatio: number | null;
  format: ImageFormat;
  targetFormat: ImageFormat | null;
  width: number;
  height: number;
  status: "pending" | "processing" | "completed" | "error";
  error: string | null;
}

export interface CompressionOptions {
  preset: CompressionPreset;
  quality: number;
  maxSizeMB: number;
  useWebWorker: boolean;
}

export interface ConversionOptions {
  targetFormat: ImageFormat;
  quality: number;
}

export interface ResizeOptions {
  preset: ResizePreset;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
}

export const imageFormatLabels: Record<ImageFormat, string> = {
  jpeg: "JPEG",
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
  heic: "HEIC",
  avif: "AVIF",
  bmp: "BMP",
  svg: "SVG",
  tiff: "TIFF",
};

export const compressionPresetConfigs: Record<CompressionPreset, { maxSizeMB: number; quality: number; label: string }> = {
  auto: { maxSizeMB: 1, quality: 0.8, label: "Smart Auto" },
  "200kb": { maxSizeMB: 0.2, quality: 0.75, label: "200 KB" },
  "100kb": { maxSizeMB: 0.1, quality: 0.7, label: "100 KB" },
  "50kb": { maxSizeMB: 0.05, quality: 0.65, label: "50 KB" },
  custom: { maxSizeMB: 1, quality: 0.8, label: "Custom" },
};
