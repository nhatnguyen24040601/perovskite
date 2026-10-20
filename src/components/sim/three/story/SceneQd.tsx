import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { Bench, Bx, Cy, PAL, Sp, num } from "./fabKit";
import { Flashes, Rod, StoryTag, Swarm, burst, stepDur, useGate, useStoryClock, type FlashApi, type SwarmApi } from "./storyKit";
import { between, clamp01, hash1, lerp } from "./world";

const LBL = {
  vial: t("Lọ phản ứng (nhìn bằng mắt)", "Reaction vial (macroscopic)"),
  precursor: t("Dung dịch tiền chất chì halide + phối tử", "Lead-halide precursor solution + ligands"),
  cs: t("Dung dịch cesium", "Cesium solution"),
  hot: t("Gia nhiệt", "Heating"),
  inject: t("Chích nhanh (ví dụ: chích nóng)", "Rapid injection (example: hot injection)"),
  region: t("Vùng phóng đại", "Magnified region"),
  zoomNote: t("Chấm không vẽ đúng cỡ so với lọ", "Dots are not drawn at true size relative to the vial"),
  scale: t("Thanh tỉ lệ ≈ 50 nm (minh họa)", "Scale bar ≈ 50 nm (illustrative)"),
  nuclei: t("Mầm nano tinh thể", "Nanocrystal nuclei"),
  dots: t("Chấm lượng tử (nano tinh thể)", "Quantum dots (nanocrystals)"),
  sizes: t("Nhiều kích cỡ", "Several sizes"),
  small: t("nhỏ hơn", "smaller"),
  large: t("lớn hơn", "larger"),
  anti: t("Chất kết tủa (antisolvent)", "Antisolvent"),
  spin: t("Ly tâm", "Centrifuge"),
  pellet: t("Chấm lắng xuống", "Dots settle"),
  clean: t("Mực chấm đã tinh chế", "Purified dot ink"),
  waste: t("Bỏ phần dung dịch cũ", "Old liquid removed"),
  spectrum: t("Phổ phát sáng (minh họa khái niệm)", "Emission spectrum (conceptual illustration)"),
  wl400: t("400 nm", "400 nm"),
  wl700: t("700 nm", "700 nm"),
  uv: t("Đèn UV", "UV lamp"),
  inkDrop: t("Mực chấm lượng tử", "Quantum-dot ink"),
  film: t("Màng chấm lượng tử", "Quantum-dot film"),
  solvent: t("Dung môi bay đi", "Solvent leaves"),
  substrate: t("Đế", "Substrate"),
  stage2: t("Giai đoạn tạo màng, khác với giai đoạn tổng hợp", "Film formation is a separate stage from synthesis"),
};

const VIAL: [number, number, number] = [-1.4, -0.1, 0];
const BUB: [number, number, number] = [2.9, 0.5, 0];
const BUB_R = 1.2;
const N_DOT = 44;
const N_PRE = 56;
const N_SOL = 26;
const BOX = new THREE.BoxGeometry(1, 1, 1);
const SPH = new THREE.SphereGeometry(1, 10, 8);

const sizeColor = (out: THREE.Color, k: number) => out.setHSL(0.62 - 0.62 * clamp01(k), 0.95, 0.5);

export function QdScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("qdot", step), 2);
  const syringe = useRef<THREE.Group>(null);
  const plunger = useRef<THREE.Mesh>(null);
  const stream = useRef<THREE.Mesh>(null);
  const vialGrp = useRef<THREE.Group>(null);
  const liquid = useRef<THREE.MeshStandardMaterial>(null);
  const liquidMesh = useRef<THREE.Mesh>(null);
  const pelletMesh = useRef<THREE.Mesh>(null);
  const heater = useRef<THREE.MeshStandardMaterial>(null);
  const dropper = useRef<THREE.Group>(null);
  const dropMesh = useRef<THREE.Mesh>(null);
  const subGrp = useRef<THREE.Group>(null);
  const filmMesh = useRef<THREE.Mesh>(null);
  const filmMat = useRef<THREE.MeshStandardMaterial>(null);
  const cubes = useRef<THREE.InstancedMesh>(null);
  const pre = useRef<SwarmApi>(null);
  const halos = useRef<THREE.InstancedMesh>(null);
  const flash = useRef<FlashApi>(null);
  const solv = useRef<SwarmApi>(null);
  const uvCone = useRef<THREE.Mesh>(null);
  const spec = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const lastT = useRef(0);
  const rot = useRef(0);

  const gVial = useGate(() => step === 0 && clock.current.t > 1.5);
  const gInj = useGate(() => step === 1 && clock.current.t > 1.2);
  const gNuc = useGate(() => step === 2 && clock.current.t > 1.5);
  const gGrow = useGate(() => step === 3 && clock.current.t > 1.5);
  const gPur = useGate(() => step === 4 && clock.current.t > 0.5);
  const gPel = useGate(() => step === 4 && clock.current.t > 4.6 && clock.current.t < 5.6);
  const gClean = useGate(() => step === 4 && clock.current.t > 6);
  const gSpec = useGate(() => step === 5 && clock.current.t > 1);
  const gFilm = useGate(() => step === 6 && clock.current.t > 5.2);
  const gInk = useGate(() => step === 6 && clock.current.t > 0.8 && clock.current.t < 3);

  const specGeo = useMemo(() => {
    const n = 80;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    const colors = new Float32Array(n * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      c.setHSL(0.75 * (1 - i / (n - 1)), 0.9, 0.6);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
  const specObj = useMemo(() => new THREE.Line(specGeo, new THREE.LineBasicMaterial({ vertexColors: true })), [specGeo]);

  // per-dot constants
  const dots = useMemo(
    () =>
      Array.from({ length: N_DOT }, (_, i) => {
        const u = hash1(i * 1.7);
        const v = hash1(i * 2.9 + 3);
        const w = hash1(i * 4.3 + 7);
        const th = Math.acos(2 * u - 1);
        const ph = 2 * Math.PI * v;
        const r = 0.85 * Math.cbrt(w);
        return {
          disp: [Math.sin(th) * Math.cos(ph) * r, Math.cos(th) * r * 0.9, Math.sin(th) * Math.sin(ph) * r] as [number, number, number],
          t0: 1.2 + 2.3 * hash1(i * 5.1 + 2),
          sz: hash1(i * 6.7 + 5),
          pellet: [(hash1(i * 8.1) - 0.5) * 0.8, -0.85 + hash1(i * 9.3) * 0.18, (hash1(i * 3.7) - 0.5) * 0.8] as [number, number, number],
          grid: [((i % 8) - 3.5) * 0.19, -0.55, (Math.floor(i / 8) - 3.5) * 0.19] as [number, number, number],
          q: [hash1(i * 1.3), hash1(i * 2.1), hash1(i * 3.3)],
        };
      }),
    [],
  );
  const pres = useMemo(
    () =>
      Array.from({ length: N_PRE }, (_, i) => {
        const u = hash1(i * 2.2);
        const v = hash1(i * 3.4 + 1);
        const w = hash1(i * 5.1 + 4);
        const th = Math.acos(2 * u - 1);
        const ph = 2 * Math.PI * v;
        const r = 0.9 * Math.cbrt(w);
        return [Math.sin(th) * Math.cos(ph) * r, Math.cos(th) * r, Math.sin(th) * Math.sin(ph) * r] as [number, number, number];
      }),
    [],
  );

  useLayoutEffect(() => {
    const c = cubes.current;
    if (!c) return;
    dummy.scale.setScalar(1e-4);
    dummy.updateMatrix();
    for (let i = 0; i < N_DOT; i++) {
      c.setMatrixAt(i, dummy.matrix);
      c.setColorAt(i, col.set("#ffffff"));
      halos.current?.setMatrixAt(i, dummy.matrix);
      halos.current?.setColorAt(i, col);
    }
    c.instanceMatrix.needsUpdate = true;
    if (halos.current) halos.current.instanceMatrix.needsUpdate = true;
  }, [dummy, col]);

  useFrame(() => {
    const T = clock.current.t;
    const dt = T - lastT.current;
    lastT.current = T;
    const f = useSim.getState().fab;
    const sizeSel = num(f, "size", 0.5);
    const mean = 0.06 + 0.07 * sizeSel;

    // ── vial, heater, syringe (steps 0–1)
    const heat = step === 0 ? between(T, 1.5, 4) * 0.7 : step === 1 ? 1 : step === 2 ? 0.7 : step === 3 ? 0.4 : 0.1;
    if (heater.current) heater.current.emissiveIntensity = 0.08 + 1.3 * heat;
    const inject = step === 1 ? between(T, 1.4, 3.0) : step >= 2 ? 1 : 0;
    if (syringe.current) {
      const down = step === 0 ? 0 : step === 1 ? between(T, 0.2, 1.2) * (1 - between(T, 3.6, 4.6)) : 0;
      syringe.current.position.set(VIAL[0], lerp(1.55, 0.95, down), 0);
      syringe.current.visible = step <= 1;
    }
    if (plunger.current) plunger.current.position.y = lerp(0.55, 0.15, inject);
    if (stream.current) {
      const on = step === 1 && T > 1.4 && T < 3.1 ? 1 : 0;
      stream.current.visible = on > 0;
      stream.current.scale.set(0.03, 0.55, 0.03);
      stream.current.position.set(VIAL[0], 0.5, 0);
    }
    // liquid colour: precursor amber → glowing dots → purified
    let q = 0;
    let L = 0.32;
    if (step === 1) {
      q = between(T, 2.2, 5);
    } else if (step === 2) q = 1;
    else if (step >= 3) q = 1;
    const dotCol = sizeColor(col, (mean - 0.06) / 0.07);
    if (liquid.current) {
      liquid.current.color.set(PAL.ink).lerp(dotCol, q);
      liquid.current.emissive.copy(dotCol);
      liquid.current.emissiveIntensity = 0.5 * q * (step === 5 ? 1.8 : 1);
      // antisolvent makes it cloudy, the old liquid is cleared after centrifuging
      if (step === 4) {
        const cloud = between(T, 1.6, 2.2) * (1 - between(T, 4.6, 5.0));
        L = 0.32 + 0.25 * cloud;
        if (T > 5.4) liquid.current.color.set("#bfe9f5");
        if (T > 6.2) liquid.current.color.copy(dotCol);
      }
      liquid.current.opacity = L;
    }
    if (pelletMesh.current) {
      const pk = step === 4 ? between(T, 2.4, 4.6) * (1 - between(T, 6.0, 7.0)) : 0;
      pelletMesh.current.visible = pk > 0.02;
      pelletMesh.current.scale.set(0.34, 0.06 + 0.08 * pk, 0.34);
      (pelletMesh.current.material as THREE.MeshStandardMaterial).color.copy(dotCol).multiplyScalar(0.7);
    }
    if (vialGrp.current) {
      const spin = step === 4 ? between(T, 2.0, 2.6) * (1 - between(T, 4.5, 5.0)) : 0;
      if (dt > 0 && dt < 0.3) rot.current += spin * 14 * dt;
      vialGrp.current.rotation.y = rot.current;
      const away = step === 6 ? between(T, 0, 0.7) : 0;
      vialGrp.current.scale.setScalar(Math.max(1e-4, 1 - away));
      vialGrp.current.position.set(VIAL[0], VIAL[1], VIAL[2]);
    }
    if (liquidMesh.current) liquidMesh.current.scale.set(0.54, 0.9, 0.54);
    // UV lamp (step 5)
    if (uvCone.current) uvCone.current.visible = step === 5;

    // ── dropper and substrate (steps 4 and 6)
    if (dropper.current) {
      const a4 = step === 4 ? between(T, 0.2, 1.0) * (1 - between(T, 2.0, 2.6)) : 0;
      const a6 = step === 6 ? between(T, 0.5, 1.2) * (1 - between(T, 3.0, 3.8)) : 0;
      const on = Math.max(a4, a6);
      dropper.current.visible = on > 0.02;
      dropper.current.position.set(VIAL[0] + (step === 6 ? 0 : 0), lerp(2.0, 0.95, on), 0);
    }
    if (dropMesh.current) {
      const dr4 = step === 4 ? between(T, 1.0, 1.6) : 0;
      const dr6 = step === 6 ? between(T, 1.2, 2.0) : 0;
      const k = Math.max(dr4, dr6);
      const visible = (step === 4 && T > 1.0 && T < 1.8) || (step === 6 && T > 1.2 && T < 2.3);
      dropMesh.current.visible = visible;
      dropMesh.current.position.set(VIAL[0], lerp(0.85, step === 6 ? -0.35 : 0.5, k * k), 0);
      dropMesh.current.scale.setScalar(0.05);
      (dropMesh.current.material as THREE.MeshStandardMaterial).color.set(step === 4 ? "#7ad7ff" : "#79e0a0");
    }
    if (subGrp.current) subGrp.current.scale.setScalar(Math.max(1e-4, step === 6 ? between(T, 0.2, 1.0) : 0));
    if (filmMesh.current && filmMat.current) {
      const spread = step === 6 ? between(T, 2.2, 3.6) : 0;
      const dry = step === 6 ? between(T, 3.6, 6.2) : 0;
      filmMesh.current.visible = spread > 0.01;
      filmMesh.current.scale.set(Math.max(1e-3, 1.4 * spread), 1, Math.max(1e-3, 1.0 * spread));
      filmMat.current.color.set("#79e0a0").lerp(new THREE.Color(PAL.dark), dry * 0.55);
      filmMat.current.emissive.copy(dotCol);
      filmMat.current.emissiveIntensity = 0.5 * (1 - dry * 0.5);
    }
    if (solv.current) {
      const amt = step === 6 ? between(T, 3.6, 4.4) * (1 - between(T, 5.8, 6.6)) : 0;
      const n = Math.round(N_SOL * amt);
      for (let i = 0; i < N_SOL; i++) {
        if (i >= n) {
          solv.current.hide(i);
          continue;
        }
        const life = (T * 0.35 + hash1(i * 5.9)) % 1;
        solv.current.set(i, VIAL[0] + (hash1(i * 2.3) - 0.5) * 1.2, -0.3 + life * 0.9, (hash1(i * 8.7) - 0.5) * 0.9, 1 - life * 0.6);
      }
      solv.current.flush();
    }

    // ── magnified region: precursors, nuclei, dots
    if (pre.current) {
      const alive = step === 0 ? between(T, 0.4, 1.4) : step === 1 ? 1 - between(T, 1.6, 4.4) : 0;
      for (let i = 0; i < N_PRE; i++) {
        const p = pres[i]!;
        if (i / N_PRE > alive) {
          pre.current.hide(i);
          continue;
        }
        pre.current.set(i, BUB[0] + p[0] + Math.sin(T * 1.6 + i) * 0.04, BUB[1] + p[1] + Math.cos(T * 1.3 + i * 1.3) * 0.04, BUB[2] + p[2], 0.9);
      }
      pre.current.flush();
    }
    const c = cubes.current;
    const hl = halos.current;
    if (c && hl && flash.current) {
      const spread = step <= 2 ? 0.06 : 0.42;
      const grow = step === 2 ? between(T, 0, 4.5) : step >= 3 ? 1 : 0;
      for (let i = 0; i < N_DOT; i++) {
        const d = dots[i]!;
        const sNorm = 1 + (d.sz - 0.5) * 2 * spread;
        const full = mean * sNorm;
        let s = 0;
        if (step === 1) s = 0.03 * between(T, d.t0, d.t0 + 0.4);
        else if (step === 2) s = lerp(0.03, full, grow);
        else if (step >= 3) s = full;
        // positions
        let x = d.disp[0] + Math.sin(T * 0.9 + i * 1.7) * 0.05;
        let y = d.disp[1] + Math.cos(T * 1.1 + i * 2.3) * 0.05;
        let z = d.disp[2] + Math.sin(T * 0.8 + i * 3.1) * 0.05;
        if (step === 4) {
          const pk = between(T, 2.4, 4.6) * (1 - between(T, 5.6, 6.8));
          x = lerp(x, d.pellet[0], pk);
          y = lerp(y, d.pellet[1], pk);
          z = lerp(z, d.pellet[2], pk);
        }
        if (step === 6) {
          const pack = between(T, 4.0, 6.5);
          x = lerp(x, d.grid[0], pack);
          y = lerp(y, d.grid[1], pack);
          z = lerp(z, d.grid[2], pack);
          s = full * lerp(1, 1.0, pack);
        }
        dummy.position.set(BUB[0] + x, BUB[1] + y, BUB[2] + z);
        dummy.rotation.set(d.q[0]! * 6, d.q[1]! * 6 + (step === 6 ? 0 : T * 0.3), d.q[2]! * 6);
        dummy.scale.setScalar(Math.max(1e-4, s));
        dummy.updateMatrix();
        c.setMatrixAt(i, dummy.matrix);
        sizeColor(col, (full - 0.04) / 0.1);
        if (step === 1) col.set("#fff3c4");
        c.setColorAt(i, col);
        // halo and nucleation flash
        const gl = s > 0.002 ? (step === 5 ? 1.7 : 1.3) : 0;
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(Math.max(1e-4, s * gl));
        dummy.updateMatrix();
        hl.setMatrixAt(i, dummy.matrix);
        hl.setColorAt(i, col.multiplyScalar(0.11));
        const b = step === 1 ? burst(T, d.t0, 0.7, 0.14) : null;
        if (b) flash.current.set(i, BUB[0] + x, BUB[1] + y, BUB[2] + z, b.r, b.a);
        else flash.current.hide(i);
      }
      c.instanceMatrix.needsUpdate = true;
      if (c.instanceColor) c.instanceColor.needsUpdate = true;
      hl.instanceMatrix.needsUpdate = true;
      if (hl.instanceColor) hl.instanceColor.needsUpdate = true;
      flash.current.flush();
    }

    // ── spectrum (step 5): a Gaussian whose centre follows the dot size
    if (spec.current) spec.current.visible = step === 5;
    if (step === 5) {
      const arr = specGeo.getAttribute("position") as THREE.BufferAttribute;
      const wl0 = lerp(440, 650, sizeSel);
      const sig = 22;
      const n = arr.count;
      for (let i = 0; i < n; i++) {
        const wl = 400 + (300 * i) / (n - 1);
        const x = ((wl - 400) / 300) * 2 - 1;
        const y = Math.exp(-((wl - wl0) ** 2) / (2 * sig * sig));
        arr.setXYZ(i, x, y * 0.7, 0);
      }
      arr.needsUpdate = true;
    }
  });

  return (
    <group>
      <Bench />
      {/* heater, vial and syringe */}
      <Bx p={[VIAL[0], -0.82, 0]} s={[1.5, 0.2, 1.5]} c={PAL.steelDark} metal={0.5} rough={0.5} />
      <mesh position={[VIAL[0], -0.705, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.62, 36]} />
        <meshStandardMaterial ref={heater} color="#401812" emissive={PAL.hot} emissiveIntensity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <group ref={vialGrp} position={VIAL}>
        <Cy p={[0, 0.2, 0]} rad={0.58} h={1.3} c="#cfe9fb" o={0.12} rough={0.05} />
        <mesh ref={liquidMesh} position={[0, -0.05, 0]} scale={[0.54, 0.9, 0.54]}>
          <cylinderGeometry args={[1, 1, 1, 32]} />
          <meshStandardMaterial ref={liquid} color={PAL.ink} transparent opacity={0.32} roughness={0.1} depthWrite={false} />
        </mesh>
        <mesh ref={pelletMesh} position={[0, -0.5, 0]} visible={false}>
          <cylinderGeometry args={[1, 1, 1, 24]} />
          <meshStandardMaterial color="#79e0a0" roughness={0.6} />
        </mesh>
        <Cy p={[0, 0.9, 0]} rad={0.3} h={0.14} c="#4a5560" metal={0.4} />
      </group>
      <group ref={syringe} position={[VIAL[0], 1.55, 0]}>
        <Cy p={[0, 0.3, 0]} rad={0.1} h={0.7} c="#d9eefb" o={0.35} lo />
        <Cy p={[0, 0.25, 0]} rad={0.085} h={0.5} c="#bde07a" o={0.9} lo />
        <mesh ref={plunger} position={[0, 0.55, 0]} scale={[0.03, 0.5, 0.03]}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <meshStandardMaterial color={PAL.steel} metalness={0.7} roughness={0.3} />
        </mesh>
        <Cy p={[0, -0.15, 0]} rad={0.012} h={0.5} c={PAL.steel} metal={0.8} lo />
      </group>
      <mesh ref={stream} visible={false}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#bde07a" emissive="#bde07a" emissiveIntensity={0.6} transparent opacity={0.9} />
      </mesh>
      <group ref={dropper} visible={false} position={[VIAL[0], 2, 0]}>
        <Cy p={[0, 0.5, 0]} rad={0.045} h={0.9} c="#d9eefb" o={0.4} rough={0.1} lo />
        <Sp p={[0, 1.02, 0]} rad={0.12} c="#7a2a2a" rough={0.7} />
      </group>
      <mesh ref={dropMesh} visible={false}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial color="#7ad7ff" roughness={0.1} transparent opacity={0.9} />
      </mesh>

      {/* substrate for the optional film (step 6) */}
      <group ref={subGrp} position={[VIAL[0], -0.5, 0]} scale={0.0001}>
        <Bx s={[1.7, 0.07, 1.2]} c={PAL.glass} o={0.4} edge="#cfe9fb" rough={0.15} />
        <mesh ref={filmMesh} position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial ref={filmMat} color="#79e0a0" roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <Swarm ref={solv} count={N_SOL} color={PAL.solvent} radius={0.03} halo={2} haloOpacity={0.16} emissive={1} />
      <mesh ref={uvCone} position={[VIAL[0], 1.1, 0]} visible={false}>
        <coneGeometry args={[0.7, 1.4, 24, 1, true]} />
        <meshBasicMaterial color="#8d5cff" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* magnified region */}
      <group position={BUB}>
        <mesh>
          <sphereGeometry args={[BUB_R, 36, 24]} />
          <meshBasicMaterial color="#9cc9e8" transparent opacity={0.06} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[BUB_R, 18, 12]} />
          <meshBasicMaterial color="#9cc9e8" wireframe transparent opacity={0.12} depthWrite={false} />
        </mesh>
        <Bx p={[-0.55, -1.0, 0.6]} s={[0.5, 0.02, 0.02]} c="#e4a23a" emis="#e4a23a" emisI={0.8} />
      </group>
      <instancedMesh ref={cubes} args={[BOX, undefined, N_DOT]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.35} metalness={0.1} emissive="#ffffff" emissiveIntensity={0.1} />
      </instancedMesh>
      <instancedMesh ref={halos} args={[SPH, undefined, N_DOT]} frustumCulled={false} renderOrder={6}>
        <meshBasicMaterial color="#ffffff" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      <Flashes ref={flash} count={N_DOT} color="#fff3c4" />
      <Swarm ref={pre} count={N_PRE} color={PAL.ink} radius={0.025} halo={2} haloOpacity={0.15} emissive={0.9} />
      {/* leader lines from the vial to the magnified region */}
      {step !== 6 ? (
        <>
          <Rod a={[VIAL[0] + 0.6, 0.2, 0]} b={[BUB[0] - BUB_R * 0.9, BUB[1] + 0.7, 0]} color="#7f8fa3" radius={0.006} opacity={0.6} />
          <Rod a={[VIAL[0] + 0.6, -0.4, 0]} b={[BUB[0] - BUB_R * 0.9, BUB[1] - 0.7, 0]} color="#7f8fa3" radius={0.006} opacity={0.6} />
          <mesh position={[VIAL[0], 0.0, 0.58]}>
            <torusGeometry args={[0.16, 0.012, 8, 28]} />
            <meshBasicMaterial color="#e4a23a" />
          </mesh>
        </>
      ) : null}

      {/* spectrum (conceptual) */}
      <group ref={spec} position={[0.75, 1.3, 0]} visible={false} scale={[0.9, 0.9, 0.9]}>
        <primitive object={specObj} />
        <Bx p={[0, -0.02, 0]} s={[2.1, 0.012, 0.01]} c="#c5ccd6" />
        <Bx p={[-1.05, 0.33, 0]} s={[0.012, 0.7, 0.01]} c="#c5ccd6" />
      </group>

      {/* labels */}
      {gVial ? (
        <>
          <StoryTag position={[VIAL[0] - 0.9, 0.55, 0.4]} kind="layer">
            {LBL.vial}
          </StoryTag>
          <StoryTag position={[VIAL[0], -1.1, 0.9]} kind="particle" sub={LBL.precursor}>
            {LBL.hot}
          </StoryTag>
        </>
      ) : null}
      {step === 0 ? (
        <>
          <StoryTag position={[BUB[0], BUB[1] + BUB_R + 0.2, 0]} kind="tiny" sub={LBL.zoomNote}>
            {LBL.region}
          </StoryTag>
          <StoryTag position={[BUB[0] - 0.5, BUB[1] - 1.0, 0.7]} kind="tiny">
            {LBL.scale}
          </StoryTag>
        </>
      ) : null}
      {gInj ? (
        <>
          <StoryTag position={[VIAL[0] + 0.5, 1.1, 0.3]} kind="concept">
            {LBL.cs}
          </StoryTag>
          <StoryTag position={[VIAL[0] - 0.2, 1.8, 0]} kind="bad" minor>
            {LBL.inject}
          </StoryTag>
        </>
      ) : null}
      {gNuc ? (
        <StoryTag position={[BUB[0], BUB[1] + 1.0, 0.2]} kind="good">
          {LBL.nuclei}
        </StoryTag>
      ) : null}
      {gGrow ? (
        <>
          <StoryTag position={[BUB[0], BUB[1] + 1.0, 0.2]} kind="good">
            {LBL.dots}
          </StoryTag>
          <StoryTag position={[BUB[0] + 0.2, BUB[1] - 1.0, 0.6]} kind="concept">
            {LBL.sizes}
          </StoryTag>
        </>
      ) : null}
      {gPur ? (
        <StoryTag position={[VIAL[0] - 0.9, 1.0, 0.4]} kind="particle" minor>
          {LBL.anti}
        </StoryTag>
      ) : null}
      {gPel ? (
        <StoryTag position={[VIAL[0] + 0.8, -0.5, 0.7]} kind="good">
          {LBL.pellet}
        </StoryTag>
      ) : null}
      {step === 4 ? (
        <StoryTag position={[VIAL[0], 1.45, 0.6]} kind="concept" minor>
          {LBL.spin}
        </StoryTag>
      ) : null}
      {gClean ? (
        <StoryTag position={[VIAL[0] - 0.9, 0.5, 0.5]} kind="good">
          {LBL.clean}
        </StoryTag>
      ) : null}
      {gSpec ? (
        <>
          <StoryTag position={[0.75, 2.3, 0]} kind="tiny" sub={t("không phải bộ số liệu thực nghiệm", "not an experimental dataset")}>
            {LBL.spectrum}
          </StoryTag>
          <StoryTag position={[-0.15, 1.2, 0]} kind="tiny" minor>
            {LBL.wl400}
          </StoryTag>
          <StoryTag position={[1.65, 1.2, 0]} kind="tiny" minor>
            {LBL.wl700}
          </StoryTag>
          <StoryTag position={[VIAL[0] + 0.7, 1.0, 0.3]} kind="concept" minor>
            {LBL.uv}
          </StoryTag>
          <StoryTag position={[BUB[0] - 1.0, BUB[1] + 1.0, 0.5]} kind="concept">
            {LBL.small}
          </StoryTag>
        </>
      ) : null}
      {gInk ? (
        <StoryTag position={[VIAL[0] + 0.7, 0.3, 0.3]} kind="particle">
          {LBL.inkDrop}
        </StoryTag>
      ) : null}
      {step === 6 ? (
        <StoryTag position={[VIAL[0], -1.1, 0.9]} kind="concept" sub={LBL.stage2}>
          {LBL.substrate}
        </StoryTag>
      ) : null}
      {gFilm ? (
        <StoryTag position={[BUB[0], BUB[1] - 0.3, 0.9]} kind="good">
          {LBL.film}
        </StoryTag>
      ) : null}
    </group>
  );
}
