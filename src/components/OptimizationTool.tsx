import { useMemo, useState } from "react";
import {
  fmt,
  intervals,
  modelMeta,
  modelNotice,
  optimize,
  predictFromInput,
  type OptimizationResult,
  type PredictionInput,
  type PredictionResult
} from "../utils/aemModel";

type Mode = "optimize" | "predict";

const defaultPrediction: PredictionInput = {
  flow: 0.082,
  xLength: 50,
  yWidth: 50,
  zHeight: 1.61,
  porosity: 0.712,
  temperature: 54.2
};

export function OptimizationTool() {
  const [mode, setMode] = useState<Mode>("optimize");
  const [xLength, setXLength] = useState(50);
  const [yWidth, setYWidth] = useState(50);
  const [predictionInput, setPredictionInput] = useState(defaultPrediction);
  const [error, setError] = useState("");
  const [optimization, setOptimization] = useState<OptimizationResult | null>(() => optimize(50, 50));
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const activeResult = mode === "optimize" ? optimization : prediction;
  const rows = useMemo(() => {
    if (mode === "optimize" && optimization) return optimization.intervals;
    if (mode === "predict") return intervals(Object.values(predictionInput));
    return [];
  }, [mode, optimization, predictionInput]);

  function runOptimize() {
    setError("");
    try {
      const result = optimize(xLength, yWidth);
      setOptimization(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "最佳化失敗，請確認輸入數值。");
    }
  }

  function runPrediction() {
    setError("");
    setPrediction(predictFromInput(predictionInput));
  }

  function updatePrediction(field: keyof PredictionInput, value: number) {
    setPredictionInput((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="tool-shell">
      <div className="tool-controls">
        <div className="segmented" aria-label="工具模式">
          <button className={mode === "optimize" ? "active" : ""} onClick={() => setMode("optimize")} type="button">
            最佳化模式
          </button>
          <button className={mode === "predict" ? "active" : ""} onClick={() => setMode("predict")} type="button">
            預測模式
          </button>
        </div>

        {mode === "optimize" ? (
          <div className="form-panel">
            <div className="field-grid two">
              <NumberField label="MEA X 長度" unit="mm" value={xLength} step={0.1} onChange={setXLength} />
              <NumberField label="MEA Y 寬度" unit="mm" value={yWidth} step={0.1} onChange={setYWidth} />
            </div>
            <p className="hint">限制條件：長寬比 0.6 到 1.4，活性面積 2000 到 5000 mm²。</p>
            <button className="primary-button" type="button" onClick={runOptimize}>
              開始搜尋建議參數
            </button>
          </div>
        ) : (
          <div className="form-panel">
            <div className="field-grid three">
              <NumberField label="流速" unit="m/s" value={predictionInput.flow} step={0.001} onChange={(v) => updatePrediction("flow", v)} />
              <NumberField label="X 長度" unit="mm" value={predictionInput.xLength} step={0.1} onChange={(v) => updatePrediction("xLength", v)} />
              <NumberField label="Y 寬度" unit="mm" value={predictionInput.yWidth} step={0.1} onChange={(v) => updatePrediction("yWidth", v)} />
              <NumberField label="Z 高度" unit="mm" value={predictionInput.zHeight} step={0.01} onChange={(v) => updatePrediction("zHeight", v)} />
              <NumberField label="孔隙率" unit="0~1" value={predictionInput.porosity} step={0.001} onChange={(v) => updatePrediction("porosity", v)} />
              <NumberField label="溫度" unit="°C" value={predictionInput.temperature} step={0.1} onChange={(v) => updatePrediction("temperature", v)} />
            </div>
            <button className="primary-button" type="button" onClick={runPrediction}>
              預測產氫效率與壓降
            </button>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}
      </div>

      <div className="result-panel">
        <div className="result-topline">
          <span>{mode === "optimize" ? optimization?.trust ?? "等待輸入" : "AI 代理模型"}</span>
          <small>模型建立：{modelMeta.builtAt}</small>
        </div>
        <div className="metric-grid">
          <Metric label="預測產氫效率" value={activeResult ? fmt(activeResult.efficiency, 2) : "--"} unit="%" />
          <Metric label="預測系統壓降" value={activeResult ? fmt(activeResult.pressureDrop, 2) : "--"} unit="kPa" />
        </div>
        <div className="result-table">
          {rows.map((row) => (
            <div className="result-row" key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
        {mode === "predict" && (
          <div className="model-stats">
            <span>產氫效率 MAE {fmt(modelMeta.evaluation.effMae, 2)}%</span>
            <span>壓降 MAE {fmt(modelMeta.evaluation.pressMae, 2)} kPa</span>
            <span>效率 R² {fmt(modelMeta.evaluation.effR2, 3)}</span>
            <span>壓降 R² {fmt(modelMeta.evaluation.pressR2, 3)}</span>
          </div>
        )}
        <p className="notice">{modelNotice}</p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  unit,
  value,
  step,
  onChange
}: {
  label: string;
  unit: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="number-field">
      <span>{label}</span>
      <div>
        <input
          type="number"
          value={value}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <small>{unit}</small>
      </div>
    </label>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>
        {value}
        <small>{unit}</small>
      </strong>
    </div>
  );
}
