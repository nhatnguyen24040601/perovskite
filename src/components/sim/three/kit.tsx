import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { useSim } from "@/lib/sim/store";
import { tr } from "@/lib/sim/i18n";
import type { Locale } from "@/lib/sim/store";

function localize(node: ReactNode, locale: Locale): ReactNode {
  if (locale === "vi") return node;
  if (typeof node === "string") {
    const exact = tr(locale, node);
    if (exact !== node) return exact;
    const trimmed = node.trim();
    if (!trimmed || trimmed === node) return node;
    const hit = tr(locale, trimmed);
    if (hit === trimmed) return node;
    const lead = node.match(/^\s*/)?.[0] ?? "";
    const tail = node.match(/\s*$/)?.[0] ?? "";
    return `${lead}${hit}${tail}`;
  }
  if (Array.isArray(node)) return node.map((child) => localize(child, locale));
  return node;
}

export const SPHERE = new THREE.SphereGeometry(1, 28, 18);
export const OCTA = new THREE.OctahedronGeometry(1, 0);
export const OCTA_EDGES = new THREE.EdgesGeometry(OCTA);

export const CORNERS: [number, number, number][] = [
  [-1, -1, -1],
  [-1, -1, 1],
  [-1, 1, -1],
  [-1, 1, 1],
  [1, -1, -1],
  [1, -1, 1],
  [1, 1, -1],
  [1, 1, 1],
];

export const FACES: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export function Tag({
  position,
  children,
  accent = false,
}: {
  position: [number, number, number];
  children: ReactNode;
  accent?: boolean;
}) {
  const textScale = useSim((s) => s.textScale);
  const locale = useSim((s) => s.locale);
  const shown = localize(children, locale);
  return (
    <Html
      position={position}
      center
      distanceFactor={8.5 / textScale}
      zIndexRange={[30, 0]}
      wrapperClass="tag-wrap"
    >
      <div className={accent ? "float-label accent" : "float-label"} style={{ fontSize: `${12 * textScale}px` }}>
        {shown}
      </div>
    </Html>
  );
}

export function Pop({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  useLayoutEffect(() => {
    ref.current?.scale.setScalar(0.04);
  }, []);
  useFrame((_, dt) => {
    t.current = Math.min(1, t.current + Math.min(dt, 0.05) * 2.2);
    const e = 1 - (1 - t.current) ** 3;
    ref.current?.scale.setScalar(Math.max(0.04, e));
  });
  return <group ref={ref}>{children}</group>;
}

export function Seg({
  a,
  b,
  color = "#9aa6b4",
  radius = 0.035,
}: {
  a: [number, number, number];
  b: [number, number, number];
  color?: string;
  radius?: number;
}) {
  const geo = useMemo(() => {
    const A = new THREE.Vector3(...a);
    const B = new THREE.Vector3(...b);
    const len = Math.max(0.001, A.distanceTo(B));
    const mid = A.clone().lerp(B, 0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      B.clone().sub(A).normalize(),
    );
    return { len, mid, q };
  }, [a, b]);
  return (
    <mesh position={geo.mid} quaternion={geo.q}>
      <cylinderGeometry args={[radius, radius, geo.len, 7]} />
      <meshStandardMaterial color={color} roughness={0.45} />
    </mesh>
  );
}

export function Ion({
  position,
  color,
  radius,
  label,
  accent = false,
  opacity = 1,
  onPick,
}: {
  position: [number, number, number];
  color: string;
  radius: number;
  label?: string;
  accent?: boolean;
  opacity?: number;
  onPick?: () => void;
}) {
  return (
    <group position={position}>
      <mesh
        geometry={SPHERE}
        scale={radius}
        onClick={
          onPick
            ? (e) => {
                e.stopPropagation();
                onPick();
              }
            : undefined
        }
        onPointerOver={
          onPick
            ? (e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }
            : undefined
        }
        onPointerOut={onPick ? () => (document.body.style.cursor = "") : undefined}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.32}
          metalness={0.22}
          emissive={color}
          emissiveIntensity={accent ? 0.45 : opacity < 1 ? 0.02 : 0.08}
          transparent={opacity < 0.99}
          opacity={opacity}
          depthWrite={opacity >= 0.99}
        />
      </mesh>
      {label ? <Tag position={[0, radius + 0.22, 0]}>{label}</Tag> : null}
    </group>
  );
}

export function OctaMesh({
  color,
  scale = 1,
  opacity = 0.28,
}: {
  color: string;
  scale?: number;
  opacity?: number;
}) {
  return (
    <group scale={scale}>
      <mesh geometry={OCTA}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.18}
          metalness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <lineSegments geometry={OCTA_EDGES}>
        <lineBasicMaterial color={color} transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}

export function Molecule({
  position = [0, 0, 0],
  color = "#3cba84",
  scale = 1,
}: {
  position?: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.9;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.45;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[-0.16, 0, 0]}>
        <sphereGeometry args={[0.14, 18, 14]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh position={[0.14, 0.04, 0]}>
        <sphereGeometry args={[0.11, 18, 14]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function UnitCell({
  a = "#3cba84",
  b = "#c5ccd6",
  x = "#6d4bd6",
  aLabel,
  bLabel,
  xLabel,
  organic = false,
  ghost = false,
  highlight = "none",
  solo = false,
  showOcta = false,
  cornerColors,
  cornerLabels,
  onPick,
}: {
  a?: string;
  b?: string;
  x?: string;
  aLabel?: string;
  bLabel?: string;
  xLabel?: string;
  organic?: boolean;
  ghost?: boolean;
  highlight?: "A" | "B" | "X" | "none";
  /** Fade every role except the highlighted one, so a step change is obvious. */
  solo?: boolean;
  showOcta?: boolean;
  cornerColors?: string[];
  cornerLabels?: (string | undefined)[];
  onPick?: (which: "A" | "B" | "X") => void;
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)), []);
  const fade = (role: "A" | "B" | "X") => solo && highlight !== "none" && highlight !== role;
  return (
    <group scale={0.92}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#d5dde6" transparent opacity={ghost ? 0.25 : 0.75} />
      </lineSegments>
      {showOcta ? <OctaMesh color={x} opacity={fade("X") && fade("B") ? 0.1 : 0.24} /> : null}
      {CORNERS.map((p, i) => (
        <Ion
          key={`a${i}`}
          position={p}
          color={cornerColors?.[i] ?? a}
          radius={highlight === "A" ? (solo ? 0.28 : 0.2) : fade("A") ? 0.09 : 0.16}
          label={cornerLabels ? cornerLabels[i] : i === 0 ? aLabel : undefined}
          accent={highlight === "A"}
          opacity={fade("A") ? 0.28 : 1}
          onPick={onPick ? () => onPick("A") : undefined}
        />
      ))}
      {organic ? <Molecule position={[1, 1, 1]} color={a} scale={0.85} /> : null}
      <Ion
        position={[0, 0, 0]}
        color={b}
        radius={highlight === "B" ? (solo ? 0.46 : 0.34) : fade("B") ? 0.14 : 0.28}
        label={bLabel}
        accent={highlight === "B"}
        opacity={fade("B") ? 0.28 : 1}
        onPick={onPick ? () => onPick("B") : undefined}
      />
      {FACES.map((p, i) => (
        <Ion
          key={`x${i}`}
          position={p}
          color={x}
          radius={highlight === "X" ? (solo ? 0.28 : 0.2) : fade("X") ? 0.08 : 0.15}
          label={i === 0 ? xLabel : undefined}
          accent={highlight === "X"}
          opacity={fade("X") ? 0.28 : 1}
          onPick={onPick ? () => onPick("X") : undefined}
        />
      ))}
      {FACES.map((p, i) => (
        <Seg key={`b${i}`} a={[0, 0, 0]} b={p} color={x} radius={fade("X") ? 0.015 : 0.03} />
      ))}
    </group>
  );
}

export function Slab({
  position = [0, 0, 0],
  size,
  color,
  opacity = 1,
  emissive = 0,
  onClick,
}: {
  position?: [number, number, number];
  size: [number, number, number];
  color: string;
  opacity?: number;
  emissive?: number;
  onClick?: () => void;
}) {
  return (
    <mesh
      position={position}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      onPointerOver={
        onClick
          ? (e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={onClick ? () => (document.body.style.cursor = "") : undefined}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.42}
        metalness={0.12}
        emissive={color}
        emissiveIntensity={emissive}
      />
    </mesh>
  );
}

export function useSpin(ref: RefObject<THREE.Object3D | null>, speed = 0.25) {
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += Math.min(dt, 0.05) * speed;
  });
}

export function FlowDots({
  count,
  color,
  path,
  speed = 0.35,
}: {
  count: number;
  color: string;
  path: (t: number) => [number, number, number];
  speed?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const t = (clock.elapsedTime * speed + i / count) % 1;
      const p = path(t);
      dummy.position.set(p[0], p[1], p[2]);
      dummy.scale.setScalar(0.07);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[SPHERE, undefined, count]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
    </instancedMesh>
  );
}
