import { useState } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Download, X, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProcessedImage, ImageFormat } from "@shared/schema";
import { formatFileSize, calculateCompressionRatio } from "@/lib/imageProcessor";
import { imageFormatLabels } from "@shared/schema";

interface ImagePreviewCardProps {
  image: ProcessedImage;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
  onConvert: (id: string, format: ImageFormat) => void;
}

export function ImagePreviewCard({ image, onRemove, onDownload, onConvert }: ImagePreviewCardProps) {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat | "">(""); 
  
  const compressionRatio = image.compressedSize 
    ? calculateCompressionRatio(image.originalSize, image.compressedSize)
    : 0;
  
  const handleFormatChange = (format: string) => {
    setSelectedFormat(format as ImageFormat);
    onConvert(image.id, format as ImageFormat);
  };
  
  return (
    <Card className="overflow-hidden" data-testid={`card-image-${image.id}`}>
      <div className="relative aspect-video bg-muted">
        {image.status === "completed" && image.compressedPreview ? (
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={image.originalPreview}
                alt="Original"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={image.compressedPreview}
                alt="Compressed"
              />
            }
            className="h-full w-full"
          />
        ) : (
          <img
            src={image.originalPreview}
            alt={image.originalFile.name}
            className="h-full w-full object-cover"
          />
        )}
        
        {image.status === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Processing...</p>
            </div>
          </div>
        )}
        
        {image.status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-sm font-medium text-destructive">{image.error || "Error processing"}</p>
            </div>
          </div>
        )}
        
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => onRemove(image.id)}
          data-testid={`button-remove-${image.id}`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <p className="font-medium text-sm truncate mb-1" title={image.originalFile.name}>
            {image.originalFile.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{image.width} × {image.height}</span>
            <span>•</span>
            <span>{imageFormatLabels[image.format]}</span>
          </div>
        </div>
        
        {image.status === "completed" && image.compressedSize && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Original:</span>
              <span className="font-medium">{formatFileSize(image.originalSize)}</span>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Compressed:</span>
              <span className="font-medium text-primary">{formatFileSize(image.compressedSize)}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="default" className="text-xs">
                {compressionRatio}% smaller
              </Badge>
            </div>
          </div>
        )}
        
        {image.status === "processing" && (
          <Progress value={50} className="h-2" />
        )}
        
        <div className="space-y-2">
          <Select value={selectedFormat} onValueChange={handleFormatChange}>
            <SelectTrigger data-testid={`select-format-${image.id}`}>
              <SelectValue placeholder="Convert format..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">Convert to JPEG</SelectItem>
              <SelectItem value="png">Convert to PNG</SelectItem>
              <SelectItem value="webp">Convert to WebP</SelectItem>
              <SelectItem value="avif">Convert to AVIF</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            className="w-full"
            onClick={() => onDownload(image.id)}
            disabled={image.status !== "completed"}
            data-testid={`button-download-${image.id}`}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}
