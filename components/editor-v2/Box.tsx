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
  // 对图片和文本使用不同的ref类型
  const textBoxRef = useRef<HTMLDivElement>(null);
  const imageBoxRef = useRef<HTMLImageElement>(null);
  
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

  // 鼠标按下事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    
    // Only initiate box dragging if Shift key is pressed and we're not on the resize handle
    const target = e.target as HTMLElement;
    const isResizeHandle = target.classList.contains('resize-handle');
    
    if (e.shiftKey && !isResizeHandle) {
      setIsDragging(true);
      
      // 根据框类型获取正确的元素引用
      const box = data.type === 'image' 
        ? imageBoxRef.current?.getBoundingClientRect()
        : textBoxRef.current?.getBoundingClientRect();
        
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // 获取正确的canvas容器
        const currentRef = data.type === 'image' ? imageBoxRef.current : textBoxRef.current;
        const canvasContainer = currentRef?.closest('.canvas-container');
        if (!canvasContainer) return;

        // Get canvas position
        const canvasRect = canvasContainer.getBoundingClientRect();
        
        // Calculate position relative to canvas (accounting for scale)
        const relativeX = (e.clientX - canvasRect.left) / displayScale;
        const relativeY = (e.clientY - canvasRect.top) / displayScale;
        
        // Apply the offset to get the box position
        const x = relativeX - dragOffset.x / displayScale;
        const y = relativeY - dragOffset.y / displayScale;
        
        // 允许元素拖出画布，不再约束位置
        onMove(x, y);
      } else if (isResizing) {
        // Handle box resizing
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;
        
        // Scale the deltas according to displayScale
        const scaledDeltaX = deltaX / displayScale;
        const scaledDeltaY = deltaY / displayScale;
        
        const newWidth = Math.max(50, initialSize.width + scaledDeltaX);
        const newHeight = Math.max(50, initialSize.height + scaledDeltaY);
        
        // 不再约束位置，允许调整大小超出画布范围
        onResize(newWidth, newHeight);
      } else if (imageDragging && data.type === 'image') {
        // 对于图片类型，不再需要处理图片在框内拖动
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

  // 基本样式，适用于所有类型的框
  const baseBoxStyle = {
    left: `${data.x * displayScale}px`,
    top: `${data.y * displayScale}px`,
    width: `${data.width * displayScale}px`,
    height: `${data.height * displayScale}px`,
    position: 'absolute' as const,
    transformOrigin: 'top left',
  };

  // 文本框样式
  const textBoxStyle = {
    ...baseBoxStyle,
    backgroundColor: data.style.backgroundColor,
    borderWidth: `${data.style.borderWidth}px`,
    borderColor: data.style.borderColor,
    borderStyle: 'solid',
    borderRadius: `${data.style.borderRadius}px`,
    opacity: data.style.opacity,
    boxShadow: data.style.shadow ? `0 4px 8px ${data.style.shadowColor || 'rgba(0,0,0,0.1)'}` : 'none',
    cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'default'),
    overflow: 'hidden',
  };

  // 图片框样式 - 始终使用 cover 模式
  const getImageBoxStyle = () => {
    return {
      ...baseBoxStyle,
      objectPosition: 'center',
      objectFit: 'cover' as const,  // 始终使用 cover 模式
      opacity: data.style.opacity,
      borderWidth: `${data.style.borderWidth}px`,
      borderColor: data.style.borderColor,
      borderStyle: 'solid',
      borderRadius: `${data.style.borderRadius}px`,
      boxShadow: data.style.shadow ? `0 4px 8px ${data.style.shadowColor || 'rgba(0,0,0,0.1)'}` : 'none',
      cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'default'),
      backgroundColor: data.style.backgroundColor,
    };
  };

  // 渲染调整大小的手柄
  const renderResizeHandle = () => {
    if (!isSelected) return null;
    
    return (
      <div
        className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
        style={{
          bottom: 0,
          right: 0,
          zIndex: 10
        }}
        onMouseDown={handleResizeStart}
      />
    );
  };

  // 为图片框渲染
  if (data.type === 'image') {
    return (
      <>
        <img
          ref={imageBoxRef}
          src={data.content}
          alt="Box content"
          className={cn(
            'box-element',
            isSelected && 'ring-2 ring-blue-500',
          )}
          style={getImageBoxStyle()}
          onClick={handleBoxClick}
          onMouseDown={handleMouseDown}
          draggable={false}
          title={isSelected ? "按住Shift拖动" : ""}
        />
        {renderResizeHandle()}
      </>
    );
  }

  // 为文本框渲染
  return (
    <div
      ref={textBoxRef}
      className={cn(
        'box-element',
        isSelected && 'ring-2 ring-blue-500',
      )}
      style={textBoxStyle}
      onClick={handleBoxClick}
      onMouseDown={handleMouseDown}
      title={isSelected ? "按住Shift拖动" : ""}
    >
      <div className="w-full h-full p-2 overflow-hidden">
        {data.content}
      </div>
      {renderResizeHandle()}
    </div>
  );
};

export default Box; 
