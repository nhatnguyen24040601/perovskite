import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { Bench, Bx, Cy, PAL, Tube, useGrainTexture, num } from "./fabKit";
import { Arrow3, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { along, between, clamp01, hash1, lerp, pathLength, type V3 } from "./world";

const LBL = {
  tank: t("Bình chứa mực", "Ink reservoir"),
  ink: t("Mực tiền chất perovskite", "Perovskite precursor ink"),
  pump: t("Bơm", "Pump"),
  feed: t("Ống dẫn mực", "Feed line"),
  die: t("Đầu phủ khe (slot-die)", "Slot-die head"),
  manifold: t("Khoang phân phối", "Manifold"),
  slit: t("Khe hẹp", "Narrow slot"),
  bead: t("Cầu mực (meniscus)", "Coating bead (meniscus)"),
  gap: t("Khe đầu phủ – đế (minh họa)", "Die-to-substrate gap (illustrative)"),
  web: t("Đế chuyển động", "Moving substrate"),
  wet: t("Màng ướt liên tục", "Continuous wet film"),
  stable: t("Cầu mực ổn định → lớp phủ đều (khái niệm)", "Stable bead → even coating (conceptual)"),
  starved: t("Thiếu mực: cầu mực đứt, màng mỏng, có vệt (khái niệm)", "Starved: bead breaks, thin film, streaks (conceptual)"),
  flooded: t("Thừa mực: màng dày, mực tràn ngược (khái niệm)", "Flooded: thick film, ink overflows upstream (conceptual)"),
  dryer: t("Vùng sấy", "Drying zone"),
  solvent: t("Dung môi bay đi", "Solvent leaves"),
  cryst: t("Màng perovskite tinh thể", "Crystalline perovskite film"),
  grains: t("Hạt tinh thể", "Crystal grains"),
  unwind: t("Cuộn nhả đế", "Unwind roll"),
  rewind: t("Cuộn thu đế", "Rewind roll"),
  coat: t("Trạm phủ", "Coating station"),
  drying: t("Trạm sấy", "Drying station"),
  roller: t("Con lăn", "Rollers"),
  webSub: t("Đế dạng cuộn (web)", "Web substrate"),
};

const WEB_Y = 0.3;
const DIE_X = -1.0;
const FILM_L = 5.0;
const N_FLOW = 26;
const N_SOL = 46;
const N_MARK = 18;
const PIPE: V3[] = [
  [-3.0, 1.72, 0],
  [-3.0, 1.45, 0],
  [-2.0, 1.45, 0],
  [-1.0, 1.45, 0],
  [-1.0, 1.15, 0],
];
const PIPE_LEN = pathLength(PIPE);

const VERT = /* glsl */ `
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */ `
varying vec3 vW;
uniform float uFront, uOff, uT, uState, uXd, uThick;
uniform sampler2D uGrain;
uniform vec3 uInk, uDryC, uDarkC;
void main() {
  float x = vW.x;
  float z = vW.z;
  if (x < uXd || x > uXd + uFront) discard;
  if (uState > 0.5 && uState < 1.5 && sin(z * 9.0 + 1.3 * sin(z * 3.1)) > 0.7) discard;
  float dry = smoothstep(0.3, 1.7, x);
  float cr = smoothstep(1.8, 2.3, x);
  vec3 c = mix(uInk, uDryC, dry);
  c *= 0.92 + 0.1 * sin((x - uOff) * 9.0 + z * 2.0) * (1.0 - dry);
  vec3 g = texture2D(uGrain, vec2((x - uOff) * 0.7, z * 0.7)).rgb;
  c = mix(c, mix(uDarkC, g, 0.92), cr);
  float alpha = mix(0.6 + 0.35 * uThick, 0.98, dry);
  gl_FragColor = vec4(c, alpha);
  #include <colorspace_fragment>
}`;

export function SlotScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("slot", step), 2);
  const die = useRef<THREE.Group>(null);
  const manifold = useRef<THREE.Mesh>(null);
  const slit = useRef<THREE.Mesh>(null);
  const bead = useRef<THREE.Group>(null);
  const puddle = useRef<THREE.Mesh>(null);
  const flowPts = useRef<SwarmApi>(null);
  const solv = useRef<SwarmApi>(null);
  const gear = useRef<THREE.Group>(null);
  const unwind = useRef<THREE.Group>(null);
  const rewind = useRef<THREE.Group>(null);
  const marks = useRef<THREE.InstancedMesh>(null);
  const gapBar = useRef<THREE.Mesh>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const webDist = useRef(0);
  const lastT = useRef(0);
  const state = useRef(0);
  const tex = useGrainTexture(61, 12);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lampMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#401812", emissive: PAL.hot, emissiveIntensity: 0.1 }), []);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uFront: { value: 0 },
          uOff: { value: 0 },
          uT: { value: 0 },
          uState: { value: 0 },
          uXd: { value: DIE_X },
          uThick: { value: 0.4 },
          uGrain: { value: tex },
          uInk: { value: new THREE.Color(PAL.ink) },
          uDryC: { value: new THREE.Color(PAL.drying) },
          uDarkC: { value: new THREE.Color(PAL.dark) },
        },
      }),
    [tex],
  );

  const g0 = useGate(() => step === 0);
  const g1 = useGate(() => step === 1 && clock.current.t > 1);
  const g2 = useGate(() => step === 2 && clock.current.t > 2);
  const gStable = useGate(() => (step === 3 || step === 2) && state.current === 0 && clock.current.t > 2.5);
  const gStarved = useGate(() => (step === 3 || step === 2) && state.current === 1 && clock.current.t > 2.5);
  const gFlooded = useGate(() => (step === 3 || step === 2) && state.current === 2 && clock.current.t > 2.5);
  const g3 = useGate(() => step === 3 && clock.current.t > 1.5);
  const g4 = useGate(() => step === 4 && clock.current.t > 1);
  const g5 = useGate(() => step === 5 && clock.current.t > 1);
  const g6 = useGate(() => step === 6);

  useFrame(() => {
    const T = clock.current.t;
    const dt = T - lastT.current;
    lastT.current = T;
    const f = useSim.getState().fab;
    const speed = num(f, "speed", 0.5);
    const flow = num(f, "flow", 0.5);
    const gapN = num(f, "gap", 0.5);
    const g = 0.04 + 0.2 * gapN;
    const vNorm = step >= 3 ? speed : 0.5;
    const ratio = flow / (vNorm * (0.4 + gapN) * 1.1 + 0.001);
    const st = ratio < 0.78 ? 1 : ratio > 1.3 ? 2 : 0;
    state.current = st;

    // ── web motion
    const v = (step < 3 ? 0 : step === 3 ? between(T, 0, 1.5) : 1) * lerp(0.3, 1.3, speed);
    if (dt > 0 && dt < 0.3) webDist.current += v * dt;
    const wd = webDist.current;
    if (marks.current) {
      for (let i = 0; i < N_MARK; i++) {
        const x = ((((i * 0.4 + wd) % (N_MARK * 0.4)) + N_MARK * 0.4) % (N_MARK * 0.4)) - 3.6;
        dummy.position.set(x, WEB_Y + 0.004, 0);
        dummy.scale.set(0.02, 0.006, 1.5);
        dummy.updateMatrix();
        marks.current.setMatrixAt(i, dummy.matrix);
      }
      marks.current.instanceMatrix.needsUpdate = true;
    }
    if (unwind.current) unwind.current.rotation.z = -wd / 0.6;
    if (rewind.current) rewind.current.rotation.z = -wd / 0.4;

    // ── die height (the gap) and ink in the die
    if (die.current) die.current.position.y = WEB_Y + g;
    const fill = step === 0 ? 0 : step === 1 ? between(T, 2.5, 6.0) : 1;
    if (manifold.current) {
      manifold.current.visible = fill > 0.02;
      manifold.current.scale.set(0.28 * Math.max(0.05, fill), 1.4, 0.28 * Math.max(0.05, fill));
    }
    if (slit.current) {
      const open = step === 1 ? between(T, 5.0, 6.5) : step >= 2 ? 1 : 0;
      slit.current.visible = open > 0.02;
      slit.current.scale.set(0.03, 0.3 * open, 1.4);
    }
    if (gapBar.current) {
      gapBar.current.visible = step === 2 || step === 3;
      gapBar.current.scale.set(0.012, g, 0.012);
      gapBar.current.position.set(DIE_X + 0.2, WEB_Y + g / 2, 0.8);
    }

    // ── bead: shape depends on the balance of flow, speed and gap (conceptual)
    if (bead.current) {
      const grow = step === 2 ? between(T, 1.0, 3.2) : step >= 3 ? 1 : 0;
      bead.current.visible = grow > 0.02;
      bead.current.position.set(DIE_X + 0.01, WEB_Y + g * 0.5, 0);
      bead.current.children.forEach((c, i) => {
        const segLen = 0.3;
        const flick = st === 1 ? 0.35 + 0.65 * Math.max(0, Math.sin(T * 6 + i * 2.1)) : 1;
        const big = st === 2 ? 1.5 : 1;
        const gone = st === 1 && (i === 1 || i === 3) ? 0.25 : 1;
        c.position.set(0, 0, (i - 2) * segLen);
        c.scale.set(0.12 * big * grow, (g * 0.6 + 0.03) * big * grow, segLen * 0.6 * flick * gone);
      });
    }
    if (puddle.current) {
      const flood = st === 2 && step >= 2 ? between(T, 1.5, 5) : 0;
      puddle.current.visible = flood > 0.02;
      puddle.current.scale.set(0.15 + 0.3 * flood, 1, 1.2);
      puddle.current.position.set(DIE_X - 0.22 - 0.1 * flood, WEB_Y + 0.006, 0);
    }
    const ledOn = st === 0 ? "#5be38a" : st === 1 ? "#e4a23a" : "#ff5a47";
    if (led.current) {
      led.current.color.set(ledOn);
      led.current.emissive.set(ledOn);
      led.current.emissiveIntensity = step >= 2 ? 1.3 : 0;
    }

    // ── film
    const u = mat.uniforms;
    u.uFront!.value = step < 3 ? 0 : step === 3 ? Math.min(FILM_L, 1.2 * lerp(0.3, 1.3, speed) * Math.max(0, T - 0.75) + 0.2) : FILM_L;
    u.uOff!.value = wd;
    u.uT!.value = T;
    u.uState!.value = st;
    u.uThick!.value = clamp01((flow / (speed * 0.9 + 0.25)) * 0.5);

    // ── flowing ink in the pipe
    if (flowPts.current) {
      const speedP = lerp(0.12, 0.3, flow);
      const active = step === 0 ? 0 : step === 1 ? between(T, 0.5, 2.0) : 1;
      for (let i = 0; i < N_FLOW; i++) {
        if (active < 0.02) {
          flowPts.current.hide(i);
          continue;
        }
        const life = (i / N_FLOW + T * speedP) % 1;
        const p = along(PIPE, life, PIPE_LEN);
        flowPts.current.set(i, p[0], p[1], p[2], 1);
      }
      flowPts.current.flush();
    }
    if (gear.current) gear.current.rotation.z = (step === 0 ? 0 : 1) * T * lerp(1.5, 5, flow);
    lampMat.emissiveIntensity = step >= 4 ? 0.2 + 1.2 * between(T, 0, 1.5) : step >= 3 ? 0.5 : 0.1;

    // ── solvent in the dryer
    if (solv.current) {
      const amt = step === 3 ? between(T, 4, 8) : step >= 4 ? 1 : 0;
      const n = Math.round(N_SOL * amt);
      for (let i = 0; i < N_SOL; i++) {
        if (i >= n) {
          solv.current.hide(i);
          continue;
        }
        const life = (T * 0.34 + hash1(i * 5.9)) % 1;
        solv.current.set(i, 0.5 + hash1(i * 2.3) * 1.7, WEB_Y + 0.05 + life * 0.75, (hash1(i * 8.7) - 0.5) * 1.3, 1 - life * 0.6);
      }
      solv.current.flush();
    }
  });

  return (
    <group>
      <Bench y={-0.45} w={11} d={4} />
      {/* web substrate and rollers */}
      <Bx p={[0, WEB_Y - 0.016, 0]} s={[7.2, 0.03, 1.6]} c="#56697a" metal={0.3} rough={0.5} o={0.96} />
      <instancedMesh ref={marks} args={[undefined, undefined, N_MARK]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#c5ccd6" transparent opacity={0.35} />
      </instancedMesh>
      <mesh position={[0, WEB_Y + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mat}>
        <planeGeometry args={[FILM_L + 4, 1.4]} />
      </mesh>
      {[-2.4, 0.2, 1.4, 2.4].map((x) => (
        <Cy key={x} p={[x, WEB_Y - 0.17, 0]} rad={0.14} h={1.8} r={[Math.PI / 2, 0, 0]} c={PAL.steel} metal={0.7} rough={0.35} lo />
      ))}
      <Cy p={[DIE_X, WEB_Y - 0.28, 0]} rad={0.28} h={1.8} r={[Math.PI / 2, 0, 0]} c="#c9d1da" metal={0.8} rough={0.25} />
      <group ref={unwind} position={[-3.7, WEB_Y - 0.55, 0]}>
        <Cy rad={0.6} h={1.7} r={[Math.PI / 2, 0, 0]} c="#6a7d8e" metal={0.2} rough={0.6} />
        <Bx p={[0.45, 0, 0.86]} s={[0.12, 0.03, 0.02]} c="#ffd27a" />
      </group>
      <group ref={rewind} position={[3.7, WEB_Y - 0.4, 0]}>
        <Cy rad={0.4} h={1.7} r={[Math.PI / 2, 0, 0]} c="#6a7d8e" metal={0.2} rough={0.6} />
        <Bx p={[0.3, 0, 0.86]} s={[0.12, 0.03, 0.02]} c="#ffd27a" />
      </group>

      {/* ink reservoir, pump and feed line */}
      <Cy p={[-3.0, 2.2, 0]} rad={0.5} h={0.95} c="#cfe9fb" o={0.2} rough={0.1} />
      <Cy p={[-3.0, 2.05, 0]} rad={0.46} h={0.62} c={PAL.ink} o={0.75} rough={0.15} />
      <Cy p={[-3.0, 2.72, 0]} rad={0.52} h={0.06} c={PAL.steelDark} metal={0.5} />
      <Bx p={[-2.0, 1.45, 0]} s={[0.55, 0.5, 0.5]} c={PAL.steelDark} metal={0.5} rough={0.5} />
      <group ref={gear} position={[-2.0, 1.45, 0.27]}>
        <Cy rad={0.15} h={0.04} r={[Math.PI / 2, 0, 0]} c="#c9d1da" metal={0.8} lo />
        <Bx s={[0.3, 0.04, 0.03]} c={PAL.hot} />
      </group>
      {PIPE.slice(1).map((p, i) => (
        <Tube key={i} a={PIPE[i]!} b={p} rad={0.05} c={PAL.steel} o={0.55} />
      ))}
      <Swarm ref={flowPts} count={N_FLOW} color={PAL.ink} radius={0.035} halo={1.6} haloOpacity={0.16} emissive={0.9} />

      {/* slot-die head */}
      <group ref={die} position={[DIE_X, WEB_Y + 0.12, 0]}>
        <mesh position={[0, 0.11, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 1.67]}>
          <cylinderGeometry args={[0.64, 0.18, 0.22, 4]} />
          <meshStandardMaterial color={PAL.steel} metalness={0.8} roughness={0.28} />
        </mesh>
        <Bx p={[0, 0.5, 0]} s={[0.9, 0.56, 1.5]} c={PAL.steel} metal={0.75} rough={0.3} o={0.42} edge="#dfe6ee" />
        <mesh ref={manifold} position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} visible={false}>
          <cylinderGeometry args={[1, 1, 1, 18]} />
          <meshStandardMaterial color={PAL.ink} emissive={PAL.ink} emissiveIntensity={0.4} transparent opacity={0.9} />
        </mesh>
        <mesh ref={slit} position={[0, 0.17, 0]} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={PAL.ink} emissive={PAL.ink} emissiveIntensity={0.5} />
        </mesh>
        <Bx p={[0, 0.84, 0]} s={[0.32, 0.12, 0.32]} c={PAL.steelDark} metal={0.6} />
        <mesh position={[0.44, 0.62, 0.76]}>
          <sphereGeometry args={[0.04, 10, 8]} />
          <meshStandardMaterial ref={led} color="#5be38a" emissive="#5be38a" emissiveIntensity={0} />
        </mesh>
      </group>
      <group ref={bead} position={[DIE_X, WEB_Y + 0.06, 0]} visible={false}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial color={PAL.ink} roughness={0.1} transparent opacity={0.95} />
          </mesh>
        ))}
      </group>
      <mesh ref={puddle} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color={PAL.ink} roughness={0.1} transparent opacity={0.9} />
      </mesh>
      <mesh ref={gapBar} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#e4a23a" />
      </mesh>

      {/* drying zone */}
      <group position={[1.4, 0, 0]}>
        <Bx p={[0, WEB_Y + 0.98, 0]} s={[2.0, 0.14, 1.9]} c={PAL.steelDark} metal={0.5} rough={0.5} />
        {[-0.95, 0.95].map((x) =>
          [-0.9, 0.9].map((z) => <Bx key={`${x}${z}`} p={[x, WEB_Y + 0.5, z]} s={[0.07, 1.0, 0.07]} c={PAL.steel} metal={0.6} />),
        )}
        {[-0.6, 0, 0.6].map((x) => (
          <mesh key={x} position={[x, WEB_Y + 0.88, 0]} material={lampMat}>
            <boxGeometry args={[0.1, 0.05, 1.5]} />
          </mesh>
        ))}
        <Bx p={[0, WEB_Y + 0.03, 0]} s={[2.0, 0.02, 1.9]} c="#2a2f36" o={0.5} />
      </group>
      <Swarm ref={solv} count={N_SOL} color={PAL.solvent} radius={0.03} halo={2} haloOpacity={0.16} emissive={1.1} />

      {/* labels */}
      {g0 ? (
        <>
          <StoryTag position={[-3.0, 2.95, 0.3]} kind="layer">
            {LBL.tank}
          </StoryTag>
          <StoryTag position={[-3.0, 1.8, 0.7]} kind="particle" minor>
            {LBL.ink}
          </StoryTag>
        </>
      ) : null}
      {g1 ? (
        <>
          <StoryTag position={[-2.0, 1.9, 0.3]} kind="concept">
            {LBL.pump}
          </StoryTag>
          <StoryTag position={[-2.5, 1.3, 0.2]} kind="particle" minor>
            {LBL.feed}
          </StoryTag>
          <StoryTag position={[-1.0, 1.95, 0.3]} kind="layer">
            {LBL.die}
          </StoryTag>
        </>
      ) : null}
      {g2 ? (
        <>
          <StoryTag position={[-1.5, WEB_Y + 0.7, 0.8]} kind="layer" minor>
            {LBL.manifold}
          </StoryTag>
          <StoryTag position={[-0.45, WEB_Y + 0.12, 0.8]} kind="tiny" sub={LBL.gap}>
            {LBL.slit}
          </StoryTag>
          <StoryTag position={[-1.6, WEB_Y - 0.05, 0.8]} kind="particle">
            {LBL.bead}
          </StoryTag>
        </>
      ) : null}
      {gStable ? (
        <StoryTag position={[-1.0, 0.0, 1.0]} kind="good">
          {LBL.stable}
        </StoryTag>
      ) : null}
      {gStarved ? (
        <StoryTag position={[-1.0, 0.0, 1.0]} kind="bad">
          {LBL.starved}
        </StoryTag>
      ) : null}
      {gFlooded ? (
        <StoryTag position={[-1.0, 0.0, 1.0]} kind="bad">
          {LBL.flooded}
        </StoryTag>
      ) : null}
      {g3 ? (
        <>
          <StoryTag position={[-2.3, WEB_Y + 0.15, 0.95]} kind="concept" minor>
            {LBL.web}
          </StoryTag>
          <StoryTag position={[0.1, WEB_Y + 0.1, 0.95]} kind="layer">
            {LBL.wet}
          </StoryTag>
        </>
      ) : null}
      {g4 ? (
        <>
          <StoryTag position={[1.4, 1.75, 0.2]} kind="concept">
            {LBL.dryer}
          </StoryTag>
          <StoryTag position={[1.2, WEB_Y + 0.55, 0.8]} kind="particle">
            {LBL.solvent}
          </StoryTag>
        </>
      ) : null}
      {g5 ? (
        <>
          <StoryTag position={[2.55, WEB_Y + 0.15, 0.9]} kind="good">
            {LBL.cryst}
          </StoryTag>
          <StoryTag position={[2.9, WEB_Y + 0.05, -0.2]} kind="bad" minor>
            {LBL.grains}
          </StoryTag>
        </>
      ) : null}
      {g6 ? (
        <>
          <StoryTag position={[-3.7, 1.0, 0.9]} kind="concept">
            {LBL.unwind}
          </StoryTag>
          <StoryTag position={[-1.0, 1.95, 0.3]} kind="layer">
            {LBL.coat}
          </StoryTag>
          <StoryTag position={[1.4, 1.75, 0.2]} kind="layer">
            {LBL.drying}
          </StoryTag>
          <StoryTag position={[3.7, 0.9, 0.9]} kind="concept">
            {LBL.rewind}
          </StoryTag>
          <StoryTag position={[0.2, 0.0, 1.0]} kind="tiny" minor>
            {LBL.roller}
          </StoryTag>
          <StoryTag position={[-2.0, WEB_Y + 0.15, 0.95]} kind="layer" minor>
            {LBL.webSub}
          </StoryTag>
          <Arrow3 a={[-3.0, WEB_Y + 0.4, 0.95]} b={[-2.2, WEB_Y + 0.4, 0.95]} color="#e4a23a" head={0.05} />
        </>
      ) : null}
    </group>
  );
}
