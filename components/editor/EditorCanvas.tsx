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
        width: "100%", // 始终填满可用空间
        height: "100%", // 始终填满可用空间
        margin: "auto",
      }}
    >
      <div 
        className="canvas-content-wrapper"
        style={{
          minWidth: "100%", // 始终填满容器宽度
          minHeight: "100%", // 始终填满容器高度
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0", // 移除内边距
          height: "100%", // 确保高度填满容器
          width: "100%", // 确保宽度填满容器
          position: "relative", // 添加相对定位
          overflow: "hidden", // 防止内容溢出
        }}
      >
        <div 
          ref={ref}
          className="relative will-change-transform"
          style={{
            backgroundColor: background,
            padding: `${padding}px`,
            borderRadius: "12px",
            transformOrigin: 'center center',
            transition: 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)',
            willChange: 'transform',
            boxShadow: showScrollbars ? "0 0 20px rgba(0,0,0,0.1)" : "none",
            margin: "auto", // 确保居中
            position: "absolute", // 使用绝对定位
            left: "50%", // 水平居中
            top: "50%", // 垂直居中
            transform: `translate(-50%, -50%) scale(${zoom})`, // 居中并缩放
            width: "calc(100% - 40px)", // 宽度铺满，留出20px的边距
            height: "calc(100% - 40px)", // 高度铺满，留出20px的边距
            maxWidth: "100%",
            maxHeight: "100%",
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
              <div className="flex items-center justify-center border border-dashed rounded-lg p-8 min-h-[200px] min-w-[300px] text-muted-foreground">
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
                <img 
                  key={index}
                  src={image} 
                  alt={`Screenshot ${index + 1}`}
                  className={cn(
                    "w-full h-full object-cover will-change-transform",
                    selectedImageIndex === index && "ring-2 ring-primary cursor-move"
                  )}
                  style={{
                    ...getTransformStyle(selectedImageIndex, index, imagePositions, transform3d, isDragging),
                    ...(selectedImageIndex === index ? getBorderStyle(border) : {}),
                    ...(selectedImageIndex === index ? getShadowStyle(shadow) : {})
                  }}
                  onClick={() => onSelectImage(index)}
                  onMouseDown={(e) => onMouseDown(e, index)}
                  draggable={false}
                />
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
