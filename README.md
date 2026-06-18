# AEM Electrolyzer Optimization Platform

正式專題展示網站：**應用機器學習與基因演算法進行電解槽幾何數據最佳化**。

本網站以 Vite + React + TypeScript 建立，整理 AEM 電解槽研究背景、COMSOL 模擬結果、MLP 代理模型、基因演算法最佳化工具、模型評估、專題報告摘要，以及 GitHub / Cloudflare Pages 部署說明。

## 本地執行

```bash
npm install
npm run dev
```

瀏覽器開啟 Vite 顯示的本地網址，通常是 `http://localhost:5173`。

## 建置

```bash
npm run build
```

建置輸出資料夾為 `dist`。

## GitHub 上傳方式

建議 repository 名稱：

```text
aem-electrolyzer-optimization-site
```

基本流程：

```bash
git init
git add .
git commit -m "建立 AEM 電解槽最佳化網站"
git branch -M main
git remote add origin https://github.com/<你的帳號>/aem-electrolyzer-optimization-site.git
git push -u origin main
```

如果要沿用原本的 `aem-mobile-demo`，請將 remote URL 改成該 repository。

## Cloudflare Pages 部署設定

在 Cloudflare Pages 建立專案並連接 GitHub repository：

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

更新網站流程：

```text
修改程式 -> push GitHub -> Cloudflare 自動部署 -> 網址維持不變
```

## 自訂網域設定提醒

1. 到 Cloudflare Pages 專案。
2. 進入 `Custom domains`。
3. 點選 `Add custom domain`。
4. 輸入要設定的網域或子網域。
5. 依 Cloudflare 指示新增或確認 DNS 記錄。
6. 等待 SSL 憑證生效。

## 如何更新資料與圖片

靜態資料位置：

- `src/data/content.ts`：網站文字、導覽、研究背景、部署說明。
- `src/data/results.ts`：模型評估、參數範圍、最佳化結果摘要、COMSOL 圖庫清單。
- `src/data/modelData.ts`：由原手機版 `aem_mobile_app.html` 抽出的模型權重與 metadata。
- `src/utils/aemModel.ts`：最佳化與預測核心邏輯。

公開檔案位置：

- `public/assets/comsol/`：COMSOL 結果圖。
- `public/data/`：CSV 原始資料與最佳化紀錄。

若要新增 COMSOL 圖片，請把圖片放到 `public/assets/comsol/`，再到 `src/data/results.ts` 的 `comsolGallery` 新增一筆資料。

## 目前已放入的資料

- `public/data/aem_geometry_data.csv`
- `public/data/optimization_best_result.csv`
- `public/data/flow_channel_cases.csv`
- 多張 COMSOL 壓力、速度、濃度、溫度結果圖。

## 待補資料

目前已移除網站中的報告下載區塊。若之後要展示完整報告，建議先整理成網站頁面內容，再放入對應的 React 區塊。

若有更多 CSV、XLSX 轉出的曲線資料，建議轉成 JSON 或 CSV 放入：

```text
public/data/
```

並同步更新 `src/data/results.ts`。

## 注意事項

本平台結果為 AI 代理模型估算值，主要用於專題成果展示與參數趨勢參考，實際工程設計仍需搭配 COMSOL 模擬、實驗量測或更多資料驗證。請勿將網站輸出直接取代正式實驗或工程驗證。
