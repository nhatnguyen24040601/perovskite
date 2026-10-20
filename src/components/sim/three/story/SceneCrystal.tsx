import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { AssemblingLattice, Bench, Bx, Cy, PAL, VGauge } from "./fabKit";
import { Rod, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { between, hash1, lerp } from "./world";

const LBL = {
  vessel: t("Bình nuôi", "Growth vessel"),
  solution: t("Dung dịch tiền chất", "Precursor solution"),
  ions: t("Ion hòa tan", "Dissolved ions"),
  hot: t("Bàn điều nhiệt", "Temperature-controlled plate"),
  cool: t("Làm nguội chậm", "Slow cooling"),
  dissolved: t("Lượng chất tan", "Dissolved material"),
  holds: t("Lượng dung dịch giữ được", "What the solution can hold"),
  supersat: t("Quá bão hòa", "Supersaturated"),
  nucleus: t("Mầm tinh thể (rất nhỏ)", "Crystal nucleus (tiny)"),
  growing: t("Ion bám vào tinh thể", "Ions attach to the crystal"),
  crystal: t("Tinh thể", "Crystal"),
  tweezers: t("Nhíp", "Tweezers"),
  latticeOne: t("Mạng ABX₃ liên tục", "One continuous ABX₃ lattice"),
  noGb: t("Không có ranh giới hạt bên trong (mô hình lý tưởng)", "No internal grain boundary (idealized model)"),
  poly: t("Màng đa tinh thể", "Polycrystalline film"),
  single: t("Đơn tinh thể", "Single crystal"),
  gb: t("Ranh giới hạt", "Grain boundary"),
  grain: t("Hạt", "Grain"),
  macro: t("Tinh thể thấy được bằng mắt", "Macroscopic crystal"),
  conceptual: t("Minh họa khái niệm", "Conceptual illustration"),
};

const VX = -0.7;
const V_R = 0.95;
const V_BOT = -0.65;
const V_H = 1.75;
const STAND: [number, number, number] = [2.3, -0.45, 0];
const N_ION = 72;
const N_SOLID = 10;
const NUC: [number, number, number] = [VX, V_BOT + 0.2, 0];

/** Octahedron-like crystal: dark, glossy, with bright edges. */
const OCTA = new THREE.OctahedronGeometry(1, 0);
const OCTA_EDGES = new THREE.EdgesGeometry(OCTA);

const SINGLE_N: [number, number, number] = [5, 3, 3];
const GRAIN_N: [number, number, number] = [2, 2, 2];

export function CrystalScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("crystal", step), 2);
  const crystal = useRef<THREE.Group>(null);
  const liquid = useRef<THREE.MeshStandardMaterial>(null);
  const coil = useRef<THREE.MeshStandardMaterial>(null);
  const tw = useRef<THREE.Group>(null);
  const jawL = useRef<THREE.Mesh>(null);
  const jawR = useRef<THREE.Mesh>(null);
  const ions = useRef<SwarmApi>(null);
  const solids = useRef<SwarmApi>(null);
  const scene1 = useRef<THREE.Group>(null);
  const bubble = useRef<THREE.Group>(null);
  const cmpGrp = useRef<THREE.Group>(null);
  const polyG = useRef<THREE.Group>(null);
  const oneG = useRef<THREE.Group>(null);
  const asm = useRef(0);
  const conc = useRef(0.7);
  const limit = useRef(0.95);
  const csize = useRef(0);

  const g0 = useGate(() => step === 0 && clock.current.t > 2);
  const g1 = useGate(() => step === 1 && clock.current.t > 1);
  const gSup = useGate(() => step === 1 && limit.current < conc.current);
  const g2 = useGate(() => step === 2 && clock.current.t > 1.5);
  const g3 = useGate(() => step === 3 && clock.current.t > 2);
  const g4 = useGate(() => step === 4 && clock.current.t > 0.8);
  const g5 = useGate(() => step === 5 && clock.current.t > 1.5);
  const g6 = useGate(() => step === 6 && clock.current.t > 1.2);
  const matSel = useGate(() => String(useSim.getState().fab.mat ?? "single") === "single");

  const crystalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#241a3d", roughness: 0.25, metalness: 0.35 }), []);

  useFrame(() => {
    const T = clock.current.t;
    const f = useSim.getState().fab;
    const mat = String(f.mat ?? "single");

    // ── heat, concentration, solubility
    const heat = step === 0 ? 0.8 : step === 1 ? lerp(0.8, 0.2, between(T, 0.5, 5.5)) : 0.15;
    if (coil.current) coil.current.emissiveIntensity = 0.1 + 1.4 * heat;
    conc.current = 0.7;
    limit.current = step === 1 ? lerp(0.95, 0.45, between(T, 0.5, 5.5)) : step >= 2 ? 0.45 : 0.95;
    if (liquid.current) {
      const dep = step === 3 ? between(T, 0.5, 8) : step >= 4 ? 1 : 0;
      liquid.current.opacity = lerp(0.34, 0.16, dep);
      liquid.current.color.set(PAL.ink).lerp(new THREE.Color("#c7e5f5"), dep * 0.7);
    }

    // ── dissolving solids (step 0)
    if (solids.current) {
      for (let i = 0; i < N_SOLID; i++) {
        if (step !== 0) {
          solids.current.hide(i);
          continue;
        }
        const t0 = 0.4 + i * 0.25;
        const k = (T - t0) / 1.4;
        if (k < 0 || k > 1) {
          solids.current.hide(i);
          continue;
        }
        const x = VX + (hash1(i * 3.1) - 0.5) * 0.9;
        const z = (hash1(i * 5.3) - 0.5) * 0.9;
        const y = lerp(V_BOT + V_H + 0.6, V_BOT + 1.1, Math.min(1, k * 1.6));
        solids.current.set(i, x, y - (k > 0.6 ? (k - 0.6) * 0.3 : 0), z, k < 0.7 ? 1 : (1 - k) / 0.3);
      }
      solids.current.flush();
    }

    // ── crystal size and consumption of ions
    const size = step < 2 ? 0 : step === 2 ? 0.1 * between(T, 1.0, 2.4) : step === 3 ? lerp(0.1, 0.78, between(T, 0.5, 8)) : 0.78;
    csize.current = size;
    const consumed = step < 2 ? 0 : step === 2 ? 0.04 : step === 3 ? 0.04 + 0.66 * between(T, 0.5, 8) : 0.7;
    if (ions.current) {
      const visibleN = step === 0 ? Math.round(N_ION * between(T, 0.8, 3.5)) : N_ION;
      const cy = V_BOT + 0.2 + size * 0.5;
      for (let i = 0; i < N_ION; i++) {
        if (i >= visibleN || step >= 5) {
          ions.current.hide(i);
          continue;
        }
        const c = (i + 0.5) / N_ION;
        const bx = VX + (hash1(i * 2.7) - 0.5) * (V_R * 1.55) + Math.sin(T * 1.3 + i * 1.9) * 0.07;
        const by = V_BOT + 0.15 + hash1(i * 6.1) * (V_H * 0.7) + Math.sin(T * 1.1 + i * 2.3) * 0.07;
        const bz = (hash1(i * 8.9) - 0.5) * (V_R * 1.2) + Math.cos(T * 1.4 + i) * 0.07;
        const k = (consumed - c) / 0.06;
        if (k >= 1) {
          ions.current.hide(i);
          continue;
        }
        if (k <= 0) ions.current.set(i, bx, by, bz, 1);
        else {
          const e = k * k;
          ions.current.set(i, lerp(bx, VX, e), lerp(by, cy, e), lerp(bz, 0, e), 1 - e * 0.5);
        }
      }
      ions.current.flush();
    }

    // ── tweezers lift the crystal out and place it on the stand (step 4)
    let cx = NUC[0];
    let cyy = V_BOT + 0.2 + size * 0.5;
    let cz = 0;
    let twY = 2.2;
    let twX = NUC[0];
    let grip = 0;
    if (step >= 4) {
      const T4 = step === 4 ? T : 99;
      const down = between(T4, 0.2, 1.2);
      grip = between(T4, 1.2, 1.6);
      const lift = between(T4, 1.6, 2.8);
      const move = between(T4, 2.8, 4.2);
      const lower = between(T4, 4.2, 5.0);
      const rel = between(T4, 5.0, 6.0);
      const restY = V_BOT + 0.2 + size * 0.5;
      const topY = V_BOT + V_H + 0.4;
      const standY = STAND[1] + 0.12 + size * 0.55;
      cx = lerp(NUC[0], STAND[0], move);
      cyy = lerp(lerp(restY, topY, lift), standY, lower);
      cz = 0;
      twX = cx;
      twY = lerp(2.2, cyy + 0.62, down) + rel * 1.0;
      grip = grip * (1 - rel);
      if (step > 4) {
        cx = STAND[0];
        cyy = standY;
        twY = 2.8;
        grip = 0;
      }
    }
    if (crystal.current) {
      crystal.current.position.set(cx, cyy, cz);
      crystal.current.scale.setScalar(Math.max(1e-4, size));
      crystal.current.rotation.y = T * 0.25;
    }
    if (tw.current) {
      tw.current.position.set(twX, twY, 0);
      tw.current.visible = step === 4 && twY < 2.7;
    }
    if (jawL.current && jawR.current) {
      const gap = lerp(0.42, 0.08, grip);
      jawL.current.position.x = -gap * 0.5 - 0.01;
      jawR.current.position.x = gap * 0.5 + 0.01;
    }

    // ── lattice bubble (step 5), comparison (step 6) and the rest of the lab fading out
    asm.current = step === 5 ? between(T, 0.8, 3.0) : step === 6 ? between(T, 0.2, 2.0) : 0;
    if (bubble.current) {
      bubble.current.scale.setScalar(Math.max(1e-4, step === 5 ? between(T, 0.5, 1.5) : 0));
      bubble.current.visible = step === 5;
    }
    if (scene1.current) scene1.current.scale.setScalar(Math.max(1e-4, step === 6 ? 1 - between(T, 0, 0.8) : 1));
    if (cmpGrp.current) {
      cmpGrp.current.visible = step === 6;
      cmpGrp.current.scale.setScalar(Math.max(1e-4, step === 6 ? between(T, 0.6, 1.6) : 0));
    }
    if (polyG.current) polyG.current.scale.setScalar(mat === "poly" ? 1.08 : 0.9);
    if (oneG.current) oneG.current.scale.setScalar(mat === "single" ? 1.08 : 0.9);
  });

  const grainBlocks: { p: [number, number, number]; r: [number, number, number] }[] = [
    { p: [-0.62, 0, 0], r: [0.0, 0.0, 0.0] },
    { p: [0, 0.03, 0], r: [0.4, 0.7, 0.2] },
    { p: [0.62, -0.02, 0], r: [0.9, 0.2, 0.6] },
  ];

  return (
    <group>
      <Bench />
      <group ref={scene1}>
        {/* hot plate */}
        <Bx p={[VX, -0.78, 0]} s={[2.3, 0.24, 2.3]} c={PAL.steelDark} metal={0.5} rough={0.5} />
        <mesh position={[VX, -0.655, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.85, 40]} />
          <meshStandardMaterial ref={coil} color="#401812" emissive={PAL.hot} emissiveIntensity={1.2} side={THREE.DoubleSide} />
        </mesh>
        {/* vessel and solution */}
        <Cy p={[VX, V_BOT + V_H / 2, 0]} rad={V_R} h={V_H} c="#cfe9fb" o={0.1} rough={0.05} />
        <mesh position={[VX, V_BOT + 0.62, 0]} scale={[V_R * 0.96, 1.2, V_R * 0.96]}>
          <cylinderGeometry args={[1, 1, 1, 40]} />
          <meshStandardMaterial ref={liquid} color={PAL.ink} transparent opacity={0.34} roughness={0.1} depthWrite={false} />
        </mesh>
        <Swarm ref={ions} count={N_ION} color={PAL.ink} radius={0.032} halo={1.8} haloOpacity={0.16} emissive={0.9} />
        <Swarm ref={solids} count={N_SOLID} color="#e8d9b0" radius={0.05} halo={1.2} haloOpacity={0.1} emissive={0.4} />

        {/* the crystal (in the vessel, then on the stand) */}
        <group ref={crystal} scale={0.0001}>
          <mesh geometry={OCTA} material={crystalMat} />
          <lineSegments geometry={OCTA_EDGES}>
            <lineBasicMaterial color="#b49bf0" transparent opacity={0.8} />
          </lineSegments>
        </group>

        {/* stand */}
        <Cy p={[STAND[0], STAND[1] - 0.1, 0]} rad={0.55} h={0.1} c="#d8e4ee" o={0.5} rough={0.2} />
        <Cy p={[STAND[0], -0.72, 0]} rad={0.3} h={0.34} c={PAL.steelDark} metal={0.4} />

        {/* tweezers */}
        <group ref={tw} visible={false}>
          <Bx p={[0, 0.9, 0]} s={[0.12, 0.8, 0.05]} c={PAL.steel} metal={0.8} rough={0.3} />
          <mesh ref={jawL} position={[-0.25, 0.1, 0]} scale={[0.03, 0.6, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={PAL.steel} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh ref={jawR} position={[0.25, 0.1, 0]} scale={[0.03, 0.6, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={PAL.steel} metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* solubility gauges (conceptual) */}
      {step === 1 ? (
        <group>
          <VGauge p={[-2.6, 0.3, 0.3]} h={1.3} value={conc} color={PAL.ink} />
          <VGauge p={[-2.2, 0.3, 0.3]} h={1.3} value={limit} color="#79b0ff" />
        </group>
      ) : null}

      {/* lattice inspection bubble (step 5) */}
      <group ref={bubble} position={[STAND[0], 1.25, 0]} scale={0.0001} visible={false}>
        {matSel ? (
          <AssemblingLattice n={SINGLE_N} asm={asm} a={0.2} radii={{ A: 0.045, B: 0.032, X: 0.027 }} spread={0.5} />
        ) : (
          <group>
            {grainBlocks.map((g, i) => (
              <group key={i} position={[g.p[0] * 0.8, g.p[1], g.p[2]]} rotation={g.r}>
                <AssemblingLattice n={GRAIN_N} asm={asm} a={0.18} radii={{ A: 0.04, B: 0.028, X: 0.024 }} spread={0.4} />
              </group>
            ))}
            {[-0.25, 0.25].map((x) => (
              <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.7, 0.7]} />
                <meshBasicMaterial color={PAL.warn} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
              </mesh>
            ))}
          </group>
        )}
      </group>
      {g5 ? <Rod a={[STAND[0], STAND[1] + 0.5, 0]} b={[STAND[0], 0.85, 0]} color="#b9c5d4" /> : null}

      {/* step 6: polycrystalline film next to a single crystal */}
      <group ref={cmpGrp} position={[0, 0.5, 0]} visible={false} scale={0.0001}>
        <group ref={polyG} position={[-1.5, 0, 0]}>
          {grainBlocks.map((g, i) => (
            <group key={i} position={[g.p[0], g.p[1], g.p[2]]} rotation={g.r}>
              <AssemblingLattice n={GRAIN_N} asm={asm} a={0.2} radii={{ A: 0.045, B: 0.032, X: 0.027 }} spread={0.4} />
            </group>
          ))}
          {[-0.31, 0.31].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.8, 0.8]} />
              <meshBasicMaterial color={PAL.warn} transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          ))}
        </group>
        <group ref={oneG} position={[1.45, 0, 0]}>
          <AssemblingLattice n={SINGLE_N} asm={asm} a={0.2} radii={{ A: 0.045, B: 0.032, X: 0.027 }} spread={0.4} />
        </group>
      </group>

      {/* labels */}
      {g0 ? (
        <>
          <StoryTag position={[VX + 1.0, V_BOT + 1.5, 0.5]} kind="layer">
            {LBL.vessel}
          </StoryTag>
          <StoryTag position={[VX, V_BOT + 0.3, 1.0]} kind="particle" sub={LBL.ions}>
            {LBL.solution}
          </StoryTag>
        </>
      ) : null}
      {g1 ? (
        <>
          <StoryTag position={[-2.6, 1.1, 0.3]} kind="particle" minor>
            {LBL.dissolved}
          </StoryTag>
          <StoryTag position={[-2.2, -0.55, 0.3]} kind="concept" minor sub={LBL.conceptual}>
            {LBL.holds}
          </StoryTag>
          <StoryTag position={[VX + 1.0, -0.9, 1.0]} kind="concept">
            {LBL.cool}
          </StoryTag>
          <StoryTag position={[VX, -0.35, 1.2]} kind="concept" minor>
            {LBL.hot}
          </StoryTag>
        </>
      ) : null}
      {gSup ? (
        <StoryTag position={[-2.4, 0.9, 0.3]} kind="bad">
          {LBL.supersat}
        </StoryTag>
      ) : null}
      {g2 ? (
        <StoryTag position={[VX + 0.6, V_BOT + 0.4, 0.8]} kind="good">
          {LBL.nucleus}
        </StoryTag>
      ) : null}
      {g3 ? (
        <>
          <StoryTag position={[VX + 0.9, V_BOT + 0.9, 0.5]} kind="good">
            {LBL.crystal}
          </StoryTag>
          <StoryTag position={[VX - 0.7, V_BOT + 1.0, 0.6]} kind="particle">
            {LBL.growing}
          </StoryTag>
        </>
      ) : null}
      {g4 ? (
        <StoryTag position={[VX + 0.9, 1.7, 0]} kind="concept">
          {LBL.tweezers}
        </StoryTag>
      ) : null}
      {g5 ? (
        <>
          <StoryTag position={[STAND[0] + 0.7, STAND[1] + 0.2, 0.5]} kind="good" sub={LBL.macro}>
            {LBL.crystal}
          </StoryTag>
          <StoryTag position={[STAND[0], 1.9, 0]} kind={matSel ? "good" : "bad"}>
            {matSel ? LBL.latticeOne : LBL.gb}
          </StoryTag>
        </>
      ) : null}
      {g6 ? (
        <>
          <StoryTag position={[-1.5, 1.35, 0]} kind="bad">
            {LBL.poly}
          </StoryTag>
          <StoryTag position={[-1.5, -0.15, 0]} kind="bad" minor>
            {LBL.gb}
          </StoryTag>
          <StoryTag position={[1.45, 1.35, 0]} kind="good">
            {LBL.single}
          </StoryTag>
          <StoryTag position={[1.45, -0.15, 0]} kind="good" minor>
            {LBL.noGb}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
