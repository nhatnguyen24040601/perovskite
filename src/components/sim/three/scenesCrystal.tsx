import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { GLOSSARY } from "@/lib/sim/content";
import {
  egFromHalide,
  egHex,
  phaseFromTemp,
  tolerance,
  WELL_EG,
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

/** Two corner-sharing octahedra. A, when present, sits in the cavity in front of the shared iodide — not on the Pb site. */
function SharePair({
  a,
  aLabel = "A",
  showPb = false,
  showShared = false,
}: {
  a?: { color: string; radius: number };
  aLabel?: string;
  showPb?: boolean;
  showShared?: boolean;
}) {
  const s = 0.72;
  return (
    <group>
      <OctaIons center={[-0.78, 0, 0]} scale={s} skip={[1, 0, 0]} pbLabel={showPb ? "Pb²⁺" : undefined} />
      <OctaIons center={[0.78, 0, 0]} scale={s} skip={[-1, 0, 0]} />
      <Ion position={[0, 0, 0]} color="#6d4bd6" radius={0.16} label={showShared ? "I⁻ chung" : undefined} />
      {a ? (
        <group position={[0, 0.02, 0.98]}>
          <mesh>
            <sphereGeometry args={[0.24, 14, 10]} />
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

function ToleranceScene({ step }: { step: number }) {
  const cation = useSim((s) => s.cation);
  const mixCs = useSim((s) => s.mixCs);
  const rA = cation === "Cs" ? ION.cs : cation === "MA" ? ION.ma : ION.fa;
  const used = mixCs ? ION.fa * 0.95 + ION.cs * 0.05 : rA;
  const t = tolerance(used);
  const small = t < 0.88 && !mixCs;
  const large = t > 0.97 && !mixCs;
  const name = mixCs ? "FA + 5% Cs" : cation === "Cs" ? "CsPbI₃" : cation === "MA" ? "MAPbI₃" : "FAPbI₃";
  const color = mixCs ? "#e6c15a" : cation === "Cs" ? "#79b0ff" : cation === "MA" ? "#3cba84" : "#e6c15a";
  const radius = 0.12 + (used - ION.cs) * 0.26;
  const x = tToX(t);
  const safeL = tToX(0.88);
  const safeR = tToX(0.985);
  const screenOnly = step >= 5;
  return (
    <group>
      <group position={small || large ? [-0.95, 0.22, 0] : [0, 0.22, 0]} scale={0.9}>
        <SharePair a={{ color, radius: mixCs ? 0.18 : radius }} aLabel={mixCs ? "FA" : "A"} />
        {mixCs ? <Ion position={[0.62, 0.02, 1.2]} color="#79b0ff" radius={0.1} /> : null}
      </group>
      {small ? (
        <group position={[1.85, 0.2, 0]}>
          <OctaMesh color="#e6c15a" scale={0.4} />
          <group position={[0.36, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <OctaMesh color="#e6c15a" scale={0.4} />
          </group>
          <Tag position={[0.2, 0.85, 0]}>chung cạnh</Tag>
        </group>
      ) : null}
      {large ? (
        <group position={[1.9, 0.05, 0]}>
          <OctaMesh color="#e6c15a" scale={0.4} />
          <group position={[0.2, 0.2, 0.2]}>
            <OctaMesh color="#e08a55" scale={0.4} />
          </group>
          <Tag position={[0.15, 1.05, 0]}>chung mặt</Tag>
        </group>
      ) : null}
      <mesh position={[0, -1.22, 0]}>
        <boxGeometry args={[4.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#1e2832" />
      </mesh>
      <mesh position={[(safeL + safeR) / 2, -1.22, 0]}>
        <boxGeometry args={[safeR - safeL, 0.14, 0.12]} />
        <meshStandardMaterial color={screenOnly ? "#5c6b73" : "#8fd0a8"} />
      </mesh>
      <mesh position={[x, -1.22, 0.12]}>
        <sphereGeometry args={[0.11, 14, 12]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.7} />
      </mesh>
      <Tag position={[0, 1.72, 0]} accent>
        {name} · t ≈ {t.toFixed(2)}
      </Tag>
      <Tag position={[0, -1.68, 0]}>
        {screenOnly
          ? "t chỉ sàng lọc · không bảo đảm bền"
          : mixCs
            ? "thêm chấm lam · về vùng an toàn"
            : small
              ? "A hơi nhỏ · dễ sụp"
              : large
                ? "A hơi lớn · dễ sang lục giác"
                : "A vừa hốc · vùng an toàn"}
      </Tag>
    </group>
  );
}

function TiltPair({
  position,
  tilt,
  axes,
  color = "#6d4bd6",
}: {
  position: [number, number, number];
  tilt: number;
  axes: 0 | 1 | 3;
  color?: string;
}) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const ang = useRef(0);
  useFrame((_, dt) => {
    ang.current += (tilt - ang.current) * (1 - Math.exp(-4 * Math.min(dt, 0.05)));
    if (left.current) {
      left.current.rotation.z = ang.current;
      left.current.rotation.x = axes === 3 ? ang.current * 0.8 : 0;
    }
    if (right.current) {
      right.current.rotation.z = -ang.current;
      right.current.rotation.y = axes === 3 ? ang.current : 0;
    }
  });
  return (
    <group position={position}>
      <group ref={left} position={[-0.62, 0, 0]}>
        <OctaMesh color={color} scale={0.55} />
        <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.12} />
        <Seg a={[0, 0, 0]} b={[0.62, 0, 0]} color="#e6c15a" radius={0.03} />
      </group>
      <group ref={right} position={[0.62, 0, 0]}>
        <OctaMesh color={color} scale={0.55} />
        <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.12} />
        <Seg a={[0, 0, 0]} b={[-0.62, 0, 0]} color="#e6c15a" radius={0.03} />
      </group>
      <Ion position={[0, 0, 0]} color="#6d4bd6" radius={0.11} />
    </group>
  );
}

function bondAngle(tilt: number): number {
  return Math.round(180 - (2 * tilt * 180) / Math.PI);
}

function PhasesScene({ step }: { step: number }) {
  const temp = useSim((s) => s.temp);
  const phase = phaseFromTemp(temp);
  if (step >= 4) {
    return (
      <group>
        <TiltPair position={[-1.35, 0.05, 0]} tilt={0.62} axes={3} />
        <Tag position={[-1.35, 1.25, 0]}>Cs · Eg ≈ 1,73 eV</Tag>
        <TiltPair position={[1.45, 0.05, 0]} tilt={0.08} axes={1} color="#8a74e0" />
        <Tag position={[1.45, 1.25, 0]}>FA · Eg ≈ 1,48 eV</Tag>
        <Tag position={[0, 1.82, 0]} accent>
          nghiêng nhiều thì Eg rộng
        </Tag>
        <Tag position={[0, -1.6, 0]}>A nhỏ nghiêng nhiều · A lớn gần 180°</Tag>
      </group>
    );
  }
  const teaching = step === 0;
  const tilt = teaching ? 0.48 : phase.tilt;
  const axes = teaching ? 1 : phase.axes;
  const angle = bondAngle(tilt);
  const name = teaching ? "A nhỏ · khung khom" : phase.name;
  const line = teaching
    ? "góc Pb–I–Pb lệch khỏi 180°"
    : step === 3
      ? "nghiêng vẽ phóng đại cho dễ thấy"
      : phase.range;
  return (
    <group>
      <TiltPair position={[0, 0.05, 0]} tilt={tilt} axes={axes} />
      {teaching ? <Ion position={[0, 0.15, 0.9]} color="#79b0ff" radius={0.14} label="A" /> : null}
      <Tag position={[0, 1.72, 0]} accent>
        {name}
      </Tag>
      <Tag position={[0, 1.22, 0]}>Pb–I–Pb ≈ {angle}°</Tag>
      <Tag position={[0, -1.6, 0]}>{line}</Tag>
    </group>
  );
}

function OrbitalsScene({ step }: { step: number }) {
  const drop = step >= 4 ? 0.42 : 0;
  const gap = 1.45 - drop;
  return (
    <group>
      <group position={[-2.05, 0.05, 0]}>
        <OctaMesh color="#6d4bd6" scale={0.48} />
        <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.12} label="Pb²⁺" />
        <Ion position={[0.48, 0, 0]} color="#6d4bd6" radius={0.09} label="I⁻" />
        <Tag position={[0, -0.85, 0]}>PbI₆</Tag>
      </group>
      <group position={[0.55, 0, 0]}>
        <Slab position={[0, -0.72, 0]} size={[2.5, 0.22, 0.85]} color="#c46a45" />
        <Tag position={[0, -1.12, 0]}>hóa trị · I 5p + Pb 6s</Tag>
        <Slab position={[0, 0.72 - drop, 0]} size={[2.5, 0.22, 0.85]} color="#4d86d6" />
        <Tag position={[0, 1.12 - drop, 0]}>{step >= 4 ? "dẫn · Pb 6p bị kéo xuống" : "dẫn · Pb 6p"}</Tag>
        {step >= 1 ? (
          <Pop>
            <mesh position={[0.15, (0.72 - drop - 0.72) / 2, 0.2]}>
              <cylinderGeometry args={[0.03, 0.03, Math.max(0.35, gap - 0.28), 8]} />
              <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.55} />
            </mesh>
            <Tag position={[1.15, 0.05 - drop * 0.5, 0]}>nhảy thẳng</Tag>
          </Pop>
        ) : null}
        {step >= 2 ? (
          <group>
            <mesh position={[-0.85, 0.72 - drop, 0.35]}>
              <sphereGeometry args={[0.09, 14, 12]} />
              <meshStandardMaterial color="#79b0ff" emissive="#79b0ff" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[-0.85, -0.72, 0.35]}>
              <sphereGeometry args={[0.09, 14, 12]} />
              <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.55} />
            </mesh>
            {step < 4 ? <Tag position={[-0.85, 1.12, 0]}>cả hai đều nhẹ</Tag> : null}
          </group>
        ) : null}
        {step >= 3 ? (
          <group>
            <mesh position={[0.85, -0.42, 0.35]}>
              <sphereGeometry args={[0.08, 12, 10]} />
              <meshStandardMaterial color="#8fd0a8" emissive="#8fd0a8" emissiveIntensity={0.55} />
            </mesh>
            <Tag position={[0.85, -0.15, 0]}>bẫy nông</Tag>
          </group>
        ) : null}
      </group>
      <Tag position={[0.4, -1.62, 0]} accent>
        {step === 0
          ? "đỉnh hóa trị không phải từ chì"
          : step === 1
            ? "không cần dao động mạng"
            : step === 2
              ? "nên điện tích đi xa"
              : step === 3
                ? "khuyết tật dễ gặp chỉ sát mép"
                : "bỏ spin–quỹ đạo thì đoán Eg sai"}
      </Tag>
    </group>
  );
}

const MIX_A: { color: string; label?: string }[] = [
  { color: "#3cba84" },
  { color: "#3cba84" },
  { color: "#3cba84" },
  { color: "#e6c15a", label: "FA" },
  { color: "#3cba84" },
  { color: "#3cba84" },
  { color: "#79b0ff", label: "Cs" },
  { color: "#3cba84", label: "MA" },
];

function AlloyScene({ step }: { step: number }) {
  const br = useSim((s) => s.br);
  const sn = useSim((s) => s.sn);
  const light = useSim((s) => s.light);
  const eg = egFromHalide(step >= 4 ? 0 : br, step === 5 ? sn : 0);
  if (step === 3) {
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
  const xColor = step >= 4 ? "#6d4bd6" : egHex(egFromHalide(br, 0));
  const xLabel = step === 5 ? "X" : step >= 2 ? "X = Br" : br > 8 ? "X = I/Br" : "X = I";
  return (
    <group>
      <UnitCell
        a="#3cba84"
        b={step === 5 ? "#d2a36a" : "#c5ccd6"}
        x={xColor}
        aLabel={step === 4 ? undefined : undefined}
        bLabel={step === 5 ? "Sn/Pb" : undefined}
        xLabel={step === 4 ? "X" : xLabel}
        highlight={step === 5 ? "B" : step === 4 ? "A" : "X"}
        solo={step !== 4}
        showOcta
        cornerColors={step === 4 ? MIX_A.map((c) => c.color) : undefined}
        cornerLabels={step === 4 ? MIX_A.map((c) => c.label) : undefined}
      />
      <Tag position={[0, 1.85, 0]} accent>
        {step === 5 ? "trộn ở vị trí B" : step === 4 ? "trộn ở vị trí A" : step >= 2 ? "thuần brom" : "trộn ở vị trí X"}
      </Tag>
      <Tag position={[0, -1.65, 0]}>Eg {eg.toFixed(2)} eV</Tag>
    </group>
  );
}

function NanoScene({ step }: { step: number }) {
  const nWell = useSim((s) => s.nWell);
  if (step === 0) {
    return (
      <group>
        <group position={[-1.35, 0.1, 0]}>
          <OctaMesh color="#6d4bd6" scale={0.55} />
          <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.12} />
          <Tag position={[0, 0.85, 0]}>viên gạch · vài nm</Tag>
        </group>
        <group position={[1.15, 0.1, 0]}>
          <Slab position={[0, 0, 0]} size={[1.7, 0.22, 1.05]} color="#241c38" />
          <Tag position={[0, 0.55, 0]}>màng · 0,5 µm</Tag>
        </group>
        <Tag position={[0, -1.4, 0]} accent>
          cùng vật liệu · khác thước
        </Tag>
      </group>
    );
  }
  if (step === 1) {
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
  if (step === 2) {
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
  if (step === 4) {
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
  const n = nWell >= 90 ? 4 : Math.max(1, Math.min(4, nWell));
  const eg = WELL_EG[nWell] ?? 1.52;
  return (
    <group>
      <Slab position={[0, -0.72, 0]} size={[2.5, 0.07, 1.2]} color="#3cba84" />
      {Array.from({ length: n }).map((_, i) => (
        <Slab key={i} position={[0, -0.5 + i * 0.32, 0]} size={[2.1, 0.14, 1.05]} color="#6d4bd6" emissive={0.15} />
      ))}
      <Slab position={[0, -0.5 + n * 0.32, 0]} size={[2.5, 0.07, 1.2]} color="#3cba84" />
      <Tag position={[0, 1.45, 0]} accent>
        {nWell >= 90 ? "n = ∞ · 3D" : `n = ${n}`} · Eg {eg.toFixed(2)} eV
      </Tag>
      <Tag position={[0, -1.35, 0]}>lớp lục cắt khung thành giếng</Tag>
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
