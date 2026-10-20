import { useFrame } from "@react-three/fiber";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { LD } from "@/lib/sim/story";
import { EDGES, GRAINS, GRAIN_R, HOT, SURFACE_Y } from "./grains";
import { L } from "@/lib/sim/story";
import { Follow, type Pose } from "./tracks";
import {
  BeamSet,
  Circuit,
  CellStack,
  Flashes,
  StoryTag,
  Swarm,
  burst,
  useGate,
  type Atom,
  type AtomKind,
  type AtomOut,
  type CellState,
  type FlashApi,
  type StoryClock,
  type SwarmApi,
} from "./storyKit";
import { COLOR, STACK, clamp01, hash1, lerp, smooth, stackSpans, type V3 } from "./world";

/** Heights where the two transport layers collect their charges. */
export const ETL_Y = STACK.top + 0.12;
export const HTL_Y = STACK.top - STACK.thin - 0.12;

/** Colours that only the degradation scenes use. */
export const DEG = {
  water: "#3fd9e8",
  waterH: "#f4fbff",
  oxygen: "#ff7ad9",
  reactive: "#ff3fd0",
  uv: "#b46cff",
  pbi2: "#e8c53a",
  heat: "#ff8a3c",
  grain: "#4b3a8a",
  seam: "#8e7ed8",
  lost: "#ff6a4a",
  etlAtom: "#59a0ff",
};

/* ───────────────────────── grain film ───────────────────────── */

/** Per-frame values for the grain film: how damaged each grain is, how wet each boundary is. */
export type GrainCtl = {
  dmg: Float32Array;
  wet: Float32Array;
  edmg: Float32Array;
  /** 0 → 1: the two seam grains give way to the cut-away lattice window. */
  open: number;
  /** grains that give way to the window */
  openIds: readonly number[];
};

export const makeGrainCtl = (openIds: readonly number[] = HOT.grains): GrainCtl => ({
  dmg: new Float32Array(GRAINS.length),
  wet: new Float32Array(EDGES.length),
  edmg: new Float32Array(EDGES.length),
  open: 0,
  openIds,
});

const HEX = new THREE.CylinderGeometry(1, 1, 1, 6, 1);
const BOX = new THREE.BoxGeometry(1, 1, 1);
const SPH_LO = new THREE.SphereGeometry(1, 10, 8);
const SPH = new THREE.SphereGeometry(1, 16, 12);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 8, 1);
const RING = new THREE.TorusGeometry(1, 0.09, 6, 28);

/** The perovskite film as a honeycomb of grains, with the grain boundaries drawn as a glowing network. */
export function GrainField({ ctl, state }: { ctl: GrainCtl; state: CellState }) {
  const hex = useRef<THREE.InstancedMesh>(null);
  const rods = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(
    () => ({
      base: new THREE.Color(DEG.grain),
      mid: new THREE.Color("#8a7a3a"),
      pb: new THREE.Color(DEG.pbi2),
      seam: new THREE.Color(DEG.seam),
      wet: new THREE.Color(DEG.water),
      tmp: new THREE.Color(),
    }),
    [],
  );

  useFrame(() => {
    const sp = stackSpans(state.h).perov;
    const h = hex.current;
    if (h) {
      for (const g of GRAINS) {
        const d = clamp01(ctl.dmg[g.id]!);
        const gone = ctl.openIds.includes(g.id) ? smooth(ctl.open) : 0;
        const tilt = d * 0.16;
        const r = GRAIN_R * 0.93 * (1 - gone) * (1 - 0.06 * d);
        dummy.position.set(g.x, sp.mid - d * 0.025, g.z);
        dummy.rotation.set(
          (hash1(g.id * 1.3) - 0.5) * 2 * tilt,
          0,
          (hash1(g.id * 2.1) - 0.5) * 2 * tilt,
        );
        dummy.scale.set(Math.max(1e-4, r), Math.max(1e-4, sp.h * (1 - 0.16 * d) * (1 - gone)), Math.max(1e-4, r));
        dummy.updateMatrix();
        h.setMatrixAt(g.id, dummy.matrix);
        if (d < 0.5) col.tmp.copy(col.base).lerp(col.mid, d * 2);
        else col.tmp.copy(col.mid).lerp(col.pb, (d - 0.5) * 2);
        h.setColorAt(g.id, col.tmp);
      }
      h.instanceMatrix.needsUpdate = true;
      if (h.instanceColor) h.instanceColor.needsUpdate = true;
    }
    const r = rods.current;
    if (r) {
      for (const e of EDGES) {
        const w = clamp01(ctl.wet[e.id]!);
        const dm = clamp01(ctl.edmg[e.id]!);
        dummy.position.set(e.mx, SURFACE_Y + 0.006, e.mz);
        dummy.rotation.set(0, e.ang, 0);
        const th = 0.012 + 0.012 * w + 0.01 * dm;
        dummy.scale.set(e.len, th, th);
        dummy.updateMatrix();
        r.setMatrixAt(e.id, dummy.matrix);
        col.tmp.copy(col.seam).multiplyScalar(0.8).lerp(col.wet, w).lerp(col.pb, dm);
        r.setColorAt(e.id, col.tmp);
      }
      r.instanceMatrix.needsUpdate = true;
      if (r.instanceColor) r.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={hex} args={[HEX, undefined, GRAINS.length]} frustumCulled={false} renderOrder={2}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.5}
          emissive="#ffffff"
          emissiveIntensity={0.1}
          transparent
          opacity={0.62}
          depthWrite={false}
        />
      </instancedMesh>
      <instancedMesh ref={rods} args={[BOX, undefined, EDGES.length]} frustumCulled={false} renderOrder={4}>
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/* ───────────────────────── molecules ───────────────────────── */

export type MolKind = "h2o" | "o2";

export type MolApi = {
  set: (
    i: number,
    x: number,
    y: number,
    z: number,
    s?: number,
    rx?: number,
    ry?: number,
    rz?: number,
    glow?: number,
  ) => void;
  hide: (i: number) => void;
  /** Colour of the soft halo (the glow strength is the last argument of `set`). */
  halo: (i: number, color: string, glow?: number) => void;
  flush: () => void;
};

type Part = { geo: THREE.BufferGeometry; color: string; local: THREE.Matrix4; bond?: boolean };

const IDENT_Q = new THREE.Quaternion();
const UP = new THREE.Vector3(0, 1, 0);

function ball(p: V3, r: number, color: string): Part {
  const m = new THREE.Matrix4().compose(
    new THREE.Vector3(...p),
    IDENT_Q,
    new THREE.Vector3(r, r, r),
  );
  return { geo: SPH_LO, color, local: m };
}

function stick(a: V3, b: V3, r: number, color: string): Part {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const dir = B.clone().sub(A);
  const m = new THREE.Matrix4().compose(
    A.clone().lerp(B, 0.5),
    new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()),
    new THREE.Vector3(r, dir.length(), r),
  );
  return { geo: CYL, color, local: m, bond: true };
}

const H2O_PARTS: Part[] = (() => {
  const o: V3 = [0, 0.03, 0];
  const h1: V3 = [0.07, -0.025, 0];
  const h2: V3 = [-0.07, -0.025, 0];
  return [
    ball(o, 0.055, DEG.water),
    ball(h1, 0.032, DEG.waterH),
    ball(h2, 0.032, DEG.waterH),
    stick(o, h1, 0.011, "#d6f6ff"),
    stick(o, h2, 0.011, "#d6f6ff"),
  ];
})();

const O2_PARTS: Part[] = (() => {
  const a: V3 = [-0.052, 0, 0];
  const b: V3 = [0.052, 0, 0];
  return [ball(a, 0.052, DEG.oxygen), ball(b, 0.052, DEG.oxygen), stick(a, b, 0.016, "#ffd0f0")];
})();

/** H₂O (one big oxygen, two small hydrogens) or O₂ (two bonded oxygens), as a few instanced meshes. */
export const Molecules = forwardRef<MolApi, { kind: MolKind; count: number; haloColor?: string }>(
  function Molecules({ kind, count, haloColor }, ref) {
    const parts = kind === "h2o" ? H2O_PARTS : O2_PARTS;
    const meshes = useRef<(THREE.InstancedMesh | null)[]>([]);
    const glow = useRef<THREE.InstancedMesh>(null);
    const tmpM = useMemo(() => new THREE.Matrix4(), []);
    const M = useMemo(() => new THREE.Matrix4(), []);
    const q = useMemo(() => new THREE.Quaternion(), []);
    const eul = useMemo(() => new THREE.Euler(), []);
    const pos = useMemo(() => new THREE.Vector3(), []);
    const scl = useMemo(() => new THREE.Vector3(), []);
    const tmpC = useMemo(() => new THREE.Color(), []);
    const hc = haloColor ?? (kind === "h2o" ? DEG.water : DEG.oxygen);
    const api = useMemo<MolApi>(
      () => ({
        set(i, x, y, z, s = 1, rx = 0, ry = 0, rz = 0, g = 0.14) {
          eul.set(rx, ry, rz);
          q.setFromEuler(eul);
          pos.set(x, y, z);
          scl.setScalar(Math.max(1e-4, s));
          M.compose(pos, q, scl);
          parts.forEach((p, n) => {
            tmpM.multiplyMatrices(M, p.local);
            meshes.current[n]?.setMatrixAt(i, tmpM);
          });
          scl.setScalar(Math.max(1e-4, s * 0.12));
          tmpM.compose(pos, IDENT_Q, scl);
          glow.current?.setMatrixAt(i, tmpM);
          tmpC.set(hc).multiplyScalar(Math.max(0, g));
          glow.current?.setColorAt(i, tmpC);
        },
        hide(i) {
          pos.set(0, -60, 0);
          scl.setScalar(1e-4);
          tmpM.compose(pos, IDENT_Q, scl);
          meshes.current.forEach((m) => m?.setMatrixAt(i, tmpM));
          glow.current?.setMatrixAt(i, tmpM);
        },
        halo(i, color, g = 0.14) {
          tmpC.set(color).multiplyScalar(Math.max(0, g));
          glow.current?.setColorAt(i, tmpC);
        },
        flush() {
          meshes.current.forEach((m) => {
            if (m) m.instanceMatrix.needsUpdate = true;
          });
          const g = glow.current;
          if (g) {
            g.instanceMatrix.needsUpdate = true;
            if (g.instanceColor) g.instanceColor.needsUpdate = true;
          }
        },
      }),
      [parts, hc, M, tmpM, q, eul, pos, scl, tmpC],
    );
    useImperativeHandle(ref, () => api, [api]);
    useLayoutEffect(() => {
      for (let i = 0; i < count; i++) api.hide(i);
      api.flush();
    }, [api, count]);
    return (
      <>
        {parts.map((p, n) => (
          <instancedMesh
            key={`${kind}${n}${count}`}
            ref={(m) => {
              meshes.current[n] = m;
            }}
            args={[p.geo, undefined, count]}
            frustumCulled={false}
          >
            {p.bond ? (
              <meshBasicMaterial color={p.color} />
            ) : (
              <meshStandardMaterial
                color={p.color}
                emissive={p.color}
                emissiveIntensity={0.35}
                roughness={0.35}
              />
            )}
          </instancedMesh>
        ))}
        <instancedMesh
          key={`${kind}g${count}`}
          ref={glow}
          args={[SPH_LO, undefined, count]}
          frustumCulled={false}
          renderOrder={6}
        >
          <meshBasicMaterial
            color="#ffffff"
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </instancedMesh>
      </>
    );
  },
);

/* ───────────────────────── ghosts (vacancies, markers) ───────────────────────── */

export type GhostApi = {
  set: (i: number, x: number, y: number, z: number, s: number, a: number, color?: string) => void;
  hide: (i: number) => void;
  flush: () => void;
};

/** Hollow glowing rings: an empty lattice site, a trap, a "look here" marker. */
export const Ghosts = forwardRef<GhostApi, { count: number; color?: string }>(function Ghosts(
  { count, color = "#ffffff" },
  ref,
) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const base = useMemo(() => new THREE.Color(color), [color]);
  const tmp = useMemo(() => new THREE.Color(), []);
  const named = useMemo(() => new Map<string, THREE.Color>(), []);
  const api = useMemo<GhostApi>(
    () => ({
      set(i, x, y, z, s, a, c) {
        dummy.position.set(x, y, z);
        dummy.scale.setScalar(Math.max(1e-4, s));
        dummy.updateMatrix();
        mesh.current?.setMatrixAt(i, dummy.matrix);
        let pick = base;
        if (c) {
          pick = named.get(c) ?? new THREE.Color(c);
          named.set(c, pick);
        }
        tmp.copy(pick).multiplyScalar(Math.max(0, a));
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
        const m = mesh.current;
        if (!m) return;
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
      },
    }),
    [dummy, base, tmp, named],
  );
  useImperativeHandle(ref, () => api, [api]);
  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) api.hide(i);
    api.flush();
  }, [api, count]);
  return (
    <instancedMesh key={count} ref={mesh} args={[RING, undefined, count]} frustumCulled={false} renderOrder={5}>
      <meshBasicMaterial
        color="#ffffff"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
});

/* ───────────────────────── a lattice that moves ───────────────────────── */

const OCT: V3[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

/**
 * An ABX₃ block whose ions can vibrate, hop, fade or change colour every frame. The B–X bonds follow
 * the ions, so a bent or broken octahedron really looks bent or broken.
 */
export function DynLattice({
  atoms,
  radii,
  frame,
  colors = { A: COLOR.A, B: COLOR.B, X: COLOR.iodide },
  bondColor = "#aab5c8",
  bondOpacity = 0.5,
}: {
  atoms: Atom[];
  radii: { A: number; B: number; X: number };
  /** Called for every ion each frame. `out` starts at the rest position, full size and base colour. */
  frame: (a: Atom, out: AtomOut) => void;
  colors?: { A: string; B: string; X: string };
  bondColor?: string;
  bondOpacity?: number;
}) {
  const groups = useMemo(() => {
    const g: Record<AtomKind, Atom[]> = { A: [], B: [], X: [] };
    for (const a of atoms) g[a.kind].push(a);
    return g;
  }, [atoms]);
  const meshes = {
    A: useRef<THREE.InstancedMesh>(null),
    B: useRef<THREE.InstancedMesh>(null),
    X: useRef<THREE.InstancedMesh>(null),
  };
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const out = useMemo<AtomOut>(() => ({ pos: [0, 0, 0], scale: 1, color: new THREE.Color() }), []);
  const base = useMemo(
    () => ({ A: new THREE.Color(colors.A), B: new THREE.Color(colors.B), X: new THREE.Color(colors.X) }),
    [colors.A, colors.B, colors.X],
  );
  /** current position and size of every ion, indexed by atom id */
  const cur = useMemo(() => new Float32Array(atoms.length * 4), [atoms.length]);
  const pairs = useMemo(() => {
    const byKey = new Map<string, number>();
    for (const a of groups.X) byKey.set(`${a.h[0]},${a.h[1]},${a.h[2]}`, a.id);
    const list: [number, number][] = [];
    for (const b of groups.B)
      for (const d of OCT) {
        const x = byKey.get(`${b.h[0] + d[0]},${b.h[1] + d[1]},${b.h[2] + d[2]}`);
        if (x !== undefined) list.push([b.id, x]);
      }
    return list;
  }, [groups]);
  const bondGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pairs.length * 6), 3));
    return g;
  }, [pairs.length]);

  useFrame(() => {
    for (const kind of ["A", "B", "X"] as const) {
      const m = meshes[kind].current;
      if (!m) continue;
      const list = groups[kind];
      for (let n = 0; n < list.length; n++) {
        const a = list[n]!;
        out.pos[0] = a.p[0];
        out.pos[1] = a.p[1];
        out.pos[2] = a.p[2];
        out.scale = radii[kind];
        out.color.copy(base[kind]);
        frame(a, out);
        const k = a.id * 4;
        cur[k] = out.pos[0];
        cur[k + 1] = out.pos[1];
        cur[k + 2] = out.pos[2];
        cur[k + 3] = out.scale;
        dummy.position.set(out.pos[0], out.pos[1], out.pos[2]);
        dummy.scale.setScalar(Math.max(1e-4, out.scale));
        dummy.updateMatrix();
        m.setMatrixAt(n, dummy.matrix);
        m.setColorAt(n, out.color);
      }
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
    const attr = bondGeo.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let n = 0; n < pairs.length; n++) {
      const [bi, xi] = pairs[n]!;
      const b = bi * 4;
      const x = xi * 4;
      const live = cur[b + 3]! > 0.004 && cur[x + 3]! > 0.004;
      const o = n * 6;
      arr[o] = cur[b]!;
      arr[o + 1] = cur[b + 1]!;
      arr[o + 2] = cur[b + 2]!;
      arr[o + 3] = live ? cur[x]! : cur[b]!;
      arr[o + 4] = live ? cur[x + 1]! : cur[b + 1]!;
      arr[o + 5] = live ? cur[x + 2]! : cur[b + 2]!;
    }
    attr.needsUpdate = true;
  });

  return (
    <group>
      {(["A", "B", "X"] as const).map((kind) => (
        <instancedMesh
          key={`${kind}${groups[kind].length}`}
          ref={meshes[kind]}
          args={[SPH_LO, undefined, groups[kind].length]}
          frustumCulled={false}
        >
          <meshStandardMaterial roughness={0.38} metalness={0.15} emissive="#ffffff" emissiveIntensity={0.07} />
        </instancedMesh>
      ))}
      <lineSegments geometry={bondGeo} frustumCulled={false}>
        <lineBasicMaterial color={bondColor} transparent opacity={bondOpacity} />
      </lineSegments>
    </group>
  );
}

/** Thin outline of a box: the "window" that shows where the lattice view was cut out of the film. */
export function WindowFrame({
  center,
  size,
  alpha,
  color = "#ffffff",
}: {
  center: V3;
  size: V3;
  alpha: MutableRefObject<number>;
  color?: string;
}) {
  const mat = useRef<THREE.LineBasicMaterial>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)), []);
  useFrame(() => {
    if (mat.current) mat.current.opacity = alpha.current;
  });
  return (
    <lineSegments geometry={edges} position={center} scale={size} frustumCulled={false}>
      <lineBasicMaterial ref={mat} color={color} transparent opacity={0} depthWrite={false} />
    </lineSegments>
  );
}

/* ───────────────────────── photons → charges → collection ───────────────────────── */

export type FlowCtl = {
  /** 0 → 1: share of the sunbeams that are on. */
  light: number;
  /** 0 = visible-light photons (yellow), 1 = UV photons (violet). */
  uv: number;
  /** 0 → 1: chance that a charge crossing the damaged zone is caught and lost. */
  loss: number;
  zx0: number;
  zx1: number;
  /** 0 = both charges are caught in the bulk, 1 = electrons are held back at the ETL interface. */
  where: 0 | 1;
  /** 0 → 1: charges stay where they were made (a freshly excited pair) instead of travelling on. */
  hold: number;
  /** Share of UV photons that are stopped in the transport layer instead of reaching the absorber. */
  uvAbsorb: number;
  /** 1 = name a photon, an electron and a hole while they pass (labels on first introduction). */
  tags: number;
  /** output: share of the charges that make it to the circuit (drives the lamp and the gauge) */
  collected: number;
  /** output: glow of the transport layers right now */
  etl: number;
  htl: number;
};

export const makeFlowCtl = (): FlowCtl => ({
  light: 0,
  uv: 0,
  loss: 0,
  zx0: 0,
  zx1: 0,
  where: 0,
  hold: 0,
  uvAbsorb: 0,
  tags: 0,
  collected: 0,
  etl: 0,
  htl: 0,
});

const LANES = 10;
/** The lane whose photon and charges carry the "photon / e⁻ / h⁺" labels. */
const TAG_LANE = 5;
const LANE_X = [-1.75, -1.4, -1.05, -0.7, -0.35, 0.0, 0.35, 0.7, 1.05, 1.4];
const LANE_Z = [-0.6, 0.3, -0.2, 0.6, -0.7, 0.1, -0.35, 0.55, -0.05, 0.4];
const PERIOD = 4.8;
const T_ABS = 1.1;
const T_TRAVEL = 2.0;
const SUN_Y = 2.5;
/** Height in the transport layer where UV photons are stopped. */
const UV_STOP_Y = STACK.top + 0.16;

/**
 * Sunbeams that make electron–hole pairs and carry them to the transport layers. Charges that cross
 * the damaged zone may be caught and lost, which is what "poor charge collection" looks like.
 */
export function CarrierFlow({
  ctl,
  clock,
}: {
  ctl: FlowCtl;
  clock: MutableRefObject<StoryClock>;
}) {
  const photons = useRef<SwarmApi>(null);
  const electrons = useRef<SwarmApi>(null);
  const holes = useRef<SwarmApi>(null);
  const absorb = useRef<FlashApi>(null);
  const lostFx = useRef<FlashApi>(null);
  const uvFx = useRef<FlashApi>(null);
  const photonPose = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const ePose = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const hPose = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });

  const depth = useMemo(() => LANE_X.map((_, i) => (hash1(i * 4.1) - 0.5) * 0.3), []);
  const offs = useMemo(() => LANE_X.map((_, i) => hash1(i * 5.3 + 2) * PERIOD), []);

  useFrame(() => {
    const p = photons.current;
    const e = electrons.current;
    const h = holes.current;
    const fa = absorb.current;
    const fl = lostFx.current;
    const fu = uvFx.current;
    if (!p || !e || !h || !fa || !fl || !fu) return;
    const t = clock.current.t;
    let etlGlow = 0;
    let htlGlow = 0;
    let active = 0;
    let inZone = 0;
    photonPose.current.a = 0;
    ePose.current.a = 0;
    hPose.current.a = 0;

    for (let i = 0; i < LANES; i++) {
      const on = (i + 0.5) / LANES <= ctl.light + 1e-6;
      const x = LANE_X[i]!;
      const z = LANE_Z[i]!;
      const zoned = x >= ctl.zx0 && x <= ctl.zx1;
      if (on) {
        active++;
        if (zoned) inZone++;
      }
      if (!on) {
        p.hide(i);
        e.hide(i);
        h.hide(i);
        fa.hide(i);
        fu.hide(i);
        fl.hide(i * 2);
        fl.hide(i * 2 + 1);
        continue;
      }
      const clk = t + offs[i]!;
      const cyc = Math.floor(clk / PERIOD);
      const tau = clk - cyc * PERIOD;
      // a UV photon is often stopped in the transport layer: no pair is made, the energy is dumped there
      const stopped = ctl.uv > 0.5 && hash1(i * 3.9 + cyc * 1.3) < ctl.uvAbsorb;
      const yb = stopped ? UV_STOP_Y : depth[i]!;

      // photon on its way down
      if (tau < T_ABS) {
        const y = SUN_Y + (yb - SUN_Y) * (tau / T_ABS);
        p.set(i, x, y, z, ctl.uv > 0.5 ? 1.3 : 1);
        p.tint(i, ctl.uv > 0.5 ? DEG.uv : COLOR.photon);
        if (i === TAG_LANE && ctl.tags > 0.5) Object.assign(photonPose.current, { x, y: y + 0.12, z, a: 1 });
      } else p.hide(i);
      const b = burst(tau, T_ABS, 0.6, 0.2);
      if (b && !stopped) fa.set(i, x, yb, z, b.r, b.a);
      else fa.hide(i);
      const bu = stopped ? burst(tau, T_ABS, 0.7, 0.26) : null;
      if (bu) {
        fu.set(i, x, yb, z, bu.r, bu.a * 1.3);
        etlGlow = Math.max(etlGlow, bu.a * 1.4);
      } else fu.hide(i);
      if (stopped) {
        e.hide(i);
        h.hide(i);
        fl.hide(i * 2);
        fl.hide(i * 2 + 1);
        continue;
      }

      // the pair
      const eps = tau - T_ABS;
      if (eps < 0) {
        e.hide(i);
        h.hide(i);
        fl.hide(i * 2);
        fl.hide(i * 2 + 1);
        continue;
      }
      const mv = 1 - ctl.hold;
      const lost = zoned && ctl.hold < 0.5 && hash1(i * 7.7 + cyc * 3.1 + 0.5) < ctl.loss;
      const born = Math.min(1, eps / 0.25);
      const sway = Math.sin(eps * 5 + i) * 0.05;
      const sway2 = Math.cos(eps * 4 + i * 2) * 0.04;
      let ue = clamp01(eps / T_TRAVEL);
      let uh = ue;
      let eAlive = true;
      let hAlive = true;
      let eStop = -1;
      let hStop = -1;
      if (lost) {
        const stopAt = ctl.where === 1 ? 0.7 : 0.3 + 0.4 * hash1(i * 2.3 + cyc);
        eStop = stopAt * T_TRAVEL;
        ue = clamp01(Math.min(eps, eStop) / T_TRAVEL);
        if (ctl.where === 0) {
          hStop = eStop;
          uh = ue;
        }
        const hold = ctl.where === 1 ? 1.0 : 0.55;
        if (eps > eStop + hold) eAlive = false;
        if (ctl.where === 0 && eps > hStop + hold) hAlive = false;
        const f1 = burst(eps, eStop + hold - 0.25, 0.5, 0.22);
        if (f1) fl.set(i * 2, x + sway, lerp(yb, ETL_Y, stopAt), z, f1.r, f1.a);
        else fl.hide(i * 2);
        const f2 = ctl.where === 0 ? burst(eps, hStop + hold - 0.25, 0.5, 0.22) : null;
        if (f2) fl.set(i * 2 + 1, x - sway, lerp(yb, HTL_Y, stopAt), z, f2.r, f2.a);
        else fl.hide(i * 2 + 1);
      } else {
        fl.hide(i * 2);
        fl.hide(i * 2 + 1);
        if (eps > T_TRAVEL + 0.35) {
          eAlive = false;
          hAlive = false;
        }
        if (eps >= T_TRAVEL && ctl.hold < 0.5) {
          const g = 1 - clamp01((eps - T_TRAVEL) / 0.8);
          etlGlow = Math.max(etlGlow, g);
          htlGlow = Math.max(htlGlow, g);
        }
      }
      if (eAlive) {
        const jx = lost && eps > eStop ? Math.sin(eps * 40) * 0.012 : 0;
        const ey = lerp(yb, ETL_Y, ue * mv) + ctl.hold * Math.sin(eps * 6 + i) * 0.02;
        e.set(i, x + sway + jx, ey, z + sway2, born);
        if (i === TAG_LANE && ctl.tags > 0.5) Object.assign(ePose.current, { x: x + sway + 0.1, y: ey + 0.1, z: z + sway2, a: 1 });
      } else e.hide(i);
      if (hAlive) {
        const jh = lost && ctl.where === 0 && eps > hStop ? Math.sin(eps * 37) * 0.012 : 0;
        const hy = lerp(yb, HTL_Y, uh * mv) + ctl.hold * Math.sin(eps * 5 + i) * 0.02;
        h.set(i, x - sway + jh, hy, z - sway2, born);
        if (i === TAG_LANE && ctl.tags > 0.5) Object.assign(hPose.current, { x: x - sway - 0.1, y: hy - 0.1, z: z - sway2, a: 1 });
      } else h.hide(i);
    }

    ctl.etl = etlGlow;
    ctl.htl = htlGlow;
    ctl.collected = active > 0 ? (1 - (ctl.loss * inZone) / active) * (active / LANES) : 0;
    p.flush();
    e.flush();
    h.flush();
    fa.flush();
    fl.flush();
    fu.flush();
  });

  return (
    <group>
      <BeamSet
        count={LANES}
        update={(i, out) => {
          out.x = LANE_X[i]!;
          out.z = LANE_Z[i]!;
          out.y0 = SUN_Y;
          out.y1 = STACK.top + STACK.etl;
          out.alpha = ctl.uv <= 0.5 && (i + 0.5) / LANES <= ctl.light + 1e-6 ? 0.16 : 0;
        }}
      />
      <BeamSet
        color={DEG.uv}
        count={LANES}
        update={(i, out) => {
          out.x = LANE_X[i]!;
          out.z = LANE_Z[i]!;
          out.y0 = SUN_Y;
          out.y1 = STACK.top + STACK.etl;
          out.alpha = ctl.uv > 0.5 && (i + 0.5) / LANES <= ctl.light + 1e-6 ? 0.22 : 0;
        }}
      />
      <Swarm ref={photons} count={LANES} color={COLOR.photon} radius={0.055} emissive={1.8} basic />
      <Swarm ref={electrons} count={LANES} color={COLOR.electron} radius={0.058} />
      <Swarm ref={holes} count={LANES} color={COLOR.hole} radius={0.058} />
      <Flashes ref={absorb} count={LANES} color="#ffd98a" />
      <Flashes ref={lostFx} count={LANES * 2} color={DEG.lost} />
      <Flashes ref={uvFx} count={LANES} color={DEG.uv} />
      <Follow pose={photonPose}>
        <StoryTag position={[0, 0, 0]} kind="particle" minor>
          {L.photon}
        </StoryTag>
      </Follow>
      <Follow pose={ePose}>
        <StoryTag position={[0, 0, 0]} kind="particle">
          {L.electron}
        </StoryTag>
      </Follow>
      <Follow pose={hPose}>
        <StoryTag position={[0, 0, 0]} kind="particle">
          {L.hole}
        </StoryTag>
      </Follow>
    </group>
  );
}

/* ───────────────────────── the whole cell ───────────────────────── */

export type Zone = {
  x0: number;
  x1: number;
  a: number;
  /** thin layer at the top of the absorber instead of the whole film */
  band?: boolean;
  color?: string;
};

export type DegCtl = {
  cell: CellState;
  grains: GrainCtl;
  flow: FlowCtl;
  /** brightness of the Sun: 1 = shining, 0 = off */
  sun: number;
  /** 0 = yellow sunlight, 1 = violet (UV) */
  sunUv: number;
  /** a tinted block inside the absorber that marks the damaged zone at cell level */
  zone: Zone;
  /** a second tinted block (3.8.5 shows an iodide-rich and a bromide-rich region) */
  zone2: Zone;
  /** lamp level, smoothed from `flow.collected` */
  lamp: MutableRefObject<number>;
  /** 0 → 1: how visible the power gauge is */
  gaugeShow: number;
  /** what the gauge reads, 0 → 1 */
  gauge: number;
};

export function makeDegCtl(cell: CellState, openIds?: readonly number[]): DegCtl {
  return {
    cell,
    grains: makeGrainCtl(openIds),
    flow: makeFlowCtl(),
    sun: 1,
    sunUv: 0,
    zone: { x0: 0, x1: 0, a: 0 },
    zone2: { x0: 0, x1: 0, a: 0, color: "#ff9a3c" },
    lamp: { current: 0 },
    gaugeShow: 0,
    gauge: 1,
  };
}

const SUN_YELLOW = new THREE.Color("#ffcf55");
const SUN_VIOLET = new THREE.Color("#b46cff");
const sunTint = new THREE.Color();

/** A translucent block inside the absorber: where the damage (or a different composition) is. */
function ZoneBox({ zone, state }: { zone: Zone; state: CellState }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const z = mesh.current;
    if (!z) return;
    const sp = stackSpans(state.h).perov;
    const w = Math.max(0.001, zone.x1 - zone.x0);
    z.visible = zone.a > 0.01;
    const bandH = 0.1;
    z.position.set((zone.x0 + zone.x1) / 2, zone.band ? sp.y1 - bandH / 2 : sp.mid, 0);
    z.scale.set(w, zone.band ? bandH : sp.h * 1.02, STACK.d * 0.98);
    if (mat.current) {
      mat.current.opacity = 0.42 * zone.a;
      mat.current.color.set(zone.color ?? "#e0a428");
    }
  });
  return (
    <mesh ref={mesh} renderOrder={3} visible={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        ref={mat}
        color="#e0a428"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * The one solar cell every degradation scene starts from:
 * transparent electrode / ETL / perovskite (grains) / HTL / metal electrode, plus Sun, charges,
 * outside circuit and power gauge.
 */
export function DegradeBase({
  ctl,
  clock,
  layerLabels = false,
  sunTag = false,
  children,
}: {
  ctl: DegCtl;
  clock: MutableRefObject<StoryClock>;
  layerLabels?: boolean;
  sunTag?: boolean;
  children?: ReactNode;
}) {
  const sunGrp = useRef<THREE.Group>(null);
  const sunCore = useRef<THREE.MeshStandardMaterial>(null);
  const sunHalo = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const st = ctl.cell;
    sunTint.copy(SUN_YELLOW).lerp(SUN_VIOLET, ctl.sunUv);
    if (sunCore.current) {
      sunCore.current.color.copy(sunTint);
      sunCore.current.emissive.copy(sunTint);
    }
    sunHalo.current?.color.copy(sunTint);
    const f = ctl.flow;
    st.etl += (f.etl - st.etl) * 0.2;
    st.htl += (f.htl - st.htl) * 0.2;
    // lamp: follows the share of charges that are collected
    const want = f.collected * ctl.sun;
    ctl.lamp.current += (want - ctl.lamp.current) * 0.08;
    sunGrp.current?.scale.setScalar(0.35 + 0.65 * ctl.sun);
  });

  return (
    <group>
      <CellStack
        state={ctl.cell}
        names={{ glass: LD.transparent, elec: LD.metal }}
        layerLabels={layerLabels}
      />
      <GrainField ctl={ctl.grains} state={ctl.cell} />
      <ZoneBox zone={ctl.zone} state={ctl.cell} />
      <ZoneBox zone={ctl.zone2} state={ctl.cell} />
      <CarrierFlow ctl={ctl.flow} clock={clock} />
      <Circuit onRef={ctl.lamp} clock={clock} tag={false} />
      <PowerGauge ctl={ctl} />
      <group ref={sunGrp} position={[1.2, 2.85, -0.5]}>
        <mesh geometry={SPH} scale={0.26}>
          <meshStandardMaterial ref={sunCore} color="#ffcf55" emissive="#ffcf55" emissiveIntensity={1.8} />
        </mesh>
        <mesh geometry={SPH_LO} scale={0.68}>
          <meshBasicMaterial
            ref={sunHalo}
            color="#ffcf55"
            transparent
            opacity={0.2}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      {sunTag ? (
        <StoryTag position={[1.2, 3.3, -0.5]} kind="particle" minor>
          {LD.sunlight}
        </StoryTag>
      ) : null}
      {children}
    </group>
  );
}

/** A tall bar that reads "how much power the cell delivers", so the end result is visible at a glance. */
export function PowerGauge({ ctl }: { ctl: DegCtl }) {
  const grp = useRef<THREE.Group>(null);
  const fill = useRef<THREE.Mesh>(null);
  const fillMat = useRef<THREE.MeshBasicMaterial>(null);
  const trackMat = useRef<THREE.MeshBasicMaterial>(null);
  const shown = useRef(0);
  const full = useMemo(() => new THREE.Color("#58d68d"), []);
  const mid = useMemo(() => new THREE.Color("#f0b429"), []);
  const low = useMemo(() => new THREE.Color("#ff5a47"), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const level = useRef(1);
  const tagOn = useGate(() => shown.current > 0.5);
  const H = 1.25;
  useFrame(() => {
    shown.current += (ctl.gaugeShow - shown.current) * 0.1;
    level.current += (ctl.gauge - level.current) * 0.08;
    const g = grp.current;
    if (g) g.visible = shown.current > 0.02;
    const v = clamp01(level.current);
    fill.current?.scale.set(1, Math.max(0.001, v * H), 1);
    fill.current?.position.set(0, -H / 2 + (v * H) / 2, 0);
    if (fillMat.current) {
      if (v > 0.6) tmp.copy(mid).lerp(full, (v - 0.6) / 0.4);
      else tmp.copy(low).lerp(mid, v / 0.6);
      fillMat.current.color.copy(tmp);
      fillMat.current.opacity = shown.current;
    }
    if (trackMat.current) trackMat.current.opacity = 0.35 * shown.current;
  });
  return (
    <group ref={grp} position={[-2.9, -0.1, 0.2]} visible={false}>
      <mesh>
        <boxGeometry args={[0.16, H, 0.16]} />
        <meshBasicMaterial ref={trackMat} color="#9fb2c6" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh ref={fill}>
        <boxGeometry args={[0.11, 1, 0.11]} />
        <meshBasicMaterial ref={fillMat} color="#58d68d" transparent />
      </mesh>
      {tagOn ? (
        <StoryTag position={[0, H / 2 + 0.2, 0]} kind="concept">
          {LD.power}
        </StoryTag>
      ) : null}
    </group>
  );
}

/** Ease helper for scenes: moves `cur` toward `want` at rate `k` per frame-ish. */
export function ease(cur: number, want: number, dt: number, rate = 4): number {
  return cur + (want - cur) * Math.min(1, dt * rate);
}

/* ───────────────────────── small meters ───────────────────────── */

/** A vertical bar whose fill follows `value.current` (0 → 1). Used for "speed" and "damage" readouts. */
export function Meter({
  position,
  value,
  color,
  height = 0.9,
  label,
  show = true,
}: {
  position: V3;
  value: MutableRefObject<number>;
  color: string;
  height?: number;
  label?: string;
  show?: boolean;
}) {
  const fill = useRef<THREE.Mesh>(null);
  const shown = useRef(0);
  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    shown.current += ((show ? 1 : 0) - shown.current) * 0.12;
    if (grp.current) grp.current.visible = shown.current > 0.03;
    const v = clamp01(value.current);
    fill.current?.scale.set(1, Math.max(0.001, v * height), 1);
    fill.current?.position.set(0, -height / 2 + (v * height) / 2, 0);
  });
  return (
    <group ref={grp} position={position}>
      <mesh>
        <boxGeometry args={[0.1, height, 0.1]} />
        <meshBasicMaterial color="#9fb2c6" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh ref={fill}>
        <boxGeometry args={[0.07, 1, 0.07]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {label && show ? (
        <StoryTag position={[0, height / 2 + 0.16, 0]} kind="concept" minor>
          {label}
        </StoryTag>
      ) : null}
    </group>
  );
}
