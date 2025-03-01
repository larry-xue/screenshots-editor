import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

interface StyleControlsProps {
  selectedImageIndex: number | null;
  background: string;
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
  onBackgroundChange: (color: string) => void;
  onBorderChange: (border: any) => void;
  onShadowChange: (shadow: any) => void;
}

const StyleControls: React.FC<StyleControlsProps> = ({
  selectedImageIndex,
  background,
  border,
  shadow,
  onBackgroundChange,
  onBorderChange,
  onShadowChange
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Background</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="bg-color">Color</Label>
            <div className="flex mt-1.5">
              <Input
                id="bg-color"
                type="color"
                value={background}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="w-10 h-10 p-1 rounded-l-md"
              />
              <Input
                type="text"
                value={background}
                onChange={(e) => onBackgroundChange(e.target.value)}
                className="flex-1 rounded-l-none"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Border</h3>
          <Switch
            checked={border.enabled}
            onCheckedChange={(checked) => onBorderChange({ ...border, enabled: checked })}
            disabled={selectedImageIndex === null}
          />
        </div>
        
        {selectedImageIndex === null ? (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            Select an image to apply border styles
          </div>
        ) : border.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="border-color">Color</Label>
                <div className="flex mt-1.5">
                  <Input
                    id="border-color"
                    type="color"
                    value={border.color}
                    onChange={(e) => onBorderChange({ ...border, color: e.target.value })}
                    className="w-10 h-10 p-1 rounded-l-md"
                  />
                  <Input
                    type="text"
                    value={border.color}
                    onChange={(e) => onBorderChange({ ...border, color: e.target.value })}
                    className="flex-1 rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="border-width">Width</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Slider
                    id="border-width"
                    value={[border.width]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => onBorderChange({ ...border, width: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-right">{border.width}px</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label htmlFor="border-radius">Radius</Label>
                <span className="text-xs text-muted-foreground">{border.radius}px</span>
              </div>
              <Slider
                id="border-radius"
                value={[border.radius]}
                min={0}
                max={30}
                step={1}
                onValueChange={(value) => onBorderChange({ ...border, radius: value[0] })}
                className="mt-1.5"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Shadow</h3>
          <Switch
            checked={shadow.enabled}
            onCheckedChange={(checked) => onShadowChange({ ...shadow, enabled: checked })}
            disabled={selectedImageIndex === null}
          />
        </div>
        
        {selectedImageIndex === null ? (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            Select an image to apply shadow effects
          </div>
        ) : shadow.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>X Offset</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Slider
                    value={[shadow.x]}
                    min={-50}
                    max={50}
                    step={1}
                    onValueChange={(value) => onShadowChange({ ...shadow, x: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-right">{shadow.x}px</span>
                </div>
              </div>
              <div>
                <Label>Y Offset</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Slider
                    value={[shadow.y]}
                    min={-50}
                    max={50}
                    step={1}
                    onValueChange={(value) => onShadowChange({ ...shadow, y: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-right">{shadow.y}px</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Blur</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Slider
                    value={[shadow.blur]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => onShadowChange({ ...shadow, blur: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-right">{shadow.blur}px</span>
                </div>
              </div>
              <div>
                <Label>Spread</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Slider
                    value={[shadow.spread]}
                    min={-50}
                    max={50}
                    step={1}
                    onValueChange={(value) => onShadowChange({ ...shadow, spread: value[0] })}
                    className="flex-1"
                  />
                  <span className="text-sm w-8 text-right">{shadow.spread}px</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="shadow-color">Color</Label>
              <div className="flex mt-1.5">
                <Input
                  id="shadow-color"
                  type="color"
                  value={shadow.color.startsWith("rgba") ? "#000000" : shadow.color}
                  onChange={(e) => {
                    // Convert hex to rgba
                    const hex = e.target.value;
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    onShadowChange({ ...shadow, color: `rgba(${r}, ${g}, ${b}, 0.1)` });
                  }}
                  className="w-10 h-10 p-1 rounded-l-md"
                />
                <Input
                  type="text"
                  value={shadow.color}
                  onChange={(e) => onShadowChange({ ...shadow, color: e.target.value })}
                  className="flex-1 rounded-l-none"
                  placeholder="rgba(0, 0, 0, 0.1)"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleControls; 
