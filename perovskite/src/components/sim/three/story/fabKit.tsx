/**
 * Shared pieces of the Chapter 4 scenes: palette, small solid shapes, a procedural grain texture,
 * the cross-section "callout" block and a few gauges. Everything here is lightweight geometry.
 */
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef, type ReactNode, type Ref } from "react";
import * as THREE from "three";
import { useSim } from "@/lib/sim/store";
import { Lattice, buildAtoms, type Atom, type AtomOut } from "./storyKit";
import { hash1, lerp, type V3 } from "./world";

export const PAL = {
  ink: "#e3b448",
  drying: "#8c4f23",
  dark: "#241a30",
  grainA: "#7a5688",
  grainB: "#2f2139",
  glass: "#a9d3f0",
  steel: "#aeb8c4",
  steelDark: "#4a5560",
  bench: "#18202a",
  solvent: "#7ad7ff",
  pbi2: "#e8c53a",
  mai: "#3cba84",
  hot: "#ff6a1f",
  perov: "#3a2a66",
  perovHi: "#8d6cd6",
  pb: "#c5ccd6",
  sn: "#d2a36a",
  water: "#3fd9e8",
  good: "#8fd0a8",
  warn: "#e08a55",
};

const BOX = new THREE.BoxGeometry(1, 1, 1);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 40);
const CYL_LO = new THREE.CylinderGeometry(1, 1, 1, 16);
const SPH = new THREE.SphereGeometry(1, 20, 14);
const EDGES = new THREE.EdgesGeometry(BOX);

type Common = {
  p?: V3;
  /** Rotation in radians (x, y, z). */
  r?: V3;
  c?: string;
  o?: number;
  rough?: number;
  metal?: number;
  emis?: string;
  emisI?: number;
  /** Draw the box edges as thin lines (useful on glass). */
  edge?: string;
  vis?: boolean;
  order?: number;
  children?: ReactNode;
};

function Mat({ c = "#888", o = 1, rough = 0.55, metal = 0, emis, emisI = 0, matRef }: Common & { matRef?: Ref<THREE.MeshStandardMaterial> }) {
  return (
    <meshStandardMaterial
      ref={matRef}
      color={c}
      roughness={rough}
      metalness={metal}
      transparent={o < 1}
      opacity={o}
      depthWrite={o >= 0.98}
      emissive={emis ?? "#000000"}
      emissiveIntensity={emisI}
    />
  );
}

/** A box with its size `s` (x, y, z). */
export const Bx = forwardRef<THREE.Mesh, Common & { s?: V3; matRef?: Ref<THREE.MeshStandardMaterial> }>(function Bx(
  { p = [0, 0, 0], s = [1, 1, 1], r = [0, 0, 0], edge, vis = true, order, children, ...m },
  ref,
) {
  return (
    <mesh ref={ref} geometry={BOX} position={p} scale={s} rotation={r} visible={vis} renderOrder={order}>
      <Mat {...m} />
      {edge ? (
        <lineSegments geometry={EDGES}>
          <lineBasicMaterial color={edge} transparent opacity={0.55} />
        </lineSegments>
      ) : null}
      {children}
    </mesh>
  );
});

/** A cylinder with radius `rad` and height `h` (axis along y). */
export const Cy = forwardRef<
  THREE.Mesh,
  Common & { rad?: number; h?: number; radZ?: number; lo?: boolean; matRef?: Ref<THREE.MeshStandardMaterial> }
>(function Cy({ p = [0, 0, 0], rad = 0.5, radZ, h = 1, r = [0, 0, 0], vis = true, order, lo, children, ...m }, ref) {
  return (
    <mesh
      ref={ref}
      geometry={lo ? CYL_LO : CYL}
      position={p}
      scale={[rad, h, radZ ?? rad]}
      rotation={r}
      visible={vis}
      renderOrder={order}
    >
      <Mat {...m} />
      {children}
    </mesh>
  );
});

export const Sp = forwardRef<THREE.Mesh, Common & { rad?: number; matRef?: Ref<THREE.MeshStandardMaterial> }>(function Sp(
  { p = [0, 0, 0], rad = 0.1, vis = true, order, children, ...m },
  ref,
) {
  return (
    <mesh ref={ref} geometry={SPH} position={p} scale={rad} visible={vis} renderOrder={order}>
      <Mat {...m} />
      {children}
    </mesh>
  );
});

/** A tilted or straight tube between two points. */
export function Tube({ a, b, rad = 0.04, c = PAL.steel, o = 1, metal = 0.5 }: { a: V3; b: V3; rad?: number; c?: string; o?: number; metal?: number }) {
  const g = useMemo(() => {
    const A = new THREE.Vector3(...a);
    const B = new THREE.Vector3(...b);
    const d = B.clone().sub(A);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    return { mid: A.clone().lerp(B, 0.5), len: Math.max(1e-3, d.length()), q };
  }, [a, b]);
  return (
    <mesh geometry={CYL_LO} position={g.mid} quaternion={g.q} scale={[rad, g.len, rad]}>
      <Mat c={c} o={o} metal={metal} rough={0.4} />
    </mesh>
  );
}

/** The bench every laboratory scene stands on. */
export function Bench({ y = -0.9, w = 7, d = 4.2 }: { y?: number; w?: number; d?: number }) {
  return <Bx p={[0, y - 0.06, 0]} s={[w, 0.12, d]} c={PAL.bench} rough={0.8} />;
}

/* ───────────────────────── grain texture ───────────────────────── */

/**
 * A top-down picture of polycrystalline grains: jittered cells with slightly different tones and thin dark
 * boundaries. Used as the "crystalline film" layer that fades in over the wet film.
 */
export function makeGrainTexture(seed: number, cells = 9, size = 192, a: string = PAL.grainA, b: string = PAL.grainB): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const pts: { x: number; y: number; k: number }[] = [];
  for (let j = 0; j < cells; j++)
    for (let i = 0; i < cells; i++)
      pts.push({ x: (i + 0.15 + 0.7 * hash1(seed + i * 3.1 + j * 7.7)) / cells, y: (j + 0.15 + 0.7 * hash1(seed + 11 + i * 5.3 + j * 2.9)) / cells, k: hash1(seed + 31 + i * 1.7 + j * 9.1) });
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  const col = new THREE.Color();
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const u = px / size;
      const v = py / size;
      let d1 = 9;
      let d2 = 9;
      let k = 0;
      const ci = Math.floor(u * cells);
      const cj = Math.floor(v * cells);
      for (let dj = -1; dj <= 1; dj++)
        for (let di = -1; di <= 1; di++) {
          const ii = (ci + di + cells) % cells;
          const jj = (cj + dj + cells) % cells;
          const q = pts[jj * cells + ii]!;
          const dx = Math.abs(u - (q.x + (ci + di - ii) / cells));
          const dy = Math.abs(v - (q.y + (cj + dj - jj) / cells));
          const d = Math.hypot(dx, dy);
          if (d < d1) {
            d2 = d1;
            d1 = d;
            k = q.k;
          } else if (d < d2) d2 = d;
        }
      const edge = Math.min(1, (d2 - d1) * cells * 7);
      col.copy(ca).lerp(cb, 0.25 + 0.6 * k);
      const f = 0.25 + 0.75 * edge;
      const o = (py * size + px) * 4;
      img.data[o] = Math.round(col.r * 255 * f);
      img.data[o + 1] = Math.round(col.g * 255 * f);
      img.data[o + 2] = Math.round(col.b * 255 * f);
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function useGrainTexture(seed = 3, cells = 9, a?: string, b?: string): THREE.CanvasTexture {
  const tex = useMemo(() => makeGrainTexture(seed, cells, 192, a, b), [seed, cells, a, b]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Colour of a film from its state: 0 wet ink → 1 dried → (with `cryst`) dark perovskite. */
const C_INK = new THREE.Color(PAL.ink);
const C_DRY = new THREE.Color(PAL.drying);
const C_DARK = new THREE.Color(PAL.dark);
export function filmColor(out: THREE.Color, dry: number, cryst: number): THREE.Color {
  return out.copy(C_INK).lerp(C_DRY, Math.min(1, dry)).lerp(C_DARK, Math.min(1, cryst));
}

/* ───────────────────────── cross-section callout ───────────────────────── */

export type SectionApi = {
  /** Heights (in model units) of the layers, from the bottom: substrate, then the stack. */
  film: { color: THREE.Color; h: number; cryst: number };
};

/**
 * A magnified, cut-away slice of a substrate with a film on top. It is a callout: drawn much larger than
 * the real thing, and always labelled "not to scale" by the lesson.
 */
export function SectionBlock({
  p = [0, 0, 0],
  w = 1.4,
  state,
  glassH = 0.5,
  d = 0.5,
  layers,
}: {
  p?: V3;
  w?: number;
  d?: number;
  glassH?: number;
  state: { current: { color: THREE.Color; h: number; cryst: number; show: number } };
  /** Extra static layers under the film (name is only for labels in the scene). */
  layers?: { h: number; c: string; o?: number }[];
}) {
  const grp = useRef<THREE.Group>(null);
  const film = useRef<THREE.Mesh>(null);
  const filmMat = useRef<THREE.MeshStandardMaterial>(null);
  const grains = useRef<THREE.Mesh>(null);
  const grainMat = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useGrainTexture(11, 7);
  const base = layers?.reduce((n, l) => n + l.h, 0) ?? 0;
  useFrame(() => {
    const s = state.current;
    if (grp.current) grp.current.scale.setScalar(Math.max(1e-4, s.show));
    if (film.current) {
      film.current.scale.set(w, Math.max(1e-4, s.h), d);
      film.current.position.y = glassH / 2 + base + s.h / 2;
    }
    filmMat.current?.color.copy(s.color);
    if (grains.current) {
      grains.current.position.set(0, glassH / 2 + base + s.h / 2, d / 2 + 0.002);
      grains.current.scale.set(w, Math.max(1e-4, s.h), 1);
    }
    if (grainMat.current) grainMat.current.opacity = s.cryst;
  });
  let y = glassH / 2;
  return (
    <group ref={grp} position={p}>
      <Bx s={[w, glassH, d]} c={PAL.glass} o={0.5} edge="#cfe9fb" />
      {(layers ?? []).map((l, i) => {
        const yy = y + l.h / 2;
        y += l.h;
        return <Bx key={i} p={[0, yy, 0]} s={[w, l.h, d]} c={l.c} o={l.o ?? 1} />;
      })}
      <mesh ref={film} geometry={BOX}>
        <meshStandardMaterial ref={filmMat} color={PAL.ink} roughness={0.35} transparent opacity={0.95} />
      </mesh>
      <mesh ref={grains}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={grainMat} map={tex} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── gauges ───────────────────────── */

/** A vertical conceptual gauge: a track with a marker at `value` (0 bottom → 1 top). */
export function VGauge({
  p = [0, 0, 0],
  h = 1.2,
  value,
  color = "#e4a23a",
}: {
  p?: V3;
  h?: number;
  value: { current: number };
  color?: string;
}) {
  const marker = useRef<THREE.Mesh>(null);
  const fill = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const v = Math.min(1, Math.max(0, value.current));
    if (marker.current) marker.current.position.y = -h / 2 + v * h;
    if (fill.current) {
      fill.current.scale.y = Math.max(1e-4, v * h);
      fill.current.position.y = -h / 2 + (v * h) / 2;
    }
  });
  return (
    <group position={p}>
      <Bx s={[0.07, h, 0.07]} c="#2c3946" />
      <mesh ref={fill} geometry={BOX} scale={[0.09, 1, 0.09]}>
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh ref={marker} geometry={SPH} scale={0.1}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── fab controls ───────────────────────── */

/** Reads one control value (slider 0..1 or segment string) without re-rendering the scene. */
export function useFab(): () => Record<string, number | string> {
  return () => useSim.getState().fab;
}

export const num = (f: Record<string, number | string>, k: string, d: number): number => {
  const v = f[k];
  return typeof v === "number" ? v : d;
};

export const smoothstepN = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export { lerp };

/* ───────────────────────── assembling lattice ───────────────────────── */

const OCT_D: V3[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

function bondGeometry(atoms: Atom[]): THREE.BufferGeometry {
  const byKey = new Map<string, Atom>();
  for (const a of atoms) if (a.kind === "X") byKey.set(`${a.h[0]},${a.h[1]},${a.h[2]}`, a);
  const pos: number[] = [];
  for (const b of atoms) {
    if (b.kind !== "B") continue;
    for (const d of OCT_D) {
      const x = byKey.get(`${b.h[0] + d[0]},${b.h[1] + d[1]},${b.h[2] + d[2]}`);
      if (x) pos.push(...b.p, ...x.p);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/**
 * An ABX₃ block whose ions fly in from random places while `asm` goes 0 → 1, then the bonds appear.
 * `style` may recolour single ions (for example Pb / Sn on the B-site).
 */
export function AssemblingLattice({
  n = [2, 2, 2],
  a = 0.3,
  asm,
  radii = { A: 0.075, B: 0.052, X: 0.042 },
  colors,
  style,
  spread = 0.8,
}: {
  n?: [number, number, number];
  a?: number;
  asm: { current: number };
  radii?: { A: number; B: number; X: number };
  colors?: { A: string; B: string; X: string };
  style?: (atom: Atom, out: AtomOut) => void;
  spread?: number;
}) {
  const atoms = useMemo(() => buildAtoms(n[0], n[1], n[2], a), [n, a]);
  const bonds = useMemo(() => bondGeometry(atoms), [atoms]);
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const offset = useMemo(
    () => (at: Atom): V3 | undefined => {
      const k = 1 - asm.current;
      if (k < 1e-3) return undefined;
      const e = k * k;
      return [
        (hash1(at.id * 1.7) - 0.5) * 2 * spread * e,
        (hash1(at.id * 2.9 + 4) - 0.5) * 2 * spread * e,
        (hash1(at.id * 4.1 + 9) - 0.5) * 2 * spread * e,
      ];
    },
    [asm, spread],
  );
  useFrame(() => {
    if (mat.current) mat.current.opacity = 0.5 * Math.max(0, (asm.current - 0.7) / 0.3);
  });
  return (
    <>
      <Lattice atoms={atoms} radii={radii} colors={colors} dynamic bonds={false} offset={offset} style={style} />
      <lineSegments geometry={bonds} frustumCulled={false}>
        <lineBasicMaterial ref={mat} color="#8f9bb0" transparent opacity={0} />
      </lineSegments>
    </>
  );
}
