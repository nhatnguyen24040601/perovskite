import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { Bench, Bx, PAL, SectionBlock, filmColor, num, useGrainTexture } from "./fabKit";
import { Rod, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { between, clamp01, hash1, lerp } from "./world";

const LBL = {
  sub: t("Đế sạch", "Clean substrate"),
  blade: t("Lưỡi dao gạt", "Coating blade"),
  ink: t("Vệt mực tiền chất", "Precursor ink bead"),
  moves: t("Lưỡi dao di chuyển", "Blade moves"),
  wet: t("Màng ướt liên tục", "Continuous wet film"),
  gap: t("Khe dao (minh họa)", "Blade gap (illustrative)"),
  thin: t("Màng ướt mỏng", "Thin wet film"),
  mod: t("Màng ướt vừa", "Moderate wet film"),
  thick: t("Màng ướt dày", "Thick wet film"),
  conceptual: t("loại khái niệm, không phải số đo", "conceptual category, not a measurement"),
  solvent: t("Dung môi bay đi", "Solvent leaves"),
  grains: t("Hạt tinh thể perovskite", "Perovskite crystal grains"),
  ideal: t("Mục tiêu lý tưởng: màng đồng đều", "Idealized target: a uniform film"),
  defects: t("Có thể có lỗi phủ: vệt và lỗ kim", "Possible coating defects: streaks and pinholes"),
  conceptualDef: t("minh họa khái niệm", "conceptual illustration"),
  secFilm: t("Màng perovskite (độ dày phóng đại)", "Perovskite film (thickness exaggerated)"),
  secSub: t("Đế thủy tinh", "Glass substrate"),
  scale: t("Không đúng tỉ lệ", "Not to scale"),
  heat: t("Bàn sấy", "Drying plate"),
};

const X0 = -1.6;
const SUBW = 3.2;
const SUB_TOP = 0.035;
const BX0 = -1.85;
const BX1 = 1.85;
const FW = 1.5;
const N_DROP = 7;
const N_SOL = 44;

function defectTexture(): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 128;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, 512, 128);
  for (let i = 0; i < 16; i++) {
    const y = hash1(i * 3.3) * 128;
    ctx.strokeStyle = `rgba(20,12,30,${0.35 + 0.4 * hash1(i * 7.1)})`;
    ctx.lineWidth = 1 + hash1(i * 5.9) * 3;
    ctx.beginPath();
    ctx.moveTo(hash1(i * 1.9) * 120, y);
    ctx.lineTo(300 + hash1(i * 2.7) * 212, y + (hash1(i * 4.1) - 0.5) * 5);
    ctx.stroke();
  }
  for (let i = 0; i < 26; i++) {
    ctx.fillStyle = "rgba(12,8,20,0.85)";
    ctx.beginPath();
    ctx.arc(hash1(i * 6.3) * 512, hash1(i * 8.9) * 128, 2 + hash1(i * 2.2) * 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function BladeScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("blade", step), 2);
  const sub = useRef<THREE.Group>(null);
  const blade = useRef<THREE.Group>(null);
  const bead = useRef<THREE.Mesh>(null);
  const gapBar = useRef<THREE.Mesh>(null);
  const film = useRef<THREE.Mesh>(null);
  const filmMat = useRef<THREE.MeshStandardMaterial>(null);
  const grain = useRef<THREE.Mesh>(null);
  const grainMat = useRef<THREE.MeshBasicMaterial>(null);
  const defect = useRef<THREE.Mesh>(null);
  const defectMat = useRef<THREE.MeshBasicMaterial>(null);
  const plate = useRef<THREE.MeshStandardMaterial>(null);
  const drops = useRef<SwarmApi>(null);
  const solv = useRef<SwarmApi>(null);
  const sec = useRef({ color: new THREE.Color(PAL.ink), h: 0.1, cryst: 0, show: 0 });
  const tmp = useMemo(() => new THREE.Color(), []);
  const grainTex = useGrainTexture(41, 14);
  const defTex = useMemo(() => defectTexture(), []);
  const info = useRef({ cat: 1, def: 0 });

  const g0 = useGate(() => step === 0);
  const g1 = useGate(() => step === 1 && clock.current.t > 3);
  const g2 = useGate(() => step === 2 && clock.current.t > 1.2);
  const gThin = useGate(() => step === 3 && info.current.cat === 0);
  const gMod = useGate(() => step === 3 && info.current.cat === 1);
  const gThick = useGate(() => step === 3 && info.current.cat === 2);
  const g4 = useGate(() => step === 4 && clock.current.t > 1.5);
  const g5 = useGate(() => step === 5 && clock.current.t > 3);
  const gIdeal = useGate(() => step === 6 && info.current.def < 0.12 && clock.current.t > 1);
  const gDef = useGate(() => step === 6 && info.current.def >= 0.12 && clock.current.t > 1);
  const gSec = useGate(() => step === 6 && clock.current.t > 1);

  useFrame(() => {
    const T = clock.current.t;
    const f = useSim.getState().fab;
    const gap = num(f, "gap", 0.5);
    const speed = num(f, "speed", 0.5);
    const g = 0.03 + 0.17 * gap;
    const thickIdx = clamp01(0.1 + 0.8 * gap + 0.15 * (speed - 0.5));
    info.current.cat = thickIdx < 0.33 ? 0 : thickIdx < 0.66 ? 1 : 2;
    const risk = clamp01((Math.max(Math.abs(gap - 0.5), Math.abs(speed - 0.5) * 1.2) * 2 - 0.35) / 0.65);
    info.current.def = risk;

    // blade position
    const travel = lerp(6.4, 3.2, speed);
    let xb = BX0;
    if (step === 2) xb = lerp(BX0, BX1, between(T, 0.8, 0.8 + travel));
    else if (step === 3) xb = 0.2;
    else if (step >= 4) xb = 2.3;
    if (blade.current) {
      blade.current.position.set(xb, SUB_TOP + g + 0.27, 0);
      blade.current.visible = true;
    }
    if (gapBar.current) {
      gapBar.current.visible = step === 3;
      gapBar.current.scale.set(0.012, g, 0.012);
      gapBar.current.position.set(xb, SUB_TOP + g / 2, 0.8);
    }
    // film behind the blade
    const filmEnd = step < 2 ? X0 : step === 2 ? Math.min(Math.max(xb, X0), X0 + SUBW) : step === 3 ? 0.2 : X0 + SUBW;
    const L = Math.max(0, filmEnd - X0);
    const dry = step < 4 ? 0 : step === 4 ? between(T, 0.5, 6) : 1;
    const cryst = step < 5 ? 0 : step === 5 ? between(T, 0.8, 5.5) : 1;
    const shrink = 1 - 0.5 * dry;
    const hFilm = (0.012 + 0.05 * thickIdx) * shrink;
    if (film.current && filmMat.current) {
      film.current.visible = L > 0.01 && (step >= 2 || false);
      film.current.scale.set(Math.max(1e-3, L), Math.max(1e-4, hFilm), FW);
      film.current.position.set(X0 + L / 2, SUB_TOP + hFilm / 2, 0);
      filmColor(tmp, dry, cryst);
      filmMat.current.color.copy(tmp);
      filmMat.current.roughness = lerp(0.18, 0.6, Math.max(dry, cryst));
    }
    if (grain.current && grainMat.current) {
      grain.current.visible = L > 0.01;
      grain.current.scale.set(Math.max(1e-3, L), FW, 1);
      grain.current.position.set(X0 + L / 2, SUB_TOP + hFilm + 0.002, 0);
      grainMat.current.opacity = cryst;
    }
    if (defect.current && defectMat.current) {
      defect.current.visible = L > 0.01 && step >= 6;
      defect.current.scale.set(Math.max(1e-3, L), FW, 1);
      defect.current.position.set(X0 + L / 2, SUB_TOP + hFilm + 0.004, 0);
      defectMat.current.opacity = step >= 6 ? risk : 0;
    }
    if (plate.current) plate.current.emissiveIntensity = step === 4 ? 0.15 + 1.1 * between(T, 0, 1.5) : step === 5 ? 0.6 * (1 - between(T, 0, 3)) : 0.08;

    // ink bead in front of the blade
    if (bead.current) {
      const show = step === 1 ? between(T, 2.0, 3.4) : step === 2 ? 1 - 0.35 * between(T, 0.8, 0.8 + travel) : step === 3 ? 0.7 : 0;
      bead.current.visible = show > 0.02;
      bead.current.position.set(xb + 0.12, SUB_TOP + 0.09, 0);
      bead.current.scale.set(0.1 * Math.max(0.2, show), 0.1 * Math.max(0.2, show), FW * 0.5 * Math.max(0.01, show) + 0.001);
    }
    // drops falling to make the bead (step 1)
    if (drops.current) {
      for (let i = 0; i < N_DROP; i++) {
        const t0 = 0.6 + i * 0.25;
        const k = (T - t0) / 0.7;
        if (step !== 1 || k < 0 || k > 1) {
          drops.current.hide(i);
          continue;
        }
        drops.current.set(i, BX0 + 0.12, lerp(1.0, SUB_TOP + 0.1, k * k), (i - (N_DROP - 1) / 2) * 0.2, 1);
      }
      drops.current.flush();
    }
    // solvent leaves (step 4–5)
    if (solv.current) {
      const amt = step === 4 ? between(T, 0.6, 2) : step === 5 ? 1 - between(T, 0, 3) : 0;
      const n = Math.round(N_SOL * amt);
      for (let i = 0; i < N_SOL; i++) {
        if (i >= n) {
          solv.current.hide(i);
          continue;
        }
        const life = (T * 0.34 + hash1(i * 5.9)) % 1;
        solv.current.set(i, X0 + hash1(i * 2.3) * SUBW, SUB_TOP + 0.05 + life * 0.9, (hash1(i * 8.7) - 0.5) * FW, 1 - life * 0.6);
      }
      solv.current.flush();
    }
    // callout
    const s = sec.current;
    s.show = step === 6 ? between(T, 0.3, 1.2) : 0;
    s.h = 0.05 + 0.14 * thickIdx * shrink;
    s.cryst = cryst;
    s.color.copy(tmp);
    if (sub.current) sub.current.visible = true;
  });

  const bladeGap = 0.115;
  return (
    <group>
      <Bench />
      {/* bed with drying plate */}
      <Bx p={[0, -0.25, 0]} s={[4.2, 0.4, 2.0]} c={PAL.steelDark} metal={0.4} rough={0.5} />
      <mesh position={[0, -0.049, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.0, 1.8]} />
        <meshStandardMaterial ref={plate} color="#2a2f36" emissive={PAL.hot} emissiveIntensity={0.08} />
      </mesh>
      <group ref={sub}>
        <Bx p={[0, 0, 0]} s={[SUBW, 0.07, 1.65]} c={PAL.glass} o={0.4} edge="#cfe9fb" rough={0.15} />
      </group>
      {/* wet film, grains and defects */}
      <mesh ref={film} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial ref={filmMat} color={PAL.ink} roughness={0.2} />
      </mesh>
      <mesh ref={grain} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={grainMat} map={grainTex} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={defect} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={defectMat} map={defTex} transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* ink bead */}
      <mesh ref={bead} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <sphereGeometry args={[1, 18, 12]} />
        <meshStandardMaterial color={PAL.ink} roughness={0.12} transparent opacity={0.92} />
      </mesh>
      <Swarm ref={drops} count={N_DROP} color={PAL.ink} radius={0.05} halo={1.4} haloOpacity={0.14} emissive={0.7} />
      <Swarm ref={solv} count={N_SOL} color={PAL.solvent} radius={0.03} halo={2} haloOpacity={0.16} emissive={1.1} />

      {/* blade on its carriage */}
      <group ref={blade} position={[BX0, SUB_TOP + bladeGap + 0.27, 0]}>
        <Bx s={[0.05, 0.55, FW + 0.1]} c={PAL.steel} metal={0.8} rough={0.25} />
        <Bx p={[0, 0.5, 0]} s={[0.22, 0.16, FW + 0.3]} c={PAL.steelDark} metal={0.6} />
        <Bx p={[0, 0.9, (FW + 0.2) / 2]} s={[0.1, 0.9, 0.08]} c={PAL.steel} metal={0.7} />
        <Bx p={[0, 0.9, -(FW + 0.2) / 2]} s={[0.1, 0.9, 0.08]} c={PAL.steel} metal={0.7} />
        <Bx p={[0, 1.4, 0]} s={[0.22, 0.12, FW + 0.5]} c={PAL.steelDark} metal={0.6} />
      </group>

      {/* gap bracket (step 3) */}
      <mesh ref={gapBar} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#e4a23a" />
      </mesh>

      {/* callout */}
      <SectionBlock p={[3.3, 0.5, 0]} w={1.3} d={0.5} glassH={0.5} state={sec} />
      {gSec ? <Rod a={[1.6, 0.04, 0]} b={[2.6, 0.45, 0]} color="#b9c5d4" /> : null}

      {/* labels */}
      {g0 ? (
        <>
          <StoryTag position={[-1.2, 0.18, 0.9]} kind="layer">
            {LBL.sub}
          </StoryTag>
          <StoryTag position={[BX0, 1.0, 0.8]} kind="concept">
            {LBL.blade}
          </StoryTag>
        </>
      ) : null}
      {g1 ? (
        <StoryTag position={[BX0 + 0.5, 0.35, 0.95]} kind="particle">
          {LBL.ink}
        </StoryTag>
      ) : null}
      {g2 ? (
        <>
          <StoryTag position={[0, 1.55, 0.6]} kind="concept" minor>
            {LBL.moves}
          </StoryTag>
          <StoryTag position={[X0 + 0.6, 0.25, 0.95]} kind="layer">
            {LBL.wet}
          </StoryTag>
        </>
      ) : null}
      {step === 3 ? (
        <StoryTag position={[0.5, 0.32, 0.9]} kind="tiny" sub={LBL.conceptual}>
          {LBL.gap}
        </StoryTag>
      ) : null}
      {gThin ? (
        <StoryTag position={[-0.7, 0.28, 0.9]} kind="good">
          {LBL.thin}
        </StoryTag>
      ) : null}
      {gMod ? (
        <StoryTag position={[-0.7, 0.28, 0.9]} kind="good">
          {LBL.mod}
        </StoryTag>
      ) : null}
      {gThick ? (
        <StoryTag position={[-0.7, 0.32, 0.9]} kind="bad">
          {LBL.thick}
        </StoryTag>
      ) : null}
      {g4 ? (
        <>
          <StoryTag position={[0.3, 0.9, 0.4]} kind="particle">
            {LBL.solvent}
          </StoryTag>
          <StoryTag position={[-1.3, -0.45, 1.05]} kind="concept" minor>
            {LBL.heat}
          </StoryTag>
        </>
      ) : null}
      {g5 ? (
        <StoryTag position={[0.5, 0.22, 0.9]} kind="good">
          {LBL.grains}
        </StoryTag>
      ) : null}
      {gIdeal ? (
        <StoryTag position={[0, 0.3, 0.95]} kind="good">
          {LBL.ideal}
        </StoryTag>
      ) : null}
      {gDef ? (
        <StoryTag position={[0, 0.3, 0.95]} kind="bad" sub={LBL.conceptualDef}>
          {LBL.defects}
        </StoryTag>
      ) : null}
      {gSec ? (
        <>
          <StoryTag position={[3.3, 1.1, 0.4]} kind="good">
            {LBL.secFilm}
          </StoryTag>
          <StoryTag position={[3.3, 0.1, 0.4]} kind="layer">
            {LBL.secSub}
          </StoryTag>
          <StoryTag position={[3.3, -0.25, 0.4]} kind="tiny">
            {LBL.scale}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
