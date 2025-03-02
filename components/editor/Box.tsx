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
  isExporting?: boolean;
}

const Box: React.FC<BoxProps> = ({
  data,
  isSelected,
  onSelect,
  onMove,
  onResize,
  displayScale = 1,
  isExporting = false
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
  
  // State for shift key
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Handle shift key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle box click
  const handleBoxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 当按住 shift 时不允许选中
    if (!e.shiftKey) {
      onSelect();
    }
  };

  // 鼠标按下事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
    } else if (!e.shiftKey) {
      // 只有在没有按住 shift 时才允许选中
      onSelect();
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
    userSelect: 'none' as const, // 禁止文本选择
    zIndex: data.zIndex, // 添加 z-index 支持
    transition: 'box-shadow 0.2s ease', // 添加过渡效果
  };

  // 渲染调整大小的手柄
  const renderResizeHandles = () => {
    if (!isSelected || isExporting) return null;
    
    const handlePositions = [
      'top-left', 'top-right', 'bottom-left', 'bottom-right'
    ];
    
    return handlePositions.map(position => {
      const [vertical, horizontal] = position.split('-');
      return (
        <div
          key={position}
          className={cn(
            "absolute w-3 h-3 bg-white border border-blue-500",
            "hover:bg-blue-500 transition-colors duration-200",
            // 移除 text box 的 opacity 过渡效果
            isResizing ? 'opacity-100' : (data.type === 'text' ? 'opacity-0 group-hover:opacity-100' : '')
          )}
          style={{
            top: vertical === 'top' ? '0' : 'auto',
            bottom: vertical === 'bottom' ? '0' : 'auto',
            left: horizontal === 'left' ? '0' : 'auto',
            right: horizontal === 'right' ? '0' : 'auto',
            cursor: `${position}-resize`,
            zIndex: 10,
            transform: `translate(${horizontal === 'left' ? '-50%' : '50%'}, ${vertical === 'top' ? '-50%' : '50%'})`,
          }}
          onMouseDown={handleResizeStart}
        />
      );
    });
  };

  // 为图片框渲染
  if (data.type === 'image') {
    return (
      <div 
        className="relative group"
        style={baseBoxStyle}
      >
        <img
          ref={imageBoxRef}
          src={data.content}
          alt="Box content"
          className={cn(
            'box-element w-full h-full',
            !isExporting && 'group-hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]',
            isSelected && !isExporting && 'ring-2 ring-blue-500'
          )}
          style={{
            objectPosition: 'center',
            objectFit: 'cover',
            opacity: data.style.opacity,
            borderWidth: data.style.hasBorder ? `${data.style.borderWidth}px` : '0',
            borderColor: data.style.hasBorder ? data.style.borderColor : 'transparent',
            borderStyle: data.style.hasBorder ? 'solid' : 'none',
            borderRadius: `${data.style.borderRadius}px`,
            boxShadow: data.style.shadow ? `0 4px 8px ${data.style.shadowColor || 'rgba(0,0,0,0.1)'}` : 'none',
            cursor: isExporting ? 'default' : (isDragging ? 'grabbing' : (isShiftPressed ? 'grab' : 'default')),
          }}
          onClick={handleBoxClick}
          onMouseDown={handleMouseDown}
          draggable={false}
          title={isSelected && !isExporting ? "按住Shift拖动" : ""}
        />
        {renderResizeHandles()}
      </div>
    );
  }

  // 为文本框渲染
  return (
    <div 
      ref={textBoxRef}
      className="relative group"
      style={baseBoxStyle}
    >
      <div
        className={cn(
          'box-element w-full h-full',
          !isExporting && 'group-hover:shadow-[0_0_0_2px_rgba(59,130,246,0.5)]',
          isSelected && !isExporting && 'ring-2 ring-blue-500'
        )}
        style={{
          backgroundColor: data.type === 'text' && data.style.hasBackground ? data.style.backgroundColor : 'transparent',
          borderWidth: data.style.hasBorder ? `${data.style.borderWidth}px` : '0',
          borderColor: data.style.hasBorder ? data.style.borderColor : 'transparent',
          borderStyle: data.style.hasBorder ? 'solid' : 'none',
          borderRadius: `${data.style.borderRadius}px`,
          opacity: data.style.opacity,
          boxShadow: data.style.shadow ? `0 4px 8px ${data.style.shadowColor || 'rgba(0,0,0,0.1)'}` : 'none',
          cursor: isExporting ? 'default' : (isDragging ? 'grabbing' : (isShiftPressed ? 'grab' : 'default')),
          overflow: 'hidden',
          color: data.type === 'text' ? data.style.textColor : 'inherit',
        }}
        onClick={handleBoxClick}
        onMouseDown={handleMouseDown}
        title={isSelected && !isExporting ? "按住Shift拖动" : ""}
      >
        <div className="w-full h-full p-2 overflow-hidden">
          {data.content}
        </div>
      </div>
      {renderResizeHandles()}
    </div>
  );
};

export default Box; 
