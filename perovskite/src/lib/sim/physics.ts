/** Educational approximations faithful to the self-study notes. Not fitted SQ data. */

export type RGB = { r: number; g: number; b: number };

export function wavelengthRGB(nm: number): RGB {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 380) {
    r = 0.45;
    b = 1;
  } else if (nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else if (nm <= 780) {
    r = 1;
  } else {
    r = 0.55;
    g = 0.08;
    b = 0.08;
  }
  let f = 1;
  if (nm >= 380 && nm < 420) f = 0.35 + (0.65 * (nm - 380)) / 40;
  else if (nm > 700 && nm <= 780) f = 0.35 + (0.65 * (780 - nm)) / 80;
  else if (nm < 380 || nm > 780) f = 0.55;
  return { r: Math.max(0, r) * f, g: Math.max(0, g) * f, b: Math.max(0, b) * f };
}

export function wavelengthHex(nm: number): string {
  const c = wavelengthRGB(nm);
  const h = (n: number) =>
    Math.round(Math.min(255, Math.max(0, n * 255)))
      .toString(16)
      .padStart(2, "0");
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

export function photonEnergy(nm: number): number {
  return 1240 / nm;
}

export function pce(voc: number, jsc: number, ff: number): number {
  return (voc * jsc * ff) / 100;
}

/** J = Jsc * (1 - (V/Voc)^n), n chosen so the fill factor matches. */
export function exponentForFill(ff: number): number {
  const target = Math.min(0.92, Math.max(0.3, ff));
  let lo = 0.35;
  let hi = 48;
  for (let i = 0; i < 28; i++) {
    const n = (lo + hi) / 2;
    const x = (1 / (n + 1)) ** (1 / n);
    const est = x * (n / (n + 1));
    if (est < target) lo = n;
    else hi = n;
  }
  return (lo + hi) / 2;
}

export function ivCurve(voc: number, jsc: number, ff: number, samples = 48) {
  const n = exponentForFill(ff);
  const pts: { v: number; j: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const v = (voc * i) / samples;
    const j = jsc * (1 - (v / voc) ** n);
    pts.push({ v, j: Math.max(0, j) });
  }
  const x = (1 / (n + 1)) ** (1 / n);
  const vmp = x * voc;
  const jmp = jsc * (1 - x ** n);
  return { pts, vmp, jmp, n };
}

const SQ: [number, number][] = [
  [0.5, 10],
  [0.7, 19],
  [0.9, 27],
  [1.05, 31.5],
  [1.15, 33],
  [1.34, 33.7],
  [1.5, 31.8],
  [1.7, 28.2],
  [2.0, 22.5],
  [2.3, 16.5],
  [2.6, 11],
  [3.0, 6.5],
];

/** Illustrative single-junction detailed-balance shape. Peak fixed at 33.7%. */
export function sqEfficiency(eg: number): number {
  if (eg <= SQ[0][0]) return SQ[0][1];
  const last = SQ[SQ.length - 1];
  if (last && eg >= last[0]) return last[1];
  for (let i = 1; i < SQ.length; i++) {
    const right = SQ[i];
    const left = SQ[i - 1];
    if (!right || !left) continue;
    if (eg <= right[0]) {
      const t = (eg - left[0]) / (right[0] - left[0]);
      return left[1] + t * (right[1] - left[1]);
    }
  }
  return 33.7;
}

export const ION = {
  pb: 1.19,
  i: 2.2,
  cs: 1.88,
  ma: 2.17,
  fa: 2.53,
} as const;

export function tolerance(rA: number, rB = ION.pb, rX = ION.i): number {
  return (rA + rX) / (Math.SQRT2 * (rB + rX));
}

export function diffusionUm(tauNs: number, singleCrystal: boolean): number {
  const d = singleCrystal ? 0.8 : 0.05;
  return 1e4 * Math.sqrt(d * tauNs * 1e-9);
}

export function vocFromPlqy(plqy: number, vocRad = 1.32): number {
  const q = Math.min(1, Math.max(1e-8, plqy));
  return vocRad + 0.02585 * Math.log(q);
}

export function phaseFromTemp(tempC: number): {
  name: string;
  en: string;
  tilt: number;
  axes: 1 | 3 | 0;
  range: string;
} {
  if (tempC >= 54) {
    return {
      name: "Lập phương",
      en: "cubic",
      tilt: 0,
      axes: 0,
      range: "trên ≈ 54 °C",
    };
  }
  if (tempC >= -111) {
    return {
      name: "Tứ phương",
      en: "tetragonal",
      tilt: 0.34,
      axes: 1,
      range: "≈ −111 °C đến 54 °C",
    };
  }
  return {
    name: "Trực thoi",
    en: "orthorhombic",
    tilt: 0.58,
    axes: 3,
    range: "dưới ≈ −111 °C",
  };
}

export function egFromHalide(brPct: number, snPct: number): number {
  const halide = 1.57 + (2.3 - 1.57) * (brPct / 100);
  return halide - (halide - 1.22) * (snPct / 100) * 0.9;
}

export function egHex(eg: number): string {
  const t = Math.min(1, Math.max(0, (eg - 1.15) / 1.7));
  if (t < 0.35) {
    const u = t / 0.35;
    return mixHex("#2a2144", "#6d4bd6", u);
  }
  if (t < 0.7) {
    const u = (t - 0.35) / 0.35;
    return mixHex("#6d4bd6", "#e07a32", u);
  }
  const u = (t - 0.7) / 0.3;
  return mixHex("#e07a32", "#79b0ff", u);
}

function mixHex(a: string, b: string, t: number): string {
  const pa = hexRgb(a);
  const pb = hexRgb(b);
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(pa.r + (pb.r - pa.r) * t)}${h(pa.g + (pb.g - pa.g) * t)}${h(pa.b + (pb.b - pa.b) * t)}`;
}

function hexRgb(hex: string): { r: number; g: number; b: number } {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

export const WELL_EG: Record<number, number> = {
  1: 2.43,
  2: 2.17,
  3: 2.03,
  4: 1.91,
  99: 1.52,
};
