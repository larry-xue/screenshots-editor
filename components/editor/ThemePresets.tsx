import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// 主题预设类型
export type ThemePreset = {
  name: string;
  background: string;
};

// 预设主题列表
export const themePresets: ThemePreset[] = [
  {
    name: "Tech Blue",
    background: "linear-gradient(135deg, #0f172a 0%, #1e40af 100%)",
  },
  {
    name: "Cyber Purple",
    background: "linear-gradient(135deg, #18181b 0%, #7e22ce 100%)",
  },
  {
    name: "Neon Future",
    background: "linear-gradient(135deg, #0f172a 0%, #059669 100%)",
  },
  {
    name: "Dark Glass",
    background: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(75, 85, 99, 0.9) 100%)",
  },
  {
    name: "Quantum Red",
    background: "linear-gradient(135deg, #18181b 0%, #b91c1c 100%)",
  },
  {
    name: "Holographic",
    background: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 50%, #7dd3fc 100%)",
  },
  {
    name: "Carbon Dark",
    background: "#121212",
  },
  {
    name: "Clean Light",
    background: "#ffffff",
  },
];

interface ThemePresetsProps {
  onSelectTheme: (theme: ThemePreset) => void;
  currentBackground: string;
}

const ThemePresets: React.FC<ThemePresetsProps> = ({
  onSelectTheme,
  currentBackground,
}) => {
  // 查找当前背景对应的主题
  const getCurrentThemeName = () => {
    // 简化背景字符串以便比较（移除空格和不必要的字符）
    const simplifyBackground = (bg: string) => {
      return bg.replace(/\s+/g, '').toLowerCase();
    };
    
    const simplifiedCurrent = simplifyBackground(currentBackground);
    
    // 查找匹配的主题
    const currentTheme = themePresets.find(theme => 
      simplifyBackground(theme.background) === simplifiedCurrent
    );
    
    return currentTheme ? currentTheme.name : "Custom";
  };

  // 处理主题选择
  const handleThemeSelect = (value: string) => {
    const selectedTheme = themePresets.find(theme => theme.name === value);
    if (selectedTheme) {
      onSelectTheme(selectedTheme);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">Theme Presets</h3>
      <div className="flex flex-col gap-2">
        <Select
          onValueChange={handleThemeSelect}
          value={getCurrentThemeName()}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            {themePresets.map((theme) => (
              <SelectItem key={theme.name} value={theme.name}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ background: theme.background }}
                  />
                  <span>{theme.name}</span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value="Custom">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 to-gray-500" />
                <span>Custom</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ThemePresets; 
