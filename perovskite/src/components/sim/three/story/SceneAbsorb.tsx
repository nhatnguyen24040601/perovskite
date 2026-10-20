import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { L } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import {
  BeamSet,
  CellStack,
  Flashes,
  Lattice,
  SLAB_ATOMS,
  SLAB_RADII,
  StoryTag,
  Swarm,
  ThicknessBracket,
  burst,
  makeCellState,
  stepDur,
  useStoryClock,
  type FlashApi,
  type SwarmApi,
} from "./storyKit";
import { COLOR, STACK, clamp01, smooth, stackSpans } from "./world";

const N = 7;
const Y0 = 2.7;
const SPEED = 1.7;
const GAP = 0.3;
const PERIOD = 4.4;

/** Seven sunbeams. Lane 4 is the one that slips through the thin layer. */
const LANES = [
  { x: -1.6, z: -0.5, d: 0.2, k: 0.12 },
  { x: -1.05, z: 0.6, d: 0.55, k: 0.3 },
  { x: -0.5, z: -0.3, d: 0.35, k: 0.5 },
  { x: 0.05, z: 0.55, d: 0.75, k: 0.72 },
  { x: 0.6, z: -0.65, d: 1.2, k: 0.96 },
  { x: 1.15, z: 0.25, d: 0.15, k: 0.22 },
  { x: 1.65, z: -0.2, d: 0.65, k: 0.85 },
];

type Mode = "thin" | "thick";
const THIN_STATE = makeCellState();

export function AbsorbScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("absorb", step), step === 3 ? 2.6 : 2);
  const state = useRef(makeCellState()).current;
  const photons = useRef<SwarmApi>(null);
  const electrons = useRef<SwarmApi>(null);
  const holes = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);
  const [mode, setMode] = useState<Mode>("thin");
  const modeRef = useRef<Mode>("thin");

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const c = clock.current;
    const s = useSim.getState();
    const t = c.t;

    // ── which absorber do we show? ──
    let want: Mode = "thin";
    if (step === 3) {
      if (s.absorbMode === "thick") want = "thick";
      else if (s.absorbMode === "auto") want = t >= 8.8 ? "thick" : "thin";
    }
    if (want !== modeRef.current) {
      modeRef.current = want;
      setMode(want);
    }
    const target = want === "thick" ? STACK.thick : STACK.thin;
    state.h += (target - state.h) * Math.min(1, dt * 2.6);
    state.thick = clamp01((state.h - STACK.thin) / (STACK.thick - STACK.thin));
    const spans = stackSpans(target);
    const botExit = spans.elec.y0 - 0.12;

    // ── time inside the current run ──
    const stream = step === 0;
    const detail = step === 2;
    let tt = t;
    if (step === 3)
      tt = want === "thick" && s.absorbMode === "auto" ? (t - 8.8) % PERIOD : t % PERIOD;
    if (stream) tt = t;

    const p = photons.current;
    const e = electrons.current;
    const h = holes.current;
    const f = flashes.current;
    if (!p || !e || !h || !f) return;

    let lit = 0;
    for (let i = 0; i < N; i++) {
      const lane = LANES[i]!;
      const hid = detail && i !== 3;
      const x = detail ? 0 : lane.x;
      const z = detail ? 0.15 : lane.z;
      const y0 = detail ? 1.5 : Y0;
      const v = detail ? 1.2 : SPEED;
      const launch = detail ? 0.3 : i * GAP;
      let yAbs: number;
      let passes = false;
      if (detail) yAbs = 0.02;
      else if (want === "thick") yAbs = STACK.top - (0.12 + lane.k * 0.82) * target;
      else if (i === 4) {
        passes = true;
        yAbs = botExit;
      } else yAbs = STACK.top - lane.d * target * 0.9;
      if (stream) yAbs = STACK.top - 0.03;

      const local = stream ? (((tt - launch) % 3.2) + 3.2) % 3.2 : tt - launch;
      const y = y0 - v * local;
      const tAbs = (y0 - yAbs) / v;
      const live = !hid && local >= 0 && local < tAbs;
      const sc = detail ? 1.5 : 1;
      if (live) {
        p.set(i, x, y, z, sc);
        lit++;
      } else p.hide(i);

      // flash and the electron–hole pair at the absorption point
      const fb =
        !hid && !passes && local >= tAbs
          ? burst(local, tAbs, stream ? 0.5 : 0.8, detail ? 0.22 : 0.2)
          : null;
      if (fb) f.set(i, x, yAbs, z, fb.r, fb.a);
      else f.hide(i);

      const born = !hid && !passes && !stream && local >= tAbs;
      if (born) {
        const k = smooth((local - tAbs) / 0.7);
        const fade = step === 3 ? 1 - smooth((tt - (PERIOD - 0.5)) / 0.4) : 1;
        const sp = detail ? 0.17 : 0.07;
        e.set(i, x - sp * k, yAbs + sp * 0.8 * k, z, sc * fade);
        h.set(i, x + sp * k, yAbs - sp * 0.8 * k, z, sc * fade);
      } else {
        e.hide(i);
        h.hide(i);
      }
    }
    p.flush();
    e.flush();
    h.flush();
    f.flush();
    void lit;
  });

  const spansThin = stackSpans(STACK.thin);
  const midY = spansThin.perov.mid;

  return (
    <group>
      <CellStack
        state={state}
        layerLabels={step === 0}
        lattice={
          <Lattice
            zoom
            dim={0.7}
            atoms={SLAB_ATOMS}
            radii={SLAB_RADII}
            bondOpacity={0.3}
            focus={step === 2 ? { c: [0, 0, 0.15], r: 0.32, min: 0.3, cull: 1.0 } : undefined}
          />
        }
      />

      <BeamSet
        count={N}
        update={(i, out) => {
          const c = clock.current;
          const detail = step === 2;
          const lane = LANES[i]!;
          out.x = detail ? 0 : lane.x;
          out.z = detail ? 0.15 : lane.z;
          out.y0 = detail ? 1.5 : Y0;
          const thick = modeRef.current === "thick";
          const target = thick ? STACK.thick : STACK.thin;
          const botExit = stackSpans(target).elec.y0 - 0.12;
          let end: number;
          if (detail) end = 0.02;
          else if (step === 0) end = STACK.top - 0.03;
          else if (thick) end = STACK.top - (0.12 + lane.k * 0.82) * target;
          else end = i === 4 ? botExit : STACK.top - lane.d * target * 0.9;
          out.y1 = end;
          out.alpha = detail && i !== 3 ? 0 : c.t > 0 ? 0.32 : 0;
        }}
      />
      <Swarm ref={photons} count={N} color={COLOR.photon} radius={0.055} emissive={1.8} />
      <Swarm ref={electrons} count={N} color={COLOR.electron} radius={0.062} />
      <Swarm ref={holes} count={N} color={COLOR.hole} radius={0.062} />
      <Flashes ref={flashes} count={N} color="#ffd98a" />

      {/* labels */}
      {step === 0 ? (
        <StoryTag position={[-0.5, 1.75, -0.3]} kind="particle">
          {L.photon}
        </StoryTag>
      ) : null}
      {step === 1 || step === 4 ? (
        <>
          <StoryTag position={[0.9, midY, 1.25]}>{L.thinLayer}</StoryTag>
          <ThicknessBracket state={THIN_STATE} x={-1.95} z={1.25}>
            <StoryTag position={[0.7, -0.44, 0]} kind="good" sub={L.scale}>
              {L.thinAbsorber}
            </StoryTag>
          </ThicknessBracket>
        </>
      ) : null}
      {step === 1 ? (
        <>
          <StoryTag position={[-1.6, 1.25, -0.5]} kind="particle" minor>
            {L.photon}
          </StoryTag>
          <StoryTag position={[-1.5, midY + 0.4, 0.6]} kind="particle">
            {L.electron}
          </StoryTag>
          <StoryTag position={[-0.6, midY - 0.42, 0.6]} kind="particle">
            {L.hole}
          </StoryTag>
        </>
      ) : null}
      {step === 2 ? (
        <>
          <StoryTag position={[0.05, 0.62, 0.15]} kind="particle">
            {L.photon}
          </StoryTag>
          <StoryTag position={[-0.38, 0.2, 0.15]} kind="particle">
            {L.electron}
          </StoryTag>
          <StoryTag position={[0.4, -0.2, 0.15]} kind="particle">
            {L.hole}
          </StoryTag>
        </>
      ) : null}
      {step === 3 ? (
        <>
          <ThicknessBracket state={state} x={-1.95} z={1.25}>
            <StoryTag
              position={[0.78, 0, 0]}
              kind={mode === "thin" ? "good" : "bad"}
              sub={mode === "thin" ? L.thinNote : L.thickNote}
            >
              {mode === "thin" ? L.thinAbsorber : L.thickAbsorber}
            </StoryTag>
          </ThicknessBracket>
          <StoryTag position={[-0.5, 1.75, -0.3]} kind="particle" minor>
            {L.photon}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
