import { MODEL_DATA } from "../data/modelData";

type NumericVector = number[];

export type PredictionInput = {
  flow: number;
  xLength: number;
  yWidth: number;
  zHeight: number;
  porosity: number;
  temperature: number;
};

export type PredictionResult = {
  efficiency: number;
  pressureDrop: number;
  rawEfficiency: number;
  rawPressureDrop: number;
};

export type OptimizationResult = PredictionResult & {
  fullX: NumericVector;
  objective: number;
  trust: string;
  intervals: Array<{ label: string; value: string }>;
};

const APP = MODEL_DATA as unknown as {
  model: {
    scalerMean: NumericVector;
    scalerScale: NumericVector;
    coefs: number[][][];
    intercepts: number[][];
  };
  context: {
    lower: NumericVector;
    upper: NumericVector;
    center: NumericVector;
    scale: NumericVector;
    targetEff: number;
    minReasonablePress: number;
    pressScale: number;
    paramTolerance: NumericVector;
    aspectRatioMin: number;
    aspectRatioMax: number;
    activeAreaMin: number;
    activeAreaMax: number;
  };
  evaluation: {
    nSamples: number;
    trainSamples: number;
    testSamples: number;
    effMae: number;
    pressMae: number;
    effR2: number;
    pressR2: number;
  };
  dataset: { rows: number };
};

export const modelMeta = {
  builtAt: MODEL_DATA.builtAt,
  evaluation: APP.evaluation,
  datasetRows: APP.dataset.rows,
  context: APP.context
};

export const modelNotice =
  "本平台結果為 AI 代理模型估算值，主要用於專題成果展示與參數趨勢參考，實際工程設計仍需搭配 COMSOL 模擬、實驗量測或更多資料驗證。";

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const fmt = (value: number, digits = 2) => Number(value).toFixed(digits);

function mulLayer(input: NumericVector, weights: number[][], bias: NumericVector, relu: boolean) {
  const output = new Array(bias.length);
  for (let j = 0; j < bias.length; j += 1) {
    let sum = bias[j];
    for (let i = 0; i < input.length; i += 1) {
      sum += input[i] * weights[i][j];
    }
    output[j] = relu ? Math.max(0, sum) : sum;
  }
  return output;
}

export function valuesFromInput(input: PredictionInput): NumericVector {
  return [
    input.flow,
    input.xLength,
    input.yWidth,
    input.zHeight,
    input.porosity,
    input.temperature
  ];
}

export function predict(values: NumericVector): NumericVector {
  const model = APP.model;
  let a = values.map((value, i) => (value - model.scalerMean[i]) / model.scalerScale[i]);
  for (let layer = 0; layer < model.coefs.length; layer += 1) {
    a = mulLayer(a, model.coefs[layer], model.intercepts[layer], layer < model.coefs.length - 1);
  }
  return a;
}

export function predictFromInput(input: PredictionInput): PredictionResult {
  const [rawEfficiency, rawPressureDrop] = predict(valuesFromInput(input));
  return {
    rawEfficiency,
    rawPressureDrop,
    efficiency: clamp(rawEfficiency, 0, 100),
    pressureDrop: Math.max(0, rawPressureDrop)
  };
}

export function score(fullX: NumericVector): number {
  const c = APP.context;
  const [effRaw, pressRaw] = predict(fullX);
  const effGap = Math.max(c.targetEff - effRaw, 0) / 100;
  const effOvershoot = Math.max(effRaw - 100, 0) / 100;
  const press = Math.max(pressRaw, 0);
  const realisticPress = Math.max(press, c.minReasonablePress);
  const pressGap = realisticPress / c.pressScale;
  const lowPressPenalty = Math.max(c.minReasonablePress - pressRaw, 0) / c.minReasonablePress;

  let edgePenalty = 0;
  let dataDistance = 0;
  for (let i = 0; i < fullX.length; i += 1) {
    const normalized = (fullX[i] - c.lower[i]) / (c.upper[i] - c.lower[i]);
    const edgeDistance = Math.min(normalized, 1 - normalized);
    edgePenalty += Math.max(0.08 - edgeDistance, 0);
    dataDistance += Math.abs((fullX[i] - c.center[i]) / c.scale[i]);
  }
  edgePenalty /= fullX.length;
  dataDistance /= fullX.length;

  const extrapolationPenalty = Math.max(dataDistance - 1.5, 0);
  const aspectRatio = fullX[1] / fullX[2];
  const aspectPenalty =
    Math.max(c.aspectRatioMin - aspectRatio, 0) / c.aspectRatioMin +
    Math.max(aspectRatio - c.aspectRatioMax, 0) / c.aspectRatioMax;
  const aspectBalancePenalty = Math.abs(Math.log(aspectRatio)) / Math.log(c.aspectRatioMax);
  const activeArea = fullX[1] * fullX[2];
  const areaPenalty =
    Math.max(c.activeAreaMin - activeArea, 0) / c.activeAreaMin +
    Math.max(activeArea - c.activeAreaMax, 0) / c.activeAreaMax;

  return (
    effGap +
    0.45 * pressGap +
    0.75 * effOvershoot +
    0.45 * edgePenalty +
    0.3 * extrapolationPenalty +
    2.5 * aspectPenalty +
    0.12 * aspectBalancePenalty +
    2.0 * areaPenalty +
    0.45 * lowPressPenalty
  );
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function validateGeometry(fixedX: number, fixedY: number) {
  const c = APP.context;
  const aspect = fixedX / fixedY;
  const area = fixedX * fixedY;
  if (aspect < c.aspectRatioMin || aspect > c.aspectRatioMax) {
    throw new Error(`MEA 長寬比需介於 ${c.aspectRatioMin} 到 ${c.aspectRatioMax}，目前為 ${fmt(aspect, 3)}。`);
  }
  if (area < c.activeAreaMin || area > c.activeAreaMax) {
    throw new Error(`活性面積需介於 ${fmt(c.activeAreaMin, 0)} 到 ${fmt(c.activeAreaMax, 0)} mm²，目前為 ${fmt(area, 0)} mm²。`);
  }
}

export function optimize(fixedX: number, fixedY: number): OptimizationResult {
  validateGeometry(fixedX, fixedY);
  const c = APP.context;
  const lower = [c.lower[0], c.lower[3], c.lower[4], c.lower[5]];
  const upper = [c.upper[0], c.upper[3], c.upper[4], c.upper[5]];
  const rand = seededRandom(42 + Math.round(fixedX * 10) * 17 + Math.round(fixedY * 10) * 31);
  const popSize = 120;
  let population = Array.from({ length: popSize }, () =>
    lower.map((lo, i) => lo + rand() * (upper[i] - lo))
  );

  for (let gen = 0; gen < 120; gen += 1) {
    const ranked = population
      .map((vars) => {
        const fullX = [vars[0], fixedX, fixedY, vars[1], vars[2], vars[3]];
        return { vars, value: score(fullX) };
      })
      .sort((a, b) => a.value - b.value);
    const elite = ranked.slice(0, 18).map((item) => item.vars);
    const next = elite.map((item) => item.slice());

    while (next.length < popSize) {
      const a = elite[Math.floor(rand() * elite.length)];
      const b = elite[Math.floor(rand() * elite.length)];
      const child = a.map((value, i) => {
        const mixed = rand() < 0.5 ? value : b[i];
        const span = upper[i] - lower[i];
        const mutation = (rand() - 0.5) * span * (0.22 * (1 - gen / 120) + 0.025);
        return clamp(mixed + mutation, lower[i], upper[i]);
      });
      next.push(child);
    }
    population = next;
  }

  const best = population
    .map((vars) => {
      const fullX = [vars[0], fixedX, fixedY, vars[1], vars[2], vars[3]];
      return { vars, fullX, value: score(fullX) };
    })
    .sort((a, b) => a.value - b.value)[0];

  const [rawEfficiency, rawPressureDrop] = predict(best.fullX);
  const pressureDrop = Math.max(c.minReasonablePress, rawPressureDrop);

  return {
    fullX: best.fullX,
    rawEfficiency,
    rawPressureDrop,
    efficiency: clamp(rawEfficiency, 0, 100),
    pressureDrop,
    objective: best.value,
    trust: trustLabel(best.fullX),
    intervals: intervals(best.fullX)
  };
}

function trustLabel(fullX: NumericVector) {
  const c = APP.context;
  const avgDistance =
    fullX.reduce((sum, value, i) => sum + Math.abs((value - c.center[i]) / c.scale[i]), 0) /
    fullX.length;
  if (avgDistance <= 1.15) return "資料可信度 高";
  if (avgDistance <= 1.7) return "資料可信度 中";
  return "資料可信度 偏低";
}

export function intervals(fullX: NumericVector) {
  const c = APP.context;
  const names = ["流速", "X 長度", "Y 寬度", "Z 高度", "孔隙率", "溫度"];
  const units = [" m/s", " mm", " mm", " mm", "", " °C"];
  const digits = [3, 2, 2, 2, 3, 1];
  return names.map((label, i) => {
    if (i === 1 || i === 2) {
      return { label, value: `固定 ${fmt(fullX[i], digits[i])}${units[i]}` };
    }
    const lo = Math.max(c.lower[i], fullX[i] - c.paramTolerance[i]);
    const hi = Math.min(c.upper[i], fullX[i] + c.paramTolerance[i]);
    return { label, value: `${fmt(lo, digits[i])} 到 ${fmt(hi, digits[i])}${units[i]}` };
  });
}
