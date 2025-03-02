import React, { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type GradientType = 'linear' | 'radial';
export type GradientDirection = 
  | 'to top' 
  | 'to top right' 
  | 'to right' 
  | 'to bottom right' 
  | 'to bottom' 
  | 'to bottom left' 
  | 'to left' 
  | 'to top left';

export type ColorStop = {
  color: string;
  position: number;
};

export type GradientConfig = {
  type: GradientType;
  direction: GradientDirection;
  stops: ColorStop[];
};

export type BackgroundConfig = {
  type: 'solid' | 'gradient';
  color: string;
  gradient?: GradientConfig;
};

// Common preset colors for quick selection
const PRESET_COLORS = [
  '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', 
  '#ced4da', '#adb5bd', '#6c757d', '#495057', 
  '#343a40', '#212529', '#000000', 'transparent',
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
  '#009688', '#4caf50', '#8bc34a', '#cddc39', 
  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
];

// Helper function to convert background config to CSS value
export const backgroundConfigToCss = (config: BackgroundConfig): string => {
  if (config.type === 'solid') {
    return config.color;
  }

  if (config.type === 'gradient' && config.gradient) {
    const { type, direction, stops } = config.gradient;
    
    if (type === 'linear') {
      const stopsStr = stops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');
      return `linear-gradient(${direction}, ${stopsStr})`;
    } else {
      const stopsStr = stops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');
      return `radial-gradient(circle, ${stopsStr})`;
    }
  }

  return '';
};

// Helper function to parse CSS value to background config
export const cssToBackgroundConfig = (cssValue: string): BackgroundConfig => {
  // Check if it's a gradient
  if (cssValue.includes('gradient')) {
    const isLinear = cssValue.includes('linear-gradient');
    const isRadial = cssValue.includes('radial-gradient');
    
    if (isLinear) {
      // Parse linear gradient
      const match = cssValue.match(/linear-gradient\((.*?),(.*)\)/);
      
      if (match) {
        const direction = match[1].trim() as GradientDirection;
        const stopsStr = match[2].trim();
        
        // Parse color stops
        const stopRegex = /([^,]+) (\d+)%/g;
        const stops: ColorStop[] = [];
        let stopMatch;
        
        while ((stopMatch = stopRegex.exec(stopsStr)) !== null) {
          stops.push({
            color: stopMatch[1].trim(),
            position: parseInt(stopMatch[2], 10)
          });
        }
        
        return {
          type: 'gradient',
          color: stops[0]?.color || '#ffffff',
          gradient: {
            type: 'linear',
            direction,
            stops: stops.length ? stops : [
              { color: '#ffffff', position: 0 },
              { color: '#000000', position: 100 }
            ]
          }
        };
      }
    } else if (isRadial) {
      // Parse radial gradient
      const match = cssValue.match(/radial-gradient\(circle,(.*)\)/);
      
      if (match) {
        const stopsStr = match[1].trim();
        
        // Parse color stops
        const stopRegex = /([^,]+) (\d+)%/g;
        const stops: ColorStop[] = [];
        let stopMatch;
        
        while ((stopMatch = stopRegex.exec(stopsStr)) !== null) {
          stops.push({
            color: stopMatch[1].trim(),
            position: parseInt(stopMatch[2], 10)
          });
        }
        
        return {
          type: 'gradient',
          color: stops[0]?.color || '#ffffff',
          gradient: {
            type: 'radial',
            direction: 'to right' as GradientDirection,
            stops: stops.length ? stops : [
              { color: '#ffffff', position: 0 },
              { color: '#000000', position: 100 }
            ]
          }
        };
      }
    }
  }
  
  // Default to solid color
  return {
    type: 'solid',
    color: cssValue || '#ffffff'
  };
};

// Default gradient configurations
const DEFAULT_LINEAR_GRADIENT: GradientConfig = {
  type: 'linear',
  direction: 'to right',
  stops: [
    { color: '#ffffff', position: 0 },
    { color: '#000000', position: 100 }
  ]
};

const DEFAULT_RADIAL_GRADIENT: GradientConfig = {
  type: 'radial',
  direction: 'to right',
  stops: [
    { color: '#ffffff', position: 0 },
    { color: '#000000', position: 100 }
  ]
};

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  id = 'color-picker'
}) => {
  // Parse the initial value into our config format
  const [config, setConfig] = useState<BackgroundConfig>(cssToBackgroundConfig(value));
  const [activeTab, setActiveTab] = useState<string>(config.type);
  
  // When external value changes, update our internal state
  useEffect(() => {
    setConfig(cssToBackgroundConfig(value));
    setActiveTab(cssToBackgroundConfig(value).type);
  }, [value]);

  // Update the CSS when config changes
  const handleConfigChange = (newConfig: BackgroundConfig) => {
    setConfig(newConfig);
    const cssValue = backgroundConfigToCss(newConfig);
    onChange(cssValue);
  };

  // Add new color stop to gradient
  const addColorStop = () => {
    if (!config.gradient) return;
    
    const stops = [...config.gradient.stops];
    const lastStop = stops[stops.length - 1];
    
    // Calculate a reasonable position for the new stop
    let newPosition = 50;
    if (stops.length >= 2) {
      const positions = stops.map(s => s.position).sort((a, b) => a - b);
      // Find the largest gap between stops
      let maxGap = 0;
      let posAfterGap = 100;
      
      for (let i = 1; i < positions.length; i++) {
        const gap = positions[i] - positions[i-1];
        if (gap > maxGap) {
          maxGap = gap;
          posAfterGap = positions[i];
        }
      }
      
      newPosition = posAfterGap - (maxGap / 2);
    }
    
    // Add new stop with the color from the last stop
    stops.push({
      color: lastStop?.color || '#888888',
      position: Math.round(newPosition)
    });
    
    // Sort by position
    stops.sort((a, b) => a.position - b.position);
    
    handleConfigChange({
      ...config,
      gradient: {
        ...config.gradient,
        stops
      }
    });
  };

  // Remove a color stop from gradient
  const removeColorStop = (index: number) => {
    if (!config.gradient || config.gradient.stops.length <= 2) return;
    
    const stops = config.gradient.stops.filter((_, i) => i !== index);
    
    handleConfigChange({
      ...config,
      gradient: {
        ...config.gradient,
        stops
      }
    });
  };

  // Update a specific color stop
  const updateColorStop = (index: number, key: 'color' | 'position', value: string | number) => {
    if (!config.gradient) return;
    
    const stops = [...config.gradient.stops];
    stops[index] = {
      ...stops[index],
      [key]: value
    };
    
    handleConfigChange({
      ...config,
      gradient: {
        ...config.gradient,
        stops
      }
    });
  };

  // Switch between gradient types
  const handleGradientTypeChange = (type: GradientType) => {
    const defaultGradient = type === 'linear' ? DEFAULT_LINEAR_GRADIENT : DEFAULT_RADIAL_GRADIENT;
    
    const newGradient: GradientConfig = {
      type: type,
      direction: config.gradient?.direction || defaultGradient.direction,
      stops: config.gradient?.stops || defaultGradient.stops
    };
    
    handleConfigChange({
      ...config,
      type: 'gradient',
      gradient: newGradient
    });
  };

  // Switch between solid and gradient
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'solid') {
      handleConfigChange({
        type: 'solid',
        color: config.color
      });
    } else {
      // If switching to gradient, initialize with default linear gradient
      handleConfigChange({
        type: 'gradient',
        color: config.color,
        gradient: config.gradient || DEFAULT_LINEAR_GRADIENT
      });
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            id={id}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded border overflow-hidden" 
                style={{ background: value }}
              />
              <span className="text-sm truncate max-w-[180px]">{value}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="solid">Solid Color</TabsTrigger>
                <TabsTrigger value="gradient">Gradient</TabsTrigger>
              </TabsList>
              
              <TabsContent value="solid" className="space-y-4">
                {/* Solid Color Picker */}
                <div>
                  <Label htmlFor="solid-color">Color</Label>
                  <div className="flex gap-2 mt-1">
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: config.color }}
                    />
                    <Input
                      id="solid-color"
                      type="text"
                      value={config.color}
                      onChange={(e) => handleConfigChange({ ...config, color: e.target.value })}
                      placeholder="#FFFFFF or rgba(255,255,255,1)"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                {/* Color Presets */}
                <div className="space-y-2">
                  <Label>Presets</Label>
                  <div className="grid grid-cols-8 gap-1 mt-1">
                    {PRESET_COLORS.map((color, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-6 h-6 rounded border relative ${color === 'transparent' ? 'bg-transparent' : ''}`}
                        style={{ 
                          backgroundColor: color !== 'transparent' ? color : undefined,
                          backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
                          backgroundSize: color === 'transparent' ? '8px 8px' : undefined,
                          backgroundPosition: color === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0' : undefined
                        }}
                        onClick={() => handleConfigChange({ ...config, color: color, type: 'solid' })}
                        aria-label={`Select color: ${color}`}
                      >
                        {config.color === color && (
                          <Check className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white stroke-black stroke-[3px] z-10" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gradient" className="space-y-4">
                {/* Gradient Type Selection */}
                <div>
                  <Label htmlFor="gradient-type">Gradient Type</Label>
                  <Select
                    value={config.gradient?.type || 'linear'}
                    onValueChange={(value) => handleGradientTypeChange(value as GradientType)}
                  >
                    <SelectTrigger id="gradient-type" className="mt-1">
                      <SelectValue placeholder="Select gradient type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Gradient Direction (for linear gradients) */}
                {config.gradient?.type === 'linear' && (
                  <div>
                    <Label htmlFor="gradient-direction">Direction</Label>
                    <Select
                      value={config.gradient.direction}
                      onValueChange={(value) => handleConfigChange({
                        ...config,
                        gradient: config.gradient ? {
                          type: config.gradient.type,
                          direction: value as GradientDirection,
                          stops: config.gradient.stops
                        } : DEFAULT_LINEAR_GRADIENT
                      })}
                    >
                      <SelectTrigger id="gradient-direction" className="mt-1">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to top">To Top</SelectItem>
                        <SelectItem value="to top right">To Top Right</SelectItem>
                        <SelectItem value="to right">To Right</SelectItem>
                        <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                        <SelectItem value="to bottom">To Bottom</SelectItem>
                        <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                        <SelectItem value="to left">To Left</SelectItem>
                        <SelectItem value="to top left">To Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Gradient Preview */}
                <div>
                  <Label>Preview</Label>
                  <div 
                    className="h-12 rounded border mt-1"
                    style={{ background: backgroundConfigToCss(config) }}
                  />
                </div>
                
                {/* Color Stops */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Color Stops</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addColorStop}
                    >
                      Add Stop
                    </Button>
                  </div>
                  
                  {config.gradient?.stops.map((stop, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div 
                        className="w-8 h-8 rounded border flex-shrink-0"
                        style={{ backgroundColor: stop.color }}
                      />
                      <div className="flex-1 space-y-1">
                        <Input
                          type="text"
                          value={stop.color}
                          onChange={(e) => updateColorStop(index, 'color', e.target.value)}
                          placeholder="#FFFFFF"
                          className="w-full"
                        />
                        <div className="flex gap-2 items-center">
                          <Slider
                            value={[stop.position]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => updateColorStop(index, 'position', value[0])}
                          />
                          <span className="text-xs w-8 text-right">{stop.position}%</span>
                        </div>
                      </div>
                      {(config.gradient?.stops?.length || 0) > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColorStop(index)}
                          className="h-8 w-8 p-0"
                        >
                          &times;
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker; 
