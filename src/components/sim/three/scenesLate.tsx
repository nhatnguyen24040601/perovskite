import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { QUIZ, REFS } from "@/lib/sim/content";
import { tr } from "@/lib/sim/i18n";
import { vocFromPlqy } from "@/lib/sim/physics";
import { useSim } from "@/lib/sim/store";
import { FlowDots, Ion, Molecule, OctaMesh, Slab, Tag, UnitCell } from "./kit";
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

function PlqyScene(_props: { step: number }) {
  const plqy = useSim((s) => s.plqy);
  const voc = vocFromPlqy(plqy);
  const glow = Math.min(1.4, 0.15 + Math.sqrt(plqy) * 1.3);
  return (
    <group>
      <Slab position={[0, 0, 0]} size={[1.8, 0.22, 1.2]} color="#2a2140" />
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.34, 22, 16]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={glow} transparent opacity={0.85} />
      </mesh>
      <Tag position={[0, 1.15, 0]} accent>
        Voc ≈ {voc.toFixed(3)} V
      </Tag>
      <Tag position={[0, -0.7, 0]}>PLQY {(plqy * 100).toFixed(plqy < 0.01 ? 3 : 2)}%</Tag>
    </group>
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

function EnemiesScene({ step }: { step: number }) {
  const enemy = useSim((s) => s.enemy);
  const defense = useSim((s) => s.defense);
  const which = step >= 5 ? enemy : step + 1;
  const grains = [-0.7, 0.15, 0.95];
  return (
    <group>
      {grains.map((x) => (
        <Slab
          key={x}
          position={[x, 0, 0]}
          size={[0.7, 0.45, 0.8]}
          color={which === 1 && !defense ? "#e6c15a" : "#3a2a55"}
        />
      ))}
      {which === 1 ? (
        <FlowDots count={6} color="#79b0ff" speed={defense ? 0.05 : 0.3} path={(t) => [-1.4 + t * (defense ? 0.4 : 2.6), 0.7 - t * 0.5, 0.4]} />
      ) : null}
      {which === 2 ? (
        <group>
          <Molecule position={[0, 0.8, 0.4]} color="#e15b4c" scale={0.7} />
          <Tag position={[0, 1.3, 0]}>O₂ + ánh sáng</Tag>
        </group>
      ) : null}
      {which === 3 ? (
        <group>
          <Molecule position={[0, defense ? 0.45 : 1.1, 0]} color="#3cba84" />
          <Tag position={[0, 1.45, 0]}>{defense ? "FA/Cs ở lại" : "MA bay hơi"}</Tag>
        </group>
      ) : null}
      {which === 4 ? (
        <group>
          <Slab position={[0, -0.55, 0]} size={[2.4, 0.12, 1]} color="#d7dde6" />
          <Tag position={[0, -0.9, 0]}>TiO₂ + UV</Tag>
          {!defense ? <Tag position={[0, 0.85, 0]} accent>bẫy sâu</Tag> : null}
        </group>
      ) : null}
      {which === 5 ? (
        <FlowDots
          count={5}
          color="#6d4bd6"
          speed={defense ? 0.04 : 0.25}
          path={(t) => [-0.8 + t * (defense ? 0.3 : 1.8), 0.15, 0.45]}
        />
      ) : null}
      {defense ? (
        <mesh>
          <sphereGeometry args={[1.7, 24, 16]} />
          <meshBasicMaterial color="#9ec9ea" wireframe transparent opacity={0.35} />
        </mesh>
      ) : null}
      <Tag position={[0, -1.45, 0]}>kẻ thù {which}/5 {defense ? "· có phòng thủ" : ""}</Tag>
    </group>
  );
}

function NucleationScene({ step }: { step: number }) {
  return (
    <group>
      <group position={[-1.6, 0, 0]}>
        {[-0.45, 0.05, 0.55].map((x) =>
          [-0.35, 0.25].map((z) => (
            <Slab key={`${x}${z}`} position={[x, 0, z]} size={[0.42, 0.28, 0.42]} color="#3a2a55" />
          )),
        )}
        <Tag position={[0, 1, 0]} accent={step === 1}>
          mầm cùng lúc
        </Tag>
      </group>
      <group position={[1.6, 0, 0]}>
        <Slab position={[-0.4, 0, 0]} size={[0.55, 0.4, 0.5]} color="#3a2a55" />
        <Slab position={[0.45, 0, 0.2]} size={[0.3, 0.18, 0.3]} color="#5a4a78" />
        <mesh position={[0.05, 0.05, -0.15]}>
          <circleGeometry args={[0.16, 16]} />
          <meshBasicMaterial color="#0b0f13" />
        </mesh>
        <Tag position={[0, 1, 0]} accent={step === 2}>
          lỗ kim
        </Tag>
      </group>
      {step === 0 ? <Tag position={[0, -1.3, 0]}>tạo mầm → lớn lên</Tag> : null}
    </group>
  );
}

function MethodsScene({ step }: { step: number }) {
  const locale = useSim((s) => s.locale);
  if (step === 0) return <MethodCards step={0} />;
  return (
    <group>
      {step === 1 ? <SpinTour /> : null}
      {step === 2 ? (
        <group>
          <Slab position={[0, -0.25, 0]} size={[2.2, 0.16, 1.3]} color="#e6c15a" />
          <Slab position={[0, 0.02, 0]} size={[2.2, 0.18, 1.3]} color="#2a2140" />
          <FlowDots count={8} color="#3cba84" speed={0.4} path={(t) => [-0.9 + t * 1.8, 1.1 - t * 0.9, 0.2]} />
          <Tag position={[0, 1.35, 0]} accent>
            MAI/FAI đi vào · vàng → đen
          </Tag>
        </group>
      ) : null}
      {step === 3 ? (
        <group>
          <mesh>
            <boxGeometry args={[2.4, 1.6, 1.5]} />
            <meshBasicMaterial color="#79b0ff" wireframe transparent opacity={0.4} />
          </mesh>
          <Slab position={[0, -0.55, 0]} size={[1.2, 0.08, 0.6]} color="#e0b15a" emissive={0.8} />
          <FlowDots count={10} color="#f4efe6" speed={0.35} path={(t) => [(t - 0.5) * 0.8, -0.4 + t * 0.9, 0]} />
          <Tag position={[0, 1.25, 0]} accent>
            nguồn nóng · hơi đi lên
          </Tag>
        </group>
      ) : null}
      {step === 4 ? (
        <group>
          <mesh>
            <cylinderGeometry args={[0.7, 0.62, 1.3, 24]} />
            <meshStandardMaterial color="#9ec9ea" transparent opacity={0.28} />
          </mesh>
          <OctaMesh color="#6d4bd6" scale={0.55} />
          <Tag position={[0, 1.25, 0]} accent>
            tinh thể lớn dần
          </Tag>
        </group>
      ) : null}
      {step === 5 ? (
        <group>
          {Array.from({ length: 7 }).map((_, i) => (
            <group key={i} position={[-1.8 + i * 0.6, 0, 0]}>
              <OctaMesh color={["#6d4bd6", "#4d86d6", "#3ec4c4", "#3cba84", "#e6c15a", "#e07a32", "#e15b4c"][i]!} scale={0.28} />
            </group>
          ))}
          <Tag position={[0, 1.15, 0]} accent>
            nước đá · ~10 nm · 410–700 nm
          </Tag>
        </group>
      ) : null}
      {step === 6 ? <BladeTour /> : null}
      {step === 7 ? (
        <group>
          {[-1.5, 1.5].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.25, 16]} />
              <meshStandardMaterial color="#9aa6b4" />
            </mesh>
          ))}
          <Slab position={[0, 0, 0]} size={[2.4, 0.05, 0.8]} color="#3a2a55" />
          <Tag position={[0, 1.05, 0]} accent>
            cuộn → phủ khe → sấy · 10–14%
          </Tag>
        </group>
      ) : null}
      <Tag position={[0, -1.45, 0]}>
        {tr(locale, "đang xem lối")} {step}
      </Tag>
    </group>
  );
}

function MethodCards({ step }: { step: number }) {
  const locale = useSim((s) => s.locale);
  const cards = [
    { name: "1 quay phủ", color: "#6d4bd6" },
    { name: "2 hai bước", color: "#e6c15a" },
    { name: "3 chân không", color: "#79b0ff" },
    { name: "4 đơn tinh thể", color: "#b07adf" },
    { name: "5 chấm lượng tử", color: "#e07a32" },
    { name: "6 dao gạt", color: "#8fd0a8" },
    { name: "7 phủ khe", color: "#e4a23a" },
  ];
  return (
    <group>
      {cards.map((c, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = -2.25 + col * 1.5;
        const y = 0.85 - row * 1.55;
        const on = step === 0 || step === i + 1;
        return (
          <group key={c.name} position={[x, y, 0]}>
            <Slab position={[0, 0, 0]} size={[1.25, 0.72, 0.12]} color={on ? c.color : "#1e2832"} emissive={on ? 0.28 : 0} />
            <Tag position={[0, 0, 0.2]} accent={step === i + 1}>
              {c.name}
            </Tag>
          </group>
        );
      })}
      <Tag position={[0, -1.55, 0]} accent>
        {tr(locale, "chọn một lối — các mục sau đi từng nhịp")}
      </Tag>
    </group>
  );
}

function SpinTour() {
  const [phase, setPhase] = useState(0);
  useFrame(({ clock }) => {
    const p = Math.floor((clock.elapsedTime % 8) / 2);
    setPhase((cur) => (cur === p ? cur : p));
  });
  const labels = ["1 nhỏ mực", "2 quay ly tâm", "3 dung môi đối", "4 sấy 100–150 °C"];
  return (
    <group>
      <SpinRig phase={phase} />
      <Tag position={[0, 1.55, 0]} accent>
        {labels[phase] ?? labels[0]}
      </Tag>
    </group>
  );
}

function BladeTour() {
  const blade = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % 3) / 3;
    if (blade.current) blade.current.position.x = -1.2 + t * 2.4;
  });
  return (
    <group>
      <Slab position={[0, -0.4, 0]} size={[3.1, 0.06, 1.15]} color="#d5e2ea" />
      <Slab position={[0, -0.32, 0]} size={[2.8, 0.05, 0.95]} color="#6d4bd6" />
      <group ref={blade}>
        <Slab position={[0, 0.15, 0]} size={[0.1, 0.5, 1.25]} color="#d7dde6" />
        <Slab position={[0.25, 0.28, 0]} size={[0.08, 0.2, 1.25]} color="#79b0ff" emissive={0.35} />
      </group>
      <Tag position={[0, 1.15, 0]} accent>
        dao gạt · khe cố định độ dày
      </Tag>
    </group>
  );
}

function SpinRig({ phase }: { phase: number }) {
  const spin = useRef<THREE.Group>(null);
  const drop = useRef<THREE.Mesh>(null);
  const anti = useRef<THREE.Mesh>(null);
  const film = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    const t = (clock.elapsedTime % 4) / 4;
    if (spin.current && phase >= 1 && phase <= 2) spin.current.rotation.y += dt * (phase === 1 ? 2.4 : 3.2);
    if (drop.current) drop.current.position.y = phase === 0 ? 1.15 - (t % 1) * 0.9 : 1.3;
    if (drop.current) drop.current.visible = phase === 0;
    if (anti.current) {
      anti.current.visible = phase === 2;
      anti.current.position.y = 1.05 - ((t + 0.2) % 1) * 0.85;
    }
    if (film.current) {
      const mat = film.current.material as THREE.MeshStandardMaterial;
      if (phase === 0) mat.color.set("#e6c15a");
      else if (phase === 1) mat.color.set("#c9a24a");
      else if (phase === 2) mat.color.set(t > 0.45 ? "#2a2140" : "#8a6a30");
      else mat.color.set("#1a1428");
    }
  });
  return (
    <group ref={spin}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.08, 40]} />
        <meshStandardMaterial color="#2c3946" />
      </mesh>
      <mesh ref={film} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.04, 32]} />
        <meshStandardMaterial color="#e6c15a" />
      </mesh>
      <mesh ref={drop} position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial color="#e6c15a" />
      </mesh>
      <mesh ref={anti} position={[0.15, 0.9, 0]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial color="#79b0ff" />
      </mesh>
      {phase === 3 ? <Slab position={[0, -0.62, 0]} size={[1.8, 0.08, 1.8]} color="#e08a55" emissive={0.45} /> : null}
    </group>
  );
}

function FilmsScene({ step }: { step: number }) {
  if (step <= 3) {
    const labels = ["1 nhỏ mực", "2 quay ly tâm", "3 dung môi đối", "4 sấy 100–150 °C"];
    return (
      <group>
        <SpinRig phase={step} />
        <Tag position={[0, 1.45, 0]} accent>
          {labels[step]}
        </Tag>
        {step === 1 ? <Tag position={[1.7, 0.2, 0]}>mực thừa văng ra</Tag> : null}
        {step === 2 ? <Tag position={[1.7, 0.2, 0]}>chlorobenzene · kết tinh đồng loạt</Tag> : null}
      </group>
    );
  }
  if (step === 4 || step === 5) {
    return (
      <group>
        <Slab position={[0, -0.35, 0]} size={[2.2, 0.08, 1.4]} color="#d5e2ea" />
        <Slab position={[0, -0.22, 0]} size={[2.05, 0.12, 1.25]} color="#e6c15a" />
        {step === 5 ? (
          <Slab position={[0, -0.05, 0]} size={[2.05, step === 5 ? 0.16 : 0.02, 1.25]} color="#2a2140" emissive={0.2} />
        ) : null}
        {step === 5 ? (
          <FlowDots count={10} color="#3cba84" speed={0.35} path={(t) => [-0.9 + t * 1.8, 0.95 - t * 1.05, 0.2]} />
        ) : null}
        <Tag position={[0, 1.15, 0]} accent>
          {step === 4 ? "PbI₂ vàng, chưa có A" : "MAI/FAI đi vào · vàng → đen"}
        </Tag>
      </group>
    );
  }
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.6, 1.7, 1.7]} />
        <meshBasicMaterial color="#79b0ff" wireframe transparent opacity={0.45} />
      </mesh>
      <Slab position={[0, -0.55, 0]} size={[1.5, 0.08, 0.7]} color="#e0b15a" emissive={0.7} />
      <mesh position={[0, 0.55, 0]} rotation={[0.15, 0, 0.2]}>
        <boxGeometry args={[1.35, 0.08, 0.9]} />
        <meshStandardMaterial color={step === 7 ? "#6d4bd6" : "#b7c3ce"} />
      </mesh>
      {step === 7
        ? [-0.45, 0, 0.45].map((x) => (
            <mesh key={x} position={[x, 0.62, 0.15]}>
              <boxGeometry args={[0.22, 0.12, 0.18]} />
              <meshStandardMaterial color="#9aa6b4" />
            </mesh>
          ))
        : null}
      <FlowDots count={12} color="#f4efe6" speed={0.28} path={(t) => [(t - 0.5) * 1.1, -0.35 + t * 0.85, 0]} />
      <Tag position={[0, 1.35, 0]} accent>
        {step === 6 ? "nguồn nóng · hơi đi lên" : "bám theo gờ silicon"}
      </Tag>
    </group>
  );
}

function GrowScene({ step }: { step: number }) {
  const crystal = useRef<THREE.Group>(null);
  const seeds = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (crystal.current && step === 2) {
      const s = 0.35 + (0.85 * (Math.sin(clock.elapsedTime * 0.7) * 0.5 + 0.5));
      crystal.current.scale.setScalar(s);
    }
    if (seeds.current && step === 1) seeds.current.rotation.y = clock.elapsedTime * 0.3;
  });
  if (step <= 3) {
    return (
      <group>
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.78, 0.7, 1.25, 28]} />
          <meshStandardMaterial color="#9ec9ea" transparent opacity={0.32} />
        </mesh>
        {step === 0 ? <Tag position={[0, 1.25, 0]}>lạnh · tan hết · trong</Tag> : null}
        {step >= 1 ? (
          <group ref={seeds}>
            {[
              [-0.2, 0.1, 0.1],
              [0.18, -0.05, -0.12],
              [0.02, 0.22, 0.16],
            ].map((p, i) => (
              <mesh key={i} position={p as [number, number, number]}>
                <sphereGeometry args={[0.06, 12, 10]} />
                <meshStandardMaterial color="#6d4bd6" emissive="#6d4bd6" emissiveIntensity={0.4} />
              </mesh>
            ))}
          </group>
        ) : null}
        {step >= 2 ? (
          <group ref={crystal}>
            <OctaMesh color="#6d4bd6" scale={0.85} />
          </group>
        ) : null}
        {step === 1 ? (
          <mesh position={[0, -0.7, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.08, 24]} />
            <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.6} />
          </mesh>
        ) : null}
        {step === 3 ? (
          <group>
            <FlowDots count={4} color="#f4efe6" speed={0.4} path={(t) => [-1.4 + t * 0.8, 0.4, 0]} />
            <Tag position={[1.3, 0.2, 0]}>đầu dò tia X</Tag>
          </group>
        ) : null}
        <Tag position={[0, 1.35, 0]} accent>
          {["độ tan cao khi lạnh", "đun · quá bão hòa", "tinh thể lớn dần", "đo và đầu dò"][step]}
        </Tag>
      </group>
    );
  }
  if (step === 4 || step === 5) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.85, 28, 20]} />
          <meshStandardMaterial color="#e08a55" transparent opacity={0.28} />
        </mesh>
        {step === 5 ? (
          <FlowDots count={8} color="#79b0ff" speed={0.5} path={(t) => [1.3 - t * 1.1, 1.1 - t * 0.9, 0]} />
        ) : null}
        {step === 5
          ? Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} position={[(i % 4) * 0.22 - 0.33, Math.floor(i / 4) * 0.22 - 0.1, 0.2]}>
                <sphereGeometry args={[0.05, 10, 8]} />
                <meshStandardMaterial color="#e6c15a" />
              </mesh>
            ))
          : null}
        <Tag position={[0, 1.35, 0]} accent>
          {step === 4 ? "140–200 °C · phối tử" : "chích Cs · LaMer"}
        </Tag>
      </group>
    );
  }
  return (
    <group>
      {Array.from({ length: 7 }).map((_, i) => {
        const nm = 410 + i * 48;
        const color = ["#6d4bd6", "#4d86d6", "#3ec4c4", "#3cba84", "#e6c15a", "#e07a32", "#e15b4c"][i]!;
        return (
          <group key={nm} position={[-2.1 + i * 0.7, 0, 0]}>
            <OctaMesh color={color} scale={0.32} />
            <Tag position={[0, 0.75, 0]}>{nm}</Tag>
          </group>
        );
      })}
      <Tag position={[0, -1.15, 0]} accent>
        nước đá · ~10 nm · 410–700 nm
      </Tag>
    </group>
  );
}

function ScaleScene({ step }: { step: number }) {
  const blade = useRef<THREE.Group>(null);
  const web = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime % 3) / 3;
    if (blade.current && (step === 1 || step === 2)) blade.current.position.x = -1.3 + t * 2.6;
    if (web.current && step === 4) web.current.position.x = ((clock.elapsedTime * 0.35) % 1.2) - 0.6;
  });
  if (step === 0) {
    return (
      <group>
        <Slab position={[-1.5, 0, 0]} size={[0.7, 0.08, 0.5]} color="#3a2a55" />
        <Tag position={[-1.5, 0.55, 0]}>0,05–1 cm²</Tag>
        <Slab position={[0.9, 0, 0]} size={[2.3, 0.08, 1.35]} color="#3a2a55" />
        <mesh position={[1.45, 0.1, 0.25]}>
          <sphereGeometry args={[0.08, 12, 10]} />
          <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.8} />
        </mesh>
        <Tag position={[0.9, 0.75, 0]}>một lỗ kim có thể chập cả tấm</Tag>
      </group>
    );
  }
  if (step === 1 || step === 2) {
    return (
      <group>
        <Slab position={[0, -0.45, 0]} size={[3.3, 0.06, 1.25]} color="#d5e2ea" />
        <Slab position={[0, -0.36, 0]} size={[3.1, 0.05, 1.05]} color={step === 2 ? "#2a2140" : "#6d4bd6"} />
        <group ref={blade}>
          <Slab position={[0, 0.05, 0]} size={[0.12, 0.55, 1.35]} color="#d7dde6" />
          {step === 2 ? <Slab position={[0.28, 0.2, 0]} size={[0.08, 0.22, 1.35]} color="#79b0ff" emissive={0.3} /> : null}
        </group>
        <Tag position={[0, 1.05, 0]} accent>
          {step === 1 ? "dao gạt · khe cố định độ dày" : "dao khí N₂ khô tức thì"}
        </Tag>
      </group>
    );
  }
  if (step === 3) {
    return (
      <group>
        <Slab position={[0, -0.4, 0]} size={[3.1, 0.06, 1.1]} color="#1a1428" />
        <Slab position={[0, 0.35, 0]} size={[0.7, 0.28, 1.15]} color="#d7dde6" />
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.18, 0.55, 0.9]} />
          <meshStandardMaterial color="#6d4bd6" transparent opacity={0.85} />
        </mesh>
        <Tag position={[1.5, 0.35, 0]}>đầu phủ đứng yên</Tag>
        <Tag position={[-1.4, -0.75, 0]}>đế chạy →</Tag>
      </group>
    );
  }
  if (step === 4) {
    return (
      <group>
        {[-1.6, 1.6].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 20]} />
            <meshStandardMaterial color="#9aa6b4" />
          </mesh>
        ))}
        <group ref={web}>
          <Slab position={[0, 0, 0]} size={[2.6, 0.05, 0.9]} color="#3a2a55" />
        </group>
        <Slab position={[0, 0.45, 0]} size={[0.35, 0.2, 1]} color="#d7dde6" />
        <Tag position={[0, 1.05, 0]} accent>
          cuộn → phủ khe → sấy · 10–14%
        </Tag>
      </group>
    );
  }
  return (
    <group>
      <mesh>
        <boxGeometry args={[2.8, 1.6, 1.6]} />
        <meshBasicMaterial color="#79b0ff" wireframe />
      </mesh>
      <Slab position={[0, -0.45, 0]} size={[2, 0.08, 1.1]} color="#2a2140" />
      <FlowDots count={14} color="#f4efe6" speed={0.2} path={(t) => [(t - 0.5) * 1.8, 0.7 - t * 1.05, (t - 0.5) * 0.4]} />
      <Tag position={[0, 1.2, 0]}>chân không · phủ đều, kể cả mặt nhám</Tag>
    </group>
  );
}

function AppsScene({ step }: { step: number }) {
  const titles = [
    "Pin một lớp",
    "Tandem",
    "Dẻo",
    "Màn hình",
    "PeLED",
    "Cảm biến",
    "Tia X",
    "Nhiên liệu",
  ];
  return (
    <group>
      {step === 0 ? <Slab position={[0, 0, 0]} size={[1.8, 0.12, 1.2]} color="#2a2140" /> : null}
      {step === 1 ? (
        <group>
          <Slab position={[0, -0.15, 0]} size={[1.8, 0.25, 1.2]} color="#b7c3ce" />
          <Slab position={[0, 0.15, 0]} size={[1.8, 0.08, 1.2]} color="#6d4bd6" />
        </group>
      ) : null}
      {step === 2 ? (
        <mesh rotation={[0.4, 0.3, 0.5]}>
          <boxGeometry args={[1.8, 0.04, 0.9]} />
          <meshStandardMaterial color="#3cba84" />
        </mesh>
      ) : null}
      {step === 3
        ? [-0.6, 0, 0.6].map((x, i) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.08]} />
              <meshStandardMaterial
                color={["#e15b4c", "#8fd0a8", "#4d86d6"][i]}
                emissive={["#e15b4c", "#8fd0a8", "#4d86d6"][i]}
                emissiveIntensity={0.7}
              />
            </mesh>
          ))
        : null}
      {step === 4 ? (
        <mesh>
          <sphereGeometry args={[0.45, 24, 18]} />
          <meshStandardMaterial color="#8fd0a8" emissive="#8fd0a8" emissiveIntensity={1.2} />
        </mesh>
      ) : null}
      {step === 5 ? <Slab position={[0, 0, 0]} size={[1.4, 0.2, 0.8]} color="#1e2832" emissive={0.3} /> : null}
      {step === 6 ? (
        <group>
          <OctaMesh color="#e6c15a" />
          <FlowDots count={2} color="#f4efe6" speed={0.4} path={(t) => [-1.4 + t * 1.5, 0.8 - t * 0.8, 0]} />
        </group>
      ) : null}
      {step === 7 ? (
        <group>
          <Slab position={[-1.1, 0.3, 0]} size={[0.8, 0.1, 0.6]} color="#6d4bd6" />
          <mesh position={[0.7, -0.2, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.7, 20]} />
            <meshStandardMaterial color="#79b0ff" transparent opacity={0.35} />
          </mesh>
          <FlowDots count={4} color="#f4efe6" speed={0.2} path={(t) => [0.7, -0.2 + t * 0.6, 0]} />
        </group>
      ) : null}
      <Tag position={[0, 1.35, 0]} accent>
        {titles[step] ?? ""}
      </Tag>
    </group>
  );
}

const MARKET = [
  ["6/2024", "Oxford PV 26,9%"],
  ["4/2025", "LONGi 34,85%"],
  ["7/2025", "Caelux"],
  ["2026", "NREL 27,3 / 35"],
  ["7/2026", "35,5% chưa NREL"],
  ["2035", "dự báo"],
];

function MarketScene({ step }: { step: number }) {
  return (
    <group>
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[6.2, 0.04, 0.04]} />
        <meshStandardMaterial color="#93a0ac" />
      </mesh>
      {MARKET.map((m, i) => (
        <group key={m[0]} position={[-2.6 + i * 1.05, -0.8, 0]}>
          <mesh position={[0, i === step ? 0.45 : 0.2, 0]}>
            <sphereGeometry args={[i === step ? 0.16 : 0.08, 14, 12]} />
            <meshStandardMaterial color={i === step ? "#e4a23a" : "#1e2832"} emissive={i === step ? "#e4a23a" : "#000"} emissiveIntensity={0.6} />
          </mesh>
          {i === step ? (
            <Tag position={[0, 1.05, 0]} accent>
              {m[0]} · {m[1]}
            </Tag>
          ) : (
            <Tag position={[0, 0.55, 0]}>{m[0]}</Tag>
          )}
        </group>
      ))}
    </group>
  );
}

const BARS = [
  { name: "Pb", v: 27.3, color: "#6d4bd6" },
  { name: "Sn–Pb", v: 24, color: "#d2a36a" },
  { name: "Sn", v: 16.65, color: "#e6c15a" },
  { name: "Cs₂AgBiBr₆", v: 6.37, color: "#e08a55" },
];

function LeadScene({ step }: { step: number }) {
  return (
    <group>
      {BARS.map((b, i) => (
        <group key={b.name} position={[0, 1.1 - i * 0.7, 0]}>
          <Slab position={[-2.2 + b.v / 20, 0, 0]} size={[b.v / 10, 0.32, 0.32]} color={b.color} emissive={step === i ? 0.35 : 0.05} />
          <Tag position={[-2.6, 0, 0]}>{b.name}</Tag>
          <Tag position={[b.v / 10 - 1.6, 0.35, 0]} accent={step === i}>
            {b.v}%
          </Tag>
        </group>
      ))}
    </group>
  );
}

function MiniStack({
  nip,
  active,
}: {
  nip: boolean;
  active: boolean;
}) {
  const cols = nip
    ? ["#e0b15a", "#4d86d6", "#2a2140", "#c46a45", "#d5e2ea"]
    : ["#d5e2ea", "#c46a45", "#2a2140", "#4d86d6", "#e0b15a"];
  return (
    <group scale={active ? 1 : 0.82}>
      {cols.map((c, i) => (
        <Slab key={c + i} position={[0, -0.8 + i * 0.32, 0]} size={[1.3, i === 2 ? 0.4 : 0.18, 0.8]} color={c} />
      ))}
      <Tag position={[0, 1.15, 0]}>{nip ? "n-i-p" : "p-i-n"}</Tag>
      <FlowDots count={3} color="#e4a23a" speed={0.2} path={(t) => [0, nip ? 1 - t * 1.6 : -1.1 + t * 1.6, 0.5]} />
    </group>
  );
}

function PinScene({ step }: { step: number }) {
  const architecture = useSim((s) => s.architecture);
  if (step >= 3) {
    return (
      <group>
        <Slab position={[-1.4, 0.4, 0]} size={[1.1, 0.3, 0.5]} color="#4d86d6" />
        <Slab position={[1.4, -0.3, 0]} size={[1.1, 0.3, 0.5]} color="#c46a45" />
        <Tag position={[-1.4, 0.9, 0]}>ETL · điện tử xuống dốc</Tag>
        <Tag position={[1.4, 0.2, 0]}>HTL · lỗ trống</Tag>
        <FlowDots count={4} color="#79b0ff" speed={0.25} path={(t) => [0.4 - t * 1.6, 0.9 - t * 0.5, 0]} />
        <FlowDots count={4} color="#e08a55" speed={0.25} path={(t) => [-0.2 + t * 1.4, 0.2 - t * 0.45, 0]} />
      </group>
    );
  }
  return (
    <group>
      <group position={[-1.5, 0, 0]}>
        <MiniStack nip active={architecture === "nip" || step === 0} />
      </group>
      <group position={[1.5, 0, 0]}>
        <MiniStack nip={false} active={architecture === "pin" || step >= 1} />
      </group>
    </group>
  );
}

const STACK = [
  { name: "Kính UV", color: "#9ec9ea", h: 0.18 },
  { name: "ITO", color: "#d5e2ea", h: 0.07 },
  { name: "NiOx", color: "#6d8f62", h: 0.1 },
  { name: "SAM", color: "#e6c15a", h: 0.04 },
  { name: "2D dưới", color: "#b07adf", h: 0.06 },
  { name: "Lõi FA/Cs", color: "#3a2a55", h: 0.42 },
  { name: "2D trên", color: "#b07adf", h: 0.06 },
  { name: "C60", color: "#8b939e", h: 0.08 },
  { name: "SnO2", color: "#d9d3c8", h: 0.06 },
  { name: "Cu/Ag", color: "#e0b15a", h: 0.12 },
  { name: "Kính kín", color: "#b7daf2", h: 0.18 },
];

function stackFocus(step: number): number[] {
  if (step <= 0) return [];
  if (step === 1) return [0];
  if (step === 2) return [1, 2, 3];
  return [Math.min(STACK.length - 1, step + 1)];
}

function StackScene({ step }: { step: number }) {
  const explode = useSim((s) => s.explode);
  const focus = stackFocus(step);
  const gap = explode * 0.2;
  const total = STACK.reduce((s, l) => s + l.h, 0) + gap * (STACK.length - 1);
  let y = -total / 2;
  const setStep = useSim((s) => s.setStep);
  return (
    <group>
      {STACK.map((layer, i) => {
        const center = y + layer.h / 2;
        y += layer.h + gap;
        const on = focus.includes(i);
        return (
          <group key={layer.name}>
            <Slab
              position={[0, center, 0]}
              size={[1.8, layer.h, 1.15]}
              color={layer.color}
              emissive={on ? 0.45 : 0.05}
              onClick={() => setStep(i === 0 ? 1 : i <= 3 ? 2 : i - 1)}
            />
            <Tag position={[1.4, center, 0.15]} accent={on}>
              {layer.name}
            </Tag>
          </group>
        );
      })}
      <FlowDots count={4} color="#e4a23a" speed={0.18} path={(t) => [0, -1.6 + t * 1.2, 0.7]} />
    </group>
  );
}

function WhyScene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <group>
        <Molecule position={[-0.8, 0.9, 0]} color="#e08a55" />
        <Tag position={[-0.8, 1.5, 0]}>MA bay</Tag>
        <Molecule position={[0.7, 0, 0]} color="#e6c15a" />
        <Ion position={[1.3, 0.1, 0]} color="#79b0ff" radius={0.16} label="Cs" />
        <Tag position={[0.9, -0.7, 0]}>FA + Cs ở lại</Tag>
      </group>
    );
  }
  if (step === 1) {
    return (
      <group>
        <OctaMesh color="#6d4bd6" />
        <Tag position={[0, 1.5, 0]}>thuần iod · không Hoke</Tag>
      </group>
    );
  }
  if (step === 2) {
    return (
      <group>
        <Ion position={[0, 0.2, 0]} color="#e6c15a" radius={0.45} label="FA" />
        <Ion position={[0.7, 0.35, 0]} color="#79b0ff" radius={0.2} label="5% Cs" />
        <Tag position={[0, -0.8, 0]}>kéo t về vùng bền</Tag>
      </group>
    );
  }
  if (step === 3) {
    return (
      <group>
        <Slab position={[0, 0, 0]} size={[1.8, 0.4, 1.1]} color="#3a2a55" />
        <Slab position={[0, 0.32, 0]} size={[1.9, 0.06, 1.2]} color="#b07adf" />
        <Slab position={[0, -0.32, 0]} size={[1.9, 0.06, 1.2]} color="#b07adf" />
        <Tag position={[0, 1, 0]}>2D hai mặt</Tag>
      </group>
    );
  }
  return (
    <group>
      <Slab position={[0, 0.4, 0]} size={[1.8, 0.08, 1.1]} color="#d9d3c8" />
      <Slab position={[0, 0.85, 0]} size={[1.8, 0.12, 1.1]} color="#e0b15a" />
      <FlowDots count={5} color="#6d4bd6" speed={0.2} path={(t) => [(t - 0.5) * 1.2, -0.6 + Math.min(0.85, t * 1.3), 0.3]} />
      <Tag position={[0, -1.1, 0]}>SnO₂ ALD chặn iod</Tag>
    </group>
  );
}

function VerifyScene({ step }: { step: number }) {
  const good = (t: number) => 92 + 8 * Math.exp(-t / 500);
  const bad = (t: number) => 38 + 62 * Math.exp(-t / 420);
  return (
    <PlotFrame x0={0} x1={2500} y0={40} y1={100} xLabel="giờ" yLabel="% còn lại">
      {(map) => {
        const gPts: [number, number, number][] = [];
        const bPts: [number, number, number][] = [];
        for (let i = 0; i <= 24; i++) {
          const t = (i / 24) * 2500;
          gPts.push(map(t, good(t)));
          bPts.push(map(t, bad(t)));
        }
        return (
          <group>
            <Polyline pts={bPts} color="#e08a55" />
            <Polyline pts={gPts} color="#8fd0a8" />
            <mesh position={map(2000, 93)}>
              <sphereGeometry args={[0.09, 12, 10]} />
              <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.8} />
            </mesh>
            <Tag position={map(2000, 97)}>93% · 2000 h đã báo cáo</Tag>
            {step >= 1 ? <Tag position={map(400, 48)}>đèn + nhiệt + ẩm</Tag> : null}
            {step >= 6 ? (
              <Tag position={map(1250, 70)} accent>
                giả thuyết
              </Tag>
            ) : null}
          </group>
        );
      }}
    </PlotFrame>
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
  plqy: PlqyScene,
  compare: CompareScene,
  enemies: EnemiesScene,
  nucleation: NucleationScene,
  methods: MethodsScene,
  films: FilmsScene,
  grow: GrowScene,
  scale: ScaleScene,
  apps: AppsScene,
  market: MarketScene,
  lead: LeadScene,
  pin: PinScene,
  stack: StackScene,
  why: WhyScene,
  verify: VerifyScene,
  finale: FinaleScene,
  quiz: QuizScene,
  refs: RefsScene,
};
