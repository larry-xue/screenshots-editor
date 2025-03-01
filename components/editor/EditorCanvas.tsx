import React, { forwardRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLayoutClass, getTransformStyle, getBorderStyle, getShadowStyle } from './utils';

interface EditorCanvasProps {
  images: string[];
  selectedImageIndex: number | null;
  layout: string;
  background: string;
  padding: number;
  gap: number;
  zoom: number;
  imagePositions: {x: number, y: number}[];
  transform3d: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number;
  };
  border: {
    enabled: boolean;
    width: number;
    radius: number;
    color: string;
  };
  shadow: {
    enabled: boolean;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
  };
  isDragging: boolean;
  onSelectImage: (index: number) => void;
  onMouseDown: (e: React.MouseEvent, index: number) => void;
  onAddImages: () => void;
}

const EditorCanvas = forwardRef<HTMLDivElement, EditorCanvasProps>(({
  images,
  selectedImageIndex,
  layout,
  background,
  padding,
  gap,
  zoom,
  imagePositions,
  transform3d,
  border,
  shadow,
  isDragging,
  onSelectImage,
  onMouseDown,
  onAddImages
}, ref) => {
  // 计算是否需要显示滚动条
  const [showScrollbars, setShowScrollbars] = useState(false);
  
  // 监听缩放变化，决定是否显示滚动条
  useEffect(() => {
    setShowScrollbars(zoom > 1.2);
  }, [zoom]);
  
  return (
    <div 
      className={cn(
        "canvas-scroll-container",
        showScrollbars ? "overflow-auto" : "overflow-hidden",
        "relative rounded-lg border border-muted-foreground/20"
      )}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        width: showScrollbars ? "calc(100% - 20px)" : "100%", // 留出滚动条空间
        height: showScrollbars ? "calc(100% - 20px)" : "100%", // 留出滚动条空间
        margin: "auto",
      }}
    >
      <div 
        className="canvas-content-wrapper"
        style={{
          minWidth: showScrollbars ? `${Math.max(100, zoom * 100)}%` : "100%",
          minHeight: showScrollbars ? `${Math.max(100, zoom * 100)}%` : "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: showScrollbars ? "40px" : "0",
        }}
      >
        <div 
          ref={ref}
          className="relative will-change-transform"
          style={{
            backgroundColor: background,
            padding: `${padding}px`,
            borderRadius: "12px",
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)',
            willChange: 'transform',
            boxShadow: showScrollbars ? "0 0 20px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <div 
            className={cn(
              "grid",
              getLayoutClass(layout),
              "h-full w-full"
            )}
            style={{ gap: `${gap}px` }}
          >
            {images.length === 0 ? (
              <div className="flex items-center justify-center border border-dashed rounded-lg p-8 min-h-[300px] min-w-[500px] text-muted-foreground">
                <div className="text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2" />
                  <p>Add screenshots to get started</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={onAddImages}
                  >
                    Upload Images
                  </Button>
                </div>
              </div>
            ) : (
              images.map((image, index) => (
                <div 
                  key={index}
                  className={cn(
                    "relative overflow-hidden will-change-transform",
                    selectedImageIndex === index && "ring-2 ring-primary",
                    selectedImageIndex === index && "cursor-move"
                  )}
                  style={selectedImageIndex === index ? {
                    ...getBorderStyle(border),
                    ...getShadowStyle(shadow),
                  } : {}}
                  onClick={() => onSelectImage(index)}
                  onMouseDown={(e) => onMouseDown(e, index)}
                >
                  <img 
                    src={image} 
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-contain will-change-transform"
                    style={getTransformStyle(selectedImageIndex, index, imagePositions, transform3d, isDragging)}
                    draggable={false}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas; 
