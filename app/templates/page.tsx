import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Monitor, ArrowLeft, Grid2X2, Grid3X3, Layers, Maximize } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      id: "single",
      name: "Single Screenshot",
      description: "Simple display of a single screenshot with customizable frame",
      icon: <Maximize className="h-5 w-5" />,
      preview: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2340&auto=format&fit=crop",
    },
    {
      id: "side-by-side",
      name: "Side by Side",
      description: "Compare two screenshots with a horizontal layout",
      icon: <Grid2X2 className="h-5 w-5" />,
      preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    },
    {
      id: "grid-4",
      name: "Grid (2×2)",
      description: "Display four screenshots in a grid layout",
      icon: <Grid2X2 className="h-5 w-5" />,
      preview: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2340&auto=format&fit=crop",
    },
    {
      id: "grid-6",
      name: "Grid (3×2)",
      description: "Display six screenshots in a grid layout",
      icon: <Grid3X3 className="h-5 w-5" />,
      preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2340&auto=format&fit=crop",
    },
    {
      id: "stacked",
      name: "Stacked",
      description: "Layered screenshots with a 3D perspective effect",
      icon: <Layers className="h-5 w-5" />,
      preview: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2487&auto=format&fit=crop",
    },
    {
      id: "perspective",
      name: "Perspective",
      description: "Screenshots with dramatic 3D perspective transformation",
      icon: <Layers className="h-5 w-5" />,
      preview: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2344&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-2 font-bold">
              <Monitor className="h-5 w-5" />
              <span>ScreenCanvas Templates</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Templates</h1>
          <p className="text-muted-foreground mb-8">
            Choose a template to get started quickly. You can customize it further in the editor.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary/10 p-1.5 rounded-full">
                      {template.icon}
                    </div>
                    <h3 className="font-semibold">{template.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <Link href={`/editor?template=${template.id}`}>
                    <Button className="w-full">Use Template</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <span className="font-semibold">ScreenCanvas</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ScreenCanvas. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}