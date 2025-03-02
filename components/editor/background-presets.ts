type BackgroundPreset = {
  name: string;
  value: string;
};

// 10套渐变背景预设
export const backgroundPresets: BackgroundPreset[] = [
  {
    name: "蓝紫渐变",
    value: "linear-gradient(to right, #4a00e0, #8e2de2)"
  },
  {
    name: "青橙渐变",
    value: "linear-gradient(to right, #00c6ff, #f06d06)"
  },
  {
    name: "粉红渐变",
    value: "linear-gradient(to right, #fc466b, #3f5efb)"
  },
  {
    name: "绿松渐变",
    value: "linear-gradient(to right, #11998e, #38ef7d)"
  },
  {
    name: "夕阳渐变",
    value: "linear-gradient(to right, #ff512f, #f09819)"
  },
  {
    name: "深海渐变",
    value: "linear-gradient(to right, #1a2980, #26d0ce)"
  },
  {
    name: "紫罗兰",
    value: "linear-gradient(to right, #834d9b, #d04ed6)"
  },
  {
    name: "黑金渐变",
    value: "linear-gradient(to right, #141e30, #f7b733)"
  },
  {
    name: "彩虹渐变",
    value: "linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)"
  },
  {
    name: "极光渐变",
    value: "radial-gradient(circle, #80d0c7 0%, #0093e9 100%)"
  }
];

export default backgroundPresets; 
