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

function PartsScene(_props: { step: number }) {
  const inspect = useSim((s) => s.inspect);
  const pick = (which: "A" | "B" | "X") => {
    const text =
      which === "B"
        ? "B · Pb²⁺ hoặc Sn²⁺ · quyết định vùng dẫn"
        : which === "X"
          ? "X · I⁻ Br⁻ Cl⁻ · quyết định vùng hóa trị"
          : "A · MA⁺ FA⁺ Cs⁺ · giữ khung, đổi Eg gián tiếp";
    useSim.getState().patch({ inspect: text });
  };
  return (
    <group>
      <UnitCell
        a="#3cba84"
        b="#c5ccd6"
        x="#6d4bd6"
        aLabel="A +1"
        bLabel="B +2"
        xLabel="X −1"
        highlight={inspect?.startsWith("A") ? "A" : inspect?.startsWith("B") ? "B" : inspect?.startsWith("X") ? "X" : "none"}
        organic
        onPick={pick}
      />
      <Tag position={[0, -1.7, 0]}>bấm vào ion</Tag>
    </group>
  );
}

function BuildScene({ step }: { step: number }) {
  const ions = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const e = step === 0 ? Math.min(1, clock.elapsedTime / 1.7) : 1;
    const k = 1 - (1 - e) ** 3;
    ions.current?.children.forEach((child, i) => {
      const p = FACES[i];
      if (!p) return;
      const far = 2.7 - 1.7 * k;
      child.position.set(p[0] * far, p[1] * far, p[2] * far);
    });
    if (shell.current) shell.current.scale.setScalar(0.2 + 0.8 * k);
  });
  if (step >= 3) {
    return (
      <group>
        <UnitCell a="#e6c15a" b="#c5ccd6" x="#6d4bd6" aLabel="A ×1/8" bLabel="B ×1" xLabel="X ×1/2" highlight="A" />
        <Tag position={[0, 2.2, 0]} accent>
          8×1/8 + 1 + 6×1/2 = ABX₃
        </Tag>
      </group>
    );
  }
  return (
    <group>
      <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.28} label="Pb²⁺" />
      <group ref={shell}>
        <OctaMesh color="#6d4bd6" />
      </group>
      <group ref={ions}>
        {FACES.map((p, i) => (
          <Ion key={i} position={p} color="#6d4bd6" radius={0.16} label={i === 0 ? "I⁻" : undefined} />
        ))}
      </group>
      {step >= 1 ? (
        <Pop>
          {[-1.15, 1.15].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <OctaMesh color="#8a74e0" scale={0.72} opacity={0.2} />
            </group>
          ))}
          <Tag position={[0, 1.7, 0]}>nối góc</Tag>
        </Pop>
      ) : null}
      {step >= 2 ? (
        <Pop>
          <Molecule position={[0, 1.15, 0]} color="#e6c15a" />
          <Tag position={[0, 1.7, 0.4]}>A rơi vào hốc</Tag>
        </Pop>
      ) : null}
    </group>
  );
}

function ToleranceScene({ step }: { step: number }) {
  const cation = useSim((s) => s.cation);
  const mixCs = useSim((s) => s.mixCs);
  const rA = cation === "Cs" ? ION.cs : cation === "MA" ? ION.ma : ION.fa;
  const t = tolerance(mixCs ? ION.fa * 0.95 + ION.cs * 0.05 : rA);
  const danger = t < 0.88 || t > 0.98;
  const x = ((t - 0.7) / 0.4) * 4 - 2;
  return (
    <group>
      <group position={[0, 0.35, 0]}>
        <OctaMesh color={danger ? "#e6c15a" : "#6d4bd6"} scale={1.15} />
        <Ion position={[0, 0, 0]} color={cation === "Cs" ? "#79b0ff" : cation === "MA" ? "#3cba84" : "#e6c15a"} radius={0.22 + (rA - 1.8) * 0.28} label={mixCs ? "FA + 5% Cs" : cation} />
      </group>
      {t < 0.88 ? (
        <group position={[2.1, 0.2, 0]} rotation={[0.4, 0.2, 0.6]}>
          <OctaMesh color="#e6c15a" scale={0.55} />
          <group position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <OctaMesh color="#e6c15a" scale={0.55} />
          </group>
          <Tag position={[0.3, 1.1, 0]}>pha delta · chung cạnh</Tag>
        </group>
      ) : null}
      {t > 0.98 && !mixCs ? (
        <group position={[2.1, 0.2, 0]}>
          <OctaMesh color="#e6c15a" scale={0.6} />
          <group position={[0.15, 0.45, 0]}>
            <OctaMesh color="#e08a55" scale={0.6} />
          </group>
          <Tag position={[0.2, 1.25, 0]}>lục giác · chung mặt</Tag>
        </group>
      ) : null}
      <mesh position={[0, -1.35, 0]}>
        <boxGeometry args={[4.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#1e2832" />
      </mesh>
      <mesh position={[0, -1.35, 0]}>
        <boxGeometry args={[2.1, 0.12, 0.12]} />
        <meshStandardMaterial color="#8fd0a8" />
      </mesh>
      <mesh position={[x, -1.35, 0.1]}>
        <sphereGeometry args={[0.12, 14, 12]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.7} />
      </mesh>
      <Tag position={[0, -1.75, 0]} accent>
        t ≈ {t.toFixed(2)} {step >= 5 ? "· t chỉ là sàng lọc" : ""}
      </Tag>
    </group>
  );
}

function PhasesScene(_props: { step: number }) {
  const temp = useSim((s) => s.temp);
  const phase = phaseFromTemp(temp);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const ang = useRef(0);
  useFrame((_, dt) => {
    ang.current += (phase.tilt - ang.current) * (1 - Math.exp(-4 * Math.min(dt, 0.05)));
    if (left.current) {
      left.current.rotation.z = ang.current;
      left.current.rotation.x = phase.axes === 3 ? ang.current * 0.8 : 0;
    }
    if (right.current) {
      right.current.rotation.z = -ang.current;
      right.current.rotation.y = phase.axes === 3 ? ang.current : 0;
    }
  });
  const angle = 180 - (phase.tilt * 180) / Math.PI;
  return (
    <group>
      <group ref={left} position={[-0.85, 0, 0]}>
        <OctaMesh color="#6d4bd6" scale={0.85} />
        <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.16} />
      </group>
      <group ref={right} position={[0.85, 0, 0]}>
        <OctaMesh color="#8a74e0" scale={0.85} />
        <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.16} />
      </group>
      <Ion position={[0, 0, 0]} color="#6d4bd6" radius={0.14} label="I" />
      <Tag position={[0, 1.6, 0]} accent>
        {phase.name} · Pb–I–Pb ≈ {angle.toFixed(0)}°
      </Tag>
      <Tag position={[0, -1.45, 0]}>{phase.range}</Tag>
    </group>
  );
}

function OrbitalsScene({ step }: { step: number }) {
  const drop = step >= 4 ? 0.45 : 0;
  return (
    <group>
      <Slab position={[0, -0.8, 0]} size={[3.4, 0.28, 1.2]} color="#c46a45" />
      <Tag position={[0, -1.25, 0]}>{step === 0 ? "I 5p + Pb 6s²" : "đỉnh vùng hóa trị"}</Tag>
      <Slab position={[0, 0.85 - drop, 0]} size={[3.4, 0.28, 1.2]} color="#4d86d6" />
      <Tag position={[0, 1.35 - drop, 0]}>{step >= 4 ? "Pb 6p bị spin–quỹ đạo kéo xuống" : "đáy vùng dẫn · Pb 6p"}</Tag>
      {step >= 1 ? (
        <Pop>
          <mesh position={[0, 0.05, 0.2]}>
            <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
            <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.5} />
          </mesh>
          <Tag position={[1.5, 0.1, 0]}>nhảy thẳng</Tag>
        </Pop>
      ) : null}
      {step >= 2 ? (
        <group>
          <mesh position={[-1.3, 0.95 - drop, 0.4]}>
            <sphereGeometry args={[0.1, 14, 12]} />
            <meshStandardMaterial color="#79b0ff" emissive="#79b0ff" emissiveIntensity={0.7} />
          </mesh>
          <Tag position={[-1.3, 1.55 - drop, 0]}>nhẹ, đi nhanh</Tag>
        </group>
      ) : null}
      {step >= 3 ? (
        <mesh position={[1.2, -0.45, 0.45]}>
          <sphereGeometry args={[0.08, 12, 10]} />
          <meshStandardMaterial color="#8fd0a8" emissive="#8fd0a8" emissiveIntensity={0.5} />
        </mesh>
      ) : null}
    </group>
  );
}

function AlloyScene({ step }: { step: number }) {
  const br = useSim((s) => s.br);
  const sn = useSim((s) => s.sn);
  const light = useSim((s) => s.light);
  const eg = egFromHalide(br, sn);
  const hoke = light && br > 12 && br < 88;
  const color = egHex(eg);
  return (
    <group>
      {hoke ? (
        <group>
          <group position={[-1.15, 0, 0]}>
            <OctaMesh color="#6d4bd6" />
            <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.22} />
            <Tag position={[0, 1.35, 0]}>giàu I · Eg thấp</Tag>
          </group>
          <group position={[1.15, 0, 0]}>
            <OctaMesh color="#e07a32" />
            <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.22} />
            <Tag position={[0, 1.35, 0]}>giàu Br</Tag>
          </group>
          <Tag position={[0, -1.45, 0]} accent>
            Hoke · điện tích dồn về vùng iod
          </Tag>
        </group>
      ) : (
        <group>
          <OctaMesh color={color} scale={1.2} />
          <Ion position={[0, 0, 0]} color={sn > 20 ? "#d2a36a" : "#c5ccd6"} radius={0.26} label={sn > 20 ? "Sn/Pb" : "B"} />
          {step === 4 ? <Molecule position={[0, 1.25, 0]} /> : null}
          <Tag position={[0, 1.7, 0]} accent>
            Eg minh họa {eg.toFixed(2)} eV
          </Tag>
        </group>
      )}
    </group>
  );
}

function NanoScene({ step }: { step: number }) {
  const nWell = useSim((s) => s.nWell);
  if (step <= 1) {
    return (
      <group>
        {[-1.1, 0, 1.1].map((x) =>
          [-0.55, 0.55].map((z) => (
            <group key={`${x}${z}`} position={[x, 0, z]}>
              <Slab position={[0, 0, 0]} size={[0.95, 0.35, 0.85]} color="#3a2a55" />
              <mesh position={[0.48, 0.05, 0]}>
                <boxGeometry args={[0.06, 0.4, 0.9]} />
                <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.25} />
              </mesh>
            </group>
          )),
        )}
        <Tag position={[0, 1.15, 0]}>màng đa tinh thể · ranh giới hạt</Tag>
      </group>
    );
  }
  if (step === 2) {
    return (
      <group>
        {Array.from({ length: 8 }).map((_, i) => {
          const ang = (i / 8) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(ang) * 1.5, Math.sin(i) * 0.25, Math.sin(ang) * 1.5]}>
              <OctaMesh color={i % 2 ? "#6d4bd6" : "#e07a32"} scale={0.28} />
              <mesh position={[0.25, 0.2, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.35, 5]} />
                <meshStandardMaterial color="#8fd0a8" />
              </mesh>
            </group>
          );
        })}
        <Tag position={[0, 1.5, 0]}>chấm lượng tử + phối tử</Tag>
      </group>
    );
  }
  const n = nWell >= 90 ? 4 : nWell;
  const eg = WELL_EG[nWell] ?? 1.52;
  return (
    <group>
      {Array.from({ length: n }).map((_, i) => (
        <Slab key={i} position={[0, -0.55 + i * 0.38, 0]} size={[2.2, 0.16, 1.1]} color="#6d4bd6" emissive={0.15} />
      ))}
      <Slab position={[0, -0.85, 0]} size={[2.5, 0.08, 1.3]} color="#3cba84" />
      <Slab position={[0, -0.55 + n * 0.38, 0]} size={[2.5, 0.08, 1.3]} color="#3cba84" />
      <Tag position={[0, 1.35, 0]} accent>
        n = {nWell >= 90 ? "∞ (3D)" : n} · Eg {eg.toFixed(2)} eV
      </Tag>
    </group>
  );
}

const PROP_CARDS = [
  ["1,48–2,3 eV", "vùng cấm"],
  ["~100 nm", "độ sâu hấp thụ"],
  ["15 meV", "Urbach"],
  ["vài meV", "exciton"],
  ["µm → 100 µm", "khuếch tán"],
  ["0,6 eV", "ion iod nhảy"],
];

function PropsScene({ step }: { step: number }) {
  const shown = step === 0 ? 1 : step === 1 ? 3 : step === 2 ? 5 : 6;
  return (
    <group>
      <UnitCell a="#e6c15a" b="#c5ccd6" x="#6d4bd6" />
      {PROP_CARDS.slice(0, shown).map(([value, label], i) => (
        <Pop key={label}>
          <Tag position={[Math.cos(i) * 2.1, 0.8 - (i % 3) * 0.7, Math.sin(i) * 1.6]} accent={i === shown - 1}>
            {value} · {label}
          </Tag>
        </Pop>
      ))}
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
