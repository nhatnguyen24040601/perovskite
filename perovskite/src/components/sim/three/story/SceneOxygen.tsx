import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { L, LD } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import {
  DEG,
  DegradeBase,
  DynLattice,
  Ghosts,
  Molecules,
  WindowFrame,
  makeDegCtl,
  type GhostApi,
  type MolApi,
} from "./degradeKit";
import { GRAINS, SURFACE_Y } from "./grains";
import {
  Flashes,
  StoryTag,
  Swarm,
  buildAtoms,
  burst,
  hashOffset,
  makeCellState,
  stepDur,
  useStoryClock,
  type Atom,
  type FlashApi,
  type SwarmApi,
} from "./storyKit";
import { Follow, type Pose } from "./tracks";
import { COLOR, between, hash1, lerp, smooth, type V3 } from "./world";

const SURF = SURFACE_Y + 0.07;

/* ── the cut-away window: the top of the film, where oxygen meets the surface ── */
const A = 0.2;
const ATOMS = buildAtoms(7, 2, 3, A);
const RADII = { A: 0.032, B: 0.023, X: 0.019 };
const WIN: V3 = [-0.6, 0.02, 0.9];
const WIN_SIZE: V3 = [1.4, 0.4, 0.6];
const OPEN_IDS = GRAINS.filter((g) => g.row === 4 && g.x > -1.2 && g.x < 0.1).map((g) => g.id);

const siteOf = (h: V3): Atom =>
  ATOMS.find((a) => a.kind === "X" && a.h[0] === h[0] && a.h[1] === h[1] && a.h[2] === h[2])!;
const VACANCY = siteOf([5, 4, 3]);
/** The sites oxygen attacks, one per event. */
const EVENTS: { atom: Atom; t0: number }[] = [
  { atom: siteOf([9, 4, 3]), t0: 0.8 },
  { atom: siteOf([3, 4, 1]), t0: 5.2 },
  { atom: siteOf([7, 4, 5]), t0: 14.5 },
  { atom: siteOf([11, 4, 5]), t0: 16.3 },
  { atom: siteOf([1, 4, 3]), t0: 18.1 },
  { atom: siteOf([13, 4, 1]), t0: 19.9 },
  { atom: siteOf([5, 4, 1]), t0: 21.7 },
  { atom: siteOf([9, 4, 5]), t0: 23.5 },
];
const T_DAMAGE = 2.6;
const SLOTS = 4;
const CLOUD = 10;
const ORANGE = new THREE.Color("#ff6a30");

const world = (a: Atom): V3 => [WIN[0] + a.p[0], WIN[1] + a.p[1], WIN[2] + a.p[2]];

/** Where the cloud of oxygen sits over the film when it first arrives. */
const CLOUD_AT: V3[] = Array.from({ length: CLOUD }, (_, m) => [
  -1.6 + hash1(m * 3.3) * 2.8,
  SURF + 0.03,
  -0.5 + hash1(m * 5.1) * 1.5,
]);

export function OxygenScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("doxy", step), 2);
  const cell = useRef(makeCellState()).current;
  const ctl = useRef(makeDegCtl(cell, OPEN_IDS)).current;
  const o2 = useRef<MolApi>(null);
  const photons = useRef<SwarmApi>(null);
  const electrons = useRef<SwarmApi>(null);
  const holes = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);
  const ghosts = useRef<GhostApi>(null);
  const winAlpha = useRef(0);
  const open = useRef(0);
  const G = useRef(0);
  const lit = useRef(false);
  const lightV = useRef(0);
  const progress = useRef<number[]>(EVENTS.map(() => 0));
  const oxyTag = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const reactTag = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const chargeTag = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = clock.current.t;
    const m = o2.current;
    const ph = photons.current;
    const el = electrons.current;
    const ho = holes.current;
    const fl = flashes.current;
    const gh = ghosts.current;
    if (!m || !ph || !el || !ho || !fl || !gh) return;
    const mode = useSim.getState().lightMode;
    const auto = step === 0 ? true : step === 1 ? false : step === 2 ? t > 0.8 : true;
    const on = mode === "on" ? true : mode === "off" ? false : auto;
    lit.current = on;
    lightV.current = lerp(lightV.current, on ? 1 : 0, Math.min(1, dt * 5));

    const base = step === 4 ? 14 : 0;
    const g = base + t;
    G.current = g;

    // layers: lifted while the surface is the subject
    cell.lift = step === 0 ? 0 : step === 1 ? between(t, 0.3, 2.5) : step <= 4 ? 1 : 1 - between(t, 1.6, 4.0);
    ctl.grains.open = step === 3 ? between(t, 0.2, 1.6) : step === 4 ? 1 : step === 5 ? 1 - between(t, 0.2, 1.4) : 0;
    open.current = smooth(ctl.grains.open);
    winAlpha.current = open.current * 0.55;

    // damage from the events that have finished
    EVENTS.forEach((e, k) => {
      const any = on && step >= 3;
      const gk = step === 5 ? 99 : g;
      const d = any || step === 5 ? smooth((gk - (e.t0 + T_DAMAGE)) / 0.8) : 0;
      progress.current[k] = step === 5 ? 1 : d;
    });
    cell.dmg = step === 5 ? 0.1 : 0;
    // the whole absorber surface gets rough
    for (const gr of GRAINS) ctl.grains.dmg[gr.id] = step === 5 ? 0.12 : 0;

    // charges at cell level (steps 0, 2 and 5) and the circuit
    const f = ctl.flow;
    f.light = step === 0 || step === 5 ? lightV.current : step === 2 || step === 1 ? lightV.current : 0;
    f.hold = step === 1 || step === 2 ? 1 : 0;
    f.tags = step === 0 || step === 2 ? 1 : 0;
    f.loss = step === 5 ? 0.5 : 0;
    f.where = 1;
    f.zx0 = -2;
    f.zx1 = 2;
    ctl.sun = lightV.current;
    ctl.zone.x0 = -1.95;
    ctl.zone.x1 = 1.95;
    ctl.zone.band = true;
    ctl.zone.a = step === 5 ? between(t, 1.4, 3.4) : 0;
    ctl.gaugeShow = step === 0 || step === 5 ? 1 : 0;
    ctl.gauge = step === 5 ? 1 - 0.5 * between(t, 3.4, 8) : 1;

    // oxygen cloud (steps 1, 2, 5)
    const cloud = step === 1 || step === 2 || step === 5;
    for (let i = 0; i < CLOUD; i++) {
      if (!cloud) {
        m.hide(i);
        continue;
      }
      const c = CLOUD_AT[i]!;
      let pos: V3;
      let s = 1;
      if (step === 5) {
        pos = [
          -1.9 + (i / CLOUD) * 3.8 + Math.sin(t * 0.7 + i) * 0.12,
          0.95 + 0.5 * hash1(i * 2.2) + Math.sin(t * 0.9 + i * 2) * 0.06,
          -0.3 + hash1(i * 6.1) * 0.9,
        ];
        s = between(t, 0.2 + i * 0.08, 0.9 + i * 0.08);
      } else {
        const fall = step === 1 ? between(t, 0.3 + i * 0.4, 1.9 + i * 0.4) : 1;
        const y0 = 1.9;
        pos = [
          c[0] + Math.sin(t * 0.8 + i) * 0.03,
          lerp(y0, c[1], fall) + (fall >= 1 ? Math.sin(t * 1.6 + i * 1.3) * 0.02 : 0),
          c[2] + Math.cos(t * 0.7 + i) * 0.03,
        ];
        s = fall > 0.01 ? 1 : 0;
      }
      m.set(i, pos[0], pos[1], pos[2], 1.0 * s, t * 0.6 + i, t * 0.5 + i * 2, i * 0.4, 0.1);
      if (i === 4 && s > 0.5 && step <= 2) {
        oxyTag.current.x = pos[0];
        oxyTag.current.y = pos[1] + 0.2;
        oxyTag.current.z = pos[2];
        oxyTag.current.a = 1;
      }
    }
    if (!(cloud && step <= 2)) oxyTag.current.a = 0;

    // the atomic events (steps 3 and 4)
    for (let s = 0; s < SLOTS; s++) {
      ph.hide(s);
      el.hide(s);
      ho.hide(s);
      fl.hide(s * 2);
      fl.hide(s * 2 + 1);
      m.hide(CLOUD + s);
    }
    chargeTag.current.a = 0;
    reactTag.current.a = 0;
    if (step === 3 || step === 4) {
      EVENTS.forEach((e, k) => {
        const slot = k % SLOTS;
        const [sx, sy, sz] = world(e.atom);
        const tau = g - e.t0;
        if (tau < -2.0 || tau > 3.3) return;
        const hover: V3 = [sx, sy + 0.14, sz];
        // oxygen comes down and waits above the site
        const arrive = between(tau, -2.0, 0.5);
        let pos: V3 = [lerp(sx + 0.25, hover[0], arrive), lerp(sy + 0.75, hover[1], arrive), lerp(sz + 0.1, hover[2], arrive)];
        let size = 1.15;
        let glow = 0.09;
        let reactive = 0;
        if (on) {
          reactive = between(tau, 1.2, 1.5);
          const attack = between(tau, 1.6, 2.6);
          pos = [pos[0], lerp(hover[1], sy + 0.045, attack), pos[2]];
          const fade = 1 - between(tau, T_DAMAGE, T_DAMAGE + 0.5);
          size *= fade * (1 + reactive * 0.2);
          glow = 0.09 + reactive * 0.32;
        }
        m.set(CLOUD + slot, pos[0], pos[1], pos[2], size, g * 0.7 + k, g * 0.6 + k * 2, k, glow);
        m.halo(CLOUD + slot, reactive > 0.5 ? DEG.reactive : DEG.oxygen, glow);
        if (arrive > 0.3 && size > 0.2 && step === 3 && k === (g > 9.4 ? 1 : 0)) {
          oxyTag.current.x = pos[0] + 0.08;
          oxyTag.current.y = pos[1] + 0.2;
          oxyTag.current.z = pos[2];
          oxyTag.current.a = reactive < 0.5 ? 1 : 0;
          reactTag.current.x = pos[0] + 0.1;
          reactTag.current.y = pos[1] + 0.22;
          reactTag.current.z = pos[2];
          reactTag.current.a = reactive >= 0.5 && size > 0.3 ? 1 : 0;
        }
        if (!on) return;
        // photon in, pair made under the site
        if (tau >= -0.9 && tau < 0) ph.set(slot, sx - 0.05, lerp(sy + 0.9, sy - 0.06, (tau + 0.9) / 0.9), sz, 1);
        const b = burst(tau, 0, 0.6, 0.14);
        if (b) fl.set(slot * 2, sx - 0.05, sy - 0.06, sz, b.r, b.a);
        if (tau >= 0 && tau < 1.45) {
          const up = between(tau, 0.3, 1.3);
          const born = Math.min(1, tau / 0.2);
          el.set(slot, lerp(sx - 0.05, sx, up), lerp(sy - 0.06, sy - 0.005, up), sz, born);
          if (step === 3 && k === (g > 9.4 ? 1 : 0)) {
            chargeTag.current.x = lerp(sx - 0.05, sx, up) - 0.12;
            chargeTag.current.y = lerp(sy - 0.06, sy - 0.005, up) - 0.05;
            chargeTag.current.z = sz;
            chargeTag.current.a = 1;
          }
        }
        if (tau >= 0 && tau < 3.0) {
          const drift = between(tau, 0.2, 3.0);
          ho.set(slot, sx - 0.07, sy - 0.07 - 0.12 * drift, sz, (1 - drift) * Math.min(1, tau / 0.2));
        }
        const r = burst(tau, 1.45, 0.6, 0.12);
        if (r) fl.set(slot * 2 + 1, sx, sy, sz, r.r, r.a * 1.2);
        const hit = burst(tau, T_DAMAGE, 0.7, 0.2);
        if (hit) fl.set(slot * 2, sx, sy, sz, hit.r, hit.a * 1.3);
      });
      if (!on) {
        // light off: oxygen just sits there
        for (let s = 0; s < 3; s++) {
          const e = EVENTS[s]!;
          const [sx, sy, sz] = world(e.atom);
          m.set(CLOUD + s, sx, sy + 0.14 + Math.sin(t * 1.4 + s) * 0.01, sz, 1.3, t * 0.4 + s, t * 0.3, s, 0.08);
        }
      }
    }
    m.flush();
    ph.flush();
    el.flush();
    ho.flush();
    fl.flush();

    // empty sites: the vacancy that was always there, and one for every finished event
    for (let i = 0; i < EVENTS.length + 1; i++) gh.hide(i);
    if (step >= 3 && step <= 4) {
      const [vx, vy, vz] = world(VACANCY);
      gh.set(0, vx, vy, vz, 0.038, open.current * 0.8, "#ffffff");
      EVENTS.forEach((e, k) => {
        const d = progress.current[k]!;
        if (d > 0.02) {
          const [x, y, z] = world(e.atom);
          gh.set(k + 1, x, y, z, 0.034 + 0.01 * Math.sin(t * 5 + k), d * 0.9, DEG.lost);
        }
      });
    }
    gh.flush();
  });

  const frame = (a: Atom, out: { pos: V3; scale: number; color: THREE.Color }) => {
    const t = clock.current.t;
    const op = open.current;
    out.scale *= op;
    if (a === VACANCY) {
      out.scale = 0;
      return;
    }
    const top = a.h[1] >= 3;
    const wob = top ? 0.004 : 0.002;
    out.pos[0] += Math.sin(t * 5.1 + a.id) * wob;
    out.pos[1] += Math.sin(t * 4.3 + a.id * 1.7) * wob;
    EVENTS.forEach((e, k) => {
      const d = progress.current[k]!;
      if (d <= 0) return;
      if (a === e.atom) {
        out.scale *= 1 - d;
        return;
      }
      const dx = a.p[0] - e.atom.p[0];
      const dy = a.p[1] - e.atom.p[1];
      const dz = a.p[2] - e.atom.p[2];
      const r = Math.hypot(dx, dy, dz);
      if (r < 0.3) {
        const w = Math.min(1, (1 - r / 0.3) * 1.5) * d;
        const o = hashOffset(a.id + k * 31, 0.07 * w);
        out.pos[0] += o[0];
        out.pos[1] += o[1] + 0.02 * w;
        out.pos[2] += o[2];
        if (a.kind !== "A") out.color.lerp(ORANGE, w);
        else out.scale *= 1 - 0.3 * w;
      }
    });
  };

  return (
    <group>
      <DegradeBase ctl={ctl} clock={clock} layerLabels={step === 0} sunTag={step === 0}>
        <group position={WIN}>
          <DynLattice atoms={ATOMS} radii={RADII} frame={frame} />
        </group>
        <WindowFrame center={WIN} size={WIN_SIZE} alpha={winAlpha} color="#9fb2c6" />
      </DegradeBase>

      <Molecules ref={o2} kind="o2" count={CLOUD + SLOTS} />
      <Swarm ref={photons} count={SLOTS} color={COLOR.photon} radius={0.035} emissive={1.8} />
      <Swarm ref={electrons} count={SLOTS} color={COLOR.electron} radius={0.026} />
      <Swarm ref={holes} count={SLOTS} color={COLOR.hole} radius={0.026} />
      <Flashes ref={flashes} count={SLOTS * 2} color="#ffb0e8" />
      <Ghosts ref={ghosts} count={EVENTS.length + 1} />

      <Follow pose={oxyTag}>
        <StoryTag position={[0, 0, 0]} kind="particle">
          {LD.oxygen}
        </StoryTag>
      </Follow>
      <Follow pose={reactTag}>
        <StoryTag position={[0, 0, 0]} kind="bad" sub={LD.simplified}>
          {LD.reactive}
        </StoryTag>
      </Follow>
      <Follow pose={chargeTag}>
        <StoryTag position={[0, 0, 0]} kind="particle" minor>
          {LD.excited}
        </StoryTag>
      </Follow>

      {step === 0 ? (
        <StoryTag position={[3.15, -0.09, 0]} kind="good" minor>
          {L.current}
        </StoryTag>
      ) : null}
      {step === 1 ? (
        <StoryTag position={[-1.35, 0.7, 0.9]} kind="bad">
          {LD.lightOff}
        </StoryTag>
      ) : null}
      {step === 2 ? (
        <StoryTag position={[-1.35, 0.7, 0.9]} kind="good">
          {LD.lightOn}
        </StoryTag>
      ) : null}
      {step === 3 ? (
        <StoryTag position={[WIN[0] - 0.2, 0.46, WIN[2] + 0.05]} kind="concept" minor>
          {LD.vacancy}
        </StoryTag>
      ) : null}
      {step === 4 ? (
        <>
          <StoryTag position={[WIN[0] + 0.3, 0.42, WIN[2]]} kind="bad">
            {LD.defects}
          </StoryTag>
          <StoryTag position={[WIN[0] - 0.62, 0.26, WIN[2] + 0.28]} kind="layer" minor>
            {LD.surface}
          </StoryTag>
        </>
      ) : null}
      {step === 5 ? (
        <>
          <StoryTag position={[-1.6, 0.34, 0.9]} kind="bad">
            {LD.surface}
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

