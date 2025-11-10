import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { FAQ } from "@/components/FAQ";
import { Zap, Shield, Globe, LogIn } from "lucide-react";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Compress Images Online Free
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Reduce image file sizes by up to 80% without losing quality. Privacy-first, browser-based compression. No uploads required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="rounded-full text-lg" onClick={handleLogin} data-testid="button-login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In to Start
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-lg" asChild>
                  <a href="#features">Learn More</a>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Instant Processing</p>
                    <p className="text-xs text-muted-foreground">No waiting</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">100% Private</p>
                    <p className="text-xs text-muted-foreground">Never uploaded</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Works Offline</p>
                    <p className="text-xs text-muted-foreground">Browser-based</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
              Features for Everyone
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="p-6 bg-background rounded-lg border">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Smart Compression</h3>
                <p className="text-muted-foreground">
                  AI-powered compression automatically selects the best method for each image type
                </p>
              </div>
              
              <div className="p-6 bg-background rounded-lg border">
                <h3 className="font-display font-semibold text-xl mb-2">Multiple Formats</h3>
                <p className="text-muted-foreground mb-3">
                  Convert between JPG, PNG, WebP, HEIC, AVIF and more
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">JPG</Badge>
                  <Badge variant="secondary">PNG</Badge>
                  <Badge variant="secondary">WebP</Badge>
                  <Badge variant="secondary">HEIC</Badge>
                  <Badge variant="secondary">AVIF</Badge>
                </div>
              </div>
              
              <div className="p-6 bg-background rounded-lg border">
                <h3 className="font-display font-semibold text-xl mb-2">Platform Presets</h3>
                <p className="text-muted-foreground">
                  Resize images perfectly for Instagram, Shopify, Etsy, and more
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Compress?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Sign in to access compression history and saved presets
            </p>
            <Button size="lg" className="rounded-full" onClick={handleLogin} data-testid="button-login-cta">
              <LogIn className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </div>
        </section>
        
        <FAQ />
      </main>
    </div>
  );
}
