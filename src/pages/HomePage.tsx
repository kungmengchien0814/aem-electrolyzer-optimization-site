import { Gallery } from "../components/Gallery";
import { OptimizationTool } from "../components/OptimizationTool";
import { Section } from "../components/Section";
import {
  architectureSteps,
  customDomainSteps,
  deploymentSteps,
  keywords,
  navItems,
  reportSummary,
  researchCards,
  site,
  teamMembers
} from "../data/content";
import {
  evaluationMetrics,
  optimizationSummary,
  outputRanges,
  parameterRanges
} from "../data/results";

export function HomePage() {
  return (
    <>
      <header className="site-header">
        <a href="#home" className="brand">
          <span>AEM</span>
          <strong>Optimization Platform</strong>
        </a>
        <nav aria-label="主要導覽">
          {navItems.map(([id, label]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-copy">
            <span className="eyebrow">AEM Electrolyzer Optimization Platform</span>
            <h1>{site.projectTitle}</h1>
            <p>{site.tagline}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#tool">
                開始使用最佳化工具
              </a>
              <a className="secondary-button" href="#data">
                查看研究成果
              </a>
            </div>
            <div className="keyword-row">
              {keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </div>
          <div className="hero-visual" aria-label="AEM 電解槽示意圖">
            <div className="stack-frame">
              <div className="plate cathode">陰極流道</div>
              <div className="plate porous">陰極多孔層</div>
              <div className="plate membrane">AEM 膜</div>
              <div className="plate porous">陽極多孔層</div>
              <div className="plate anode">陽極流道</div>
              <div className="flow-line flow-in">H2O</div>
              <div className="flow-line flow-out">H2</div>
            </div>
          </div>
        </section>

        <Section
          id="research"
          eyebrow="Research Background"
          title="研究背景"
          lead="本專題將 AEM 電解槽的流場、幾何與操作條件轉成可理解、可比較、可搜尋的設計問題。"
        >
          <div className="card-grid four">
            {researchCards.map((card) => (
              <article className="info-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
          <div className="explain-strip">
            <span>流速提升</span>
            <strong>改善氣體移除</strong>
            <span>但可能造成</span>
            <strong>壓降增加</strong>
            <span>因此需要多目標折衷</span>
          </div>
        </Section>

        <Section
          id="architecture"
          eyebrow="System Architecture"
          title="系統架構"
          lead="由 COMSOL 模擬結果建立資料，再以 MLP 代理模型和基因演算法支援快速參數搜尋。"
          tone="muted"
        >
          <div className="flow-steps">
            {architectureSteps.map((step, index) => (
              <div className="flow-step" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="tool"
          eyebrow="Optimization Tool"
          title="互動最佳化與預測工具"
          lead="固定 MEA 長寬後搜尋建議操作參數，或輸入完整參數進行產氫效率與壓降預測。"
        >
          <OptimizationTool />
        </Section>

        <Section
          id="comsol"
          eyebrow="COMSOL Results"
          title="COMSOL 模擬結果"
          lead="整理五層 AEMWE 幾何模型與流場、物種傳輸、壓力、速度、濃度與溫度等結果。"
          tone="muted"
        >
          <div className="model-layers">
            {["陰極流道", "陰極多孔層", "AEM 膜", "陽極多孔層", "陽極流道"].map((layer) => (
              <span key={layer}>{layer}</span>
            ))}
          </div>
          <div className="card-grid three">
            {["入口與出口邊界設定", "層流場與壓力分布", "H2 稀釋物種傳輸", "電流密度與電壓掃描", "入口流速與壓降關係", "入口流速與 H2 平均濃度關係"].map((item) => (
              <article className="info-card compact" key={item}>
                <h3>{item}</h3>
                <p>已整理為展示重點；若需放入完整表格或曲線，請後續補入對應 CSV 或圖片。</p>
              </article>
            ))}
          </div>
          <Gallery />
        </Section>

        <Section
          id="data"
          eyebrow="Data & Results"
          title="數據與模型評估"
          lead="以下數值來自既有手機展示版內嵌模型 metadata 與 CSV 檔案，未找到的資料以待補方式保留。"
        >
          <div className="metric-strip">
            {evaluationMetrics.map((metric) => (
              <div className="big-stat" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </div>
            ))}
          </div>
          <div className="data-columns">
            <DataTable title="輸入參數範圍" rows={parameterRanges} />
            <DataTable title="輸出結果範圍" rows={outputRanges} />
            <article className="summary-card">
              <h3>最佳化結果摘要</h3>
              {Object.entries(optimizationSummary).map(([key, value]) => (
                <div key={key}>
                  <span>{labelMap[key] ?? key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </article>
          </div>
        </Section>

        <Section
          id="report"
          eyebrow="Project Report"
          title="專題成果報告"
          lead="網站整理報告摘要、系統功能、使用對象與未來發展，方便老師、評審與同學快速掌握專題重點。"
          tone="muted"
        >
          <div className="report-layout">
            <div>
              {reportSummary.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <div className="card-grid three">
                {["系統功能：最佳化搜尋、參數預測、COMSOL 結果展示", "使用對象：老師、評審、同學、專題展來賓與潛在合作單位", "開發工具：COMSOL、Python、MLP、基因演算法、Vite React"].map((text) => (
                  <div className="info-card compact" key={text}>{text}</div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="deployment" eyebrow="Deployment" title="部署與使用" lead="本專案已整理成適合 GitHub 與 Cloudflare Pages 的靜態網站架構。">
          <div className="deployment-grid">
            <article className="info-card">
              <h3>Cloudflare Pages 設定</h3>
              <ul>
                {deploymentSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
            <article className="info-card">
              <h3>自訂網域設定</h3>
              <ul>
                {customDomainSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          </div>
        </Section>

        <Section id="about" eyebrow="About" title="關於團隊" lead="依專題封面資訊整理組長、組員與指導老師資料。">
          <div className="about-card team-card">
            <div className="team-topic">
              <span>專題題目</span>
              <strong>{site.projectTitle}</strong>
            </div>
            <div className="team-topic">
              <span>系所</span>
              <strong>{site.department}</strong>
            </div>
            <div className="team-list">
              {teamMembers.map((member) => (
                <article
                  key={member.studentId}
                  className={`team-member ${member.spacerBefore ? "spacer-before" : ""}`}
                >
                  <span>{member.role}</span>
                  <strong>
                    <span>{member.className}</span>
                    <span>{member.studentId}</span>
                    <span>{member.name}</span>
                  </strong>
                </article>
              ))}
            </div>
            <div className="team-topic">
              <span>指導老師</span>
              <strong>陳鵬仁</strong>
            </div>
          </div>
        </Section>
      </main>

      <footer className="site-footer">
        <strong>{site.projectTitle}</strong>
        <span>{site.department}</span>
        <span>GitHub + Cloudflare Pages：Vite / npm run build / dist</span>
      </footer>
    </>
  );
}

function DataTable({ title, rows }: { title: string; rows: Array<{ name: string; min: string; max: string; unit: string }> }) {
  return (
    <article className="summary-card">
      <h3>{title}</h3>
      {rows.map((row) => (
        <div key={row.name}>
          <span>{row.name}</span>
          <strong>
            {row.min} 到 {row.max} {row.unit}
          </strong>
        </div>
      ))}
    </article>
  );
}

const labelMap: Record<string, string> = {
  source: "資料來源",
  mea: "MEA 尺寸",
  activeArea: "活性面積",
  flow: "建議流速",
  zHeight: "Z 高度",
  porosity: "孔隙率",
  temperature: "溫度",
  efficiency: "預估產氫效率",
  pressureDrop: "合理化壓降"
};
