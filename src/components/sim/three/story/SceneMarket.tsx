import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { Bx, Cy, PAL, Tube } from "./fabKit";
import { Arrow3, Flashes, Rod, StoryTag, Swarm, burst, stepDur, useGate, useStoryClock, type FlashApi, type SwarmApi } from "./storyKit";
import { between, hash1, lerp } from "./world";

const LBL = {
  module: t("Module tandem 60 tế bào", "60-cell tandem module"),
  eff: t("Hiệu suất MODULE 26,9%", "26.9% MODULE efficiency"),
  effSub: t("diện tích chỉ định > 1,6 m² · Fraunhofer CalLab chứng nhận", "designated area > 1.6 m² · certified by Fraunhofer CalLab"),
  cell: t("Một tế bào: cấu trúc tandem", "One cell: tandem structure"),
  top: t("Perovskite (lớp trên)", "Perovskite (top cell)"),
  bottom: t("Silicon (lớp dưới)", "Silicon (bottom cell)"),
  glass: t("Kính", "Glass"),
  magnified: t("Phóng đại một tế bào (không đúng tỉ lệ)", "One cell magnified (not to scale)"),
  labCell: t("Tế bào tandem trong phòng thí nghiệm", "Laboratory tandem cell"),
  cellOnly: t("Kết quả TẾ BÀO — không phải module", "CELL result — not a module"),
  blue: t("Ánh sáng xanh/lục → perovskite", "Blue/green light → perovskite"),
  red: t("Ánh sáng đỏ/hồng ngoại → silicon", "Red/infrared light → silicon"),
  glassSheet: t("Tấm kính công nghiệp", "Industrial glass sheet"),
  coater: t("Trạm phủ perovskite", "Perovskite coating station"),
  assembly: t("Trạm lắp ráp", "Assembly station"),
  siModule: t("Module silicon", "Silicon module"),
  hybrid: t("Module tandem lai", "Hybrid tandem module"),
  coated: t("Kính phủ perovskite", "Perovskite-coated glass"),
  milestone: t("Mốc giao hàng, chưa chứng minh sản xuất hàng loạt", "A shipment milestone — not proof of mass production"),
  cell1: t("Tế bào perovskite 28,0%", "Perovskite cell 28.0%"),
  area1: t("0,05 cm²", "0.05 cm²"),
  cell2: t("Tế bào tandem 35,2%", "Tandem cell 35.2%"),
  area2: t("1 cm²", "1 cm²"),
  mod: t("Module tandem 29,4%", "Tandem module 29.4%"),
  area3: t("≈ 1,7 m²", "≈ 1.7 m²"),
  ratio: t("diện tích gấp ≈ 17.000 lần tế bào 1 cm²", "area ≈ 17,000× the 1 cm² cell"),
  notScale: t("Không vẽ đúng tỉ lệ", "Not drawn to scale"),
  v68: t("Bảng tham chiếu Version 68: 35,2%", "Version 68 reference table: 35.2%"),
  v68b: t("1 cm² · tế bào", "1 cm² · cell"),
  ann: t("Công bố của LONGi: 35,5%", "LONGi announcement: 35.5%"),
  annb: t("công ty nói ESTI chứng nhận · chưa có trong Version 68", "company states ESTI certified · not in Version 68"),
  july: t("7/2026 — công bố của LONGi; công ty nói đã có chứng nhận ESTI", "July 2026 — LONGi announcement; company reports ESTI certification"),
  silicon: t("Module silicon sẵn có", "Existing silicon module"),
  perovLayer: t("Thêm lớp perovskite mỏng", "Add a thin perovskite layer"),
  tandem: t("Cấu trúc tandem hoàn chỉnh", "The completed tandem structure"),
  siBar: t("≈ 22–24%", "≈ 22–24%"),
  tdBar: t("→ ≈ 30% (mục tiêu)", "→ ≈ 30% (target)"),
  rep: t("Giá trị đại diện/mục tiêu, không phải bảo đảm", "Representative/target values, not a guarantee"),
};

const COLS = 6;
const ROWS = 10;
const BLUE = "#4da3ff";
const RED = "#ff6a4d";
const AMBER = "#c9772e";
const N_PH = 36;

/** A tandem stack: glass, perovskite top cell, silicon bottom cell, back contact. `ex` spreads the layers apart. */
function Stack({ w = 1.4, d = 1.0, ex, glow }: { w?: number; d?: number; ex: { current: number }; glow?: { current: number } }) {
  const layers = useRef<(THREE.Group | null)[]>([]);
  const amberMat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const e = ex.current;
    layers.current.forEach((g, i) => {
      if (g) g.position.y = (3 - i) * 0.15 * e - 0.0;
    });
    if (amberMat.current) amberMat.current.emissiveIntensity = 0.15 + 0.7 * (glow?.current ?? 0);
  });
  const set = (i: number) => (g: THREE.Group | null) => {
    layers.current[i] = g;
  };
  return (
    <group>
      <group ref={set(0)} position={[0, 0.34, 0]}>
        <Bx s={[w, 0.06, d]} c={PAL.glass} o={0.35} edge="#cfe9fb" />
      </group>
      <group ref={set(1)} position={[0, 0.22, 0]}>
        <mesh scale={[w, 0.12, d]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial ref={amberMat} color={AMBER} emissive={AMBER} emissiveIntensity={0.15} roughness={0.35} />
        </mesh>
      </group>
      <group ref={set(2)} position={[0, 0.0, 0]}>
        <Bx s={[w, 0.3, d]} c="#17305e" rough={0.4} metal={0.2} />
        <Bx p={[0, 0.15, 0]} s={[w, 0.02, d]} c="#243f78" />
      </group>
      <group ref={set(3)} position={[0, -0.2, 0]}>
        <Bx s={[w, 0.05, d]} c="#c9d1da" metal={0.8} rough={0.3} />
      </group>
    </group>
  );
}

/** Blue-green photons stop in the perovskite; red and infrared photons go on to the silicon. */
function Photons({ at, w, on, y0 = 2.0 }: { at: [number, number, number]; w: number; on: { current: number }; y0?: number }) {
  const sw = useRef<SwarmApi>(null);
  const fl = useRef<FlashApi>(null);
  const clk = useRef(0);
  useFrame((_, dt) => {
    if (!sw.current || !fl.current) return;
    clk.current += Math.min(dt, 0.05);
    const T = clk.current;
    const run = on.current;
    for (let i = 0; i < N_PH; i++) {
      if (run < 0.02) {
        sw.current.hide(i);
        fl.current.hide(i);
        continue;
      }
      const life = (T * 0.32 + hash1(i * 3.7)) % 1;
      const x = at[0] + (hash1(i * 6.1) - 0.5) * w * 0.8;
      const z = at[2] + (hash1(i * 9.3) - 0.5) * 0.5;
      const kind = i % 3 === 2 ? "red" : "blue";
      const stop = kind === "blue" ? at[1] + 0.22 : at[1] + 0.0;
      const yy = lerp(at[1] + y0, stop, life);
      const done = life > 0.97;
      sw.current.tint(i, kind === "red" ? RED : BLUE);
      sw.current.set(i, x, yy, z, done ? 0 : 1);
      const b = burst(life, 0.9, 0.1, 0.12);
      if (b) fl.current.set(i, x, stop, z, b.r, b.a * run);
      else fl.current.hide(i);
    }
    sw.current.flush();
    fl.current.flush();
  });
  return (
    <>
      <Swarm ref={sw} count={N_PH} color="#ffffff" radius={0.035} halo={2} haloOpacity={0.2} basic />
      <Flashes ref={fl} count={N_PH} color="#ffe27a" />
    </>
  );
}

/** A solar module: frame, 60 cells and an optional perovskite film on top. */
function Module({ w = 1.9, h = 3.1, amber, hl }: { w?: number; h?: number; amber: React.RefObject<THREE.MeshStandardMaterial | null>; hl?: React.RefObject<THREE.Mesh | null> }) {
  const cells = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cw = (w - 0.16) / COLS;
  const ch = (h - 0.16) / ROWS;
  useLayoutEffect(() => {
    const m = cells.current;
    if (!m) return;
    let n = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        dummy.position.set(-w / 2 + 0.08 + cw * (c + 0.5), -h / 2 + 0.08 + ch * (r + 0.5), 0.0);
        dummy.scale.set(cw * 0.92, ch * 0.9, 0.03);
        dummy.updateMatrix();
        m.setMatrixAt(n++, dummy.matrix);
      }
    m.instanceMatrix.needsUpdate = true;
  }, [dummy, w, h, cw, ch]);
  return (
    <group>
      <Bx s={[w, h, 0.05]} c="#cfd6de" metal={0.6} rough={0.4} />
      <Bx p={[0, 0, 0.012]} s={[w - 0.1, h - 0.1, 0.03]} c="#0e1624" rough={0.3} />
      <instancedMesh ref={cells} args={[undefined, undefined, COLS * ROWS]} frustumCulled={false} position={[0, 0, 0.03]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1b3a73" roughness={0.3} metalness={0.25} />
      </instancedMesh>
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[w - 0.12, h - 0.12]} />
        <meshStandardMaterial ref={amber} color={AMBER} emissive={AMBER} emissiveIntensity={0.2} transparent opacity={0.0} depthWrite={false} />
      </mesh>
      {hl ? (
        <mesh ref={hl} position={[-w / 2 + 0.08 + cw * 2.5, -h / 2 + 0.08 + ch * 6.5, 0.07]}>
          <boxGeometry args={[cw * 0.98, ch * 0.96, 0.02]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0} />
        </mesh>
      ) : null}
    </group>
  );
}

export function MarketScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("market", step), 2);
  const farm = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // step 0
  const m0 = useRef<THREE.Group>(null);
  const amber0 = useRef<THREE.MeshStandardMaterial>(null);
  const hl0 = useRef<THREE.Mesh>(null);
  const stack0 = useRef<THREE.Group>(null);
  const ex0 = useRef(0);
  const glow0 = useRef(0);
  // step 1
  const lab = useRef<THREE.Group>(null);
  const ex1 = useRef(0);
  const glow1 = useRef(0);
  const ph1 = useRef(0);
  // step 2
  const glassSheet = useRef<THREE.Group>(null);
  const coat = useRef<THREE.Mesh>(null);
  const si2 = useRef<THREE.Group>(null);
  const amber2 = useRef<THREE.MeshStandardMaterial>(null);
  const head = useRef<THREE.Group>(null);
  // step 3
  const chip1 = useRef<THREE.Group>(null);
  const chip2 = useRef<THREE.Group>(null);
  const mod3 = useRef<THREE.Group>(null);
  const amber3 = useRef<THREE.MeshStandardMaterial>(null);
  // step 4
  const cmp = useRef<THREE.Group>(null);
  // step 5
  const t5 = useRef<THREE.Group>(null);
  const amber5 = useRef<THREE.MeshStandardMaterial>(null);
  const sheet5 = useRef<THREE.Mesh>(null);
  const bars = useRef<THREE.Group>(null);
  const ex5 = useRef(0);
  const glow5 = useRef(0);
  const ph5 = useRef(0);

  const g0a = useGate(() => step === 0 && clock.current.t > 1.5);
  const g0b = useGate(() => step === 0 && clock.current.t > 4.5);
  const g0c = useGate(() => step === 0 && clock.current.t > 8.5);
  const g1 = useGate(() => step === 1 && clock.current.t > 1.5);
  const g2a = useGate(() => step === 2 && clock.current.t > 0.5);
  const g2b = useGate(() => step === 2 && clock.current.t > 4.5);
  const g2c = useGate(() => step === 2 && clock.current.t > 10);
  const g3 = useGate(() => step === 3 && clock.current.t > 1);
  const g4 = useGate(() => step === 4 && clock.current.t > 1);
  const g5a = useGate(() => step === 5 && clock.current.t > 0.5);
  const g5b = useGate(() => step === 5 && clock.current.t > 7);
  const scopeCell = useGate(() => step === 3 && String(useSim.getState().fab.scope ?? "cell") === "cell");
  const scopeMod = useGate(() => step === 3 && String(useSim.getState().fab.scope ?? "cell") === "module");

  useLayoutEffect(() => {
    const m = farm.current;
    if (!m) return;
    let n = 0;
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 14; c++) {
        dummy.position.set(-11 + c * 1.7, 0.45, -6 - r * 2.2);
        dummy.rotation.set(-0.45, 0, 0);
        dummy.scale.set(1.4, 0.9, 0.05);
        dummy.updateMatrix();
        m.setMatrixAt(n++, dummy.matrix);
      }
    m.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(() => {
    const T = clock.current.t;
    const f = useSim.getState().fab;
    const scope = String(f.scope ?? "cell");

    // ── step 0: the module, then one cell magnified
    if (m0.current) m0.current.visible = step === 0;
    if (amber0.current) amber0.current.opacity = 0.45;
    if (hl0.current) {
      const m = hl0.current.material as THREE.MeshBasicMaterial;
      m.opacity = step === 0 ? 0.8 * between(T, 3.5, 4.5) * (1 - between(T, 9, 10)) * (0.65 + 0.35 * Math.sin(T * 5)) : 0;
    }
    if (stack0.current) {
      const s = step === 0 ? between(T, 4.0, 5.2) * (1 - between(T, 9.0, 10.0)) : 0;
      stack0.current.scale.setScalar(Math.max(1e-4, s));
    }
    ex0.current = step === 0 ? between(T, 5.0, 7.5) : 0;
    glow0.current = step === 0 ? between(T, 6, 7.5) : 0;

    // ── step 1: laboratory cell and sunlight
    if (lab.current) lab.current.visible = step === 1;
    ex1.current = step === 1 ? 0.55 + 0.45 * between(T, 1, 3) : 0;
    glow1.current = step === 1 ? between(T, 3, 5) : 0;
    ph1.current = step === 1 ? between(T, 1.5, 3) : 0;

    // ── step 2: glass through the coater to the assembly, then onto the silicon module
    if (glassSheet.current && coat.current && si2.current && head.current) {
      const on = step === 2;
      glassSheet.current.visible = on;
      si2.current.visible = on;
      head.current.visible = on;
      const a = between(T, 0.5, 4.0);
      const b = between(T, 4.5, 7.0);
      const up = between(T, 7.2, 8.4);
      const down = between(T, 8.4, 9.6);
      const gx = lerp(-3.8, -1.8, a) + lerp(0, 3.4, b);
      const gy = 0.45 + lerp(0, 0.85, up) - 0.64 * down;
      glassSheet.current.position.set(gx, gy, 0);
      const cf = between(T, 1.2, 4.0);
      coat.current.scale.set(Math.max(1e-4, 2.3 * cf), 1.35, 1);
      coat.current.position.x = -1.15 + 1.15 * cf;
      si2.current.position.set(lerp(5.2, 1.6, between(T, 4.5, 7.0)), 0.55, 0);
      if (amber2.current) amber2.current.opacity = 0.5 * between(T, 9.4, 10.6);
    }

    // ── step 3: three different objects
    const dimCell = scope === "cell" ? 1 : 0.28;
    const dimMod = scope === "module" ? 1 : 0.28;
    if (chip1.current && chip2.current && mod3.current) {
      chip1.current.visible = step === 3;
      chip2.current.visible = step === 3;
      mod3.current.visible = step === 3;
      const pop = between(T, 0, 1.5);
      chip1.current.scale.setScalar(Math.max(1e-4, pop * dimCell));
      chip2.current.scale.setScalar(Math.max(1e-4, pop * dimCell));
      mod3.current.scale.setScalar(Math.max(1e-4, pop * (0.55 + 0.45 * dimMod)));
      if (amber3.current) amber3.current.opacity = 0.45;
    }

    // ── step 4: 35.2% table value next to the 35.5% announcement
    if (cmp.current) cmp.current.visible = step === 4;

    // ── step 5: silicon module gets a perovskite layer
    if (t5.current) t5.current.visible = step === 5;
    const land = step === 5 ? between(T, 1.0, 4.0) : 0;
    if (sheet5.current) {
      sheet5.current.visible = step === 5 && land < 0.99;
      sheet5.current.position.set(0, 0, lerp(2.4, 0.07, land));
    }
    if (amber5.current) amber5.current.opacity = 0.5 * between(T, 3.6, 4.4);
    ex5.current = step === 5 ? 0.6 * between(T, 5, 7) : 0;
    glow5.current = step === 5 ? between(T, 6, 8) : 0;
    ph5.current = step === 5 ? between(T, 6, 8) : 0;
    if (bars.current) {
      bars.current.visible = step === 5;
      bars.current.scale.set(1, Math.max(1e-4, between(T, 8.5, 11)), 1);
    }
  });

  return (
    <group>
      {/* ground and a solar farm far behind: this chapter is market scale */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -3]}>
        <planeGeometry args={[40, 24]} />
        <meshStandardMaterial color="#10171d" roughness={1} />
      </mesh>
      <instancedMesh ref={farm} args={[undefined, undefined, 42]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#16294d" roughness={0.4} metalness={0.3} />
      </instancedMesh>

      {/* step 0: 60-cell module with one cell magnified */}
      <group ref={m0} position={[-1.35, 1.65, 0]} visible={false}>
        <Module amber={amber0} hl={hl0} />
      </group>
      <group ref={stack0} position={[1.45, 1.9, 0.4]} scale={0.0001}>
        <group scale={1.25} rotation={[0.45, -0.5, 0]}>
          <Stack w={1.2} d={0.9} ex={ex0} glow={glow0} />
        </group>
      </group>
      {step === 0 ? <Rod a={[-0.4, 2.2, 0.1]} b={[0.8, 2.2, 0.3]} color="#ffd27a" radius={0.008} opacity={0.5} /> : null}

      {/* step 1: laboratory tandem cell with sunlight */}
      <group ref={lab} position={[0, 0.9, 0]} visible={false}>
        <Bx p={[0, -0.55, 0]} s={[2.4, 0.2, 1.6]} c={PAL.steelDark} metal={0.5} />
        <group scale={1.3}>
          <Stack w={1.4} d={1.0} ex={ex1} glow={glow1} />
        </group>
        <Photons at={[0, 0, 0]} w={1.8} on={ph1} y0={2.0} />
        <Tube a={[-1.0, -0.3, 0.55]} b={[-1.8, 0.4, 0.8]} rad={0.012} c="#c9d1da" />
        <Tube a={[1.0, -0.3, 0.55]} b={[1.8, 0.4, 0.8]} rad={0.012} c="#c9d1da" />
      </group>

      {/* step 2: from coating to hybrid tandem module */}
      <group ref={head} position={[-1.8, 1.2, 0]} visible={false}>
        <Bx s={[0.5, 0.35, 1.6]} c={PAL.steel} metal={0.8} rough={0.3} />
        <Bx p={[0, 0.5, 0]} s={[0.12, 0.7, 0.12]} c={PAL.steel} metal={0.7} />
      </group>
      <group ref={glassSheet} position={[-3.8, 0.45, 0]} visible={false}>
        <Bx s={[2.3, 0.07, 1.4]} c={PAL.glass} o={0.45} edge="#cfe9fb" />
        <mesh ref={coat} position={[-1.15, 0.03, 0]} scale={[0.0001, 1, 1.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.25} transparent opacity={0.65} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={si2} position={[5.2, 0.55, 0]} visible={false}>
        <Bx s={[2.3, 0.12, 1.4]} c="#17305e" rough={0.4} metal={0.25} />
        <Bx p={[0, 0.07, 0]} s={[2.1, 0.02, 1.25]} c="#2a4f96" />
        <mesh position={[0, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.1, 1.25]} />
          <meshStandardMaterial ref={amber2} color={AMBER} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      {step === 2 ? (
        <group>
          {[-4.4, -3.2, -2.0, -0.8, 0.4, 1.6, 2.8, 4.0].map((x) => (
            <Cy key={x} p={[x, 0.18, 0]} rad={0.1} h={1.6} r={[Math.PI / 2, 0, 0]} c={PAL.steel} metal={0.7} lo />
          ))}
          <Bx p={[0, 0.06, 0]} s={[10, 0.08, 1.9]} c={PAL.steelDark} metal={0.4} />
        </group>
      ) : null}

      {/* step 3: three objects of very different size */}
      <group ref={chip1} position={[-2.6, 0.35, 0.3]} visible={false}>
        <Bx s={[0.2, 0.05, 0.2]} c="#2d1e52" metal={0.3} rough={0.3} edge="#8d6cd6" />
        <Bx p={[0, 0.04, 0]} s={[0.2, 0.03, 0.2]} c={AMBER} />
      </group>
      <group ref={chip2} position={[-1.5, 0.4, 0.3]} visible={false}>
        <Bx s={[0.5, 0.05, 0.5]} c="#17305e" metal={0.25} rough={0.3} edge="#79b0ff" />
        <Bx p={[0, 0.04, 0]} s={[0.5, 0.03, 0.5]} c={AMBER} />
      </group>
      <group ref={mod3} position={[1.3, 1.7, 0]} visible={false}>
        <Module w={2.0} h={3.2} amber={amber3} />
      </group>
      {step === 3 ? (
        <>
          <Bx p={[-2.0, 0.2, 0.3]} s={[2.4, 0.04, 0.9]} c="#1b232c" rough={0.8} />
        </>
      ) : null}

      {/* step 4: the reference value and the later announcement */}
      <group ref={cmp} visible={false}>
        <group position={[-1.3, 0.8, 0]}>
          <Bx s={[1.0, 0.1, 1.0]} c="#17305e" metal={0.25} edge="#79b0ff" />
          <Bx p={[0, 0.07, 0]} s={[1.0, 0.04, 1.0]} c={AMBER} />
          <Bx p={[0, -0.4, 0]} s={[1.5, 0.6, 1.5]} c="#1b232c" rough={0.8} />
        </group>
        <group position={[1.3, 0.8, 0]}>
          <Bx s={[1.0, 0.1, 1.0]} c="#17305e" metal={0.25} edge="#ffd27a" />
          <Bx p={[0, 0.07, 0]} s={[1.0, 0.04, 1.0]} c={AMBER} o={0.7} />
          <Bx p={[0, -0.4, 0]} s={[1.5, 0.6, 1.5]} c="#241a30" rough={0.8} />
        </group>
        <Bx p={[0, 1.3, -0.5]} s={[0.05, 2.6, 0.05]} c={PAL.steel} metal={0.6} />
        <Bx p={[0.5, 2.4, -0.5]} s={[1.0, 0.45, 0.04]} c="#e4a23a" />
      </group>

      {/* step 5: a thin perovskite layer on top of existing silicon */}
      <group ref={t5} position={[0, 0, 0]} visible={false}>
        <group position={[-0.3, 1.65, 0]}>
          <Module w={2.0} h={3.0} amber={amber5} />
          <mesh ref={sheet5} position={[0, 0, 2.4]}>
            <planeGeometry args={[1.9, 2.9]} />
            <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.3} transparent opacity={0.55} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
        <group position={[2.2, 1.1, 0.4]}>
          <group scale={1.0} rotation={[0.35, -0.4, 0]}>
            <Stack w={1.2} d={0.9} ex={ex5} glow={glow5} />
          </group>
          <Photons at={[0, 0, 0]} w={1.3} on={ph5} y0={1.7} />
        </group>
        <group ref={bars} position={[-2.5, 0, 0.2]}>
          <Bx p={[0, 0.9, 0]} s={[0.45, 1.8, 0.45]} c="#4d86d6" rough={0.4} />
          <Bx p={[0.7, 1.2, 0]} s={[0.45, 2.4, 0.45]} c={AMBER} o={0.6} edge="#ffd27a" />
          <Arrow3 a={[0.7, 2.45, 0]} b={[0.7, 2.8, 0]} color="#e4a23a" head={0.09} />
        </group>
      </group>

      {/* labels */}
      {g0a ? (
        <StoryTag position={[-1.35, 3.4, 0.2]} kind="layer">
          {LBL.module}
        </StoryTag>
      ) : null}
      {g0b ? (
        <>
          <StoryTag position={[1.45, 3.2, 0.4]} kind="tiny">
            {LBL.magnified}
          </StoryTag>
          <StoryTag position={[2.2, 2.5, 0.4]} kind="good" minor>
            {LBL.top}
          </StoryTag>
          <StoryTag position={[2.2, 1.55, 0.4]} kind="layer" minor>
            {LBL.bottom}
          </StoryTag>
        </>
      ) : null}
      {g0c ? (
        <StoryTag position={[-1.35, 0.0, 0.4]} kind="good" sub={LBL.effSub}>
          {LBL.eff}
        </StoryTag>
      ) : null}
      {g1 ? (
        <>
          <StoryTag position={[0, 2.5, 0]} kind="bad" sub={LBL.labCell}>
            {LBL.cellOnly}
          </StoryTag>
          <StoryTag position={[-1.6, 2.0, 0.3]} kind="concept" minor>
            {LBL.blue}
          </StoryTag>
          <StoryTag position={[1.8, 1.2, 0.3]} kind="bad" minor>
            {LBL.red}
          </StoryTag>
        </>
      ) : null}
      {g2a ? (
        <>
          <StoryTag position={[-3.2, 1.0, 0.8]} kind="layer">
            {LBL.glassSheet}
          </StoryTag>
          <StoryTag position={[-1.8, 2.0, 0.3]} kind="concept">
            {LBL.coater}
          </StoryTag>
        </>
      ) : null}
      {g2b ? (
        <>
          <StoryTag position={[1.6, 1.3, 0.9]} kind="concept">
            {LBL.assembly}
          </StoryTag>
          <StoryTag position={[3.6, 1.0, 0.8]} kind="layer" minor>
            {LBL.siModule}
          </StoryTag>
        </>
      ) : null}
      {g2c ? (
        <StoryTag position={[1.6, 1.8, 0.8]} kind="good" sub={LBL.milestone}>
          {LBL.hybrid}
        </StoryTag>
      ) : null}
      {g3 ? (
        <>
          <StoryTag position={[-2.6, 0.95, 0.4]} kind="particle" sub={LBL.area1}>
            {LBL.cell1}
          </StoryTag>
          <StoryTag position={[-1.5, 1.75, 0.4]} kind="particle" sub={LBL.area2}>
            {LBL.cell2}
          </StoryTag>
          <StoryTag position={[1.3, 3.6, 0.2]} kind="good" sub={LBL.area3}>
            {LBL.mod}
          </StoryTag>
          <StoryTag position={[-0.9, 2.8, 0.3]} kind="tiny" sub={LBL.notScale}>
            {LBL.ratio}
          </StoryTag>
        </>
      ) : null}
      {scopeCell ? (
        <StoryTag position={[-2.0, -0.15, 0.5]} kind="concept">
          {t("Kết quả TẾ BÀO", "CELL results")}
        </StoryTag>
      ) : null}
      {scopeMod ? (
        <StoryTag position={[1.3, -0.2, 0.5]} kind="concept">
          {t("Kết quả MODULE", "MODULE results")}
        </StoryTag>
      ) : null}
      {g4 ? (
        <>
          <StoryTag position={[-1.3, 1.7, 0]} kind="good" sub={LBL.v68b}>
            {LBL.v68}
          </StoryTag>
          <StoryTag position={[1.3, 1.7, 0]} kind="bad" sub={LBL.annb}>
            {LBL.ann}
          </StoryTag>
          <StoryTag position={[0.3, 3.1, -0.5]} kind="concept">
            {LBL.july}
          </StoryTag>
        </>
      ) : null}
      {g5a ? (
        <>
          <StoryTag position={[-0.3, 3.4, 0.2]} kind="layer">
            {LBL.silicon}
          </StoryTag>
          <StoryTag position={[-0.3, 0.1, 2.0]} kind="good" minor>
            {LBL.perovLayer}
          </StoryTag>
        </>
      ) : null}
      {g5b ? (
        <>
          <StoryTag position={[2.2, 2.5, 0.4]} kind="good" minor>
            {LBL.tandem}
          </StoryTag>
          <StoryTag position={[-2.5, 1.95, 0.2]} kind="layer" minor>
            {LBL.siBar}
          </StoryTag>
          <StoryTag position={[-2.0, 3.1, 0.2]} kind="good" sub={LBL.rep}>
            {LBL.tdBar}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
