/** Shared maths and constants for the six story scenes (3.1 – 3.6). */
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix3 = (a: V3, b: V3, t: number): V3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
/** 0 before `a`, 1 after `b`, smooth in between. */
export const between = (t: number, a: number, b: number) => smooth((t - a) / Math.max(1e-6, b - a));

/** Deterministic noise in [0, 1) — scenes are pure functions of time, so Prev / Reset / Pause stay exact. */
export function hash1(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function pathLength(pts: readonly V3[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(
      pts[i]![0] - pts[i - 1]![0],
      pts[i]![1] - pts[i - 1]![1],
      pts[i]![2] - pts[i - 1]![2],
    );
  }
  return len;
}

/** Point at fraction `u` of the polyline length (constant speed). */
export function along(pts: readonly V3[], u: number, total = pathLength(pts)): V3 {
  if (pts.length === 1) return pts[0]!;
  let want = clamp01(u) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (want <= seg || i === pts.length - 1)
      return mix3(a, b, seg < 1e-6 ? 1 : Math.min(1, want / seg));
    want -= seg;
  }
  return pts[pts.length - 1]!;
}

/** Index of the polyline vertex that was last passed at fraction `u`. */
export function vertexAt(pts: readonly V3[], u: number, total = pathLength(pts)): number {
  let want = clamp01(u) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (want < seg) return i - 1;
    want -= seg;
  }
  return pts.length - 1;
}

/**
 * A wandering path from `a` to `b`: straight-ish overall, but with sideways jitter and
 * sharp kinks at the interior vertices (the "scattering events").
 */
export function wander(seed: number, a: V3, b: V3, steps: number, jitter: V3): V3[] {
  const pts: V3[] = [a];
  for (let k = 1; k < steps; k++) {
    const u = k / steps;
    const base = mix3(a, b, u);
    pts.push([
      base[0] + (hash1(seed * 13 + k * 3.1) - 0.5) * 2 * jitter[0],
      base[1] + (hash1(seed * 17 + k * 5.3) - 0.5) * 2 * jitter[1],
      base[2] + (hash1(seed * 19 + k * 7.7) - 0.5) * 2 * jitter[2],
    ]);
  }
  pts.push(b);
  return pts;
}

/** Colours shared by every story scene, so a particle looks the same in all six. */
export const COLOR = {
  electron: "#4da3ff",
  hole: "#ff5a47",
  photon: "#ffe27a",
  photonCore: "#fffbe8",
  A: "#3cba84",
  B: "#c5ccd6",
  iodide: "#7a56e0",
  bromide: "#e8892f",
  ink: "#e4a23a",
  good: "#8fd0a8",
  warn: "#ff8a4c",
  trap: "#ff3b4a",
  line: "#9fb2c6",
};

/** The simplified solar-cell stack: layer thickness and how far the model is exaggerated. */
export const STACK = {
  w: 4.0,
  d: 2.4,
  /** y of the top face of the perovskite layer, which never moves. */
  top: 0.25,
  thin: 0.5,
  thick: 1.7,
  glass: 0.4,
  etl: 0.22,
  htl: 0.22,
  electrode: 0.14,
};

export type LayerSpan = { y0: number; y1: number; mid: number; h: number };
export type StackSpans = Record<"glass" | "etl" | "perov" | "htl" | "elec", LayerSpan>;

const span = (y0: number, y1: number): LayerSpan => ({ y0, y1, mid: (y0 + y1) / 2, h: y1 - y0 });

export function stackSpans(slabH: number): StackSpans {
  const top = STACK.top;
  const bot = top - slabH;
  return {
    glass: span(top + STACK.etl, top + STACK.etl + STACK.glass),
    etl: span(top, top + STACK.etl),
    perov: span(bot, top),
    htl: span(bot - STACK.htl, bot),
    elec: span(bot - STACK.htl - STACK.electrode, bot - STACK.htl),
  };
}
