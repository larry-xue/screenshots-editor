import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { Switch } from "@/components/ui/switch";
import ThemePresets, { ThemePreset } from './ThemePresets';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CanvasControlsProps {
  layout: string;
  background: string;
  padding: number;
  gap: number;
  border: {
    enabled: boolean;
    width: number;
    radius: number;
    color: string;
  };
  onLayoutChange: (layout: string) => void;
  onPaddingChange: (padding: number) => void;
  onGapChange: (gap: number) => void;
  onBackgroundChange: (color: string) => void;
  onBorderChange: (border: {
    enabled: boolean;
    width: number;
    radius: number;
    color: string;
  }) => void;
  onSelectTheme: (theme: ThemePreset) => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  layout,
  background,
  padding,
  gap,
  border,
  onLayoutChange,
  onPaddingChange,
  onGapChange,
  onBackgroundChange,
  onBorderChange,
  onSelectTheme
}) => {
  // 布局选项
  const layoutOptions = [
    { value: "single", label: "1×1" },
    { value: "2x1", label: "2×1" },
    { value: "1x2", label: "1×2" },
    { value: "2x2", label: "2×2" },
    { value: "3x2", label: "3×2" },
  ];

  // 渐变背景状态
  const [isGradient, setIsGradient] = useState(background.includes('gradient'));
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>(
    background.includes('linear') ? 'linear' : 'radial'
  );
  const [gradientAngle, setGradientAngle] = useState(135);
  const [color1, setColor1] = useState(background.includes('gradient') ? '#0f172a' : background);
  const [color2, setColor2] = useState(background.includes('gradient') ? '#1e40af' : '#e2e8f0');

  // 初始化渐变颜色
  useEffect(() => {
    // 防止循环更新
    const isUserChange = !background.includes(`${gradientAngle}deg`);
    if (!isUserChange) return;
    
    // 重置渐变状态
    setIsGradient(background.includes('gradient'));
    
    if (background.includes('gradient')) {
      const isLinear = background.includes('linear-gradient');
      setGradientType(isLinear ? 'linear' : 'radial');
      
      // 提取角度（仅适用于线性渐变）
      if (isLinear) {
        const angleMatch = background.match(/(\d+)deg/);
        console.log('angleMatch', angleMatch, background);
        if (angleMatch && angleMatch[1]) {
          setGradientAngle(parseInt(angleMatch[1]));
        }
      }
      
      // 提取颜色
      const colorMatches = background.match(/(#[0-9a-f]{3,8}|rgba?\([^)]+\))/gi);
      if (colorMatches && colorMatches.length >= 2) {
        setColor1(colorMatches[0]);
        setColor2(colorMatches[1]);
      }
    } else {
      setColor1(background);
      setColor2('#e2e8f0');
    }
  }, [background]);

  // 更新渐变背景
  const updateGradientBackground = useCallback(() => {
    if (!isGradient) {
      onBackgroundChange(color1);
      return;
    }

    let gradientString = '';
    if (gradientType === 'linear') {
      gradientString = `linear-gradient(${gradientAngle}deg, ${color1} 0%, ${color2} 100%)`;
    } else {
      gradientString = `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`;
    }
    onBackgroundChange(gradientString);
  }, [isGradient, gradientType, gradientAngle, color1, color2, onBackgroundChange]);

  // 当渐变相关状态变化时更新背景
  useEffect(() => {
    updateGradientBackground();
  }, [updateGradientBackground]);

  return (
    <div className="p-4 space-y-6">
      {/* 主题预设 */}
      <ThemePresets 
        onSelectTheme={onSelectTheme}
        currentBackground={background}
      />
      
      <Separator />
      
      {/* 布局设置 */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Layout</h3>
        <div className="grid grid-cols-5 gap-2">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              className={`p-2 text-center rounded-md border ${
                layout === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
              onClick={() => onLayoutChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* 间距设置 */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between">
            <Label>Padding</Label>
            <span className="text-xs text-muted-foreground">{padding}px</span>
          </div>
          <Slider
            value={[padding]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onPaddingChange(value[0])}
            className="mt-1.5"
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <Label>Gap</Label>
            <span className="text-xs text-muted-foreground">{gap}px</span>
          </div>
          <Slider
            value={[gap]}
            min={0}
            max={50}
            step={1}
            onValueChange={(value) => onGapChange(value[0])}
            className="mt-1.5"
          />
        </div>
      </div>
      
      <Separator />
      
      {/* 背景设置 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Background</h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="gradient-toggle" className="text-xs">Gradient</Label>
            <Switch
              id="gradient-toggle"
              checked={isGradient}
              onCheckedChange={setIsGradient}
            />
          </div>
        </div>

        {!isGradient ? (
          <ColorPicker
            value={color1}
            onChange={setColor1}
          />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Select
                value={gradientType}
                onValueChange={(value: 'linear' | 'radial') => setGradientType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Gradient Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {gradientType === 'linear' && (
              <div>
                <div className="flex justify-between">
                  <Label>Angle</Label>
                  <span className="text-xs text-muted-foreground">{gradientAngle}°</span>
                </div>
                <Slider
                  value={[gradientAngle]}
                  min={0}
                  max={360}
                  step={1}
                  onValueChange={(value) => setGradientAngle(value[0])}
                  className="mt-1.5"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Color 1</Label>
                <div className="mt-1">
                  <ColorPicker
                    value={color1}
                    onChange={setColor1}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Color 2</Label>
                <div className="mt-1">
                  <ColorPicker
                    value={color2}
                    onChange={setColor2}
                  />
                </div>
              </div>
            </div>

            <div 
              className="h-6 w-full rounded-md mt-2 border"
              key={`${gradientType}-${gradientAngle}-${color1}-${color2}`}
              style={{ 
                background: gradientType === 'linear' 
                  ? `linear-gradient(${gradientAngle}deg, ${color1} 0%, ${color2} 100%)`
                  : `radial-gradient(circle, ${color1} 0%, ${color2} 100%)`
              }}
            />
          </div>
        )}
      </div>
      
      <Separator />
      
      {/* 边框设置 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Border</h3>
          <Switch
            checked={border.enabled}
            onCheckedChange={(checked) => onBorderChange({ ...border, enabled: checked })}
          />
        </div>
        
        {border.enabled && (
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between">
                <Label>Width</Label>
                <span className="text-xs text-muted-foreground">{border.width}px</span>
              </div>
              <Slider
                value={[border.width]}
                min={0}
                max={10}
                step={1}
                onValueChange={(value) => onBorderChange({ ...border, width: value[0] })}
                className="mt-1.5"
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>Radius</Label>
                <span className="text-xs text-muted-foreground">{border.radius}px</span>
              </div>
              <Slider
                value={[border.radius]}
                min={0}
                max={30}
                step={1}
                onValueChange={(value) => onBorderChange({ ...border, radius: value[0] })}
                className="mt-1.5"
              />
            </div>
            
            <div>
              <Label>Color</Label>
              <div className="mt-1.5">
                <ColorPicker
                  value={border.color}
                  onChange={(color: string) => onBorderChange({ ...border, color })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasControls; 
