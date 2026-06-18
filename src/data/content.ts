export const site = {
  title: "AEM Electrolyzer Optimization Platform",
  projectTitle: "應用機器學習與基因演算法進行電解槽幾何數據最佳化",
  tagline: "結合 COMSOL 模擬、機器學習與基因演算法的 AEM 電解槽設計輔助平台",
  author: "龔孟謙",
  department: "國立勤益科技大學 智慧自動化工程系",
  advisor: "陳鵬仁教授",
  repoName: "aem-electrolyzer-optimization-site"
};

export const teamMembers = [
  { role: "組長", className: "四智三丙", studentId: "3B261084", name: "龔孟謙" },
  { role: "組員", className: "四智三甲", studentId: "3B261122", name: "董聖潔", spacerBefore: true },
  { role: "組員", className: "四智三甲", studentId: "3B261016", name: "吳翊瑋" }
];

export const navItems = [
  ["home", "首頁"],
  ["research", "研究背景"],
  ["architecture", "系統架構"],
  ["tool", "最佳化工具"],
  ["comsol", "COMSOL 結果"],
  ["data", "數據結果"],
  ["report", "專題報告"],
  ["deployment", "部署使用"],
  ["about", "About"]
] as const;

export const keywords = [
  "AEMWE",
  "COMSOL",
  "Machine Learning",
  "Genetic Algorithm",
  "Hydrogen Production",
  "Pressure Drop"
];

export const researchCards = [
  {
    title: "氫能與綠氫",
    text: "水電解可使用再生能源產生氫氣，降低化石燃料依賴。AEM 電解槽兼具鹼性環境與膜式架構的優點，是具發展潛力的綠氫技術。"
  },
  {
    title: "AEM 電解槽價值",
    text: "AEMWE 透過陰離子交換膜分隔陰陽極，搭配流道與多孔層設計，使水、離子、氣體與熱量能在有限空間中穩定傳輸。"
  },
  {
    title: "為什麼需要最佳化",
    text: "提高入口流速可能改善氫氣移除，但也會增加壓降與泵浦負擔。幾何、孔隙率與溫度之間存在折衷，因此需要系統化搜尋。"
  },
  {
    title: "參數影響",
    text: "流速、MEA 長寬、Z 高度、孔隙率與溫度會共同影響產氫效率、壓力分布與濃度分布。本網站將這些關係整理成可操作的預測工具。"
  }
];

export const architectureSteps = [
  "建立幾何與操作參數資料",
  "使用 COMSOL 進行流場與物種傳輸模擬",
  "以 Python 整理資料庫與訓練資料",
  "建立 MLP 代理模型預測效率與壓降",
  "以基因演算法搜尋建議參數",
  "透過網頁互動展示結果與限制條件"
];

export const reportSummary = [
  "本專題以 AEM 電解槽幾何與操作參數為研究對象，整合 COMSOL 模擬、Python 資料處理、MLP 代理模型與基因演算法，建立可快速估算產氫效率與壓降的展示平台。",
  "網站核心功能包含固定 MEA 長寬後搜尋建議流速、Z 高度、孔隙率與溫度，也可由使用者輸入完整參數進行即時預測。"
];

export const deploymentSteps = [
  "將本專案 push 到 GitHub repository。",
  "到 Cloudflare Pages 建立新專案並連接 GitHub。",
  "Framework preset 選擇 Vite。",
  "Build command 設定 npm run build。",
  "Build output directory 設定 dist。",
  "Production branch 設定 main。",
  "之後更新流程為修改程式、push GitHub、Cloudflare 自動部署，公開網址維持不變。"
];

export const customDomainSteps = [
  "進入 Cloudflare Pages 專案。",
  "打開 Custom domains。",
  "按 Add custom domain。",
  "輸入要設定的網域或子網域。",
  "依 Cloudflare 指示新增或確認 DNS 記錄。",
  "等待 SSL 憑證生效後即可使用自訂網址。"
];
