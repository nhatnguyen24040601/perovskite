import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { L, LD } from "@/lib/sim/story";
import {
  DEG,
  DegradeBase,
  DynLattice,
  Molecules,
  WindowFrame,
  makeDegCtl,
  type MolApi,
} from "./degradeKit";
import { EDGES, GRAINS, HOT, OUTLINE, SURFACE_Y, VERTS, edgeBetween, startVerts, vertPos, walk } from "./grains";
import {
  Flashes,
  StoryTag,
  buildAtoms,
  burst,
  hashOffset,
  makeCellState,
  stepDur,
  useStoryClock,
  type FlashApi,
} from "./storyKit";
import { Follow, sampleTrack, type Key, type Pose } from "./tracks";
import { between, clamp01, hash1, smooth, type V3 } from "./world";

const N = 12;
const SURF = SURFACE_Y + 0.07;
/** Global time at which each step starts, so water keeps its place from step to step. */
const T3 = 10;
const T4 = 18;
const REACT: Record<number, number> = { 1: T4 + 3.4, 4: T4 + 6.0, 7: T4 + 8.6, 10: T4 + 11.0 };

/* ── the cut-away lattice window at the seam ── */
const A = 0.2;
const ATOMS = buildAtoms(7, 2, 3, A);
const RADII = { A: 0.032, B: 0.023, X: 0.019 };
const WIN_Y = 0.02;
const WIN_SIZE: V3 = [1.4, 0.4, 0.6];
/** Slot between the two grains: the atoms on these half-cell planes are missing. */
const inSlot = (hx: number) => hx >= 6 && hx <= 8;
const SLOT_HALF = 0.17;

/* ── routes of the water molecules ── */
type Plan = { keys: Key[]; edgeAt: [number, number][] };

const faceIds = GRAINS.filter((g) => !HOT.grains.includes(g.id))
  .map((g) => ({ g, d: Math.hypot(g.x - HOT.x, g.z - HOT.z) }))
  .sort((a, b) => a.d - b.d)
  .slice(1, 5)
  .map((e) => e.g.id);
const STARTS = startVerts(N, 11);
const FACE = new Set<number>([8, 9, 10, 11]);
const EDGE_ARRIVE = new Float32Array(EDGES.length).fill(1e9);

function slotWait(m: number): V3 {
  const a = m * 2.4;
  const r = 0.06 + 0.02 * (m % 3);
  const v = VERTS[HOT.front]!;
  return [v.x + Math.cos(a) * r, SURF + 0.03 + 0.012 * (m % 4), v.z + Math.sin(a) * r];
}

function slotPlace(m: number): V3 {
  return [
    HOT.x + (hash1(m * 3.1) - 0.5) * 2 * (SLOT_HALF - 0.05),
    0.13 - 0.3 * hash1(m * 5.7),
    HOT.z + 0.14 - 0.55 * hash1(m * 7.3),
  ];
}

function plan(m: number): Plan {
  const keys: Key[] = [];
  const edgeAt: [number, number][] = [];
  const face = FACE.has(m);
  const ts = 0.3 + (m % 8) * 0.3 + (face ? 0.4 : 0);
  let start: number;
  let t = ts;
  if (face) {
    const g = GRAINS[faceIds[m - 8]!]!;
    const land: V3 = [g.x + (hash1(m) - 0.5) * 0.1, SURF, g.z + (hash1(m + 9) - 0.5) * 0.1];
    keys.push({ t, p: [land[0], 1.7 + hash1(m + 3) * 0.4, land[2]] });
    t += 1.5;
    keys.push({ t, p: land });
    t += 0.5;
    keys.push({ t, p: [land[0], SURF + 0.05, land[2]] });
    keys.push({ t: t + 0.4, p: land });
    t += 0.8;
    start = OUTLINE[g.id]![(m * 2) % 6]!;
    const c = vertPos(start, SURF);
    t += Math.hypot(c[0] - land[0], c[2] - land[2]) / 0.35;
    keys.push({ t, p: c });
  } else {
    start = STARTS[m]!;
    const v = VERTS[start]!;
    keys.push({
      t,
      p: [v.x + (hash1(m * 2.2) - 0.5) * 0.2, 1.7 + hash1(m + 3) * 0.4, v.z + (hash1(m * 4.4) - 0.5) * 0.2],
    });
    t += 1.5;
    keys.push({ t, p: vertPos(start, SURF) });
  }
  const route = walk(start, HOT.front);
  for (let i = 1; i < route.length; i++) {
    const a = VERTS[route[i - 1]!]!;
    const b = VERTS[route[i]!]!;
    const e = edgeBetween(route[i - 1]!, route[i]!);
    if (e >= 0) edgeAt.push([e, t]);
    t += Math.hypot(b.x - a.x, b.z - a.z) / 0.72;
    keys.push({ t, p: vertPos(route[i]!, SURF) });
  }
  const wait = slotWait(m);
  keys.push({ t: t + 0.4, p: wait });
  // step 3: down into the seam, one after another
  const td = T3 + 1.4 + 0.38 * m;
  keys.push({ t: Math.max(td - 0.05, t + 0.5), p: wait });
  const top: V3 = [HOT.x, 0.3, VERTS[HOT.front]!.z];
  keys.push({ t: td + 0.5, p: top });
  const place = slotPlace(m);
  keys.push({ t: td + 1.7, p: place });
  // wandering inside the seam
  let tw = td + 1.7;
  const end = REACT[m] ?? 60;
  for (let k = 1; tw < end - 0.9; k++) {
    tw += 1.3 + hash1(m * 1.7 + k) * 0.8;
    keys.push({
      t: tw,
      p: [
        HOT.x + (hash1(m * 11 + k * 3.3) - 0.5) * 2 * (SLOT_HALF - 0.05),
        0.14 - 0.3 * hash1(m * 13 + k * 1.9),
        HOT.z + 0.15 - 0.55 * hash1(m * 17 + k * 2.7),
      ],
    });
  }
  const tr = REACT[m];
  if (tr !== undefined) {
    const side = m % 2 === 0 ? 1 : -1;
    keys.push({ t: tr - 0.6, p: sampleTrack(keys, tr - 0.6).p });
    keys.push({ t: tr, p: [HOT.x + side * (SLOT_HALF + 0.015), 0.04 - 0.1 * hash1(m), HOT.z + 0.05 - 0.2 * hash1(m + 4)] });
    keys.push({ t: tr + 0.45, p: [HOT.x + side * (SLOT_HALF + 0.015), 0.04 - 0.1 * hash1(m), HOT.z + 0.05 - 0.2 * hash1(m + 4)], s: 0 });
  }
  return { keys, edgeAt };
}

const PLANS: Plan[] = Array.from({ length: N }, (_, m) => plan(m));
for (const p of PLANS) for (const [e, t] of p.edgeAt) EDGE_ARRIVE[e] = Math.min(EDGE_ARRIVE[e]!, t);

/** The end of a plan is time-limited: keep every molecule's track long enough for all steps. */
const REACT_AT = Object.values(REACT);

/** Damage of the film at global damage level `D`, for the grain at (x, z). */
function grainDamage(D: number, x: number, z: number): number {
  const near = Math.exp(-Math.abs(x - HOT.x) * 1.7);
  const front = 0.4 + 0.6 * clamp01((z + 1.2) / 2.4);
  return D * near * front;
}

const PLATES: { p: V3; r: number; rot: [number, number, number]; at: number }[] = [
  { p: [0.27, -0.02, 0.02], r: 0.07, rot: [0.3, 0.2, 0.1], at: 0.3 },
  { p: [0.24, -0.1, -0.12], r: 0.06, rot: [-0.2, 0.9, 0.2], at: 0.45 },
  { p: [-0.26, -0.05, 0.1], r: 0.06, rot: [0.1, 0.4, -0.3], at: 0.55 },
  { p: [0.3, 0.08, 0.14], r: 0.05, rot: [0.5, 0.1, 0.2], at: 0.65 },
  { p: [-0.24, -0.13, -0.08], r: 0.05, rot: [-0.3, 0.7, 0.1], at: 0.75 },
];

const GOLD = new THREE.Color(DEG.pbi2);
const HEX_PLATE = new THREE.CylinderGeometry(1, 1, 0.16, 6);

export function MoistureScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("dmoist", step), 2);
  const cell = useRef(makeCellState()).current;
  const ctl = useRef(makeDegCtl(cell)).current;
  const water = useRef<MolApi>(null);
  const flashes = useRef<FlashApi>(null);
  const plateRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tag = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const winAlpha = useRef(0);
  const D = useRef(0);
  const open = useRef(0);
  const T = useRef(0);

  useFrame(() => {
    const t = clock.current.t;
    const w = water.current;
    const f = flashes.current;
    if (!w || !f) return;

    // global time of the water story
    const base = step === 2 ? 0 : step === 3 ? T3 : step === 4 ? T4 : 0;
    const G = base + t;
    T.current = G;

    // layers lift away to show the grains, then come back
    cell.lift =
      step === 0 ? 0 : step === 1 ? between(t, 0.3, 2.8) : step <= 4 ? 1 : 1 - between(t, 1.6, 4.0);
    // the cut-away window
    ctl.grains.open =
      step === 3 ? between(t, 0.2, 1.8) : step === 4 ? 1 : step === 5 ? 1 - between(t, 0.2, 1.6) : 0;
    open.current = smooth(ctl.grains.open);
    winAlpha.current = open.current * 0.55;

    // damage
    const Dm = step < 4 ? 0 : step === 4 ? 0.92 * Math.pow(clamp01(t / 13), 1.35) : 0.92;
    D.current = Dm;
    cell.dmg = Dm * 0.55 * smooth(step === 5 ? between(t, 1.0, 3.5) : 1);
    for (const g of GRAINS) {
      ctl.grains.dmg[g.id] = HOT.grains.includes(g.id) ? Dm : grainDamage(Dm, g.x, g.z);
    }
    for (const e of EDGES) {
      const wet = step >= 2 ? smooth((G - EDGE_ARRIVE[e.id]! - 0.2) / 0.7) : 0;
      ctl.grains.wet[e.id] = step >= 5 ? wet * 0.5 : wet;
      ctl.grains.edmg[e.id] = grainDamage(Dm, e.mx, e.mz) * 0.9;
    }

    // charges and the circuit: only the healthy cell (step 0) and the result (step 5) show them
    const flow = ctl.flow;
    flow.tags = step === 0 ? 1 : 0;
    flow.light = step === 0 ? 1 : step === 5 ? between(t, 2.0, 3.2) : 0;
    flow.loss = step === 5 ? 0.92 : 0;
    flow.zx0 = HOT.x - 0.85;
    flow.zx1 = HOT.x + 0.85;
    ctl.sun = step === 0 || step === 5 ? 1 : 0.55;
    ctl.zone.x0 = flow.zx0;
    ctl.zone.x1 = flow.zx1;
    ctl.zone.a = step === 5 ? between(t, 1.2, 3.2) : 0;
    ctl.gaugeShow = step === 0 || step === 5 ? 1 : 0;
    ctl.gauge = step === 5 ? 1 - 0.5 * between(t, 3.2, 8.0) : 1;
    if (step === 5 && t < 3.2) ctl.gauge = 1;

    // water
    f.hide(0);
    f.hide(1);
    f.hide(2);
    f.hide(3);
    tag.current.a = 0;
    for (let m = 0; m < N; m++) {
      if (step < 2 || step > 4) {
        w.hide(m);
        continue;
      }
      const s = sampleTrack(PLANS[m]!.keys, G);
      if (s.s < 0.02) {
        w.hide(m);
        continue;
      }
      w.set(m, s.p[0], s.p[1], s.p[2], (step === 2 ? 0.9 : 1.3) * s.s, G * 0.8 + m, G * 0.6 + m * 2, m * 0.7, step === 2 ? 0.12 : 0.05);
      if (m === 2 && s.s > 0.5) {
        tag.current.x = s.p[0];
        tag.current.y = s.p[1] + 0.2;
        tag.current.z = s.p[2];
        tag.current.a = 1;
      }
    }
    // a few molecules react with the wall, one at a time
    if (step === 4) {
      REACT_AT.forEach((tr, k) => {
        const m = Number(Object.keys(REACT)[k]);
        const b = burst(G, tr - 0.05, 0.9, 0.2);
        if (b) {
          const s = sampleTrack(PLANS[m]!.keys, tr);
          f.set(k, s.p[0], s.p[1], s.p[2], b.r, b.a * 1.2);
        }
      });
    }
    w.flush();
    f.flush();

    // PbI₂ plates grow with the damage
    PLATES.forEach((pl, i) => {
      const mesh = plateRefs.current[i];
      if (!mesh) return;
      const g = smooth((Dm - pl.at * 0.6) / 0.4) * open.current;
      mesh.scale.setScalar(Math.max(1e-4, pl.r * g));
      mesh.visible = g > 0.02;
    });
  });

  const frame = (a: (typeof ATOMS)[number], out: { pos: V3; scale: number; color: THREE.Color }) => {
    const hx = a.h[0];
    const t = clock.current.t;
    if (inSlot(hx)) {
      out.scale = 0;
      return;
    }
    const op = open.current;
    out.scale *= op;
    const dx = Math.abs(a.p[0]);
    const dy = 0.2 - a.p[1];
    const d = clamp01(D.current * 1.8 - dx * 2.0 - dy * 0.8);
    const wob = 0.004 + 0.012 * d;
    out.pos[0] += Math.sin(t * 5.1 + a.id) * wob;
    out.pos[1] += Math.sin(t * 4.3 + a.id * 1.7) * wob;
    if (d > 0) {
      const o = hashOffset(a.id, 0.05 * d);
      out.pos[0] += o[0] * smooth(d);
      out.pos[1] += o[1] * smooth(d);
      out.pos[2] += o[2] * smooth(d);
      if (a.kind !== "A") out.color.lerp(GOLD, smooth(d));
      else {
        // the A-site ions leave: they drift toward the seam and fade
        out.scale *= 1 - smooth((d - 0.25) / 0.45);
        out.pos[0] -= Math.sign(a.p[0]) * 0.05 * smooth(d);
      }
    }
  };

  const tagWater = step >= 2 && step <= 4;

  return (
    <group>
      <DegradeBase ctl={ctl} clock={clock} layerLabels={step === 0} sunTag={step === 0}>
        {/* lattice window at the seam */}
        <group position={[HOT.x, WIN_Y, HOT.z]}>
          <DynLattice atoms={ATOMS} radii={RADII} frame={frame} />
        </group>
        <WindowFrame center={[HOT.x, WIN_Y, HOT.z]} size={WIN_SIZE} alpha={winAlpha} color="#9fb2c6" />
        {PLATES.map((pl, i) => (
          <mesh
            key={i}
            ref={(m) => {
              plateRefs.current[i] = m;
            }}
            geometry={HEX_PLATE}
            position={[HOT.x + pl.p[0], WIN_Y + pl.p[1], HOT.z + pl.p[2]]}
            rotation={pl.rot}
            visible={false}
          >
            <meshStandardMaterial
              color={DEG.pbi2}
              emissive={DEG.pbi2}
              emissiveIntensity={0.75}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </DegradeBase>

      <Molecules ref={water} kind="h2o" count={N} />
      <Flashes ref={flashes} count={4} color="#ffe08a" />
      {tagWater ? (
        <Follow pose={tag}>
          <StoryTag position={[0, 0, 0]} kind="particle">
            {LD.water}
          </StoryTag>
        </Follow>
      ) : null}

      {/* labels */}
      {step === 0 ? (
        <>
          <StoryTag position={[3.15, -0.09, 0]} kind="good" minor>
            {L.current}
          </StoryTag>
        </>
      ) : null}
      {step === 1 ? (
        <>
          <StoryTag position={[-0.52, 0.34, 0]} kind="concept">
            {LD.grain}
          </StoryTag>
          <StoryTag position={[-0.78, 0.3, -0.45]} kind="concept">
            {LD.boundary}
          </StoryTag>
          <StoryTag position={[-2.35, 0.05, 0.9]} kind="layer">
            {LD.perovskite}
          </StoryTag>
        </>
      ) : null}
      {step === 2 ? (
        <StoryTag position={[HOT.x + 0.1, 0.42, HOT.z + 0.1]} kind="concept">
          {LD.boundary}
        </StoryTag>
      ) : null}
      {step === 3 ? (
        <>
          <StoryTag position={[HOT.x + 0.3, 0.36, HOT.z + 0.22]} kind="concept">
            {LD.boundary}
          </StoryTag>
          <StoryTag position={[HOT.x - 0.62, 0.12, HOT.z + 0.15]} kind="layer" minor>
            {LD.perovskite}
          </StoryTag>
        </>
      ) : null}
      {step === 4 ? (
        <>
          <StoryTag position={[HOT.x + 0.32, 0.36, HOT.z + 0.22]} kind="concept">
            {LD.boundary}
          </StoryTag>
          <StoryTag position={[HOT.x - 0.62, 0.14, HOT.z + 0.15]} kind="layer" minor>
            {LD.perovskite}
          </StoryTag>
          <StoryTag position={[HOT.x + 0.45, -0.28, HOT.z + 0.1]} kind="bad">
            {LD.degraded}
          </StoryTag>
          <StoryTag position={[HOT.x + 0.3, 0.1, HOT.z + 0.17]} kind="concept">
            {LD.pbi2}
          </StoryTag>
        </>
      ) : null}
      {step === 5 ? (
        <>
          <StoryTag position={[HOT.x, 0.3, HOT.z + 0.1]} kind="bad">
            {LD.degraded}
          </StoryTag>
          <StoryTag position={[HOT.x - 0.8, -0.62, 1.0]} kind="bad">
            {LD.poorCollect}
          </StoryTag>
          <StoryTag position={[3.15, -0.09, 0]} kind="good" minor>
            {L.current}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
