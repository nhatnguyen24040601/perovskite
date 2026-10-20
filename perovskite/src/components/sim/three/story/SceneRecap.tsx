import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { L } from "@/lib/sim/story";
import {
  BeamSet,
  CellStack,
  Circuit,
  Flashes,
  GlowBall,
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
import { COLOR, STACK, along, between, clamp01, pathLength, wander, type V3 } from "./world";

const ETL_Y = STACK.top + 0.12;
const HTL_Y = STACK.top - STACK.thin - 0.12;
const LANES = [-1.5, -0.8, -0.1, 0.6, 1.3];
const LANE_Z = [-0.4, 0.5, -0.2, 0.4, -0.5];
const Y0 = 2.5;
const V = 1.6;
const PERIOD = 2.8;

/** Two "hero" pairs follow the whole story from absorption to electricity. */
const HERO = [
  { x: -0.8, z: 0.5, tAbs: 1.9 },
  { x: 0.6, z: 0.4, tAbs: 2.5 },
].map((h, n) => {
  const s: V3 = [h.x, -0.05 + n * 0.1, h.z];
  const e = wander(30 + n, s, [h.x + 0.7, ETL_Y, h.z * 0.6], 6, [0.14, 0.1, 0.16]);
  const hp = wander(60 + n, s, [h.x - 0.6, HTL_Y, h.z * 0.6], 6, [0.14, 0.1, 0.16]);
  return { ...h, s, e, h: hp, eLen: pathLength(e), hLen: pathLength(hp) };
});
const T_GO = 3.2;
const T_RUN = 3.4;

export function RecapScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("recap", step), 2);
  const state = useRef(makeCellState()).current;
  const photons = useRef<SwarmApi>(null);
  const electrons = useRef<SwarmApi>(null);
  const holes = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);
  const circuitOn = useRef(0);

  useFrame(() => {
    const t = clock.current.t;
    const p = photons.current;
    const e = electrons.current;
    const h = holes.current;
    const f = flashes.current;
    if (!p || !e || !h || !f) return;
    const absorb = step >= 1;
    const pairs = step >= 2;
    const travel = step >= 3;
    const current = step >= 4;

    // sunbeams stream in all the time
    for (let i = 0; i < LANES.length; i++) {
      const local = (((t - i * 0.35) % PERIOD) + PERIOD) % PERIOD;
      const yAbs = STACK.top - 0.05 - 0.07 * i;
      const tAbs = (Y0 - yAbs) / V;
      if (local < tAbs) p.set(i, LANES[i]!, Y0 - V * local, LANE_Z[i]!, 1);
      else p.hide(i);
      const b = absorb && local >= tAbs ? burst(local, tAbs, 0.6, 0.18) : null;
      if (b) f.set(i, LANES[i]!, yAbs, LANE_Z[i]!, b.r, b.a);
      else f.hide(i);
    }

    let etl = 0;
    let htl = 0;
    let done = 0;
    HERO.forEach((hero, n) => {
      if (!pairs || t < hero.tAbs) {
        e.hide(n);
        h.hide(n);
        return;
      }
      const born = between(t, hero.tAbs, hero.tAbs + 0.6);
      const u = travel ? clamp01((t - T_GO - n * 0.3) / T_RUN) : 0;
      const pe = along(hero.e, u, hero.eLen);
      const ph = along(hero.h, u, hero.hLen);
      const j = jitter(n, t, u > 0 && u < 1 ? 0.012 : 0.006);
      const sp = 0.07 * born;
      if (u === 0) {
        e.set(n, hero.s[0] - sp + j[0], hero.s[1] + sp * 0.8 + j[1], hero.s[2], born);
        h.set(n, hero.s[0] + sp - j[0], hero.s[1] - sp * 0.8 - j[1], hero.s[2], born);
      } else {
        e.set(n, pe[0] + j[0], pe[1] + j[1], pe[2] + j[2], 1);
        h.set(n, ph[0] - j[0], ph[1] - j[1], ph[2] - j[2], 1);
      }
      if (u >= 1) done++;
    });
    if (done > 0) {
      etl = 1;
      htl = 1;
    }
    state.etl += (etl - state.etl) * 0.1;
    state.htl += (htl - state.htl) * 0.1;
    state.perov += ((step === 1 ? 1 : 0) - state.perov) * 0.1;
    circuitOn.current = current ? between(t, T_GO + T_RUN + 0.2, T_GO + T_RUN + 1.0) : 0;

    p.flush();
    e.flush();
    h.flush();
    f.flush();
  });

  const showSun = step === 0 || step === 5;
  const all = step === 5;
  const tagSun = showSun;
  const tagAbsorb = step === 1 || all;
  const tagPair = step === 2 || all;
  const tagTransport = step === 3 || all;
  const tagElectric = step === 4 || all;
  const pairTags = useGate(() => clock.current.t > 2.6);

  return (
    <group>
      <CellStack
        state={state}
        layerLabels={false}
        lattice={<Lattice zoom dim={0.7} atoms={SLAB_ATOMS} radii={SLAB_RADII} bondOpacity={0.3} />}
      />
      <BeamSet
        count={LANES.length}
        update={(i, out) => {
          out.x = LANES[i]!;
          out.z = LANE_Z[i]!;
          out.y0 = Y0;
          out.y1 = STACK.top - 0.05 - 0.07 * i;
          out.alpha = 0.3;
        }}
      />
      <Swarm
        ref={photons}
        count={LANES.length}
        color={COLOR.photon}
        radius={0.055}
        emissive={1.8}
      />
      <Swarm ref={electrons} count={2} color={COLOR.electron} radius={0.06} />
      <Swarm ref={holes} count={2} color={COLOR.hole} radius={0.06} />
      <Flashes ref={flashes} count={LANES.length} color="#ffd98a" />

      {/* the Sun */}
      <GlowBall position={[1.7, 2.7, -0.3]} color="#ffcf55" radius={0.26} intensity={1.8} />
      {tagSun ? (
        <StoryTag position={[2.45, 2.7, -0.3]} kind="particle">
          {L.sun}
        </StoryTag>
      ) : null}
      {tagAbsorb ? (
        <StoryTag position={[-2.5, 0.0, 0.5]} kind="good">
          {L.absorberNode}
        </StoryTag>
      ) : null}
      {tagPair && pairTags ? (
        <>
          <StoryTag position={[-1.55, 0.42, 0.6]} kind="particle">
            {L.electron}
          </StoryTag>
          <StoryTag position={[-0.25, -0.38, 0.6]} kind="particle">
            {L.hole}
          </StoryTag>
        </>
      ) : null}
      {tagTransport ? (
        <>
          <StoryTag position={[2.55, ETL_Y, 0.4]} kind="layer">
            {L.transportNode}
          </StoryTag>
        </>
      ) : null}
      {step >= 4 ? <Circuit onRef={circuitOn} clock={clock} tag={false} /> : null}
      {tagElectric ? (
        <StoryTag position={[3.25, -0.09, 0]} kind="good">
          {L.electricity}
        </StoryTag>
      ) : null}
    </group>
  );
}
