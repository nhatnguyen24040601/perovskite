import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { L, LD } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import {
  DegradeBase,
  DynLattice,
  Ghosts,
  WindowFrame,
  makeDegCtl,
  type GhostApi,
} from "./degradeKit";
import { GRAINS } from "./grains";
import {
  Arrow3,
  StoryTag,
  Swarm,
  buildAtoms,
  makeCellState,
  stepDur,
  useStoryClock,
  type Atom,
  type AtomOut,
  type SwarmApi,
} from "./storyKit";
import { Follow, type Pose } from "./tracks";
import { COLOR, between, clamp01, hash1, lerp, smooth, type V3 } from "./world";

/* ── the lattice: 10 × 2 × 1 cells, thin enough to read from the front ── */
const A = 0.2;
const ATOMS = buildAtoms(10, 2, 1, A);
const RADII = { A: 0.026, B: 0.02, X: 0.032 };
const WIN: V3 = [0, 0.02, 1.1];
const WIN_SIZE: V3 = [2.0, 0.4, 0.2];
const OPEN_IDS = GRAINS.filter((g) => g.row === 4 && Math.abs(g.x) < 1.25).map((g) => g.id);
const HALF_W = 1.0;
const GHOSTS = 10;

const siteOf = (h: V3): Atom => {
  const hit = ATOMS.find(
    (a) => a.kind === "X" && a.h[0] === h[0] && a.h[1] === h[1] && a.h[2] === h[2],
  );
  if (!hit) throw new Error(`no halide site at ${h.join(",")}`);
  return hit;
};
const atomOf = (kind: Atom["kind"], h: V3): Atom =>
  ATOMS.find((a) => a.kind === kind && a.h[0] === h[0] && a.h[1] === h[1] && a.h[2] === h[2])!;

/**
 * Vacancy-mediated hopping. Each chain is four neighbouring halide sites in a zig-zag along x.
 * Site 0 is empty; the ion on site 1 hops into it, then the ion on site 2 hops into site 1, and so on.
 * The empty site walks to the right while every ion moves one step to the left (toward the + side).
 */
const CHAIN_START: [number, number][] = [
  [8, 3],
  [4, 1],
  [14, 3],
  [10, 1],
  [2, 3],
  [16, 1],
];
type Chain = { sites: Atom[]; t0: number };
const CHAINS: Chain[] = CHAIN_START.map(([x, y], k) => ({
  sites: [siteOf([x, y, 1]), siteOf([x + 1, y, 2]), siteOf([x + 2, y, 1]), siteOf([x + 3, y, 2])],
  t0: 0.8 + k * 1.6,
}));
const HOP_GAP = 1.4;
const HOP_LEN = 0.9;
/** role of an atom in the hopping story */
const ROLE = new Map<number, { k: number; i: number }>();
CHAINS.forEach((c, k) => c.sites.forEach((a, i) => ROLE.set(a.id, { k, i })));

/** Sites that are simply empty (always), so the "vacancies are pathways" step has company. */
const EXTRA_VAC = ([[9, 1, 2], [1, 1, 2], [13, 3, 2], [19, 3, 2]] as V3[]).map(siteOf);
const VACANT = new Set<number>(EXTRA_VAC.map((a) => a.id));
CHAINS.forEach((c) => VACANT.add(c.sites[0]!.id));

/** Atoms the labels point at. */
const A_SITE = atomOf("A", [6, 4, 2]);
const PB = atomOf("B", [9, 3, 1]);
const LABEL_I = siteOf([7, 3, 2]);
const LABEL_BR = siteOf([15, 1, 2]);

const BR = new THREE.Color(COLOR.bromide);
const IOD = new THREE.Color(COLOR.iodide);
const FLASH = new THREE.Color("#ffffff");

const rnd = (a: Atom) => hash1(a.id * 1.37 + 5);
/** Share of iodide at position x once the composition has shifted by `P` (0 → 1). */
const pIodide = (x: number, P: number) => Math.min(0.97, Math.max(0.03, 0.5 - (x / HALF_W) * 0.47 * P));
const isIodide = (a: Atom, P: number): boolean => {
  if (ROLE.has(a.id) || a === LABEL_I) return true;
  if (a === LABEL_BR) return false;
  return rnd(a) < pIodide(a.p[0], P);
};

const world = (a: Atom): V3 => [WIN[0] + a.p[0], WIN[1] + a.p[1], WIN[2] + a.p[2]];

/* ── the composition strip: I Br I Br I Br → I I I | Br Br Br ── */
const STRIP_N = 12;
const STRIP_X = (i: number) => (i - (STRIP_N - 1) / 2) * 0.17;
const STRIP_Y = 0.66;
const strip0 = (i: number) => i;
const stripTarget = (i: number) => (i % 2 === 0 ? i / 2 : STRIP_N / 2 + (i - 1) / 2);

/* ── the bandgap ribbon ── */
const RIB_Y = 1.02;
const eg = (x: number) => lerp(1.6, 2.0, smooth((x + 0.25) / 0.5));
function ribbonGeometry(): { fill: THREE.BufferGeometry; lines: THREE.BufferGeometry } {
  const n = 40;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const linePos: number[] = [];
  const lineCol: number[] = [];
  const cI = new THREE.Color(COLOR.iodide);
  const cB = new THREE.Color(COLOR.bromide);
  const c = new THREE.Color();
  for (let i = 0; i <= n; i++) {
    const x = -HALF_W + (2 * HALF_W * i) / n;
    const e = eg(x);
    const half = 0.12 * e;
    c.copy(cI).lerp(cB, smooth((x + 0.25) / 0.5));
    pos.push(x, RIB_Y - half, 0, x, RIB_Y + half, 0);
    col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    if (i > 0) {
      const k = (i - 1) * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      const px = -HALF_W + (2 * HALF_W * (i - 1)) / n;
      const pe = 0.12 * eg(px);
      linePos.push(px, RIB_Y - pe, 0, x, RIB_Y - half, 0, px, RIB_Y + pe, 0, x, RIB_Y + half, 0);
      for (let q = 0; q < 4; q++) lineCol.push(c.r, c.g, c.b);
    }
  }
  const fill = new THREE.BufferGeometry();
  fill.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  fill.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  fill.setIndex(idx);
  const lines = new THREE.BufferGeometry();
  lines.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
  lines.setAttribute("color", new THREE.Float32BufferAttribute(lineCol, 3));
  return { fill, lines };
}

const defaultField = (step: number) => step >= 3;

export function IonsScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("dion", step), 2);
  const cell = useRef(makeCellState()).current;
  const ctl = useRef(makeDegCtl(cell, OPEN_IDS)).current;
  const ghosts = useRef<GhostApi>(null);
  const ionFx = useRef<SwarmApi>(null);
  const strip = useRef<SwarmApi>(null);
  const winAlpha = useRef(0);
  const open = useRef(0);
  const P = useRef(0);
  const hops = useRef<number[][]>(CHAINS.map(() => [0, 0, 0]));
  const fld = useRef(0);
  const plus = useRef<THREE.Mesh>(null);
  const minus = useRef<THREE.Mesh>(null);
  const hopTag = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const ribbon = useRef<THREE.Group>(null);
  const ribbonGeo = useMemo(() => ribbonGeometry(), []);
  const fieldMode = useSim((s) => s.fieldMode);
  const showField = fieldMode === "on" || (fieldMode === "auto" && defaultField(step));

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = clock.current.t;
    const gh = ghosts.current;
    const fx = ionFx.current;
    const st = strip.current;
    if (!gh || !fx || !st) return;
    const mode = useSim.getState().fieldMode;
    const on = mode === "on" ? 1 : mode === "off" ? 0 : defaultField(step) ? 1 : 0;
    fld.current = lerp(fld.current, on, Math.min(1, dt * 4));

    // layers, window
    cell.lift = step === 0 ? 0 : step === 1 ? between(t, 0.2, 2.2) : step <= 6 ? 1 : 1 - between(t, 1.2, 3.6);
    ctl.grains.open = step === 1 ? between(t, 0.2, 1.8) : step >= 2 && step <= 6 ? 1 : step === 7 ? 1 - between(t, 0.2, 1.4) : 0;
    open.current = smooth(ctl.grains.open);
    winAlpha.current = open.current * 0.5;

    // composition: drifts during step 5, stays shifted afterwards
    const live = on > 0.5;
    const p = !live ? 0 : step < 5 ? 0 : step === 5 ? between(t, 1.0, 9.5) : 1;
    P.current = p;

    // the hops
    CHAINS.forEach((c, k) => {
      for (let i = 1; i <= 3; i++) {
        const start = c.t0 + (i - 1) * HOP_GAP;
        hops.current[k]![i - 1] = !live ? 0 : step < 4 ? 0 : step === 4 ? smooth((t - start) / HOP_LEN) : 1;
      }
    });

    // empty sites: the ones that were always there, and the walking vacancy of every chain
    const gAlpha = open.current * (step === 2 || step === 3 ? 0.85 : step === 4 ? 0.7 : 0);
    for (let i = 0; i < GHOSTS; i++) gh.hide(i);
    if (gAlpha > 0.01) {
      EXTRA_VAC.forEach((a, i) => {
        const w = world(a);
        gh.set(i, w[0], w[1], w[2], 0.04, gAlpha, "#ffffff");
      });
      CHAINS.forEach((c, k) => {
        const h = hops.current[k]!;
        const v = (h[0]! > 0.5 ? 1 : 0) + (h[1]! > 0.5 ? 1 : 0) + (h[2]! > 0.5 ? 1 : 0);
        const w = world(c.sites[v]!);
        gh.set(EXTRA_VAC.length + k, w[0], w[1], w[2], 0.04, gAlpha, "#ffffff");
      });
    }
    gh.flush();

    // glow on the ion that is hopping right now
    hopTag.current.a = 0;
    CHAINS.forEach((c, k) => {
      let shown = false;
      if (step === 4 && live) {
        for (let i = 1; i <= 3; i++) {
          const u = hops.current[k]![i - 1]!;
          if (u > 0.02 && u < 0.98) {
            const a = c.sites[i]!.p;
            const b = c.sites[i - 1]!.p;
            fx.set(k, WIN[0] + lerp(a[0], b[0], u), WIN[1] + lerp(a[1], b[1], u) + Math.sin(Math.PI * u) * 0.03, WIN[2] + lerp(a[2], b[2], u), 1);
            shown = true;
            if (k === 0 && i === 1) {
              hopTag.current.x = WIN[0] + lerp(a[0], b[0], u);
              hopTag.current.y = WIN[1] + lerp(a[1], b[1], u) + 0.22;
              hopTag.current.z = WIN[2] + a[2];
              hopTag.current.a = 1;
            }
          }
        }
      }
      if (!shown) fx.hide(k);
    });
    fx.flush();

    // composition strip
    for (let i = 0; i < STRIP_N; i++) {
      if (step !== 5 && step !== 6) {
        st.hide(i);
        continue;
      }
      const q = smooth(clamp01(p * 1.5 - 0.5 * (i / (STRIP_N - 1))));
      const x = lerp(STRIP_X(strip0(i)), STRIP_X(stripTarget(i)), q);
      const y = STRIP_Y + Math.sin(Math.PI * q) * 0.05 * (i % 2 === 0 ? 1 : -1);
      st.set(i, WIN[0] + x, y, WIN[2], open.current);
      st.tint(i, i % 2 === 0 ? COLOR.iodide : COLOR.bromide);
    }
    st.flush();

    // plates of the electric field
    const fa = fld.current;
    if (plus.current) {
      plus.current.visible = fa > 0.03;
      (plus.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * fa;
    }
    if (minus.current) {
      minus.current.visible = fa > 0.03;
      (minus.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * fa;
    }
    if (ribbon.current) ribbon.current.visible = step === 6;

    // the cell at the end: where the electrons are lost
    const f = ctl.flow;
    f.tags = step === 0 ? 1 : 0;
    f.light = step === 7 ? between(t, 1.5, 2.8) : step === 0 ? 1 : 0;
    f.loss = step === 7 ? 0.85 : 0;
    f.where = 0;
    f.zx0 = -2.0;
    f.zx1 = -0.3;
    ctl.sun = step === 0 || step === 7 ? 1 : 0.5;
    ctl.zone.x0 = step === 0 ? -1.15 : -1.95;
    ctl.zone.x1 = step === 0 ? 1.15 : -0.25;
    ctl.zone.color = step === 0 ? "#ffffff" : "#7a56e0";
    ctl.zone.a = step === 0 ? 0.18 + 0.1 * Math.sin(t * 3) : step === 7 ? between(t, 1.0, 2.5) : 0;
    ctl.zone2.x0 = 0.25;
    ctl.zone2.x1 = 1.95;
    ctl.zone2.a = step === 7 ? between(t, 1.0, 2.5) : 0;
    ctl.gaugeShow = step === 0 || step === 7 ? 1 : 0;
    ctl.gauge = step === 7 ? 1 - 0.45 * between(t, 3.2, 8) : 1;
    cell.dmg = 0;
    for (const g of GRAINS) ctl.grains.dmg[g.id] = 0;
  });

  const frame = (a: Atom, out: AtomOut) => {
    const t = clock.current.t;
    out.scale *= open.current;
    const hl = step === 2 ? 1 : 0;
    const field = fld.current;
    // thermal shake, a little stronger once the field is on
    const am = 0.004 + 0.003 * field;
    out.pos[0] += Math.sin(t * 5.1 + a.id) * am;
    out.pos[1] += Math.sin(t * 4.3 + a.id * 1.7) * am;
    out.pos[2] += Math.sin(t * 3.9 + a.id * 0.9) * am;

    if (a.kind === "X") {
      if (VACANT.has(a.id)) {
        out.scale = 0;
        return;
      }
      const iod = isIodide(a, P.current);
      if (iod) {
        out.color.copy(IOD);
        out.scale *= 1 + 0.2 * hl;
        out.color.multiplyScalar(1 + 0.35 * hl);
      } else {
        out.color.copy(BR);
        out.scale *= 0.88 - 0.1 * hl;
        out.color.multiplyScalar(1 - 0.35 * hl);
      }
      // a quick flash on the ions whose halide changes as the composition drifts
      if (step === 5) {
        const d = Math.abs(rnd(a) - pIodide(a.p[0], P.current));
        if (d < 0.025) out.color.lerp(FLASH, 0.6 * (1 - d / 0.025));
      }
      const role = ROLE.get(a.id);
      if (role && role.i >= 1) {
        const u = hops.current[role.k]![role.i - 1]!;
        const from = a.p;
        const to = CHAINS[role.k]!.sites[role.i - 1]!.p;
        out.pos[0] = lerp(from[0], to[0], u) + Math.sin(t * 5.1 + a.id) * am;
        out.pos[1] = lerp(from[1], to[1], u) + Math.sin(Math.PI * u) * 0.03 + Math.sin(t * 4.3 + a.id * 1.7) * am;
        out.pos[2] = lerp(from[2], to[2], u) + Math.sin(t * 3.9 + a.id * 0.9) * am;
        if (u > 0.02 && u < 0.98) out.scale *= 1.25;
      }
    } else if (hl) {
      out.color.multiplyScalar(0.6);
    }
  };

  return (
    <group>
      <DegradeBase ctl={ctl} clock={clock} layerLabels={step === 0} sunTag={step === 0}>
        <group position={WIN}>
          <DynLattice atoms={ATOMS} radii={RADII} frame={frame} />
        </group>
        <WindowFrame center={WIN} size={WIN_SIZE} alpha={winAlpha} color="#9fb2c6" />
        {/* the electric field: a + plate, a − plate, and arrows pointing from + to − */}
        <mesh ref={plus} position={[-1.12, 0.02, WIN[2]]} visible={false}>
          <boxGeometry args={[0.04, 0.6, 0.55]} />
          <meshBasicMaterial color="#ff5a47" transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh ref={minus} position={[1.12, 0.02, WIN[2]]} visible={false}>
          <boxGeometry args={[0.04, 0.6, 0.55]} />
          <meshBasicMaterial color="#4da3ff" transparent opacity={0} depthWrite={false} />
        </mesh>
        <group ref={ribbon} position={[WIN[0], 0, WIN[2]]} visible={false}>
          <mesh geometry={ribbonGeo.fill}>
            <meshBasicMaterial
              vertexColors
              transparent
              opacity={0.32}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <lineSegments geometry={ribbonGeo.lines}>
            <lineBasicMaterial vertexColors transparent opacity={0.95} />
          </lineSegments>
        </group>
      </DegradeBase>

      {showField
        ? [-0.8, -0.4, 0, 0.4, 0.8].map((x) => (
            <Arrow3
              key={x}
              a={[WIN[0] + x - 0.15, 0.4, WIN[2] + 0.05]}
              b={[WIN[0] + x + 0.15, 0.4, WIN[2] + 0.05]}
              color="#ffd36b"
              head={0.045}
              radius={0.012}
            />
          ))
        : null}

      <Swarm ref={ionFx} count={CHAINS.length} color="#c5a8ff" radius={0.03} halo={3.0} haloOpacity={0.35} emissive={2} />
      <Swarm ref={strip} count={STRIP_N} color="#ffffff" radius={0.045} basic />
      <Ghosts ref={ghosts} count={GHOSTS} />

      <Follow pose={hopTag}>
        <StoryTag position={[0, 0, 0]} kind="iodide">
          {LD.hop}
        </StoryTag>
      </Follow>

      {step === 0 ? (
        <StoryTag position={[3.15, -0.09, 0]} kind="good" minor>
          {L.current}
        </StoryTag>
      ) : null}
      {step === 1 ? (
        <>
          <StoryTag position={world(A_SITE).map((v, i) => (i === 1 ? v + 0.2 : v)) as V3} kind="concept">
            {LD.aSite}
          </StoryTag>
          <StoryTag position={world(PB).map((v, i) => (i === 1 ? v + 0.32 : v)) as V3} kind="concept">
            {LD.pb}
          </StoryTag>
          <StoryTag position={world(LABEL_I).map((v, i) => (i === 1 ? v - 0.24 : v)) as V3} kind="iodide">
            {LD.iodideI}
          </StoryTag>
          <StoryTag position={world(LABEL_BR).map((v, i) => (i === 1 ? v - 0.24 : v)) as V3} kind="bromide">
            {LD.bromideBr}
          </StoryTag>
        </>
      ) : null}
      {step === 2 ? (
        <>
          <StoryTag position={world(EXTRA_VAC[2]!).map((v, i) => (i === 1 ? v - 0.22 : v)) as V3} kind="concept">
            {LD.vacancy}
          </StoryTag>
          <StoryTag position={world(LABEL_I).map((v, i) => (i === 1 ? v - 0.24 : v)) as V3} kind="iodide">
            {LD.iodideI}
          </StoryTag>
        </>
      ) : null}
      {step === 3 ? (
        <>
          <StoryTag position={[WIN[0], 0.62, WIN[2]]} kind="good">
            {LD.field}
          </StoryTag>
          <StoryTag position={[-1.12, 0.42, WIN[2]]} kind="bad" minor>
            +
          </StoryTag>
          <StoryTag position={[1.12, 0.42, WIN[2]]} kind="particle" minor>
            −
          </StoryTag>
        </>
      ) : null}
      {step === 5 ? <ComposeTags P={P} y={STRIP_Y + 0.2} z={WIN[2]} /> : null}
      {step === 5 || step === 6 ? (
        <>
          <StoryTag position={[-0.62, -0.34, WIN[2] + 0.2]} kind="iodide">
            {LD.iRich}
          </StoryTag>
          <StoryTag position={[0.62, -0.34, WIN[2] + 0.2]} kind="bromide">
            {LD.brRich}
          </StoryTag>
        </>
      ) : null}
      {step === 6 ? (
        <>
          <StoryTag position={[-0.7, RIB_Y + 0.33, WIN[2]]} kind="iodide">
            {LD.smallGap}
          </StoryTag>
          <StoryTag position={[0.7, RIB_Y + 0.37, WIN[2]]} kind="bromide">
            {LD.largeGap}
          </StoryTag>
        </>
      ) : null}
      {step === 7 ? (
        <>
          <Arrow3 a={[-1.7, 0.62, 1.15]} b={[1.7, 0.62, 1.15]} color="#8fd0a8" />
          <StoryTag position={[1.0, 0.72, 1.15]} kind="good" minor>
            {LD.normalPath}
          </StoryTag>
          <Arrow3 a={[-1.7, 0.42, 1.15]} b={[-1.0, 0.42, 1.15]} color="#ff8a4c" />
          <Arrow3 a={[-1.0, 0.42, 1.15]} b={[-1.0, -0.1, 1.15]} color="#ff8a4c" />
          <StoryTag position={[-1.35, 0.55, 1.15]} kind="bad" minor>
            {LD.divertedPath}
          </StoryTag>
          <StoryTag position={[-1.05, -0.25, 1.15]} kind="bad">
            {LD.lowGap}
          </StoryTag>
          <StoryTag position={[-1.1, 0.1, 0.4]} kind="iodide" minor>
            {LD.iRich}
          </StoryTag>
          <StoryTag position={[1.1, 0.1, 0.4]} kind="bromide" minor>
            {LD.brRich}
          </StoryTag>
          <StoryTag position={[0.9, 0.34, 1.25]} kind="bad">
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

/** "I⁻ Br⁻ I⁻ Br⁻ …" before, "I⁻ I⁻ I⁻ | Br⁻ Br⁻ Br⁻" after. */
function ComposeTags({ P, y, z }: { P: { current: number }; y: number; z: number }) {
  const [after, setAfter] = useState(false);
  const last = useRef(false);
  useFrame(() => {
    const v = P.current > 0.85;
    if (v !== last.current) {
      last.current = v;
      setAfter(v);
    }
  });
  return (
    <StoryTag position={[0, y, z]} kind="concept">
      {after ? "I⁻ I⁻ I⁻ I⁻ | Br⁻ Br⁻ Br⁻" : "I⁻ Br⁻ I⁻ Br⁻ I⁻ Br⁻"}
    </StoryTag>
  );
}
