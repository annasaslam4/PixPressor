import { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import { Header } from "@/components/Header";
import { FileUploadZone } from "@/components/FileUploadZone";
import { ImagePreviewCard } from "@/components/ImagePreviewCard";
import { CompressionControls } from "@/components/CompressionControls";
import { ResizePresetSelector } from "@/components/ResizePresetSelector";
import { FAQ } from "@/components/FAQ";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, Zap, Shield, Globe } from "lucide-react";
import type { ProcessedImage, CompressionPreset, ImageFormat, ResizePreset } from "@shared/schema";
import { compressionPresetConfigs, resizePresets } from "@shared/schema";
import {
  validateFile,
  validateFileCount,
  createImagePreview,
  getImageDimensions,
  getImageFormat,
  compressImage,
  convertImageFormat,
  resizeImage,
  downloadFile,
  downloadAsZip,
  determineCompressionMethod,
} from "@/lib/imageProcessor";

const MAX_FILES = 10;

export default function HomePage() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [compressionPreset, setCompressionPreset] = useState<CompressionPreset>("auto");
  const [selectedResizePreset, setSelectedResizePreset] = useState<ResizePreset | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
    }
  }, []);
  
  const handleFilesSelected = useCallback(async (files: File[]) => {
    const countValidation = validateFileCount(images.length, files.length);
    if (!countValidation.valid) {
      toast({
        title: "Too many files",
        description: countValidation.error,
        variant: "destructive",
      });
      return;
    }
    
    const validFiles: File[] = [];
    
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    const newImages: ProcessedImage[] = await Promise.all(
      validFiles.map(async (file) => {
        const preview = await createImagePreview(file);
        const dimensions = await getImageDimensions(file);
        const format = getImageFormat(file);
        
        return {
          id: nanoid(),
          originalFile: file,
          originalPreview: preview,
          compressedFile: null,
          compressedPreview: null,
          originalSize: file.size,
          compressedSize: null,
          compressionRatio: null,
          format,
          targetFormat: null,
          width: dimensions.width,
          height: dimensions.height,
          status: "pending" as const,
          error: null,
        };
      })
    );
    
    setImages((prev) => [...prev, ...newImages]);
    
    newImages.forEach((image) => processImage(image));
    
    toast({
      title: "Files added",
      description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} ready for compression`,
    });
  }, [images.length, toast]);
  
  const processImage = useCallback(async (image: ProcessedImage) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === image.id ? { ...img, status: "processing" as const } : img
      )
    );
    
    try {
      const preset = compressionPresetConfigs[compressionPreset];
      let processedFile = image.originalFile;
      
      if (selectedResizePreset && selectedResizePreset !== "custom") {
        const resizeConfig = resizePresets[selectedResizePreset];
        processedFile = await resizeImage(processedFile, {
          preset: selectedResizePreset,
          width: resizeConfig.width,
          height: resizeConfig.height,
          maintainAspectRatio: true,
        });
      }
      
      const method = determineCompressionMethod(processedFile);
      const quality = method === "lossy" ? preset.quality : 1;
      
      const compressedFile = await compressImage(processedFile, {
        preset: compressionPreset,
        quality,
        maxSizeMB: preset.maxSizeMB,
        useWebWorker: true,
      });
      
      const compressedPreview = await createImagePreview(compressedFile);
      
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                compressedFile,
                compressedPreview,
                compressedSize: compressedFile.size,
                status: "completed" as const,
              }
            : img
        )
      );
    } catch (error) {
      console.error("Processing error:", error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? {
                ...img,
                status: "error" as const,
                error: error instanceof Error ? error.message : "Processing failed",
              }
            : img
        )
      );
    }
  }, [compressionPreset, selectedResizePreset]);
  
  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);
  
  const handleDownloadImage = useCallback((id: string) => {
    const image = images.find((img) => img.id === id);
    if (!image) return;
    
    const file = image.compressedFile || image.originalFile;
    downloadFile(file);
    
    toast({
      title: "Download started",
      description: `Downloading ${file.name}`,
    });
  }, [images, toast]);
  
  const handleConvertFormat = useCallback(async (id: string, targetFormat: ImageFormat) => {
    const image = images.find((img) => img.id === id);
    if (!image) return;
    
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, status: "processing" as const, targetFormat } : img
      )
    );
    
    try {
      const sourceFile = image.compressedFile || image.originalFile;
      const convertedFile = await convertImageFormat(sourceFile, {
        targetFormat,
        quality: 0.9,
      });
      
      const convertedPreview = await createImagePreview(convertedFile);
      
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                compressedFile: convertedFile,
                compressedPreview: convertedPreview,
                compressedSize: convertedFile.size,
                targetFormat,
                status: "completed" as const,
              }
            : img
        )
      );
      
      toast({
        title: "Conversion complete",
        description: `Converted to ${targetFormat.toUpperCase()}`,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                status: "error" as const,
                error: "Conversion failed",
              }
            : img
        )
      );
      
      toast({
        title: "Conversion failed",
        description: "Unable to convert image format",
        variant: "destructive",
      });
    }
  }, [images, toast]);
  
  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter((img) => img.status === "completed");
    if (completedImages.length === 0) {
      toast({
        title: "No images ready",
        description: "Wait for processing to complete",
        variant: "destructive",
      });
      return;
    }
    
    await downloadAsZip(completedImages);
    
    toast({
      title: "Download started",
      description: `Downloading ${completedImages.length} images as ZIP`,
    });
  }, [images, toast]);
  
  const handlePresetChange = useCallback((preset: CompressionPreset) => {
    setCompressionPreset(preset);
    
    images.forEach((image) => {
      if (image.status === "pending" || image.status === "completed") {
        processImage(image);
      }
    });
  }, [images, processImage]);
  
  const handleResizePresetSelect = useCallback((preset: ResizePreset) => {
    setSelectedResizePreset(preset);
    
    images.forEach((image) => {
      if (image.status === "pending" || image.status === "completed") {
        processImage(image);
      }
    });
  }, [images, processImage]);
  
  const completedCount = images.filter((img) => img.status === "completed").length;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <InstallPrompt />
      
      <main>
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Compress Images Online Free
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Reduce image file sizes by up to 80% without losing quality. Privacy-first, browser-based compression. No uploads required.
              </p>
              
              <div className="flex flex-wrap gap-6 justify-center mb-12">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Instant Processing</p>
                    <p className="text-xs text-muted-foreground">No waiting</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">100% Private</p>
                    <p className="text-xs text-muted-foreground">Never uploaded</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Works Offline</p>
                    <p className="text-xs text-muted-foreground">Browser-based</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <FileUploadZone
                onFilesSelected={handleFilesSelected}
                maxFiles={MAX_FILES}
                currentFileCount={images.length}
              />
            </div>
          </div>
        </section>
        
        {images.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8 p-6 bg-background rounded-lg border space-y-6">
                  <CompressionControls
                    selectedPreset={compressionPreset}
                    onPresetChange={handlePresetChange}
                    disabled={images.length === 0}
                  />
                  
                  <ResizePresetSelector
                    selectedPreset={selectedResizePreset}
                    onPresetSelect={handleResizePresetSelect}
                    disabled={images.length === 0}
                  />
                  
                  {completedCount > 0 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          {completedCount} of {images.length} completed
                        </Badge>
                      </div>
                      <Button
                        onClick={handleDownloadAll}
                        disabled={completedCount === 0}
                        data-testid="button-download-all"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download All as ZIP
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <ImagePreviewCard
                      key={image.id}
                      image={image}
                      onRemove={handleRemoveImage}
                      onDownload={handleDownloadImage}
                      onConvert={handleConvertFormat}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        
        <FAQ />
        
        <section className="py-12 border-t">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="font-display font-semibold mb-2">Image Compression</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Compress JPG online</li>
                    <li>Compress PNG online</li>
                    <li>Compress WebP online</li>
                    <li>Bulk image compressor</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-display font-semibold mb-2">Format Conversion</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>HEIC to JPG converter</li>
                    <li>JPG to WebP converter</li>
                    <li>PNG to JPG converter</li>
                    <li>Convert to AVIF</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-display font-semibold mb-2">Image Resizing</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>Resize for Instagram</li>
                    <li>Resize for Shopify</li>
                    <li>Resize for Etsy</li>
                    <li>Optimize for web</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 text-center text-sm text-muted-foreground">
                <p>© 2024 ImageCompress. All processing happens in your browser. No data collected or stored.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
