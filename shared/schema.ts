import { z } from "zod";

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
