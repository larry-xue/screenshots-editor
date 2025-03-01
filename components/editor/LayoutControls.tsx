import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Maximize, LayoutGrid, Grid2X2, Grid3X3 } from "lucide-react";

interface LayoutControlsProps {
  layout: string;
  padding: number;
  gap: number;
  onLayoutChange: (layout: string) => void;
  onPaddingChange: (padding: number) => void;
  onGapChange: (gap: number) => void;
}

const LayoutControls: React.FC<LayoutControlsProps> = ({
  layout,
  padding,
  gap,
  onLayoutChange,
  onPaddingChange,
  onGapChange
}) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Layout</h3>
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={layout === "single" ? "default" : "outline"}
          className="h-10 p-0"
          onClick={() => onLayoutChange("single")}
        >
          <div className="h-full w-full flex items-center justify-center">
            <Maximize className="h-4 w-4" />
          </div>
        </Button>
        <Button
          variant={layout === "2x1" ? "default" : "outline"}
          className="h-10 p-0"
          onClick={() => onLayoutChange("2x1")}
        >
          <div className="h-full w-full flex items-center justify-center">
            <LayoutGrid className="h-4 w-4" />
          </div>
        </Button>
        <Button
          variant={layout === "1x2" ? "default" : "outline"}
          className="h-10 p-0"
          onClick={() => onLayoutChange("1x2")}
        >
          <div className="h-full w-full flex items-center justify-center rotate-90">
            <LayoutGrid className="h-4 w-4" />
          </div>
        </Button>
        <Button
          variant={layout === "2x2" ? "default" : "outline"}
          className="h-10 p-0"
          onClick={() => onLayoutChange("2x2")}
        >
          <div className="h-full w-full flex items-center justify-center">
            <Grid2X2 className="h-4 w-4" />
          </div>
        </Button>
        <Button
          variant={layout === "3x2" ? "default" : "outline"}
          className="h-10 p-0"
          onClick={() => onLayoutChange("3x2")}
        >
          <div className="h-full w-full flex items-center justify-center">
            <Grid3X3 className="h-4 w-4" />
          </div>
        </Button>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Padding</Label>
            <span className="text-xs text-muted-foreground">{padding}px</span>
          </div>
          <Slider
            value={[padding]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onPaddingChange(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Gap</Label>
            <span className="text-xs text-muted-foreground">{gap}px</span>
          </div>
          <Slider
            value={[gap]}
            min={0}
            max={50}
            step={1}
            onValueChange={(value) => onGapChange(value[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutControls; 
