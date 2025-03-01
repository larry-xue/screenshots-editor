import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsControlsProps {
  exportFormat: string;
  exportQuality: number;
  exportScale: string;
  onExportFormatChange: (format: string) => void;
  onExportQualityChange: (quality: number) => void;
  onExportScaleChange: (scale: string) => void;
}

const SettingsControls: React.FC<SettingsControlsProps> = ({
  exportFormat,
  exportQuality,
  exportScale,
  onExportFormatChange,
  onExportQualityChange,
  onExportScaleChange
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Export Settings</h3>
        
        <div className="space-y-2">
          <Label htmlFor="export-format">Format</Label>
          <Select value={exportFormat} onValueChange={onExportFormatChange}>
            <SelectTrigger id="export-format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="export-quality">Quality</Label>
          <div className="flex justify-between">
            <Slider
              id="export-quality"
              value={[exportQuality]}
              min={10}
              max={100}
              step={1}
              onValueChange={(value) => onExportQualityChange(value[0])}
              className="flex-1 mr-4"
            />
            <span className="text-sm w-8 text-right">{exportQuality}%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="export-scale">Scale</Label>
          <Select value={exportScale} onValueChange={onExportScaleChange}>
            <SelectTrigger id="export-scale">
              <SelectValue placeholder="Select scale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="3">3x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SettingsControls; 
