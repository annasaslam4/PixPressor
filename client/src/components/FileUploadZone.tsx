import { useCallback, useState } from "react";
import { Upload, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles: number;
  currentFileCount: number;
}

export function FileUploadZone({ onFilesSelected, maxFiles, currentFileCount }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);
  
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith("image/")
    );
    
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  }, [onFilesSelected]);
  
  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-all duration-200",
        isDragging 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border hover-elevate"
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      data-testid="dropzone-upload"
    >
      <div className="flex flex-col items-center justify-center px-6 py-12 md:px-12 md:py-16">
        <div className={cn(
          "mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-200",
          isDragging ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground"
        )}>
          {isDragging ? (
            <FileImage className="h-10 w-10" />
          ) : (
            <Upload className="h-10 w-10" />
          )}
        </div>
        
        <h2 className="mb-2 text-center text-2xl md:text-3xl font-display font-bold">
          {isDragging ? "Drop your images here" : "Compress & Convert Images"}
        </h2>
        
        <p className="mb-6 text-center text-sm md:text-base text-muted-foreground max-w-md">
          Drag and drop up to {maxFiles} images, or click to browse. All processing happens in your browser for complete privacy.
        </p>
        
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <Badge variant="secondary" data-testid="badge-format-jpg">JPG</Badge>
          <Badge variant="secondary" data-testid="badge-format-png">PNG</Badge>
          <Badge variant="secondary" data-testid="badge-format-webp">WebP</Badge>
          <Badge variant="secondary" data-testid="badge-format-heic">HEIC</Badge>
          <Badge variant="secondary" data-testid="badge-format-avif">AVIF</Badge>
          <Badge variant="secondary" data-testid="badge-format-bmp">BMP</Badge>
          <Badge variant="secondary" data-testid="badge-format-svg">SVG</Badge>
          <Badge variant="secondary" data-testid="badge-format-tiff">TIFF</Badge>
        </div>
        
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload-input"
          data-testid="input-file-upload"
        />
        
        <label htmlFor="file-upload-input">
          <Button size="lg" className="rounded-full" asChild data-testid="button-choose-files">
            <span>
              <Upload className="mr-2 h-5 w-5" />
              Choose Files
            </span>
          </Button>
        </label>
        
        {currentFileCount > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            {currentFileCount} of {maxFiles} files selected
          </p>
        )}
      </div>
    </div>
  );
}
