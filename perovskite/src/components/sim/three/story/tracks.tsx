import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type * as THREE from "three";
import { useGate } from "./storyKit";
import { clamp01, type V3 } from "./world";

/** A keyframe on the path of a particle: where it is at time `t`, and how big (default 1). */
export type Key = { t: number; p: V3; s?: number };

/**
 * Position and size along a list of keyframes (linear in between). Scenes are pure functions of time,
 * so any particle can be placed at any moment, which keeps Prev / Reset / Pause exact.
 */
export function sampleTrack(keys: readonly Key[], T: number): { p: V3; s: number } {
  const first = keys[0]!;
  if (T <= first.t) return { p: first.p, s: 0 };
  const rise = clamp01((T - first.t) / 0.25);
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1]!;
    const b = keys[i]!;
    if (T <= b.t) {
      const k = (T - a.t) / Math.max(1e-6, b.t - a.t);
      const sa = a.s ?? 1;
      const sb = b.s ?? 1;
      return {
        p: [
          a.p[0] + (b.p[0] - a.p[0]) * k,
          a.p[1] + (b.p[1] - a.p[1]) * k,
          a.p[2] + (b.p[2] - a.p[2]) * k,
        ],
        s: (sa + (sb - sa) * k) * (i === 1 ? rise : 1),
      };
    }
  }
  const last = keys[keys.length - 1]!;
  return { p: last.p, s: last.s ?? 1 };
}

/** A moving anchor for a label: `a` > 0.5 shows the label, and the group follows (x, y, z). */
export type Pose = { x: number; y: number; z: number; a: number };

export function Follow({ pose, children }: { pose: { current: Pose }; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const on = useGate(() => pose.current.a > 0.5);
  useFrame(() => {
    group.current?.position.set(pose.current.x, pose.current.y, pose.current.z);
  });
  return <group ref={group}>{on ? children : null}</group>;
}
