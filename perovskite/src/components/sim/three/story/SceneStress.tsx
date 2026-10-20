import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { L, LD } from "@/lib/sim/story";
import { DEG, DegradeBase, Molecules, makeDegCtl, type MolApi } from "./degradeKit";
import { GRAINS } from "./grains";
import { Arrow3, StoryTag, Swarm, makeCellState, stepDur, useStoryClock, type SwarmApi } from "./storyKit";
import { between, hash1, lerp } from "./world";

const N_WATER = 6;
const N_O2 = 5;
const N_UV = 7;
const N_HEAT = 14;
const N_ION = 8;
const PLATE = new THREE.BoxGeometry(1, 1, 1);
const COLD = new THREE.Color("#4a5560");
const HOT = new THREE.Color("#ff6a1f");

/** How strongly each stress is shown: all of them in step 0, one at a time in steps 1–5, all again later. */
function emphasis(step: number, which: number): number {
  if (step === 0) return 1;
  if (step >= 1 && step <= 5) return step === which + 1 ? 1.25 : 0.28;
  return 0.8;
}

export function StressScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("dall", step), 2);
  const cell = useRef(makeCellState()).current;
  const ctl = useRef(makeDegCtl(cell)).current;
  const water = useRef<MolApi>(null);
  const oxy = useRef<MolApi>(null);
  const uv = useRef<SwarmApi>(null);
  const heat = useRef<SwarmApi>(null);
  const ions = useRef<SwarmApi>(null);
  const plateMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const t = clock.current.t;
    const w = water.current;
    const o = oxy.current;
    const u = uv.current;
    const h = heat.current;
    const io = ions.current;
    if (!w || !o || !u || !h || !io) return;

    // damage and its consequence
    const D = step === 6 ? 0.7 * between(t, 0.5, 6.0) : step >= 7 ? 0.75 : 0;
    cell.dmg = D * 0.6;
    for (const g of GRAINS) ctl.grains.dmg[g.id] = D * (0.4 + 0.6 * hash1(g.id * 2.3));
    const f = ctl.flow;
    f.light = 1;
    f.loss = step === 7 ? 0.8 * between(t, 0.5, 3.0) : step >= 8 ? 0.8 : 0;
    f.where = 0;
    f.zx0 = -2;
    f.zx1 = 2;
    ctl.sun = 1;
    ctl.zone.x0 = -1.95;
    ctl.zone.x1 = 1.95;
    ctl.zone.band = false;
    ctl.zone.a = step === 7 ? 0.5 * between(t, 0.3, 2.5) : step >= 8 ? 0.5 : 0;
    ctl.gaugeShow = step === 0 || step >= 6 ? 1 : 0;
    ctl.gauge = step === 8 ? 1 - 0.55 * between(t, 0.5, 7) : step === 7 ? 1 - 0.4 * between(t, 1.5, 7) : 1;

    // 💧 water falls onto the top of the cell
    const eW = emphasis(step, 0);
    for (let i = 0; i < N_WATER; i++) {
      const life = (t * 0.32 + i * 0.19) % 1;
      const x = -0.9 + (i % 3) * 0.7 + hash1(i * 3.1) * 0.2;
      const z = -0.3 + Math.floor(i / 3) * 0.8;
      const y = lerp(2.1, 0.95, life);
      const s = (life < 0.88 ? 1 : (1 - life) / 0.12) * eW * 1.5;
      w.set(i, x, y, z, s, t * 0.8 + i, t * 0.6 + i * 2, i * 0.7, 0.12 * eW);
    }
    w.flush();

    // O₂ drifts in from the left
    const eO = emphasis(step, 1);
    for (let i = 0; i < N_O2; i++) {
      const life = (t * 0.26 + i * 0.21) % 1;
      const x = lerp(-3.9, -2.15, life);
      const y = 0.15 + 0.45 * hash1(i * 5.3) + Math.sin(t * 1.3 + i) * 0.05;
      const z = -0.7 + i * 0.35;
      const s = (life < 0.88 ? 1 : (1 - life) / 0.12) * eO * 1.5;
      o.set(i, x, y, z, s, t * 0.5 + i, t * 0.7, i * 0.9, 0.12 * eO);
    }
    o.flush();

    // UV comes in from the upper right
    const eU = emphasis(step, 3);
    for (let i = 0; i < N_UV; i++) {
      const life = (t * 0.45 + i * 0.14) % 1;
      const z = -0.6 + hash1(i * 4.7) * 1.4;
      const x = lerp(3.5, 1.7 - hash1(i * 2.9) * 0.9, life);
      const y = lerp(2.4, 0.95, life);
      u.set(i, x, y, z, (life < 0.92 ? 1 : (1 - life) / 0.08) * eU * 1.3);
    }
    u.flush();

    // heat rises from a hot plate under the cell
    const eH = emphasis(step, 2);
    if (plateMat.current) {
      plateMat.current.color.copy(COLD).lerp(HOT, Math.min(1, eH));
      plateMat.current.emissive.copy(HOT);
      plateMat.current.emissiveIntensity = 0.15 + 0.9 * Math.min(1, eH);
    }
    for (let i = 0; i < N_HEAT; i++) {
      const life = (t * 0.38 + hash1(i * 4.3)) % 1;
      const x = -1.8 + hash1(i * 7.7) * 3.6;
      const z = -0.9 + hash1(i * 2.1) * 1.8;
      h.set(i, x + Math.sin(life * 9 + i) * 0.06, -0.62 + life * 1.5, z, (1 - life * 0.6) * eH);
    }
    h.flush();

    // I⁻ ions slide through the absorber
    const eI = emphasis(step, 4);
    for (let i = 0; i < N_ION; i++) {
      const life = (t * 0.22 + i / N_ION) % 1;
      const x = lerp(-1.7, 1.7, life);
      const z = 0.9 + (i % 2) * 0.12;
      io.set(i, x, 0.0 + Math.sin(life * 18 + i) * 0.03, z, 1.2 * eI * Math.min(1, life * 6) * Math.min(1, (1 - life) * 6));
    }
    io.flush();
  });

  const showTags = step <= 5;
  return (
    <group>
      <DegradeBase ctl={ctl} clock={clock} layerLabels={false} sunTag={false}>
        <mesh geometry={PLATE} position={[0, -0.8, 0]} scale={[4.3, 0.07, 2.6]}>
          <meshStandardMaterial ref={plateMat} color="#4a5560" roughness={0.6} />
        </mesh>
      </DegradeBase>

      <Molecules ref={water} kind="h2o" count={N_WATER} />
      <Molecules ref={oxy} kind="o2" count={N_O2} />
      <Swarm ref={uv} count={N_UV} color={DEG.uv} radius={0.05} emissive={2} />
      <Swarm ref={heat} count={N_HEAT} color={DEG.heat} radius={0.04} emissive={1.6} />
      <Swarm ref={ions} count={N_ION} color="#9d7bff" radius={0.035} halo={2.6} haloOpacity={0.3} emissive={1.8} />

      {/* the five stresses, laid out like the sketch: water above, O₂ left, UV right, heat below, ions inside */}
      <Arrow3 a={[0, 1.7, 0.9]} b={[0, 1.15, 0.9]} color={DEG.water} head={0.07} />
      <Arrow3 a={[-3.0, 0.1, 0.9]} b={[-2.35, 0.1, 0.9]} color={DEG.oxygen} head={0.07} />
      <Arrow3 a={[3.0, 1.8, 0.9]} b={[2.3, 1.15, 0.9]} color={DEG.uv} head={0.07} />
      <Arrow3 a={[0, -1.15, 0.9]} b={[0, -0.9, 0.9]} color={DEG.heat} head={0.07} />
      <Arrow3 a={[-1.2, -0.02, 1.4]} b={[1.2, -0.02, 1.4]} color="#9d7bff" head={0.07} />

      {showTags ? (
        <>
          <StoryTag position={[0, 2.15, 0.9]} kind={step === 1 ? "bad" : "particle"}>
            {LD.moistTag}
          </StoryTag>
          <StoryTag position={[-3.3, 0.45, 0.9]} kind={step === 2 ? "bad" : "particle"}>
            {LD.oxyTag}
          </StoryTag>
          <StoryTag position={[3.3, 2.0, 0.9]} kind={step === 4 ? "bad" : "particle"}>
            {LD.uvTag}
          </StoryTag>
          <StoryTag position={[0, -1.3, 0.9]} kind={step === 3 ? "bad" : "particle"}>
            {LD.heatTag}
          </StoryTag>
          <StoryTag position={[0, -0.28, 1.45]} kind={step === 5 ? "bad" : "iodide"}>
            {LD.ionTag}
          </StoryTag>
          <StoryTag position={[0.0, 0.62, 1.3]} kind="good">
            {LD.perov}
          </StoryTag>
        </>
      ) : null}
      {step >= 6 ? (
        <>
          <StoryTag position={[-1.4, 0.55, 1.3]} kind="bad">
            {LD.defects}
          </StoryTag>
          {step >= 7 ? (
            <StoryTag position={[1.3, 0.1, 1.3]} kind="bad">
              {LD.lossHere}
            </StoryTag>
          ) : null}
          <StoryTag position={[3.15, -0.09, 0]} kind="good" minor>
            {L.current}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}

