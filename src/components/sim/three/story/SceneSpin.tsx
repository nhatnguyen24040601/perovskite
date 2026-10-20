import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { AssemblingLattice, Bench, Bx, Cy, PAL, SectionBlock, Sp, VGauge, filmColor, num, useGrainTexture } from "./fabKit";
import { Arrow3, Rod, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { between, clamp01, hash1, lerp } from "./world";

const LBL = {
  glass: t("Đế thủy tinh", "Glass substrate"),
  chuck: t("Mâm quay (chuck)", "Rotating chuck"),
  pipette: t("Pipet", "Pipette"),
  ink: t("Dung dịch tiền chất perovskite", "Perovskite precursor solution"),
  spread: t("Mực trải ra ngoài", "Ink spreads outward"),
  wet: t("Màng ướt", "Wet film"),
  thicker: t("dày hơn", "thicker"),
  thinner: t("mỏng hơn", "thinner"),
  illus: t("kết quả minh họa", "illustrative result"),
  solvent: t("Dung môi bay đi", "Solvent leaves"),
  grains: t("Hạt tinh thể perovskite", "Perovskite crystal grains"),
  gb: t("Ranh giới hạt", "Grain boundary"),
  lattice: t("Mạng ABX₃ trong một hạt", "ABX₃ lattice inside one grain"),
  film: t("Màng perovskite (độ dày phóng đại)", "Perovskite film (thickness exaggerated)"),
  sub: t("Đế thủy tinh (dày hơn nhiều)", "Glass substrate (much thicker)"),
  scale: t("Không đúng tỉ lệ", "Not to scale"),
};

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAG = /* glsl */ `
varying vec2 vUv;
uniform float uR, uWet, uDry, uCryst, uTime, uTh;
uniform sampler2D uGrain;
uniform vec3 uInk, uDryC, uDarkC;
void main() {
  vec2 p = (vUv - 0.5) * 1.7;
  float r = length(p);
  float a = atan(p.y, p.x);
  float front = uR * (1.0 + 0.035 * sin(a * 9.0 + uTime * 0.7) + 0.02 * sin(a * 17.0 - uTime));
  if (r > front) discard;
  float rim = smoothstep(front - 0.09, front, r);
  float flow = 0.5 + 0.5 * sin(a * 16.0 + r * 7.0 - uTime * 3.0 * uWet);
  float rings = 0.5 + 0.5 * sin(r * 46.0 - uTime * 7.0 * uWet);
  vec3 col = mix(uInk, uDryC, uDry);
  col *= 0.86 + 0.3 * uWet * (0.55 * flow + 0.45 * rings);
  col += rim * 0.16 * (1.0 - uCryst);
  vec3 g = texture2D(uGrain, vUv).rgb;
  col = mix(col, mix(uDarkC, g, 0.92), uCryst);
  float alpha = mix(0.55 + 0.4 * uTh, 0.97, max(uDry, uCryst));
  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}`;

const N_FLING = 26;
const N_SOLV = 46;
const SUB_TOP = 0.11;
const PIP_REST = 0.62;

export function SpinScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("spin", step), 2);
  const spinGrp = useRef<THREE.Group>(null);
  const subGrp = useRef<THREE.Group>(null);
  const pipe = useRef<THREE.Group>(null);
  const drop = useRef<THREE.Mesh>(null);
  const fling = useRef<SwarmApi>(null);
  const solv = useRef<SwarmApi>(null);
  const bubble = useRef<THREE.Group>(null);
  const ang = useRef(0);
  const lastT = useRef(0);
  const asm = useRef(0);
  const gauge = useRef(0.5);
  const sec = useRef({ color: new THREE.Color(PAL.ink), h: 0.1, cryst: 0, show: 0 });
  const tex = useGrainTexture(5, 8);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uR: { value: 0 },
          uWet: { value: 0 },
          uDry: { value: 0 },
          uCryst: { value: 0 },
          uTime: { value: 0 },
          uTh: { value: 0.5 },
          uGrain: { value: tex },
          uInk: { value: new THREE.Color(PAL.ink) },
          uDryC: { value: new THREE.Color(PAL.drying) },
          uDarkC: { value: new THREE.Color(PAL.dark) },
        },
      }),
    [tex],
  );
  const tmp = useMemo(() => new THREE.Color(), []);

  const showIdle = useGate(() => step === 0);
  const showPip = useGate(() => step === 1 && clock.current.t > 2.4);
  const showFlow = useGate(() => step === 2 && clock.current.t > 1.5);
  const showGauge = useGate(() => step >= 2 && step <= 4);
  const showSolv = useGate(() => step === 4 && clock.current.t > 1.5);
  const showGrain = useGate(() => step === 5 && clock.current.t > 2.4);
  const showSec = useGate(() => step === 6 && clock.current.t > 0.8);

  useFrame(() => {
    const T = clock.current.t;
    const dtc = T - lastT.current;
    lastT.current = T;
    const f = useSim.getState().fab;
    const speed = num(f, "speed", 0.5);
    const time = num(f, "time", 0.5);
    const wmax = lerp(2.2, 11, speed);

    // ── rotation
    let w = 0;
    if (step === 2) w = wmax * between(T, 0, 1.6);
    else if (step === 3 || step === 4) w = wmax;
    else if (step === 5) w = wmax * (1 - between(T, 0, 1.0));
    else if (step === 6) w = 0.55;
    if (dtc > 0 && dtc < 0.3) ang.current += w * dtc;
    if (spinGrp.current) spinGrp.current.rotation.y = ang.current;

    // ── substrate arrives on the chuck (step 0)
    const subY = step === 0 ? lerp(1.0, 0, between(T, 0.4, 3.0)) : 0;
    if (subGrp.current) subGrp.current.position.y = subY;

    // ── film state
    const th = clamp01(0.92 - 0.62 * speed - 0.28 * time);
    let R = 0;
    let thNow = 1;
    if (step === 1) R = 0.16 * between(T, 2.2, 2.6);
    else if (step === 2) {
      const spreadTime = lerp(4.6, 2.4, speed);
      R = lerp(0.16, 1.5, between(T, 0.4, 0.4 + spreadTime));
      thNow = lerp(1, lerp(1, th, 0.55), between(T, 0.4, 0.4 + spreadTime));
    } else if (step >= 3) {
      R = 1.5;
      thNow = step === 3 ? lerp(lerp(1, th, 0.55), th, between(T, 0.5, 6)) : th;
    }
    const dry = step < 4 ? 0 : step === 4 ? 0.85 * between(T, 0.2, 5.5) : step === 5 ? lerp(0.85, 1, between(T, 0, 2)) : 1;
    const cryst = step < 5 ? 0 : step === 5 ? between(T, 0.8, 5) : 1;
    const wet = step === 2 ? between(T, 0, 1.5) * (0.5 + speed * 0.7) : step === 3 ? (1 - between(T, 4, 8) * 0.4) * (0.5 + speed * 0.7) : step === 4 ? 0.35 * (1 - between(T, 0, 3)) : 0;
    const u = mat.uniforms;
    u.uR!.value = R;
    u.uWet!.value = wet;
    u.uDry!.value = dry;
    u.uCryst!.value = cryst;
    u.uTime!.value = T;
    u.uTh!.value = thNow * (step >= 4 ? 1 - 0.35 * dry : 1);
    gauge.current = thNow * (step >= 4 ? 1 - 0.35 * dry : 1);

    // ── pipette and droplet (step 1)
    if (pipe.current) {
      const px = step === 1 ? lerp(1.8, 0, between(T, 0, 1.4)) - between(T, 3.4, 4.8) * 1.8 : step === 0 ? 3 : 3;
      const ty = step === 1 ? PIP_REST : 1.4;
      pipe.current.position.set(px, ty, 0);
      pipe.current.visible = step === 1;
    }
    if (drop.current) {
      let y = -9;
      let s = 0;
      if (step === 1) {
        const grow = between(T, 1.4, 2.0);
        const fall = between(T, 2.0, 2.4);
        s = grow * 0.075 * (T < 2.4 ? 1 : 0);
        y = lerp(PIP_REST - 0.02, SUB_TOP + 0.02, fall * fall);
      }
      drop.current.position.set(0, y, 0);
      drop.current.scale.setScalar(Math.max(1e-4, s));
    }

    // ── liquid flung off the edge (steps 2–4)
    if (fling.current) {
      const amount = step === 2 ? between(T, 1.0, 3.0) * (R > 0.9 ? 1 : 0.2) : step === 3 ? 1 - between(T, 4, 8) * 0.7 : step === 4 ? 0.3 * (1 - between(T, 0, 2)) : 0;
      const n = Math.round(N_FLING * amount * (0.35 + 0.65 * speed));
      for (let i = 0; i < N_FLING; i++) {
        if (i >= n) {
          fling.current.hide(i);
          continue;
        }
        const life = (T * (0.9 + 0.8 * speed) + hash1(i * 3.3)) % 1;
        const th0 = hash1(i * 7.1) * Math.PI * 2 + ang.current;
        const rad = 0.95 + life * 0.85;
        const a2 = th0 + life * 0.9 * (1 + speed);
        fling.current.set(i, Math.cos(a2) * rad, SUB_TOP - life * 0.3, Math.sin(a2) * rad, (1 - life * 0.5) * 0.9);
      }
      fling.current.flush();
    }

    // ── solvent particles (steps 3–5)
    if (solv.current) {
      const amount = step === 3 ? 0.15 * between(T, 5, 8) : step === 4 ? between(T, 0, 1.5) : step === 5 ? 1 - between(T, 0, 2.5) : 0;
      const n = Math.round(N_SOLV * amount);
      for (let i = 0; i < N_SOLV; i++) {
        if (i >= n) {
          solv.current.hide(i);
          continue;
        }
        const life = (T * 0.32 + hash1(i * 5.9)) % 1;
        const x = (hash1(i * 2.3) - 0.5) * 1.5 + Math.sin(T * 1.3 + i) * 0.04;
        const z = (hash1(i * 8.7) - 0.5) * 1.5 + Math.cos(T * 1.1 + i * 1.7) * 0.04;
        solv.current.set(i, x, SUB_TOP + 0.04 + life * 0.95, z, 1 - life * 0.6);
      }
      solv.current.flush();
    }

    // ── lattice bubble (step 5) and cross-section callout (step 6)
    asm.current = step === 5 ? between(T, 2.2, 5.0) : 0;
    if (bubble.current) bubble.current.scale.setScalar(Math.max(1e-4, step === 5 ? between(T, 2.0, 2.8) : 0));
    const s = sec.current;
    s.show = step === 6 ? between(T, 0.4, 1.4) : 0;
    s.h = 0.05 + 0.13 * thNow * (step >= 4 ? 0.65 : 1);
    s.cryst = cryst;
    filmColor(tmp, dry, cryst);
    s.color.copy(tmp);
  });

  return (
    <group>
      <Bench />
      {/* the spin coater */}
      <Cy p={[0, -0.5, 0]} rad={1.3} h={0.8} c={PAL.steelDark} metal={0.4} rough={0.5} />
      <mesh position={[0, -0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.07, 10, 56]} />
        <meshStandardMaterial color={PAL.steel} metalness={0.6} roughness={0.35} />
      </mesh>
      <Cy p={[0, -0.1, 0]} rad={1.16} h={0.02} c="#0e1318" />
      <Bx p={[0.78, -0.55, 1.31]} s={[0.5, 0.2, 0.04]} c="#10161c" rough={0.4} />
      <group ref={spinGrp}>
        <Cy p={[0, -0.03, 0]} rad={0.52} h={0.14} c={PAL.steel} metal={0.7} rough={0.3} />
        <Cy p={[0, -0.18, 0]} rad={0.12} h={0.3} c={PAL.steelDark} metal={0.6} />
        <group ref={subGrp}>
          <Bx p={[0, 0.075, 0]} s={[1.7, 0.07, 1.7]} c={PAL.glass} o={0.38} edge="#cfe9fb" rough={0.15} />
          <mesh position={[0, SUB_TOP + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat}>
            <planeGeometry args={[1.7, 1.7]} />
          </mesh>
        </group>
      </group>

      {/* pipette */}
      <group ref={pipe} position={[3, 1.4, 0]} visible={false}>
        <Cy p={[0, 0.5, 0]} rad={0.045} h={0.95} c="#d9eefb" o={0.4} rough={0.1} lo />
        <Cy p={[0, 0.02, 0]} rad={0.018} h={0.1} c="#d9eefb" o={0.55} lo />
        <Cy p={[0, 0.3, 0]} rad={0.04} h={0.4} c={PAL.ink} o={0.9} lo />
        <Sp p={[0, 1.08, 0]} rad={0.12} c="#7a2a2a" rough={0.7} />
      </group>
      <mesh ref={drop} position={[0, -9, 0]} scale={0.0001}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color={PAL.ink} roughness={0.15} transparent opacity={0.92} />
      </mesh>

      <Swarm ref={fling} count={N_FLING} color={PAL.ink} radius={0.035} halo={1.6} haloOpacity={0.14} emissive={0.5} />
      <Swarm ref={solv} count={N_SOLV} color={PAL.solvent} radius={0.03} halo={2} haloOpacity={0.16} emissive={1.1} />

      {/* thickness gauge: conceptual */}
      {showGauge ? (
        <group>
          <VGauge p={[-2.1, 0.45, 0.4]} h={1.2} value={gauge} />
          <StoryTag position={[-2.1, 1.2, 0.4]} kind="concept" minor>
            {LBL.thicker}
          </StoryTag>
          <StoryTag position={[-2.1, -0.2, 0.4]} kind="concept" minor>
            {LBL.thinner}
          </StoryTag>
          <StoryTag position={[-2.1, 0.45, 0.4]} kind="tiny" sub={LBL.illus}>
            {t("Độ dày", "Thickness")}
          </StoryTag>
        </group>
      ) : null}

      {/* radial flow arrows */}
      {showFlow ? (
        <group>
          {[0, 1, 2, 3].map((i) => {
            const a = (i * Math.PI) / 2 + Math.PI / 4;
            return <Arrow3 key={i} a={[Math.cos(a) * 0.3, 0.2, Math.sin(a) * 0.3]} b={[Math.cos(a) * 0.82, 0.2, Math.sin(a) * 0.82]} color={PAL.ink} head={0.06} />;
          })}
        </group>
      ) : null}

      {/* the lattice inside one grain */}
      <group ref={bubble} position={[0, 0.62, 0]} scale={0.0001}>
        <AssemblingLattice asm={asm} a={0.24} radii={{ A: 0.05, B: 0.036, X: 0.03 }} spread={0.6} />
      </group>
      {showGrain ? <Rod a={[0, 0.2, 0]} b={[0, 0.34, 0]} color="#b9c5d4" /> : null}

      {/* cross-section callout */}
      <SectionBlock p={[2.35, 0.4, 0]} w={1.3} d={0.55} glassH={0.55} state={sec} />
      {showSec ? <Rod a={[0.85, 0.12, 0]} b={[1.7, 0.45, 0]} color="#b9c5d4" /> : null}

      {/* labels */}
      {showIdle ? (
        <>
          <StoryTag position={[0.9, 0.22, 0.9]} kind="layer">
            {LBL.glass}
          </StoryTag>
          <StoryTag position={[-0.7, -0.12, 1.1]} kind="concept">
            {LBL.chuck}
          </StoryTag>
        </>
      ) : null}
      {showPip ? (
        <>
          <StoryTag position={[0.4, 1.35, 0]} kind="concept">
            {LBL.pipette}
          </StoryTag>
          <StoryTag position={[0.7, 0.28, 0.5]} kind="particle">
            {LBL.ink}
          </StoryTag>
        </>
      ) : null}
      {showFlow ? (
        <StoryTag position={[0, 0.55, 0.95]} kind="particle">
          {LBL.spread}
        </StoryTag>
      ) : null}
      {step === 3 ? (
        <StoryTag position={[0.1, 0.3, 1.0]} kind="layer">
          {LBL.wet}
        </StoryTag>
      ) : null}
      {showSolv ? (
        <StoryTag position={[0.5, 0.8, 0.6]} kind="particle">
          {LBL.solvent}
        </StoryTag>
      ) : null}
      {showGrain ? (
        <>
          <StoryTag position={[0.0, 1.05, 0]} kind="good">
            {LBL.lattice}
          </StoryTag>
          <StoryTag position={[0.5, 0.18, 0.55]} kind="good">
            {LBL.grains}
          </StoryTag>
          <StoryTag position={[-0.45, 0.18, -0.2]} kind="bad" minor>
            {LBL.gb}
          </StoryTag>
        </>
      ) : null}
      {showSec ? (
        <>
          <StoryTag position={[2.35, 0.95, 0.4]} kind="good">
            {LBL.film}
          </StoryTag>
          <StoryTag position={[2.35, 0.0, 0.4]} kind="layer">
            {LBL.sub}
          </StoryTag>
          <StoryTag position={[2.35, -0.45, 0.4]} kind="tiny">
            {LBL.scale}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
