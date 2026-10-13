import { useMemo } from "react";
import * as THREE from "three";
import { GLOSSARY } from "@/lib/sim/content";
import {
  egFromHalide,
  egHex,
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
}: {
  center: [number, number, number];
  reach: number;
  rotZ?: number;
  color?: string;
  skip?: number[];
  ionR?: number;
  pbLabel?: string;
}) {
  return (
    <group position={center} rotation={[0, 0, rotZ]}>
      <OctaMesh color={color} scale={reach} opacity={0.24} />
      <Ion position={[0, 0, 0]} color="#c5ccd6" radius={Math.min(0.12, reach * 0.26)} label={pbLabel} />
      {DIRS.map((d, i) => {
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

/** Pb ions stay fixed. The bridging iodide moves off the Pb–Pb line, and both bonds meet at that iodide. */
function AnglePair({
  position,
  bend,
  half,
  showA = false,
  labelIons = false,
}: {
  position: [number, number, number];
  bend: number;
  half: number;
  showA?: boolean;
  labelIons?: boolean;
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
  return (
    <group position={position}>
      {bend > 0.04 ? <Dashed a={left} b={right} /> : null}
      <PlacedOcta center={left} reach={reach} rotZ={aimL} skip={[0]} ionR={0.055} pbLabel={labelIons ? "Pb" : undefined} />
      <PlacedOcta center={right} reach={reach} rotZ={aimR} skip={[0]} ionR={0.055} pbLabel={labelIons ? "Pb" : undefined} />
      <Ion position={iPos} color="#6d4bd6" radius={0.11} accent />
      <Seg a={left} b={iPos} color="#e6c15a" radius={0.03} />
      <Seg a={right} b={iPos} color="#e6c15a" radius={0.03} />
      {bend > 0.05
        ? arc.slice(0, -1).map((p, i) => (
            <Seg key={i} a={p} b={arc[i + 1]!} color="#e6c15a" radius={0.012} />
          ))
        : null}
      {showA ? <Ion position={[0.46, 0.08, 0.52]} color="#79b0ff" radius={0.12} label="A" /> : null}
    </group>
  );
}

function PhasesScene({ step }: { step: number }) {
  if (step >= 2) {
    const half = 0.58;
    const csBend = 0.34;
    const faBend = 0.1;
    return (
      <group>
        <AnglePair position={[-1.5, 0.05, 0]} bend={csBend} half={half} />
        <Tag position={[-1.5, 1.28, 0]}>
          Cs · {bendAngle(csBend, half)}° · Eg 1,73
        </Tag>
        <AnglePair position={[1.5, 0.05, 0]} bend={faBend} half={half} />
        <Tag position={[1.5, 1.28, 0]}>
          FA · {bendAngle(faBend, half)}° · Eg 1,48
        </Tag>
        <Tag position={[0, 1.78, 0]} accent>
          lệch nhiều thì Eg rộng
        </Tag>
        <Tag position={[0, -1.58, 0]}>A không tạo Eg · A chỉ đẩy iod</Tag>
      </group>
    );
  }
  if (step === 1) {
    const half = 0.58;
    const room = 0.32;
    return (
      <group>
        <AnglePair position={[-1.5, 0.05, 0]} bend={0} half={half} />
        <Tag position={[-1.5, 1.28, 0]}>nóng · {bendAngle(0, half)}°</Tag>
        <AnglePair position={[1.5, 0.05, 0]} bend={room} half={half} />
        <Tag position={[1.5, 1.28, 0]}>phòng · {bendAngle(room, half)}°</Tag>
        <Tag position={[0, 1.78, 0]} accent>
          cùng khung · nóng thì thẳng
        </Tag>
        <Tag position={[0, -1.58, 0]}>trên ≈ 54 °C thẳng · phòng thì iod lệch</Tag>
      </group>
    );
  }
  const half = 0.78;
  const bend = 0.46;
  return (
    <group>
      <AnglePair position={[0, 0.02, 0]} bend={bend} half={half} showA labelIons />
      <Tag position={[0, 1.72, 0]} accent>
        A nhỏ đẩy iod lên
      </Tag>
      <Tag position={[0, 1.22, 0]}>Pb–I–Pb ≈ {bendAngle(bend, half)}°</Tag>
      <Tag position={[0, -1.58, 0]}>hai chì đứng yên · iod rời đường thẳng</Tag>
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

function OrbitalsScene({ step }: { step: number }) {
  const s = 0.7;
  const octaX = -1.85;
  const barX = 0.72;
  const barW = 1.85;
  const lowY = -0.58;
  const highY = 0.72;
  const iAt: [number, number, number] = [octaX + s, 0.05, 0];
  const pbAt: [number, number, number] = [octaX, 0.05, 0];
  const lowL: [number, number, number] = [barX - barW / 2, lowY, 0];
  const highL: [number, number, number] = [barX - barW / 2, highY, 0];
  return (
    <group>
      <group position={[octaX, 0.05, 0]}>
        <OctaMesh color="#6d4bd6" scale={s} opacity={0.22} />
        <Ion position={[0, 0, 0]} color="#4d86d6" radius={0.16} label="Pb" accent />
        <Ion position={[s, 0, 0]} color="#c46a45" radius={0.13} label="I" accent />
        {DIRS.map((d, i) => {
          if (d[0] === 1 && d[1] === 0 && d[2] === 0) return null;
          const at: [number, number, number] = [d[0] * s, d[1] * s, d[2] * s];
          return <Ion key={i} position={at} color="#6d4bd6" radius={0.09} />;
        })}
        {DIRS.map((d, i) => {
          if (d[0] === 1 && d[1] === 0 && d[2] === 0) return null;
          const at: [number, number, number] = [d[0] * s, d[1] * s, d[2] * s];
          return <Seg key={`b${i}`} a={[0, 0, 0]} b={at} color="#6d4bd6" radius={0.02} />;
        })}
        <Seg a={[0, 0, 0]} b={[s, 0, 0]} color="#c46a45" radius={0.028} />
      </group>
      <Seg a={iAt} b={lowL} color="#c46a45" radius={0.02} />
      <Seg a={pbAt} b={highL} color="#4d86d6" radius={0.02} />
      <group position={[barX, 0, 0]}>
        <Slab position={[0, lowY, 0]} size={[barW, 0.2, 0.7]} color="#c46a45" />
        <Tag position={[0, lowY - 0.38, 0]}>hóa trị · lỗ ở I</Tag>
        <Slab position={[0, highY, 0]} size={[barW, 0.2, 0.7]} color="#4d86d6" />
        <Tag position={[0, highY + 0.38, 0]}>dẫn · điện tử lên Pb</Tag>
        <Tag position={[-0.55, (lowY + highY) / 2, 0]} accent>
          Eg
        </Tag>
        {step >= 1 ? (
          <group>
            <Arrow a={[-0.02, lowY + 0.18, 0.28]} b={[-0.02, highY - 0.18, 0.28]} />
            <Ion position={[-0.7, highY, 0.4]} color="#79b0ff" radius={0.08} label="e⁻" />
            <mesh position={[-0.7, lowY, 0.42]}>
              <torusGeometry args={[0.1, 0.022, 8, 20]} />
              <meshStandardMaterial color="#c46a45" emissive="#c46a45" emissiveIntensity={0.4} />
            </mesh>
            <NoShake position={[0.58, 0.16, 0.3]} />
            <Tag position={[0.58, -0.22, 0.3]}>không cần lắc</Tag>
          </group>
        ) : null}
      </group>
      <Tag position={[0.15, -1.58, 0]} accent>
        {step === 0 ? "lỗ trống ở iod · điện tử sẽ lên chì" : "nhảy thẳng · không mượn dao động mạng"}
      </Tag>
    </group>
  );
}
function AlloyScene({ step }: { step: number }) {
  const br = useSim((s) => s.br);
  const sn = useSim((s) => s.sn);
  const light = useSim((s) => s.light);
  const eg = egFromHalide(step === 0 || step === 1 ? br : 0, step === 3 ? sn : 0);
  if (step === 2) {
    return (
      <group>
        {light ? (
          <group>
            <group position={[-1.15, 0.15, 0]}>
              <OctaMesh color="#6d4bd6" scale={0.78} />
              <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.16} label="Pb" />
              <Tag position={[0, 1.1, 0]}>giàu I · Eg thấp</Tag>
            </group>
            <group position={[1.15, 0.15, 0]}>
              <OctaMesh color="#e07a32" scale={0.78} />
              <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.16} label="Pb" />
              <Tag position={[0, 1.1, 0]}>giàu Br</Tag>
            </group>
            <Tag position={[0, -1.5, 0]} accent>
              đèn bật · điện tích dồn về iod
            </Tag>
          </group>
        ) : (
          <group>
            <OctaMesh color="#a06a55" scale={1.05} />
            <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.22} label="I/Br" />
            <Tag position={[0, 1.55, 0]} accent>
              tắt đèn · ion trộn lại
            </Tag>
          </group>
        )}
      </group>
    );
  }
  const xColor = step >= 2 ? "#6d4bd6" : egHex(egFromHalide(br, 0));
  const xLabel = step === 0 ? "X = I" : step === 1 ? (br >= 95 ? "X = Br" : br > 8 ? "X = I/Br" : "X = I") : "X";
  return (
    <group>
      <UnitCell
        a="#3cba84"
        b={step === 3 ? "#d2a36a" : "#c5ccd6"}
        x={xColor}
        bLabel={step === 3 ? "Sn/Pb" : undefined}
        xLabel={xLabel}
        highlight={step === 3 ? "B" : "X"}
        solo
        showOcta
      />
      <Tag position={[0, 1.85, 0]} accent>
        {step === 3 ? "trộn ở vị trí B" : step === 1 ? "thêm brom" : "trộn ở vị trí X"}
      </Tag>
      <Tag position={[0, -1.65, 0]}>Eg {eg.toFixed(2)} eV</Tag>
    </group>
  );
}

function NanoScene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <group>
        {[-1.05, 0, 1.05].map((x) =>
          [-0.45, 0.45].map((z) => (
            <group key={`${x}${z}`} position={[x, 0, z]}>
              <Slab position={[0, 0, 0]} size={[0.92, 0.28, 0.78]} color="#3a2a55" />
            </group>
          )),
        )}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.06, 0.4, 1.7]} />
          <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.06, 0.4, 3.15]} />
          <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.35} />
        </mesh>
        <group position={[-1.05, 0.2, -0.45]}>
          <OctaMesh color="#6d4bd6" scale={0.18} />
        </group>
        <Tag position={[0, 1.15, 0]} accent>
          màng đa tinh thể
        </Tag>
        <Tag position={[0, -1.3, 0]}>vạch cam là ranh giới hạt</Tag>
      </group>
    );
  }
  if (step === 1) {
    return (
      <group>
        {Array.from({ length: 7 }).map((_, i) => {
          const ang = (i / 7) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(ang) * 1.25, Math.sin(i) * 0.12, Math.sin(ang) * 1.05]}>
              <OctaMesh color={i % 2 ? "#6d4bd6" : "#e07a32"} scale={0.28} />
              <mesh position={[0.22, 0.16, 0]} rotation={[0, 0, 0.6]}>
                <cylinderGeometry args={[0.012, 0.012, 0.32, 5]} />
                <meshStandardMaterial color="#8fd0a8" />
              </mesh>
            </group>
          );
        })}
        <Tag position={[0, 1.55, 0]} accent>
          chấm lượng tử
        </Tag>
        <Tag position={[0, -1.4, 0]}>que xanh là phối tử bọc ngoài</Tag>
      </group>
    );
  }
  return (
    <group>
      <Slab position={[0, -0.12, 0]} size={[2.4, 0.55, 1.25]} color="#241c38" />
      <Tag position={[0, -0.12, 0.75]}>màng 3D</Tag>
      <Slab position={[0, 0.28, 0]} size={[2.4, 0.07, 1.25]} color="#3cba84" emissive={0.25} />
      <Tag position={[0, 0.7, 0]} accent>
        áo 2D rất mỏng
      </Tag>
      <Tag position={[0, -1.15, 0]}>điện tích khó xuyên lớp hữu cơ</Tag>
    </group>
  );
}

const PROP_FACT = [
  ["vùng cấm", "1,48 eV FAPbI₃ → 2,3 eV MAPbBr₃"],
  ["hấp thụ nông", "sâu ≈ 100 nm · Urbach ≈ 15 meV"],
  ["điện tích", "exciton vài meV · đi từ 0,1 µm tới >100 µm"],
  ["mạng mềm", "ion iod nhảy ≈ 0,6 eV · làm ở 100–150 °C"],
] as const;

function PropsScene({ step }: { step: number }) {
  const fact = PROP_FACT[Math.min(step, PROP_FACT.length - 1)]!;
  return (
    <group>
      <group position={[-1.45, 0, 0]} scale={0.72}>
        <UnitCell a="#3cba84" b="#c5ccd6" x="#6d4bd6" showOcta />
      </group>
      <group position={[1.45, 0.05, 0]}>
        {step === 0 ? (
          <group>
            <Slab position={[0, -0.42, 0]} size={[1.35, 0.14, 0.6]} color="#c46a45" />
            <Slab position={[0, 0.42, 0]} size={[1.35, 0.14, 0.6]} color="#4d86d6" />
            <Tag position={[0, 0, 0]}>Eg</Tag>
          </group>
        ) : null}
        {step === 1 ? (
          <group>
            <Slab position={[0, 0, 0]} size={[1.2, 0.7, 0.7]} color="#241c38" />
            <Seg a={[0, 0.95, 0.45]} b={[0, 0.32, 0.45]} color="#e4a23a" radius={0.03} />
            <Tag position={[0.55, 0.7, 0]}>~100 nm</Tag>
          </group>
        ) : null}
        {step === 2 ? (
          <group>
            <Ion position={[-0.15, 0.32, 0]} color="#79b0ff" radius={0.12} />
            <Ion position={[-0.15, -0.32, 0]} color="#e08a55" radius={0.12} />
            <Seg a={[0.15, 0, 0]} b={[1.15, 0, 0]} color="#8fd0a8" radius={0.03} />
            <Tag position={[0.65, 0.32, 0]}>đi xa</Tag>
          </group>
        ) : null}
        {step >= 3 ? (
          <group>
            <Ion position={[-0.35, 0, 0]} color="#6d4bd6" radius={0.14} label="I⁻" />
            <mesh position={[0.4, 0, 0]}>
              <sphereGeometry args={[0.16, 16, 12]} />
              <meshBasicMaterial color="#9aa6b4" wireframe />
            </mesh>
            <Seg a={[-0.05, 0.22, 0]} b={[0.28, 0.08, 0]} color="#e6c15a" radius={0.025} />
            <Tag position={[0.4, 0.5, 0]}>nhảy</Tag>
          </group>
        ) : null}
      </group>
      <Tag position={[0, 1.7, 0]} accent>
        {fact[0]}
      </Tag>
      <Tag position={[0, -1.6, 0]}>{fact[1]}</Tag>
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
  alloy: AlloyScene,
  nano: NanoScene,
  props: PropsScene,
  glossary: GlossaryScene,
};
