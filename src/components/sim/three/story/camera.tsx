import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useSim } from "@/lib/sim/store";
import { smooth, type V3 } from "./world";

export type Pose = { pos: V3; target: V3 };

/**
 * Three camera levels per section — 1 the whole cell, 2 the perovskite layer, 3 the atoms —
 * plus a few named framings that single steps ask for.
 */
const CELL: Record<string, Pose> = {
  "1": { pos: [3.8, 2.0, 6.4], target: [0.35, 0.25, 0] },
  "2": { pos: [2.1, 0.55, 5.2], target: [0, 0, 0] },
  "3": { pos: [0.9, 0.45, 2.0], target: [0, 0, 0.1] },
  wide: { pos: [4.4, 1.1, 7.4], target: [0, -0.5, 0] },
  mid: { pos: [1.7, 0.6, 4.3], target: [0, 0, 0.05] },
};

export const POSES: Record<string, Record<string, Pose>> = {
  absorb: CELL,
  diffusion: { ...CELL, "2": { pos: [1.9, 0.5, 4.9], target: [0, -0.3, 0] } },
  exciton: {
    ...CELL,
    "1": { pos: [4.0, 1.7, 6.9], target: [0.7, 0.1, 0] },
    "3": { pos: [0.9, 0.45, 2.0], target: [0, 0.02, 0.18] },
  },
  defects: CELL,
  tune: {
    "1": { pos: [0.1, 0.3, 8.0], target: [0.05, 0.0, 0] },
    "2": { pos: [0.1, 0.15, 6.1], target: [0.05, -0.05, 0] },
    "3": { pos: [-0.3, 0.9, 3.0], target: [-1.05, 0.4, 0] },
    tandem: { pos: [2.6, 1.2, 5.2], target: [0, 0.45, 0] },
  },
  ink: {
    "1": { pos: [0.4, 2.3, 8.4], target: [0.2, -0.2, 0] },
    "2": { pos: [1.4, 1.0, 3.6], target: [0.4, -0.3, 0] },
    "3": { pos: [0.5, 0.85, 1.05], target: [0.35, -0.36, 0] },
    stack: { pos: [2.6, 1.2, 3.8], target: [0.35, 0.4, 0] },
  },
  recap: {
    "1": { pos: [4.2, 1.9, 7.4], target: [0.6, 0.5, 0] },
    "2": { pos: [2.0, 0.9, 4.6], target: [0, 0, 0] },
    "3": { pos: [0.9, 0.6, 1.9], target: [0, 0, 0.1] },
  },
};

export function poseFor(scene: string, cam: string): Pose {
  const set = POSES[scene] ?? CELL;
  return set[cam] ?? set["1"] ?? CELL["1"]!;
}

type Orbit = { target: THREE.Vector3; update: () => void; enabled: boolean };

/** Glides the camera to the pose of the current step. Never jumps, and gives control back when it arrives. */
export function StoryRig({ scene, cam }: { scene: string; cam: string }) {
  const { camera, controls } = useThree();
  const replay = useSim((s) => s.replay);
  const applied = useRef("");
  const move = useRef<{
    k: number;
    fromP: THREE.Vector3;
    fromT: THREE.Vector3;
    toP: THREE.Vector3;
    toT: THREE.Vector3;
  } | null>(null);

  useFrame((_, dtRaw) => {
    const orbit = controls as unknown as Orbit | null;
    if (!orbit?.target) return;
    const goal = `${scene}|${cam}|${replay}`;
    if (applied.current !== goal) {
      const pose = poseFor(scene, cam);
      const toP = new THREE.Vector3(...pose.pos);
      const toT = new THREE.Vector3(...pose.target);
      if (applied.current === "") {
        camera.position.copy(toP);
        orbit.target.copy(toT);
        orbit.update();
      } else {
        move.current = {
          k: 0,
          fromP: camera.position.clone(),
          fromT: orbit.target.clone(),
          toP,
          toT,
        };
      }
      applied.current = goal;
    }
    const m = move.current;
    if (!m) return;
    const s = useSim.getState();
    const dur = s.slow || s.presenting ? 2.6 : 1.7;
    m.k = Math.min(1, m.k + Math.min(dtRaw, 0.05) / dur);
    const e = smooth(m.k);
    camera.position.lerpVectors(m.fromP, m.toP, e);
    orbit.target.lerpVectors(m.fromT, m.toT, e);
    orbit.enabled = m.k >= 1;
    orbit.update();
    if (m.k >= 1) {
      orbit.enabled = true;
      move.current = null;
    }
  });
  return null;
}
