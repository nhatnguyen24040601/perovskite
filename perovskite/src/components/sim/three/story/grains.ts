/**
 * The grain structure of the perovskite film, shared by the five degradation scenes (3.8).
 *
 * The film is drawn as a honeycomb of hexagonal grains. The gaps between them are the grain
 * boundaries. Everything here is plain data computed once, so scenes stay pure functions of time.
 */
import { STACK, hash1, type V3 } from "./world";

/** Circumradius of one grain (centre to corner), looking down on the film. */
export const GRAIN_R = 0.3;
const W = Math.sqrt(3) * GRAIN_R;
const ROW = 1.5 * GRAIN_R;

export type Grain = { id: number; x: number; z: number; row: number };

export const GRAINS: Grain[] = [];
for (let r = 0; r < 5; r++) {
  const z = (r - 2) * ROW;
  const odd = r % 2 === 1;
  const half = odd ? 2 : 3;
  for (let k = odd ? -half - 1 : -half; k <= half; k++) {
    const x = (odd ? k + 0.5 : k) * W;
    if (Math.abs(x) + W / 2 > STACK.w / 2 + 0.02) continue;
    GRAINS.push({ id: GRAINS.length, x, z, row: r });
  }
}

export type Vert = { id: number; x: number; z: number };
export type Edge = {
  id: number;
  a: number;
  b: number;
  mx: number;
  mz: number;
  len: number;
  /** Rotation about the vertical axis that turns an x-aligned rod onto this edge. */
  ang: number;
};

const vkey = (x: number, z: number) => `${Math.round(x * 1000)},${Math.round(z * 1000)}`;
const vmap = new Map<string, number>();
export const VERTS: Vert[] = [];
export const EDGES: Edge[] = [];
const emap = new Map<string, number>();
/** vertex → [neighbour vertex, edge id][] */
export const ADJ: [number, number][][] = [];

function vert(x: number, z: number): number {
  const k = vkey(x, z);
  const hit = vmap.get(k);
  if (hit !== undefined) return hit;
  const id = VERTS.length;
  VERTS.push({ id, x, z });
  vmap.set(k, id);
  ADJ.push([]);
  return id;
}

/** The six corners of every grain, in order, so each grain knows its own outline. */
export const OUTLINE: number[][] = GRAINS.map((g) => {
  const ids: number[] = [];
  for (let k = 0; k < 6; k++) {
    const a = Math.PI / 2 - (k * Math.PI) / 3;
    ids.push(vert(g.x + GRAIN_R * Math.cos(a), g.z + GRAIN_R * Math.sin(a)));
  }
  return ids;
});

for (const ring of OUTLINE) {
  for (let k = 0; k < 6; k++) {
    const a = ring[k]!;
    const b = ring[(k + 1) % 6]!;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (emap.has(key)) continue;
    const va = VERTS[a]!;
    const vb = VERTS[b]!;
    const id = EDGES.length;
    EDGES.push({
      id,
      a,
      b,
      mx: (va.x + vb.x) / 2,
      mz: (va.z + vb.z) / 2,
      len: Math.hypot(vb.x - va.x, vb.z - va.z),
      ang: -Math.atan2(vb.z - va.z, vb.x - va.x),
    });
    emap.set(key, id);
    ADJ[a]!.push([b, id]);
    ADJ[b]!.push([a, id]);
  }
}

/** Shortest walk along grain boundaries from vertex `from` to vertex `to` (vertex ids, inclusive). */
export function walk(from: number, to: number): number[] {
  const prev = new Map<number, number>([[from, -1]]);
  const queue = [from];
  while (queue.length) {
    const v = queue.shift()!;
    if (v === to) break;
    for (const [n] of ADJ[v]!) {
      if (prev.has(n)) continue;
      prev.set(n, v);
      queue.push(n);
    }
  }
  const out: number[] = [];
  for (let v: number | undefined = to; v !== undefined && v !== -1; v = prev.get(v)) out.push(v);
  return out.reverse();
}

export function edgeBetween(a: number, b: number): number {
  const key = a < b ? `${a}-${b}` : `${b}-${a}`;
  return emap.get(key) ?? -1;
}

/**
 * The boundary the scenes zoom into: the vertical seam between two neighbouring grains on the front
 * row, so the cut-away lattice sits right at the front face of the film where the camera can see it.
 */
const FRONT = 4;
const left = GRAINS.find((g) => g.row === FRONT && Math.abs(g.x) < 1e-6)!;
const right = GRAINS.find((g) => g.row === FRONT && Math.abs(g.x - W) < 1e-6)!;
export const HOT = {
  grains: [left.id, right.id] as [number, number],
  x: (left.x + right.x) / 2,
  z: left.z,
  /** Corner of the seam that points to the camera (z up) and the one behind it. */
  front: vert(left.x + W / 2, left.z + GRAIN_R / 2),
  back: vert(left.x + W / 2, left.z - GRAIN_R / 2),
};

/** Top surface of the film, where the boundary network is drawn. */
export const SURFACE_Y = STACK.top;

export function hotEdgeId(): number {
  return edgeBetween(HOT.front, HOT.back);
}

/** Deterministic spread of start corners for things that arrive from above (water, oxygen). */
export function startVerts(n: number, seed: number): number[] {
  const out: number[] = [];
  const pool = VERTS.filter((v) => Math.abs(v.x) < 1.7 && Math.abs(v.z) < 1.0);
  for (let i = 0; i < n; i++) {
    const v = pool[Math.floor(hash1(seed + i * 3.7) * pool.length)]!;
    out.push(v.id);
  }
  return out;
}

export const vertPos = (id: number, y = SURFACE_Y): V3 => [VERTS[id]!.x, y, VERTS[id]!.z];
