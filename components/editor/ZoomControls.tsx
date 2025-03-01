import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ZoomControlsProps {
  zoom: number;
  onZoom: (zoomIn: boolean) => void;
  onResetZoom?: (value: number) => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ 
  zoom, 
  onZoom,
  onResetZoom 
}) => {
  // 计算缩放百分比
  const zoomPercentage = Math.round(zoom * 100);
  
  // 预设缩放级别
  const zoomPresets = [0.5, 0.75, 1, 1.5, 2, 2.5];
  
  // 是否显示滚动提示
  const showScrollTip = zoom > 1.2;
  
  return (
    <TooltipProvider>
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onZoom(false)}
                disabled={zoom <= 0.5}
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out (Ctrl+-)</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="relative group">
            <span className="text-sm font-medium w-16 text-center cursor-pointer">
              {zoomPercentage}%
            </span>
            
            {/* 缩放预设下拉菜单 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-background rounded-md shadow-md border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-20">
              {zoomPresets.map(preset => (
                <button
                  key={preset}
                  className={`w-full text-left px-2 py-1 text-sm hover:bg-accent ${Math.abs(zoom - preset) < 0.01 ? 'bg-accent/50 font-medium' : ''}`}
                  onClick={() => onResetZoom && onResetZoom(preset)}
                >
                  {Math.round(preset * 100)}%
                </button>
              ))}
            </div>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onZoom(true)}
                disabled={zoom >= 3}
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In (Ctrl++)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onResetZoom && onResetZoom(1)}
                className="h-8 w-8 ml-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset Zoom (Ctrl+0)</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="ml-2 text-xs text-muted-foreground hidden md:block">
            Tip: Use Ctrl+Scroll to zoom
          </div>
        </div>
        
        {/* 滚动提示 */}
        {showScrollTip && (
          <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm text-xs text-muted-foreground animate-fade-in">
            Tip: Use scrollbars to navigate the canvas
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ZoomControls; 
