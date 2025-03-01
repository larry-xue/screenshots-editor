import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RotateCw, MoveHorizontal, ZoomIn } from "lucide-react";
import { getPositionValue } from './utils';

interface TransformControlsProps {
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
  onResetPosition: (index: number) => void;
  onScaleChange?: (index: number, scale: number) => void;
}

const TransformControls: React.FC<TransformControlsProps> = ({
  selectedImageIndex,
  transform3d,
  imagePositions,
  onTransform3dChange,
  onPositionChange,
  onResetPosition,
  onScaleChange
}) => {
  if (selectedImageIndex === null) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
          Select an image to apply 3D effects
        </div>
      </div>
    );
  }

  // 获取当前选中图片的缩放值
  const currentScale = imagePositions[selectedImageIndex]?.scale || 1;

  return (
    <div className="p-4 space-y-6">
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
      
      {/* 图片缩放控制 */}
      <div className="space-y-4">
        <h3 className="font-medium">Scale</h3>
        <div>
          <div className="flex justify-between">
            <Label>Image Scale</Label>
            <span className="text-xs text-muted-foreground">{(currentScale * 100).toFixed(0)}%</span>
          </div>
          <Slider
            value={[currentScale]}
            min={0.2}
            max={3}
            step={0.01}
            onValueChange={(value) => {
              if (selectedImageIndex !== null && onScaleChange) {
                onScaleChange(selectedImageIndex, value[0]);
              }
            }}
            className="mt-1.5"
          />
          <div className="flex justify-between mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (selectedImageIndex !== null && onScaleChange) {
                  onScaleChange(selectedImageIndex, Math.max(0.2, currentScale - 0.1));
                }
              }}
            >
              -
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (selectedImageIndex !== null && onScaleChange) {
                  onScaleChange(selectedImageIndex, 1); // 重置为100%
                }
              }}
            >
              <ZoomIn className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (selectedImageIndex !== null && onScaleChange) {
                  onScaleChange(selectedImageIndex, Math.min(3, currentScale + 0.1));
                }
              }}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      
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
    </div>
  );
};

export default TransformControls; 
