import React, { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { ChevronLeft, ChevronRight, Download, Palette } from 'lucide-react';
import Canvas from './Canvas';
import CanvasControls from './CanvasControls';
import BoxControls from './BoxControls';
import { BoxData, CanvasSettings, ShellType } from './types';
import { Button } from '@/components/ui/button';
import backgroundPresets from './background-presets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DEFAULT_BOX_STYLE = {
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#e2e8f0',
  borderRadius: 8,
  opacity: 1,
  shadow: false,
  shadowColor: 'rgba(0,0,0,0.1)',
  hasBorder: false,
  hasBackground: false,
  textColor: '#000000',
  fontSize: '24px',
  fontWeight: 'normal',
  fontFamily: 'sans-serif',
  color: '#000000',
  textAlign: 'left',
  padding: '12px'
};

// Configuración por defecto para el shell
const DEFAULT_SHELL_SETTINGS = {
  type: 'none' as ShellType,
  title: 'Untitled',
  showControls: true,
  color: '#f0f0f0'
};

const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  width: 2560,
  height: 1440,
  background: '#f5f5f5',
  exportScale: 1,
  exportFormat: 'png',
  exportQuality: 90,
  displayScale: 0.3, // Scale for display in the editor
};

interface EditorV2Props { }

const EditorV2: React.FC<EditorV2Props> = () => {
  // Canvas state
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>(DEFAULT_CANVAS_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);

  // Boxes state
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get selected box
  const selectedBox = selectedBoxId
    ? boxes.find(box => box.id === selectedBoxId) || null
    : null;

  // Handle adding a new text box
  const handleAddTextBox = () => {
    // 获取当前最大的 zIndex
    const maxZIndex = boxes.reduce((max, box) => Math.max(max, box.zIndex || 0), 0);

    const newBox: BoxData = {
      id: uuidv4(),
      x: canvasSettings.width / 2 - 100,
      y: canvasSettings.height / 2 - 50,
      width: 200,
      height: 100,
      type: 'text',
      content: 'Edit this text',
      style: { ...DEFAULT_BOX_STYLE },
      shellSettings: { ...DEFAULT_SHELL_SETTINGS },
      zIndex: maxZIndex + 1
    };

    setBoxes([...boxes, newBox]);
    setSelectedBoxId(newBox.id);
    toast.success('Text box added');
  };

  // Handle adding an image box
  const handleAddImageBox = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection for images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      // 确保读取结果是字符串
      const imageDataUrl = reader.result as string;
      if (!imageDataUrl) {
        toast.error('Failed to load image');
        return;
      }

      // 创建临时图片获取尺寸
      const img = new Image();
      img.onload = () => {
        // 计算合适的框大小
        const maxWidth = canvasSettings.width * 0.7;
        const maxHeight = canvasSettings.height * 0.7;

        // 保持宽高比
        let boxWidth = img.width;
        let boxHeight = img.height;

        // 缩放大图片
        if (boxWidth > maxWidth) {
          const ratio = maxWidth / boxWidth;
          boxWidth = maxWidth;
          boxHeight = boxHeight * ratio;
        }

        if (boxHeight > maxHeight) {
          const ratio = maxHeight / boxHeight;
          boxHeight = maxHeight;
          boxWidth = boxWidth * ratio;
        }

        // 获取当前最大的 zIndex
        const maxZIndex = boxes.reduce((max, box) => Math.max(max, box.zIndex || 0), 0);

        // 创建新的图片框，始终使用cover模式
        const newBox: BoxData = {
          id: uuidv4(),
          x: (canvasSettings.width - boxWidth) / 2,
          y: (canvasSettings.height - boxHeight) / 2,
          width: boxWidth,
          height: boxHeight,
          type: 'image',
          content: imageDataUrl,
          style: { ...DEFAULT_BOX_STYLE },
          imageSettings: {
            fit: 'cover',
            width: img.width,
            height: img.height
          },
          shellSettings: { ...DEFAULT_SHELL_SETTINGS },
          zIndex: maxZIndex + 1
        };

        setBoxes([...boxes, newBox]);
        setSelectedBoxId(newBox.id);
        toast.success('Image added');
      };

      img.onerror = () => {
        toast.error('Failed to process image');
      };

      img.src = imageDataUrl;
    };

    reader.onerror = () => {
      toast.error('Failed to read image file');
    };

    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = '';
  };

  // Handle deleting a box
  const handleDeleteBox = (id: string) => {
    setBoxes(boxes.filter(box => box.id !== id));
    if (selectedBoxId === id) {
      setSelectedBoxId(null);
    }
    toast.success('Box deleted');
  };

  // Handle moving a box
  const handleBoxMove = (id: string, x: number, y: number) => {
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, x, y } : box
    ));
  };

  // Handle resizing a box
  const handleBoxResize = (id: string, width: number, height: number) => {
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, width, height } : box
    ));
  };

  // Handle updating box style
  const handleBoxStyleChange = (id: string, style: any) => {
    console.log(id, style, boxes, boxes.map(box =>
      box.id === id ? { ...box, style: { ...box.style, ...style } } : box
    ));
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, style: { ...box.style, ...style } } : box
    ));
  };

  // Handle updating box property
  const handleBoxPropertyChange = (id: string, property: string, value: any) => {
    setBoxes(boxes.map(box => {
      if (box.id === id) {
        // Para shellSettings, asegúrate de que se fusione correctamente con valores existentes
        if (property === 'shellSettings') {
          return { 
            ...box, 
            [property]: { 
              ...(box.shellSettings || DEFAULT_SHELL_SETTINGS),
              ...value 
            } 
          };
        }
        // Para otras propiedades, simplemente actualizar el valor
        return { ...box, [property]: value };
      }
      return box;
    }));
  };

  // Handle updating box content
  const handleBoxContentChange = (id: string, content: string) => {
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, content } : box
    ));
  };

  // Handle updating image settings
  const handleImageSettingsChange = (id: string, imageSettings: any) => {
    setBoxes(boxes.map(box =>
      box.id === id ? {
        ...box,
        imageSettings: { ...box.imageSettings, ...imageSettings }
      } : box
    ));
  };

  // Handle canvas setting changes
  const handleCanvasSettingChange = useCallback((settings: Partial<CanvasSettings>) => {
    setCanvasSettings(prevSettings => ({ ...prevSettings, ...settings }));
  }, []);

  // Handle export canvas as image
  const handleExportCanvas = async () => {
    if (!canvasRef.current) return;
    
    try {
      return toast.promise(
        (async () => {
          setIsExporting(true);
          
          // 保存当前的显示比例
          const originalDisplayScale = canvasSettings.displayScale;
          
          try {
            // 临时将显示比例设置为1，以便导出原始尺寸
            setCanvasSettings(prev => ({
              ...prev,
              displayScale: 1
            }));
            
            // 等待DOM更新
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 创建html2canvas配置
            const scale = canvasSettings.exportScale;
            const config = {
              scale: scale, // 导出缩放比例
              useCORS: true, // 允许跨域图片
              allowTaint: true, // 允许跨域图片
              backgroundColor: null, // 保持透明背景
              logging: false, // 禁用日志
              width: canvasSettings.width,
              height: canvasSettings.height,
            };

            // 使用html2canvas捕获画布
            const canvas = await html2canvas(canvasRef.current!, config);

            // 转换为blob
            const blob = await new Promise<Blob>((resolve) => {
              if (canvasSettings.exportFormat === 'jpeg') {
                // 对于JPEG格式，使用白色背景
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  for (let i = 0; i < imageData.data.length; i += 4) {
                    const alpha = imageData.data[i + 3];
                    if (alpha < 255) {
                      imageData.data[i] = 255;
                      imageData.data[i + 1] = 255;
                      imageData.data[i + 2] = 255;
                      imageData.data[i + 3] = 255;
                    }
                  }
                  ctx.putImageData(imageData, 0, 0);
                }
              }
              
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve(blob);
                  } else {
                    throw new Error('Failed to create blob');
                  }
                },
                `image/${canvasSettings.exportFormat}`,
                canvasSettings.exportQuality / 100
              );
            });

            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `screenshot.${canvasSettings.exportFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return "Image downloaded successfully";
          } finally {
            // 恢复原来的显示比例
            setCanvasSettings(prev => ({
              ...prev,
              displayScale: originalDisplayScale
            }));
          }
        })(),
        {
          success: (data) => {
            setIsExporting(false);
            return data;
          },
          error: (error) => {
            setIsExporting(false);
            return "Failed to download image";
          },
        }
      );
    } catch (error) {
      setIsExporting(false);
      console.error("Error downloading image:", error);
      throw error;
    }
  };

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  // Reference to the canvas container for wheel events
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Handle wheel zoom with non-passive event listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only respond to ctrl+wheel events
      if (e.ctrlKey) {
        e.preventDefault(); // Prevent browser zoom
        
        // Determine zoom direction
        const zoomDirection = e.deltaY < 0 ? 1 : -1;
        
        // Calculate new display scale
        const step = 0.05;
        const newScale = Math.min(
          Math.max(canvasSettings.displayScale + zoomDirection * step, 0.1), // Min scale: 10%
          1.5 // Max scale: 150%
        );
        
        // Update canvas settings with new scale
        handleCanvasSettingChange({ displayScale: newScale });
      }
    };

    const canvasContainer = canvasContainerRef.current;
    if (canvasContainer) {
      // Add non-passive wheel event listener
      canvasContainer.addEventListener('wheel', handleWheel, { passive: false });
      
      // Cleanup
      return () => {
        canvasContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [canvasSettings.displayScale, handleCanvasSettingChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 h-14 border-b bg-background">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${!leftPanelOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* 背景预设下拉菜单 */}
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>背景预设</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuLabel>选择画布背景</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {backgroundPresets.map((preset, index) => (
                <DropdownMenuItem 
                  key={index} 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleCanvasSettingChange({ background: preset.value })}
                >
                  <div 
                    className="w-5 h-5 rounded-sm" 
                    style={{ background: preset.value }}
                  />
                  <span>{preset.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${!rightPanelOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div 
          className={`border-r bg-muted/30 overflow-hidden transition-all duration-300 ${
            leftPanelOpen ? 'w-[300px]' : 'w-0'
          }`}
        >
          <div className="w-[300px] h-full overflow-y-auto">
            <CanvasControls
              settings={canvasSettings}
              onSettingsChange={handleCanvasSettingChange}
              onExport={handleExportCanvas}
            />
          </div>
        </div>

        {/* Main Canvas Area */}
        <div 
          ref={canvasContainerRef}
          className="flex-1 overflow-auto relative bg-gray-100"
        >
          <Canvas
            ref={canvasRef}
            width={canvasSettings.width}
            height={canvasSettings.height}
            background={canvasSettings.background}
            boxes={boxes}
            selectedBoxId={selectedBoxId}
            onBoxSelect={setSelectedBoxId}
            onBoxMove={handleBoxMove}
            onBoxResize={handleBoxResize}
            onAddBox={handleAddTextBox}
            displayScale={canvasSettings.displayScale}
            isExporting={isExporting}
          />
        </div>

        {/* Right Panel */}
        <div 
          className={`border-l bg-muted/30 overflow-hidden transition-all duration-300 ${
            rightPanelOpen ? 'w-[300px]' : 'w-0'
          }`}
        >
          <div className="w-[300px] h-full overflow-y-auto">
            <BoxControls
              selectedBox={selectedBox}
              onAddTextBox={handleAddTextBox}
              onAddImageBox={handleAddImageBox}
              onDeleteBox={handleDeleteBox}
              onStyleChange={handleBoxStyleChange}
              onPropertyChange={handleBoxPropertyChange}
              onContentChange={handleBoxContentChange}
              onImageSettingsChange={handleImageSettingsChange}
              boxes={boxes}
            />
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default EditorV2; 
