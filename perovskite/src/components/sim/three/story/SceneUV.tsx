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
  WindowFrame,
  makeDegCtl,
  type GhostApi,
} from "./degradeKit";
import { GRAINS } from "./grains";
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
import { COLOR, between, lerp, smooth, type V3 } from "./world";

/* ── the cut-away window at the ETL / perovskite interface ── */
const A = 0.2;
const PERO = buildAtoms(7, 1, 3, A);
const ETL = buildAtoms(7, 1, 3, A);
const RADII = { A: 0.032, B: 0.023, X: 0.019 };
const PERO_AT: V3 = [0, 0.12, 0.9];
const ETL_AT: V3 = [0, 0.345, 0.9];
const WIN_AT: V3 = [0, 0.23, 0.9];
const WIN_SIZE: V3 = [1.4, 0.45, 0.6];
const IFACE_Y = 0.235;
const OPEN_IDS = GRAINS.filter((g) => g.row === 4 && Math.abs(g.x) < 0.8).map((g) => g.id);
const ETL_COLORS = { A: "#4d86d6", B: "#9cc0f5", X: "#3a6fc0" };

/** UV strikes at these points on the interface (x, z in the window frame), one after another. */
const HITS: { x: number; z: number; t0: number }[] = [
  { x: -0.35, z: 0.05, t0: 1.2 },
  { x: 0.25, z: -0.12, t0: 3.4 },
  { x: -0.05, z: 0.15, t0: 5.6 },
  { x: 0.5, z: 0.1, t0: 7.8 },
  { x: -0.55, z: -0.1, t0: 10.0 },
];
const T_BREAK = 1.5;
const ORANGE = new THREE.Color("#ff6a30");
const VIOLET = new THREE.Color(DEG.uv);

const defaultUv = (step: number, t: number) => (step === 0 ? false : step === 1 ? t > 3.2 : true);

export function UvScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("duv", step), 2);
  const cell = useRef(makeCellState()).current;
  const ctl = useRef(makeDegCtl(cell, OPEN_IDS)).current;
  const photons = useRef<SwarmApi>(null);
  const electrons = useRef<SwarmApi>(null);
  const holes = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);
  const ghosts = useRef<GhostApi>(null);
  const winAlpha = useRef(0);
  const open = useRef(0);
  const isUv = useRef(false);
  const done = useRef<number[]>(HITS.map(() => 0));
  const photonTag = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const defectTag = useRef<Pose>({ x: 0, y: 0, z: 0, a: 0 });
  const sunTag = useRef<Pose>({ x: 1.2, y: 3.35, z: -0.5, a: 0 });

  useFrame(() => {
    const t = clock.current.t;
    const ph = photons.current;
    const el = electrons.current;
    const ho = holes.current;
    const fl = flashes.current;
    const gh = ghosts.current;
    if (!ph || !el || !ho || !fl || !gh) return;
    const mode = useSim.getState().uvMode;
    const uv = mode === "uv" ? true : mode === "visible" ? false : defaultUv(step, t);
    isUv.current = uv;

    cell.lift = step === 3 ? between(t, 0.2, 1.8) : 0;
    ctl.grains.open = step === 3 ? between(t, 0.2, 1.8) : 0;
    open.current = smooth(ctl.grains.open);
    winAlpha.current = open.current * 0.55;

    // cell-level light: yellow or violet, and what the transport layer does with UV
    const f = ctl.flow;
    f.tags = step === 0 ? 1 : 0;
    f.light = step === 3 ? 0 : 1;
    f.uv = uv ? 1 : 0;
    f.uvAbsorb = uv ? 0.75 : 0;
    f.where = 1;
    f.zx0 = -2;
    f.zx1 = 2;
    f.loss = step >= 4 && uv ? 0.8 : 0;
    ctl.sun = 1;
    ctl.sunUv = uv ? 1 : 0;
    ctl.zone.x0 = -1.95;
    ctl.zone.x1 = 1.95;
    ctl.zone.band = true;
    ctl.zone.a = step >= 4 && uv ? between(t, 0.3, 2.5) : 0;
    cell.dmg = 0;
    for (const g of GRAINS) ctl.grains.dmg[g.id] = 0;
    ctl.gaugeShow = step === 0 || step >= 4 ? 1 : 0;
    ctl.gauge = step >= 4 && uv ? 1 - 0.55 * between(t, 2.5, step === 4 ? 9 : 8) : 1;
    sunTag.current.a = step === 1 ? 1 : 0;

    // the strikes at the interface (step 3)
    for (let s = 0; s < HITS.length; s++) {
      ph.hide(s);
      el.hide(s);
      ho.hide(s);
      fl.hide(s);
    }
    photonTag.current.a = 0;
    defectTag.current.a = 0;
    HITS.forEach((h, k) => {
      const x = WIN_AT[0] + h.x;
      const z = WIN_AT[2] + h.z;
      const tau = t - h.t0;
      done.current[k] = step === 3 && uv ? smooth((tau - T_BREAK) / 0.8) : step > 3 ? 1 : 0;
      if (step !== 3 || !uv || tau < -1 || tau > 3.4) return;
      // photon in
      if (tau < 0) {
        const y = lerp(1.15, ETL_AT[1] + 0.04, (tau + 1) / 1);
        ph.set(k, x, y, z, 1.2);
        if (photonTag.current.a === 0 && k === HITS.findIndex((q) => t - q.t0 > -1.05 && t - q.t0 < 1.5)) {
          photonTag.current.x = x + 0.1;
          photonTag.current.y = y + 0.1;
          photonTag.current.z = z;
          photonTag.current.a = 1;
        }
      }
      const b = burst(tau, 0, 0.6, 0.16);
      if (b) fl.set(k, x, IFACE_Y + 0.04, z, b.r, b.a * 1.2);
      // excited pair at the interface
      if (tau >= 0 && tau < 2.4) {
        const drift = between(tau, 0.1, 1.4);
        const born = Math.min(1, tau / 0.2);
        const fade = 1 - between(tau, 1.8, 2.4);
        el.set(k, x - 0.02 - 0.05 * drift, IFACE_Y + 0.07 + 0.05 * drift, z, born * fade);
        ho.set(k, x + 0.02 + 0.05 * drift, IFACE_Y - 0.02 - 0.05 * drift, z, born * fade);
      }
      const br = burst(tau, T_BREAK, 0.7, 0.2);
      if (br) fl.set(k, x, IFACE_Y, z, br.r, br.a * 1.3);
    });
    ph.flush();
    el.flush();
    ho.flush();
    fl.flush();

    // defect markers at the broken interface sites
    for (let k = 0; k < HITS.length; k++) gh.hide(k);
    if (step === 3) {
      HITS.forEach((h, k) => {
        const d = done.current[k]!;
        if (d > 0.02) gh.set(k, WIN_AT[0] + h.x, IFACE_Y, WIN_AT[2] + h.z, 0.04 + 0.006 * Math.sin(t * 5 + k), d * 0.9, DEG.lost);
      });
      const first = HITS.findIndex((_, k) => done.current[k]! > 0.6);
      if (first >= 0) {
        defectTag.current.x = WIN_AT[0] + HITS[first]!.x + 0.1;
        defectTag.current.y = IFACE_Y + 0.17;
        defectTag.current.z = WIN_AT[2] + HITS[first]!.z + 0.1;
        defectTag.current.a = 1;
      }
    }
    gh.flush();
  });

  const style =
    (isEtl: boolean) => (a: Atom, out: { pos: V3; scale: number; color: THREE.Color }) => {
      const t = clock.current.t;
      out.scale *= open.current;
      const at = isEtl ? ETL_AT : PERO_AT;
      out.pos[0] += Math.sin(t * 5.3 + a.id * 1.7) * 0.004;
      out.pos[1] += Math.sin(t * 4.4 + a.id * 2.3) * 0.004;
      // the ETL glows violet for a moment where UV lands
      HITS.forEach((h, k) => {
        const tau = clock.current.t - h.t0;
        const wx = at[0] + a.p[0] - (WIN_AT[0] + h.x);
        const wy = at[1] + a.p[1] - IFACE_Y;
        const wz = at[2] + a.p[2] - (WIN_AT[2] + h.z);
        const r = Math.hypot(wx, wy, wz);
        const d = done.current[k]!;
        if (isUv.current && step === 3 && tau > 0 && tau < T_BREAK && r < 0.28) {
          out.color.lerp(VIOLET, (1 - r / 0.28) * 0.6 * Math.sin((Math.PI * tau) / T_BREAK));
        }
        if (d > 0 && r < 0.3) {
          const w = Math.min(1, (1 - r / 0.3) * 1.5) * d;
          const o = hashOffset(a.id + k * 17, 0.06 * w);
          out.pos[0] += o[0];
          out.pos[1] += o[1];
          out.pos[2] += o[2];
          out.color.lerp(ORANGE, 0.9 * w);
        }
      });
    };

  const frameP = style(false);
  const frameE = style(true);

  return (
    <group>
      <DegradeBase ctl={ctl} clock={clock} layerLabels={step === 0} sunTag={step === 0}>
        <group position={PERO_AT}>
          <DynLattice atoms={PERO} radii={RADII} frame={frameP} />
        </group>
        <group position={ETL_AT}>
          <DynLattice
            atoms={ETL}
            radii={{ A: 0.03, B: 0.024, X: 0.02 }}
            colors={ETL_COLORS}
            bondColor="#7fb0f0"
            frame={frameE}
          />
        </group>
        <WindowFrame center={WIN_AT} size={WIN_SIZE} alpha={winAlpha} color="#9fb2c6" />
      </DegradeBase>

      <Swarm ref={photons} count={HITS.length} color={DEG.uv} radius={0.04} emissive={2} />
      <Swarm ref={electrons} count={HITS.length} color={COLOR.electron} radius={0.028} />
      <Swarm ref={holes} count={HITS.length} color={COLOR.hole} radius={0.028} />
      <Flashes ref={flashes} count={HITS.length} color={DEG.uv} />
      <Ghosts ref={ghosts} count={HITS.length} />

      <Follow pose={photonTag}>
        <StoryTag position={[0, 0, 0]} kind="particle" sub={LD.highEnergy}>
          {LD.uvPhoton}
        </StoryTag>
      </Follow>
      <Follow pose={defectTag}>
        <StoryTag position={[0, 0, 0]} kind="bad">
          {L.defect}
        </StoryTag>
      </Follow>
      <Follow pose={sunTag}>
        <ModeTag uv={isUv} />
      </Follow>

      {step === 0 ? (
        <StoryTag position={[3.15, -0.09, 0]} kind="good" minor>
          {L.current}
        </StoryTag>
      ) : null}
      {step === 2 ? (
        <>
          <StoryTag position={[-2.1, 0.85, 0.9]} kind="particle">
            {LD.uvPhoton}
          </StoryTag>
          <StoryTag position={[2.55, 0.37, 0.9]} kind="layer">
            {LD.etlLattice}
          </StoryTag>
        </>
      ) : null}
      {step === 3 ? (
        <>
          <StoryTag position={[-0.85, 0.46, WIN_AT[2] + 0.2]} kind="layer">
            {LD.etlLattice}
          </StoryTag>
          <StoryTag position={[-0.85, 0.0, WIN_AT[2] + 0.2]} kind="layer">
            {LD.perovskite}
          </StoryTag>
          <StoryTag position={[0.78, IFACE_Y, WIN_AT[2] + 0.28]} kind="concept">
            {LD.interface}
          </StoryTag>
        </>
      ) : null}
      {step === 4 ? (
        <>
          <StoryTag position={[-1.3, 0.34, 1.05]} kind="bad">
            {LD.stuck}
          </StoryTag>
          <StoryTag position={[-1.3, 0.02, 1.05]} kind="bad" minor>
            {LD.defects}
          </StoryTag>
        </>
      ) : null}
      {step === 5 ? (
        <>
          <StoryTag position={[-1.6, 0.34, 0.9]} kind="bad">
            {LD.interface}
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

/** "Visible light" or "UV light", whichever the scene is showing right now. */
function ModeTag({ uv }: { uv: { current: boolean } }) {
  const [on, setOn] = useState(false);
  const last = useRef(false);
  useFrame(() => {
    if (uv.current !== last.current) {
      last.current = uv.current;
      setOn(uv.current);
    }
  });
  return (
    <StoryTag position={[0, 0, 0]} kind={on ? "particle" : "concept"} sub={on ? LD.highEnergy : undefined}>
      {on ? LD.uv : LD.visible}
    </StoryTag>
  );
}
