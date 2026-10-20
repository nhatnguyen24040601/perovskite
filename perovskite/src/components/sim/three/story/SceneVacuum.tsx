import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { Bench, Bx, Cy, PAL, SectionBlock, Tube, VGauge, num } from "./fabKit";
import { Rod, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { between, clamp01, hash1, lerp } from "./world";

const LBL = {
  sub: t("Đế", "Substrate"),
  holder: t("Giá đỡ đế", "Substrate holder"),
  door: t("Cửa buồng", "Chamber door"),
  chamber: t("Buồng chân không", "Vacuum chamber"),
  pump: t("Bơm chân không", "Vacuum pump"),
  gauge: t("Đồng hồ áp suất", "Pressure gauge"),
  low: t("áp suất thấp (minh họa)", "low pressure (illustrative)"),
  atm: t("áp suất khí quyển (minh họa)", "atmospheric pressure (illustrative)"),
  air: t("Phân tử khí bị hút ra", "Air molecules pumped out"),
  srcA: t("Nguồn A: chì halide", "Source A: lead halide"),
  srcB: t("Nguồn B: muối hữu cơ", "Source B: organic salt"),
  vapA: t("Hơi chì halide", "Lead-halide vapor"),
  vapB: t("Hơi muối hữu cơ", "Organic-salt vapor"),
  film: t("Màng đang lớn", "Growing film"),
  thick: t("Độ dày (minh họa)", "Thickness (illustrative)"),
  onlyA: t("Chỉ có hơi chì halide: màng PbI₂, chưa phải perovskite", "Lead-halide vapor only: a PbI₂ film, not perovskite"),
  onlyB: t("Chỉ có muối hữu cơ: không đủ để tạo perovskite", "Organic salt only: not enough to form perovskite"),
  seq: t("Tuần tự: lớp chì halide trước, rồi muối hữu cơ", "Sequential: lead-halide layer first, then organic salt"),
  co: t("Đồng bay hơi: hai nguồn cùng lúc", "Co-evaporation: both sources at once"),
  secFilm: t("Màng (độ dày phóng đại)", "Film (thickness exaggerated)"),
  secSub: t("Đế", "Substrate"),
  scale: t("Không đúng tỉ lệ", "Not to scale"),
};

const CH_W = 3.2;
const CH_D = 2.0;
const CH_Y0 = -0.85;
const CH_H = 2.5;
const SRC_Y = -0.7;
const SUB_Y = 1.4;
const SRC_X = 0.85;
const N_AIR = 70;
const N_VAP = 30;

export function VacuumScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("vacuum", step), 2);
  const door = useRef<THREE.Group>(null);
  const sub = useRef<THREE.Group>(null);
  const film = useRef<THREE.Mesh>(null);
  const filmMat = useRef<THREE.MeshStandardMaterial>(null);
  const boatA = useRef<THREE.MeshStandardMaterial>(null);
  const boatB = useRef<THREE.MeshStandardMaterial>(null);
  const fly = useRef<THREE.Group>(null);
  const needle = useRef<THREE.Group>(null);
  const air = useRef<SwarmApi>(null);
  const vapA = useRef<SwarmApi>(null);
  const vapB = useRef<SwarmApi>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const press = useRef(1);
  const thick = useRef(0);
  const sec = useRef({ color: new THREE.Color(PAL.pbi2), h: 0.02, cryst: 0, show: 0 });
  const spin = useRef(0);
  const lastT = useRef(0);

  const gHolder = useGate(() => step === 0 && clock.current.t > 3);
  const gPump = useGate(() => step === 1 && clock.current.t > 1);
  const gSrc = useGate(() => step === 2 && clock.current.t > 2);
  const gVap = useGate(() => step === 3 && clock.current.t > 2);
  const gFilm = useGate(() => step >= 4 && step <= 5);
  const gSec = useGate(() => step === 6 && clock.current.t > 1);
  const gOnlyA = useGate(() => {
    const f = useSim.getState().fab;
    return step >= 4 && step <= 6 && f.srcA !== "off" && f.srcB === "off";
  });
  const gOnlyB = useGate(() => {
    const f = useSim.getState().fab;
    return step >= 4 && step <= 6 && f.srcB !== "off" && f.srcA === "off";
  });

  useFrame(() => {
    const T = clock.current.t;
    const dt = T - lastT.current;
    lastT.current = T;
    const f = useSim.getState().fab;
    const co = String(f.mode ?? "seq") === "co";
    const aOn = f.srcA !== "off";
    const bOn = f.srcB !== "off";
    const tm = num(f, "time", 0.6);
    const finalFrac = lerp(0.45, 1, tm);

    // ── loading and the door
    if (sub.current) {
      const inZ = step === 0 ? lerp(2.4, 0, between(T, 0.3, 2.6)) : 0;
      const inY = step === 0 ? lerp(-0.6, 0, between(T, 0.3, 2.6)) : 0;
      sub.current.position.set(0, inY, inZ);
    }
    if (door.current) {
      const open = step === 0 ? lerp(1.9, 0, between(T, 3.0, 4.6)) : 0;
      door.current.rotation.y = -open;
    }

    // ── pressure and pump
    const u = step === 1 ? clamp01((T - 0.8) / 4.7) : step > 1 ? 1 : 0;
    press.current = 1 - 0.96 * u;
    if (needle.current) needle.current.rotation.z = lerp(-2.2, 2.2, u);
    const pumping = step === 1 && u < 1 && T > 0.6;
    if (dt > 0 && dt < 0.3) spin.current += (pumping ? 9 : step > 1 ? 1.2 : 0) * dt;
    if (fly.current) fly.current.rotation.x = spin.current;
    if (led.current) led.current.emissiveIntensity = step >= 1 ? 1.2 : 0.1;

    if (air.current) {
      for (let i = 0; i < N_AIR; i++) {
        const gone = (i + 0.5) / N_AIR;
        const leaveAt = 0.8 + gone * 4.7;
        const base: [number, number, number] = [
          (hash1(i * 2.1) - 0.5) * (CH_W - 0.4),
          CH_Y0 + 0.2 + hash1(i * 5.7) * (CH_H - 0.4),
          (hash1(i * 7.3) - 0.5) * (CH_D - 0.4),
        ];
        const wob = 0.07;
        const px = base[0] + Math.sin(T * 1.7 + i * 1.3) * wob;
        const py = base[1] + Math.sin(T * 1.9 + i * 2.1) * wob;
        const pz = base[2] + Math.cos(T * 1.5 + i * 0.7) * wob;
        if (step === 0) air.current.set(i, px, py, pz, 1);
        else if (step === 1) {
          const k = (T - leaveAt) / 0.9;
          if (k < 0) air.current.set(i, px, py, pz, 1);
          else if (k < 1) air.current.set(i, lerp(px, -CH_W / 2 - 0.5, k), lerp(py, -0.3, k), lerp(pz, 0, k), 1 - k * 0.5);
          else air.current.hide(i);
        } else if (i / N_AIR < 0.04) air.current.set(i, px, py, pz, 0.8);
        else air.current.hide(i);
      }
      air.current.flush();
    }

    // ── sources
    const heat = step < 2 ? 0 : step === 2 ? between(T, 0, 2.5) : 1;
    if (boatA.current) {
      boatA.current.emissiveIntensity = aOn ? 0.1 + 1.6 * heat : 0.05;
      boatA.current.color.set(aOn && heat > 0.1 ? PAL.hot : PAL.steelDark);
    }
    if (boatB.current) {
      boatB.current.emissiveIntensity = bOn ? 0.1 + 1.6 * heat : 0.05;
      boatB.current.color.set(bOn && heat > 0.1 ? PAL.hot : PAL.steelDark);
    }

    // ── deposition clock: 0 before step 4, 1 once finished
    const depDur = lerp(3.5, 7.5, tm);
    const D = step < 4 ? 0 : step === 4 ? between(T, 0.3, 0.3 + depDur) : 1;
    // what each stream does: sequential = A first, then B; co-evaporation = both together
    const aDep = co ? D : clamp01(D / 0.5);
    const bDep = co ? D : clamp01((D - 0.5) / 0.5);
    const ramp = step === 2 ? between(T, 1.2, 2.8) : step >= 3 ? 1 : 0;
    const running = step >= 2 && step <= 4 && !(step === 4 && D >= 1);
    const aAmt = aOn && running ? ramp * (co || step < 4 || D < 0.5 ? 1 : 0) : 0;
    const bAmt = bOn && running ? ramp * (co ? 1 : step === 4 && D >= 0.5 ? 1 : 0) : 0;
    const fillStream = (api: SwarmApi | null, sx: number, amt: number, seed: number) => {
      if (!api) return;
      const n = Math.round(N_VAP * amt);
      for (let i = 0; i < N_VAP; i++) {
        if (i >= n) {
          api.hide(i);
          continue;
        }
        const life = (T * 0.34 + hash1(i * 3.3 + seed)) % 1;
        const tx = (hash1(i * 6.1 + seed) - 0.5) * 1.1;
        const tz = (hash1(i * 9.7 + seed) - 0.5) * 0.9;
        const x = lerp(sx, tx, life) + Math.sin(T * 3 + i) * 0.03;
        const y = lerp(SRC_Y + 0.1, SUB_Y - 0.08, life);
        const z = lerp(0, tz, life);
        api.set(i, x, y, z, life < 0.92 ? 1 : (1 - life) / 0.08);
      }
      api.flush();
    };
    fillStream(vapA.current, -SRC_X, aAmt, 1);
    fillStream(vapB.current, SRC_X, bAmt, 40);

    // ── film
    const hA = aOn ? aDep : 0;
    const hB = bOn ? bDep : 0;
    const frac = (hA * 0.6 + hB * 0.4) * finalFrac;
    const q = aOn && bOn ? hB : 0;
    thick.current = clamp01(frac);
    const hFilm = 0.14 * frac;
    if (film.current && filmMat.current) {
      film.current.visible = hFilm > 0.002;
      film.current.scale.set(1.3, Math.max(1e-4, hFilm), 1.0);
      film.current.position.y = SUB_Y - 0.03 - hFilm / 2;
      filmMat.current.color.set(PAL.pbi2).lerp(new THREE.Color(PAL.dark), q);
      if (!aOn && bOn) filmMat.current.color.set("#7fd9b0");
    }
    const s = sec.current;
    s.show = step === 6 ? between(T, 0.3, 1.2) : 0;
    s.h = 0.04 + 0.2 * frac;
    s.color.set(PAL.pbi2).lerp(new THREE.Color(PAL.dark), q);
    if (!aOn && bOn) s.color.set("#7fd9b0");
    s.cryst = q;
  });

  return (
    <group>
      <Bench />
      {/* chamber: glass box, steel frame, base and lid */}
      <Bx p={[0, CH_Y0 - 0.06, 0]} s={[CH_W + 0.3, 0.12, CH_D + 0.3]} c={PAL.steel} metal={0.7} rough={0.3} />
      <Bx p={[0, CH_Y0 + CH_H + 0.06, 0]} s={[CH_W + 0.3, 0.12, CH_D + 0.3]} c={PAL.steel} metal={0.7} rough={0.3} />
      <Bx p={[0, CH_Y0 + CH_H / 2, 0]} s={[CH_W, CH_H, CH_D]} c="#9cc9e8" o={0.07} edge="#bfe0f5" rough={0.1} />
      {([-1, 1] as const).map((sx) =>
        ([-1, 1] as const).map((sz) => (
          <Bx key={`${sx}${sz}`} p={[(sx * CH_W) / 2, CH_Y0 + CH_H / 2, (sz * CH_D) / 2]} s={[0.07, CH_H, 0.07]} c={PAL.steel} metal={0.7} rough={0.3} />
        )),
      )}
      {/* door: hinged on the left edge of the front face */}
      <group ref={door} position={[-CH_W / 2, CH_Y0 + CH_H / 2, CH_D / 2]}>
        <Bx p={[CH_W / 2, 0, 0.02]} s={[CH_W, CH_H, 0.04]} c="#9cc9e8" o={0.12} edge="#bfe0f5" rough={0.1} />
        <Bx p={[CH_W - 0.08, 0, 0.06]} s={[0.05, 0.4, 0.05]} c={PAL.steel} metal={0.7} />
      </group>

      {/* substrate and holder */}
      <Bx p={[0, SUB_Y + 0.09, 0]} s={[1.6, 0.08, 1.3]} c={PAL.steel} metal={0.6} rough={0.35} />
      <Bx p={[0, SUB_Y + 0.25, 0]} s={[0.1, 0.3, 0.1]} c={PAL.steel} metal={0.6} />
      <group ref={sub}>
        <Bx p={[0, SUB_Y, 0]} s={[1.4, 0.06, 1.1]} c={PAL.glass} o={0.5} edge="#cfe9fb" rough={0.15} />
        <mesh ref={film} position={[0, SUB_Y - 0.05, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial ref={filmMat} color={PAL.pbi2} roughness={0.4} />
        </mesh>
      </group>

      {/* sources (evaporation boats) */}
      {[-SRC_X, SRC_X].map((x, i) => (
        <group key={x} position={[x, SRC_Y, 0]}>
          <Bx p={[0, -0.12, 0]} s={[0.9, 0.1, 0.9]} c={PAL.steelDark} metal={0.5} />
          <mesh position={[0, 0, 0]} scale={[0.34, 0.1, 0.34]}>
            <cylinderGeometry args={[1, 0.75, 1, 24]} />
            <meshStandardMaterial ref={i === 0 ? boatA : boatB} color={PAL.steelDark} emissive={PAL.hot} emissiveIntensity={0.05} roughness={0.5} metalness={0.4} />
          </mesh>
          <Cy p={[0, 0.06, 0]} rad={0.25} h={0.04} c={i === 0 ? PAL.pbi2 : PAL.mai} rough={0.5} />
        </group>
      ))}

      {/* pump, pipe and gauge on the left */}
      <Tube a={[-CH_W / 2, -0.3, 0]} b={[-CH_W / 2 - 0.7, -0.3, 0]} rad={0.06} c={PAL.steel} />
      <Tube a={[-CH_W / 2 - 0.7, -0.3, 0]} b={[-CH_W / 2 - 0.7, -0.5, 0]} rad={0.06} c={PAL.steel} />
      <Bx p={[-CH_W / 2 - 0.7, -0.62, 0]} s={[0.75, 0.55, 0.8]} c={PAL.steelDark} metal={0.5} rough={0.5} />
      <Cy p={[-CH_W / 2 - 0.7, -0.62, 0.42]} rad={0.25} h={0.05} r={[Math.PI / 2, 0, 0]} c="#0f1419" />
      <group ref={fly} position={[-CH_W / 2 - 0.7, -0.62, 0.45]} rotation={[0, 0, 0]}>
        <Bx s={[0.4, 0.03, 0.03]} c={PAL.steel} metal={0.7} />
        <Bx s={[0.03, 0.4, 0.03]} c={PAL.steel} metal={0.7} />
      </group>
      <mesh position={[-CH_W / 2 - 0.5, -0.3 - 0.0, 0.42]}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshStandardMaterial ref={led} color="#5be38a" emissive="#5be38a" emissiveIntensity={0.1} />
      </mesh>
      {/* dial */}
      <Cy p={[-CH_W / 2 - 0.7, 0.1, 0.38]} rad={0.28} h={0.06} r={[Math.PI / 2, 0, 0]} c="#e9edf2" rough={0.4} />
      <group position={[-CH_W / 2 - 0.7, 0.1, 0.43]}>
        <group ref={needle} rotation={[0, 0, -2.2]}>
          <Bx p={[0, 0.12, 0]} s={[0.02, 0.24, 0.01]} c="#c43a2f" />
        </group>
      </group>
      <Bx p={[-CH_W / 2 - 0.7, -0.15, 0.1]} s={[0.04, 0.5, 0.04]} c={PAL.steel} metal={0.6} />

      <Swarm ref={air} count={N_AIR} color="#b9c5d4" radius={0.032} halo={1.5} haloOpacity={0.1} emissive={0.4} />
      <Swarm ref={vapA} count={N_VAP} color={PAL.pbi2} radius={0.03} halo={2} haloOpacity={0.18} emissive={1.2} />
      <Swarm ref={vapB} count={N_VAP} color={PAL.mai} radius={0.03} halo={2} haloOpacity={0.18} emissive={1.2} />

      {/* thickness gauge (illustrative) */}
      {gFilm ? (
        <group>
          <VGauge p={[CH_W / 2 + 0.55, 0.45, 0.3]} h={1.2} value={thick} />
          <StoryTag position={[CH_W / 2 + 0.55, 1.2, 0.3]} kind="tiny" sub={t("minh họa", "illustrative")}>
            {LBL.thick}
          </StoryTag>
        </group>
      ) : null}

      {/* cross-section callout */}
      <SectionBlock p={[CH_W / 2 + 1.7, 0.7, 0]} w={1.3} d={0.5} glassH={0.5} state={sec} />
      {gSec ? <Rod a={[0.7, SUB_Y - 0.1, 0]} b={[CH_W / 2 + 1.0, 0.85, 0]} color="#b9c5d4" /> : null}

      {/* labels */}
      {step === 0 ? (
        <StoryTag position={[0, 2.0, 1.0]} kind="layer">
          {LBL.chamber}
        </StoryTag>
      ) : null}
      {step === 0 ? (
        <StoryTag position={[-1.5, -0.2, 1.1]} kind="concept" minor>
          {LBL.door}
        </StoryTag>
      ) : null}
      {gHolder ? (
        <>
          <StoryTag position={[0.95, SUB_Y + 0.12, 0.6]} kind="layer">
            {LBL.sub}
          </StoryTag>
          <StoryTag position={[-0.9, SUB_Y + 0.28, 0]} kind="concept" minor>
            {LBL.holder}
          </StoryTag>
        </>
      ) : null}
      {gPump ? (
        <>
          <StoryTag position={[-CH_W / 2 - 0.7, -1.15, 0.5]} kind="concept">
            {LBL.pump}
          </StoryTag>
          <StoryTag position={[-CH_W / 2 - 0.7, 0.55, 0.5]} kind="tiny" sub={LBL.low}>
            {LBL.gauge}
          </StoryTag>
          <StoryTag position={[-CH_W / 2 - 0.4, -0.05, 0.2]} kind="particle" minor>
            {LBL.air}
          </StoryTag>
        </>
      ) : null}
      {gSrc ? (
        <>
          <StoryTag position={[-SRC_X, -1.05, 0.7]} kind="layer">
            {LBL.srcA}
          </StoryTag>
          <StoryTag position={[SRC_X, -1.05, 0.7]} kind="good">
            {LBL.srcB}
          </StoryTag>
        </>
      ) : null}
      {gVap ? (
        <>
          <StoryTag position={[-1.0, 0.4, 0.4]} kind="layer" minor>
            {LBL.vapA}
          </StoryTag>
          <StoryTag position={[1.0, 0.4, 0.4]} kind="good" minor>
            {LBL.vapB}
          </StoryTag>
        </>
      ) : null}
      {gFilm ? (
        <StoryTag position={[0, SUB_Y - 0.5, 0.8]} kind="good">
          {LBL.film}
        </StoryTag>
      ) : null}
      {gOnlyA ? (
        <StoryTag position={[0, 0.6, 0.9]} kind="bad">
          {LBL.onlyA}
        </StoryTag>
      ) : null}
      {gOnlyB ? (
        <StoryTag position={[0, 0.6, 0.9]} kind="bad">
          {LBL.onlyB}
        </StoryTag>
      ) : null}
      {gSec ? (
        <>
          <StoryTag position={[CH_W / 2 + 1.7, 1.5, 0.4]} kind="good">
            {LBL.secFilm}
          </StoryTag>
          <StoryTag position={[CH_W / 2 + 1.7, 0.3, 0.4]} kind="layer">
            {LBL.secSub}
          </StoryTag>
          <StoryTag position={[CH_W / 2 + 1.7, -0.1, 0.4]} kind="tiny">
            {LBL.scale}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
