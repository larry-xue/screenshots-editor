import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Monitor, Layers, Cuboid as Cube, ArrowRight, Sparkles, Leaf, Image } from "lucide-react";

export const metadata: Metadata = {
  title: "ScreenCanvas - Screenshot Beautifier",
  description: "Transform your screenshots with beautiful layouts and 3D effects",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background bg-cartoon-pattern">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-6 md:px-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center overflow-hidden">
              <Image className="h-5 w-5 text-white" />
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-white rounded-tl-md" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ScreenCanvas</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/editor" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              Editor
            </Link>
            <Link href="/editor-v2" className="text-foreground/70 hover:text-foreground transition-colors font-medium relative">
              Editor V2
              <span className="absolute -top-2 -right-6 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">New</span>
            </Link>
            <Link href="/templates" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              Templates
            </Link>
            <Link href="/gallery" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
              Gallery
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/editor">
              <button className="cartoon-button">Get Started</button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="py-24 md:py-36 space-y-20 w-full max-w-7xl mx-auto">
          <div className="container px-6 md:px-10 flex flex-col items-center text-center space-y-10 mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-foreground font-medium text-sm mb-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>Transform your screenshots with ease</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text">
              Transform your screenshots into <span className="text-transparent">beautiful presentations</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Create stunning visuals with our screenshot beautifier. Arrange multiple images in custom layouts and apply 3D transformations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/editor">
                <button className="cartoon-button">
                  Start Creating <ArrowRight className="h-4 w-4 ml-2 inline" />
                </button>
              </Link>
              <Link href="/editor-v2">
                <Button size="lg" variant="default" className="rounded-cartoon border-2 hover:-translate-y-1 transition-transform bg-secondary">
                  Try Editor V2 <span className="text-xs ml-2 px-1.5 py-0.5 bg-white/20 rounded-full">New</span>
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="rounded-cartoon border-2 hover:-translate-y-1 transition-transform">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="container px-6 md:px-10 mx-auto">
            <div className="relative h-[400px] md:h-[600px] w-full rounded-cartoon-xl overflow-hidden border-4 border-secondary/20 bg-gradient-to-br from-background to-muted shadow-cartoon">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Preview of the editor will appear here
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-muted/30 w-full">
          <div className="container px-6 md:px-10 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flat-card p-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Image className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Beautiful Frames</h3>
                <p className="text-muted-foreground">
                  Add stunning frames, shadows, and backgrounds to make your screenshots stand out.
                </p>
              </div>
              <div className="flat-card p-8">
                <div className="h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                  <Layers className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Custom Layouts</h3>
                <p className="text-muted-foreground">
                  Arrange multiple screenshots in various layouts to create compelling presentations.
                </p>
              </div>
              <div className="flat-card p-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Cube className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">3D Transformations</h3>
                <p className="text-muted-foreground">
                  Apply perspective, rotation, and other 3D effects to give your screenshots depth.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center overflow-hidden">
              <Image className="h-4 w-4 text-white" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-white rounded-tl-md" />
            </div>
            <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ScreenCanvas</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ScreenCanvas. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
