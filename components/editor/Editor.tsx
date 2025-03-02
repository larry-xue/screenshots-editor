import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import Canvas from './Canvas';
import CanvasControls from './CanvasControls';
import BoxControls from './BoxControls';
import Loading from '@/components/ui/Loading';
import { BoxData, CanvasSettings } from './types';

const DEFAULT_BOX_STYLE = {
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#e2e8f0',
  borderRadius: 8,
  opacity: 1,
  shadow: false,
  shadowColor: 'rgba(0,0,0,0.1)',
  hasBorder: false,
  hasBackground: false,
  textColor: '#000000',
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
      content: 'Text Box Content',
      style: { ...DEFAULT_BOX_STYLE },
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
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, [property]: value } : box
    ));
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
  const handleCanvasSettingChange = (settings: Partial<CanvasSettings>) => {
    setCanvasSettings({ ...canvasSettings, ...settings });
  };

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
            await new Promise(resolve => setTimeout(resolve, 100));
            
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
          loading: "Generating image...",
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

  return (
    <>
      <div className="flex h-full overflow-hidden">
        {/* Left sidebar for canvas controls */}
        <div className="w-[300px] border-r bg-muted/30 overflow-y-auto">
          <CanvasControls
            settings={canvasSettings}
            onSettingsChange={handleCanvasSettingChange}
            onExport={handleExportCanvas}
          />
        </div>

        {/* Main canvas area */}
        <div className="flex-1 overflow-auto relative bg-gray-100">
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

        {/* Right sidebar for box controls */}
        <div className="w-[300px] border-l bg-muted/30 overflow-y-auto">
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

          {/* Hidden file input for image upload */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Loading overlay */}
      {isExporting && (
        <Loading message="Exporting image..." />
      )}
    </>
  );
};

export default EditorV2; 
