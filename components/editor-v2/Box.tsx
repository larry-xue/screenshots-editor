import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BoxData } from './types';

interface BoxProps {
  data: BoxData;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  displayScale?: number;
}

const Box: React.FC<BoxProps> = ({
  data,
  isSelected,
  onSelect,
  onMove,
  onResize,
  displayScale = 1
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  
  // State for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // State for resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  
  // State for image drag within box
  const [imageDragging, setImageDragging] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Handle box click
  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // -------- Dragging Logic --------
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    
    // Only initiate box dragging if Shift key is pressed and we're not on the resize handle or image
    const target = e.target as HTMLElement;
    const isResizeHandle = target.classList.contains('resize-handle');
    const isImage = target.tagName.toLowerCase() === 'img';
    
    if (e.shiftKey && !isResizeHandle && !isImage) {
      setIsDragging(true);
      const box = boxRef.current?.getBoundingClientRect();
      if (box) {
        setDragOffset({ 
          x: (e.clientX - box.left), 
          y: (e.clientY - box.top) 
        });
      }
    }
  };

  // -------- Resizing Logic --------
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: data.width, height: data.height });
  };

  // -------- Image Dragging Logic --------
  const handleImageMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.type === 'image') {
      setImageDragging(true);
      setDragStartPos({ 
        x: e.clientX - imagePosition.x, 
        y: e.clientY - imagePosition.y 
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Find the canvas element - it's the parent of the box container
        const canvasContainer = boxRef.current?.closest('.canvas-container');
        if (!canvasContainer) return;

        // Get canvas position
        const canvasRect = canvasContainer.getBoundingClientRect();
        
        // Calculate position relative to canvas (accounting for scale)
        const relativeX = (e.clientX - canvasRect.left) / displayScale;
        const relativeY = (e.clientY - canvasRect.top) / displayScale;
        
        // Apply the offset to get the box position
        const x = relativeX - dragOffset.x / displayScale;
        const y = relativeY - dragOffset.y / displayScale;
        
        // Ensure the box stays within the canvas
        const constrainedX = Math.max(0, Math.min(x, canvasRect.width / displayScale - data.width));
        const constrainedY = Math.max(0, Math.min(y, canvasRect.height / displayScale - data.height));
        
        onMove(constrainedX, constrainedY);
      } else if (isResizing) {
        // Handle box resizing
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;
        
        // Scale the deltas according to displayScale
        const scaledDeltaX = deltaX / displayScale;
        const scaledDeltaY = deltaY / displayScale;
        
        const newWidth = Math.max(50, initialSize.width + scaledDeltaX);
        const newHeight = Math.max(50, initialSize.height + scaledDeltaY);
        
        // Find the canvas element to constrain resizing
        const canvasContainer = boxRef.current?.closest('.canvas-container');
        if (canvasContainer) {
          const canvasRect = canvasContainer.getBoundingClientRect();
          const maxWidth = (canvasRect.width / displayScale) - data.x;
          const maxHeight = (canvasRect.height / displayScale) - data.y;
          
          const constrainedWidth = Math.min(newWidth, maxWidth);
          const constrainedHeight = Math.min(newHeight, maxHeight);
          
          onResize(constrainedWidth, constrainedHeight);
        } else {
          onResize(newWidth, newHeight);
        }
      } else if (imageDragging && data.type === 'image') {
        // Handle image dragging within box
        const x = e.clientX - dragStartPos.x;
        const y = e.clientY - dragStartPos.y;
        setImagePosition({ x, y });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setImageDragging(false);
    };

    if (isDragging || isResizing || imageDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, imageDragging, dragOffset, resizeStartPos, initialSize, onMove, onResize, dragStartPos, data.type, data.width, data.height, data.x, data.y, displayScale]);

  // Get styles for the box, applying the display scale
  const boxStyle = {
    left: `${data.x * displayScale}px`,
    top: `${data.y * displayScale}px`,
    width: `${data.width * displayScale}px`,
    height: `${data.height * displayScale}px`,
    backgroundColor: data.style.backgroundColor,
    borderWidth: `${data.style.borderWidth}px`,
    borderColor: data.style.borderColor,
    borderStyle: 'solid',
    borderRadius: `${data.style.borderRadius}px`,
    opacity: data.style.opacity,
    boxShadow: data.style.shadow ? `0 4px 8px ${data.style.shadowColor || 'rgba(0,0,0,0.1)'}` : 'none',
    cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'default'),
    position: 'absolute' as const,
    overflow: 'hidden',
    transformOrigin: 'top left',
  };

  // Get image fit styles based on settings
  const getImageStyles = () => {
    const fitMode = data.imageSettings?.fit || 'cover';
    const scale = data.imageSettings?.scale || 1;
    
    // Base styles for all image fit modes
    const baseStyles = {
      position: 'absolute' as const,
      transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,
      cursor: imageDragging ? 'grabbing' : 'grab',
    };

    // Add specific styles based on fit mode
    switch(fitMode) {
      case 'contain':
        return {
          ...baseStyles,
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain' as const,
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${imagePosition.x}px), calc(-50% + ${imagePosition.y}px))`,
        };
      case 'original':
        // Use actual image dimensions with scaling
        return {
          ...baseStyles,
          width: 'auto',
          height: 'auto',
          maxWidth: 'none',
          maxHeight: 'none',
          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${scale})`,
          transformOrigin: 'top left',
        };
      case 'cover':
      default:
        return {
          ...baseStyles,
          width: '100%',
          height: '100%',
          objectFit: 'cover' as const,
        };
    }
  };

  return (
    <div
      ref={boxRef}
      className={cn(
        'box-element',
        isSelected && 'ring-2 ring-blue-500',
      )}
      style={boxStyle}
      onClick={handleBoxClick}
      onMouseDown={handleMouseDown}
      title={isSelected ? "Hold Shift to drag" : ""}
    >
      {/* Render content based on type */}
      {data.type === 'image' ? (
        // For image boxes, apply the styles directly to the img element
        <img
          src={data.content}
          alt="Box content"
          style={getImageStyles()}
          onMouseDown={handleImageMouseDown}
          draggable={false}
          className="h-full w-full"
        />
      ) : (
        // For text boxes, wrap the content in a div
        <div className="w-full h-full p-2 overflow-hidden">
          {data.content}
        </div>
      )}

      {/* Resize handle */}
      {isSelected && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
};

export default Box; 
