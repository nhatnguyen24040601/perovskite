import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { L } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import {
  CellStack,
  Flashes,
  Lattice,
  SLAB_ATOMS,
  SLAB_RADII,
  StoryTag,
  Swarm,
  burst,
  hashOffset,
  jitter,
  makeCellState,
  slabPoint,
  stepDur,
  useStoryClock,
  type Atom,
  type FlashApi,
  type SwarmApi,
} from "./storyKit";
import { COLOR, STACK, between, clamp01, pathLength, along, type V3 } from "./world";

const ETL_Y = STACK.top + 0.12;
const HTL_Y = STACK.top - STACK.thin - 0.12;

/* ── the defects (half-cell coordinates of the slab lattice) ── */
const HALIDE_VAC: V3 = slabPoint(7, 1, 6);
const CATION_VAC: V3 = slabPoint(12, 0, 4);
const SURFACE_X: V3 = slabPoint(3, 2, 7);
const SURFACE_A: V3 = slabPoint(2, 2, 8);
const GRAIN_X = 1.17;
const TRAP: V3 = slabPoint(11, 1, 9);

const is = (a: Atom, kind: Atom["kind"], h: V3) =>
  a.kind === kind && a.h[0] === h[0] && a.h[1] === h[1] && a.h[2] === h[2];
const REMOVED: { kind: Atom["kind"]; h: V3 }[] = [
  { kind: "X", h: [7, 1, 6] },
  { kind: "A", h: [12, 0, 4] },
  { kind: "X", h: [3, 2, 7] },
  { kind: "A", h: [2, 2, 8] },
];

/* ── routes: constant speed with short stops where the charge meets a defect ── */
type Route = { pts: V3[]; len: number; keys: [number, number][]; total: number };

function makeRoute(pts: V3[], speed: number, stops: Record<number, number> = {}): Route {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1]! + pathLength([pts[i - 1]!, pts[i]!]));
  const len = cum[cum.length - 1]!;
  const keys: [number, number][] = [[0, 0]];
  let time = 0;
  for (let i = 1; i < pts.length; i++) {
    time += (cum[i]! - cum[i - 1]!) / speed;
    keys.push([time, cum[i]! / len]);
    const hold = stops[i];
    if (hold) {
      time += hold;
      keys.push([time, cum[i]! / len]);
    }
  }
  return { pts, len, keys, total: time };
}

function uAt(r: Route, t: number): number {
  const k = r.keys;
  if (t <= 0) return 0;
  for (let i = 1; i < k.length; i++) {
    if (t <= k[i]![0]) {
      const a = k[i - 1]!;
      const b = k[i]!;
      return a[1] + (b[1] - a[1]) * clamp01((t - a[0]) / Math.max(1e-6, b[0] - a[0]));
    }
  }
  return 1;
}

const SPEED = 0.6;
const ROUTE_A = makeRoute(
  [
    [-1.65, 0.02, 0.0],
    [-1.2, 0.04, -0.1],
    [HALIDE_VAC[0], 0.06, HALIDE_VAC[2] - 0.08],
    [-0.3, 0.02, 0.0],
    [0.2, 0.05, -0.1],
    [0.7, 0.0, 0.05],
    [GRAIN_X, 0.05, 0.0],
    [1.4, 0.15, 0.08],
    [1.55, ETL_Y, 0.1],
  ],
  SPEED,
  { 2: 1.0, 6: 0.55 },
);
const ROUTE_B = makeRoute(
  [
    [-1.2, 0.0, -0.65],
    [-0.5, 0.05, -0.6],
    [CATION_VAC[0], -0.05, CATION_VAC[2] - 0.08],
    [0.8, 0.05, -0.3],
    [1.35, 0.12, -0.2],
    [1.5, ETL_Y, -0.15],
  ],
  SPEED,
  { 2: 0.8 },
);
const ROUTE_TRAP = makeRoute(
  [
    [-1.4, 0.0, 0.7],
    [-0.8, 0.05, 0.65],
    [-0.38, 0.02, 0.6],
    [TRAP[0] - 0.16, 0.03, TRAP[2]],
  ],
  SPEED,
);
const ROUTE_HOLE = makeRoute(
  [
    [0.95, -0.12, 0.72],
    [0.5, -0.05, 0.64],
    [TRAP[0] + 0.14, 0.0, TRAP[2]],
  ],
  0.5,
);
/** perfect crystal: three straight(ish) runs */
const ROUTE_P = [
  makeRoute(
    [
      [-1.6, 0.02, 0.0],
      [0, 0.04, 0.05],
      [1.55, ETL_Y, 0.1],
    ],
    SPEED,
  ),
  makeRoute(
    [
      [-1.2, 0.0, -0.65],
      [0, 0.04, -0.6],
      [1.5, ETL_Y, -0.15],
    ],
    SPEED,
  ),
  makeRoute(
    [
      [-1.4, 0.0, 0.7],
      [0, 0.04, 0.65],
      [1.55, ETL_Y, 0.55],
    ],
    SPEED,
  ),
];
const ROUTE_HOLE_A = makeRoute(
  [
    [-1.65, 0.02, 0.0],
    [-1.6, HTL_Y, 0.02],
  ],
  0.35,
);

function onRoute(r: Route, t: number): V3 {
  return along(r.pts, uAt(r, t), r.len);
}

function Ring({
  at,
  color,
  delay = 0,
  size = 0.13,
}: {
  at: V3;
  color: string;
  delay?: number;
  size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const k = 1 + Math.sin(clock.elapsedTime * 3.2 - delay) * 0.12;
    ref.current.scale.setScalar(k);
  });
  return (
    <mesh ref={ref} position={at}>
      <torusGeometry args={[size, 0.011, 8, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
}

export function DefectsScene({ step }: { step: number }) {
  const mode = useSim((s) => s.defectMode);
  const perfect = step === 3 && mode === "perfect";
  const showDefects = !perfect;
  const trapOn = !perfect && step >= 2;
  const clock = useStoryClock(step, stepDur("defects", step), 2);
  const state = useRef(makeCellState()).current;

  const electrons = useRef<SwarmApi>(null);
  const holes = useRef<SwarmApi>(null);
  const trapGlow = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);

  /* lattice with the atoms removed */
  const hidden = useMemo(
    () => (a: Atom) => {
      if (!showDefects) return false;
      if (trapOn && is(a, "B", [11, 1, 9])) return true;
      return REMOVED.some((r) => is(a, r.kind, r.h));
    },
    [showDefects, trapOn],
  );
  const offset = useMemo(
    () =>
      (a: Atom): V3 | undefined => {
        if (!showDefects) return undefined;
        const d = Math.abs(a.p[0] - GRAIN_X);
        if (d > 0.2) return undefined;
        return hashOffset(a.id, 0.075);
      },
    [showDefects],
  );
  const style = useMemo(
    () => (a: Atom, out: { color: THREE.Color }) => {
      if (showDefects && Math.abs(a.p[0] - GRAIN_X) <= 0.2)
        out.color.lerp(new THREE.Color("#ff9a4c"), 0.55);
    },
    [showDefects],
  );

  const T0 = 0.8;
  const tCapture = ROUTE_TRAP.total + 0.9;
  const tHole = T0 + tCapture + 1.0;
  const tMeet = tHole + ROUTE_HOLE.total;

  useFrame(() => {
    const t = clock.current.t;
    const e = electrons.current;
    const h = holes.current;
    const g = trapGlow.current;
    const f = flashes.current;
    if (!e || !h || !g || !f) return;
    for (let i = 0; i < 3; i++) e.hide(i);
    h.hide(0);
    for (let i = 0; i < 4; i++) f.hide(i);
    let etl = 0;
    let htl = 0;

    const sc = 1.45;
    const trapPulse = 1 + 0.2 * Math.sin(t * 4.5);
    if (trapOn) g.set(0, TRAP[0], TRAP[1], TRAP[2], trapPulse);
    else g.hide(0);

    if (step === 1) {
      const lt = t - T0;
      if (lt >= 0) {
        const u = uAt(ROUTE_A, lt);
        const p = onRoute(ROUTE_A, lt);
        const w = jitter(1, t, u > 0 && u < 1 ? 0.012 : 0.004);
        if (u >= 1) etl = 1;
        e.set(0, p[0] + w[0], p[1] + w[1], p[2] + w[2], sc);
        const hu = ROUTE_HOLE_A.keys.length ? uAt(ROUTE_HOLE_A, lt) : 0;
        const hp = along(ROUTE_HOLE_A.pts, hu, ROUTE_HOLE_A.len);
        h.set(0, hp[0], hp[1], hp[2], sc);
        if (hu >= 1) htl = 1;
      } else {
        e.set(0, ROUTE_A.pts[0]![0], ROUTE_A.pts[0]![1], ROUTE_A.pts[0]![2], sc);
        h.set(0, ROUTE_A.pts[0]![0], ROUTE_A.pts[0]![1] - 0.05, ROUTE_A.pts[0]![2], sc);
      }
    } else if (step === 2) {
      const lt = t - 0.6;
      // the electron walks to the trap, spirals in and stays
      if (lt >= 0 && lt < ROUTE_TRAP.total + 0.9) {
        if (lt < ROUTE_TRAP.total) {
          const p = onRoute(ROUTE_TRAP, lt);
          e.set(0, p[0], p[1], p[2], sc);
        } else {
          const k = (lt - ROUTE_TRAP.total) / 0.9;
          const r = 0.16 * (1 - k);
          const ang = k * Math.PI * 4;
          e.set(0, TRAP[0] - r * Math.cos(ang), TRAP[1] + r * Math.sin(ang), TRAP[2], sc);
        }
      } else if (lt >= ROUTE_TRAP.total + 0.9 && t < tMeet + 0.9) {
        const j = jitter(2, t, 0.006);
        if (t < tMeet) e.set(0, TRAP[0] + j[0], TRAP[1] + j[1], TRAP[2], sc);
      } else if (lt < 0) {
        const p0 = ROUTE_TRAP.pts[0]!;
        e.set(0, p0[0], p0[1], p0[2], sc);
      }
      // then a hole arrives and the two recombine
      const lh = t - tHole;
      if (lh >= 0 && t < tMeet) {
        const p = onRoute(ROUTE_HOLE, lh);
        h.set(0, p[0], p[1], p[2], sc);
      }
      const fb = burst(t, tMeet, 1.3, 0.5);
      if (fb) f.set(0, TRAP[0], TRAP[1], TRAP[2], fb.r, fb.a);
    } else if (step === 3 || step === 4) {
      const real = step === 4 || mode === "real";
      for (let i = 0; i < 3; i++) {
        const lt = t - (0.6 + i * 0.9);
        const start = real ? (i === 0 ? ROUTE_A : i === 1 ? ROUTE_B : ROUTE_TRAP) : ROUTE_P[i]!;
        if (lt < 0) {
          const p0 = start.pts[0]!;
          e.set(i, p0[0], p0[1], p0[2], sc);
          continue;
        }
        if (real && i === 2) {
          if (lt < ROUTE_TRAP.total) {
            const p = onRoute(ROUTE_TRAP, lt);
            e.set(i, p[0], p[1], p[2], sc);
          } else {
            const k = (lt - ROUTE_TRAP.total) / 0.9;
            if (k < 1) {
              const r = 0.16 * (1 - k);
              const ang = k * Math.PI * 4;
              e.set(i, TRAP[0] - r * Math.cos(ang), TRAP[1] + r * Math.sin(ang), TRAP[2], sc);
            } else if (k < 2.2) {
              e.set(i, TRAP[0], TRAP[1], TRAP[2], sc * (1 - between(k, 1.4, 2.2)));
              const fb = burst(k, 1.0, 0.9, 0.35);
              if (fb) f.set(3, TRAP[0], TRAP[1], TRAP[2], fb.r, fb.a);
            }
          }
          continue;
        }
        const r = real ? start : ROUTE_P[i]!;
        const u = uAt(r, lt);
        const p = onRoute(r, lt);
        const w = jitter(i + 7, t, u > 0 && u < 1 ? 0.012 : 0.004);
        e.set(i, p[0] + w[0], p[1] + w[1], p[2] + w[2], sc);
        if (u >= 1) etl = 1;
      }
    }

    state.etl += (etl - state.etl) * 0.1;
    state.htl += (htl - state.htl) * 0.1;
    e.flush();
    h.flush();
    g.flush();
    f.flush();
  });

  return (
    <group>
      <CellStack
        state={state}
        layerLabels={false}
        lattice={
          <Lattice
            zoom={0.8}
            focus={{ c: [0, 0, 0.1], r: 1.5, min: 0.55, cull: 2.4 }}
            key={`${showDefects}-${trapOn}`}
            atoms={SLAB_ATOMS}
            radii={SLAB_RADII}
            hidden={hidden}
            offset={offset}
            style={style}
            styleKey={`${showDefects}`}
            bondOpacity={0.35}
          />
        }
      />

      {/* the grain boundary and the defect markers */}
      {showDefects ? (
        <group>
          <mesh position={[GRAIN_X, 0, 0]}>
            <boxGeometry args={[0.05, STACK.thin, 2.2]} />
            <meshBasicMaterial color="#ff9a4c" transparent opacity={0.22} depthWrite={false} />
          </mesh>
          <Ring at={HALIDE_VAC} color={COLOR.good} />
          <mesh position={HALIDE_VAC}>
            <sphereGeometry args={[SLAB_RADII.X * 1.15, 12, 8]} />
            <meshBasicMaterial color={COLOR.good} wireframe transparent opacity={0.6} />
          </mesh>
          <Ring at={CATION_VAC} color={COLOR.good} delay={0.8} />
          <mesh position={CATION_VAC}>
            <sphereGeometry args={[SLAB_RADII.A * 1.1, 12, 8]} />
            <meshBasicMaterial color={COLOR.good} wireframe transparent opacity={0.6} />
          </mesh>
          <Ring at={[GRAIN_X, 0.05, 0.35]} color="#ff9a4c" delay={1.6} size={0.16} />
          <Ring
            at={[(SURFACE_X[0] + SURFACE_A[0]) / 2, 0.19, (SURFACE_X[2] + SURFACE_A[2]) / 2]}
            color="#ff9a4c"
            delay={2.4}
            size={0.17}
          />
        </group>
      ) : null}

      <Swarm ref={electrons} count={3} color={COLOR.electron} radius={0.066} />
      <Swarm ref={holes} count={1} color={COLOR.hole} radius={0.058} />
      <Swarm
        ref={trapGlow}
        count={1}
        color={COLOR.trap}
        radius={0.07}
        halo={3.4}
        haloOpacity={0.3}
        emissive={1.8}
      />
      <Flashes ref={flashes} count={4} color="#ff4a4a" />

      {/* labels */}
      {showDefects && (step === 0 || step === 4) ? (
        <>
          <StoryTag position={[HALIDE_VAC[0], 0.42, 0]} kind="good" sub={L.halideVac}>
            {L.vacancy}
          </StoryTag>
          <StoryTag
            position={[CATION_VAC[0] + 0.15, -0.5, CATION_VAC[2]]}
            kind="good"
            sub={L.cationVac}
          >
            {L.vacancy}
          </StoryTag>
          <StoryTag position={[GRAIN_X + 0.1, 0.55, 0]} kind="bad" sub={L.grainBoundary}>
            {L.defect}
          </StoryTag>
          <StoryTag position={[-1.55, 0.52, 0.3]} kind="bad" sub={L.surfaceDefect}>
            {L.defect}
          </StoryTag>
        </>
      ) : null}
      {showDefects && (step === 1 || step === 3) ? (
        <>
          <StoryTag position={[HALIDE_VAC[0], 0.42, 0]} kind="good" minor>
            {L.vacancy}
          </StoryTag>
          <StoryTag position={[GRAIN_X + 0.1, 0.55, 0]} kind="bad" minor>
            {L.defect}
          </StoryTag>
        </>
      ) : null}
      {step === 1 ? <ContinueTag clock={clock} /> : null}
      {trapOn && step >= 2 ? (
        <StoryTag position={[TRAP[0], 0.42, TRAP[2]]} kind="bad">
          {L.deepTrap}
        </StoryTag>
      ) : null}
      {step === 2 ? <RecombTags clock={clock} tMeet={tMeet} /> : null}
      {step === 3 && !perfect ? (
        <StoryTag position={[-0.9, -0.62, 0.2]} kind="good" minor>
          {L.continues}
        </StoryTag>
      ) : null}
    </group>
  );
}

/** "Charge continues" while the electron slips past the vacancy. */
function ContinueTag({ clock }: { clock: { current: { t: number } } }) {
  const ref = useRef<THREE.Group>(null);
  const tStop = 0.8 + ROUTE_A.keys[2]![0];
  useFrame(() => {
    const t = clock.current.t;
    if (ref.current) ref.current.visible = t > tStop - 0.3 && t < tStop + 2.6;
  });
  return (
    <group ref={ref} visible={false}>
      <StoryTag position={[HALIDE_VAC[0] + 0.4, -0.38, 0]} kind="good">
        {L.continues}
      </StoryTag>
    </group>
  );
}

function RecombTags({ clock, tMeet }: { clock: { current: { t: number } }; tMeet: number }) {
  const a = useRef<THREE.Group>(null);
  useFrame(() => {
    if (a.current) a.current.visible = clock.current.t > tMeet - 0.05;
  });
  return (
    <group ref={a} visible={false}>
      <StoryTag position={[TRAP[0], -0.32, TRAP[2]]} kind="bad">
        {L.recombination}
      </StoryTag>
      <StoryTag position={[TRAP[0], -0.62, TRAP[2]]} kind="bad">
        {L.deepLoss}
      </StoryTag>
    </group>
  );
}
