"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Monitor, 
  ArrowLeft, 
  Download, 
  Share, 
  Layers, 
  Palette, 
  Settings, 
  Plus
} from "lucide-react";
import { toast } from "sonner";

// 导入自定义组件
import ImageList from "@/components/editor/ImageList";
import LayoutControls from "@/components/editor/LayoutControls";
import ZoomControls from "@/components/editor/ZoomControls";
import EditorCanvas from "@/components/editor/EditorCanvas";
import StyleControls from "@/components/editor/StyleControls";
import TransformControls from "@/components/editor/TransformControls";
import SettingsControls from "@/components/editor/SettingsControls";

// 导入自定义钩子和工具函数
import { useZoom, useDraggableImages } from "@/components/editor/hooks";
import { handleDownload, handleShare } from "@/components/editor/export";

export default function EditorPage() {
  // 图片状态
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // 布局状态
  const [layout, setLayout] = useState<string>("single");
  const [background, setBackground] = useState<string>("#f5f5f5");
  const [padding, setPadding] = useState(40);
  const [gap, setGap] = useState(20);
  
  // 3D变换状态
  const [transform3d, setTransform3d] = useState({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 1000,
  });
  
  // 阴影状态
  const [shadow, setShadow] = useState({
    enabled: true,
    x: 0,
    y: 15,
    blur: 25,
    spread: 0,
    color: "rgba(0, 0, 0, 0.1)",
  });
  
  // 边框状态
  const [border, setBorder] = useState({
    enabled: true,
    width: 1,
    radius: 8,
    color: "#e2e8f0",
  });
  
  // 导出设置
  const [exportFormat, setExportFormat] = useState("png");
  const [exportQuality, setExportQuality] = useState(90);
  const [exportScale, setExportScale] = useState("1");
  
  // 引用和自定义钩子
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { zoom, handleZoom, setSpecificZoom } = useZoom();
  const { 
    imagePositions, 
    isDragging, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    resetImagePosition,
    updateImagePosition,
    updateImageScale,
    initializePositions
  } = useDraggableImages(selectedImageIndex);
  
  // 处理文件变化
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
            setImages(prev => [...prev, ...newImages]);
            initializePositions(images.length + newImages.length);
            toast.success(`Added ${newImages.length} image${newImages.length > 1 ? 's' : ''}`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  // 处理添加图片
  const handleAddImages = () => {
    fileInputRef.current?.click();
  };
  
  // 处理移除图片
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex !== null && selectedImageIndex > index) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
    toast.success("Image removed");
  };
  
  // 处理下载
  const handleDownloadImage = async () => {
    await handleDownload(canvasRef, {
      format: exportFormat,
      quality: exportQuality,
      scale: exportScale
    });
  };
  
  // 处理分享
  const handleShareImage = async () => {
    await handleShare();
  };
  
  // 处理重置缩放
  const handleResetZoom = (value: number) => {
    setSpecificZoom(value);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:inline-block">Back</span>
            </Link>
            <div className="flex items-center gap-2 font-bold">
              <Monitor className="h-5 w-5" />
              <span>ScreenCanvas Editor</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="gap-2" onClick={handleShareImage}>
              <Share className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:inline-block">Share</span>
            </Button>
            <Button size="sm" className="gap-2" onClick={handleDownloadImage}>
              <Download className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:inline-block">Download</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
        <div className="w-[250px] border-r bg-muted/30 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* 图片列表 */}
            <ImageList 
              images={images}
              selectedImageIndex={selectedImageIndex}
              onSelectImage={setSelectedImageIndex}
              onAddImages={handleAddImages}
              onRemoveImage={handleRemoveImage}
            />
            
            {/* 布局控制 */}
            <LayoutControls 
              layout={layout}
              padding={padding}
              gap={gap}
              onLayoutChange={setLayout}
              onPaddingChange={setPadding}
              onGapChange={setGap}
            />
          </div>
        </div>
        
        {/* 主内容区域 */}
        <div className="flex-1 overflow-auto relative">
          {/* 缩放控制 */}
          <ZoomControls 
            zoom={zoom}
            onZoom={handleZoom}
            onResetZoom={handleResetZoom}
          />
          
          <div 
            className="flex items-center justify-center min-h-full p-4 editor-container"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              height: "calc(100vh - 64px)", // 减去头部高度
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* 编辑器画布 */}
            <EditorCanvas 
              ref={canvasRef}
              images={images}
              selectedImageIndex={selectedImageIndex}
              layout={layout}
              background={background}
              padding={padding}
              gap={gap}
              zoom={zoom}
              imagePositions={imagePositions}
              transform3d={transform3d}
              border={border}
              shadow={shadow}
              isDragging={isDragging}
              onSelectImage={setSelectedImageIndex}
              onMouseDown={handleMouseDown}
              onAddImages={handleAddImages}
            />
          </div>
        </div>
        
        {/* 右侧边栏 */}
        <div className="w-[300px] border-l bg-muted/30 overflow-y-auto">
          <Tabs defaultValue="style">
            <TabsList className="w-full">
              <TabsTrigger value="style" className="flex-1">
                <Palette className="h-4 w-4 mr-2" />
                Style
              </TabsTrigger>
              <TabsTrigger value="transform" className="flex-1">
                <Layers className="h-4 w-4 mr-2" />
                Transform
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            {/* 样式控制 */}
            <TabsContent value="style">
              <StyleControls 
                selectedImageIndex={selectedImageIndex}
                background={background}
                border={border}
                shadow={shadow}
                onBackgroundChange={setBackground}
                onBorderChange={setBorder}
                onShadowChange={setShadow}
              />
            </TabsContent>
            
            {/* 变换控制 */}
            <TabsContent value="transform">
              <TransformControls 
                selectedImageIndex={selectedImageIndex}
                transform3d={transform3d}
                imagePositions={imagePositions}
                onTransform3dChange={setTransform3d}
                onPositionChange={updateImagePosition}
                onResetPosition={resetImagePosition}
                onScaleChange={updateImageScale}
              />
            </TabsContent>
            
            {/* 设置控制 */}
            <TabsContent value="settings">
              <SettingsControls 
                exportFormat={exportFormat}
                exportQuality={exportQuality}
                exportScale={exportScale}
                onExportFormatChange={setExportFormat}
                onExportQualityChange={setExportQuality}
                onExportScaleChange={setExportScale}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* 隐藏的文件输入 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </div>
  );
}
