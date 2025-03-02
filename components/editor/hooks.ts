import { useState, useEffect, RefObject, useCallback } from 'react';

// 处理缩放功能的钩子
export const useZoom = () => {
  const [zoom, setZoom] = useState<number>(1);
  const [targetZoom, setTargetZoom] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 平滑缩放函数
  const smoothZoom = useCallback((targetValue: number) => {
    // 限制缩放范围在 0.2x 到 4x 之间
    const clampedTarget = Math.max(0.2, Math.min(4, targetValue));
    
    setTargetZoom(clampedTarget);
    setIsAnimating(true);
    
    // 在缩放变化时，确保画布保持居中
    const container = document.querySelector('.canvas-scroll-container');
    if (container) {
      const canvasElement = container.querySelector('.relative.will-change-transform') as HTMLElement;
      if (canvasElement) {
        // 确保画布在缩放时保持居中
        canvasElement.style.transform = `translate(-50%, -50%) scale(${clampedTarget})`;
      }
    }
  }, []);

  // 处理缩放
  const handleZoom = useCallback((zoomIn: boolean) => {
    const zoomStep = 0.1;
    const newZoom = zoomIn ? targetZoom + zoomStep : targetZoom - zoomStep;
    
    // 在缩放前记录当前滚动位置和视口中心
    const container = document.querySelector('.canvas-scroll-container');
    if (container) {
      const scrollContainer = container as HTMLElement;
      const viewportWidth = scrollContainer.clientWidth;
      const viewportHeight = scrollContainer.clientHeight;
      
      // 获取画布元素
      const canvasElement = scrollContainer.querySelector('.relative.will-change-transform') as HTMLElement;
      if (!canvasElement) {
        smoothZoom(newZoom);
        return;
      }
      
      // 获取画布的边界矩形
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // 计算画布中心点在视口中的位置
      const canvasCenterX = canvasRect.left + canvasRect.width / 2;
      const canvasCenterY = canvasRect.top + canvasRect.height / 2;
      
      // 计算画布中心点相对于滚动容器的位置
      const canvasCenterScrollX = canvasCenterX - scrollContainer.getBoundingClientRect().left + scrollContainer.scrollLeft;
      const canvasCenterScrollY = canvasCenterY - scrollContainer.getBoundingClientRect().top + scrollContainer.scrollTop;
      
      // 应用缩放
      smoothZoom(newZoom);
      
      // 在缩放动画完成后重新定位滚动位置
      // setTimeout(() => {
      //   // 计算新的滚动位置，保持画布中心点不变
      //   const newScrollLeft = canvasCenterScrollX - viewportWidth / 2;
      //   const newScrollTop = canvasCenterScrollY - viewportHeight / 2;
        
      //   // 应用新的滚动位置
      //   scrollContainer.scrollLeft = newScrollLeft;
      //   scrollContainer.scrollTop = newScrollTop;
      // }, 210); // 略大于动画持续时间，确保动画完成
    } else {
      // 如果找不到容器，只应用缩放
      smoothZoom(newZoom);
    }
  }, [targetZoom, smoothZoom]);

  // 设置特定缩放值
  const setSpecificZoom = useCallback((value: number) => {
    // 在缩放前记录当前滚动位置和视口中心
    const container = document.querySelector('.canvas-scroll-container');
    if (container) {
      const scrollContainer = container as HTMLElement;
      const viewportWidth = scrollContainer.clientWidth;
      const viewportHeight = scrollContainer.clientHeight;
      
      // 获取画布元素
      const canvasElement = scrollContainer.querySelector('.relative.will-change-transform') as HTMLElement;
      if (!canvasElement) {
        smoothZoom(value);
        return;
      }
      
      // 获取画布的边界矩形
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // 计算画布中心点在视口中的位置
      const canvasCenterX = canvasRect.left + canvasRect.width / 2;
      const canvasCenterY = canvasRect.top + canvasRect.height / 2;
      
      // 计算画布中心点相对于滚动容器的位置
      const canvasCenterScrollX = canvasCenterX - scrollContainer.getBoundingClientRect().left + scrollContainer.scrollLeft;
      const canvasCenterScrollY = canvasCenterY - scrollContainer.getBoundingClientRect().top + scrollContainer.scrollTop;
      
      // 应用缩放
      smoothZoom(value);
      
      // 在缩放动画完成后重新定位滚动位置
      // setTimeout(() => {
      //   // 计算新的滚动位置，保持画布中心点不变
      //   const newScrollLeft = canvasCenterScrollX - viewportWidth / 2;
      //   const newScrollTop = canvasCenterScrollY - viewportHeight / 2;
        
      //   // 应用新的滚动位置
      //   scrollContainer.scrollLeft = newScrollLeft;
      //   scrollContainer.scrollTop = newScrollTop;
      // }, 210); // 略大于动画持续时间，确保动画完成
    } else {
      // 如果找不到容器，只应用缩放
      smoothZoom(value);
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
          handleZoom(true);
        }
        // Ctrl + Minus 缩小
        else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleZoom(false);
        }
        // Ctrl + 0 重置缩放
        else if (e.key === '0') {
          e.preventDefault();
          setSpecificZoom(1);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetZoom, handleZoom, setSpecificZoom]);

  // 添加鼠标滚轮缩放
  useEffect(() => {
    const editorElement = document.querySelector('.editor-container');
    
    if (editorElement) {
      const handleWheelEvent = (e: Event) => {
        const wheelEvent = e as WheelEvent;
        if (wheelEvent.ctrlKey) {
          wheelEvent.preventDefault();
          
          // 获取滚动容器
          const container = document.querySelector('.canvas-scroll-container') as HTMLElement;
          if (!container) return;
          
          // 获取画布元素
          const canvasElement = container.querySelector('.relative.will-change-transform') as HTMLElement;
          if (!canvasElement) return;
          
          // 获取视口尺寸
          const viewportWidth = container.clientWidth;
          const viewportHeight = container.clientHeight;
          
          // 获取画布的边界矩形
          const canvasRect = canvasElement.getBoundingClientRect();
          
          // 计算画布中心点在视口中的位置
          const canvasCenterX = canvasRect.left + canvasRect.width / 2;
          const canvasCenterY = canvasRect.top + canvasRect.height / 2;
          
          // 计算画布中心点相对于滚动容器的位置
          const canvasCenterScrollX = canvasCenterX - container.getBoundingClientRect().left + container.scrollLeft;
          const canvasCenterScrollY = canvasCenterY - container.getBoundingClientRect().top + container.scrollTop;
          
          // 根据滚轮方向确定缩放方向
          const zoomIn = wheelEvent.deltaY < 0;
          
          // 使用更小的步长，实现更平滑的缩放
          const zoomStep = 0.05 * (Math.abs(wheelEvent.deltaY) / 100);
          const newZoom = zoomIn 
            ? targetZoom + zoomStep 
            : targetZoom - zoomStep;
          
          // 应用缩放
          smoothZoom(newZoom);
          
          // // 在缩放动画完成后重新定位滚动位置
          // setTimeout(() => {
          //   // 计算新的滚动位置，保持画布中心点不变
          //   const newScrollLeft = canvasCenterScrollX - viewportWidth / 2;
          //   const newScrollTop = canvasCenterScrollY - viewportHeight / 2;
            
          //   // 应用新的滚动位置
          //   container.scrollLeft = newScrollLeft;
          //   container.scrollTop = newScrollTop;
          // }, 210); // 略大于动画持续时间，确保动画完成
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
  const [imagePositions, setImagePositions] = useState<{x: number, y: number, scale?: number}[]>([]);
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
      
      // 添加鼠标样式
      document.body.style.cursor = 'grabbing';
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
          newPositions[selectedImageIndex] = { x: 0, y: 0, scale: 1 };
        }
        
        newPositions[selectedImageIndex] = {
          x: (newPositions[selectedImageIndex]?.x || 0) + deltaX,
          y: (newPositions[selectedImageIndex]?.y || 0) + deltaY,
          scale: newPositions[selectedImageIndex]?.scale || 1
        };
        
        return newPositions;
      });
    }
  };
  
  // 处理鼠标松开事件
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // 恢复鼠标样式
      document.body.style.cursor = '';
    }
  };

  // 重置指定图片的位置
  const resetImagePosition = (index: number) => {
    if (index !== null) {
      setImagePositions(prev => {
        const newPositions = [...prev];
        const currentScale = newPositions[index]?.scale || 1;
        newPositions[index] = { x: 0, y: 0, scale: currentScale };
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
          newPositions[index] = { x: 0, y: 0, scale: 1 };
        }
        newPositions[index][axis] = value;
        return newPositions;
      });
    }
  };

  // 更新图片缩放
  const updateImageScale = (index: number, value: number) => {
    if (index !== null) {
      setImagePositions(prev => {
        const newPositions = [...prev];
        if (!newPositions[index]) {
          newPositions[index] = { x: 0, y: 0, scale: 1 };
        }
        newPositions[index].scale = value;
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
      // 创建一个新的位置数组
      const newPositions = [...prev];
      
      // 确保每个图片都有初始位置
      for (let i = 0; i < imagesCount; i++) {
        if (!newPositions[i]) {
          newPositions[i] = { x: 0, y: 0, scale: 1 };
        }
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
    updateImageScale,
    initializePositions
  };
}; 
