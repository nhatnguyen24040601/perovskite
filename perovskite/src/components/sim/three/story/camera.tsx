import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
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

/** 3.8: the same four framings in every degradation scene — cell, layer (grains), then the lattice. */
const DEG: Record<string, Pose> = {
  "1": { pos: [3.9, 2.0, 6.8], target: [0.3, 0.45, 0] },
  wide: { pos: [4.3, 1.9, 7.6], target: [0.1, 0.05, 0] },
  mid: { pos: [2.7, 1.2, 5.0], target: [0.2, 0.1, 0] },
  "2": { pos: [1.5, 2.9, 4.5], target: [0.1, 0.0, 0.15] },
  gb: { pos: [1.5, 1.3, 3.3], target: [0.26, 0.0, 0.95] },
  "3": { pos: [1.0, 0.65, 2.6], target: [0.26, -0.02, 1.0] },
  ins: { pos: [0.7, 0.6, 1.9], target: [0.0, 0.2, 1.0] },
};

/** Chapter 4: 1 equipment, 2 the substrate / process, 3 the crystals, plus named framings per scene. */
const FAB: Record<string, Record<string, Pose>> = {
  sSpin: {
    "1": { pos: [3.4, 2.1, 4.8], target: [0.5, 0, 0] },
    "2": { pos: [1.6, 1.9, 3.4], target: [0, 0.05, 0] },
    "3": { pos: [1.2, 1.3, 2.5], target: [0, 0.4, 0] },
    xs: { pos: [4.2, 1.1, 4.4], target: [1.4, 0.3, 0] },
  },
};

FAB.sVac = {
  "1": { pos: [4.6, 2.2, 7.0], target: [-0.2, 0.4, 0] },
  "2": { pos: [1.9, 1.7, 3.6], target: [0, 1.0, 0] },
  xs: { pos: [5.2, 1.4, 5.4], target: [2.6, 0.8, 0] },
};

FAB.sBlade = {
  "1": { pos: [3.8, 2.3, 6.6], target: [0.4, 0.3, 0] },
  "2": { pos: [0.2, 1.9, 6.4], target: [-0.2, 0.1, 0] },
  gap: { pos: [0.4, 0.6, 2.1], target: [0.15, 0.12, 0.25] },
  "3": { pos: [0.9, 0.85, 1.9], target: [0.2, 0.05, 0] },
  xs: { pos: [4.8, 1.3, 6.4], target: [2.3, 0.4, 0] },
};

/** Chapter 5: 1 the whole device, 2 the layers (exploded), 3 an interface close up, plus named framings. */
const C5_DEV: Record<string, Pose> = {
  "1": { pos: [4.0, 1.4, 7.8], target: [0.5, 0.15, 0] },
  "2": { pos: [4.8, 1.1, 9.8], target: [0.4, 0.15, 0] },
  "3": { pos: [3.0, 0.7, 5.6], target: [0.3, 0.0, 0.3] },
  cmp: { pos: [0.2, 1.0, 10.6], target: [0, 0, 0] },
};
C5_DEV.buf = { pos: [3.2, -0.2, 6.6], target: [0.3, -0.45, 0.3] };
/** 5.1: two cells side by side — 1 both cells, 2 closer, 3 wider. */
FAB.sPin = {
  ...C5_DEV,
  "1": { pos: [0.1, 0.9, 9.4], target: [0, 0.2, 0] },
  "2": { pos: [0.1, 0.8, 7.6], target: [0, 0.2, 0] },
  "3": { pos: [0.1, 1.2, 11.8], target: [0, 0.2, 0] },
};
FAB.sFunc = FAB.sPin;

export const POSES: Record<string, Record<string, Pose>> = {
  ...FAB,
  dmoist: DEG,
  doxy: { ...DEG, "3": { pos: [0.3, 0.85, 3.0], target: [-0.6, 0.05, 1.0] } },
  dheat: { ...DEG, "3": { pos: [1.1, 0.7, 3.9], target: [0.35, 0.0, 0.8] } },
  duv: { ...DEG, ins: { pos: [1.0, 0.45, 3.9], target: [0, 0.22, 0.95] }, mid: { pos: [2.9, 1.0, 4.6], target: [0.0, 0.15, 0.4] } },
  dion: { ...DEG, "3": { pos: [0.5, 0.6, 4.7], target: [0.0, 0.3, 1.1] } },
  dall: DEG,
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
  const nonce = useSim((s) => s.camNonce);
  const { size } = useThree();
  const panelOpen = useSim((s) => s.fab.panel !== "closed");
  const applied = useRef("");
  // Chapter 4 scenes are framed in the upper part of the stage, above the control bar.
  const fab = /^s[A-Z]/.test(scene);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (!fab) return;
    // Chapter 5 keeps the model in the gap between the story card (top left) and the detail column (right)
    const c5 = /^s(Pin|Func|Mat|Isos|Fin)$/.test(scene);
    // on a phone the two cells of 5.1 sit higher, clear of the caption pill
    const narrow = (scene === "sPin" || scene === "sFunc") && size.width < 600;
    const shiftX = c5 ? Math.round(size.width * (scene === "sPin" || scene === "sFunc" ? -0.07 : panelOpen ? 0.15 : -0.07)) : 0;
    const shiftY = c5 ? Math.round(size.height * (narrow ? 0.17 : 0.05)) : Math.round(size.height * 0.1);
    cam.setViewOffset(size.width, size.height, shiftX, shiftY, size.width, size.height);
    return () => cam.clearViewOffset();
  }, [camera, fab, scene, panelOpen, size.width, size.height]);
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
    const goal = `${scene}|${cam}|${replay}|${nonce}`;
    if (applied.current !== goal) {
      const pose = poseFor(scene, cam);
      const toP = new THREE.Vector3(...pose.pos);
      const toT = new THREE.Vector3(...pose.target);
      if ((scene === "sPin" || scene === "sFunc") && size.width < 600) toP.sub(toT).multiplyScalar(1.05).add(toT);
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
