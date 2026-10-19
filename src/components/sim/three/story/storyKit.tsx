import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { getLesson } from "@/lib/sim/content";
import { storyOf } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { COLOR, STACK, along, hash1, pathLength, smooth, stackSpans, type V3 } from "./world";
import { L } from "@/lib/sim/story";

/* ───────────────────────── clock ───────────────────────── */

/** Animation speed while "Slow" or presentation mode is on. */
export const SLOW_FACTOR = 0.5;

export type StoryClock = { t: number; loop: number; step: number };

/**
 * Local time of the current step. It runs only while Play is on, slows down in Slow / presentation mode,
 * restarts when the step changes, and loops after a short hold. With Auto-step on it moves to the next step.
 */
export function useStoryClock(step: number, dur: number, hold = 2): MutableRefObject<StoryClock> {
  const clock = useRef<StoryClock>({ t: 0, loop: 0, step });
  useFrame((_, dtRaw) => {
    const c = clock.current;
    if (c.step !== step) {
      c.step = step;
      c.t = 0;
      c.loop = 0;
    }
    const s = useSim.getState();
    // Dev only: lets the browser tests pin a scene to an exact moment (window.__storyT = seconds).
    const pinned = import.meta.env.DEV
      ? (window as unknown as { __storyT?: number }).__storyT
      : undefined;
    if (pinned !== undefined) {
      c.t = pinned;
      return;
    }
    if (!s.playing) return;
    c.t += Math.min(dtRaw, 0.05) * (s.slow || s.presenting ? SLOW_FACTOR : 1);
    const cycle = dur + hold;
    if (c.t < cycle) return;
    const last = getLesson(s.lessonId).steps.length - 1;
    if (s.auto && step < last) {
      c.t = cycle - 1e-3;
      s.next();
    } else {
      c.t -= cycle;
      c.loop += 1;
    }
  });
  return clock;
}

/**
 * True while `when()` holds. Html labels ignore the `visible` flag of their parent, so labels that
 * appear and disappear with the animation are mounted and unmounted through this gate instead.
 */
export function useGate(when: () => boolean): boolean {
  const [on, setOn] = useState(false);
  const last = useRef(false);
  useFrame(() => {
    const v = when();
    if (v !== last.current) {
      last.current = v;
      setOn(v);
    }
  });
  return on;
}

/** Duration of a step as written in the story data. */
export function stepDur(id: string, step: number): number {
  return storyOf(id)?.steps[step]?.dur ?? 6;
}

/* ───────────────────────── labels ───────────────────────── */

export { StoryTag } from "./labels";
export type { TagKind } from "./labels";
import { StoryTag } from "./labels";

/* ───────────────────────── particles ───────────────────────── */

const SPH = new THREE.SphereGeometry(1, 16, 12);
const SPH_LO = new THREE.SphereGeometry(1, 10, 8);

export type SwarmApi = {
  set: (i: number, x: number, y: number, z: number, s?: number) => void;
  hide: (i: number) => void;
  /** Give one particle its own colour (the swarm must be `basic`). */
  tint: (i: number, color: string) => void;
  flush: () => void;
};

/** A pool of glowing spheres drawn with two instanced meshes (core + soft halo). */
export const Swarm = forwardRef<
  SwarmApi,
  {
    count: number;
    color: string;
    radius?: number;
    halo?: number;
    haloOpacity?: number;
    emissive?: number;
    /** Unlit core, so every instance can carry its own colour with `tint`. */
    basic?: boolean;
  }
>(function Swarm(
  { count, color, radius = 0.07, halo = 2.0, haloOpacity = 0.17, emissive = 1.3, basic = false },
  ref,
) {
  const core = useRef<THREE.InstancedMesh>(null);
  const glow = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const api = useMemo<SwarmApi>(
    () => ({
      set(i, x, y, z, s = 1) {
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(Math.max(1e-4, radius * s));
        dummy.updateMatrix();
        core.current?.setMatrixAt(i, dummy.matrix);
        dummy.scale.setScalar(Math.max(1e-4, radius * s * halo));
        dummy.updateMatrix();
        glow.current?.setMatrixAt(i, dummy.matrix);
      },
      hide(i) {
        dummy.position.set(0, -60, 0);
        dummy.scale.setScalar(1e-4);
        dummy.updateMatrix();
        core.current?.setMatrixAt(i, dummy.matrix);
        glow.current?.setMatrixAt(i, dummy.matrix);
      },
      tint(i, c) {
        tmpColor.set(c);
        core.current?.setColorAt(i, tmpColor);
        glow.current?.setColorAt(i, tmpColor);
      },
      flush() {
        if (core.current) {
          core.current.instanceMatrix.needsUpdate = true;
          if (core.current.instanceColor) core.current.instanceColor.needsUpdate = true;
        }
        if (glow.current) {
          glow.current.instanceMatrix.needsUpdate = true;
          if (glow.current.instanceColor) glow.current.instanceColor.needsUpdate = true;
        }
      },
    }),
    [dummy, radius, halo, tmpColor],
  );
  useImperativeHandle(ref, () => api, [api]);
  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) api.hide(i);
    api.flush();
  }, [api, count]);
  return (
    <>
      <instancedMesh
        key={`c${count}`}
        ref={core}
        args={[SPH, undefined, count]}
        frustumCulled={false}
      >
        {basic ? (
          <meshBasicMaterial color={basic ? "#ffffff" : color} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={emissive}
            roughness={0.3}
          />
        )}
      </instancedMesh>
      <instancedMesh
        key={`g${count}`}
        ref={glow}
        args={[SPH_LO, undefined, count]}
        frustumCulled={false}
        renderOrder={6}
      >
        <meshBasicMaterial
          color={basic ? "#ffffff" : color}
          transparent
          opacity={haloOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  );
});

export type FlashApi = {
  set: (i: number, x: number, y: number, z: number, radius: number, alpha: number) => void;
  hide: (i: number) => void;
  flush: () => void;
};

/** Expanding, fading bursts: the "flash" when a photon is absorbed, a charge scatters or recombines. */
export const Flashes = forwardRef<FlashApi, { count: number; color: string }>(function Flashes(
  { count, color },
  ref,
) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tint = useMemo(() => new THREE.Color(color), [color]);
  const tmp = useMemo(() => new THREE.Color(), []);
  const api = useMemo<FlashApi>(
    () => ({
      set(i, x, y, z, radius, alpha) {
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(Math.max(1e-4, radius));
        dummy.updateMatrix();
        mesh.current?.setMatrixAt(i, dummy.matrix);
        tmp.copy(tint).multiplyScalar(Math.max(0, alpha));
        mesh.current?.setColorAt(i, tmp);
      },
      hide(i) {
        dummy.position.set(0, -60, 0);
        dummy.scale.setScalar(1e-4);
        dummy.updateMatrix();
        mesh.current?.setMatrixAt(i, dummy.matrix);
        tmp.setRGB(0, 0, 0);
        mesh.current?.setColorAt(i, tmp);
      },
      flush() {
        if (!mesh.current) return;
        mesh.current.instanceMatrix.needsUpdate = true;
        if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
      },
    }),
    [dummy, tint, tmp],
  );
  useImperativeHandle(ref, () => api, [api]);
  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) api.hide(i);
    api.flush();
  }, [api, count]);
  return (
    <instancedMesh
      key={count}
      ref={mesh}
      args={[SPH_LO, undefined, count]}
      frustumCulled={false}
      renderOrder={7}
    >
      <meshBasicMaterial
        color="#ffffff"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
});

/** Radius and strength of a burst that started at `t0`, evaluated at `t`. Returns null outside its life. */
export function burst(
  t: number,
  t0: number,
  life = 0.7,
  maxR = 0.28,
): { r: number; a: number } | null {
  const k = (t - t0) / life;
  if (k < 0 || k > 1) return null;
  return { r: 0.04 + maxR * (1 - (1 - k) ** 2), a: (1 - k) * 0.55 };
}

/* ───────────────────────── beams & arrows ───────────────────────── */

const UNIT_CYL = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true);

export type BeamOut = { x: number; z: number; y0: number; y1: number; alpha: number };

/** Vertical light rays, one per lane. `update` fills the lane each frame. */
export function BeamSet({
  count,
  color = COLOR.photon,
  radius = 0.012,
  update,
}: {
  count: number;
  color?: string;
  radius?: number;
  update: (i: number, out: BeamOut) => void;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const out = useMemo<BeamOut>(() => ({ x: 0, z: 0, y0: 0, y1: 0, alpha: 1 }), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const base = useMemo(() => new THREE.Color(color), [color]);
  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < count; i++) {
      out.alpha = 1;
      update(i, out);
      const len = Math.max(1e-4, out.y0 - out.y1);
      dummy.position.set(out.x, (out.y0 + out.y1) / 2, out.z);
      dummy.scale.set(radius, len, radius);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      tmp.copy(base).multiplyScalar(Math.max(0, out.alpha));
      m.setColorAt(i, tmp);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={mesh}
      args={[UNIT_CYL, undefined, count]}
      frustumCulled={false}
      renderOrder={3}
    >
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

/** A direction arrow from `a` to `b`. `pulse` makes it breathe so the direction reads as movement. */
export function Arrow3({
  a,
  b,
  color = "#e4a23a",
  radius = 0.018,
  head = 0.09,
  pulse = true,
  opacity = 0.9,
}: {
  a: V3;
  b: V3;
  color?: string;
  radius?: number;
  head?: number;
  pulse?: boolean;
  opacity?: number;
}) {
  const grp = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const A = new THREE.Vector3(...a);
    const B = new THREE.Vector3(...b);
    const dir = B.clone().sub(A);
    const len = Math.max(0.001, dir.length());
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    const headLen = Math.min(len * 0.45, head * 1.8);
    return { A, len, q, headLen };
  }, [a, b, head]);
  useFrame(({ clock }) => {
    if (!grp.current || !pulse) return;
    const k = 0.9 + Math.sin(clock.elapsedTime * 5) * 0.12;
    grp.current.scale.set(k, 1, k);
  });
  return (
    <group position={geo.A} quaternion={geo.q}>
      <group ref={grp}>
        <mesh position={[0, (geo.len - geo.headLen) / 2, 0]}>
          <cylinderGeometry args={[radius, radius, geo.len - geo.headLen, 8]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
        </mesh>
        <mesh position={[0, geo.len - geo.headLen / 2, 0]}>
          <coneGeometry args={[head, geo.headLen, 12]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

/** A straight line between two points (a thin cylinder, so it stays visible at any zoom). */
export function Rod({
  a,
  b,
  color = COLOR.line,
  radius = 0.008,
  opacity = 0.8,
}: {
  a: V3;
  b: V3;
  color?: string;
  radius?: number;
  opacity?: number;
}) {
  const geo = useMemo(() => {
    const A = new THREE.Vector3(...a);
    const B = new THREE.Vector3(...b);
    const dir = B.clone().sub(A);
    const len = Math.max(0.001, dir.length());
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return { mid: A.clone().lerp(B, 0.5), len, q };
  }, [a, b]);
  return (
    <mesh position={geo.mid} quaternion={geo.q}>
      <cylinderGeometry args={[radius, radius, geo.len, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

/* ───────────────────────── solar-cell stack ───────────────────────── */

/** Mutable values the scene writes every frame and the stack reads (no React re-render). */
export type CellState = {
  /** Thickness of the perovskite layer. */
  h: number;
  /** 0 = perovskite colour, 1 = the grey "weaker absorber". */
  thick: number;
  /** Glow of the electron transport layer, the hole transport layer and the absorber. */
  etl: number;
  htl: number;
  perov: number;
};

export function makeCellState(h: number = STACK.thin): CellState {
  return { h, thick: 0, etl: 0, htl: 0, perov: 0 };
}

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const UNIT_EDGES = new THREE.EdgesGeometry(UNIT_BOX);

type LayerKey = "glass" | "etl" | "perov" | "htl" | "elec";

const LAYER_STYLE: Record<
  LayerKey,
  { color: string; opacity: number; edge: string; metal?: boolean }
> = {
  glass: { color: "#a9d3f0", opacity: 0.16, edge: "#b9dcf5" },
  etl: { color: "#4d86d6", opacity: 0.5, edge: "#7fb0f0" },
  perov: { color: "#3a2a66", opacity: 0.3, edge: "#e4a23a" },
  htl: { color: "#c46a45", opacity: 0.5, edge: "#f0956d" },
  elec: { color: "#d7dde6", opacity: 0.92, edge: "#ffffff", metal: true },
};

const LAYER_NAME: Record<LayerKey, string> = {
  glass: "Kính",
  etl: "Lớp truyền điện tử (ETL)",
  perov: "Lớp hấp thụ perovskite",
  htl: "Lớp truyền lỗ trống (HTL)",
  elec: "Điện cực kim loại",
};

/** Vertical nudge so the five layer names never overlap on screen. */
const LABEL_DY: Record<LayerKey, number> = {
  glass: 0.16,
  etl: 0.06,
  perov: 0,
  htl: -0.1,
  elec: -0.32,
};

const THIN_PEROV = new THREE.Color(LAYER_STYLE.perov.color);
const THICK_PEROV = new THREE.Color("#5b6f7d");

export function CellStack({
  state,
  layerLabels = false,
  lattice,
  dim = 1,
}: {
  state: CellState;
  layerLabels?: boolean;
  /** Drawn at the centre of the thin perovskite layer, hidden while the layer is thick. */
  lattice?: ReactNode;
  dim?: number;
}) {
  const refs = {
    glass: useRef<THREE.Group>(null),
    etl: useRef<THREE.Group>(null),
    perov: useRef<THREE.Group>(null),
    htl: useRef<THREE.Group>(null),
    elec: useRef<THREE.Group>(null),
  };
  const inner = {
    glass: useRef<THREE.Group>(null),
    etl: useRef<THREE.Group>(null),
    perov: useRef<THREE.Group>(null),
    htl: useRef<THREE.Group>(null),
    elec: useRef<THREE.Group>(null),
  };
  const mats = {
    glass: useRef<THREE.MeshStandardMaterial>(null),
    etl: useRef<THREE.MeshStandardMaterial>(null),
    perov: useRef<THREE.MeshStandardMaterial>(null),
    htl: useRef<THREE.MeshStandardMaterial>(null),
    elec: useRef<THREE.MeshStandardMaterial>(null),
  };
  const latticeGroup = useRef<THREE.Group>(null);
  const keys: LayerKey[] = ["glass", "etl", "perov", "htl", "elec"];

  useFrame(() => {
    const sp = stackSpans(state.h);
    for (const k of keys) {
      const s = k === "perov" ? sp.perov : sp[k];
      refs[k].current?.position.set(0, s.mid, 0);
      inner[k].current?.scale.set(STACK.w, s.h, STACK.d);
    }
    const m = mats;
    if (m.perov.current) {
      m.perov.current.color.copy(THIN_PEROV).lerp(THICK_PEROV, state.thick);
      m.perov.current.emissive.copy(THIN_PEROV).lerp(THICK_PEROV, state.thick);
      m.perov.current.emissiveIntensity = 0.1 + state.perov * 0.6;
      m.perov.current.opacity = (0.3 + state.thick * 0.26) * dim;
    }
    if (m.etl.current) {
      m.etl.current.emissiveIntensity = 0.12 + state.etl * 1.4;
      m.etl.current.opacity = Math.min(0.9, (0.5 + state.etl * 0.25) * dim);
    }
    if (m.htl.current) {
      m.htl.current.emissiveIntensity = 0.12 + state.htl * 1.4;
      m.htl.current.opacity = Math.min(0.9, (0.5 + state.htl * 0.25) * dim);
    }
    if (latticeGroup.current) {
      latticeGroup.current.visible = state.h < 0.9;
      latticeGroup.current.position.y = sp.perov.mid;
    }
  });

  return (
    <group>
      {keys.map((k) => {
        const st = LAYER_STYLE[k];
        return (
          <group key={k} ref={refs[k]}>
            <group ref={inner[k]}>
              <mesh geometry={UNIT_BOX} renderOrder={k === "glass" ? 2 : 1}>
                <meshStandardMaterial
                  ref={mats[k]}
                  color={st.color}
                  emissive={st.color}
                  emissiveIntensity={0.12}
                  transparent
                  opacity={st.opacity}
                  roughness={st.metal ? 0.3 : 0.45}
                  metalness={st.metal ? 0.6 : 0.1}
                  depthWrite={k === "elec"}
                />
              </mesh>
              <lineSegments geometry={UNIT_EDGES}>
                <lineBasicMaterial color={st.edge} transparent opacity={0.55} />
              </lineSegments>
            </group>
            {layerLabels ? (
              <StoryTag position={[STACK.w / 2 + 0.35, LABEL_DY[k], 0.4]} kind="layer" minor>
                {LAYER_NAME[k]}
              </StoryTag>
            ) : null}
          </group>
        );
      })}
      <group ref={latticeGroup}>{lattice}</group>
    </group>
  );
}

/** A vertical bracket that spans the perovskite layer (its thickness follows `state.h`). */
export function ThicknessBracket({
  state,
  x = -2.3,
  z = 0.9,
  color = COLOR.photon,
  children,
}: {
  state: CellState;
  x?: number;
  z?: number;
  color?: string;
  children?: ReactNode;
}) {
  const grp = useRef<THREE.Group>(null);
  const line = useRef<THREE.Mesh>(null);
  const capTop = useRef<THREE.Mesh>(null);
  const capBot = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const sp = stackSpans(state.h).perov;
    grp.current?.position.set(x, sp.mid, z);
    line.current?.scale.set(1, sp.h, 1);
    capTop.current?.position.set(0.06, sp.h / 2, 0);
    capBot.current?.position.set(0.06, -sp.h / 2, 0);
  });
  return (
    <group ref={grp} position={[x, 0, z]}>
      <mesh ref={line}>
        <boxGeometry args={[0.018, 1, 0.018]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={capTop}>
        <boxGeometry args={[0.14, 0.018, 0.018]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={capBot}>
        <boxGeometry args={[0.14, 0.018, 0.018]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {children}
    </group>
  );
}

/* ───────────────────────── crystal lattice ───────────────────────── */

export type AtomKind = "A" | "B" | "X";
export type Atom = {
  id: number;
  kind: AtomKind;
  /** Which of the three X families this halide belongs to (0 for A and B). */
  fam: number;
  i: number;
  j: number;
  k: number;
  /** Local position. */
  p: V3;
  /** Position in half cells, used to find bonds. */
  h: V3;
};

/** All ions of an nx × ny × nz block of ABX₃ cells, centred on the origin. */
export function buildAtoms(nx: number, ny: number, nz: number, a: number): Atom[] {
  const atoms: Atom[] = [];
  const ox = (-nx * a) / 2;
  const oy = (-ny * a) / 2;
  const oz = (-nz * a) / 2;
  const push = (
    kind: AtomKind,
    fam: number,
    hx: number,
    hy: number,
    hz: number,
    i: number,
    j: number,
    k: number,
  ) => {
    atoms.push({
      id: atoms.length,
      kind,
      fam,
      i,
      j,
      k,
      p: [ox + (hx * a) / 2, oy + (hy * a) / 2, oz + (hz * a) / 2],
      h: [hx, hy, hz],
    });
  };
  for (let i = 0; i <= nx; i++)
    for (let j = 0; j <= ny; j++)
      for (let k = 0; k <= nz; k++) push("A", 0, 2 * i, 2 * j, 2 * k, i, j, k);
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++)
      for (let k = 0; k < nz; k++) push("B", 0, 2 * i + 1, 2 * j + 1, 2 * k + 1, i, j, k);
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++)
      for (let k = 0; k <= nz; k++) push("X", 1, 2 * i + 1, 2 * j + 1, 2 * k, i, j, k);
  for (let i = 0; i < nx; i++)
    for (let j = 0; j <= ny; j++)
      for (let k = 0; k < nz; k++) push("X", 2, 2 * i + 1, 2 * j, 2 * k + 1, i, j, k);
  for (let i = 0; i <= nx; i++)
    for (let j = 0; j < ny; j++)
      for (let k = 0; k < nz; k++) push("X", 3, 2 * i, 2 * j + 1, 2 * k + 1, i, j, k);
  return atoms;
}

export type AtomOut = { pos: V3; scale: number; color: THREE.Color };

export const LATTICE_COLOR = { A: COLOR.A, B: COLOR.B, X: COLOR.iodide };

const OCT: V3[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

/**
 * ABX₃ ions as three instanced meshes (A, B, X) plus the B–X bonds as one line mesh.
 * Large A, medium B, small X, as in the rest of the site.
 */
export function Lattice({
  atoms,
  radii = { A: 0.1, B: 0.068, X: 0.052 },
  colors = LATTICE_COLOR,
  hidden,
  offset,
  style,
  dynamic = false,
  styleKey = 0,
  bonds = true,
  bondColor = "#8f9bb0",
  bondOpacity = 0.4,
  zoom = false,
  dim = 1,
  focus,
}: {
  atoms: Atom[];
  radii?: { A: number; B: number; X: number };
  colors?: { A: string; B: string; X: string };
  hidden?: (a: Atom) => boolean;
  offset?: (a: Atom) => V3 | undefined;
  style?: (a: Atom, out: AtomOut) => void;
  dynamic?: boolean;
  styleKey?: string | number;
  bonds?: boolean;
  bondColor?: string;
  bondOpacity?: number;
  /** Shrink the ions while the camera is far away, so a big lattice reads as a fine texture. */
  zoom?: boolean | number;
  /** Multiplies every ion colour; lower it so moving particles stand out. */
  dim?: number;
  /** Ions far from `c` shrink to `min` of their size and dim, so the region of interest reads clearly. */
  focus?: { c: V3; r: number; min?: number; cull?: number };
}) {
  const root = useRef<THREE.Group>(null);
  const zoomK = useRef(1);
  const focusSig = focus
    ? `${focus.c.join(",")}|${focus.r}|${focus.min ?? ""}|${focus.cull ?? ""}`
    : "";
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const groups = useMemo(() => {
    const g: Record<AtomKind, Atom[]> = { A: [], B: [], X: [] };
    for (const a of atoms) if (!hidden?.(a)) g[a.kind].push(a);
    return g;
  }, [atoms, hidden]);
  const meshes = {
    A: useRef<THREE.InstancedMesh>(null),
    B: useRef<THREE.InstancedMesh>(null),
    X: useRef<THREE.InstancedMesh>(null),
  };
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const out = useMemo<AtomOut>(() => ({ pos: [0, 0, 0], scale: 1, color: new THREE.Color() }), []);
  const base = useMemo(
    () => ({
      A: new THREE.Color(colors.A),
      B: new THREE.Color(colors.B),
      X: new THREE.Color(colors.X),
    }),
    [colors.A, colors.B, colors.X],
  );

  const apply = () => {
    for (const kind of ["A", "B", "X"] as const) {
      const m = meshes[kind].current;
      if (!m) continue;
      const list = groups[kind];
      for (let n = 0; n < list.length; n++) {
        const a = list[n]!;
        const off = offset?.(a);
        out.pos[0] = a.p[0] + (off?.[0] ?? 0);
        out.pos[1] = a.p[1] + (off?.[1] ?? 0);
        out.pos[2] = a.p[2] + (off?.[2] ?? 0);
        out.scale = radii[kind] * zoomK.current;
        out.color.copy(base[kind]).multiplyScalar(dim);
        if (focus) {
          const d = Math.hypot(
            out.pos[0] - focus.c[0],
            out.pos[1] - focus.c[1],
            out.pos[2] - focus.c[2],
          );
          const f = smooth((d - focus.r) / focus.r);
          const m = focus.min ?? 0.4;
          out.scale *= focus.cull !== undefined && d > focus.cull ? 0 : 1 - (1 - m) * f;
          out.color.multiplyScalar(1 - 0.5 * f);
        }
        style?.(a, out);
        dummy.position.set(out.pos[0], out.pos[1], out.pos[2]);
        dummy.scale.setScalar(Math.max(1e-4, out.scale));
        dummy.updateMatrix();
        m.setMatrixAt(n, dummy.matrix);
        m.setColorAt(n, out.color);
      }
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
  };

  useLayoutEffect(() => {
    if (!dynamic) apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, radii.A, radii.B, radii.X, base, styleKey, offset, dynamic, dim, focusSig]);
  useFrame(({ camera }) => {
    if (zoom && root.current) {
      root.current.getWorldPosition(worldPos);
      const d = camera.position.distanceTo(worldPos);
      const lo = typeof zoom === "number" ? zoom : 0.55;
      const k = lo + (1 - lo) * smooth((4.8 - d) / 2.9);
      if (Math.abs(k - zoomK.current) > 0.01) {
        zoomK.current = k;
        if (!dynamic) apply();
      }
    }
    if (dynamic) apply();
  });

  const bondGeo = useMemo(() => {
    if (!bonds) return null;
    const byKey = new Map<string, Atom>();
    for (const a of groups.X) byKey.set(`${a.h[0]},${a.h[1]},${a.h[2]}`, a);
    const pos: number[] = [];
    for (const b of groups.B) {
      if (
        focus?.cull !== undefined &&
        Math.hypot(b.p[0] - focus.c[0], b.p[1] - focus.c[1], b.p[2] - focus.c[2]) > focus.cull
      )
        continue;
      const bo = offset?.(b);
      for (const d of OCT) {
        const x = byKey.get(`${b.h[0] + d[0]},${b.h[1] + d[1]},${b.h[2] + d[2]}`);
        if (!x) continue;
        const xo = offset?.(x);
        pos.push(
          b.p[0] + (bo?.[0] ?? 0),
          b.p[1] + (bo?.[1] ?? 0),
          b.p[2] + (bo?.[2] ?? 0),
          x.p[0] + (xo?.[0] ?? 0),
          x.p[1] + (xo?.[1] ?? 0),
          x.p[2] + (xo?.[2] ?? 0),
        );
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [bonds, groups, offset, focusSig]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <group ref={root}>
      {(["A", "B", "X"] as const).map((kind) => (
        <instancedMesh
          key={`${kind}${groups[kind].length}`}
          ref={meshes[kind]}
          args={[SPH_LO, undefined, groups[kind].length]}
          frustumCulled={false}
        >
          <meshStandardMaterial
            roughness={0.38}
            metalness={0.15}
            emissive="#ffffff"
            emissiveIntensity={0.07}
          />
        </instancedMesh>
      ))}
      {bondGeo ? (
        <lineSegments geometry={bondGeo} frustumCulled={false}>
          <lineBasicMaterial color={bondColor} transparent opacity={bondOpacity} />
        </lineSegments>
      ) : null}
    </group>
  );
}

/** The ABX₃ lattice that sits inside the thin perovskite layer of the solar cell (a = 0.36). */
export const SLAB_A = 0.36;
export const SLAB_CELLS: [number, number, number] = [11, 1, 6];
export const SLAB_ATOMS = buildAtoms(SLAB_CELLS[0], SLAB_CELLS[1], SLAB_CELLS[2], SLAB_A);
export const SLAB_RADII = { A: 0.058, B: 0.04, X: 0.033 };

/** Position of the lattice node (half-cell coordinates) inside the slab, in world space. */
export function slabPoint(hx: number, hy: number, hz: number): V3 {
  const a = SLAB_A;
  return [
    (-SLAB_CELLS[0] * a) / 2 + (hx * a) / 2,
    (-SLAB_CELLS[1] * a) / 2 + (hy * a) / 2,
    (-SLAB_CELLS[2] * a) / 2 + (hz * a) / 2,
  ];
}

/* ───────────────────────── misc ───────────────────────── */

/** A soft glowing point of light used as the sun badge and bulb. */
export function GlowBall({
  position,
  color,
  radius = 0.15,
  intensity = 1.2,
}: {
  position: V3;
  color: string;
  radius?: number;
  intensity?: number;
}) {
  return (
    <group position={position}>
      <mesh geometry={SPH} scale={radius}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} />
      </mesh>
      <mesh geometry={SPH_LO} scale={radius * 2.6}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/** A fixed pseudo-random displacement for one atom (used to roughen a grain boundary). */
export function hashOffset(id: number, amp: number): V3 {
  return [
    (hash1(id * 1.7) - 0.5) * 2 * amp,
    (hash1(id * 2.9 + 1) - 0.5) * 1.2 * amp,
    (hash1(id * 3.3 + 2) - 0.5) * 2 * amp,
  ];
}

/** Pseudo-random drift used for thermal jitter: pure function of time. */
export function jitter(seed: number, t: number, amp: number): V3 {
  return [
    Math.sin(t * 7.3 + seed * 12.9) * amp * (0.6 + hash1(seed) * 0.6),
    Math.sin(t * 6.1 + seed * 7.1) * amp * (0.6 + hash1(seed + 1) * 0.6),
    Math.sin(t * 8.7 + seed * 3.7) * amp * (0.6 + hash1(seed + 2) * 0.6),
  ];
}

/* ───────────────────────── external circuit ───────────────────────── */

/** Wire from the electron transport layer, through a lamp, to the metal electrode. */
export const WIRE: V3[] = [
  [2.0, 0.36, 0],
  [2.7, 0.36, 0],
  [2.7, -0.54, 0],
  [2.0, -0.54, 0],
];
const WIRE_LEN = pathLength(WIRE);
export const BULB: V3 = [2.7, -0.09, 0];
const FLOW_N = 16;
const WIRE_RODS: [V3, V3][] = [
  [WIRE[0]!, WIRE[1]!],
  [WIRE[1]!, [2.7, 0.04, 0]],
  [[2.7, -0.22, 0], WIRE[2]!],
  [WIRE[2]!, WIRE[3]!],
];

/**
 * The outside circuit: electrons flow along the wire and the lamp glows while `onRef.current` is above 0.
 */
export function Circuit({
  onRef,
  clock,
  tag = true,
}: {
  onRef: MutableRefObject<number>;
  clock: MutableRefObject<{ t: number }>;
  tag?: boolean;
}) {
  const flow = useRef<SwarmApi>(null);
  const bulb = useRef<THREE.Group>(null);
  useFrame(() => {
    const fl = flow.current;
    if (!fl) return;
    const on = onRef.current;
    const t = clock.current.t;
    for (let i = 0; i < FLOW_N; i++) {
      if (on <= 0.01) {
        fl.hide(i);
        continue;
      }
      const q = along(WIRE, (i / FLOW_N + t * 0.22) % 1, WIRE_LEN);
      fl.set(i, q[0], q[1], q[2], on);
    }
    fl.flush();
    bulb.current?.scale.setScalar(0.5 + on * 0.8 + Math.sin(t * 9) * 0.04 * on);
  });
  return (
    <group>
      {WIRE_RODS.map(([a, b], i) => (
        <Rod key={i} a={a} b={b} color="#aab4c0" radius={0.016} opacity={0.95} />
      ))}
      <group position={BULB}>
        <group ref={bulb} scale={0.5}>
          <GlowBall position={[0, 0, 0]} color="#ffd36b" radius={0.16} intensity={1.6} />
        </group>
      </group>
      <Swarm ref={flow} count={FLOW_N} color={COLOR.electron} radius={0.045} />
      {tag ? (
        <StoryTag position={[3.15, -0.09, 0]} kind="good">
          {L.current}
        </StoryTag>
      ) : null}
    </group>
  );
}
