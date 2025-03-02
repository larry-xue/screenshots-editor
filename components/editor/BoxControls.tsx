import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { BoxData, ShellType } from './types';
import { Image, Type, Trash2, Plus, MaximizeIcon, MinimizeIcon, Move, MonitorSmartphone, Palette } from 'lucide-react';
import ColorPicker from "@/components/ui/color-picker";

// Define text style presets for 2560x1440 canvas
const textStylePresets = [
  {
    id: 'default',
    name: 'Default',
    style: {
      fontSize: '72px',
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      color: '#000000',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: false,
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: 4,
      shadow: false,
      shadowColor: 'rgba(0,0,0,0.1)',
      textAlign: 'left',
      padding: '12px'
    }
  },
  {
    id: 'minimal',
    name: '✧ Minimal Title',
    style: {
      fontSize: '80px',
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      color: '#111111',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: false,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 0,
      shadow: false,
      shadowColor: 'rgba(0,0,0,0)',
      textAlign: 'left',
      padding: '12px'
    }
  },
  {
    id: 'hero',
    name: '✦ Hero Headline',
    style: {
      fontSize: '92px',
      fontWeight: 'bold',
      fontFamily: 'Montserrat, sans-serif',
      color: '#ffffff',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: false,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 0,
      shadow: true,
      shadowColor: 'rgba(0,0,0,0.5)',
      textAlign: 'center',
      padding: '32px'
    }
  },
  {
    id: 'gradient',
    name: '✦ Gradient Text',
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      fontFamily: 'Poppins, sans-serif',
      color: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: false,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 0,
      shadow: true,
      shadowColor: 'rgba(0,0,0,0.2)',
      textAlign: 'center',
      padding: '20px'
    }
  },
  {
    id: 'modern-caption',
    name: '✧ Modern Caption',
    style: {
      fontSize: '72px',
      fontWeight: 'normal',
      fontFamily: 'Roboto Mono, monospace',
      color: '#333333',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 0.95,
      hasBorder: true,
      borderWidth: 1,
      borderColor: '#e1e1e1',
      borderRadius: 4,
      shadow: true,
      shadowColor: 'rgba(0,0,0,0.06)',
      textAlign: 'left',
      padding: '16px 20px'
    }
  },
  {
    id: 'accent-block',
    name: '✦ Accent Block',
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: false,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 0,
      shadow: true,
      shadowColor: 'rgba(255,71,87,0.4)',
      textAlign: 'left',
      padding: '24px 28px'
    }
  },
  {
    id: 'elegant',
    name: '✧ Elegant Text',
    style: {
      fontSize: '72px',
      fontWeight: 'normal',
      fontFamily: 'Playfair Display, serif',
      color: '#1e272e',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: false,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 0,
      shadow: false,
      shadowColor: 'rgba(0,0,0,0.1)',
      textAlign: 'center',
      padding: '16px'
    }
  },
  {
    id: 'highlight-box',
    name: '✦ Highlight Box',
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      fontFamily: 'system-ui, sans-serif',
      color: '#ffffff',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 0.98,
      hasBorder: false,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 8,
      shadow: true,
      shadowColor: 'rgba(0,0,0,0.25)',
      textAlign: 'center',
      padding: '20px 28px'
    }
  },
  {
    id: 'outlined',
    name: '✧ Outlined Text',
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif',
      color: 'transparent',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: true,
      borderWidth: 2,
      borderColor: '#2c3e50',
      borderRadius: 0,
      shadow: false,
      shadowColor: 'rgba(0,0,0,0.1)',
      textAlign: 'center',
      padding: '16px'
    }
  },
  {
    id: 'glass',
    name: '✦ Glassmorphism',
    style: {
      fontSize: '72px',
      fontWeight: 'medium',
      fontFamily: 'SF Pro Display, sans-serif',
      color: '#ffffff',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 0.95,
      hasBorder: true,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 16,
      shadow: true,
      shadowColor: 'rgba(31, 38, 135, 0.15)',
      textAlign: 'center',
      padding: '24px 32px'
    }
  },
  {
    id: 'vibrant',
    name: '✧ Vibrant Modern',
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      fontFamily: 'Raleway, sans-serif',
      color: '#8c00ff',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: false,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 12,
      shadow: true,
      shadowColor: 'rgba(140, 0, 255, 0.2)',
      textAlign: 'left',
      padding: '20px 24px'
    }
  },
  {
    id: 'neo-brutalism',
    name: '✦ Neo Brutalism',
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      fontFamily: 'Helvetica Neue, sans-serif',
      color: '#000000',
      backgroundColor: 'transparent',
      hasBackground: false,
      opacity: 1,
      hasBorder: true,
      borderWidth: 3,
      borderColor: '#000000',
      borderRadius: 0,
      shadow: true,
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      textAlign: 'left',
      padding: '18px 20px'
    }
  }
];

interface BoxControlsProps {
  selectedBox: BoxData | null;
  onAddTextBox: () => void;
  onAddImageBox: () => void;
  onDeleteBox: (id: string) => void;
  onStyleChange: (id: string, style: any) => void;
  onPropertyChange: (id: string, property: string, value: any) => void;
  onContentChange: (id: string, content: string) => void;
  onImageSettingsChange: (id: string, settings: any) => void;
  boxes: BoxData[];
}

const BoxControls: React.FC<BoxControlsProps> = ({
  selectedBox,
  onAddTextBox,
  onAddImageBox,
  onDeleteBox,
  onStyleChange,
  onPropertyChange,
  onContentChange,
  onImageSettingsChange,
  boxes,
}) => {
  // State for text editing
  const [textContent, setTextContent] = useState('');

  // Update text content state when selected box changes
  React.useEffect(() => {
    if (selectedBox && selectedBox.type === 'text') {
      setTextContent(selectedBox.content);
    }
  }, [selectedBox]);

  // Handle text content change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
  };

  // Save text content
  const handleSaveText = () => {
    if (selectedBox) {
      onContentChange(selectedBox.id, textContent);
    }
  };

  // Update box style
  const handleStyleChange = (property: string, value: any) => {
    if (selectedBox) {
      onStyleChange(selectedBox.id, { [property]: value });
    }
  };

  // Update image settings
  const handleImageSettingsChange = (property: string, value: any) => {
    if (selectedBox) {
      onImageSettingsChange(selectedBox.id, { [property]: value });
    }
  };

  // Apply style preset to text box
  const applyStylePreset = (presetId: string) => {
    if (selectedBox && selectedBox.type === 'text') {
      const preset = textStylePresets.find(p => p.id === presetId);
      if (preset) {
        // 创建完整样式对象而不是分别应用每个属性
        const newStyles = { ...preset.style };
        // 一次性应用所有样式属性
        onStyleChange(selectedBox.id, newStyles);
        
        // 示例文本内容 - 根据预设类型提供适当的示例文本
        if (presetId === 'gradient' || presetId === 'hero') {
          const sampleText = presetId === 'gradient' ? 'GRADIENT\nTEXT' : 'HERO\nHEADLINE';
          setTextContent(sampleText);
          onContentChange(selectedBox.id, sampleText);
        }
      }
    }
  };

  // Manejar cambios en la configuración del shell
  const handleShellSettingsChange = (property: string, value: any) => {
    if (selectedBox) {
      // Crear configuración de shell si no existe
      const currentShellSettings = selectedBox.shellSettings || { type: 'none' };
      
      onPropertyChange(
        selectedBox.id,
        'shellSettings',
        { ...currentShellSettings, [property]: value }
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add Box Controls */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Add Content</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={onAddTextBox}
          >
            <Type className="h-4 w-4" />
            Add Text
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={onAddImageBox}
          >
            <Image className="h-4 w-4" />
            Add Image
          </Button>
        </div>
      </div>

      <Separator />

      {/* Box Controls (only visible when a box is selected) */}
      {selectedBox ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Box Settings</h2>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-2" 
              onClick={() => onDeleteBox(selectedBox.id)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          <div className="bg-muted/40 p-3 rounded-md mb-4">
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <Move className="h-4 w-4" />
              <span>Hold Shift key to drag boxes</span>
            </div>
          </div>

          {/* Box Position */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium">Position & Size</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="box-x">X Position</Label>
                <Input 
                  id="box-x" 
                  type="number" 
                  value={selectedBox.x} 
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="box-y">Y Position</Label>
                <Input 
                  id="box-y" 
                  type="number" 
                  value={selectedBox.y} 
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="box-width">Width</Label>
                <Input 
                  id="box-width" 
                  type="number" 
                  value={selectedBox.width} 
                  disabled
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="box-height">Height</Label>
                <Input 
                  id="box-height" 
                  type="number" 
                  value={selectedBox.height} 
                  disabled
                  className="mt-1"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Use the resize handle to change box size.</p>

            {/* Z-Index Control */}
            <div>
              <div className="flex justify-between">
                <Label htmlFor="z-index">Layer Order (Z-Index)</Label>
                <span className="text-xs text-muted-foreground">{selectedBox.zIndex}</span>
              </div>
              <div className="flex gap-2 mt-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const currentBox = boxes.find(box => box.id === selectedBox.id);
                    if (currentBox) {
                      onPropertyChange(currentBox.id, 'zIndex', currentBox.zIndex - 1);
                    }
                  }}
                >
                  Move Backward
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const currentBox = boxes.find(box => box.id === selectedBox.id);
                    if (currentBox) {
                      onPropertyChange(currentBox.id, 'zIndex', currentBox.zIndex + 1);
                    }
                  }}
                >
                  Move Forward
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Higher values appear on top of lower values.</p>
            </div>
          </div>

          {/* Image Settings (only for image boxes) */}
          {selectedBox.type === 'image' && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium">Image Settings</h3>

              {/* 显示图片原始尺寸 */}
              {selectedBox.imageSettings?.width && selectedBox.imageSettings?.height && (
                <div className="text-xs text-muted-foreground mt-2">
                  Original image size: {selectedBox.imageSettings.width} × {selectedBox.imageSettings.height}px
                </div>
              )}
              
              {/* Shell/Frame Settings */}
              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-medium flex items-center">
                  <MonitorSmartphone className="h-3.5 w-3.5 mr-1.5" />
                  Shell/Frame
                </h4>
                
                <div className="grid gap-2">
                  <Select
                    value={selectedBox.shellSettings?.type || 'none'}
                    onValueChange={(value) => handleShellSettingsChange('type', value as ShellType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shell type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="browser">Browser</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedBox.shellSettings?.type && selectedBox.shellSettings.type !== 'none' && (
                  <>
                    <div className="space-y-2 mt-3">
                      <Label htmlFor="shell-title" className="text-xs">Title</Label>
                      <Input
                        id="shell-title"
                        placeholder="Title"
                        value={selectedBox.shellSettings?.title || ''}
                        onChange={(e) => handleShellSettingsChange('title', e.target.value)}
                        className="h-7 text-xs"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <Label htmlFor="show-controls" className="text-xs">Show Controls</Label>
                      <Switch
                        id="show-controls"
                        checked={selectedBox.shellSettings?.showControls !== false}
                        onCheckedChange={(checked) => handleShellSettingsChange('showControls', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2 mt-3">
                      <Label htmlFor="shell-color" className="text-xs">Shell Color</Label>
                      <ColorPicker
                        id="shell-color"
                        value={selectedBox.shellSettings?.color || '#f0f0f0'}
                        onChange={(color) => handleShellSettingsChange('color', color)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Text Style Presets (only for text boxes) */}
          {selectedBox.type === 'text' && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium flex items-center">
                <Palette className="h-4 w-4 mr-1.5" />
                Text Style Presets
              </h3>
              <Select
                onValueChange={applyStylePreset}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a preset style" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {textStylePresets.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div className="flex items-center">
                        <span 
                          className="w-4 h-4 mr-2 rounded-sm"
                          style={{ 
                            backgroundColor: 'transparent',
                            border: preset.style.hasBorder ? `${preset.style.borderWidth}px solid ${preset.style.borderColor}` : 'none'
                          }}
                        />
                        <span style={{ 
                          fontWeight: preset.style.fontWeight,
                          fontSize: '14px' 
                        }}>
                          {preset.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs font-medium mt-3 mb-1">Modern presets for 2560x1440 canvas</div>
              <div className="flex flex-wrap gap-2">
                {['minimal', 'hero', 'gradient', 'neo-brutalism', 'glass', 'vibrant', 'elegant', 'outlined'].map(id => {
                  const preset = textStylePresets.find(p => p.id === id);
                  if (!preset) return null;
                  return (
                    <div 
                      key={id}
                      className="w-16 h-16 flex items-center justify-center rounded cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      style={{ 
                        backgroundColor: 'transparent',
                        border: preset.style.hasBorder ? `${preset.style.borderWidth}px solid ${preset.style.borderColor}` : 'none',
                        boxShadow: preset.style.shadow ? `0 2px 4px ${preset.style.shadowColor}` : 'none',
                        borderRadius: `${preset.style.borderRadius}px`,
                        overflow: 'hidden'
                      }}
                      onClick={() => {
                        applyStylePreset(id);
                        // 显示应用成功的通知或反馈
                        // 这里可以添加一个简单的视觉反馈
                      }}
                      title={preset.name}
                    >
                      <div 
                        className="text-sm font-bold flex items-center justify-center w-full h-full"
                        style={{ 
                          color: preset.style.color, 
                          background: preset.style.color?.includes('gradient') ? preset.style.color : 'none',
                          WebkitBackgroundClip: preset.style.color?.includes('gradient') ? 'text' : 'unset',
                          WebkitTextFillColor: preset.style.color?.includes('gradient') ? 'transparent' : 'unset',
                          textShadow: preset.style.color === 'transparent' ? `0 0 1px ${preset.style.borderColor}` : 'none',
                          fontFamily: preset.style.fontFamily,
                          fontWeight: preset.style.fontWeight,
                          textAlign: preset.style.textAlign as any
                        }}
                      >
                        Aa
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Click on a style to apply it to your text box</p>
            </div>
          )}

          {/* Box Style */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium">Style</h3>
            
            {/* Background Controls */}
            {selectedBox.type === 'text' && (
              <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="has-background">Background</Label>
                <Switch
                  id="has-background"
                  checked={selectedBox.style.hasBackground}
                  onCheckedChange={(checked) => handleStyleChange('hasBackground', checked)}
                />
              </div>
              
              {selectedBox.style.hasBackground && (
                <div className="space-y-2">
                  <ColorPicker
                    id="bg-color"
                    label="Background Color"
                    value={selectedBox.style.backgroundColor}
                    onChange={(color) => handleStyleChange('backgroundColor', color)}
                  />
                </div>
              )}
            </div>
            )}
            
            {/* Opacity */}
            <div>
              <div className="flex justify-between">
                <Label htmlFor="opacity">Opacity</Label>
                <span className="text-xs text-muted-foreground">{selectedBox.style.opacity * 100}%</span>
              </div>
              <Slider
                id="opacity"
                value={[selectedBox.style.opacity * 100]}
                min={10}
                max={100}
                step={5}
                onValueChange={(value) => handleStyleChange('opacity', value[0] / 100)}
                className="mt-1.5"
              />
            </div>
            
            {/* Border Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="has-border">Border</Label>
                <Switch
                  id="has-border"
                  checked={selectedBox.style.hasBorder}
                  onCheckedChange={(checked) => handleStyleChange('hasBorder', checked)}
                />
              </div>
              
              {selectedBox.style.hasBorder && (
                <>
                  {/* Border Width */}
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="border-width">Border Width</Label>
                      <span className="text-xs text-muted-foreground">{selectedBox.style.borderWidth}px</span>
                    </div>
                    <Slider
                      id="border-width"
                      value={[selectedBox.style.borderWidth]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => handleStyleChange('borderWidth', value[0])}
                      className="mt-1.5"
                    />
                  </div>
                  
                  {/* Border Color */}
                  <div className="space-y-2">
                    <Label htmlFor="border-color">Border Color</Label>
                    <div className="flex gap-2 mt-1">
                      <div 
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: selectedBox.style.borderColor }}
                      />
                      <Input
                        id="border-color"
                        type="text"
                        value={selectedBox.style.borderColor}
                        onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="border-radius">Border Radius</Label>
                      <span className="text-xs text-muted-foreground">{selectedBox.style.borderRadius}px</span>
                    </div>
                    <Slider
                      id="border-radius"
                      value={[selectedBox.style.borderRadius]}
                      min={0}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleStyleChange('borderRadius', value[0])}
                      className="mt-1.5"
                    />
                  </div>
                </>
              )}
            </div>
            
            {/* Shadow */}
            <div className="flex items-center justify-between">
              <Label htmlFor="shadow">Shadow</Label>
              <Switch
                id="shadow"
                checked={selectedBox.style.shadow}
                onCheckedChange={(checked) => handleStyleChange('shadow', checked)}
              />
            </div>
            
            {selectedBox.style.shadow && (
              <div className="space-y-2">
                <Label htmlFor="shadow-color">Shadow Color</Label>
                <div className="flex gap-2 mt-1">
                  <div 
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: selectedBox.style.shadowColor || 'rgba(0,0,0,0.1)' }}
                  />
                  <Input
                    id="shadow-color"
                    type="text"
                    value={selectedBox.style.shadowColor || 'rgba(0,0,0,0.1)'}
                    onChange={(e) => handleStyleChange('shadowColor', e.target.value)}
                    placeholder="rgba(0,0,0,0.1)"
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Text Specific Controls */}
            {selectedBox.type === 'text' && (
              <>
                {/* Font Size */}
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="font-size">Font Size</Label>
                    <span className="text-xs text-muted-foreground">
                      {selectedBox.style.fontSize || '24px'}
                    </span>
                  </div>
                  <Slider
                    id="font-size"
                    value={[parseInt((selectedBox.style.fontSize || '24px').replace('px', ''))]}
                    min={12}
                    max={128}
                    step={2}
                    onValueChange={(value) => handleStyleChange('fontSize', `${value[0]}px`)}
                    className="mt-1.5"
                  />
                </div>

                {/* Text Alignment */}
                <div className="space-y-2">
                  <Label htmlFor="text-align">Text Alignment</Label>
                  <Select
                    value={selectedBox.style.textAlign || 'left'}
                    onValueChange={(value) => handleStyleChange('textAlign', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Text Alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Color */}
                <div className="space-y-2">
                  <Label htmlFor="font-color">Font Color</Label>
                  <ColorPicker
                    id="font-color"
                    value={selectedBox.style.color || '#000000'}
                    onChange={(color) => handleStyleChange('color', color)}
                  />
                </div>

                {/* Font Weight */}
                <div className="space-y-2">
                  <Label htmlFor="font-weight">Font Weight</Label>
                  <Select
                    value={selectedBox.style.fontWeight || 'normal'}
                    onValueChange={(value) => handleStyleChange('fontWeight', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Font Weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Regular</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          
          {/* Box Content */}
          {selectedBox.type === 'text' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Text Content</h3>
              <Textarea
                value={textContent}
                onChange={handleTextChange}
                className="min-h-[150px]"
                placeholder="Enter text here..."
              />
              <Button 
                className="w-full" 
                onClick={handleSaveText}
              >
                Save Text
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <div className="mb-4">
            <Plus className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>Select a box to edit its properties</p>
          </div>
          <p className="text-sm">
            You can add new boxes using the buttons above
          </p>
        </div>
      )}
    </div>
  );
};

export default BoxControls; 
