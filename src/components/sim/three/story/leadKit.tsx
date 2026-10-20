import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Bx, PAL } from "./fabKit";
import { Flashes, Swarm, burst, type FlashApi, type SwarmApi } from "./storyKit";
import { hash1, lerp } from "./world";

/** What a module slab is doing right now. The scene writes it every frame; the slab only reads it. */
export type Scn = {
  /** Time inside the step (seconds), drives the particles. */
  T: number;
  rain: number;
  /** 0 = intact, 1 = fully cracked. */
  crack: number;
  /** 0..1: how much of the crack the self-healing polymer has closed. */
  healed: number;
  capture: boolean;
  heal: boolean;
  /** 0 = assembled, 1 = layers pulled apart. */
  explode: number;
  /** Seconds after which lead-containing species start to move. */
  leakAt: number;
};

export const newScn = (): Scn => ({ T: 0, rain: 0, crack: 0, healed: 0, capture: false, heal: false, explode: 0, leakAt: 0 });

export const SLAB_W = 3.4;
export const SLAB_D = 2.0;
const CX = 0.45;
const N_RAIN = 36;
const N_PB = 22;
const PB_COL = "#d9dde3";
const ESC_COL = "#ff5a47";
const BOUND_COL = "#79e0a0";

/** Layer centres at explode = 0, from the top. */
const Y = { glass: 0.5, enc: 0.34, dev: 0.2, cap: 0.08, rear: -0.06 };
const H = { glass: 0.14, enc: 0.08, dev: 0.1, cap: 0.06, rear: 0.14 };

/**
 * A perovskite module in cross-section-like 3D: front glass, encapsulant, the device, an optional lead-capture
 * layer, the rear barrier and the edge seal. Rain falls on it; through a crack, water reaches the device and
 * lead-containing species either escape (no capture) or are bound by the capture layer. Qualitative only.
 */
export function ModuleSlab({ scn, ground = -1.25 }: { scn: { current: Scn }; ground?: number }) {
  const g = {
    glass: useRef<THREE.Group>(null),
    enc: useRef<THREE.Group>(null),
    dev: useRef<THREE.Group>(null),
    cap: useRef<THREE.Group>(null),
    rear: useRef<THREE.Group>(null),
  };
  const crackMesh = useRef<THREE.Mesh>(null);
  const healMesh = useRef<THREE.Mesh>(null);
  const capMat = useRef<THREE.MeshStandardMaterial>(null);
  const encMat = useRef<THREE.MeshStandardMaterial>(null);
  const rain = useRef<SwarmApi>(null);
  const wet = useRef<SwarmApi>(null);
  const pb = useRef<SwarmApi>(null);
  const splash = useRef<FlashApi>(null);

  useFrame(() => {
    const s = scn.current;
    const T = s.T;
    const ex = s.explode;
    (Object.keys(g) as (keyof typeof g)[]).forEach((k, i) => {
      const grp = g[k].current;
      if (grp) grp.position.y = Y[k] + (4 - i) * 0.34 * ex - 0.0;
    });
    if (g.cap.current) g.cap.current.visible = s.capture;
    const eff = s.crack * (1 - 0.85 * s.healed);
    const cw = 0.05 + 0.26 * eff;
    if (crackMesh.current) {
      crackMesh.current.visible = s.crack > 0.02 && ex < 0.05;
      crackMesh.current.scale.set(cw, 0.34, SLAB_D * 0.92);
      crackMesh.current.position.set(CX, 0.42, 0);
    }
    if (healMesh.current) {
      healMesh.current.visible = s.heal && s.healed > 0.02 && s.crack > 0.02;
      healMesh.current.scale.set(0.05 + 0.22 * s.healed, 0.3, SLAB_D * 0.9);
      healMesh.current.position.set(CX, 0.42, 0);
    }
    if (capMat.current) capMat.current.emissiveIntensity = 0.3;
    if (encMat.current) encMat.current.emissiveIntensity = s.heal ? 0.12 : 0;

    // rain: drops fall onto the slab; some are aimed at the crack
    const rainOn = s.rain > 0.02 && ex < 0.05;
    for (let i = 0; i < N_RAIN; i++) {
      if (!rainOn) {
        rain.current?.hide(i);
        splash.current?.hide(i);
        continue;
      }
      const aimed = i % 3 === 0;
      const x = aimed ? CX + (hash1(i * 4.1) - 0.5) * 0.12 : (hash1(i * 2.7) - 0.5) * (SLAB_W - 0.3);
      const z = (hash1(i * 6.3) - 0.5) * (SLAB_D - 0.3);
      const period = 0.9 + hash1(i * 1.9) * 0.4;
      const life = ((T + hash1(i * 9.1)) % period) / period;
      const yTop = 0.6;
      const passes = aimed && eff > 0.22;
      const yEnd = passes ? Y.dev + 0.06 : yTop;
      const y = lerp(2.0, yEnd, Math.min(1, life * 1.15));
      const landed = life * 1.15 >= 1;
      if (landed && !passes) {
        rain.current?.hide(i);
        const b = burst(life * 1.15 - 1, 0, 0.12, 0.1);
        if (b) splash.current?.set(i, x, yTop, z, b.r, b.a);
        else splash.current?.hide(i);
      } else if (landed && passes) {
        rain.current?.set(i, x, yEnd, z, 0.0001);
        splash.current?.hide(i);
      } else {
        rain.current?.set(i, x, y, z, 1);
        splash.current?.hide(i);
      }
    }
    rain.current?.flush();
    splash.current?.flush();

    // water that got inside
    for (let i = 0; i < 14; i++) {
      const show = eff > 0.22 && rainOn;
      if (!show) {
        wet.current?.hide(i);
        continue;
      }
      const k = ((T * 0.25 + i / 14) % 1) * 0.8;
      wet.current?.set(i, CX + (hash1(i * 3.3) - 0.5) * 0.3 + Math.sin(T * 2 + i) * 0.05, lerp(Y.dev + 0.1, Y.dev - 0.02, k), (hash1(i * 5.9) - 0.5) * 1.2, 1);
    }
    wet.current?.flush();

    // lead-containing species
    for (let i = 0; i < N_PB; i++) {
      const bx = (hash1(i * 2.1) - 0.5) * (SLAB_W - 0.6);
      const bz = (hash1(i * 7.9) - 0.5) * (SLAB_D - 0.5);
      const by = Y.dev + (hash1(i * 4.3) - 0.5) * 0.04 + ex * (4 - 2) * 0.34;
      const open = eff > 0.22 && rainOn;
      const leave = open ? Math.min(1, Math.max(0, (T - s.leakAt - hash1(i * 5.3) * 3) / 3.2)) : 0;
      if (ex > 0.05 || leave <= 0) {
        pb.current?.set(i, bx, by, bz, 1);
        pb.current?.tint(i, PB_COL);
        continue;
      }
      if (s.capture) {
        // moves down to the capture layer and stays there, bound
        const yy = lerp(by, Y.cap + 0.04, Math.min(1, leave * 1.5));
        pb.current?.set(i, bx, yy, bz, 1);
        pb.current?.tint(i, leave > 0.7 ? BOUND_COL : PB_COL);
      } else {
        // drifts to the crack, then out and down to the ground
        const toCrack = Math.min(1, leave * 2);
        const out = Math.max(0, leave * 2 - 1);
        const x = lerp(bx, CX, toCrack) + out * (hash1(i * 8.3) - 0.5) * 0.8;
        const y = out > 0 ? lerp(Y.rear - 0.1, ground + 0.05, out) : by;
        const z = lerp(bz, 0, toCrack) + out * (hash1(i * 1.3) - 0.5) * 0.6;
        pb.current?.set(i, x, y, z, out > 0 ? 1.1 : 1);
        pb.current?.tint(i, out > 0 ? ESC_COL : PB_COL);
      }
    }
    pb.current?.flush();
  });

  return (
    <group>
      {/* layers */}
      <group ref={g.glass} position={[0, Y.glass, 0]}>
        <Bx s={[SLAB_W, H.glass, SLAB_D]} c="#a9d3f0" o={0.45} edge="#e3f2fd" rough={0.1} />
      </group>
      <group ref={g.enc} position={[0, Y.enc, 0]}>
        <mesh scale={[SLAB_W - 0.12, H.enc, SLAB_D - 0.12]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial ref={encMat} color="#f0e0a8" transparent opacity={0.42} emissive="#79e0a0" emissiveIntensity={0} depthWrite={false} />
        </mesh>
      </group>
      <group ref={g.dev} position={[0, Y.dev, 0]}>
        <Bx s={[SLAB_W - 0.2, H.dev, SLAB_D - 0.2]} c="#3a2a66" rough={0.5} metal={0.2} />
        <Bx p={[0, H.dev / 2 + 0.002, 0]} s={[SLAB_W - 0.2, 0.012, SLAB_D - 0.2]} c="#c9772e" emis="#c9772e" emisI={0.2} />
      </group>
      <group ref={g.cap} position={[0, Y.cap, 0]} visible={false}>
        <mesh scale={[SLAB_W - 0.2, H.cap, SLAB_D - 0.2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial ref={capMat} color="#5fd391" emissive="#5fd391" emissiveIntensity={0.3} transparent opacity={0.55} depthWrite={false} />
        </mesh>
      </group>
      <group ref={g.rear} position={[0, Y.rear, 0]}>
        <Bx s={[SLAB_W, H.rear, SLAB_D]} c="#9db0c2" o={0.75} edge="#d7e2ec" rough={0.3} />
      </group>
      {/* edge seal */}
      {[
        { p: [0, 0.22, SLAB_D / 2 - 0.03] as [number, number, number], s: [SLAB_W, 0.78, 0.07] as [number, number, number] },
        { p: [0, 0.22, -SLAB_D / 2 + 0.03] as [number, number, number], s: [SLAB_W, 0.78, 0.07] as [number, number, number] },
        { p: [SLAB_W / 2 - 0.03, 0.22, 0] as [number, number, number], s: [0.07, 0.78, SLAB_D] as [number, number, number] },
        { p: [-SLAB_W / 2 + 0.03, 0.22, 0] as [number, number, number], s: [0.07, 0.78, SLAB_D] as [number, number, number] },
      ].map((e, i) => (
        <mesh key={i} position={e.p} scale={e.s}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#46515c" roughness={0.6} transparent opacity={0.92} />
        </mesh>
      ))}
      <mesh ref={crackMesh} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#05080b" />
      </mesh>
      <mesh ref={healMesh} visible={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#79e0a0" emissive="#79e0a0" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
      <Swarm ref={rain} count={N_RAIN} color={PAL.water} radius={0.035} halo={1.8} haloOpacity={0.15} emissive={1.2} />
      <Flashes ref={splash} count={N_RAIN} color="#9fe8f4" />
      <Swarm ref={wet} count={14} color={PAL.water} radius={0.028} halo={1.6} haloOpacity={0.14} emissive={1} />
      <Swarm ref={pb} count={N_PB} color="#ffffff" radius={0.04} halo={1.8} haloOpacity={0.16} basic />
    </group>
  );
}

/** The ground the species fall on. */
export function Ground({ y = -1.25, w = 6, d = 3 }: { y?: number; w?: number; d?: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color="#1d2a22" roughness={1} />
    </mesh>
  );
}
