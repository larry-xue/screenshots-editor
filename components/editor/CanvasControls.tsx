import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Download } from 'lucide-react';
import { CanvasSettings } from './types';

interface CanvasControlsProps {
  settings: CanvasSettings;
  onSettingsChange: (settings: Partial<CanvasSettings>) => void;
  onExport: (settings: CanvasSettings) => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  settings,
  onSettingsChange,
  onExport,
}) => {
  // Handle changing canvas size
  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onSettingsChange({ [dimension]: numValue });
    }
  };

  // Handle changing canvas background color
  const handleBackgroundChange = (color: string) => {
    onSettingsChange({ background: color });
  };

  // Handle changing export settings
  const handleExportSettingChange = (
    setting: 'exportFormat' | 'exportQuality' | 'exportScale', 
    value: any
  ) => {
    onSettingsChange({ [setting]: value });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Canvas Settings</h2>
        
        {/* Canvas Size */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium">Canvas Size</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="canvas-width">Width</Label>
              <Input
                id="canvas-width"
                type="number"
                value={settings.width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="mt-1"
                min={100}
                max={3000}
              />
            </div>
            
            <div>
              <Label htmlFor="canvas-height">Height</Label>
              <Input
                id="canvas-height"
                type="number"
                value={settings.height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="mt-1"
                min={100}
                max={3000}
              />
            </div>
          </div>
          
          {/* Display Scale Slider */}
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="display-scale">Display Scale</Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(settings.displayScale * 100)}%
              </span>
            </div>
            <Slider
              id="display-scale"
              value={[settings.displayScale * 100]}
              min={10}
              max={100}
              step={5}
              onValueChange={(value) => onSettingsChange({ displayScale: value[0] / 100 })}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Adjust to zoom in/out the canvas view. The export will still use the full resolution.
            </p>
          </div>
        </div>
        
        {/* Canvas Background */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex gap-2 mt-1">
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: settings.background }}
            />
            <Input
              id="background-color"
              type="text"
              value={settings.background}
              onChange={(e) => handleBackgroundChange(e.target.value)}
              placeholder="#FFFFFF or rgba(255,255,255,1)"
              className="flex-1"
            />
          </div>
        </div>
        
        <Separator className="my-6" />
        
        {/* Export Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Export Settings</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="export-format">Format</Label>
              <Select
                value={settings.exportFormat}
                onValueChange={(value) => handleExportSettingChange('exportFormat', value)}
              >
                <SelectTrigger id="export-format" className="mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label htmlFor="export-quality">Quality</Label>
                <span className="text-xs text-muted-foreground">{settings.exportQuality}%</span>
              </div>
              <Slider
                id="export-quality"
                value={[settings.exportQuality]}
                min={10}
                max={100}
                step={5}
                onValueChange={(value) => handleExportSettingChange('exportQuality', value[0])}
                className="mt-1.5"
              />
            </div>
            
            <div>
              <Label htmlFor="export-scale">Scale</Label>
              <Select
                value={settings.exportScale.toString()}
                onValueChange={(value) => handleExportSettingChange('exportScale', parseFloat(value))}
              >
                <SelectTrigger id="export-scale" className="mt-1">
                  <SelectValue placeholder="Select scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="3">3x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4 gap-2" 
            onClick={() => onExport(settings)}
          >
            <Download className="h-4 w-4" />
            Export Image
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CanvasControls; 
