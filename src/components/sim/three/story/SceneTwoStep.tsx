import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { AssemblingLattice, Bench, Bx, PAL, Tube, useGrainTexture } from "./fabKit";
import { Rod, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { between, clamp01, hash1, lerp } from "./world";

const LBL = {
  clean: t("Đế sạch", "Clean substrate"),
  stage: t("Bệ phủ", "Coating stage"),
  first: t("Dung dịch PbI₂ (tiền chất 1)", "PbI₂ solution (first precursor)"),
  layer: t("Lớp tiền chất PbI₂", "PbI₂ precursor layer"),
  notYet: t("chưa phải perovskite", "not finished perovskite"),
  second: t("Dung dịch MAI (tiền chất 2)", "MAI solution (second precursor)"),
  mai: t("Tiền chất 2: MAI", "Second precursor: MAI"),
  pbi2: t("Tiền chất 1: PbI₂ chưa phản ứng", "First precursor: unreacted PbI₂"),
  zone: t("Vùng phản ứng", "Reaction region"),
  perov: t("MAPbI₃ perovskite", "MAPbI₃ perovskite"),
  equation: t("PbI₂ + MAI → MAPbI₃  (ví dụ đơn giản)", "PbI₂ + MAI → MAPbI₃  (simplified example)"),
  scale: t("Mặt cắt phóng đại, không đúng tỉ lệ", "Magnified cross-section, not to scale"),
  before: t("Trước: lớp PbI₂", "Before: PbI₂ layer"),
  after: t("Sau: màng perovskite", "After: perovskite film"),
  ma: t("MA⁺", "MA⁺"),
};

const BLOCK_X = 2.9;
const BW = 1.5;
const BD = 0.6;
const GH = 0.5;
const LH = 0.5;
const MH = 0.2;
const N_ION = 22;
const SUB = 1.5;
const C_YEL = new THREE.Color(PAL.pbi2);
const C_DARK = new THREE.Color(PAL.dark);

/** How strongly a part is shown when the viewer picks one to examine. */
const dimFor = (focus: string, part: string) => (focus === "all" || focus === part ? 1 : 0.16);

export function TwoStepScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("twostep", step), 2);
  const subGrp = useRef<THREE.Group>(null);
  const film1 = useRef<THREE.Mesh>(null);
  const film1Mat = useRef<THREE.MeshStandardMaterial>(null);
  const film2 = useRef<THREE.Mesh>(null);
  const film2Mat = useRef<THREE.MeshStandardMaterial>(null);
  const grain = useRef<THREE.Mesh>(null);
  const grainMat = useRef<THREE.MeshBasicMaterial>(null);
  const bar1 = useRef<THREE.Group>(null);
  const bar2 = useRef<THREE.Group>(null);
  const block = useRef<THREE.Group>(null);
  const unreact = useRef<THREE.Mesh>(null);
  const unreactMat = useRef<THREE.MeshStandardMaterial>(null);
  const react = useRef<THREE.Mesh>(null);
  const reactMat = useRef<THREE.MeshStandardMaterial>(null);
  const zone = useRef<THREE.Mesh>(null);
  const zoneMat = useRef<THREE.MeshStandardMaterial>(null);
  const maiLayer = useRef<THREE.Mesh>(null);
  const maiMat = useRef<THREE.MeshStandardMaterial>(null);
  const faceGrain = useRef<THREE.Mesh>(null);
  const faceMat = useRef<THREE.MeshBasicMaterial>(null);
  const ma = useRef<SwarmApi>(null);
  const iod = useRef<SwarmApi>(null);
  const bubble = useRef<THREE.Group>(null);
  const asm = useRef(0);
  const cur = useRef({ r: 0 });
  const tex = useGrainTexture(21, 8);
  const faceTex = useGrainTexture(27, 7);

  const g0 = useGate(() => step === 0);
  const g1 = useGate(() => step === 1 && clock.current.t > 3.6);
  const g2 = useGate(() => step === 2 && clock.current.t > 3.6);
  const gx = useGate(() => step >= 3);
  const gEq = useGate(() => step === 4 && clock.current.t > 3.2);
  const gBefore = useGate(() => step === 5 && cur.current.r < 0.5);
  const gAfter = useGate(() => step === 5 && cur.current.r >= 0.5);

  useFrame(() => {
    const T = clock.current.t;
    const f = useSim.getState().fab;
    const focus = String(f.focus ?? "all");
    const ba = String(f.ba ?? "auto");

    // reaction progress (0 = only PbI₂ + MAI on top, 1 = fully perovskite)
    let r = 0;
    if (step === 3) r = 0.78 * between(T, 1.0, 8.0);
    else if (step === 4) r = lerp(0.78, 1, between(T, 0.0, 3.0));
    else if (step >= 5) r = 1;
    if (step === 5) {
      const auto = T % 6 < 3 ? 0 : 1;
      r = ba === "before" ? 0 : ba === "after" ? 1 : auto;
    }
    cur.current.r = lerp(cur.current.r, r, step === 5 ? 0.12 : 1);
    const R = cur.current.r;

    // substrate arrives (step 0)
    if (subGrp.current) subGrp.current.position.y = step === 0 ? lerp(1.0, 0, between(T, 0.4, 3.0)) : 0;

    // dispensers sweep across the substrate
    const x1 = step === 1 ? lerp(-0.8, 0.8, between(T, 0.6, 3.4)) : step < 1 ? -0.8 : 0.8;
    const x2 = step === 2 ? lerp(-0.8, 0.8, between(T, 0.6, 3.4)) : step < 2 ? -0.8 : 0.8;
    if (bar1.current) {
      bar1.current.position.set(x1, 0.5, 0);
      bar1.current.visible = step === 1 && T < 4.2;
    }
    if (bar2.current) {
      bar2.current.position.set(x2, 0.5, 0);
      bar2.current.visible = step === 2 && T < 4.2;
    }
    // films on the substrate
    if (film1.current && film1Mat.current) {
      const w = step === 0 ? 0 : step === 1 ? (x1 + 0.8) : 1.6;
      film1.current.visible = w > 0.01;
      film1.current.scale.set(Math.max(1e-3, w), 1, SUB - 0.1);
      film1.current.position.x = -0.8 + w / 2;
      film1Mat.current.color.copy(C_YEL).lerp(C_DARK, step >= 3 ? R : 0);
    }
    if (film2.current && film2Mat.current) {
      const w = step < 2 ? 0 : step === 2 ? x2 + 0.8 : 1.6;
      film2.current.visible = w > 0.01 && R < 0.98;
      film2.current.scale.set(Math.max(1e-3, w), 1, SUB - 0.1);
      film2.current.position.x = -0.8 + w / 2;
      film2Mat.current.opacity = 0.55 * (1 - clamp01(R * 1.3));
    }
    if (grainMat.current) grainMat.current.opacity = clamp01((R - 0.3) / 0.7);

    // cross-section block
    if (block.current) block.current.scale.setScalar(Math.max(1e-4, step === 3 ? between(T, 0, 1.0) : step > 3 ? 1 : 0));
    const H = LH;
    const reacted = H * R;
    const rest = H - reacted;
    const dUn = dimFor(focus, "pbi2");
    const dRe = dimFor(focus, "perov");
    const dZo = dimFor(focus, "zone");
    const dMa = dimFor(focus, "mai");
    if (unreact.current && unreactMat.current) {
      unreact.current.scale.set(BW, Math.max(1e-4, rest), BD);
      unreact.current.position.y = GH / 2 + rest / 2;
      unreactMat.current.opacity = 0.95 * dUn;
      unreact.current.visible = rest > 0.004;
    }
    if (react.current && reactMat.current) {
      react.current.scale.set(BW, Math.max(1e-4, reacted), BD);
      react.current.position.y = GH / 2 + rest + reacted / 2;
      reactMat.current.opacity = 0.95 * dRe;
      react.current.visible = reacted > 0.004;
    }
    if (zone.current && zoneMat.current) {
      const on = R > 0.01 && R < 0.995 ? 1 : 0;
      zone.current.scale.set(BW + 0.02, 0.07 * on + 1e-4, BD + 0.02);
      zone.current.position.y = GH / 2 + rest;
      zoneMat.current.opacity = 0.85 * dZo;
    }
    if (maiLayer.current && maiMat.current) {
      const left = step < 4 ? lerp(MH, MH * 0.35, R) : MH * 0.35 * (1 - between(T, 0, 3));
      maiLayer.current.scale.set(BW, Math.max(1e-4, left), BD);
      maiLayer.current.position.y = GH / 2 + H + left / 2;
      maiMat.current.opacity = 0.5 * dMa;
      maiLayer.current.visible = left > 0.004;
    }
    if (faceGrain.current && faceMat.current) {
      faceGrain.current.scale.set(BW, Math.max(1e-4, reacted), 1);
      faceGrain.current.position.set(0, GH / 2 + rest + reacted / 2, BD / 2 + 0.003);
      faceMat.current.opacity = clamp01((R - 0.15) / 0.5) * dRe;
    }

    // MA⁺ and I⁻ go down into the PbI₂ layer
    if (ma.current && iod.current) {
      const run = step === 2 ? between(T, 4, 6) * 0.3 : step === 3 ? 1 : step === 4 ? 1 - between(T, 0.5, 3.0) : 0;
      const top = GH / 2 + H + MH * 0.6;
      const front = GH / 2 + rest;
      for (let i = 0; i < N_ION; i++) {
        const on = run * N_ION > i;
        if (!on) {
          ma.current.hide(i);
          iod.current.hide(i);
          continue;
        }
        const life = (T * 0.22 + hash1(i * 4.7)) % 1;
        const x = (hash1(i * 2.3) - 0.5) * (BW - 0.2);
        const z = (hash1(i * 6.1) - 0.5) * (BD - 0.1);
        const y = lerp(top, Math.max(front, GH / 2 + 0.03), life);
        const fade = life < 0.9 ? 1 : (1 - life) / 0.1;
        ma.current.set(i, x, y, z, fade * dimFor(focus, "mai"));
        iod.current.set(i, x + 0.06, y + 0.04, z + 0.05, fade * dimFor(focus, "mai") * 0.8);
      }
      ma.current.flush();
      iod.current.flush();
    }
    asm.current = step === 4 ? between(T, 0.6, 3.6) : step >= 5 ? (R > 0.5 ? 1 : 0.02) : 0;
    if (bubble.current) bubble.current.scale.setScalar(Math.max(1e-4, step === 4 ? between(T, 0.2, 1.0) : step === 5 ? 1 : 0));
  });

  return (
    <group>
      <Bench />
      {/* coating stage */}
      <Bx p={[0, -0.45, 0]} s={[2.4, 0.8, 2.4]} c={PAL.steelDark} metal={0.4} rough={0.5} />
      <Bx p={[0, -0.04, 0]} s={[2.0, 0.04, 2.0]} c={PAL.steel} metal={0.6} rough={0.3} />
      <group ref={subGrp}>
        <Bx p={[0, 0.04, 0]} s={[SUB, 0.07, SUB]} c={PAL.glass} o={0.4} edge="#cfe9fb" rough={0.15} />
        <mesh ref={film1} position={[-0.8, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial ref={film1Mat} color={PAL.pbi2} roughness={0.35} transparent opacity={0.95} />
        </mesh>
        <mesh ref={film2} position={[-0.8, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial ref={film2Mat} color={PAL.mai} roughness={0.15} transparent opacity={0.55} depthWrite={false} />
        </mesh>
        <mesh ref={grain} position={[0, 0.093, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[SUB - 0.1, SUB - 0.1]} />
          <meshBasicMaterial ref={grainMat} map={tex} transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* dispensers: a bar with a feed tube */}
      <group ref={bar1} visible={false}>
        <Bx s={[0.12, 0.1, SUB - 0.2]} c={PAL.steel} metal={0.6} rough={0.3} />
        <Bx p={[0, -0.04, 0]} s={[0.06, 0.04, SUB - 0.25]} c={PAL.pbi2} o={0.9} emis={PAL.pbi2} emisI={0.35} />
        <Tube a={[0, 0.05, 0]} b={[0, 0.55, 0]} rad={0.035} c={PAL.pbi2} o={0.8} />
      </group>
      <group ref={bar2} visible={false}>
        <Bx s={[0.12, 0.1, SUB - 0.2]} c={PAL.steel} metal={0.6} rough={0.3} />
        <Bx p={[0, -0.04, 0]} s={[0.06, 0.04, SUB - 0.25]} c={PAL.mai} o={0.9} emis={PAL.mai} emisI={0.35} />
        <Tube a={[0, 0.05, 0]} b={[0, 0.55, 0]} rad={0.035} c={PAL.mai} o={0.8} />
      </group>

      {/* magnified cross-section (callout) */}
      <group position={[BLOCK_X, 0.45, 0]}>
        <group ref={block} scale={0.0001}>
          <Bx s={[BW, GH, BD]} c={PAL.glass} o={0.45} edge="#cfe9fb" />
          <mesh ref={unreact}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial ref={unreactMat} color={PAL.pbi2} roughness={0.4} transparent opacity={0.95} />
          </mesh>
          <mesh ref={react}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial ref={reactMat} color={PAL.dark} roughness={0.4} transparent opacity={0.95} />
          </mesh>
          <mesh ref={zone}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial ref={zoneMat} color={PAL.warn} emissive={PAL.warn} emissiveIntensity={0.8} transparent opacity={0.85} />
          </mesh>
          <mesh ref={maiLayer}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial ref={maiMat} color={PAL.mai} roughness={0.1} transparent opacity={0.5} depthWrite={false} />
          </mesh>
          <mesh ref={faceGrain}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial ref={faceMat} map={faceTex} transparent opacity={0} depthWrite={false} />
          </mesh>
          <Swarm ref={ma} count={N_ION} color={PAL.mai} radius={0.045} halo={1.8} haloOpacity={0.18} emissive={1.1} />
          <Swarm ref={iod} count={N_ION} color="#9d7bff" radius={0.032} halo={1.8} haloOpacity={0.16} emissive={1.3} />
        </group>
      </group>
      {gx ? <Rod a={[0.85, 0.12, 0]} b={[BLOCK_X - 0.8, 0.5, 0]} color="#b9c5d4" /> : null}

      {/* lattice bubble: where MA⁺, Pb²⁺ and I⁻ end up */}
      <group ref={bubble} position={[BLOCK_X + 1.6, 1.15, 0]} scale={0.0001}>
        <AssemblingLattice asm={asm} a={0.26} radii={{ A: 0.055, B: 0.04, X: 0.033 }} colors={{ A: PAL.mai, B: "#c5ccd6", X: "#7a56e0" }} spread={0.7} />
      </group>

      {/* labels */}
      {g0 ? (
        <>
          <StoryTag position={[0.95, 0.2, 0.9]} kind="layer">
            {LBL.clean}
          </StoryTag>
          <StoryTag position={[-1.0, -0.45, 1.3]} kind="concept">
            {LBL.stage}
          </StoryTag>
        </>
      ) : null}
      {g1 ? (
        <StoryTag position={[0.2, 0.3, 0.95]} kind="layer" sub={LBL.notYet}>
          {LBL.layer}
        </StoryTag>
      ) : null}
      {step === 1 ? (
        <StoryTag position={[0, 0.85, 0]} kind="particle" minor>
          {LBL.first}
        </StoryTag>
      ) : null}
      {step === 2 ? (
        <StoryTag position={[0, 0.85, 0]} kind="particle" minor>
          {LBL.second}
        </StoryTag>
      ) : null}
      {g2 ? (
        <StoryTag position={[0.3, 0.28, 0.95]} kind="good">
          {LBL.mai}
        </StoryTag>
      ) : null}
      {gx ? (
        <>
          <StoryTag position={[BLOCK_X, 1.4, BD / 2 + 0.2]} kind="tiny">
            {LBL.scale}
          </StoryTag>
          <StoryTag position={[BLOCK_X - 0.95, 0.55, BD / 2]} kind="layer" minor>
            {LBL.pbi2}
          </StoryTag>
          <StoryTag position={[BLOCK_X + 0.95, 0.9, BD / 2]} kind="good" minor>
            {LBL.mai}
          </StoryTag>
          <StoryTag position={[BLOCK_X + 0.95, 0.68, BD / 2]} kind="bad">
            {LBL.zone}
          </StoryTag>
          <StoryTag position={[BLOCK_X - 0.95, 0.95, BD / 2]} kind="good">
            {LBL.perov}
          </StoryTag>
        </>
      ) : null}
      {gEq ? (
        <StoryTag position={[BLOCK_X + 1.6, 0.35, 0]} kind="concept">
          {LBL.equation}
        </StoryTag>
      ) : null}
      {gBefore ? (
        <StoryTag position={[0, 0.5, 0.9]} kind="layer">
          {LBL.before}
        </StoryTag>
      ) : null}
      {gAfter ? (
        <StoryTag position={[0, 0.5, 0.9]} kind="good">
          {LBL.after}
        </StoryTag>
      ) : null}
    </group>
  );
}
