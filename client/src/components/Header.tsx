import { Moon, Sun, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <ImageIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold leading-none">ImageCompress</h1>
              <p className="text-xs text-muted-foreground">Free & Privacy-First</p>
            </div>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
