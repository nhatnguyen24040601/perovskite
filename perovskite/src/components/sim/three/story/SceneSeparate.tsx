import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { L } from "@/lib/sim/story";
import {
  Arrow3,
  BeamSet,
  CellStack,
  Circuit,
  Flashes,
  Lattice,
  SLAB_ATOMS,
  SLAB_RADII,
  StoryTag,
  Swarm,
  burst,
  jitter,
  makeCellState,
  stepDur,
  useGate,
  useStoryClock,
  type FlashApi,
  type SwarmApi,
} from "./storyKit";
import { COLOR, STACK, along, between, clamp01, lerp, pathLength, wander, type V3 } from "./world";

const Z = 0.18;
const ETL_Y = STACK.top + 0.12;
const HTL_Y = STACK.top - STACK.thin - 0.12;
const SITE: V3 = [0, 0.04, Z];
/** electron and hole right after absorption, and after the electron is lifted */
const E_BOUND: V3 = [-0.1, 0.04, Z];
const H_BOUND: V3 = [0.1, 0.04, Z];
const E_HOP: V3 = [-0.2, 0.17, Z];
const E_FREE: V3 = [-0.55, 0.15, Z + 0.05];
const H_FREE: V3 = [0.45, -0.05, Z - 0.05];

const E_RUN = wander(3, E_FREE, [-0.5, ETL_Y, Z + 0.03], 4, [0.07, 0.02, 0.05]);
const H_RUN = wander(9, H_FREE, [0.4, HTL_Y, Z - 0.03], 4, [0.07, 0.02, 0.05]);
const E_LEN = pathLength(E_RUN);
const H_LEN = pathLength(H_RUN);
/** the quick trip used in the last step, starting right at the absorption site */
const E_FAST = wander(5, SITE, [-0.3, ETL_Y, Z], 4, [0.07, 0.03, 0.06]);
const H_FAST = wander(6, SITE, [0.3, HTL_Y, Z], 4, [0.07, 0.03, 0.06]);
const EF_LEN = pathLength(E_FAST);
const HF_LEN = pathLength(H_FAST);

const LINK_N = 7;

function mix(a: V3, b: V3, k: number): V3 {
  return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
}

export function SeparateScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("exciton", step), 2);
  const state = useRef(makeCellState()).current;
  const photon = useRef<SwarmApi>(null);
  const electron = useRef<SwarmApi>(null);
  const hole = useRef<SwarmApi>(null);
  const link = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);
  const circuitOn = useRef(0);
  const linkPose = useRef({ x: 0, y: 0, a: 0 });

  useFrame(() => {
    const t = clock.current.t;
    const p = photon.current;
    const e = electron.current;
    const h = hole.current;
    const lk = link.current;
    const f = flashes.current;
    if (!p || !e || !h || !lk || !f) return;
    const S = step === 5 ? 1 : 1.3;

    // photon
    p.hide(0);
    f.hide(0);
    f.hide(1);
    f.hide(2);
    let ePos: V3 | null = null;
    let hPos: V3 | null = null;
    let linkA = 0;
    let etl = 0;
    let htl = 0;

    if (step === 0) {
      const y0 = 0.9;
      const k = clamp01((t - 0.2) / 1.7);
      if (k < 1) p.set(0, SITE[0], y0 + (SITE[1] - y0) * k, Z, S);
      else {
        p.set(0, SITE[0], SITE[1], Z, S * (1 + 0.25 * Math.sin(t * 8)));
        const b = burst(t, 1.9, 0.9, 0.2);
        if (b) f.set(0, SITE[0], SITE[1], Z, b.r * 0.6, b.a * 0.5);
      }
    } else if (step === 1) {
      const tAbs = 0.9;
      const y0 = 0.7;
      const k = clamp01(t / tAbs);
      if (t < tAbs) p.set(0, SITE[0], y0 + (SITE[1] - y0) * k, Z, S);
      const b = burst(t, tAbs, 0.9, 0.25);
      if (b) f.set(0, SITE[0], SITE[1], Z, b.r, b.a);
      if (t >= tAbs) {
        const g = between(t, tAbs, tAbs + 0.5);
        const j = jitter(1, t, 0.006);
        ePos = [E_BOUND[0] + j[0], E_BOUND[1] + j[1], E_BOUND[2] + j[2]];
        hPos = [H_BOUND[0] - j[0], H_BOUND[1] - j[1], H_BOUND[2] - j[2]];
        ePos = mix(SITE, ePos, g);
        hPos = mix(SITE, hPos, g);
        linkA = g;
      }
    } else if (step === 2) {
      const hop = between(t, 0.6, 1.9);
      const arc = Math.sin(Math.PI * hop) * 0.05;
      ePos = [lerp(E_BOUND[0], E_HOP[0], hop), lerp(E_BOUND[1], E_HOP[1], hop) + arc, Z];
      hPos = [H_BOUND[0], H_BOUND[1], H_BOUND[2]];
      linkA = 1;
      // rings that say "this electron just gained energy"
      for (let r = 0; r < 3; r++) {
        const b = burst(t, 0.6 + r * 0.45, 0.9, 0.2);
        if (b) f.set(r, ePos[0], ePos[1], ePos[2], b.r, b.a * 0.7);
      }
    } else if (step === 3) {
      const sep = between(t, 0.8, 4.4);
      const j = jitter(4, t, 0.012 * sep + 0.004);
      ePos = [
        lerp(E_HOP[0], E_FREE[0], sep) + j[0],
        lerp(E_HOP[1], E_FREE[1], sep) + j[1],
        lerp(E_HOP[2], E_FREE[2], sep) + j[2],
      ];
      hPos = [
        lerp(H_BOUND[0], H_FREE[0], sep) - j[0],
        lerp(H_BOUND[1], H_FREE[1], sep) - j[1],
        lerp(H_BOUND[2], H_FREE[2], sep) - j[2],
      ];
      linkA = 1 - between(t, 0.2, 1.4);
    } else if (step === 4) {
      const u = between(t, 0.9, 5.2);
      const eu = along(E_RUN, u, E_LEN);
      const hu = along(H_RUN, u, H_LEN);
      const j = jitter(5, t, 0.008);
      ePos = [eu[0] + j[0], eu[1] + j[1], eu[2]];
      hPos = [hu[0] - j[0], hu[1] - j[1], hu[2]];
      if (u >= 1) {
        etl = 1;
        htl = 1;
      }
    } else {
      // last step: the quick trip, then the circuit
      const u = between(t, 0.5, 2.8);
      const eu = along(E_FAST, u, EF_LEN);
      const hu = along(H_FAST, u, HF_LEN);
      ePos = eu;
      hPos = hu;
      if (u >= 1) {
        etl = 1;
        htl = 1;
      }
      circuitOn.current = between(t, 3.2, 4.0);
    }
    if (step !== 5) circuitOn.current = 0;

    if (ePos) e.set(0, ePos[0], ePos[1], ePos[2], S);
    else e.hide(0);
    if (hPos) h.set(0, hPos[0], hPos[1], hPos[2], S);
    else h.hide(0);

    // dotted "bond" between the two charges while they are still bound
    for (let i = 0; i < LINK_N; i++) {
      if (!ePos || !hPos || linkA <= 0.02) {
        lk.hide(i);
        continue;
      }
      const q = (i + 1) / (LINK_N + 1);
      const pulse = 0.85 + 0.15 * Math.sin(t * 7 - i);
      lk.set(
        i,
        lerp(ePos[0], hPos[0], q),
        lerp(ePos[1], hPos[1], q),
        lerp(ePos[2], hPos[2], q),
        linkA * pulse,
      );
    }
    if (ePos && hPos) {
      linkPose.current.x = (ePos[0] + hPos[0]) / 2;
      linkPose.current.y = Math.max(ePos[1], hPos[1]) + 0.2;
    }
    linkPose.current.a = linkA;

    state.etl += (etl - state.etl) * 0.1;
    state.htl += (htl - state.htl) * 0.1;
    p.flush();
    e.flush();
    h.flush();
    lk.flush();
    f.flush();
  });

  const showCircuit = step === 5;

  return (
    <group>
      <CellStack
        state={state}
        layerLabels={showCircuit}
        lattice={
          <Lattice
            zoom
            atoms={SLAB_ATOMS}
            radii={SLAB_RADII}
            bondOpacity={0.35}
            focus={step === 5 ? undefined : { c: [0, 0.02, Z], r: 0.32, min: 0.3, cull: 1.0 }}
          />
        }
      />
      <BeamSet
        count={1}
        update={(_i, out) => {
          out.x = SITE[0];
          out.z = Z;
          out.y0 = step === 0 ? 0.9 : step === 1 ? 0.7 : SITE[1];
          out.y1 = SITE[1];
          out.alpha = step <= 1 ? 0.4 : 0;
        }}
      />
      <Swarm ref={photon} count={1} color={COLOR.photon} radius={0.06} emissive={1.8} />
      <Swarm ref={electron} count={1} color={COLOR.electron} radius={0.06} />
      <Swarm ref={hole} count={1} color={COLOR.hole} radius={0.06} />
      <Swarm
        ref={link}
        count={LINK_N}
        color="#ffe9b0"
        radius={0.017}
        halo={2.0}
        haloOpacity={0.2}
        emissive={1.8}
      />
      <Flashes ref={flashes} count={3} color="#ffd98a" />

      {showCircuit ? <Circuit onRef={circuitOn} clock={clock} /> : null}

      {/* labels */}
      {step === 0 ? (
        <StoryTag position={[0.28, 0.5, Z]} kind="particle">
          {L.photon}
        </StoryTag>
      ) : null}
      {step >= 1 && step <= 2 ? (
        <>
          <StoryTag position={[-0.42, -0.1, Z]} kind="particle">
            {L.electron}
          </StoryTag>
          <StoryTag position={[0.4, -0.1, Z]} kind="particle">
            {L.hole}
          </StoryTag>
          <LinkTag pose={linkPose} />
        </>
      ) : null}
      {step === 3 ? (
        <>
          <StoryTag position={[-0.6, 0.38, Z]} kind="particle">
            {L.mobile}
          </StoryTag>
          <StoryTag position={[0.5, -0.3, Z]} kind="particle">
            {L.mobile}
          </StoryTag>
        </>
      ) : null}
      {step === 4 ? (
        <>
          <Arrow3
            a={[E_FREE[0] + 0.1, 0.1, Z + 0.1]}
            b={[E_FREE[0] + 0.1, 0.42, Z + 0.1]}
            color={COLOR.electron}
          />
          <Arrow3
            a={[H_FREE[0] - 0.1, -0.02, Z + 0.1]}
            b={[H_FREE[0] - 0.1, -0.36, Z + 0.1]}
            color={COLOR.hole}
          />
          <StoryTag position={[-0.62, 0.02, Z]} kind="particle" minor>
            {L.electron}
          </StoryTag>
          <StoryTag position={[0.62, -0.02, Z]} kind="particle" minor>
            {L.hole}
          </StoryTag>
          <StoryTag position={[0.75, 0.52, Z]} kind="good">
            {L.separation}
          </StoryTag>
          <StoryTag position={[-1.05, ETL_Y, Z]} kind="layer" minor>
            {L.etlShort}
          </StoryTag>
          <StoryTag position={[-1.05, HTL_Y, Z]} kind="layer" minor>
            {L.htlShort}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}

/** "e⁻ ↔ h⁺" floats over the pair for as long as the two are still bound. */
function LinkTag({ pose }: { pose: { current: { x: number; y: number; a: number } } }) {
  const group = useRef<import("three").Group>(null);
  const on = useGate(() => pose.current.a > 0.5);
  useFrame(() => {
    group.current?.position.set(pose.current.x, pose.current.y, Z);
  });
  return (
    <group ref={group}>
      {on ? (
        <StoryTag position={[0, 0, 0]} kind="tiny" minor>
          {"e⁻ ↔ h⁺"}
        </StoryTag>
      ) : null}
    </group>
  );
}
