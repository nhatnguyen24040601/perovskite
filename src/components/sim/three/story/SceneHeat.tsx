import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { L, LD } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import {
  DEG,
  DegradeBase,
  DynLattice,
  Ghosts,
  Meter,
  WindowFrame,
  makeDegCtl,
  type GhostApi,
} from "./degradeKit";
import { GRAINS } from "./grains";
import {
  StoryTag,
  Swarm,
  buildAtoms,
  hashOffset,
  makeCellState,
  stepDur,
  useStoryClock,
  type Atom,
  type SwarmApi,
} from "./storyKit";
import { between, clamp01, hash1, lerp, smooth, type V3 } from "./world";

const A = 0.2;
const ATOMS = buildAtoms(9, 2, 4, A);
const RADII = { A: 0.032, B: 0.023, X: 0.019 };
const WIN: V3 = [0.0, 0.02, 0.8];
const WIN_SIZE: V3 = [1.8, 0.4, 0.8];
const OPEN_IDS = GRAINS.filter((g) => g.row >= 3 && Math.abs(g.x) < 0.95).map((g) => g.id);

const siteOf = (h: V3): Atom =>
  ATOMS.find((a) => a.kind === "X" && a.h[0] === h[0] && a.h[1] === h[1] && a.h[2] === h[2])!;

/** Mobile iodide ions: each hops between its own site and an empty neighbouring site (a vacancy). */
const PAIRS: [V3, V3][] = [
  [[5, 3, 2], [5, 4, 3]],
  [[9, 1, 4], [9, 2, 5]],
  [[13, 3, 2], [13, 4, 3]],
  [[7, 1, 6], [7, 2, 7]],
  [[11, 3, 6], [11, 4, 7]],
  [[3, 1, 4], [3, 2, 5]],
].map(([a, b]) => [a!, b!] as [V3, V3]);
const HOPPER = PAIRS.map(([a]) => siteOf(a));
const EMPTY = PAIRS.map(([, b]) => siteOf(b));
const ROLE = new Map<number, { k: number; mobile: boolean }>();
HOPPER.forEach((a, k) => ROLE.set(a.id, { k, mobile: true }));
EMPTY.forEach((a, k) => ROLE.set(a.id, { k, mobile: false }));

/** Where the damage starts. */
const HOT_SPOT: V3 = [-0.35, 0.1, 0.0];
const WARM = new THREE.Color("#ff9a4a");
const GOLD = new THREE.Color(DEG.pbi2);
const MOBILE = new THREE.Color("#b79aff");

/** Everything that depends on temperature, in one place. */
const amp = (T: number) => 0.005 + ((T - 25) / 75) * 0.03;
const omega = (T: number) => 5 + ((T - 25) / 75) * 6;
const hopRate = (T: number) => 0.15 * Math.exp((T - 25) / 30);
const decay = (T: number) => 0.0061 * Math.exp((T - 25) / 30);
const BASE_DMG = [0, 0, 0, 0.03, 0.08, 0.72];

const world = (a: Atom): V3 => [WIN[0] + a.p[0], WIN[1] + a.p[1], WIN[2] + a.p[2]];

/** Lattice-local position of mobile ion `k` at hop progress `u`, with the thermal shake of temperature `T`. */
function mobileAt(k: number, u: number, t: number, T: number): V3 {
  const a = HOPPER[k]!;
  const b = EMPTY[k]!.p;
  const w = omega(T);
  const am = amp(T);
  const ph = a.id * 1.7;
  return [
    lerp(a.p[0], b[0], u) + Math.sin(t * w + ph) * am,
    lerp(a.p[1], b[1], u) + Math.sin(t * w * 1.13 + ph * 1.3) * am + Math.sin(Math.PI * u) * 0.025,
    lerp(a.p[2], b[2], u) + Math.sin(t * w * 0.91 + ph * 0.7) * am,
  ];
}

const PLATE = new THREE.BoxGeometry(1, 1, 1);
const COLD = new THREE.Color("#4a5560");
const HOT = new THREE.Color("#ff6a1f");

export function HeatScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("dheat", step), 2);
  const cell = useRef(makeCellState()).current;
  const ctl = useRef(makeDegCtl(cell, OPEN_IDS)).current;
  const ghosts = useRef<GhostApi>(null);
  const shimmer = useRef<SwarmApi>(null);
  const mobileFx = useRef<SwarmApi>(null);
  const plateMat = useRef<THREE.MeshStandardMaterial>(null);
  const plate = useRef<THREE.Mesh>(null);
  const fluid = useRef<THREE.Mesh>(null);
  const fluidMat = useRef<THREE.MeshBasicMaterial>(null);
  const winAlpha = useRef(0);
  const open = useRef(0);
  const Tc = useRef(25);
  const D = useRef(0);
  const phi = useRef(Float32Array.from(PAIRS, (_, j) => j * 0.37));
  const hop = useRef(Float32Array.from(PAIRS, () => 0));
  const speed = useRef(0);
  const damage = useRef(0);
  const last = useRef({ t: 0, step: -1, loop: -1 });
  const frameT = useRef(25);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const c = clock.current;
    const gh = ghosts.current;
    const sh = shimmer.current;
    const mf = mobileFx.current;
    if (!gh || !sh || !mf) return;
    // time that really passed in the scene (0 while paused, slower in Slow mode)
    let dtc = c.t - last.current.t;
    if (last.current.step !== step || last.current.loop !== c.loop) {
      dtc = 0;
      D.current = BASE_DMG[step]!;
      last.current.step = step;
      last.current.loop = c.loop;
    }
    if (dtc < 0 || dtc > 0.3) dtc = 0;
    last.current.t = c.t;
    const t = c.t;

    // temperature eases toward the slider
    const want = useSim.getState().temp;
    Tc.current = lerp(Tc.current, want, 1 - Math.exp(-dt * 2.2));
    const T = Tc.current;
    frameT.current = T;
    const h = clamp01((T - 25) / 75);

    // degradation speed follows the temperature; damage adds up while the scene plays
    const r = decay(T);
    if (step >= 2 && step <= 4) D.current = Math.min(1, D.current + r * dtc * (step === 4 ? 1 : 0.6));
    speed.current = r / decay(100);
    damage.current = D.current;

    // hopping ions: how fast they hop is set by the temperature
    const lam = hopRate(T);
    for (let j = 0; j < PAIRS.length; j++) {
      phi.current[j]! += dtc * lam * (0.8 + 0.4 * hash1(j * 3.1));
      const f = phi.current[j]! % 1;
      const n = Math.floor(phi.current[j]!);
      const k = Math.max(1, 1 / (0.4 * lam));
      const u = smooth(clamp01(f * k));
      hop.current[j] = n % 2 === 0 ? u : 1 - u;
    }

    // layers and the window
    cell.lift = step === 0 ? 0 : step === 1 ? between(t, 0.2, 2.2) : step <= 4 ? 1 : 1 - between(t, 1.6, 4.0);
    ctl.grains.open = step === 1 ? between(t, 0.2, 1.6) : step >= 2 && step <= 4 ? 1 : step === 5 ? 1 - between(t, 0.2, 1.4) : 0;
    open.current = smooth(ctl.grains.open);
    winAlpha.current = open.current * (0.35 + 0.5 * h);

    // film-level look
    const Dm = D.current;
    cell.dmg = step === 5 ? 0.5 * between(t, 1.0, 3.0) : 0;
    for (const g of GRAINS) {
      const v = step === 5 ? Dm * (0.5 + 0.5 * hash1(g.id * 2.7)) * between(t, 1.0, 3.0) : step === 4 ? Dm * 0.3 : 0;
      ctl.grains.dmg[g.id] = v;
    }
    const f = ctl.flow;
    f.tags = step === 0 ? 1 : 0;
    f.light = step === 0 || step === 5 ? 1 : 0;
    f.loss = step === 5 ? 0.5 : 0;
    f.where = 0;
    f.zx0 = -2;
    f.zx1 = 2;
    ctl.sun = step === 0 || step === 5 ? 1 : 0.5;
    ctl.zone.x0 = -1.95;
    ctl.zone.x1 = 1.95;
    ctl.zone.band = false;
    ctl.zone.a = step === 5 ? 0.45 * between(t, 1.4, 3.4) : 0;
    ctl.gaugeShow = step === 0 || step === 5 ? 1 : 0;
    ctl.gauge = step === 5 ? 1 - 0.5 * between(t, 3.4, 8) : 1;

    // hot plate and rising heat under the cell
    if (plateMat.current) {
      plateMat.current.color.copy(COLD).lerp(HOT, h);
      plateMat.current.emissive.copy(HOT);
      plateMat.current.emissiveIntensity = 0.05 + 1.1 * h;
    }
    const show = step === 0 || step === 5 ? 1 : 0;
    if (plate.current) plate.current.visible = show === 1;
    for (let i = 0; i < 16; i++) {
      const on = show && i < Math.round(16 * h) + (h > 0 ? 0 : 0);
      if (!on) {
        sh.hide(i);
        continue;
      }
      const life = (t * (0.35 + 0.5 * h) + hash1(i * 4.3)) % 1;
      const x = -1.8 + hash1(i * 7.7) * 3.6;
      const z = -0.9 + hash1(i * 2.1) * 1.8;
      sh.set(i, x + Math.sin(life * 9 + i) * 0.06, -0.62 + life * 1.55, z, 1 - life * 0.6);
    }
    sh.flush();
    if (fluid.current) {
      const hh = 0.12 + h * 1.1;
      fluid.current.scale.set(1, hh, 1);
      fluid.current.position.set(0, -0.7 + hh / 2, 0);
      if (fluidMat.current) fluidMat.current.color.set("#4da3ff").lerp(HOT, h);
    }

    // empty site beside every mobile ion
    for (let j = 0; j < PAIRS.length; j++) {
      if (step < 1 || step > 4) {
        gh.hide(j);
        continue;
      }
      const a = world(HOPPER[j]!);
      const b = world(EMPTY[j]!);
      const u = hop.current[j]!;
      // the ion is at a + (b - a) * u, so the empty site is the mirror image
      gh.set(j, a[0] + (b[0] - a[0]) * (1 - u), a[1] + (b[1] - a[1]) * (1 - u), a[2] + (b[2] - a[2]) * (1 - u), 0.034, open.current * (step >= 3 ? 0.85 : 0.25), "#ffffff");
    }
    gh.flush();

    // a soft glow on every mobile iodide ion, so the eye can follow it
    for (let j = 0; j < PAIRS.length; j++) {
      if (step < 1 || step > 4 || open.current < 0.05) {
        mf.hide(j);
        continue;
      }
      const p = mobileAt(j, hop.current[j]!, t, T);
      mf.set(j, WIN[0] + p[0], WIN[1] + p[1], WIN[2] + p[2], open.current * 0.8);
    }
    mf.flush();
  });

  const frame = (a: Atom, out: { pos: V3; scale: number; color: THREE.Color }) => {
    const t = clock.current.t;
    const T = frameT.current;
    const hh = clamp01((T - 25) / 75);
    out.scale *= open.current;
    const role = ROLE.get(a.id);
    const w = omega(T);
    const am = amp(T);
    const ph = a.id * 1.7;
    out.pos[0] += Math.sin(t * w + ph) * am;
    out.pos[1] += Math.sin(t * w * 1.13 + ph * 1.3) * am;
    out.pos[2] += Math.sin(t * w * 0.91 + ph * 0.7) * am;
    // slow, shared bending of the lattice once it is hot
    const bend = Math.max(0, hh - 0.3) * 0.045;
    out.pos[0] += Math.sin(a.p[1] * 9 + t * 1.2) * bend;
    out.pos[2] += Math.cos(a.p[0] * 7 + t * 1.0) * bend;
    out.color.lerp(WARM, 0.28 * hh);

    if (role) {
      const k = role.k;
      const u = hop.current[k]!;
      if (role.mobile) {
        const p = mobileAt(k, u, t, T);
        out.pos[0] = p[0];
        out.pos[1] = p[1];
        out.pos[2] = p[2];
        out.color.copy(MOBILE);
        out.scale *= 1.4;
      } else {
        out.scale = 0;
      }
      return;
    }

    // damage: starts at one spot and grows with the temperature-driven decay
    const dx = a.p[0] - HOT_SPOT[0];
    const dy = a.p[1] - HOT_SPOT[1];
    const dz = a.p[2] - HOT_SPOT[2];
    const d = clamp01(D.current * 1.9 - Math.hypot(dx, dy, dz) * 1.5);
    if (d > 0) {
      const o = hashOffset(a.id, 0.05 * d);
      out.pos[0] += o[0];
      out.pos[1] += o[1];
      out.pos[2] += o[2];
      if (a.kind === "A") {
        out.pos[1] += 0.5 * smooth((d - 0.35) / 0.4);
        out.scale *= 1 - smooth((d - 0.3) / 0.35);
      } else out.color.lerp(GOLD, smooth(d));
    }
  };

  return (
    <group>
      <DegradeBase ctl={ctl} clock={clock} layerLabels={step === 0} sunTag={step === 0}>
        <group position={WIN}>
          <DynLattice atoms={ATOMS} radii={RADII} frame={frame} />
        </group>
        <WindowFrame center={WIN} size={WIN_SIZE} alpha={winAlpha} color="#ff9a4a" />
        {/* hot plate under the cell */}
        <mesh ref={plate} geometry={PLATE} position={[0, -0.8, 0]} scale={[4.3, 0.07, 2.6]}>
          <meshStandardMaterial ref={plateMat} color="#4a5560" roughness={0.6} />
        </mesh>
        {/* thermometer */}
        <group position={[-2.75, 0.15, 0.3]}>
          <mesh position={[0, 0.0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 1.6, 12]} />
            <meshBasicMaterial color="#9fb2c6" transparent opacity={0.25} depthWrite={false} />
          </mesh>
          <mesh ref={fluid} position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1, 10]} />
            <meshBasicMaterial ref={fluidMat} color="#4da3ff" />
          </mesh>
          <mesh position={[0, -0.78, 0]}>
            <sphereGeometry args={[0.1, 14, 10]} />
            <meshBasicMaterial color="#ff6a1f" />
          </mesh>
        </group>
      </DegradeBase>

      <Swarm ref={mobileFx} count={PAIRS.length} color="#9d7bff" radius={0.02} halo={3.2} haloOpacity={0.3} emissive={1.8} />
      <Swarm ref={shimmer} count={16} color={DEG.heat} radius={0.04} emissive={1.6} />
      <Ghosts ref={ghosts} count={PAIRS.length} />
      <Meter position={[1.12, 0.0, 0.9]} value={speed} color={DEG.heat} label={LD.degSpeed} show={step === 4} />
      <Meter position={[1.32, 0.0, 0.9]} value={damage} color={DEG.pbi2} label={LD.degraded} show={step === 4} />

      <TempTag position={[-2.75, 1.15, 0.3]} show={step === 0 || step === 5} />
      <TempTag position={[WIN[0] - 0.75, 0.5, WIN[2] + 0.25]} show={step >= 1 && step <= 4} big />

      {step === 0 ? (
        <StoryTag position={[3.15, -0.09, 0]} kind="good" minor>
          {L.current}
        </StoryTag>
      ) : null}
      {step === 1 ? (
        <StoryTag position={[WIN[0] + 0.55, 0.47, WIN[2] + 0.1]} kind="good">
          {LD.stable}
        </StoryTag>
      ) : null}
      {step === 2 ? (
        <StoryTag position={[WIN[0] + 0.55, 0.47, WIN[2] + 0.1]} kind="concept">
          {LD.vibration}
        </StoryTag>
      ) : null}
      {step === 3 ? (
        <>
          <StoryTag position={[WIN[0] + 0.55, 0.47, WIN[2] + 0.1]} kind="concept">
            {LD.ionMove}
          </StoryTag>
          <StoryTag position={[WIN[0] - 0.05, 0.3, WIN[2] + 0.55]} kind="iodide" minor>
            {LD.iodideI}
          </StoryTag>
        </>
      ) : null}
      {step === 4 ? (
        <StoryTag position={[WIN[0] - 0.35, -0.3, WIN[2] + 0.35]} kind="bad">
          {LD.degraded}
        </StoryTag>
      ) : null}
      {step === 5 ? (
        <>
          <StoryTag position={[0, -1.05, 0.9]} kind="bad">
            {LD.heat}
          </StoryTag>
          <StoryTag position={[-0.9, -0.66, 1.0]} kind="bad">
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

/** "75 °C", following the slider. */
function TempTag({ position, show, big = false }: { position: V3; show: boolean; big?: boolean }) {
  const [text, setText] = useState("25 °C");
  const last = useRef(25);
  useFrame(() => {
    const v = Math.round(useSim.getState().temp / 5) * 5;
    if (v !== last.current) {
      last.current = v;
      setText(`${v} °C`);
    }
  });
  return show ? (
    <StoryTag position={position} kind={big ? "bad" : "concept"}>
      {text}
    </StoryTag>
  ) : null;
}
