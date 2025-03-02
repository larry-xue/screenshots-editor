import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import Canvas from './Canvas';
import CanvasControls from './CanvasControls';
import BoxControls from './BoxControls';
import { BoxData, CanvasSettings } from './types';

const DEFAULT_BOX_STYLE = {
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#e2e8f0',
  borderRadius: 8,
  opacity: 1,
  shadow: true,
  shadowColor: 'rgba(0,0,0,0.1)',
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

interface EditorV2Props {}

const EditorV2: React.FC<EditorV2Props> = () => {
  // Canvas state
  const [canvasSettings, setCanvasSettings] = useState<CanvasSettings>(DEFAULT_CANVAS_SETTINGS);
  
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
    const newBox: BoxData = {
      id: uuidv4(),
      x: canvasSettings.width / 2 - 100,
      y: canvasSettings.height / 2 - 50,
      width: 200,
      height: 100,
      type: 'text',
      content: 'Text Box Content',
      style: { ...DEFAULT_BOX_STYLE }
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
    reader.onload = (event) => {
      if (event.target?.result) {
        const newBox: BoxData = {
          id: uuidv4(),
          x: canvasSettings.width / 2 - 150,
          y: canvasSettings.height / 2 - 100,
          width: 300,
          height: 200,
          type: 'image',
          content: event.target.result as string,
          style: { ...DEFAULT_BOX_STYLE },
          imageSettings: {
            fit: 'cover'
          }
        };
        
        setBoxes([...boxes, newBox]);
        setSelectedBoxId(newBox.id);
        toast.success('Image added');
      }
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
    setBoxes(boxes.map(box => 
      box.id === id ? { ...box, style: { ...box.style, ...style } } : box
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
      // Use html2canvas or similar library to capture the canvas
      // For now just show a message
      toast.success('Export functionality would go here');
    } catch (error) {
      toast.error('Failed to export canvas');
    }
  };

  return (
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
          onContentChange={handleBoxContentChange}
          onImageSettingsChange={handleImageSettingsChange}
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
  );
};

export default EditorV2; 
