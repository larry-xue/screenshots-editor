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
  zIndex: number;
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
