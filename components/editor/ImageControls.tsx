import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RotateCw, MoveHorizontal, ZoomIn } from "lucide-react";
import { getPositionValue, getScaleValue } from './utils';

interface ImageControlsProps {
  selectedImageIndex: number | null;
  transform3d: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number;
  };
  imagePositions: {x: number, y: number, scale?: number}[];
  onTransform3dChange: (transform: any) => void;
  onPositionChange: (index: number, axis: 'x' | 'y', value: number) => void;
  onScaleChange: (index: number, value: number) => void;
  onResetPosition: (index: number) => void;
}

const ImageControls: React.FC<ImageControlsProps> = ({
  selectedImageIndex,
  transform3d,
  imagePositions,
  onTransform3dChange,
  onPositionChange,
  onScaleChange,
  onResetPosition
}) => {
  if (selectedImageIndex === null) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
          Select an image to apply effects
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* 位置控制 */}
      <div className="space-y-4">
        <h3 className="font-medium">Position</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>X Position</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Slider
                value={[getPositionValue(selectedImageIndex, imagePositions, 'x')]}
                min={-200}
                max={200}
                step={1}
                onValueChange={(value) => {
                  if (selectedImageIndex !== null) {
                    onPositionChange(selectedImageIndex, 'x', value[0]);
                  }
                }}
                className="flex-1"
              />
              <span className="text-sm w-10 text-right">
                {Math.round(getPositionValue(selectedImageIndex, imagePositions, 'x'))}px
              </span>
            </div>
          </div>
          <div>
            <Label>Y Position</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Slider
                value={[getPositionValue(selectedImageIndex, imagePositions, 'y')]}
                min={-200}
                max={200}
                step={1}
                onValueChange={(value) => {
                  if (selectedImageIndex !== null) {
                    onPositionChange(selectedImageIndex, 'y', value[0]);
                  }
                }}
                className="flex-1"
              />
              <span className="text-sm w-10 text-right">
                {Math.round(getPositionValue(selectedImageIndex, imagePositions, 'y'))}px
              </span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => {
            if (selectedImageIndex !== null) {
              onResetPosition(selectedImageIndex);
            }
          }}
        >
          <MoveHorizontal className="h-4 w-4 mr-2" />
          Reset Position
        </Button>
      </div>
      
      <Separator />
      
      {/* 缩放控制 */}
      <div className="space-y-4">
        <h3 className="font-medium">Scale</h3>
        <div>
          <div className="flex justify-between">
            <Label>Size</Label>
            <span className="text-xs text-muted-foreground">
              {Math.round(getScaleValue(selectedImageIndex, imagePositions) * 100)}%
            </span>
          </div>
          <Slider
            value={[getScaleValue(selectedImageIndex, imagePositions)]}
            min={0.1}
            max={2}
            step={0.01}
            onValueChange={(value) => {
              if (selectedImageIndex !== null) {
                onScaleChange(selectedImageIndex, value[0]);
              }
            }}
            className="mt-1.5"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full mt-2"
          onClick={() => {
            if (selectedImageIndex !== null) {
              onScaleChange(selectedImageIndex, 1);
            }
          }}
        >
          <ZoomIn className="h-4 w-4 mr-2" />
          Reset Scale
        </Button>
      </div>
      
      <Separator />
      
      {/* 3D旋转控制 */}
      <div className="space-y-4">
        <h3 className="font-medium">3D Rotation</h3>
        <div>
          <div className="flex justify-between">
            <Label>Rotate X</Label>
            <span className="text-xs text-muted-foreground">{transform3d.rotateX}°</span>
          </div>
          <Slider
            value={[transform3d.rotateX]}
            min={-180}
            max={180}
            step={1}
            onValueChange={(value) => onTransform3dChange({ ...transform3d, rotateX: value[0] })}
            className="mt-1.5"
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <Label>Rotate Y</Label>
            <span className="text-xs text-muted-foreground">{transform3d.rotateY}°</span>
          </div>
          <Slider
            value={[transform3d.rotateY]}
            min={-180}
            max={180}
            step={1}
            onValueChange={(value) => onTransform3dChange({ ...transform3d, rotateY: value[0] })}
            className="mt-1.5"
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <Label>Rotate Z</Label>
            <span className="text-xs text-muted-foreground">{transform3d.rotateZ}°</span>
          </div>
          <Slider
            value={[transform3d.rotateZ]}
            min={-180}
            max={180}
            step={1}
            onValueChange={(value) => onTransform3dChange({ ...transform3d, rotateZ: value[0] })}
            className="mt-1.5"
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <Label>Perspective</Label>
            <span className="text-xs text-muted-foreground">{transform3d.perspective}px</span>
          </div>
          <Slider
            value={[transform3d.perspective]}
            min={100}
            max={2000}
            step={10}
            onValueChange={(value) => onTransform3dChange({ ...transform3d, perspective: value[0] })}
            className="mt-1.5"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full mt-2"
          onClick={() => onTransform3dChange({
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            perspective: 1000,
          })}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Reset Transforms
        </Button>
      </div>
      
      <Separator />
      
      {/* 导出设置 */}
      <div className="space-y-4">
        <h3 className="font-medium">Export Settings</h3>
        <div className="text-sm text-muted-foreground">
          Configure export settings in the main menu.
        </div>
      </div>
    </div>
  );
};

export default ImageControls; 
