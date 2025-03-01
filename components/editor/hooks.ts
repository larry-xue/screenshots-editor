import { useState, useEffect, RefObject, useCallback } from 'react';

// 处理缩放功能的钩子
export const useZoom = () => {
  const [zoom, setZoom] = useState<number>(1);
  const [targetZoom, setTargetZoom] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 平滑缩放函数
  const smoothZoom = useCallback((targetValue: number) => {
    // 限制缩放范围在 0.5x 到 3x 之间
    const clampedTarget = Math.max(0.5, Math.min(3, targetValue));
    
    setTargetZoom(clampedTarget);
    setIsAnimating(true);
  }, []);

  // 处理缩放
  const handleZoom = useCallback((zoomIn: boolean) => {
    const zoomStep = 0.1;
    const newZoom = zoomIn ? targetZoom + zoomStep : targetZoom - zoomStep;
    smoothZoom(newZoom);
    
    // 如果缩放较大，确保滚动容器可见
    if (newZoom > 1.2) {
      setTimeout(() => {
        const container = document.querySelector('.canvas-scroll-container');
        if (container) {
          // 滚动到中心位置
          const scrollWidth = container.scrollWidth;
          const scrollHeight = container.scrollHeight;
          const clientWidth = container.clientWidth;
          const clientHeight = container.clientHeight;
          
          container.scrollLeft = (scrollWidth - clientWidth) / 2;
          container.scrollTop = (scrollHeight - clientHeight) / 2;
        }
      }, 50);
    }
  }, [targetZoom, smoothZoom]);

  // 设置特定缩放值
  const setSpecificZoom = useCallback((value: number) => {
    smoothZoom(value);
    
    // 如果缩放较大，确保滚动容器可见
    if (value > 1.2) {
      setTimeout(() => {
        const container = document.querySelector('.canvas-scroll-container');
        if (container) {
          // 滚动到中心位置
          const scrollWidth = container.scrollWidth;
          const scrollHeight = container.scrollHeight;
          const clientWidth = container.clientWidth;
          const clientHeight = container.clientHeight;
          
          container.scrollLeft = (scrollWidth - clientWidth) / 2;
          container.scrollTop = (scrollHeight - clientHeight) / 2;
        }
      }, 50);
    }
  }, [smoothZoom]);

  // 缩放动画效果
  useEffect(() => {
    if (!isAnimating) return;

    let animationFrameId: number;
    const startTime = performance.now();
    const startZoom = zoom;
    const duration = 200; // 动画持续时间（毫秒）

    const animateZoom = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // 使用缓动函数使动画更自然
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentZoom = startZoom + (targetZoom - startZoom) * easeOutCubic;
      setZoom(currentZoom);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateZoom);
      } else {
        setZoom(targetZoom);
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animateZoom);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isAnimating, targetZoom, zoom]);

  // 添加键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否按下 Ctrl 键
      if (e.ctrlKey) {
        // Ctrl + Plus 放大
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          smoothZoom(targetZoom + 0.1);
        }
        // Ctrl + Minus 缩小
        else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          smoothZoom(targetZoom - 0.1);
        }
        // Ctrl + 0 重置缩放
        else if (e.key === '0') {
          e.preventDefault();
          smoothZoom(1);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetZoom, smoothZoom]);

  // 添加鼠标滚轮缩放
  useEffect(() => {
    const editorElement = document.querySelector('.editor-container');
    
    if (editorElement) {
      const handleWheelEvent = (e: Event) => {
        const wheelEvent = e as WheelEvent;
        if (wheelEvent.ctrlKey) {
          wheelEvent.preventDefault();
          
          // 根据滚轮方向确定缩放方向
          const zoomIn = wheelEvent.deltaY < 0;
          
          // 使用更小的步长，实现更平滑的缩放
          const zoomStep = 0.05 * (Math.abs(wheelEvent.deltaY) / 100);
          const newZoom = zoomIn 
            ? targetZoom + zoomStep 
            : targetZoom - zoomStep;
          
          smoothZoom(newZoom);
        }
      };
      
      // 添加事件监听器，设置 passive: false 以允许 preventDefault
      editorElement.addEventListener('wheel', handleWheelEvent, { passive: false });
      
      return () => {
        editorElement.removeEventListener('wheel', handleWheelEvent);
      };
    }
  }, [targetZoom, smoothZoom]);

  return { zoom, handleZoom, setSpecificZoom };
};

// 处理图片拖拽功能的钩子
export const useDraggableImages = (selectedImageIndex: number | null) => {
  const [imagePositions, setImagePositions] = useState<{x: number, y: number}[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartPos, setDragStartPos] = useState<{x: number, y: number}>({x: 0, y: 0});

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (selectedImageIndex === index) {
      setIsDragging(true);
      setDragStartPos({
        x: e.clientX,
        y: e.clientY
      });
      e.preventDefault();
    }
  };
  
  // 处理鼠标移动事件
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedImageIndex !== null) {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      
      setDragStartPos({
        x: e.clientX,
        y: e.clientY
      });
      
      setImagePositions(prev => {
        const newPositions = [...prev];
        if (!newPositions[selectedImageIndex]) {
          newPositions[selectedImageIndex] = { x: 0, y: 0 };
        }
        
        newPositions[selectedImageIndex] = {
          x: (newPositions[selectedImageIndex]?.x || 0) + deltaX,
          y: (newPositions[selectedImageIndex]?.y || 0) + deltaY
        };
        
        return newPositions;
      });
    }
  };
  
  // 处理鼠标松开事件
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 重置指定图片的位置
  const resetImagePosition = (index: number) => {
    if (index !== null) {
      setImagePositions(prev => {
        const newPositions = [...prev];
        newPositions[index] = { x: 0, y: 0 };
        return newPositions;
      });
    }
  };

  // 更新图片位置
  const updateImagePosition = (index: number, axis: 'x' | 'y', value: number) => {
    if (index !== null) {
      setImagePositions(prev => {
        const newPositions = [...prev];
        if (!newPositions[index]) {
          newPositions[index] = { x: 0, y: 0 };
        }
        newPositions[index][axis] = value;
        return newPositions;
      });
    }
  };
  
  // 添加全局鼠标松开事件监听
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // 初始化新添加图片的位置
  const initializePositions = (imagesCount: number) => {
    setImagePositions(prev => {
      const newPositions = [...prev];
      while (newPositions.length < imagesCount) {
        newPositions.push({ x: 0, y: 0 });
      }
      return newPositions;
    });
  };

  return { 
    imagePositions, 
    isDragging, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    resetImagePosition,
    updateImagePosition,
    initializePositions
  };
}; 
