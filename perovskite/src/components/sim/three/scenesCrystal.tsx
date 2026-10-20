import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLOSSARY } from "@/lib/sim/content";
import {
  tolerance,
  ION,
} from "@/lib/sim/physics";
import { useSim } from "@/lib/sim/store";
import { FACES, CORNERS, Ion, Molecule, OctaMesh, Pop, Seg, Slab, Tag, UnitCell } from "./kit";

const CELL_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));

function MaCorner() {
  return (
    <group position={[1.22, 1.18, 1.15]}>
      <mesh position={[-0.1, 0, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#3cba84" emissive="#3cba84" emissiveIntensity={0.28} roughness={0.35} />
      </mesh>
      <mesh position={[0.14, 0.05, 0]}>
        <sphereGeometry args={[0.11, 16, 12]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.4} />
      </mesh>
      <Tag position={[0.15, 0.48, 0]}>MA⁺</Tag>
    </group>
  );
}

/** 2.1 — three pictures of the same cage: the mineral, the formula, then the halogen swap. */
function OriginScene({ step }: { step: number }) {
  const b = step < 2 ? "#8aa0b4" : "#c5ccd6";
  const x = step < 2 ? "#e15b4c" : "#6d4bd6";
  const aLabel = step === 0 ? "Ca" : step === 1 ? "A" : "";
  const bLabel = step === 0 ? "Ti" : step === 1 ? "B" : "Pb";
  const xLabel = step === 0 ? "O" : step === 1 ? "X = O" : "I / Br / Cl";
  return (
    <group>
      <group scale={0.92}>
        <lineSegments geometry={CELL_EDGES}>
          <lineBasicMaterial color="#d5dde6" transparent opacity={0.8} />
        </lineSegments>
        <OctaMesh color={x} opacity={0.2} />
        {CORNERS.map((p, i) =>
          step >= 2 && i === 7 ? null : (
            <Ion key={`a${i}`} position={p} color="#f4efe6" radius={0.16} label={i === 7 ? aLabel : undefined} />
          ),
        )}
        {step >= 2 ? (
          <Pop>
            <MaCorner />
          </Pop>
        ) : null}
        <Ion position={[0, 0, 0]} color={b} radius={0.28} label={bLabel} />
        {FACES.map((p, i) => (
          <Ion key={`x${i}`} position={p} color={x} radius={0.16} label={i === 4 ? xLabel : undefined} />
        ))}
        {FACES.map((p, i) => (
          <Seg key={`bond${i}`} a={[0, 0, 0]} b={p} color={x} radius={0.028} />
        ))}
      </group>
      <Tag position={[0, 1.85, 0]} accent>
        {step === 0 ? "CaTiO₃" : step === 1 ? "ABX₃" : "MAPbI₃"}
      </Tag>
      <Tag position={[0, -1.72, 0]}>
        {step === 0 ? "khoáng · 1839 · một chất" : step === 1 ? "cùng ô ấy · X vẫn là oxy" : "halide · A có thể là phân tử"}
      </Tag>
    </group>
  );
}

function PartsScene({ step }: { step: number }) {
  const inspect = useSim((s) => s.inspect);
  const clicked = inspect?.startsWith("A") ? "A" : inspect?.startsWith("B") ? "B" : inspect?.startsWith("X") ? "X" : null;
  const focus = clicked ?? (step === 0 ? "B" : step === 1 ? "X" : step === 2 ? "A" : "none");
  const pick = (which: "A" | "B" | "X") => {
    const text =
      which === "B"
        ? "B · Pb²⁺ hoặc Sn²⁺ · quyết định vùng dẫn"
        : which === "X"
          ? "X · I⁻ Br⁻ Cl⁻ · quyết định vùng hóa trị"
          : "A · MA⁺ FA⁺ Cs⁺ · giữ khung, đổi Eg gián tiếp";
    useSim.getState().patch({ inspect: text });
  };
  const title = step === 0 ? "nhìn B" : step === 1 ? "nhìn X" : step === 2 ? "nhìn A" : "MAPbI₃";
  const line =
    step === 0
      ? "B ở tâm · chủ yếu quyết định vùng dẫn"
      : step === 1
        ? "X ở đỉnh · chủ yếu quyết định vùng hóa trị"
        : step === 2
          ? "A ở góc ô · làm khung nghiêng, đổi Eg gián tiếp"
          : "A+1 + B+2 + 3×(X−1) = 0";
  return (
    <group>
      <UnitCell
        a="#3cba84"
        b="#c5ccd6"
        x="#6d4bd6"
        aLabel={step >= 3 ? "A +1" : focus === "A" ? "A" : undefined}
        bLabel={step >= 3 ? "B +2" : focus === "B" ? "B" : undefined}
        xLabel={step >= 3 ? "X −1" : focus === "X" ? "X" : undefined}
        highlight={focus}
        solo={step < 3 && !clicked}
        showOcta
        onPick={pick}
      />
      <Tag position={[0, 1.85, 0]} accent>
        {title}
      </Tag>
      <Tag position={[0, -1.72, 0]}>{line}</Tag>
    </group>
  );
}

function OctaIons({
  center,
  scale,
  skip,
  pbLabel,
  iLabel,
}: {
  center: [number, number, number];
  scale: number;
  skip?: [number, number, number];
  pbLabel?: string;
  iLabel?: [number, number, number];
}) {
  const dirs: [number, number, number][] = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  return (
    <group position={center}>
      <OctaMesh color="#6d4bd6" scale={scale} />
      <Ion position={[0, 0, 0]} color="#c5ccd6" radius={scale * 0.34} label={pbLabel} />
      {dirs.map((d, i) => {
        if (skip && d[0] === skip[0] && d[1] === skip[1] && d[2] === skip[2]) return null;
        const at: [number, number, number] = [d[0] * scale, d[1] * scale, d[2] * scale];
        const marked = iLabel && d[0] === iLabel[0] && d[1] === iLabel[1] && d[2] === iLabel[2];
        return <Ion key={i} position={at} color="#6d4bd6" radius={scale * 0.22} label={marked ? "I⁻" : undefined} />;
      })}
    </group>
  );
}

/** Two corner-sharing octahedra. A, when present, sits in the cavity — not on the Pb site. */
function SharePair({
  a,
  aLabel = "A",
  showPb = false,
  showShared = false,
  cavity = [0, 0.02, 0.98],
}: {
  a?: { color: string; radius: number };
  aLabel?: string;
  showPb?: boolean;
  showShared?: boolean;
  cavity?: [number, number, number];
}) {
  const s = 0.72;
  return (
    <group>
      <OctaIons center={[-0.78, 0, 0]} scale={s} skip={[1, 0, 0]} pbLabel={showPb ? "Pb²⁺" : undefined} />
      <OctaIons center={[0.78, 0, 0]} scale={s} skip={[-1, 0, 0]} />
      <Ion position={[0, 0, 0]} color="#6d4bd6" radius={0.16} label={showShared ? "I⁻ chung" : undefined} />
      {a ? (
        <group position={cavity}>
          <mesh>
            <sphereGeometry args={[0.22, 14, 10]} />
            <meshBasicMaterial color="#d5dde6" wireframe />
          </mesh>
          <Ion position={[0, 0, 0]} color={a.color} radius={a.radius} label={aLabel} />
        </group>
      ) : null}
    </group>
  );
}

function BuildScene({ step }: { step: number }) {
  if (step >= 3) {
    return (
      <group>
        <UnitCell
          a="#e6c15a"
          b="#c5ccd6"
          x="#6d4bd6"
          aLabel="A ×1/8"
          bLabel="B ×1"
          xLabel="X ×1/2"
          showOcta
        />
        <Tag position={[0, 1.9, 0]} accent>
          8×1/8 + 1 + 6×1/2 = ABX₃
        </Tag>
        <Tag position={[0, -1.72, 0]}>một ô: 1 A, 1 B, 3 X</Tag>
      </group>
    );
  }
  return (
    <group position={[0, 0.05, 0]}>
      {step === 0 ? (
        <OctaIons center={[0, 0, 0]} scale={1.05} pbLabel="Pb²⁺" iLabel={[1, 0, 0]} />
      ) : (
        <SharePair
          a={step >= 2 ? { color: "#e6c15a", radius: 0.18 } : undefined}
          showPb={step === 1}
          showShared
        />
      )}
      <Tag position={[0, 1.85, 0]} accent>
        {step === 0 ? "một bát diện PbI₆" : step === 1 ? "nối góc" : "A vào hốc"}
      </Tag>
      <Tag position={[0, -1.7, 0]}>
        {step === 0 ? "sáu I bao một Pb" : step === 1 ? "một I thuộc hai bát diện" : "A nằm trong vòng hốc, không thay Pb"}
      </Tag>
    </group>
  );
}

function tToX(value: number): number {
  const clamped = Math.min(1.02, Math.max(0.8, value));
  return ((clamped - 0.8) / 0.22) * 4.2 - 2.1;
}

const DIRS: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

function PlacedOcta({
  center,
  reach,
  rotZ = 0,
  color = "#6d4bd6",
  skip = [],
  ionR = 0.07,
  pbLabel,
  meshOpacity = 0.24,
  hideIons = false,
}: {
  center: [number, number, number];
  reach: number;
  rotZ?: number;
  color?: string;
  skip?: number[];
  ionR?: number;
  pbLabel?: string;
  meshOpacity?: number;
  hideIons?: boolean;
}) {
  return (
    <group position={center} rotation={[0, 0, rotZ]}>
      <OctaMesh color={color} scale={reach} opacity={meshOpacity} />
      <Ion position={[0, 0, 0]} color="#c5ccd6" radius={Math.min(0.12, reach * 0.26)} label={pbLabel} />
      {hideIons
        ? null
        : DIRS.map((d, i) => {
            if (skip.includes(i)) return null;
            const at: [number, number, number] = [d[0] * reach, d[1] * reach, d[2] * reach];
            return <Ion key={i} position={at} color="#6d4bd6" radius={ionR} />;
          })}
    </group>
  );
}

/** Corner-sharing pair. The grey ring is the A cavity; one iodide is shared. */
function FitPair({
  color,
  radius,
  label,
  hole,
  speck = false,
}: {
  color: string;
  radius: number;
  label: string;
  hole: number;
  speck?: boolean;
}) {
  const s = 0.68;
  return (
    <group>
      <PlacedOcta center={[-s, 0, 0]} reach={s} skip={[0]} ionR={0.075} />
      <PlacedOcta center={[s, 0, 0]} reach={s} skip={[1]} ionR={0.075} />
      <Ion position={[0, 0, 0]} color="#6d4bd6" radius={0.15} accent />
      <Seg a={[-s, 0, 0]} b={[0, 0, 0]} color="#e6c15a" radius={0.028} />
      <Seg a={[s, 0, 0]} b={[0, 0, 0]} color="#e6c15a" radius={0.028} />
      <group position={[0, 0.55, 0.16]}>
        <mesh>
          <torusGeometry args={[hole, 0.018, 10, 40]} />
          <meshBasicMaterial color="#d5dde6" />
        </mesh>
        <Ion position={[0, 0, 0]} color={color} radius={radius} label={label} accent />
        {speck ? <Ion position={[0.32, -0.04, 0.16]} color="#79b0ff" radius={0.07} label="Cs" /> : null}
      </group>
    </group>
  );
}

/** Edge-sharing dimer: exactly two iodides, joined by a gold rod. */
function EdgeShare() {
  const R = 0.42;
  const c1: [number, number, number] = [-R / 2, -R / 2, 0];
  const c2: [number, number, number] = [R / 2, R / 2, 0];
  const iA: [number, number, number] = [R / 2, -R / 2, 0];
  const iB: [number, number, number] = [-R / 2, R / 2, 0];
  return (
    <group>
      <PlacedOcta center={c1} reach={R} skip={[0, 2]} ionR={0.065} />
      <PlacedOcta center={c2} reach={R} rotZ={Math.PI} skip={[0, 2]} ionR={0.065} />
      <Ion position={iA} color="#6d4bd6" radius={0.12} accent />
      <Ion position={iB} color="#6d4bd6" radius={0.12} accent />
      <Seg a={iA} b={iB} color="#e6c15a" radius={0.04} />
      <Tag position={[0, 0.62, 0]}>2 I · một cạnh</Tag>
    </group>
  );
}

/** Face-sharing dimer: exactly three iodides, the gold triangle is that face. */
function FaceShare() {
  const R = 0.5;
  const c2: [number, number, number] = [(2 * R) / 3, (2 * R) / 3, (2 * R) / 3];
  const mid: [number, number, number] = [c2[0] / 2, c2[1] / 2, c2[2] / 2];
  const shared: [number, number, number][] = [
    [R, 0, 0],
    [0, R, 0],
    [0, 0, R],
  ];
  const far = shared.map(
    (p) => [2 * c2[0] - p[0], 2 * c2[1] - p[1], 2 * c2[2] - p[2]] as [number, number, number],
  );
  const back: [number, number, number][] = [
    [-R, 0, 0],
    [0, -R, 0],
    [0, 0, -R],
  ];
  const face = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([R, 0, 0, 0, R, 0, 0, 0, R]), 3));
    g.computeVertexNormals();
    return g;
  }, []);
  const verts = [...shared, ...far];
  const edges: [number, number][] = [];
  for (let i = 0; i < verts.length; i++) {
    for (let j = i + 1; j < verts.length; j++) {
      const opposite = (i < 3 && j === i + 3) || (j < 3 && i === j + 3);
      if (!opposite) edges.push([i, j]);
    }
  }
  return (
    <group position={[-mid[0], -mid[1], -mid[2]]}>
      <OctaMesh color="#6d4bd6" scale={R} opacity={0.22} />
      <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.1} />
      <Ion position={c2} color="#c5ccd6" radius={0.1} />
      {back.map((p, i) => (
        <Ion key={`b${i}`} position={p} color="#6d4bd6" radius={0.065} />
      ))}
      {far.map((p, i) => (
        <Ion key={`f${i}`} position={p} color="#6d4bd6" radius={0.065} />
      ))}
      {shared.map((p, i) => (
        <Ion key={`s${i}`} position={p} color="#6d4bd6" radius={0.12} accent />
      ))}
      {edges.map(([i, j], k) => (
        <Seg key={`e${k}`} a={verts[i]!} b={verts[j]!} color="#6d4bd6" radius={0.012} />
      ))}
      <mesh geometry={face}>
        <meshBasicMaterial color="#e6c15a" side={THREE.DoubleSide} transparent opacity={0.88} />
      </mesh>
      <Tag position={[mid[0], mid[1] + 0.78, mid[2]]}>3 I · một mặt</Tag>
    </group>
  );
}

function ToleranceScene(_: { step: number }) {
  const cation = useSim((s) => s.cation);
  const mixCs = useSim((s) => s.mixCs);
  const rA = cation === "Cs" ? ION.cs : cation === "MA" ? ION.ma : ION.fa;
  const used = mixCs ? ION.fa * 0.95 + ION.cs * 0.05 : rA;
  const t = tolerance(used);
  const small = t < 0.88 && !mixCs;
  const large = t > 0.97 && !mixCs;
  const name = mixCs ? "FA + 5% Cs" : cation === "Cs" ? "CsPbI₃" : cation === "MA" ? "MAPbI₃" : "FAPbI₃";
  const color = mixCs ? "#e6c15a" : cation === "Cs" ? "#79b0ff" : cation === "MA" ? "#3cba84" : "#e6c15a";
  const hole = 0.21;
  const drawn = mixCs ? 0.16 : cation === "Cs" ? 0.1 : cation === "MA" ? 0.26 : 0.38;
  const x = tToX(t);
  const safeL = tToX(0.88);
  const safeR = tToX(0.985);
  const side = small || large;
  return (
    <group>
      <group position={side ? [-1.28, 0.22, 0] : [0, 0.16, 0]} scale={side ? 0.82 : 1.05}>
        <FitPair
          color={color}
          radius={drawn}
          label={mixCs ? "FA" : cation}
          hole={hole}
          speck={mixCs}
        />
      </group>
      {small ? (
        <group position={[1.42, 0.16, 0]} scale={0.95}>
          <EdgeShare />
        </group>
      ) : null}
      {large ? (
        <group position={[1.48, 0.08, 0]} scale={0.86}>
          <FaceShare />
        </group>
      ) : null}
      <mesh position={[0, -1.22, 0]}>
        <boxGeometry args={[4.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#1e2832" />
      </mesh>
      <mesh position={[(safeL + safeR) / 2, -1.22, 0]}>
        <boxGeometry args={[safeR - safeL, 0.14, 0.12]} />
        <meshStandardMaterial color="#8fd0a8" />
      </mesh>
      <mesh position={[x, -1.22, 0.12]}>
        <sphereGeometry args={[0.11, 14, 12]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.7} />
      </mesh>
      <Tag position={[0, 1.72, 0]} accent>
        {name} · t ≈ {t.toFixed(2)}
      </Tag>
      <Tag position={[0, -1.68, 0]}>
        {mixCs
          ? "thêm Cs · lại chạm 1 iod"
          : small
            ? "A nhỏ · bên phải chạm 2 iod"
            : large
              ? "A tràn · bên phải chạm 3 iod"
              : "chạm đúng 1 iod · vừa hốc"}
      </Tag>
    </group>
  );
}

function bendAngle(bend: number, half: number): number {
  const mag2 = half * half + bend * bend;
  const cos = Math.max(-1, Math.min(1, (bend * bend - half * half) / mag2));
  return Math.round((Math.acos(cos) * 180) / Math.PI);
}

function Dashed({ a, b }: { a: [number, number, number]; b: [number, number, number] }) {
  const parts = 4;
  return (
    <group>
      {Array.from({ length: parts }).map((_, i) => {
        const t0 = i / parts;
        const t1 = t0 + 0.42 / parts;
        const p0: [number, number, number] = [
          a[0] + (b[0] - a[0]) * t0,
          a[1] + (b[1] - a[1]) * t0,
          -0.02,
        ];
        const p1: [number, number, number] = [
          a[0] + (b[0] - a[0]) * t1,
          a[1] + (b[1] - a[1]) * t1,
          -0.02,
        ];
        return <Seg key={i} a={p0} b={p1} color="#8b97a3" radius={0.012} />;
      })}
    </group>
  );
}

/** Pb 6s (round) and I 5p (along the bond). They overlap only when Pb–I–Pb is nearly straight. */
function BondLobes({
  a,
  b,
  meet,
  named = false,
}: {
  a: [number, number, number];
  b: [number, number, number];
  meet: boolean;
  named?: boolean;
}) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const dir = B.clone().sub(A);
  const len = Math.max(0.001, dir.length());
  const n = dir.clone().normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
  const sPos = A.clone().add(n.clone().multiplyScalar(len * (meet ? 0.4 : 0.26)));
  const pPos = B.clone().add(n.clone().multiplyScalar(-len * (meet ? 0.4 : 0.24)));
  return (
    <group>
      <mesh position={sPos}>
        <sphereGeometry args={[meet ? 0.14 : 0.1, 16, 12]} />
        <meshStandardMaterial color="#9eb6d6" emissive="#9eb6d6" emissiveIntensity={0.5} transparent opacity={0.92} />
      </mesh>
      <mesh position={pPos} quaternion={q} scale={[0.08, meet ? 0.2 : 0.1, 0.08]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#c46a45" emissive="#c46a45" emissiveIntensity={0.55} transparent opacity={0.92} />
      </mesh>
      {meet ? (
        <mesh position={A.clone().lerp(B, 0.5)}>
          <sphereGeometry args={[0.05, 12, 10]} />
          <meshStandardMaterial color="#f4efe6" emissive="#f4efe6" emissiveIntensity={0.9} />
        </mesh>
      ) : null}
      {named ? (
        <>
          <Tag position={[sPos.x, sPos.y + 0.24, sPos.z]}>Pb 6s</Tag>
          <Tag position={[pPos.x + 0.02, pPos.y - 0.22, pPos.z]}>I 5p</Tag>
        </>
      ) : null}
    </group>
  );
}

/** Valence bar drops when the bridge bends. The Pb 6p bar stays put. */
function GapSketch({
  position,
  drop,
  mark,
  side = -1,
  quiet = false,
}: {
  position: [number, number, number];
  drop: number;
  mark: string;
  side?: number;
  quiet?: boolean;
}) {
  const cbm = 0.2;
  const vbm = 0.2 - 0.32 - drop;
  return (
    <group position={position}>
      <Slab position={[0, cbm, 0]} size={[0.78, 0.07, 0.07]} color="#4d86d6" emissive={0.45} />
      {quiet ? null : <Tag position={[0, cbm + 0.2, 0]}>Pb 6p</Tag>}
      <Slab position={[0, vbm, 0]} size={[0.78, 0.07, 0.07]} color="#c46a45" emissive={0.45} />
      {quiet ? null : <Tag position={[0, vbm - 0.2, 0]}>{drop > 0.08 ? "đỉnh hạ" : "đỉnh cao"}</Tag>}
      <Tag position={[side * 0.62, (cbm + vbm) / 2, 0]} accent>
        {mark}
      </Tag>
    </group>
  );
}

/** I 5p lobe from the iodide toward one lead. Short when the bridge is bent. */
function PLobe({
  from,
  to,
  frac,
}: {
  from: [number, number, number];
  to: [number, number, number];
  frac: number;
}) {
  const A = new THREE.Vector3(...from);
  const B = new THREE.Vector3(...to);
  const dir = B.clone().sub(A);
  const len = Math.max(0.001, dir.length());
  const n = dir.normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
  const lobe = len * frac;
  const mid = A.clone().add(n.clone().multiplyScalar(lobe * 0.5));
  return (
    <mesh position={mid} quaternion={q} scale={[0.085, Math.max(0.06, lobe * 0.5), 0.085]}>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial color="#c46a45" emissive="#c46a45" emissiveIntensity={0.55} transparent opacity={0.9} />
    </mesh>
  );
}

/** Three ions of one Pb–I–Pb bridge, with Pb 6s clouds and I 5p lobes. */
function BridgeOrbitals({
  position,
  bend,
  half,
  named = false,
}: {
  position: [number, number, number];
  bend: number;
  half: number;
  named?: boolean;
}) {
  const left: [number, number, number] = [-half, 0, 0];
  const right: [number, number, number] = [half, 0, 0];
  const iPos: [number, number, number] = [0, bend, 0];
  const meet = bend < 0.1;
  const sR = meet ? 0.22 : 0.12;
  const frac = meet ? 0.72 : 0.26;
  const cloud = (at: [number, number, number]) => (
    <mesh position={at}>
      <sphereGeometry args={[sR, 18, 14]} />
      <meshStandardMaterial color="#9eb6d6" emissive="#9eb6d6" emissiveIntensity={0.4} transparent opacity={0.42} />
    </mesh>
  );
  let a0 = Math.atan2(-bend, -half);
  const a1 = Math.atan2(-bend, half);
  if (a0 > a1) a0 -= Math.PI * 2;
  const arcR = 0.22;
  const arc: [number, number, number][] = [];
  for (let i = 0; i <= 7; i++) {
    const ang = a0 + ((a1 - a0) * i) / 7;
    arc.push([Math.cos(ang) * arcR, bend + Math.sin(ang) * arcR, 0.04]);
  }
  const bead = (to: [number, number, number]) => {
    const p: [number, number, number] = [
      iPos[0] + (to[0] - iPos[0]) * 0.42,
      iPos[1] + (to[1] - iPos[1]) * 0.42,
      0.05,
    ];
    return (
      <mesh position={p}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshStandardMaterial color="#f4efe6" emissive="#f4efe6" emissiveIntensity={0.95} />
      </mesh>
    );
  };
  return (
    <group position={position}>
      {bend > 0.04 ? <Dashed a={left} b={right} /> : null}
      {bend > 0.04 ? <Ion position={[0, 0, -0.02]} color="#b7c3d1" radius={0.07} opacity={0.4} /> : null}
      <Seg a={left} b={iPos} color="#e6c15a" radius={0.022} />
      <Seg a={right} b={iPos} color="#e6c15a" radius={0.022} />
      {cloud(left)}
      {cloud(right)}
      <PLobe from={iPos} to={left} frac={frac} />
      <PLobe from={iPos} to={right} frac={frac} />
      {meet ? bead(left) : null}
      {meet ? bead(right) : null}
      <Ion position={left} color="#c5ccd6" radius={0.09} />
      <Ion position={right} color="#c5ccd6" radius={0.09} />
      <Ion position={iPos} color="#6d4bd6" radius={0.09} accent />
      {bend > 0.05
        ? arc.slice(0, -1).map((p, i) => <Seg key={i} a={p} b={arc[i + 1]!} color="#e6c15a" radius={0.012} />)
        : null}
      {named ? (
        <>
          <Tag position={[-half - 0.02, -0.34, 0]}>Pb 6s</Tag>
          <Tag position={[half + 0.02, -0.34, 0]}>Pb 6s</Tag>
          <Tag position={[0.46, 0.05, 0]}>I 5p</Tag>
        </>
      ) : null}
      {bend > 0.04 ? <Tag position={[-0.62, -0.08, 0]}>vị trí 180°</Tag> : null}
    </group>
  );
}

/** Same Pb 6p height on both sides. The copper valence bar is pushed up only when the bridge is straight. */
function AntibondStep() {
  const half = 0.48;
  const bent = 0.42;
  const leftX = -1.15;
  const rightX = 1.2;
  const bridgeY = 0.78;
  const cbmY = -0.28;
  const highY = -0.62;
  const lowY = -1.18;
  const bar = 0.72;
  return (
    <group>
      <BridgeOrbitals position={[leftX, bridgeY, 0]} bend={0} half={half} named />
      <Tag position={[leftX, 1.42, 0]}>180° · chồng lấp mạnh</Tag>
      <BridgeOrbitals position={[rightX, bridgeY - 0.06, 0]} bend={bent} half={half} />
      <Tag position={[rightX, 1.48, 0]}>
        góc nhỏ · {bendAngle(bent, half)}°
      </Tag>

      <Slab position={[leftX, cbmY, 0]} size={[bar, 0.07, 0.07]} color="#4d86d6" emissive={0.5} />
      <Slab position={[rightX, cbmY, 0]} size={[bar, 0.07, 0.07]} color="#4d86d6" emissive={0.5} />
      <Dashed a={[leftX + bar / 2, cbmY, 0]} b={[rightX - bar / 2, cbmY, 0]} />
      <Tag position={[leftX, cbmY + 0.24, 0]}>Pb 6p</Tag>
      <Tag position={[rightX, cbmY + 0.24, 0]}>Pb 6p</Tag>

      <Slab position={[leftX, highY, 0]} size={[bar, 0.07, 0.07]} color="#c46a45" emissive={0.5} />
      <Tag position={[leftX + 0.58, highY - 0.22, 0]}>phản liên kết</Tag>
      <Arrow a={[leftX - 0.58, lowY + 0.04, 0.08]} b={[leftX - 0.58, highY - 0.06, 0.08]} color="#e6c15a" />
      <Tag position={[leftX - 1.12, lowY - 0.02, 0]}>bị đẩy lên</Tag>
      <Tag position={[leftX + 0.62, (cbmY + highY) / 2, 0]} accent>
        Eg hẹp
      </Tag>

      <Slab position={[rightX, highY, 0]} size={[bar, 0.07, 0.07]} color="#c46a45" opacity={0.28} emissive={0.15} />
      <Tag position={[rightX + 0.58, highY, 0]}>mức 180°</Tag>
      <Arrow a={[rightX - 0.55, highY - 0.08, 0.08]} b={[rightX - 0.55, lowY + 0.1, 0.08]} color="#e15b4c" />
      <Slab position={[rightX, lowY, 0]} size={[bar, 0.07, 0.07]} color="#c46a45" emissive={0.5} />
      <Tag position={[rightX, lowY - 0.22, 0]}>đỉnh hạ</Tag>
      <Tag position={[rightX + 0.92, (highY + lowY) / 2 - 0.08, 0]} accent>
        Eg rộng
      </Tag>
      <Tag position={[0, 1.82, 0]} accent>
        tương tác yếu thì đỉnh hóa trị hạ xuống
      </Tag>
    </group>
  );
}
function NotThisAngle() {
  const R = 0.4;
  const arc: [number, number, number][] = [];
  for (let i = 0; i <= 6; i++) {
    const a = (i / 6) * (Math.PI / 2);
    arc.push([Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.03]);
  }
  return (
    <group position={[0, -0.95, 0]} scale={0.9}>
      <OctaMesh color="#6d4bd6" scale={R} opacity={0.14} />
      <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.09} />
      <Ion position={[R, 0, 0]} color="#6d4bd6" radius={0.07} />
      <Ion position={[0, R, 0]} color="#6d4bd6" radius={0.07} />
      <Seg a={[0, 0, 0]} b={[R, 0, 0]} color="#8b97a3" radius={0.016} />
      <Seg a={[0, 0, 0]} b={[0, R, 0]} color="#8b97a3" radius={0.016} />
      {arc.slice(0, -1).map((p, i) => (
        <Seg key={i} a={p} b={arc[i + 1]!} color="#8b97a3" radius={0.01} />
      ))}
      <Seg a={[0.02, 0.02, 0.05]} b={[0.22, 0.2, 0.05]} color="#e15b4c" radius={0.016} />
      <Tag position={[0.35, -0.38, 0]}>I–Pb–I · không phải góc này</Tag>
    </group>
  );
}

/** Pb ions stay fixed. The bridging iodide moves off the Pb–Pb line, and both bonds meet at that iodide. */
function AnglePair({
  position,
  bend,
  half,
  showA = false,
  labelIons = false,
  ghost = false,
  lobes = false,
  guide = false,
  pbTags = false,
  nameLobes = false,
}: {
  position: [number, number, number];
  bend: number;
  half: number;
  showA?: boolean;
  labelIons?: boolean;
  ghost?: boolean;
  lobes?: boolean;
  guide?: boolean;
  pbTags?: boolean;
  nameLobes?: boolean;
}) {
  const reach = Math.hypot(half, bend);
  const left: [number, number, number] = [-half, 0, 0];
  const right: [number, number, number] = [half, 0, 0];
  const iPos: [number, number, number] = [0, bend, 0];
  const aimL = Math.atan2(bend, half);
  const aimR = Math.atan2(bend, -half);
  let a0 = Math.atan2(-bend, -half);
  const a1 = Math.atan2(-bend, half);
  if (a0 > a1) a0 -= Math.PI * 2;
  const arcR = Math.min(0.28, half * 0.42);
  const arc: [number, number, number][] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const ang = a0 + ((a1 - a0) * i) / steps;
    arc.push([Math.cos(ang) * arcR, bend + Math.sin(ang) * arcR, 0.03]);
  }
  const showGhost = ghost && bend > 0.04;
  const meet = bend < 0.16;
  return (
    <group position={position}>
      {bend > 0.04 ? <Dashed a={left} b={right} /> : null}
      <PlacedOcta
        center={left}
        reach={reach}
        rotZ={aimL}
        skip={[0]}
        ionR={0.055}
        pbLabel={labelIons && !pbTags ? "Pb²⁺" : undefined}
        meshOpacity={lobes ? 0.12 : 0.24}
        hideIons={lobes}
      />
      <PlacedOcta
        center={right}
        reach={reach}
        rotZ={aimR}
        skip={[0]}
        ionR={0.055}
        pbLabel={labelIons && !pbTags ? "Pb²⁺" : undefined}
        meshOpacity={lobes ? 0.12 : 0.24}
        hideIons={lobes}
      />
      {showGhost ? <Ion position={[0, 0, 0]} color="#b7c3d1" radius={0.08} opacity={0.4} /> : null}
      <Ion
        position={iPos}
        color="#6d4bd6"
        radius={0.11}
        accent
        label={labelIons && bend > 0.08 ? "I⁻" : undefined}
      />
      {labelIons && bend <= 0.08 ? <Tag position={[0, 0.48, 0]}>I⁻</Tag> : null}
      <Seg a={left} b={iPos} color="#e6c15a" radius={0.03} />
      <Seg a={right} b={iPos} color="#e6c15a" radius={0.03} />
      {lobes ? <BondLobes a={left} b={iPos} meet={meet} named={nameLobes} /> : null}
      {bend > 0.05
        ? arc.slice(0, -1).map((p, i) => <Seg key={i} a={p} b={arc[i + 1]!} color="#e6c15a" radius={0.012} />)
        : null}
      {showA ? <Ion position={[1.42, -0.42, 0.15]} color="#79b0ff" radius={0.13} accent /> : null}
      {pbTags ? (
        <>
          <Tag position={[-half, 0.5, 0]}>Pb²⁺</Tag>
          <Tag position={[half, 0.5, 0]}>Pb²⁺</Tag>
        </>
      ) : null}
      {showGhost && !guide ? <Tag position={[-0.62, -0.5, 0]}>vị trí 180°</Tag> : null}
    </group>
  );
}

function PhasesScene({ step }: { step: number }) {
  if (step >= 2) {
    const half = 0.4;
    const faBend = 0.08;
    const csBend = 0.3;
    return (
      <group>
        <AnglePair position={[-1.4, 0.72, 0]} bend={faBend} half={half} />
        <Tag position={[-1.4, 1.42, 0]}>
          FA⁺ · {bendAngle(faBend, half)}°
        </Tag>
        <GapSketch position={[-1.4, -0.15, 0]} drop={0} mark="1,48 eV" side={-1} quiet />
        <group position={[-1.4, -1.05, 0]}>
          <Slab position={[0.2, 0, 0]} size={[0.5, 0.26, 0.18]} color="#3a2a55" />
          <Arrow a={[-0.85, 0, 0.2]} b={[-0.08, 0, 0.2]} color="#e15b4c" />
          <mesh position={[-0.85, 0, 0.2]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <meshStandardMaterial color="#e15b4c" emissive="#e15b4c" emissiveIntensity={0.85} />
          </mesh>
          <Tag position={[0.2, -0.36, 0]}>đỏ bị nuốt</Tag>
        </group>
        <AnglePair position={[1.4, 0.62, 0]} bend={csBend} half={half} />
        <Tag position={[1.4, 1.48, 0]}>
          Cs⁺ · {bendAngle(csBend, half)}°
        </Tag>
        <GapSketch position={[1.4, -0.15, 0]} drop={0.38} mark="1,73 eV" side={1} quiet />
        <group position={[1.4, -1.05, 0]}>
          <Slab position={[0, 0, 0]} size={[0.5, 0.26, 0.18]} color="#3a2a55" />
          <Arrow a={[-0.85, 0, 0.22]} b={[0.9, 0, 0.22]} color="#e15b4c" />
          <mesh position={[-0.85, 0, 0.22]}>
            <sphereGeometry args={[0.06, 12, 10]} />
            <meshStandardMaterial color="#e15b4c" emissive="#e15b4c" emissiveIntensity={0.85} />
          </mesh>
          <Tag position={[0, -0.36, 0]}>đi xuyên · lớp trên</Tag>
        </group>
        <Tag position={[0, 1.88, 0]} accent>
          Eg hẹp nuốt ánh sáng đỏ
        </Tag>
      </group>
    );
  }
  if (step === 1) return <AntibondStep />;
  const half = 0.62;
  const bend = 0.34;
  return (
    <group>
      <AnglePair position={[-1.45, 0.28, 0]} bend={0} half={half} labelIons pbTags />
      <Tag position={[-1.45, 1.35, 0]}>thẳng · 180°</Tag>
      <AnglePair position={[1.45, 0.22, 0]} bend={bend} half={half} labelIons pbTags ghost />
      <Tag position={[1.45, 1.42, 0]}>
        gập · {bendAngle(bend, half)}°
      </Tag>
      <NotThisAngle />
      <Tag position={[0, 1.85, 0]} accent>
        góc Pb–I–Pb · giữa hai khối
      </Tag>
    </group>
  );
}

function Arrow({ a, b, color = "#e4a23a" }: { a: [number, number, number]; b: [number, number, number]; color?: string }) {
  const geo = useMemo(() => {
    const A = new THREE.Vector3(...a);
    const B = new THREE.Vector3(...b);
    const dir = B.clone().sub(A);
    const len = Math.max(0.001, dir.length());
    const n = dir.clone().normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    const head = 0.16;
    return {
      q,
      shaftLen: Math.max(0.05, len - head),
      shaftMid: A.clone().add(n.clone().multiplyScalar((len - head) / 2)),
      headPos: A.clone().add(n.clone().multiplyScalar(len - head / 2)),
    };
  }, [a, b]);
  return (
    <group>
      <mesh position={geo.shaftMid} quaternion={geo.q}>
        <cylinderGeometry args={[0.03, 0.03, geo.shaftLen, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={geo.headPos} quaternion={geo.q}>
        <coneGeometry args={[0.085, 0.16, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
      </mesh>
    </group>
  );
}

function NoShake({ position }: { position: [number, number, number] }) {
  const pts = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i <= 7; i++) {
      const t = i / 7;
      out.push([
        position[0] + (t - 0.5) * 0.58,
        position[1] + Math.sin(t * Math.PI * 2) * 0.12,
        position[2],
      ]);
    }
    return out;
  }, [position]);
  return (
    <group>
      {pts.slice(0, -1).map((p, i) => (
        <Seg key={i} a={p} b={pts[i + 1]!} color="#9aa6b4" radius={0.016} />
      ))}
      <Seg
        a={[position[0] - 0.2, position[1] - 0.18, 0.05]}
        b={[position[0] + 0.2, position[1] + 0.18, 0.05]}
        color="#e15b4c"
        radius={0.02}
      />
    </group>
  );
}

type P3 = [number, number, number];

function buildNet(n: number, spacing: number) {
  const half = (n - 1) / 2;
  const pbs: P3[] = [];
  const iods: P3[] = [];
  const bonds: P3[] = [];
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      for (let z = 0; z < n; z++) {
        pbs.push([(x - half) * spacing, (y - half) * spacing, (z - half) * spacing]);
      }
    }
  }
  for (let axis = 0; axis < 3; axis++) {
    for (let a = 0; a <= n; a++) {
      for (let b = 0; b < n; b++) {
        for (let c = 0; c < n; c++) {
          const p: P3 = [0, 0, 0];
          p[axis] = (a - half - 0.5) * spacing;
          p[(axis + 1) % 3] = (b - half) * spacing;
          p[(axis + 2) % 3] = (c - half) * spacing;
          iods.push(p);
        }
      }
    }
  }
  for (const p of pbs) {
    for (const d of DIRS) {
      bonds.push(p, [p[0] + d[0] * spacing * 0.5, p[1] + d[1] * spacing * 0.5, p[2] + d[2] * spacing * 0.5]);
    }
  }
  return { pbs, iods, bonds };
}

function NetLines({ bonds }: { bonds: P3[] }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(bonds.length * 3);
    bonds.forEach((p, i) => {
      arr[i * 3] = p[0];
      arr[i * 3 + 1] = p[1];
      arr[i * 3 + 2] = p[2];
    });
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [bonds]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#7d72b8" />
    </lineSegments>
  );
}

function PbINet({
  n = 3,
  spacing = 0.4,
  pbR = 0.055,
  iR = 0.04,
  pick = false,
}: {
  n?: number;
  spacing?: number;
  pbR?: number;
  iR?: number;
  pick?: boolean;
}) {
  const data = useMemo(() => buildNet(n, spacing), [n, spacing]);
  const say = (text: string) => () => useSim.getState().patch({ inspect: text });
  return (
    <group>
      <NetLines bonds={data.bonds} />
      {data.pbs.map((p, i) => (
        <Ion
          key={`p${i}`}
          position={p}
          color="#c5ccd6"
          radius={pbR}
          onPick={pick ? say("Pb²⁺ · một ion trong mạng, không phải cả vùng dẫn") : undefined}
        />
      ))}
      {data.iods.map((p, i) => (
        <Ion
          key={`i${i}`}
          position={p}
          color="#6d4bd6"
          radius={iR}
          onPick={pick ? say("I⁻ · một ion trong mạng, không phải cả vùng hóa trị") : undefined}
        />
      ))}
    </group>
  );
}

function OneOcta({ labels = true }: { labels?: boolean }) {
  const s = 0.72;
  const say = (text: string) => () => useSim.getState().patch({ inspect: text });
  return (
    <group>
      <OctaMesh color="#6d4bd6" scale={s} opacity={0.18} />
      <Ion
        position={[0, 0, 0]}
        color="#c5ccd6"
        radius={0.15}
        label={labels ? "Pb²⁺" : undefined}
        accent
        onPick={say("Pb²⁺ · một ion trong mạng, không phải cả vùng dẫn")}
      />
      {DIRS.map((d, i) => (
        <group key={i}>
          <Seg a={[0, 0, 0]} b={[d[0] * s, d[1] * s, d[2] * s]} color="#6d4bd6" radius={0.018} />
          <Ion
            position={[d[0] * s, d[1] * s, d[2] * s]}
            color="#6d4bd6"
            radius={0.1}
            label={labels && i === 0 ? "I⁻" : undefined}
            onPick={say("I⁻ · một ion trong mạng, không phải cả vùng hóa trị")}
          />
        </group>
      ))}
    </group>
  );
}

function Chain({ pts, color, radius = 0.012 }: { pts: P3[]; color: string; radius?: number }) {
  return (
    <group>
      {pts.slice(0, -1).map((p, i) => (
        <Seg key={i} a={p} b={pts[i + 1]!} color={color} radius={radius} />
      ))}
    </group>
  );
}

function bow(k0: number, y0: number, a: number, x0: number, x1: number, n = 16): P3[] {
  const pts: P3[] = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const dk = x - k0;
    pts.push([x, y0 + a * dk * dk, 0]);
  }
  return pts;
}

function EKFrame({ w = 0.62, h = 0.72 }: { w?: number; h?: number }) {
  return (
    <group>
      <Seg a={[-w, -h, 0]} b={[w + 0.12, -h, 0]} color="#8b97a3" radius={0.01} />
      <Seg a={[-w, -h, 0]} b={[-w, h + 0.12, 0]} color="#8b97a3" radius={0.01} />
      <Tag position={[w + 0.28, -h, 0]}>k</Tag>
      <Tag position={[-w - 0.22, h - 0.02, 0]}>E</Tag>
    </group>
  );
}

function DashV({ x, y0, y1 }: { x: number; y0: number; y1: number }) {
  const n = 9;
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => {
        const t0 = i / n;
        const t1 = t0 + 0.42 / n;
        return (
          <Seg
            key={i}
            a={[x, y0 + (y1 - y0) * t0, -0.05]}
            b={[x, y0 + (y1 - y0) * t1, -0.05]}
            color="#b7c3d1"
            radius={0.011}
          />
        );
      })}
    </group>
  );
}

function DirectChart() {
  const vbmY = -0.12;
  const cbmY = 0.58;
  const eRef = useRef<THREE.Group>(null);
  const hRef = useRef<THREE.Group>(null);
  const pRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % 6) / 6;
    const approach = Math.min(1, t / 0.2);
    const rise = t < 0.22 ? 0 : t < 0.48 ? (t - 0.22) / 0.26 : 1;
    pRef.current?.position.set(-1.15 + approach * 0.72, (vbmY + cbmY) / 2, 0.2);
    if (eRef.current) {
      eRef.current.position.x = 0;
      eRef.current.position.y = vbmY + (cbmY - vbmY) * rise;
    }
    if (hRef.current) hRef.current.visible = rise > 0.15;
  });
  return (
    <group>
      <Slab position={[0.05, 0.02, -0.18]} size={[2.15, 2.05, 0.03]} color="#12161c" opacity={0.92} />
      <EKFrame w={0.82} h={0.82} />
      <Chain pts={bow(0, vbmY, -1.2, -0.68, 0.68, 22)} color="#c46a45" radius={0.02} />
      <Chain pts={bow(0, cbmY, 1.2, -0.68, 0.68, 22)} color="#4d86d6" radius={0.02} />
      <DashV x={0} y0={-0.72} y1={0.82} />
      <mesh position={[0, vbmY, 0.02]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshStandardMaterial color="#c46a45" emissive="#c46a45" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, cbmY, 0.02]}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshStandardMaterial color="#4d86d6" emissive="#4d86d6" emissiveIntensity={0.7} />
      </mesh>
      <Arrow a={[0, vbmY + 0.08, 0.04]} b={[0, cbmY - 0.08, 0.04]} color="#f4efe6" />
      <group ref={pRef}>
        <mesh>
          <sphereGeometry args={[0.07, 14, 12]} />
          <meshStandardMaterial color="#e6c15a" emissive="#e6c15a" emissiveIntensity={0.9} />
        </mesh>
      </group>
      <group ref={eRef} position={[0, vbmY, 0.14]}>
        <mesh>
          <sphereGeometry args={[0.075, 16, 12]} />
          <meshStandardMaterial color="#4d86d6" emissive="#4d86d6" emissiveIntensity={0.8} />
        </mesh>
      </group>
      <group ref={hRef} position={[0, vbmY, 0.16]} visible={false}>
        <mesh>
          <torusGeometry args={[0.13, 0.022, 10, 28]} />
          <meshStandardMaterial color="#e07a32" emissive="#e07a32" emissiveIntensity={0.65} />
        </mesh>
      </group>
      <Tag position={[-0.58, vbmY - 0.02, 0]}>VBM</Tag>
      <Tag position={[0.55, cbmY, 0]}>CBM</Tag>
      <Tag position={[0.48, (vbmY + cbmY) / 2, 0]} accent>
        Cùng k
      </Tag>
      <Tag position={[-0.95, 0.42, 0]}>photon</Tag>
    </group>
  );
}

function DirectBoard() {
  const vbm = -0.06;
  const cbm = 0.4;
  return (
    <group>
      <Slab position={[0, 0.06, -0.14]} size={[1.55, 1.5, 0.025]} color="#12161c" opacity={0.92} />
      <EKFrame w={0.55} h={0.55} />
      <Chain pts={bow(0, vbm, -1.25, -0.46, 0.46, 18)} color="#c46a45" radius={0.016} />
      <Chain pts={bow(0, cbm, 1.25, -0.46, 0.46, 18)} color="#4d86d6" radius={0.016} />
      <DashV x={0} y0={-0.42} y1={0.55} />
      <Arrow a={[0, vbm + 0.07, 0.05]} b={[0, cbm - 0.07, 0.05]} color="#f4efe6" />
      <Tag position={[0.36, (vbm + cbm) / 2, 0]}>cùng k</Tag>
    </group>
  );
}

function IndirectBoard() {
  const vbmK = -0.26;
  const cbmK = 0.28;
  const vbmY = -0.06;
  const cbmY = 0.4;
  const wave: P3[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    wave.push([vbmK + (cbmK - vbmK) * t, -0.46 + Math.sin(t * Math.PI * 2) * 0.04, 0.06]);
  }
  return (
    <group>
      <Slab position={[0, 0.06, -0.14]} size={[1.55, 1.5, 0.025]} color="#12161c" opacity={0.92} />
      <EKFrame w={0.55} h={0.55} />
      <Chain pts={bow(vbmK, vbmY, -2.4, -0.5, 0.02, 16)} color="#c46a45" radius={0.016} />
      <Chain pts={bow(cbmK, cbmY, 2.4, -0.02, 0.5, 16)} color="#4d86d6" radius={0.016} />
      <mesh position={[vbmK, vbmY, 0.05]}>
        <sphereGeometry args={[0.035, 12, 10]} />
        <meshStandardMaterial color="#c46a45" emissive="#c46a45" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[cbmK, cbmY, 0.05]}>
        <sphereGeometry args={[0.035, 12, 10]} />
        <meshStandardMaterial color="#4d86d6" emissive="#4d86d6" emissiveIntensity={0.7} />
      </mesh>
      <Arrow a={[vbmK, vbmY + 0.06, 0.08]} b={[vbmK, 0.16, 0.08]} color="#e6c15a" />
      <mesh position={[vbmK - 0.16, 0.16, 0.14]}>
        <sphereGeometry args={[0.055, 12, 10]} />
        <meshStandardMaterial color="#e6c15a" emissive="#e6c15a" emissiveIntensity={0.9} />
      </mesh>
      <Chain pts={wave} color="#9aa6b4" radius={0.012} />
      <Tag position={[-0.78, 0.0, 0]}>photon</Tag>
      <Tag position={[0.02, -0.72, 0]}>phonon · Δk</Tag>
    </group>
  );
}

function WaveIon({ at, color, radius, amp }: { at: P3; color: string; radius: number; amp: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const w = Math.sin(clock.elapsedTime * 2.6 + at[0] * 5) * amp;
    ref.current?.position.set(at[0] + w, at[1], at[2]);
  });
  return (
    <group ref={ref}>
      <Ion position={[0, 0, 0]} color={color} radius={radius} />
    </group>
  );
}

function PhononSheet() {
  const spacing = 0.42;
  const data = useMemo(() => {
    const half = 1;
    const pbs: P3[] = [];
    const iods: P3[] = [];
    const bonds: P3[] = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        pbs.push([(x - half) * spacing, (y - half) * spacing, 0]);
      }
    }
    for (let a = 0; a <= 3; a++) {
      for (let b = 0; b < 3; b++) {
        iods.push([(a - half - 0.5) * spacing, (b - half) * spacing, 0]);
        iods.push([(b - half) * spacing, (a - half - 0.5) * spacing, 0]);
      }
    }
    for (const p of pbs) {
      for (const d of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        bonds.push(p, [p[0] + d[0] * spacing * 0.5, p[1] + d[1] * spacing * 0.5, 0]);
      }
    }
    return { pbs, iods, bonds };
  }, []);
  return (
    <group>
      <NetLines bonds={data.bonds} />
      {data.pbs.map((p, i) => (
        <WaveIon key={`p${i}`} at={p} color="#c5ccd6" radius={0.06} amp={0.045} />
      ))}
      {data.iods.map((p, i) => (
        <WaveIon key={`i${i}`} at={p} color="#6d4bd6" radius={0.042} amp={0.045} />
      ))}
    </group>
  );
}

function FilmSheet() {
  const s = 0.4;
  const pbs: P3[] = [];
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 2; y++) pbs.push([(x - 1) * s, (y - 0.5) * s, 0]);
  }
  const iods: P3[] = [];
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 4; x++) iods.push([(x - 1.5) * s, (y - 0.5) * s, 0]);
  }
  for (let x = 0; x < 3; x++) iods.push([(x - 1) * s, 0, 0]);
  const bonds: P3[] = [];
  for (const p of pbs) {
    for (const d of [
      [s / 2, 0],
      [-s / 2, 0],
      [0, s / 2],
      [0, -s / 2],
    ] as const) {
      bonds.push(p, [p[0] + d[0], p[1] + d[1], 0]);
    }
  }
  return (
    <group>
      <NetLines bonds={bonds} />
      {pbs.map((p, i) => (
        <Ion key={`p${i}`} position={p} color="#c5ccd6" radius={0.055} />
      ))}
      {iods.map((p, i) => (
        <Ion key={`i${i}`} position={p} color="#6d4bd6" radius={0.04} />
      ))}
    </group>
  );
}

function FilmCollect() {
  const pRef = useRef<THREE.Group>(null);
  const eRef = useRef<THREE.Group>(null);
  const hRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % 6.5) / 6.5;
    const fly = Math.min(1, t / 0.22);
    const born = t >= 0.24;
    const sep = t < 0.3 ? 0 : t < 0.72 ? (t - 0.3) / 0.42 : 1;
    if (pRef.current) {
      pRef.current.visible = t < 0.3;
      pRef.current.position.set(-1.35 + fly * 1.35, 0.06, 0.55);
      const shrink = t < 0.22 ? 1 : Math.max(0.04, 1 - (t - 0.22) / 0.08);
      pRef.current.scale.setScalar(shrink);
    }
    if (eRef.current) {
      eRef.current.visible = born;
      eRef.current.position.set(0.18 * sep, 0.06 - sep * 0.78, 0.55);
    }
    if (hRef.current) {
      hRef.current.visible = born;
      hRef.current.position.set(-0.18 * sep, 0.06 + sep * 0.76, 0.55);
    }
  });
  return (
    <group>
      <group ref={pRef}>
        <mesh>
          <sphereGeometry args={[0.07, 14, 12]} />
          <meshStandardMaterial color="#e6c15a" emissive="#e6c15a" emissiveIntensity={0.95} />
        </mesh>
      </group>
      <group ref={eRef}>
        <mesh>
          <sphereGeometry args={[0.075, 14, 12]} />
          <meshStandardMaterial color="#4d86d6" emissive="#4d86d6" emissiveIntensity={0.8} />
        </mesh>
      </group>
      <group ref={hRef}>
        <mesh>
          <torusGeometry args={[0.09, 0.02, 10, 24]} />
          <meshStandardMaterial color="#e07a32" emissive="#e07a32" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function Schematic() {
  return <Tag position={[-1.85, 1.62, 0]}>Minh họa giản lược</Tag>;
}

function OrbitalsScene({ step }: { step: number }) {
  if (step <= 0) {
    return (
      <group>
        <Schematic />
        <group position={[-1.2, 0.05, 0]}>
          <OneOcta />
          <Tag position={[0, 1.08, 0]}>khối xây dựng</Tag>
          <Tag position={[0, -1.15, 0]}>8 mặt tam giác</Tag>
        </group>
        <group position={[1.05, 0.02, 0]}>
          <PbINet spacing={0.44} pbR={0.055} iR={0.04} pick />
          <Tag position={[0.22, 0.16, 0.5]}>cùng một I⁻</Tag>
          <Tag position={[0, -0.78, 0]}>mạng 3×3×3</Tag>
        </group>
        <Tag position={[0.15, 1.62, 0]} accent>
          vùng năng lượng thuộc cả mạng
        </Tag>
        <Tag position={[0, -1.52, 0]}>ion A đã ẩn</Tag>
      </group>
    );
  }
  if (step === 1) {
    return (
      <group>
        <Schematic />
        <group position={[-1.55, 0.05, 0]} scale={0.95}>
          <PbINet spacing={0.36} pbR={0.05} iR={0.034} pick />
          <Tag position={[0, -1.15, 0]}>không gian tinh thể</Tag>
        </group>
        <group position={[0.95, 0.05, 0]}>
          <Slab position={[0, -0.55, 0]} size={[1.7, 0.16, 0.2]} color="#c46a45" emissive={0.25} />
          <Slab position={[0, 0.62, 0]} size={[1.7, 0.16, 0.2]} color="#4d86d6" emissive={0.25} />
          {[-0.55, -0.2, 0.15, 0.5].map((x) => (
            <mesh key={x} position={[x, -0.55, 0.18]}>
              <sphereGeometry args={[0.055, 12, 10]} />
              <meshStandardMaterial color="#4d86d6" emissive="#4d86d6" emissiveIntensity={0.7} />
            </mesh>
          ))}
          <Tag position={[-1.05, -0.28, 0]}>VBM</Tag>
          <Tag position={[-1.05, 0.38, 0]}>CBM</Tag>
          <Tag position={[0.85, 0.05, 0]} accent>
            Eg
          </Tag>
          <Tag position={[0, 0.95, 0]}>vùng dẫn</Tag>
          <Tag position={[0, -0.88, 0]}>vùng hóa trị</Tag>
        </group>
        <Tag position={[0.35, 1.62, 0]} accent>
          năng lượng tối thiểu giữa hai mép
        </Tag>
        <Tag position={[0, -1.52, 0]}>độ cao là năng lượng · không phải chỗ trong tinh thể</Tag>
      </group>
    );
  }
  if (step === 2) {
    return (
      <group>
        <Schematic />
        <group position={[-1.95, 0.05, 0]} scale={0.48}>
          <PbINet spacing={0.42} pbR={0.06} iR={0.042} />
          <Tag position={[0, -1.45, 0]}>không gian tinh thể</Tag>
        </group>
        <group position={[0.35, 0.02, 0]}>
          <DirectChart />
          <Tag position={[0, -1.12, 0]}>biểu đồ E–k</Tag>
        </group>
        <Tag position={[0.4, 1.62, 0]} accent>
          mũi tên đứng là trên biểu đồ, không phải đường bay
        </Tag>
      </group>
    );
  }
  if (step === 3) {
    return (
      <group>
        <Schematic />
        <group position={[-1.15, 0.28, 0]}>
          <DirectBoard />
          <Tag position={[0.42, 0.78, 0]}>trực tiếp</Tag>
        </group>
        <group position={[1.22, 0.28, 0]}>
          <IndirectBoard />
          <Tag position={[0.42, 0.78, 0]}>gián tiếp</Tag>
        </group>
        <group position={[0, -1.05, 0]} scale={0.68}>
          <PhononSheet />
        </group>
        <Tag position={[0, -1.5, 0]}>mạng dao động quanh vị trí cân bằng</Tag>
      </group>
    );
  }
  return (
    <group>
      <Schematic />
      <group position={[-1.72, 0.12, 0]} scale={0.58}>
        <OneOcta labels={false} />
        <Tag position={[0, -1.35, 0]}>khối trong màng</Tag>
      </group>
      <group position={[0.55, 0.02, 0]}>
        <Slab position={[0, 0.82, 0]} size={[1.7, 0.2, 0.72]} color="#c46a45" emissive={0.22} />
        <Slab position={[0, 0.05, -0.08]} size={[1.7, 0.98, 0.28]} color="#3a2a55" opacity={0.42} />
        <group position={[0, 0.05, 0.16]}>
          <FilmSheet />
        </group>
        <Slab position={[0, -0.72, 0]} size={[1.7, 0.2, 0.72]} color="#4d86d6" emissive={0.25} />
        <Tag position={[1.15, 0.82, 0]}>chọn lọc lỗ trống</Tag>
        <Tag position={[1.15, 0.42, 0]}>perovskite</Tag>
        <Tag position={[1.15, -0.72, 0]}>chọn lọc electron</Tag>
        <FilmCollect />
      </group>
      <Tag position={[0.15, 1.52, 0]} accent>
        trực tiếp = cùng k, không phải cùng một đường
      </Tag>
      <Tag position={[-0.85, -1.42, 0]}>không chạy dọc liên kết Pb–I</Tag>
    </group>
  );
}
const FOCUS_HEX: Record<string, string> = {
  A: "#e6c15a",
  B: "#c5ccd6",
  X: "#6d4bd6",
  band: "#79b0ff",
  cell: "#e4a23a",
  defect: "#e08a55",
  nano: "#e07a32",
};

function GlossaryScene({ step }: { step: number }) {
  const g = GLOSSARY[step] ?? GLOSSARY[0]!;
  const focus = g.focus;
  const hex = FOCUS_HEX[focus] ?? "#e4a23a";
  return (
    <group>
      {focus === "nano" ? (
        <OctaMesh color={hex} scale={0.5} />
      ) : focus === "defect" ? (
        <group>
          <OctaMesh color="#6d4bd6" scale={0.7} />
          <mesh position={[0.85, 0.2, 0.4]}>
            <sphereGeometry args={[0.16, 16, 12]} />
            <meshStandardMaterial color={hex} emissive={hex} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ) : focus === "cell" || focus === "band" ? (
        <group>
          <Slab position={[0, -0.45, 0]} size={[2.4, 0.25, 0.8]} color="#c46a45" />
          <Slab position={[0, 0.55, 0]} size={[2.4, 0.25, 0.8]} color={focus === "band" ? hex : "#4d86d6"} />
          <Tag position={[1.7, 0.05, 0]} accent>
            Eg
          </Tag>
        </group>
      ) : (
        <UnitCell
          a={focus === "A" ? hex : "#3cba84"}
          b={focus === "B" ? hex : "#c5ccd6"}
          x={focus === "X" ? hex : "#6d4bd6"}
          highlight={focus === "A" || focus === "B" || focus === "X" ? focus : "none"}
          aLabel={focus === "A" ? g.en : undefined}
          bLabel={focus === "B" ? g.en : undefined}
          xLabel={focus === "X" ? g.en : undefined}
        />
      )}
      <Tag position={[0, 2.05, 0]} accent>
        {g.en}
      </Tag>
    </group>
  );
}

export const crystalScenes = {
  origin: OriginScene,
  parts: PartsScene,
  build: BuildScene,
  tolerance: ToleranceScene,
  phases: PhasesScene,
  orbitals: OrbitalsScene,
  glossary: GlossaryScene,
};
