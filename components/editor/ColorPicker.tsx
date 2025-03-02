import React from 'react';
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  // 确保颜色值是有效的
  const safeValue = React.useMemo(() => {
    // 如果是渐变，返回一个默认颜色
    if (value.includes('gradient')) {
      return '#ffffff';
    }
    return value;
  }, [value]);

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-md border"
        style={{ backgroundColor: safeValue }}
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Input
        type="color"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 p-0 h-8"
      />
    </div>
  );
}; 
