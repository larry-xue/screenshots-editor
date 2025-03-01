import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Monitor, ArrowLeft, Download, Heart } from "lucide-react";

export default function GalleryPage() {
  const galleryItems = [
    {
      id: "1",
      title: "Dashboard UI",
      author: "Sarah Johnson",
      likes: 243,
      image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2487&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Mobile App Screens",
      author: "Michael Chen",
      likes: 187,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2340&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "E-commerce Website",
      author: "Alex Rodriguez",
      likes: 156,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    },
    {
      id: "4",
      title: "Code Editor Theme",
      author: "Jamie Taylor",
      likes: 312,
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2340&auto=format&fit=crop",
    },
    {
      id: "5",
      title: "Landing Page Design",
      author: "Priya Patel",
      likes: 278,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2344&auto=format&fit=crop",
    },
    {
      id: "6",
      title: "Analytics Dashboard",
      author: "David Wilson",
      likes: 195,
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2340&auto=format&fit=crop",
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
              <span>ScreenCanvas Gallery</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Community Gallery</h1>
          <p className="text-muted-foreground mb-8">
            Explore beautiful screenshot presentations created by our community. Get inspired and create your own!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div key={item.id} className="group border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">by {item.author}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm">
                        Use Design
                      </Button>
                    </div>
                  </div>
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