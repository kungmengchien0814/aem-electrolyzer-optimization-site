import { modelMeta } from "../utils/aemModel";

export const parameterRanges = [
  { name: "流速", min: "0.0385", max: "0.2781", unit: "m/s" },
  { name: "X 長度", min: "22.18", max: "85.93", unit: "mm" },
  { name: "Y 寬度", min: "21.03", max: "86.76", unit: "mm" },
  { name: "Z 高度", min: "0.86", max: "2.14", unit: "mm" },
  { name: "孔隙率", min: "0.418", max: "0.768", unit: "0~1" },
  { name: "溫度", min: "41.4", max: "68.6", unit: "°C" }
];

export const outputRanges = [
  { name: "產氫效率", min: "54.65", max: "75.10", unit: "%" },
  { name: "壓降", min: "12.41", max: "65.27", unit: "kPa" }
];

export const evaluationMetrics = [
  { label: "資料筆數", value: modelMeta.evaluation.nSamples.toString(), detail: "訓練 160 / 測試 40" },
  { label: "產氫效率 MAE", value: modelMeta.evaluation.effMae.toFixed(2), detail: "%" },
  { label: "壓降 MAE", value: modelMeta.evaluation.pressMae.toFixed(2), detail: "kPa" },
  { label: "產氫效率 R²", value: modelMeta.evaluation.effR2.toFixed(3), detail: "待更多資料提升" },
  { label: "壓降 R²", value: modelMeta.evaluation.pressR2.toFixed(3), detail: "模型趨勢較穩定" }
];

export const optimizationSummary = {
  source: "public/data/optimization_best_result.csv",
  mea: "50 x 50 mm",
  activeArea: "2500 mm²",
  flow: "0.0820 m/s",
  zHeight: "1.61 mm",
  porosity: "0.7120",
  temperature: "54.20 °C",
  efficiency: "75.10 %",
  pressureDrop: "18.24 kPa"
};

export const comsolGallery = [
  {
    src: "/assets/comsol/pressure-gen2.png",
    title: "二代模型壓力分布",
    caption: "顯示流道與出口區域的壓力變化，用於觀察壓降趨勢。"
  },
  {
    src: "/assets/comsol/velocity-gen2.png",
    title: "二代模型速度分布",
    caption: "呈現入口流速進入流道後的速度分布與局部流動差異。"
  },
  {
    src: "/assets/comsol/h2-concentration-surface.png",
    title: "H2 濃度表面分布",
    caption: "用於評估氫氣在陰極側與出口附近的累積情形。"
  },
  {
    src: "/assets/comsol/h2-concentration-streamline.png",
    title: "H2 濃度與流線",
    caption: "結合濃度與流線觀察氫氣移除與流場方向。"
  },
  {
    src: "/assets/comsol/thermal-flow.png",
    title: "溫度與流體流動",
    caption: "呈現流體流動與熱分布的耦合結果。"
  },
  {
    src: "/assets/comsol/thermal-flow-2.png",
    title: "溫度與流體流動細部",
    caption: "補充不同視角或設定下的溫度與流場結果。"
  }
];
