export interface BoxData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'image' | 'text';
  content: string;
  style: BoxStyle;
  imageSettings?: ImageSettings;
  shellSettings?: ShellSettings;
  zIndex: number;
}

// Tipos de shell/marco disponibles
export type ShellType = 'none' | 'browser' | 'phone' | 'tablet';

// Configuración para el shell/marco
export interface ShellSettings {
  type: ShellType;
  title?: string;
  showControls?: boolean;
  color?: string;
}

export interface ImageSettings {
  fit: 'cover' | 'contain' | 'original';
  width?: number;
  height?: number;
  scale?: number;
}

export interface BoxStyle {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  opacity: number;
  shadow: boolean;
  shadowColor?: string;
  hasBorder: boolean;
  hasBackground: boolean;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  textAlign?: string;
  padding?: string;
}

export interface CanvasSettings {
  width: number;
  height: number;
  background: string;
  exportScale: number;
  exportFormat: 'png' | 'jpeg';
  exportQuality: number;
  displayScale: number;
} 
