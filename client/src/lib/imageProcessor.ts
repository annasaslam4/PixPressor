import imageCompression from "browser-image-compression";
import heic2any from "heic2any";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { ImageFormat, CompressionOptions, ConversionOptions, ResizeOptions, ProcessedImage } from "@shared/schema";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 10;

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 10MB limit` };
  }
  
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/avif", "image/bmp", "image/svg+xml", "image/tiff"];
  if (!validTypes.some(type => file.type === type || file.name.toLowerCase().endsWith(type.replace("image/", ".")))) {
    return { valid: false, error: "Unsupported file format" };
  }
  
  return { valid: true };
}

export function validateFileCount(currentCount: number, newCount: number): { valid: boolean; error?: string } {
  if (currentCount + newCount > MAX_FILES) {
    return { valid: false, error: `Maximum ${MAX_FILES} files allowed` };
  }
  return { valid: true };
}

export async function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export function getImageFormat(file: File): ImageFormat {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "jpg") return "jpeg";
  return (extension as ImageFormat) || "jpeg";
}

export function determineCompressionMethod(file: File): "lossy" | "lossless" {
  const format = getImageFormat(file);
  
  if (format === "png" && file.size < 500 * 1024) {
    return "lossless";
  }
  
  if (format === "jpeg" || format === "jpg" || format === "webp") {
    return "lossy";
  }
  
  return file.size > 1024 * 1024 ? "lossy" : "lossless";
}

export async function compressImage(file: File, options: CompressionOptions): Promise<File> {
  try {
    let processFile = file;
    
    if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      const blob = Array.isArray(converted) ? converted[0] : converted;
      processFile = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
    }
    
    const compressionOptions = {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: 4096,
      useWebWorker: options.useWebWorker,
      initialQuality: options.quality,
      fileType: processFile.type,
    };
    
    const compressed = await imageCompression(processFile, compressionOptions);
    
    return new File([compressed], file.name, { type: compressed.type });
  } catch (error) {
    console.error("Compression error:", error);
    throw new Error("Failed to compress image");
  }
}

export async function convertImageFormat(file: File, options: ConversionOptions): Promise<File> {
  return new Promise(async (resolve, reject) => {
    try {
      let processFile = file;
      
      if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
        const converted = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        processFile = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
      }
      
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      
      const url = URL.createObjectURL(processFile);
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const mimeType = `image/${options.targetFormat === "jpeg" || options.targetFormat === "jpg" ? "jpeg" : options.targetFormat}`;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFileName = file.name.replace(/\.[^.]+$/, `.${options.targetFormat}`);
              const convertedFile = new File([blob], newFileName, { type: mimeType });
              URL.revokeObjectURL(url);
              resolve(convertedFile);
            } else {
              URL.revokeObjectURL(url);
              reject(new Error("Failed to convert image"));
            }
          },
          mimeType,
          options.quality
        );
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image for conversion"));
      };
      
      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

export async function resizeImage(file: File, options: ResizeOptions): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }
    
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      let width = options.width;
      let height = options.height;
      
      if (options.maintainAspectRatio) {
        const aspectRatio = img.width / img.height;
        if (width && !height) {
          height = Math.round(width / aspectRatio);
        } else if (height && !width) {
          width = Math.round(height * aspectRatio);
        }
      }
      
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, { type: file.type });
            URL.revokeObjectURL(url);
            resolve(resizedFile);
          } else {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to resize image"));
          }
        },
        file.type,
        0.9
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for resizing"));
    };
    
    img.src = url;
  });
}

export function downloadFile(file: File, filename?: string) {
  saveAs(file, filename || file.name);
}

export async function downloadAsZip(images: ProcessedImage[], filename: string = "compressed-images.zip") {
  const zip = new JSZip();
  
  images.forEach((img) => {
    const file = img.compressedFile || img.originalFile;
    zip.file(file.name, file);
  });
  
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, filename);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function calculateCompressionRatio(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}
