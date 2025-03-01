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
  imagePositions: {x: number, y: number, scale?: number}[],
  transform3d: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    perspective: number;
  },
  isDragging: boolean
) => {
  // 获取位置信息
  const position = imagePositions[index] || { x: 0, y: 0, scale: 1 };
  // 获取缩放值，如果不存在则默认为1
  const scale = position.scale || 1;
  
  // 基础3D变换样式
  const transform3dStyle = `
    perspective(${transform3d.perspective}px)
    rotateX(${transform3d.rotateX}deg)
    rotateY(${transform3d.rotateY}deg)
    rotateZ(${transform3d.rotateZ}deg)
    scale(${scale})
  `;
  
  if (selectedImageIndex === index) {
    // 选中状态：应用3D变换 + 位置变换
    return {
      transform: `${transform3dStyle} translate(${position.x}px, ${position.y}px)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease',
    };
  } else {
    // 非选中状态：只应用3D变换
    return {
      transform: transform3dStyle,
      transition: 'transform 0.3s ease',
    };
  }
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
