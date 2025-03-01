import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageListProps {
  images: string[];
  selectedImageIndex: number | null;
  onSelectImage: (index: number) => void;
  onAddImages: () => void;
  onRemoveImage: (index: number) => void;
}

const ImageList: React.FC<ImageListProps> = ({
  images,
  selectedImageIndex,
  onSelectImage,
  onAddImages,
  onRemoveImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages: string[] = [];
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          if (newImages.length === files.length) {
            onAddImages();
            toast.success(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <h3 className="font-medium mb-3">Images</h3>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={handleAddImages}
        >
          <Plus className="h-4 w-4" />
          Add Images
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        
        <div className="space-y-2 mt-3">
          {images.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No images added yet
            </div>
          ) : (
            images.map((image, index) => (
              <div 
                key={index}
                className={cn(
                  "relative group rounded-md overflow-hidden border cursor-pointer",
                  selectedImageIndex === index && "ring-2 ring-primary"
                )}
                onClick={() => onSelectImage(index)}
              >
                <img 
                  src={image} 
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-16 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(index);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageList; 
