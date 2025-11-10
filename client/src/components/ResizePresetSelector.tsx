import { Badge } from "@/components/ui/badge";
import { Instagram, ShoppingBag, Globe } from "lucide-react";
import type { ResizePreset } from "@shared/schema";
import { resizePresets } from "@shared/schema";

interface ResizePresetSelectorProps {
  selectedPreset: ResizePreset | null;
  onPresetSelect: (preset: ResizePreset) => void;
  disabled?: boolean;
}

export function ResizePresetSelector({ selectedPreset, onPresetSelect, disabled }: ResizePresetSelectorProps) {
  const platformPresets: { preset: ResizePreset; icon: React.ReactNode }[] = [
    { preset: "instagram-square", icon: <Instagram className="h-3 w-3" /> },
    { preset: "instagram-portrait", icon: <Instagram className="h-3 w-3" /> },
    { preset: "shopify", icon: <ShoppingBag className="h-3 w-3" /> },
    { preset: "etsy", icon: <ShoppingBag className="h-3 w-3" /> },
    { preset: "web-hd", icon: <Globe className="h-3 w-3" /> },
    { preset: "web-thumbnail", icon: <Globe className="h-3 w-3" /> },
  ];
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Resize for Platform</h3>
      <div className="flex flex-wrap gap-2">
        {platformPresets.map(({ preset, icon }) => {
          const config = resizePresets[preset];
          const isSelected = selectedPreset === preset;
          
          return (
            <Badge
              key={preset}
              variant={isSelected ? "default" : "secondary"}
              className="cursor-pointer hover-elevate active-elevate-2 px-3 py-1.5 gap-1.5"
              onClick={() => !disabled && onPresetSelect(preset)}
              data-testid={`badge-resize-${preset}`}
            >
              {icon}
              <span className="text-xs">{config.label.split(" ")[0]}</span>
            </Badge>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Click a preset to automatically resize images for your platform
      </p>
    </div>
  );
}
