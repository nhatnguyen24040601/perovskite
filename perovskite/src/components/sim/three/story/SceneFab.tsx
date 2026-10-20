import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { L } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import {
  Arrow3,
  StoryTag,
  Swarm,
  stepDur,
  useGate,
  useStoryClock,
  type SwarmApi,
} from "./storyKit";
import { COLOR, between, clamp01, hash1, lerp, mix3, smooth, type V3 } from "./world";

/* ── layout of the bench ── */
const VIAL: V3 = [-2.3, -0.6, 0.2];
const STATION_X = 0.35;
const PLATE_X = 2.7;
const BENCH_Y = -0.6;
const SUB_Y = -0.37;
const STATION: V3 = [STATION_X, SUB_Y, 0];
const ON_PLATE: V3 = [PLATE_X, SUB_Y, 0];
const STACK_POS: V3 = [STATION_X, 0.5, 0];

const WET = new THREE.Color("#e3b448");
const DRYING = new THREE.Color("#8c4f23");
const DARK = new THREE.Color("#241a30");
const tmp = new THREE.Color();

function filmColor(k: number): THREE.Color {
  // amber → brown → near-black: the colour of a perovskite film as it forms
  if (k < 0.5) return tmp.copy(WET).lerp(DRYING, k * 2);
  return tmp.copy(DRYING).lerp(DARK, (k - 0.5) * 2);
}

/* ── micro view: crystal grains ── */
const GRID = 6;
const SEEDS = Array.from({ length: GRID * GRID }, (_, n) => {
  const i = n % GRID;
  const j = Math.floor(n / GRID);
  return {
    x: -0.4 + i * 0.16 + (hash1(n * 1.9) - 0.5) * 0.09,
    z: -0.4 + j * 0.16 + (hash1(n * 2.3 + 1) - 0.5) * 0.09,
    start: 0.2 + hash1(n * 3.1 + 2) * 2.1,
    r: 0.112 + hash1(n * 4.7 + 3) * 0.045,
    rot: hash1(n * 5.3 + 4) * Math.PI,
    shade: 0.8 + hash1(n * 6.1 + 5) * 0.45,
  };
});
const HEX = new THREE.CylinderGeometry(1, 1, 1, 6);
const GRAIN_BASE = new THREE.Color("#7a5688");
const GRAIN_END = new THREE.Color("#2f2139");

const N_ION = 12;
const N_DROP = 8;
const N_SOLV = 30;
const N_HEAT = 16;
const N_DOT = 42;
const N_SPRAY = 12;

export function FabScene({ step }: { step: number }) {
  const coating = useSim((s) => s.coating);
  const clock = useStoryClock(step, stepDur("ink", step), 2);

  const subRef = useRef<THREE.Group>(null);
  const filmRef = useRef<THREE.Mesh>(null);
  const filmMat = useRef<THREE.MeshStandardMaterial>(null);
  const chuckRef = useRef<THREE.Group>(null);
  const pipetteRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const curtainRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const plateGlow = useRef<THREE.MeshStandardMaterial>(null);
  const thermoFill = useRef<THREE.Mesh>(null);
  const grains = useRef<THREE.InstancedMesh>(null);
  const stackRef = useRef<THREE.Group>(null);
  const layerRefs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];

  const ions = [useRef<SwarmApi>(null), useRef<SwarmApi>(null), useRef<SwarmApi>(null)];
  const drops = useRef<SwarmApi>(null);
  const spray = useRef<SwarmApi>(null);
  const solvent = useRef<SwarmApi>(null);
  const heat = useRef<SwarmApi>(null);
  const dots = useRef<SwarmApi>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const m = grains.current;
    if (!m) return;
    SEEDS.forEach((s, i) => {
      color.copy(GRAIN_BASE).multiplyScalar(s.shade);
      m.setColorAt(i, color);
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [color]);

  useFrame(() => {
    const t = clock.current.t;
    const sub = subRef.current;
    const film = filmRef.current;
    const mat = filmMat.current;
    const dr = drops.current;
    const sp = spray.current;
    const so = solvent.current;
    const he = heat.current;
    const dt = dots.current;
    if (!sub || !film || !mat || !dr || !sp || !so || !he || !dt) return;

    // defaults: substrate at the coating station, no film, nothing in the air
    let subPos: V3 = STATION;
    let rotY = 0;
    let showSub = true;
    let fx = 0; // film size, as a fraction of the substrate
    let fz = 0;
    const fox = 0; // film offset from the substrate centre
    let foz = 0;
    const fth = 0.018;
    let fcol = 0;
    let fop = 0.92;
    let pip: V3 | null = null;
    let head: V3 | null = null;
    let headKind: "slot" | "ink" | null = null;
    let curtain = 0;
    let liquid = 0.68;
    let glow = 0;
    let fill = 0;
    for (let i = 0; i < N_DROP; i++) dr.hide(i);
    for (let i = 0; i < N_SPRAY; i++) sp.hide(i);
    for (let i = 0; i < N_SOLV; i++) so.hide(i);
    for (let i = 0; i < N_HEAT; i++) he.hide(i);
    for (let i = 0; i < N_DOT; i++) dt.hide(i);
    let drawGrains = false;
    let stackOn = false;

    const spinning = coating === "spin";

    if (step === 0) {
      // the dropper dips into the ink and comes back with a drop
      const down = between(t, 0.8, 2.0) - between(t, 3.2, 4.4);
      pip = [VIAL[0], 0.75 - 0.75 * down, VIAL[2]];
      liquid = 0.68 - 0.04 * between(t, 2.0, 3.0);
      if (t > 3.4) dr.set(0, VIAL[0], pip[1] - 0.06, VIAL[2], 1);
    } else if (step === 1) {
      if (spinning) {
        const drip = t < 2.2;
        pip = [STATION_X, 0.25, 0];
        if (t > 5.6) pip = [STATION_X, 0.25 + 1.0 * between(t, 5.6, 6.6), 0];
        if (drip) {
          for (let i = 0; i < 4; i++) {
            const lt = t - 0.5 - i * 0.45;
            if (lt >= 0 && lt < 0.4)
              dr.set(i, STATION_X, 0.2 - (0.2 - (SUB_Y + 0.04)) * (lt / 0.4), 0, 1);
          }
        }
        const spin = between(t, 1.6, 3.2);
        rotY = (t < 1.6 ? 0 : (t - 1.6) * (3 + spin * 14)) % (Math.PI * 2);
        const k = between(t, 2.0, 5.6);
        fx = fz = k;
        fcol = 0;
        // a few droplets fly off the edge while the ink spreads
        if (t > 2.4 && t < 6) {
          for (let i = 0; i < N_SPRAY; i++) {
            const life = (t * 0.9 + i / N_SPRAY) % 1;
            const a = i * 2.4 + t * 2;
            const r = 0.55 + life * 0.55;
            sp.set(
              i,
              STATION_X + Math.cos(a) * r,
              SUB_Y + 0.05 + life * 0.1,
              Math.sin(a) * r,
              (1 - life) * 0.7,
            );
          }
        }
        if (t > 5.6) {
          fx = fz = 1;
        }
      } else if (coating === "slot") {
        const hz = lerp(-0.85, 0.85, between(t, 1.0, 6.0));
        head = [STATION_X, SUB_Y + 0.2, hz];
        headKind = "slot";
        const cover = clamp01((hz + 0.5) / 1.0);
        fx = 1;
        fz = cover;
        foz = -0.5 + cover / 2;
        curtain = t > 1.0 && hz > -0.5 && hz < 0.52 ? 1 : 0;
        if (t > 6.2) head = [STATION_X, SUB_Y + 0.2 + 0.8 * between(t, 6.2, 7.2), 0.85];
      } else {
        // inkjet: three raster lines, a droplet per pass, then the dots merge
        const rows = [-0.34, 0, 0.34];
        const per = 1.5;
        const t0 = 0.8;
        const row = Math.min(2, Math.floor((t - t0) / per));
        const local = clamp01((t - t0 - row * per) / per);
        const dir = row % 2 === 0 ? 1 : -1;
        const hx = t < t0 ? -0.8 : t > t0 + 3 * per ? 0 : dir * lerp(-0.55, 0.55, local);
        head = [
          STATION_X + (t < t0 ? -0.8 : hx),
          SUB_Y + 0.2,
          t < t0 ? rows[0]! : t > t0 + 3 * per ? 0 : rows[row]!,
        ];
        headKind = "ink";
        let n = 0;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 7; c++) {
            const frac = r % 2 === 0 ? c / 6 : 1 - c / 6;
            const ts = t0 + r * per + frac * per;
            const age = t - ts;
            const x = STATION_X + (frac * 1.1 - 0.55);
            const z = rows[r]!;
            if (age >= 0) {
              const grow = smooth(age / 1.2);
              dt.set(n, x, SUB_Y + 0.045, z, 0.4 + grow * (1 + between(t, 5.4, 6.4) * 1.2));
              if (age < 0.22) dr.set(n % N_DROP, x, SUB_Y + 0.2 - (0.155 * age) / 0.22, z, 0.9);
            }
            n++;
          }
        }
        fx = fz = 1;
        fop = between(t, 5.2, 6.6) * 0.92;
        if (t > t0 + 3 * per) head = [STATION_X, SUB_Y + 0.2 + 0.8 * between(t, 5.6, 6.6), 0];
      }
    } else if (step === 2) {
      fx = fz = 1;
      fop = 0.92;
      fcol = 0;
    } else if (step === 3) {
      fx = fz = 1;
      fcol = between(t, 0.8, 6.0) * 0.55;
      for (let i = 0; i < N_SOLV; i++) {
        const life = (t * 0.45 + hash1(i * 1.7)) % 1;
        const a = hash1(i * 2.1) * 6.28;
        const r = Math.sqrt(hash1(i * 3.3)) * 0.46;
        const lift = 0.04 + life * 0.75;
        const fade = Math.sin(life * Math.PI);
        so.set(
          i,
          STATION_X + Math.cos(a) * r + Math.sin(t * 1.4 + i) * 0.03,
          SUB_Y + 0.05 + lift,
          Math.sin(a) * r,
          fade * (t > 0.4 ? 1 : 0),
        );
      }
    } else if (step === 4) {
      fx = fz = 1;
      fcol = 0.5 + between(t, 5.8, 8.0) * 0.5;
      fop = 1;
      drawGrains = true;
    } else if (step === 5) {
      const slide = between(t, 0.6, 2.6);
      subPos = mix3(STATION, ON_PLATE, slide);
      subPos = [subPos[0], SUB_Y + Math.sin(Math.PI * slide) * 0.08, 0];
      fx = fz = 1;
      fcol = 1;
      fop = 1;
      glow = between(t, 2.4, 3.8);
      fill = between(t, 2.4, 5.4);
      for (let i = 0; i < N_HEAT; i++) {
        const life = (t * 0.5 + hash1(i * 1.3)) % 1;
        he.set(
          i,
          PLATE_X + (hash1(i * 2.7) - 0.5) * 1.2,
          SUB_Y + 0.05 + life * 0.45,
          (hash1(i * 3.9) - 0.5) * 1.0,
          glow * Math.sin(life * Math.PI) * 0.9,
        );
      }
    } else {
      showSub = false;
      stackOn = true;
    }

    // ── apply: substrate and film ──
    sub.visible = showSub;
    sub.position.set(subPos[0], subPos[1], subPos[2]);
    sub.rotation.y = rotY;
    const fw = 0.98;
    film.visible = fx > 0.002 && fz > 0.002;
    film.scale.set(Math.max(0.001, fx * fw), fth, Math.max(0.001, fz * fw));
    film.position.set(fox * fw, 0.035 + fth / 2, foz * fw);
    mat.color.copy(filmColor(fcol));
    mat.emissive.copy(filmColor(fcol));
    mat.emissiveIntensity = 0.12 + (step === 2 ? 0.1 * Math.sin(t * 3) : 0);
    mat.opacity = fop;
    if (chuckRef.current) chuckRef.current.rotation.y = rotY;

    // ── pipette, die head, curtain ──
    if (pipetteRef.current) {
      pipetteRef.current.visible = pip !== null;
      if (pip) pipetteRef.current.position.set(pip[0], pip[1], pip[2]);
    }
    if (headRef.current) {
      headRef.current.visible = head !== null;
      if (head) headRef.current.position.set(head[0], head[1], head[2]);
    }
    if (curtainRef.current) {
      curtainRef.current.visible = curtain > 0 && headKind === "slot";
      if (head) curtainRef.current.position.set(STATION_X, SUB_Y + 0.115, head[2]);
    }
    if (liquidRef.current) {
      liquidRef.current.scale.y = liquid;
      liquidRef.current.position.y = BENCH_Y + 0.05 + liquid / 2;
    }
    if (plateGlow.current) {
      plateGlow.current.emissiveIntensity = glow * 1.4;
      plateGlow.current.opacity = 0.2 + glow * 0.7;
    }
    if (thermoFill.current) {
      thermoFill.current.scale.y = Math.max(0.001, fill * 0.52);
      thermoFill.current.position.y = -0.55 + (fill * 0.52) / 2;
    }

    // ── ions swirl in the ink ──
    ions.forEach((sw, k) => {
      const api = sw.current;
      if (!api) return;
      for (let i = 0; i < N_ION; i++) {
        const a =
          hash1(i * 7 + k * 31) * 6.28 + t * (0.6 + hash1(i + k) * 0.8) * (step === 0 ? 1 : 0.4);
        const r = 0.08 + hash1(i * 3 + k) * 0.2;
        const yy = 0.1 + hash1(i * 5 + k * 3) * 0.5 + Math.sin(t * 1.2 + i) * 0.04;
        api.set(
          i,
          VIAL[0] + Math.cos(a) * r,
          BENCH_Y + 0.05 + yy * liquid * 1.1,
          VIAL[2] + Math.sin(a) * r,
          1,
        );
      }
      api.flush();
    });

    // ── grains ──
    const gm = grains.current;
    if (gm) {
      for (let i = 0; i < SEEDS.length; i++) {
        const s = SEEDS[i]!;
        if (!drawGrains || t < s.start) {
          dummy.position.set(0, -50, 0);
          dummy.scale.setScalar(1e-4);
        } else {
          const g = between(t, 2.6, 6.4);
          const r = lerp(0.016, s.r, g);
          dummy.position.set(STATION_X + s.x, SUB_Y + 0.035 + fth + 0.006, s.z);
          dummy.scale.set(r, 0.012, r);
          dummy.rotation.y = s.rot;
        }
        dummy.updateMatrix();
        gm.setMatrixAt(i, dummy.matrix);
        dummy.rotation.y = 0;
        if (drawGrains) {
          color
            .copy(GRAIN_BASE)
            .lerp(GRAIN_END, between(t, 5.8, 8.0))
            .multiplyScalar(s.shade);
          gm.setColorAt(i, color);
        }
      }
      gm.instanceMatrix.needsUpdate = true;
      if (gm.instanceColor) gm.instanceColor.needsUpdate = true;
    }

    // ── the finished cell (steps 6 and 7 live in their own group) ──
    if (stackRef.current) stackRef.current.visible = stackOn;

    dr.flush();
    sp.flush();
    so.flush();
    he.flush();
    dt.flush();
  });

  const isSpin = coating === "spin";

  return (
    <group>
      {/* bench */}
      <mesh position={[0.4, BENCH_Y - 0.06, 0]}>
        <boxGeometry args={[8.6, 0.12, 3.4]} />
        <meshStandardMaterial color="#2a394a" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* ink vial */}
      <group position={VIAL}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.0, 24, 1, true]} />
          <meshStandardMaterial
            color="#cfe6f5"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.04, 24]} />
          <meshStandardMaterial color="#cfe6f5" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0.98, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.08, 20]} />
          <meshStandardMaterial color="#556270" />
        </mesh>
      </group>
      <mesh ref={liquidRef} position={[VIAL[0], BENCH_Y + 0.4, VIAL[2]]}>
        <cylinderGeometry args={[0.36, 0.36, 1, 24]} />
        <meshStandardMaterial
          color="#e4a23a"
          transparent
          opacity={0.42}
          emissive="#e4a23a"
          emissiveIntensity={0.15}
          depthWrite={false}
        />
      </mesh>
      <Swarm
        ref={ions[0]}
        count={N_ION}
        color={COLOR.B}
        radius={0.036}
        halo={1.6}
        haloOpacity={0.15}
      />
      <Swarm
        ref={ions[1]}
        count={N_ION}
        color={COLOR.iodide}
        radius={0.042}
        halo={1.6}
        haloOpacity={0.15}
      />
      <Swarm
        ref={ions[2]}
        count={N_ION}
        color={COLOR.A}
        radius={0.044}
        halo={1.6}
        haloOpacity={0.15}
      />

      {/* coating station */}
      {isSpin ? (
        <group position={[STATION_X, 0, 0]}>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.8, 0.86, 0.2, 32]} />
            <meshStandardMaterial color="#3b4d60" roughness={0.5} metalness={0.3} />
          </mesh>
          <group ref={chuckRef} position={[0, -0.395, 0]}>
            <mesh>
              <cylinderGeometry args={[0.55, 0.55, 0.03, 32]} />
              <meshStandardMaterial color="#8e9aa8" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0.45, 0.02, 0]}>
              <boxGeometry args={[0.08, 0.012, 0.03]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      ) : (
        <mesh position={[STATION_X, -0.5, 0]}>
          <boxGeometry args={[1.7, 0.2, 1.5]} />
          <meshStandardMaterial color="#3b4d60" roughness={0.5} metalness={0.3} />
        </mesh>
      )}

      {/* hot plate */}
      <group position={[PLATE_X, 0, 0]}>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[1.6, 0.2, 1.4]} />
          <meshStandardMaterial color="#3b4d60" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, -0.395, 0]}>
          <boxGeometry args={[1.5, 0.012, 1.3]} />
          <meshStandardMaterial
            ref={plateGlow}
            color="#ff7a33"
            emissive="#ff6a1f"
            emissiveIntensity={0}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
        {/* thermometer (only while the plate heats up) */}
        <group position={[-1.0, 0, -0.85]} visible={step === 5}>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
            <meshStandardMaterial color="#cfe6f5" transparent opacity={0.28} />
          </mesh>
          <mesh ref={thermoFill} position={[0, -0.55, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 1, 12]} />
            <meshBasicMaterial color="#ff5a47" />
          </mesh>
          <mesh position={[0, -0.57, 0]}>
            <sphereGeometry args={[0.07, 14, 10]} />
            <meshBasicMaterial color="#ff5a47" />
          </mesh>
          <mesh position={[0.07, 0.26, 0]}>
            <boxGeometry args={[0.12, 0.012, 0.012]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* substrate with its film */}
      <group ref={subRef} position={STATION}>
        <mesh>
          <boxGeometry args={[1.0, 0.04, 1.0]} />
          <meshStandardMaterial color="#9fc9e6" transparent opacity={0.55} />
        </mesh>
        <mesh position={[0, 0.0275, 0]}>
          <boxGeometry args={[1.0, 0.015, 1.0]} />
          <meshStandardMaterial color="#4d86d6" roughness={0.5} />
        </mesh>
        <mesh ref={filmRef} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            ref={filmMat}
            color="#e3b448"
            transparent
            opacity={0.92}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>

      <instancedMesh ref={grains} args={[HEX, undefined, SEEDS.length]} frustumCulled={false}>
        <meshStandardMaterial roughness={0.4} metalness={0.15} />
      </instancedMesh>

      {/* dropper, die head, print head */}
      <group ref={pipetteRef} visible={false}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.03, 0.02, 0.6, 10]} />
          <meshStandardMaterial color="#d9e3ec" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0.66, 0]}>
          <sphereGeometry args={[0.08, 14, 10]} />
          <meshStandardMaterial color="#c0453a" />
        </mesh>
      </group>
      <group ref={headRef} visible={false}>
        {headKindBox(coating)}
      </group>
      <mesh ref={curtainRef} visible={false}>
        <boxGeometry args={[0.96, 0.15, 0.025]} />
        <meshStandardMaterial
          color="#e4a23a"
          transparent
          opacity={0.75}
          emissive="#e4a23a"
          emissiveIntensity={0.3}
        />
      </mesh>

      <Swarm
        ref={drops}
        count={N_DROP}
        color="#f0b84a"
        radius={0.03}
        halo={1.8}
        haloOpacity={0.2}
      />
      <Swarm
        ref={spray}
        count={N_SPRAY}
        color="#f0b84a"
        radius={0.022}
        halo={1.6}
        haloOpacity={0.15}
      />
      <Swarm ref={dots} count={N_DOT} color="#e8b04a" radius={0.04} halo={1.4} haloOpacity={0.12} />
      <Swarm
        ref={solvent}
        count={N_SOLV}
        color="#bfe3ff"
        radius={0.024}
        halo={2.2}
        haloOpacity={0.2}
      />
      <Swarm
        ref={heat}
        count={N_HEAT}
        color="#ff9a4c"
        radius={0.024}
        halo={2.4}
        haloOpacity={0.22}
      />

      <group ref={stackRef} visible={false}>
        {step === 6 ? <Assembly clock={clock} layerRefs={layerRefs} /> : null}
        {step === 7 ? <BendingCell clock={clock} /> : null}
      </group>

      {/* labels */}
      <Labels step={step} clock={clock} coating={coating} />
    </group>
  );
}

function headKindBox(coating: string) {
  if (coating === "slot") {
    return (
      <>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[1.15, 0.2, 0.2]} />
          <meshStandardMaterial color="#7d8b99" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <boxGeometry args={[1.1, 0.04, 0.06]} />
          <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.4} />
        </mesh>
      </>
    );
  }
  return (
    <>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.22]} />
        <meshStandardMaterial color="#7d8b99" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.05, 0.08, 10]} />
        <meshStandardMaterial color="#e4a23a" />
      </mesh>
    </>
  );
}

/* ── step 6: layers go on and the cell is turned to face the Sun ── */
const LAYERS = [
  { h: 0.06, color: "#a9d3f0", opacity: 0.4 },
  { h: 0.035, color: "#4d86d6", opacity: 0.95 },
  { h: 0.05, color: "#2a1d36", opacity: 1 },
  { h: 0.05, color: "#c46a45", opacity: 0.95 },
  { h: 0.035, color: "#d7dde6", opacity: 1 },
];

function layerCenters(hs: number[]): number[] {
  const total = hs.reduce((a, b) => a + b, 0);
  let acc = -total / 2;
  return hs.map((h) => {
    const c = acc + h / 2;
    acc += h;
    return c;
  });
}

function Assembly({
  clock,
  layerRefs,
}: {
  clock: { current: { t: number } };
  layerRefs: React.RefObject<THREE.Mesh | null>[];
}) {
  const group = useRef<THREE.Group>(null);
  const hs = LAYERS.map((l) => l.h);
  const centers = layerCenters(hs);
  const lowerFrom: V3 = [PLATE_X, SUB_Y + 0.05, 0];
  useFrame(() => {
    const t = clock.current.t;
    const g = group.current;
    if (!g) return;
    const fly = between(t, 0.2, 1.8);
    const flip = between(t, 5.4, 7.2);
    const base = mix3(lowerFrom, STACK_POS, fly);
    g.position.set(
      base[0],
      base[1] + Math.sin(Math.PI * fly) * 0.3 + Math.sin(Math.PI * flip) * 0.35,
      0,
    );
    g.rotation.x = Math.PI * flip;
    const drop = [0, 0, 0, between(t, 2.2, 3.1), between(t, 3.5, 4.4)];
    for (let i = 0; i < 5; i++) {
      const m = layerRefs[i]?.current;
      if (!m) continue;
      const k = i < 3 ? 1 : drop[i]!;
      m.visible = i < 3 || t > (i === 3 ? 2.2 : 3.5) - 0.01;
      m.position.y = centers[i]! + (1 - k) * 0.9;
    }
  });
  const sun = useGate(() => clock.current.t > 7.4);
  const filmTag = useGate(() => clock.current.t > 1.9);
  const layerTags = useGate(() => clock.current.t > 4.6 && clock.current.t < 5.4);
  return (
    <group>
      <group ref={group}>
        {LAYERS.map((l, i) => (
          <mesh key={i} ref={layerRefs[i]} position={[0, centers[i], 0]}>
            <boxGeometry args={[1.0, l.h, 1.0]} />
            <meshStandardMaterial
              color={l.color}
              transparent={l.opacity < 1}
              opacity={l.opacity}
              roughness={0.4}
              metalness={i === 4 ? 0.6 : 0.1}
              emissive={l.color}
              emissiveIntensity={0.1}
            />
          </mesh>
        ))}
      </group>
      {filmTag ? (
        <StoryTag position={[STACK_POS[0] - 0.95, STACK_POS[1] + 0.12, 0.6]} kind="good">
          {L.thinFilm}
        </StoryTag>
      ) : null}
      {layerTags ? (
        <>
          <StoryTag position={[STACK_POS[0] + 1.1, STACK_POS[1] + 0.2, 0.5]} kind="layer" minor>
            {L.htlShort}
          </StoryTag>
          <StoryTag position={[STACK_POS[0] + 1.1, STACK_POS[1] - 0.15, 0.5]} kind="layer" minor>
            {L.electrode}
          </StoryTag>
          <StoryTag position={[STACK_POS[0] + 1.1, STACK_POS[1] - 0.45, 0.5]} kind="layer" minor>
            {L.etlShort}
          </StoryTag>
        </>
      ) : null}
      {sun ? (
        <>
          <Arrow3
            a={[STACK_POS[0], STACK_POS[1] + 1.35, 0]}
            b={[STACK_POS[0], STACK_POS[1] + 0.35, 0]}
            color={COLOR.photon}
          />
          <StoryTag position={[STACK_POS[0] + 0.7, STACK_POS[1] + 1.3, 0]} kind="particle" minor>
            {L.sunBadge}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}

/* ── step 7: the same cell on a plastic substrate, bending ── */
const FLEX_W = 1.7;
const FLEX_D = 1.1;
const FLEX_LAYERS = [
  { h: 0.03, color: "#bcd6e8", opacity: 0.55 },
  { h: 0.035, color: "#4d86d6", opacity: 0.95 },
  { h: 0.05, color: "#2a1d36", opacity: 1 },
  { h: 0.05, color: "#c46a45", opacity: 0.95 },
  { h: 0.035, color: "#d7dde6", opacity: 1 },
];

function BendingCell({ clock }: { clock: { current: { t: number } } }) {
  const hs = FLEX_LAYERS.map((l) => l.h);
  const centers = useMemo(() => layerCenters(hs).reverse(), [hs.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
  const geos = useMemo(
    () =>
      FLEX_LAYERS.map((l) => {
        const g = new THREE.BoxGeometry(FLEX_W, l.h, FLEX_D, 28, 1, 1);
        const base = Float32Array.from(g.attributes.position!.array as ArrayLike<number>);
        return { g, base };
      }),
    [],
  );
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = clock.current.t;
    const k =
      0.95 * (0.5 - 0.5 * Math.cos((2 * Math.PI * Math.max(0, t - 0.6)) / 7)) * smooth(t / 1.0);
    geos.forEach(({ g, base }, li) => {
      const pos = g.attributes.position!;
      const arr = pos.array as Float32Array;
      const yc = centers[li]!;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3]!;
        const y = base[i * 3 + 1]! + yc;
        const z = base[i * 3 + 2]!;
        if (k < 1e-4) {
          arr[i * 3] = x;
          arr[i * 3 + 1] = y - yc;
          arr[i * 3 + 2] = z;
          continue;
        }
        const R = 1 / k;
        const phi = x * k;
        const rr = R - y;
        arr[i * 3] = rr * Math.sin(phi);
        arr[i * 3 + 1] = R - rr * Math.cos(phi) - yc;
        arr[i * 3 + 2] = z;
      }
      pos.needsUpdate = true;
      g.computeVertexNormals();
    });
    group.current?.position.set(STACK_POS[0], STACK_POS[1], 0);
  });
  const tag = useGate(() => clock.current.t > 0.8);
  return (
    <group>
      <group ref={group} position={STACK_POS}>
        {FLEX_LAYERS.map((l, i) => (
          <mesh key={i} geometry={geos[i]!.g} position={[0, centers[i]!, 0]}>
            <meshStandardMaterial
              color={l.color}
              transparent={l.opacity < 1}
              opacity={l.opacity}
              roughness={0.4}
              metalness={i === 4 ? 0.6 : 0.1}
              emissive={l.color}
              emissiveIntensity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      <Arrow3
        a={[STACK_POS[0], STACK_POS[1] + 1.35, 0]}
        b={[STACK_POS[0], STACK_POS[1] + 0.6, 0]}
        color={COLOR.photon}
      />
      {tag ? (
        <StoryTag position={[STACK_POS[0] + 1.15, STACK_POS[1] + 0.32, 0.4]} kind="good">
          {L.flexible}
        </StoryTag>
      ) : null}
    </group>
  );
}

/* ── labels that follow the story ── */
function Labels({
  step,
  clock,
  coating,
}: {
  step: number;
  clock: { current: { t: number } };
  coating: string;
}) {
  const nuclei = useGate(() => step === 4 && clock.current.t < 2.6);
  const growth = useGate(() => step === 4 && clock.current.t >= 2.6 && clock.current.t < 6.4);
  const film = useGate(() => step === 4 && clock.current.t >= 6.4);
  const plateTags = useGate(() => step === 5 && clock.current.t > 2.2);
  const coatName = coating === "spin" ? L.spinName : coating === "slot" ? L.slotName : L.inkjetName;
  return (
    <>
      {step === 0 ? (
        <>
          <StoryTag position={[VIAL[0], 1.25, VIAL[2]]} kind="good">
            {L.ink}
          </StoryTag>
          <StoryTag position={[VIAL[0] - 0.75, -0.35, VIAL[2] + 0.2]} kind="tiny" minor>
            {L.ions}
          </StoryTag>
        </>
      ) : null}
      {step === 1 ? (
        <StoryTag position={[STATION_X, 0.55, 0]} kind="concept" sub={coatName}>
          {L.coating}
        </StoryTag>
      ) : null}
      {step === 2 ? (
        <StoryTag position={[STATION_X, 0.2, 0]} kind="good">
          {L.wetFilm}
        </StoryTag>
      ) : null}
      {step === 3 ? (
        <StoryTag position={[STATION_X + 1.15, 0.55, 0]} kind="concept">
          {L.solvent}
        </StoryTag>
      ) : null}
      {nuclei ? (
        <StoryTag position={[STATION_X, 0.15, 0.5]} kind="concept">
          {L.nuclei}
        </StoryTag>
      ) : null}
      {growth ? (
        <StoryTag position={[STATION_X, 0.15, 0.5]} kind="concept">
          {L.crystalGrowth}
        </StoryTag>
      ) : null}
      {film ? (
        <StoryTag position={[STATION_X, 0.15, 0.5]} kind="good">
          {L.thinFilm}
        </StoryTag>
      ) : null}
      {step === 5 ? (
        <>
          <StoryTag position={[PLATE_X, 0.7, 0]} kind="good" sub={plateTags ? L.temp : undefined}>
            {L.lowTemp}
          </StoryTag>
          <StoryTag position={[PLATE_X, -0.9, 0.5]} kind="tiny" minor>
            {L.hotPlate}
          </StoryTag>
        </>
      ) : null}
    </>
  );
}
