import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CompressionPreset } from "@shared/schema";
import { compressionPresetConfigs } from "@shared/schema";
import { Sparkles } from "lucide-react";

interface CompressionControlsProps {
  selectedPreset: CompressionPreset;
  onPresetChange: (preset: CompressionPreset) => void;
  disabled?: boolean;
}

export function CompressionControls({ selectedPreset, onPresetChange, disabled }: CompressionControlsProps) {
  const presets: CompressionPreset[] = ["auto", "200kb", "100kb", "50kb"];
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Smart Compression
        </h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => {
            const config = compressionPresetConfigs[preset];
            const isSelected = selectedPreset === preset;
            
            return (
              <Button
                key={preset}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onPresetChange(preset)}
                disabled={disabled}
                data-testid={`button-preset-${preset}`}
                className="rounded-full"
              >
                {config.label}
              </Button>
            );
          })}
        </div>
      </div>
      
      {selectedPreset === "auto" && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            AI-powered compression automatically selects the best method (lossy/lossless) based on your image type and content for optimal results.
          </p>
        </div>
      )}
    </div>
  );
}
