import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { QUIZ, REFS } from "@/lib/sim/content";
import { FlowDots, OctaMesh, Slab, Tag, UnitCell } from "./kit";
import { PlotFrame, Polyline } from "./plot";

const RACE_SINGLE: [number, number][] = [
  [2009, 3.8],
  [2012, 10],
  [2013, 16],
  [2016, 22],
  [2019, 25.2],
  [2023, 26.1],
  [2026, 27.3],
];
const RACE_TANDEM: [number, number][] = [
  [2016, 18],
  [2019, 26],
  [2022, 31],
  [2024, 33.5],
  [2026, 35],
];

function RaceScene({ step }: { step: number }) {
  return (
    <PlotFrame x0={2009} x1={2026} y0={0} y1={40} xLabel="năm" yLabel="%" w={6.4}>
      {(map) => (
        <group>
          <Polyline pts={RACE_SINGLE.map(([x, y]) => map(x, y))} color="#e08a55" />
          {step >= 2 ? <Polyline pts={RACE_TANDEM.map(([x, y]) => map(x, y))} color="#79b0ff" /> : null}
          <Polyline pts={[map(2009, 33.7), map(2026, 33.7)]} color="#8fd0a8" radius={0.015} />
          <Tag position={map(2012, 36)}>SQ 33,7%</Tag>
          <Tag position={map(2018, 3.8)}>{step === 0 ? "3,8% · 2009" : "một lớp"}</Tag>
          {step >= 2 ? <Tag position={map(2024, 35)}>tandem 35%</Tag> : null}
          <Tag position={map(2026, 27.3)} accent>
            27,3%
          </Tag>
        </group>
      )}
    </PlotFrame>
  );
}

const TECHS = [
  { name: "Silicon", h: 2.75, color: "#b7c3ce", pce: "27–28%", thick: "150–180 µm", heat: ">1400 °C" },
  { name: "CdTe", h: 2.3, color: "#3cba84", pce: "~23%", thick: "vài µm", heat: "500–600 °C" },
  { name: "OPV", h: 2.0, color: "#79b0ff", pce: "~20%", thick: "~0,1 µm", heat: "<150 °C" },
  { name: "Perovskite", h: 2.73, color: "#6d4bd6", pce: "27,3%", thick: "~0,5 µm", heat: "100–150 °C" },
];

function CompareScene({ step }: { step: number }) {
  return (
    <group>
      <Tag position={[-2.7, -1.15, 0]}>0%</Tag>
      <Tag position={[-2.7, 1.7, 0]}>hiệu suất</Tag>
      {TECHS.map((t, i) => (
        <group key={t.name} position={[-2.1 + i * 1.45, -1.15, 0]}>
          <Slab position={[0, t.h / 2, 0]} size={[0.9, t.h, 0.7]} color={t.color} emissive={i === 3 ? 0.25 : 0.04} />
          <Tag position={[0, t.h + 0.28, 0]}>{t.name}</Tag>
          <Tag position={[0, t.h + 0.62, 0]} accent>
            {t.pce}
          </Tag>
          {step >= 1 ? <Tag position={[0, -0.28, 0.2]}>{t.thick}</Tag> : null}
          {step >= 2 ? <Tag position={[0, -0.58, 0.2]}>{t.heat}</Tag> : null}
        </group>
      ))}
      {step >= 3 ? <Tag position={[2.2, 1.55, 0]}>bền: Si, CdTe đã có 25 năm</Tag> : null}
    </group>
  );
}

function FinaleScene({ step }: { step: number }) {
  const ring = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ring.current) ring.current.rotation.y = clock.elapsedTime * 0.35;
  });
  if (step === 0) {
    return (
      <group>
        <Slab position={[0, 0, 0]} size={[1.8, 0.28, 1.1]} color="#3a2a55" />
        <FlowDots count={3} color="#e4a23a" speed={0.45} path={(t) => [0, 1.3 - t * 1.15, 0.35]} />
        <FlowDots count={3} color="#79b0ff" speed={0.3} path={(t) => [-0.2 - t * 1.1, 0.15, 0.2]} />
        <FlowDots count={3} color="#e08a55" speed={0.3} path={(t) => [0.2 + t * 1.1, -0.15, 0.2]} />
        <Tag position={[0, 1.45, 0]} accent>
          bốn bước
        </Tag>
        <Tag position={[-1.5, 0.2, 0]}>hấp thụ</Tag>
        <Tag position={[1.55, 0, 0]}>thu điện</Tag>
      </group>
    );
  }
  if (step === 1) {
    return (
      <group>
        <UnitCell aLabel="A" bLabel="B" xLabel="X" highlight="A" />
        <Tag position={[-1.5, 1.2, 0]}>núm A</Tag>
        <Tag position={[0, 1.45, 0]} accent>
          núm B
        </Tag>
        <Tag position={[1.5, 1.2, 0]}>núm X</Tag>
      </group>
    );
  }
  if (step === 2) {
    return (
      <group>
        <Slab position={[-1.1, 0.15, 0]} size={[0.7, 0.45, 0.5]} color="#e08a55" />
        <Slab position={[1.1, 0.85, 0]} size={[0.7, 1.7, 0.5]} color="#6d4bd6" emissive={0.25} />
        <Tag position={[-1.1, 0.7, 0]}>3,8%</Tag>
        <Tag position={[1.1, 1.95, 0]} accent>
          27,3%
        </Tag>
        <Tag position={[0, -1.15, 0]}>một lớp</Tag>
      </group>
    );
  }
  if (step === 3) {
    return (
      <group>
        <OctaMesh color="#6d4bd6" scale={0.7} />
        <group ref={ring}>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 1.35, Math.sin(a) * 0.85, 0]}>
                <sphereGeometry args={[0.12, 12, 10]} />
                <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.45} />
              </mesh>
            );
          })}
        </group>
        <Tag position={[0, 1.55, 0]} accent>
          năm kẻ thù
        </Tag>
      </group>
    );
  }
  if (step === 4) {
    return (
      <group>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[(i % 4) * 0.45 - 0.7, Math.floor(i / 4) * 0.4 - 0.1, 0]}>
            <sphereGeometry args={[0.1, 12, 10]} />
            <meshStandardMaterial color="#6d4bd6" emissive="#6d4bd6" emissiveIntensity={0.35} />
          </mesh>
        ))}
        <Slab position={[0, -0.85, 0]} size={[2.2, 0.08, 1.2]} color="#2a2140" />
        <Tag position={[0, 1.2, 0]} accent>
          mầm cùng lúc
        </Tag>
      </group>
    );
  }
  if (step === 5) {
    const layers = ["#9ec9ea", "#c46a45", "#b07adf", "#3a2a55", "#8b939e", "#d9d3c8", "#b7daf2"];
    return (
      <group>
        {layers.map((c, i) => (
          <Slab key={c} position={[0, -1.05 + i * 0.32, 0]} size={[1.7, i === 3 ? 0.28 : 0.16, 1]} color={c} emissive={i === 3 ? 0.35 : 0.04} />
        ))}
        <Tag position={[1.5, 0, 0]} accent>
          mỗi lớp một việc
        </Tag>
      </group>
    );
  }
  return (
    <group>
      <Slab position={[0, -0.25, 0]} size={[2.2, 0.35, 1.2]} color="#b7c3ce" />
      <Slab position={[0, 0.12, 0]} size={[2.2, 0.08, 1.2]} color="#6d4bd6" emissive={0.3} />
      <Tag position={[-1.3, 0.7, 0]}>Si · 150–180 µm</Tag>
      <Tag position={[1.15, 0.7, 0]} accent>
        tandem
      </Tag>
      <Tag position={[0, -1.15, 0]}>đo T80</Tag>
    </group>
  );
}

function QuizScene({ step }: { step: number }) {
  const q = QUIZ[step];
  if (step === 0) {
    return (
      <group>
        <Slab position={[0, 0, 0]} size={[1.6, 0.7, 1]} color="#2a2140" />
        <FlowDots count={1} color="#7a3030" speed={0.15} path={(t) => [0, 1.2 - t * 2.2, 0.4]} />
        <Tag position={[0, 1.3, 0]}>900 nm · 1,38 eV</Tag>
      </group>
    );
  }
  if (step === 1) return <UnitCell aLabel="1/8" bLabel="1" xLabel="1/2" highlight="A" />;
  if (step === 2) {
    return (
      <group>
        <group position={[-1.2, 0, 0]}>
          <OctaMesh color="#e6c15a" scale={0.7} />
          <Tag position={[0, 1.1, 0]}>Cs nhỏ</Tag>
        </group>
        <group position={[1.2, 0, 0]}>
          <OctaMesh color="#e08a55" scale={0.7} />
          <Tag position={[0, 1.1, 0]}>FA lớn</Tag>
        </group>
      </group>
    );
  }
  if (step === 3) {
    return (
      <group>
        <Tag position={[0, 0.4, 0]} accent>
          2 × 60 mV ≈ 120 mV
        </Tag>
        <Tag position={[0, -0.4, 0]}>1% → 0,01%</Tag>
      </group>
    );
  }
  if (step === 4) {
    return (
      <group>
        <Slab position={[0, 0.25, 0]} size={[1.6, 0.1, 1]} color="#6d4bd6" />
        <Slab position={[0, -0.15, 0]} size={[1.6, 0.28, 1]} color="#b7c3ce" />
        <Tag position={[0, 0.8, 0]}>hai Eg, một nắng</Tag>
      </group>
    );
  }
  return (
    <group>
      <Slab position={[0, 0, 0]} size={[1.7, 0.35, 1]} color="#3a2a55" />
      <Slab position={[0, 0.28, 0]} size={[1.8, 0.06, 1.1]} color="#b07adf" />
      <Slab position={[0, 0.5, 0]} size={[1.8, 0.08, 1.1]} color="#d9d3c8" />
      <Tag position={[0, 1.1, 0]}>{q ? "2D + SnO₂" : ""}</Tag>
    </group>
  );
}

function RefsScene({ step }: { step: number }) {
  const safe = ((step % REFS.length) + REFS.length) % REFS.length;
  return (
    <group>
      {REFS.map((r, i) => {
        const ang = ((i - safe) / REFS.length) * Math.PI * 2;
        const active = i === safe;
        return (
          <mesh
            key={r.n}
            position={[Math.sin(ang) * 2.6, active ? 0.4 : -0.2, Math.cos(ang) * 2.6]}
            scale={active ? 1.35 : 0.55}
          >
            <boxGeometry args={[0.42, 0.62, 0.08]} />
            <meshStandardMaterial color={active ? "#e4a23a" : "#24303a"} />
          </mesh>
        );
      })}
      <Tag position={[0, 1.45, 0]} accent>
        [{REFS[safe]?.n}] {REFS[safe]?.cite.slice(0, 48)}
      </Tag>
    </group>
  );
}

export const lateScenes = {
  race: RaceScene,
  compare: CompareScene,
  finale: FinaleScene,
  quiz: QuizScene,
  refs: RefsScene,
};
