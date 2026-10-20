import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { L } from "@/lib/sim/story";
import {
  CellStack,
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
  useStoryClock,
  type FlashApi,
  type SwarmApi,
} from "./storyKit";
import {
  COLOR,
  STACK,
  along,
  between,
  clamp01,
  pathLength,
  vertexAt,
  wander,
  type V3,
} from "./world";

/** Electrons end in the electron transport layer, holes in the hole transport layer. */
const ETL_Y = STACK.top + 0.12;
const HTL_Y = STACK.top - STACK.thin - 0.12;

type Pair = { s: V3; e: V3[]; h: V3[]; eLen: number; hLen: number; eCum: number[]; hCum: number[] };

function cumulative(pts: V3[]): number[] {
  const out = [0];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += pathLength([pts[i - 1]!, pts[i]!]);
    out.push(acc);
  }
  return out;
}

function clampInside(pts: V3[]): V3[] {
  return pts.map((p, i) =>
    i === 0 || i === pts.length - 1
      ? p
      : ([p[0], Math.min(0.2, Math.max(-0.2, p[1])), Math.min(1.05, Math.max(-1.05, p[2]))] as V3),
  );
}

function makePair(seed: number, s: V3, eDx: number, hDx: number): Pair {
  const e = clampInside(wander(seed, s, [s[0] + eDx, ETL_Y, s[2] * 0.7], 7, [0.17, 0.12, 0.2]));
  const h = clampInside(
    wander(seed + 40, s, [s[0] + hDx, HTL_Y, s[2] * 0.7], 7, [0.17, 0.12, 0.2]),
  );
  const eLen = pathLength(e);
  const hLen = pathLength(h);
  return { s, e, h, eLen, hLen, eCum: cumulative(e), hCum: cumulative(h) };
}

const PAIRS: Pair[] = [
  makePair(2, [-1.1, 0.04, 0.45], 0.95, -0.6),
  makePair(5, [-0.45, -0.05, -0.5], 0.85, -0.85),
  makePair(8, [0.5, 0.02, 0.5], 0.8, -0.8),
  makePair(11, [1.15, 0.05, -0.3], -0.55, 0.5),
];

const TRAIL_N = 9;
const T_GO = 1.0;
const T_RUN = 5.4;

type Role = "all" | "ruler" | "short" | "long";

function roleOf(step: number): Role {
  if (step === 2) return "ruler";
  if (step === 3) return "short";
  if (step === 4) return "long";
  return "all";
}

const PAIR_FOR: Record<Role, number | null> = { all: null, ruler: 1, short: 2, long: 2 };

const LIFE = { short: 2.4, long: 7.5 };

export function TransportScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("diffusion", step), 2);
  const state = useRef(makeCellState()).current;
  const role = roleOf(step);
  const only = PAIR_FOR[role];

  const electrons = useRef<SwarmApi>(null);
  const holes = useRef<SwarmApi>(null);
  const trail = useRef<SwarmApi>(null);
  const trailE = useRef<SwarmApi>(null);
  const trailH = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const fillMat = useRef<THREE.MeshBasicMaterial>(null);
  const rulerTravel = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = clock.current.t;
    const e = electrons.current;
    const h = holes.current;
    const tr = trail.current;
    const te = trailE.current;
    const th = trailH.current;
    const f = flashes.current;
    if (!e || !h || !tr || !te || !th || !f) return;
    for (let i = 0; i < TRAIL_N * 4; i++) {
      te.hide(i);
      th.hide(i);
    }

    let arrivedE = 0;
    let arrivedH = 0;
    for (let n = 0; n < PAIRS.length; n++) {
      const pr = PAIRS[n]!;
      const hidden = only !== null && only !== n;
      if (hidden) {
        e.hide(n);
        h.hide(n);
        f.hide(n);
        f.hide(n + 4);
        continue;
      }
      const born = between(t, 0.1 + n * 0.18, 0.6 + n * 0.18);
      const shake = 0.012;
      if (step === 0) {
        const j = jitter(n, t, shake);
        e.set(n, pr.s[0] + j[0] - 0.05 * born, pr.s[1] + j[1] + 0.04 * born, pr.s[2] + j[2], born);
        h.set(n, pr.s[0] - j[0] + 0.05 * born, pr.s[1] - j[1] - 0.04 * born, pr.s[2] - j[2], born);
        f.hide(n);
        f.hide(n + 4);
        continue;
      }

      // how far along its path is each particle?
      let uE = clamp01((t - T_GO) / T_RUN);
      let uH = uE;
      let alive = true;
      let meet: V3 | null = null;
      if (role === "short") {
        const tDie = T_GO + LIFE.short;
        uE = clamp01((Math.min(t, tDie) - T_GO) / T_RUN);
        uH = uE;
        if (t >= tDie) alive = false;
        // the two particles drift together just before they recombine
        const pe = along(pr.e, uE, pr.eLen);
        const ph = along(pr.h, uH, pr.hLen);
        meet = [(pe[0] + ph[0]) / 2, (pe[1] + ph[1]) / 2, (pe[2] + ph[2]) / 2];
      }

      const pe = along(pr.e, uE, pr.eLen);
      const ph = along(pr.h, uH, pr.hLen);
      const j = jitter(n + 3, t, uE > 0 && uE < 1 ? 0.014 : 0.008);
      let ex = pe[0] + j[0];
      let ey = pe[1] + j[1];
      let ez = pe[2] + j[2];
      let hx = ph[0] - j[0];
      let hy = ph[1] - j[1];
      let hz = ph[2] - j[2];
      if (role === "short" && meet) {
        const k = between(t, T_GO + LIFE.short - 0.8, T_GO + LIFE.short);
        ex += (meet[0] - ex) * k;
        ey += (meet[1] - ey) * k;
        ez += (meet[2] - ez) * k;
        hx += (meet[0] - hx) * k;
        hy += (meet[1] - hy) * k;
        hz += (meet[2] - hz) * k;
      }

      // a short fading tail shows the zig-zag path each charge has just taken
      if (alive && role !== "ruler" && uE > 0 && uE < 1) {
        for (let k = 0; k < TRAIL_N; k++) {
          const back = (k + 1) * 0.022;
          const size = 0.7 - (k / TRAIL_N) * 0.55;
          const pe2 = along(pr.e, Math.max(0, uE - back), pr.eLen);
          te.set(n * TRAIL_N + k, pe2[0], pe2[1], pe2[2], size);
          const ph2 = along(pr.h, Math.max(0, uH - back), pr.hLen);
          th.set(n * TRAIL_N + k, ph2[0], ph2[1], ph2[2], size);
        }
      }

      if (alive) {
        e.set(n, ex, ey, ez, born);
        if (role === "ruler") h.hide(n);
        else h.set(n, hx, hy, hz, born);
      } else {
        e.hide(n);
        h.hide(n);
      }

      if (uE >= 1) arrivedE++;
      if (uH >= 1) arrivedH++;

      // a small flash each time a charge scatters
      const vE = vertexAt(pr.e, uE, pr.eLen);
      const dtE = (uE - pr.eCum[vE]! / pr.eLen) * T_RUN;
      const sE = alive && vE > 0 && uE < 1 ? burst(dtE, 0, 0.45, 0.1) : null;
      if (sE) f.set(n, pr.e[vE]![0], pr.e[vE]![1], pr.e[vE]![2], sE.r, sE.a * 0.7);
      else f.hide(n);
      const vH = vertexAt(pr.h, uH, pr.hLen);
      const dtH = (uH - pr.hCum[vH]! / pr.hLen) * T_RUN;
      const sH = alive && vH > 0 && uH < 1 && role !== "ruler" ? burst(dtH, 0, 0.45, 0.1) : null;
      if (sH) f.set(n + 4, pr.h[vH]![0], pr.h[vH]![1], pr.h[vH]![2], sH.r, sH.a * 0.7);
      else f.hide(n + 4);

      // recombination flash
      if (role === "short" && meet && t >= T_GO + LIFE.short) {
        const fb = burst(t, T_GO + LIFE.short, 1.1, 0.5);
        if (fb) f.set(n, meet[0], meet[1], meet[2], fb.r, fb.a);
      }

      // the dotted path left behind in the ruler step
      if (role === "ruler") {
        const count = 40;
        for (let i = 0; i < count; i++) {
          const w = (i / (count - 1)) * uE;
          if (uE <= 0.001 || w > uE) {
            tr.hide(i);
            continue;
          }
          const p = along(pr.e, w, pr.eLen);
          tr.set(i, p[0], p[1], p[2], 1);
        }
      }
    }
    e.flush();
    h.flush();
    te.flush();
    th.flush();
    f.flush();
    if (role === "ruler") tr.flush();
    else {
      for (let i = 0; i < 40; i++) tr.hide(i);
      tr.flush();
    }

    // transport layers light up when charges arrive
    const done =
      role === "short"
        ? 0
        : role === "all"
          ? arrivedE >= 4
            ? 1
            : arrivedE > 0
              ? 0.6
              : 0
          : arrivedE > 0
            ? 1
            : 0;
    const doneH =
      role === "short"
        ? 0
        : role === "all"
          ? arrivedH >= 4
            ? 1
            : arrivedH > 0
              ? 0.6
              : 0
          : role === "ruler"
            ? 0
            : arrivedH > 0
              ? 1
              : 0;
    state.etl += (done - state.etl) * 0.12;
    state.htl += (doneH - state.htl) * 0.12;

    // lifetime bar
    if (fillRef.current && fillMat.current && (role === "short" || role === "long")) {
      const life = role === "short" ? LIFE.short : LIFE.long;
      const frac = clamp01(1 - (t - T_GO) / life);
      const len = 1.5;
      fillRef.current.scale.x = Math.max(0.001, len * frac);
      fillRef.current.position.x = -len / 2 + (len * frac) / 2;
      fillMat.current.color.set(role === "short" ? (frac > 0 ? "#e4a23a" : "#ff3b4a") : "#8fd0a8");
    }
    // ruler bar grows with the travelled path
    if (rulerTravel.current && role === "ruler") {
      const pr = PAIRS[1]!;
      const u = clamp01((t - T_GO) / T_RUN);
      rulerTravel.current.scale.x = Math.max(0.001, pr.eLen * u);
    }
  });

  const p1 = PAIRS[1]!;

  return (
    <group>
      <CellStack
        state={state}
        layerLabels={false}
        lattice={<Lattice zoom dim={0.7} atoms={SLAB_ATOMS} radii={SLAB_RADII} bondOpacity={0.2} />}
      />
      <Swarm ref={electrons} count={4} color={COLOR.electron} radius={0.066} />
      <Swarm ref={holes} count={4} color={COLOR.hole} radius={0.066} />
      <Swarm
        ref={trailE}
        count={TRAIL_N * 4}
        color={COLOR.electron}
        radius={0.03}
        halo={1.6}
        haloOpacity={0.12}
      />
      <Swarm
        ref={trailH}
        count={TRAIL_N * 4}
        color={COLOR.hole}
        radius={0.03}
        halo={1.6}
        haloOpacity={0.12}
      />
      <Swarm
        ref={trail}
        count={40}
        color={COLOR.electron}
        radius={0.017}
        halo={2}
        haloOpacity={0.18}
      />
      <Flashes ref={flashes} count={8} color={role === "short" ? "#ff4a4a" : "#ffffff"} />

      {/* labels */}
      {step === 0 ? (
        <>
          <StoryTag position={[-1.55, 0.3, 0.45]} kind="particle">
            {L.electron}
          </StoryTag>
          <StoryTag position={[-0.7, -0.3, 0.45]} kind="particle">
            {L.hole}
          </StoryTag>
        </>
      ) : null}
      {step === 1 || step === 5 ? (
        <>
          <StoryTag position={[2.5, ETL_Y, 0.2]} kind="layer">
            {L.transport}
          </StoryTag>
          <StoryTag position={[2.5, HTL_Y, 0.2]} kind="layer">
            {L.transport}
          </StoryTag>
          <StoryTag position={[-1.6, 0.5, 0.45]} kind="particle" minor>
            {L.electron}
          </StoryTag>
          <StoryTag position={[-1.75, -0.45, 0.45]} kind="particle" minor>
            {L.hole}
          </StoryTag>
          <CollectedTags clock={clock} />
        </>
      ) : null}

      {role === "ruler" ? (
        <group>
          {/* thickness bracket at the start of the path */}
          <mesh position={[p1.s[0] - 0.22, 0, p1.s[2]]}>
            <boxGeometry args={[0.014, STACK.thin, 0.014]} />
            <meshBasicMaterial color={COLOR.photon} />
          </mesh>
          {/* the two rulers below the cell */}
          <group position={[-1.1, -0.82, 1.3]}>
            <mesh position={[STACK.thin / 2, 0, 0]}>
              <boxGeometry args={[STACK.thin, 0.045, 0.045]} />
              <meshBasicMaterial color={COLOR.photon} />
            </mesh>
            <StoryTag position={[STACK.thin + 0.95, 0, 0]} kind="good">
              {L.thickness}
            </StoryTag>
          </group>
          <group position={[-1.1, -1.02, 1.3]}>
            <group ref={rulerTravel} scale={[0.001, 1, 1]}>
              <mesh position={[0.5, 0, 0]}>
                <boxGeometry args={[1, 0.045, 0.045]} />
                <meshBasicMaterial color={COLOR.electron} />
              </mesh>
            </group>
            <StoryTag position={[p1.eLen + 0.95, 0, 0]} kind="particle">
              {L.travel}
            </StoryTag>
          </group>
        </group>
      ) : null}

      {role === "short" || role === "long" ? (
        <group position={[1.15, 1.02, 1.0]}>
          <mesh>
            <boxGeometry args={[1.5, 0.07, 0.07]} />
            <meshBasicMaterial color="#26323d" />
          </mesh>
          <mesh ref={fillRef} position={[0, 0, 0.01]}>
            <boxGeometry args={[1, 0.085, 0.085]} />
            <meshBasicMaterial ref={fillMat} color="#e4a23a" />
          </mesh>
          <StoryTag position={[0, 0.2, 0]} kind={role === "short" ? "bad" : "good"}>
            {role === "short" ? L.shortLife : L.longLife}
          </StoryTag>
        </group>
      ) : null}
      {role === "short" ? <RecombTag clock={clock} /> : null}
      {role === "long" ? <CollectedTags clock={clock} onlyPair={2} /> : null}
    </group>
  );
}

/** "Collected" appears once the charges have arrived in their transport layers. */
function CollectedTags({
  clock,
  onlyPair,
}: {
  clock: { current: { t: number } };
  onlyPair?: number;
}) {
  const shown = useRef(false);
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const on = clock.current.t > T_GO + T_RUN - 0.2;
    if (ref.current) ref.current.visible = on;
    shown.current = on;
  });
  const x = onlyPair === 2 ? PAIRS[2]!.s[0] + 0.8 : 0.9;
  return (
    <group ref={ref} visible={false}>
      <StoryTag position={[x, ETL_Y, 1.25]} kind="good">
        {L.collected}
      </StoryTag>
      <StoryTag position={[x - 0.2, HTL_Y, 1.25]} kind="good">
        {L.collected}
      </StoryTag>
    </group>
  );
}

/** "Recombination" appears where the electron and hole meet. */
function RecombTag({ clock }: { clock: { current: { t: number } } }) {
  const ref = useRef<THREE.Group>(null);
  const pr = PAIRS[2]!;
  const tDie = T_GO + LIFE.short;
  const pe = along(pr.e, clamp01(LIFE.short / T_RUN), pr.eLen);
  const ph = along(pr.h, clamp01(LIFE.short / T_RUN), pr.hLen);
  const mid: V3 = [(pe[0] + ph[0]) / 2, (pe[1] + ph[1]) / 2 + 0.3, (pe[2] + ph[2]) / 2];
  useFrame(() => {
    if (ref.current) ref.current.visible = clock.current.t > tDie - 0.1;
  });
  return (
    <group ref={ref} visible={false}>
      <StoryTag position={mid} kind="bad">
        {L.recombination}
      </StoryTag>
    </group>
  );
}
