import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { REFS } from "@/lib/sim/content";
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
  refs: RefsScene,
};
