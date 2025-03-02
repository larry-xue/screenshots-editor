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
import { BoxData } from './types';
import { Image, Type, Trash2, Plus, MaximizeIcon, MinimizeIcon, Move } from 'lucide-react';

interface BoxControlsProps {
  selectedBox: BoxData | null;
  onAddTextBox: () => void;
  onAddImageBox: () => void;
  onDeleteBox: (id: string) => void;
  onStyleChange: (id: string, style: any) => void;
  onContentChange: (id: string, content: string) => void;
  onImageSettingsChange: (id: string, settings: any) => void;
}

const BoxControls: React.FC<BoxControlsProps> = ({
  selectedBox,
  onAddTextBox,
  onAddImageBox,
  onDeleteBox,
  onStyleChange,
  onContentChange,
  onImageSettingsChange,
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
    if (selectedBox && selectedBox.type === 'image') {
      onImageSettingsChange(selectedBox.id, { [property]: value });
    }
  };

  // Get the current image fit mode
  const getImageFitMode = () => {
    if (selectedBox?.type === 'image') {
      return selectedBox.imageSettings?.fit || 'cover';
    }
    return 'cover';
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
          </div>

          {/* Image Settings (only for image boxes) */}
          {selectedBox.type === 'image' && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium">Image Settings</h3>
              
              {/* Image Fit Mode */}
              <div>
                <Label htmlFor="image-fit">Fit Mode</Label>
                <Select
                  value={getImageFitMode()}
                  onValueChange={(value) => handleImageSettingsChange('fit', value)}
                >
                  <SelectTrigger id="image-fit" className="mt-1">
                    <SelectValue placeholder="Select fit mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">
                      <div className="flex items-center gap-2">
                        <MaximizeIcon className="h-4 w-4" />
                        <span>Fill Box</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="contain">
                      <div className="flex items-center gap-2">
                        <MinimizeIcon className="h-4 w-4" />
                        <span>Fit Within Box</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="original">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        <span>Original Size</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {getImageFitMode() === 'cover' && "Image will fill the entire box"}
                  {getImageFitMode() === 'contain' && "Image will fit within the box while maintaining aspect ratio"}
                  {getImageFitMode() === 'original' && "Image will display at its original size"}
                </p>
              </div>

              {/* Image Size Controls (only for original fit mode) */}
              {getImageFitMode() === 'original' && (
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="image-scale">Image Scale</Label>
                      <span className="text-xs text-muted-foreground">
                        {(selectedBox.imageSettings?.scale || 1) * 100}%
                      </span>
                    </div>
                    <Slider
                      id="image-scale"
                      value={[(selectedBox.imageSettings?.scale || 1) * 100]}
                      min={10}
                      max={200}
                      step={5}
                      onValueChange={(value) => handleImageSettingsChange('scale', value[0] / 100)}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Drag the image to adjust its position within the box
              </p>
            </div>
          )}

          {/* Box Style */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium">Style</h3>
            
            {/* Background Color */}
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex gap-2 mt-1">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: selectedBox.style.backgroundColor }}
                />
                <Input
                  id="bg-color"
                  type="text"
                  value={selectedBox.style.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  placeholder="#FFFFFF or rgba(255,255,255,1)"
                  className="flex-1"
                />
              </div>
            </div>
            
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
