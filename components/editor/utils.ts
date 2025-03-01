// 布局相关工具函数
export const getLayoutClass = (layout: string): string => {
  switch (layout) {
    case "single":
      return "grid-cols-1";
    case "2x1":
      return "grid-cols-2";
    case "1x2":
      return "grid-cols-1 grid-rows-2";
    case "2x2":
      return "grid-cols-2 grid-rows-2";
    case "3x2":
      return "grid-cols-3 grid-rows-2";
    default:
      return "grid-cols-1";
  }
};

// 样式相关工具函数
export const getShadowStyle = (shadow: { 
  enabled: boolean; 
  x: number; 
  y: number; 
  blur: number; 
  spread: number; 
  color: string; 
}) => {
  if (!shadow.enabled) return {};
  return {
    boxShadow: `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`,
  };
};

export const getBorderStyle = (border: { 
  enabled: boolean; 
  width: number; 
  radius: number; 
  color: string; 
}) => {
  if (!border.enabled) return {};
  return {
    border: `${border.width}px solid ${border.color}`,
    borderRadius: `${border.radius}px`,
  };
};

export const getTransformStyle = (
  selectedImageIndex: number | null,
  index: number,
  imagePositions: {x: number, y: number}[],
  transform3d: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number;
  },
  isDragging: boolean
) => {
  if (selectedImageIndex === index) {
    const position = imagePositions[index] || { x: 0, y: 0 };
    return {
      transform: `
        perspective(${transform3d.perspective}px)
        rotateX(${transform3d.rotateX}deg)
        rotateY(${transform3d.rotateY}deg)
        rotateZ(${transform3d.rotateZ}deg)
        translate(${position.x}px, ${position.y}px)
      `,
      transition: isDragging ? 'none' : 'transform 0.3s ease',
    };
  }
  return {};
};

// 位置相关工具函数
export const getPositionValue = (
  index: number | null, 
  positions: {x: number, y: number}[], 
  axis: 'x' | 'y'
): number => {
  if (index === null) return 0;
  const position = positions[index];
  return position ? position[axis] : 0;
}; 
