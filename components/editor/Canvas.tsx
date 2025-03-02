import React, { forwardRef, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Box from './Box';
import { BoxData } from './types';

interface CanvasProps {
  width: number;
  height: number;
  background: string;
  boxes: BoxData[];
  selectedBoxId: string | null;
  onBoxSelect: (id: string | null) => void;
  onBoxMove: (id: string, x: number, y: number) => void;
  onBoxResize: (id: string, width: number, height: number) => void;
  onAddBox: () => void;
  displayScale?: number;
  isExporting?: boolean;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
  width,
  height,
  background,
  boxes,
  selectedBoxId,
  onBoxSelect,
  onBoxMove,
  onBoxResize,
  onAddBox,
  displayScale = 1,
  isExporting = false
}, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

  // Handle canvas click event (deselect if clicking on empty canvas)
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if the click is directly on the canvas and not on a box
    if (e.target === canvasRef.current) {
      onBoxSelect(null);
    }
  };

  // Calculate scaled dimensions
  const scaledWidth = width * displayScale;
  const scaledHeight = height * displayScale;

  return (
    <div className="flex items-center justify-center w-full h-full p-4 overflow-auto">
      <div className="relative">
        {/* Display info about actual dimensions */}
        {!isExporting && (
          <div className="absolute -top-8 left-0 text-xs text-muted-foreground">
            Canvas: {width} x {height}px (displayed at {Math.round(displayScale * 100)}%)
          </div>
        )}
        
        <div 
          ref={ref}
          className="canvas-container relative shadow-lg transform-gpu"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            background,
            position: 'relative',
            overflow: 'clip',
            transformOrigin: 'top left',
            isolation: 'isolate',
          }}
          onClick={handleCanvasClick}
        >
          {/* Render all boxes */}
          {boxes.map((box) => (
            <Box
              key={box.id}
              data={box}
              isSelected={selectedBoxId === box.id}
              onSelect={() => onBoxSelect(box.id)}
              onMove={(x, y) => onBoxMove(box.id, x, y)}
              onResize={(width, height) => onBoxResize(box.id, width, height)}
              displayScale={displayScale}
              isExporting={isExporting}
            />
          ))}

          {/* Add empty state when no boxes */}
          {boxes.length === 0 && !isExporting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">Canvas is empty</p>
              <Button onClick={onAddBox} variant="outline">
                Add Box
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas; 
