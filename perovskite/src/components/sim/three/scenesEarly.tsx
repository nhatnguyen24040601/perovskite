import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { ivCurve, photonEnergy, sqEfficiency, wavelengthHex } from "@/lib/sim/physics";
import { useSim } from "@/lib/sim/store";
import { FlowDots, Ion, Molecule, OctaMesh, Pop, SPHERE, Seg, Slab, Tag, UnitCell } from "./kit";
import { PlotFrame, Polyline } from "./plot";

function SunGlyph() {
  return (
    <group position={[-1.35, 2.15, 0.15]}>
      <mesh>
        <sphereGeometry args={[0.34, 36, 28]} />
        <meshStandardMaterial color="#ffe1a3" emissive="#e4a23a" emissiveIntensity={1.3} roughness={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.52, 28, 20]} />
        <meshBasicMaterial color="#e4a23a" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.72, 22, 16]} />
        <meshBasicMaterial color="#f0c27a" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <Tag position={[0.05, 0.88, 0.15]} accent>
        ≈ 1000 W/m²
      </Tag>
    </group>
  );
}

/** Parallel bundle. At the ground, sunlight arrives as a beam, not a fan from a nearby ball. */
function SunBeam() {
  const photons = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dir = useMemo(() => new THREE.Vector3(0.22, -1, -0.08).normalize(), []);
  const side = useMemo(() => new THREE.Vector3(1, 0.22, 0).normalize(), []);
  const lift = useMemo(() => new THREE.Vector3().crossVectors(dir, side).normalize(), [dir, side]);
  const origin = useMemo(() => new THREE.Vector3(-0.15, 1.72, 0.2), []);
  const count = 20;
  const length = 1.62;

  useFrame(({ clock }) => {
    const mesh = photons.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const t = (clock.elapsedTime * 0.32 + i * 0.13) % 1;
      const p = origin
        .clone()
        .addScaledVector(side, (col - 2) * 0.28)
        .addScaledVector(lift, (row - 1.5) * 0.26)
        .addScaledVector(dir, t * length);
      dummy.position.copy(p);
      dummy.scale.setScalar(0.055);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const shaft = useMemo(() => {
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const mid = origin.clone().addScaledVector(dir, length * 0.46);
    return { q, mid };
  }, [dir, origin]);

  return (
    <group>
      {[-0.5, -0.17, 0.17, 0.5].map((offset, i) => {
        const p = shaft.mid.clone().addScaledVector(side, offset).addScaledVector(lift, i % 2 === 0 ? 0.16 : -0.16);
        return (
          <mesh key={offset} position={p} quaternion={shaft.q}>
            <cylinderGeometry args={[0.012, 0.012, length * 0.92, 6]} />
            <meshBasicMaterial color="#f0d090" transparent opacity={0.28} depthWrite={false} />
          </mesh>
        );
      })}
      <instancedMesh ref={photons} args={[SPHERE, undefined, count]}>
        <meshStandardMaterial color="#ffe7b8" emissive="#e4a23a" emissiveIntensity={1} />
      </instancedMesh>
    </group>
  );
}

function MiniModule({ step }: { step: number }) {
  const bulb = useRef<THREE.Mesh>(null);
  const cells: [number, number][] = [
    [-0.58, -0.58],
    [0.58, -0.58],
    [-0.58, 0.58],
    [0.58, 0.58],
  ];
  useFrame(({ clock }) => {
    const mat = bulb.current?.material;
    if (mat && "emissiveIntensity" in mat) {
      (mat as THREE.MeshStandardMaterial).emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 3) * 0.25;
    }
  });
  return (
    <group position={[0.05, -0.12, 0]} rotation={[0.28, -0.35, 0]}>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[2.55, 0.1, 2.55]} />
        <meshStandardMaterial color="#c5ced6" metalness={0.78} roughness={0.26} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[2.32, 0.045, 2.32]} />
        <meshStandardMaterial color="#e7edf1" roughness={0.72} />
      </mesh>
      {cells.map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.04, z]}>
          <mesh>
            <boxGeometry args={[1.02, 0.04, 1.02]} />
            <meshStandardMaterial color="#1b6398" emissive="#123e66" emissiveIntensity={0.28} metalness={0.22} roughness={0.24} />
          </mesh>
          {[-0.34, -0.11, 0.11, 0.34].map((fx) => (
            <mesh key={fx} position={[fx, 0.03, 0]}>
              <boxGeometry args={[0.04, 0.016, 0.92]} />
              <meshStandardMaterial color="#f4f7f8" metalness={0.84} roughness={0.18} />
            </mesh>
          ))}
          <mesh position={[0, 0.038, 0]}>
            <boxGeometry args={[0.92, 0.014, 0.07]} />
            <meshStandardMaterial color="#f7f8f8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[2.32, 0.03, 2.32]} />
        <meshStandardMaterial color="#d5e6f2" transparent opacity={0.18} roughness={0.04} metalness={0} />
      </mesh>
      <Tag position={[0, -0.15, 1.55]}>Pin mặt trời</Tag>
      {step >= 1 ? (
        <Pop>
          <mesh position={[1.55, 0.08, 0.58]}>
            <boxGeometry args={[0.85, 0.02, 0.06]} />
            <meshStandardMaterial color="#e8eef2" metalness={0.8} roughness={0.22} />
          </mesh>
          <mesh position={[1.95, 0.22, 0.58]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
            <meshStandardMaterial color="#d7dde6" metalness={0.7} roughness={0.28} />
          </mesh>
          <group position={[1.95, 0.48, 0.58]}>
            <mesh ref={bulb}>
              <sphereGeometry args={[0.18, 24, 18]} />
              <meshStandardMaterial color="#fff6e4" emissive="#e4a23a" emissiveIntensity={0.85} transparent opacity={0.94} roughness={0.12} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.045, 12, 10]} />
              <meshStandardMaterial color="#fff1cc" emissive="#ffd27a" emissiveIntensity={1.5} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.08, 12]} />
              <meshStandardMaterial color="#8d98a3" metalness={0.5} roughness={0.4} />
            </mesh>
          </group>
          <FlowDots
            count={6}
            color="#79b0ff"
            speed={0.4}
            path={(t) => [1.15 + t * 0.8, 0.08 + t * 0.28, 0.58]}
          />
          <Tag position={[1.95, 0.88, 0.58]}>Không máy · không nhiên liệu</Tag>
        </Pop>
      ) : null}
    </group>
  );
}

function SunScene({ step }: { step: number }) {
  return (
    <group>
      <SunGlyph />
      <SunBeam />
      <MiniModule step={step} />
      <mesh position={[0.05, -1.05, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.7, 12]} />
        <meshStandardMaterial color="#5c6b78" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0.05, -1.42, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 24]} />
        <meshStandardMaterial color="#24303a" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
}

function FoundationScene({ step }: { step: number }) {
  const electrons = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (electrons.current) electrons.current.rotation.y = clock.elapsedTime * 0.8;
  });
  if (step === 0) {
    return (
      <group>
        <mesh>
          <sphereGeometry args={[0.38, 28, 20]} />
          <meshStandardMaterial color="#e08a55" emissive="#e08a55" emissiveIntensity={0.25} />
        </mesh>
        <group ref={electrons}>
          {[0.9, 1.25, 1.6].map((r, i) => (
            <group key={r} rotation={[0.4 * i, i, 0]}>
              <mesh>
                <torusGeometry args={[r, 0.012, 8, 48]} />
                <meshBasicMaterial color="#79b0ff" transparent opacity={0.45} />
              </mesh>
              <mesh position={[r, 0, 0]}>
                <sphereGeometry args={[0.08, 16, 12]} />
                <meshStandardMaterial color="#79b0ff" emissive="#79b0ff" emissiveIntensity={0.6} />
              </mesh>
            </group>
          ))}
        </group>
        <Tag position={[0, 2.1, 0]}>Nguyên tử</Tag>
      </group>
    );
  }
  if (step === 1) {
    return (
      <group>
        <group position={[-1.4, 0, 0]}>
          <Ion position={[0, 0, 0]} color="#c5ccd6" radius={0.38} label="Pb²⁺ cation" />
          <Tag position={[0, -0.85, 0]}>mất 2 điện tử</Tag>
        </group>
        <group position={[1.4, 0, 0]}>
          <Ion position={[0, 0, 0]} color="#6d4bd6" radius={0.42} label="I⁻ anion" />
          <Tag position={[0, -0.9, 0]}>nhận 1 điện tử</Tag>
        </group>
      </group>
    );
  }
  if (step === 2) {
    return (
      <group>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 4.2, 12]} />
          <meshStandardMaterial color="#d7dde6" metalness={0.6} roughness={0.3} />
        </mesh>
        <FlowDots
          count={8}
          color="#79b0ff"
          speed={0.28}
          path={(t) => [-2.1 + t * 4.2, 0.22, 0]}
        />
        <Tag position={[0, 0.8, 0]}>Dòng điện = hạt mang điện có hướng</Tag>
      </group>
    );
  }
  return (
    <group>
      <Slab position={[-1.5, 0, 0]} size={[0.12, 1.6, 1.1]} color="#d7dde6" />
      <Slab position={[1.5, 0, 0]} size={[0.12, 1.6, 1.1]} color="#c46a45" />
      <Tag position={[-1.5, 1.15, 0]}>0 V</Tag>
      <Tag position={[1.5, 1.15, 0]}>1 V</Tag>
      <FlowDots count={1} color="#79b0ff" speed={0.22} path={(t) => [-1.3 + t * 2.6, 0, 0]} />
      <Tag position={[0, -1.15, 0]} accent>
        1 eV
      </Tag>
    </group>
  );
}

function SineWave({
  length,
  cycles,
  amplitude,
  color,
  radius = 0.03,
  opacity = 1,
}: {
  length: number;
  cycles: number;
  amplitude: number;
  color: string;
  radius?: number;
  opacity?: number;
}) {
  const geo = useMemo(() => {
    const n = Math.max(32, Math.round(cycles * 28));
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      pts.push(new THREE.Vector3((u - 0.5) * length, Math.sin(u * cycles * Math.PI * 2) * amplitude, 0));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n, radius, 5, false);
  }, [length, cycles, amplitude, radius]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

function RidingPhoton({
  length,
  cycles,
  amplitude,
  color,
  speed = 0.22,
  radius = 0.11,
}: {
  length: number;
  cycles: number;
  amplitude: number;
  color: string;
  speed?: number;
  radius?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const u = (clock.elapsedTime * speed) % 1;
    ref.current?.position.set((u - 0.5) * length, Math.sin(u * cycles * Math.PI * 2) * amplitude, 0.14);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 18, 14]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.95} />
    </mesh>
  );
}

function WaveParticle() {
  return (
    <group>
      <group position={[0, 0.85, 0]}>
        <SineWave length={4.6} cycles={1.6} amplitude={0.32} color="#e05a48" />
        <RidingPhoton length={4.6} cycles={1.6} amplitude={0.32} color="#e05a48" radius={0.14} speed={0.16} />
        <Tag position={[-2.6, 0.7, 0]}>sóng</Tag>
        <Tag position={[2.55, 0.55, 0]}>đỏ · ít năng lượng</Tag>
      </group>
      <group position={[0, -0.85, 0]}>
        <SineWave length={4.6} cycles={6.5} amplitude={0.2} color="#7b4de0" radius={0.025} />
        <RidingPhoton length={4.6} cycles={6.5} amplitude={0.2} color="#b9a0ff" radius={0.09} speed={0.28} />
        <Tag position={[-2.6, 0.5, 0]}>hạt</Tag>
        <Tag position={[2.55, 0.48, 0]}>xanh tím · nhiều năng lượng</Tag>
      </group>
    </group>
  );
}

function FormulaWave({ nm }: { nm: number }) {
  const color = wavelengthHex(nm);
  const e = photonEnergy(nm);
  const cycles = Math.max(1.15, 7.2 * (480 / nm));
  const length = 4.8;
  const amplitude = 0.34;
  const crest = Math.round(0.45 * cycles - 0.25);
  const uA = (crest + 0.25) / cycles;
  const uB = uA + 1 / cycles;
  const xA = (uA - 0.5) * length;
  const xB = (uB - 0.5) * length;
  const span = Math.abs(xB - xA);
  const h = Math.min(2.1, e * 0.52);
  return (
    <group>
      <group position={[-0.55, 0.15, 0]}>
        <SineWave length={length} cycles={cycles} amplitude={amplitude} color={color} />
        <RidingPhoton length={length} cycles={cycles} amplitude={amplitude} color={color} />
        <mesh position={[(xA + xB) / 2, amplitude + 0.22, 0]}>
          <boxGeometry args={[Math.max(0.12, span), 0.018, 0.018]} />
          <meshStandardMaterial color="#f4efe6" />
        </mesh>
        <Tag position={[(xA + xB) / 2, amplitude + 0.55, 0]}>λ</Tag>
      </group>
      <mesh position={[3.15, -1.05 + h / 2, 0]}>
        <boxGeometry args={[0.32, h, 0.32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
      </mesh>
      <Tag position={[3.15, -1.05 + h + 0.32, 0]} accent>
        {e.toFixed(2)} eV
      </Tag>
      <Tag position={[3.15, -1.4, 0]}>{nm.toFixed(0)} nm</Tag>
    </group>
  );
}

const SPECTRUM: { name: string; color: string; cycles: number; solar: boolean; rainbow?: boolean }[] = [
  { name: "Radio", color: "#8d6b4f", cycles: 0.65, solar: false },
  { name: "Vi sóng", color: "#d4893a", cycles: 1.1, solar: false },
  { name: "Hồng ngoại", color: "#d23b32", cycles: 1.8, solar: true },
  { name: "Nhìn thấy", color: "#e6c15a", cycles: 2.6, solar: true, rainbow: true },
  { name: "Tử ngoại", color: "#7a45d6", cycles: 3.6, solar: true },
  { name: "Tia X", color: "#9fd4ea", cycles: 5, solar: false },
  { name: "Tia gamma", color: "#f4efe6", cycles: 6.5, solar: false },
];

function EmSpectrum({ nm }: { nm: number }) {
  const x0 = -3.36;
  const dx = 1.12;
  const hot = nm > 780 ? 2 : nm >= 380 ? 3 : 4;
  return (
    <group>
      {SPECTRUM.map((band, i) => {
        const x = x0 + i * dx;
        const on = i === hot;
        return (
          <group key={band.name} position={[x, 0, 0]}>
            <mesh position={[0, -0.35, 0]}>
              <boxGeometry args={[0.92, on ? 0.16 : 0.08, 0.55]} />
              <meshStandardMaterial
                color={band.solar ? "#e4a23a" : "#1e2832"}
                emissive={band.solar ? "#e4a23a" : "#000"}
                emissiveIntensity={band.solar ? 0.25 : 0}
              />
            </mesh>
            {band.rainbow ? (
              <group position={[0, -0.15, 0.32]}>
                {[450, 490, 530, 580, 630].map((w, k) => (
                  <mesh key={w} position={[-0.32 + k * 0.16, 0, 0]}>
                    <boxGeometry args={[0.14, 0.28, 0.08]} />
                    <meshStandardMaterial color={wavelengthHex(w)} emissive={wavelengthHex(w)} emissiveIntensity={0.35} />
                  </mesh>
                ))}
              </group>
            ) : null}
            <group position={[0, 0.58, 0]}>
              <SineWave length={0.9} cycles={band.cycles} amplitude={0.26} color={band.color} radius={0.026} />
            </group>
            <Tag position={[0, on ? 1.22 : 1.05, 0]} accent={on}>
              {band.name}
            </Tag>
          </group>
        );
      })}
      <mesh position={[x0 + 3 * dx, -0.72, 0]}>
        <boxGeometry args={[dx * 2 + 0.55, 0.035, 0.16]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.45} />
      </mesh>
      <Tag position={[x0 + 2 * dx, 1.62, 0]} accent>
        ≈ một nửa nắng
      </Tag>
      <Tag position={[x0 + 3 * dx, -1.15, 0]}>nắng tới mặt đất</Tag>
      <Tag position={[x0, -1.55, 0]}>năng lượng thấp</Tag>
      <Tag position={[x0 + 6 * dx, -1.55, 0]}>năng lượng cao →</Tag>
    </group>
  );
}

function PhotonScene({ step }: { step: number }) {
  const nm = useSim((s) => s.wavelength);
  if (step <= 0) return <WaveParticle />;
  if (step === 1) return <FormulaWave nm={nm} />;
  return <EmSpectrum nm={nm} />;
}

function BandBuilding({
  gap,
  label,
  position = [0, 0, 0],
  jump = false,
}: {
  gap: number;
  label: string;
  position?: [number, number, number];
  jump?: boolean;
}) {
  const e = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!e.current || !jump) return;
    const t = (Math.sin(clock.elapsedTime * 1.4) + 1) / 2;
    e.current.position.y = 0.15 + t * (0.55 + gap);
  });
  return (
    <group position={position}>
      <Slab position={[0, 0, 0]} size={[2.2, 0.35, 1.15]} color="#c46a45" />
      <Tag position={[-0.2, -0.45, 0.7]}>hóa trị</Tag>
      <Slab position={[0, 0.7 + gap, 0]} size={[2.2, 0.35, 1.15]} color="#4d86d6" />
      <Tag position={[-0.15, 1.15 + gap, 0.7]}>dẫn</Tag>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.8 + i * 0.4, 0.02, 0.15]}>
          <sphereGeometry args={[0.08, 12, 10]} />
          <meshStandardMaterial color="#79b0ff" emissive="#79b0ff" emissiveIntensity={0.4} />
        </mesh>
      ))}
      <mesh ref={e} position={[0.7, 0.15, 0.35]}>
        <sphereGeometry args={[0.1, 14, 12]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.7} />
      </mesh>
      <Tag position={[1.55, 0.4 + gap / 2, 0]} accent>
        {label}
      </Tag>
    </group>
  );
}

const EV = 0.38;
const PHOTON_EV = 1.5;

function PhotonRuler() {
  const h = PHOTON_EV * EV;
  return (
    <group position={[-0.78, 0, 0.06]}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[0.045, h, 0.045]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <sphereGeometry args={[0.07, 14, 12]} />
        <meshStandardMaterial color="#ffe1a3" emissive="#e4a23a" emissiveIntensity={1.05} />
      </mesh>
    </group>
  );
}

function EnergyAxis() {
  const top = 5 * EV;
  return (
    <group position={[-2.32, 0, 0]}>
      <mesh position={[0, top / 2, 0]}>
        <boxGeometry args={[0.016, top, 0.016]} />
        <meshStandardMaterial color="#8ea0b0" />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((ev) => (
        <group key={ev} position={[0, ev * EV, 0]}>
          <mesh>
            <boxGeometry args={[0.16, 0.012, 0.012]} />
            <meshStandardMaterial color={ev === 4 ? "#e15b4c" : "#8ea0b0"} />
          </mesh>
          <Tag position={[0.38, 0, 0]}>{String(ev)}</Tag>
        </group>
      ))}
      <mesh position={[0.02, PHOTON_EV * EV, 0.02]}>
        <boxGeometry args={[0.22, 0.028, 0.02]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.85} />
      </mesh>
    </group>
  );
}

function GapColumn({
  kind,
  position,
}: {
  kind: "metal" | "semi" | "insulator";
  position: [number, number, number];
}) {
  const mover = useRef<THREE.Mesh>(null);
  const drifters = useRef<THREE.Group>(null);
  const name = kind === "metal" ? "kim loại" : kind === "semi" ? "bán dẫn" : "cách điện";
  const egLabel = kind === "metal" ? "Eg = 0" : kind === "semi" ? "Eg ≈ 1,5 eV" : "Eg ≈ 5 eV";
  const note = kind === "metal" ? "đã tự do" : kind === "semi" ? "mọi pin dùng đây" : "không với tới";
  const bandW = 1.16;
  const bandD = 0.48;
  const bandT = 0.22;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    if (kind === "metal" && drifters.current) {
      drifters.current.children.forEach((child, i) => {
        const span = 0.92;
        const x = -0.46 + ((time * 0.22 + i * 0.28) % span);
        child.position.x = x;
        child.position.y = -0.06 + Math.sin(time * 1.4 + i) * 0.04;
      });
    }
    if (!mover.current || kind === "metal") return;
    if (kind === "semi") {
      const t = (time * 0.28) % 1;
      const climb = t < 0.14 ? t / 0.14 : 1;
      const top = PHOTON_EV * EV + bandT * 0.45;
      mover.current.position.y = -0.04 + climb * (top + 0.04);
      mover.current.position.x = 0.12 + (climb > 0.98 ? Math.sin(time * 2.1) * 0.18 : 0);
    } else {
      const t = (time % 3.2) / 3.2;
      const h = t < 0.16 ? t / 0.16 : t < 0.7 ? 1 : Math.max(0, 1 - (t - 0.7) / 0.3);
      mover.current.position.y = -0.04 + h * PHOTON_EV * EV;
      mover.current.position.x = 0.12;
    }
  });

  return (
    <group position={position}>
      {kind === "metal" ? (
        <>
          <Slab position={[0, -0.16, 0]} size={[bandW, 0.36, bandD]} color="#c46a45" opacity={0.9} />
          <Slab position={[0, -0.02, 0.06]} size={[bandW, 0.36, bandD * 0.92]} color="#4d86d6" opacity={0.78} />
          <Tag position={[0.72, -0.04, 0.4]} accent>
            {egLabel}
          </Tag>
        </>
      ) : (
        <>
          <Slab position={[0, -bandT / 2, 0]} size={[bandW, bandT, bandD]} color="#c46a45" />
          <Slab
            position={[0, (kind === "semi" ? PHOTON_EV : 5) * EV + bandT / 2, 0]}
            size={[bandW, bandT, bandD]}
            color="#4d86d6"
          />
          {kind === "semi" ? (
            <mesh position={[0, (PHOTON_EV * EV) / 2, -0.05]}>
              <boxGeometry args={[bandW - 0.08, PHOTON_EV * EV, 0.02]} />
              <meshBasicMaterial color="#8fd0a8" transparent opacity={0.2} depthWrite={false} />
            </mesh>
          ) : (
            <mesh position={[0, 4 * EV, 0.08]}>
              <boxGeometry args={[bandW + 0.28, 0.018, 0.018]} />
              <meshStandardMaterial color="#e15b4c" emissive="#e15b4c" emissiveIntensity={0.45} />
            </mesh>
          )}
          <Tag position={[0.78, (kind === "semi" ? 0.75 : 4.45) * EV, 0.35]} accent>
            {egLabel}
          </Tag>
          {kind === "insulator" ? <Tag position={[-0.78, 4 * EV, 0.35]}>≈ 4 eV</Tag> : null}
          {kind === "semi" ? <Tag position={[-1.15, PHOTON_EV * EV, 0.4]}>photon</Tag> : null}
        </>
      )}
      <PhotonRuler />
      {kind === "metal" ? (
        <group ref={drifters}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[0, -0.06, 0.28]}>
              <sphereGeometry args={[0.065, 12, 10]} />
              <meshStandardMaterial color="#79b0ff" emissive="#79b0ff" emissiveIntensity={0.65} />
            </mesh>
          ))}
        </group>
      ) : (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={i} position={[-0.4 + i * 0.22, -0.08, 0.24]}>
              <sphereGeometry args={[0.055, 12, 10]} />
              <meshStandardMaterial color="#79b0ff" emissive="#79b0ff" emissiveIntensity={0.35} />
            </mesh>
          ))}
          <mesh ref={mover} position={[0.12, -0.04, 0.32]}>
            <sphereGeometry args={[0.075, 14, 12]} />
            <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.9} />
          </mesh>
        </>
      )}
      <Tag position={[0, -0.62, 0]}>{name}</Tag>
      <Tag position={[0, -0.92, 0]}>{note}</Tag>
    </group>
  );
}

function FaceOn({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z);
  });
  return (
    <group ref={ref} position={[0.2, -0.78, 0]}>
      {children}
    </group>
  );
}

function BandsScene({ step }: { step: number }) {
  if (step >= 4) {
    return (
      <FaceOn>
        <EnergyAxis />
        <GapColumn kind="metal" position={[-1.15, 0, 0]} />
        <GapColumn kind="semi" position={[0.7, 0, 0]} />
        <GapColumn kind="insulator" position={[2.5, 0, 0]} />
      </FaceOn>
    );
  }
  return (
    <group>
      <BandBuilding gap={0.85} label={step >= 3 ? "Eg" : " "} jump={step >= 3} />
      {step >= 1 ? <Tag position={[-1.7, -0.7, 0]}>chật, không dẫn</Tag> : null}
      {step >= 2 ? <Tag position={[-1.7, 1.7, 0]}>trống, dẫn được</Tag> : null}
    </group>
  );
}

function fadeMesh(mesh: THREE.Mesh | null, x: number, y: number, z: number, opacity: number) {
  if (!mesh) return;
  mesh.position.set(x, y, z);
  mesh.visible = opacity > 0.04;
  const mat = mesh.material as THREE.MeshStandardMaterial;
  if (mat && "opacity" in mat) {
    mat.transparent = opacity < 0.98;
    mat.opacity = Math.max(0, Math.min(1, opacity));
    mat.depthWrite = opacity > 0.85;
  }
}

function clamp01(t: number) {
  return Math.min(1, Math.max(0, t));
}

function smooth(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function along(pts: readonly [number, number, number][], u: number): [number, number, number] {
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    lens.push(len);
    total += len;
  }
  let d = clamp01(u) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const k = lens[i] === 0 ? 0 : Math.min(1, d / lens[i]);
      const a = pts[i];
      const b = pts[i + 1];
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
    }
    d -= lens[i];
  }
  const last = pts[pts.length - 1];
  return [last[0], last[1], last[2]];
}

const CELL = {
  itoY: 1.08,
  htlY: 0.82,
  absY: 0.04,
  etlY: -0.7,
  metalY: -0.96,
  vbY: -0.28,
  cbY: 0.4,
  absTop: 0.62,
  absBot: -0.54,
  z: 0.86,
};

const WIRE: readonly [number, number, number][] = [
  [0.18, CELL.metalY, 1.02],
  [2.28, CELL.metalY, 1.02],
  [2.28, CELL.itoY, 1.02],
  [0.62, CELL.itoY, 1.02],
];

function CellStack() {
  return (
    <group>
      <Slab position={[0, CELL.itoY, 0]} size={[2.3, 0.12, 1.28]} color="#d5e2ea" opacity={0.42} />
      <Tag position={[1.58, CELL.itoY, 0]}>ITO</Tag>
      <Slab position={[0, CELL.htlY, 0]} size={[2.12, 0.26, 1.16]} color="#c46a45" />
      <Tag position={[1.58, CELL.htlY, 0]}>HTL</Tag>
      <Slab position={[0, CELL.absY, 0]} size={[2.0, 1.16, 1.08]} color="#241c38" opacity={0.9} emissive={0.14} />
      <Tag position={[1.58, CELL.absY, 0]}>hấp thụ</Tag>
      <Slab position={[0, CELL.etlY, 0]} size={[2.12, 0.22, 1.16]} color="#4d86d6" />
      <Tag position={[1.58, CELL.etlY, 0]}>ETL</Tag>
      <Slab position={[0, CELL.metalY, 0]} size={[2.3, 0.14, 1.28]} color="#e0b15a" emissive={0.12} />
      <Tag position={[1.58, CELL.metalY, 0]}>kim loại</Tag>
    </group>
  );
}

function GlowBall({
  ballRef,
  color,
  radius = 0.1,
  position,
}: {
  ballRef: RefObject<THREE.Mesh | null>;
  color: string;
  radius?: number;
  position?: [number, number, number];
}) {
  return (
    <mesh ref={ballRef} position={position}>
      <sphereGeometry args={[radius, 18, 14]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} />
    </mesh>
  );
}

/** Step 1: a violet photon stops in the absorber; a red one passes through and is wasted. */
function AbsorbAct() {
  const violet = useRef<THREE.Mesh>(null);
  const red = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const period = 5.2;
    const t = clock.elapsedTime % period;
    const y0 = 2.02;
    const speed = 1.18;
    const y = y0 - speed * t;
    const gate = t < 0.2 ? t / 0.2 : t > 4.55 ? 1 - (t - 4.55) / 0.65 : 1;
    const vY = Math.max(CELL.absY, y);
    fadeMesh(violet.current, -0.36, vY, CELL.z, gate);
    const rY = Math.max(-1.28, y);
    const past = rY < -0.62 ? clamp01((rY + 1.28) / 0.66) : 1;
    fadeMesh(red.current, 0.42, rY, CELL.z, gate * past);
    const arrival = (y0 - CELL.absY) / speed;
    const age = t - arrival;
    const showRing = age > 0 && t < 4.55;
    if (ring.current) {
      ring.current.visible = showRing;
      ring.current.scale.setScalar(showRing ? Math.min(2.1, 0.65 + age * 0.7) : 0.2);
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = showRing ? Math.max(0, 0.65 - age * 0.22) : 0;
    }
  });
  return (
    <group>
      <mesh position={[0, 1.78, CELL.z]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.09, 0.22, 14]} />
        <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.7} />
      </mesh>
      <Tag position={[0.78, 1.82, CELL.z]}>ánh sáng từ trên</Tag>
      <GlowBall ballRef={violet} color="#7a4de8" radius={0.11} position={[-0.36, 2.02, CELL.z]} />
      <GlowBall ballRef={red} color="#e15b4c" radius={0.11} position={[0.42, 2.02, CELL.z]} />
      <mesh ref={ring} position={[-0.36, CELL.absY, CELL.z]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.16, 0.016, 8, 28]} />
        <meshBasicMaterial color="#d2c4ff" transparent opacity={0} />
      </mesh>
      <Tag position={[-0.36, 0.48, CELL.z]}>E ≥ Eg · bị nuốt</Tag>
      <Tag position={[0.42, -1.18, CELL.z]}>{"E < Eg · xuyên, lãng phí"}</Tag>
    </group>
  );
}

/** Step 2: the electron climbs only as far as the conduction band; leftover energy leaves as heat. */
function PairAct() {
  const photon = useRef<THREE.Mesh>(null);
  const electron = useRef<THREE.Mesh>(null);
  const hole = useRef<THREE.Mesh>(null);
  const heat0 = useRef<THREE.Mesh>(null);
  const heat1 = useRef<THREE.Mesh>(null);
  const heat2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 5.6;
    const fade = t > 5.0 ? 1 - (t - 5.0) / 0.6 : 1;
    const pU = clamp01(t / 1.15);
    fadeMesh(photon.current, 0.02, lerp(1.85, CELL.vbY, smooth(pU)), CELL.z, pU < 0.98 ? fade : 0);
    const born = t > 1.15;
    const climb = smooth(clamp01((t - 1.15) / 1.2));
    fadeMesh(electron.current, -0.2, lerp(CELL.vbY, CELL.cbY, climb), CELL.z + 0.04, born ? fade : 0);
    fadeMesh(hole.current, -0.2, CELL.vbY, CELL.z + 0.04, born ? fade : 0);
    [heat0, heat1, heat2].forEach((ref, i) => {
      const ht = clamp01((t - 1.25 - i * 0.14) / 1.15);
      fadeMesh(
        ref.current,
        lerp(0.05, -1.2, smooth(ht)),
        lerp(0.02, 0.08 + i * 0.07, smooth(ht)),
        CELL.z,
        born ? fade * Math.sin(Math.PI * ht) : 0,
      );
    });
  });
  return (
    <group>
      <Slab position={[0, CELL.vbY, 0.7]} size={[1.65, 0.045, 0.05]} color="#e08a55" emissive={0.4} />
      <Slab position={[0, CELL.cbY, 0.7]} size={[1.65, 0.045, 0.05]} color="#79b0ff" emissive={0.4} />
      <Tag position={[1.02, CELL.vbY, 0.8]}>hóa trị</Tag>
      <Tag position={[1.02, CELL.cbY, 0.8]}>dẫn</Tag>
      <Tag position={[0.95, 0.06, 0.8]}>Eg</Tag>
      <GlowBall ballRef={photon} color="#e4a23a" radius={0.1} position={[0.02, 1.85, CELL.z]} />
      <GlowBall ballRef={electron} color="#79b0ff" radius={0.09} position={[-0.2, CELL.vbY, CELL.z]} />
      <GlowBall ballRef={hole} color="#e08a55" radius={0.09} position={[-0.2, CELL.vbY, CELL.z]} />
      <GlowBall ballRef={heat0} color="#e08a55" radius={0.055} />
      <GlowBall ballRef={heat1} color="#e08a55" radius={0.05} />
      <GlowBall ballRef={heat2} color="#e08a55" radius={0.045} />
      <Tag position={[-1.45, 0.16, 0.8]}>phần dư → nhiệt</Tag>
    </group>
  );
}

/** Step 3: first they recombine; then selective contacts pull a pair apart and block the wrong way. */
function SplitAct() {
  const meetE = useRef<THREE.Mesh>(null);
  const meetH = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.Mesh>(null);
  const okH = useRef<THREE.Mesh>(null);
  const okE = useRef<THREE.Mesh>(null);
  const badE = useRef<THREE.Mesh>(null);
  const badH = useRef<THREE.Mesh>(null);
  const [beat, setBeat] = useState<"meet" | "split">("meet");
  const beatRef = useRef(beat);
  useFrame(({ clock }) => {
    const period = 8.4;
    const t = clock.elapsedTime % period;
    const next = t < 3.7 ? "meet" : "split";
    if (beatRef.current !== next) {
      beatRef.current = next;
      setBeat(next);
    }
    const meetFade = t < 3.35 ? 1 : t < 3.7 ? 1 - (t - 3.35) / 0.35 : 0;
    const approach = smooth(clamp01((t - 0.25) / 1.7));
    const gone = t > 2.15;
    fadeMesh(meetE.current, 0, lerp(CELL.cbY, 0.05, approach), CELL.z, gone ? 0 : meetFade);
    fadeMesh(meetH.current, 0, lerp(CELL.vbY, 0.05, approach), CELL.z, gone ? 0 : meetFade);
    if (flash.current) {
      const age = t - 2.05;
      const on = age > 0 && age < 0.85;
      flash.current.visible = on;
      flash.current.scale.setScalar(on ? 0.4 + age * 2.4 : 0.01);
      const mat = flash.current.material as THREE.MeshBasicMaterial;
      mat.opacity = on ? Math.max(0, 0.9 - age) : 0;
    }
    const local = t - 3.7;
    const splitFade = local < 0.2 ? local / 0.2 : t > 7.85 ? 1 - (t - 7.85) / 0.55 : 1;
    const move = smooth(clamp01(local / 1.45));
    const wobble = move >= 1 ? Math.sin(clock.elapsedTime * 7) * 0.035 : 0;
    fadeMesh(okH.current, -0.66, lerp(0.04, CELL.htlY, move), CELL.z, local > 0 ? splitFade : 0);
    fadeMesh(okE.current, -0.66, lerp(0.04, CELL.etlY, move), CELL.z, local > 0 ? splitFade : 0);
    fadeMesh(badE.current, 0.7, lerp(0.04, CELL.absTop - 0.02, move) + wobble, CELL.z, local > 0 ? splitFade : 0);
    fadeMesh(badH.current, 0.7, lerp(0.04, CELL.absBot + 0.02, move) - wobble, CELL.z, local > 0 ? splitFade : 0);
  });
  return (
    <group>
      <GlowBall ballRef={meetE} color="#79b0ff" radius={0.09} position={[0, CELL.cbY, CELL.z]} />
      <GlowBall ballRef={meetH} color="#e08a55" radius={0.09} position={[0, CELL.vbY, CELL.z]} />
      <mesh ref={flash} position={[0, 0.05, CELL.z + 0.05]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshBasicMaterial color="#fff1c9" transparent opacity={0} />
      </mesh>
      {beat === "meet" ? (
        <group>
          <Tag position={[0, 0.72, CELL.z]}>gặp nhau → tái hợp</Tag>
          <Tag position={[0, -0.42, CELL.z]}>thành nhiệt hoặc ánh sáng</Tag>
        </group>
      ) : (
        <group>
          <Slab position={[0.7, CELL.absTop + 0.02, 0.98]} size={[0.78, 0.055, 0.08]} color="#e15b4c" emissive={0.7} />
          <Slab position={[0.7, CELL.absBot - 0.02, 0.98]} size={[0.78, 0.055, 0.08]} color="#e15b4c" emissive={0.7} />
          <GlowBall ballRef={okH} color="#e08a55" radius={0.09} />
          <GlowBall ballRef={okE} color="#79b0ff" radius={0.09} />
          <GlowBall ballRef={badE} color="#79b0ff" radius={0.09} />
          <GlowBall ballRef={badH} color="#e08a55" radius={0.09} />
          <Tag position={[1.05, 1.4, 0]}>HTL chỉ lỗ trống</Tag>
          <Tag position={[-1.42, CELL.etlY, 0]}>ETL chỉ điện tử</Tag>
          <Tag position={[-1.25, -1.12, 0]}>đúng cửa</Tag>
          <Tag position={[1.45, -1.42, 0]}>sai cửa, bị chặn</Tag>
        </group>
      )}
    </group>
  );
}

/** Step 4: hole waits at the ITO; the electron reaches the metal, then the lamp, then the hole. */
function CollectAct() {
  const hole = useRef<THREE.Mesh>(null);
  const electron = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.Mesh>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const [meet, setMeet] = useState(false);
  const meetRef = useRef(false);
  useFrame(({ clock }) => {
    const period = 7.4;
    const t = clock.elapsedTime % period;
    const showMeet = t > 5.15 && t < 6.15;
    if (meetRef.current !== showMeet) {
      meetRef.current = showMeet;
      setMeet(showMeet);
    }
    const fade = t > 6.7 ? 1 - (t - 6.7) / 0.7 : 1;
    const up = smooth(clamp01(t / 1.55));
    const holeOp = t < 5.25 ? fade : t < 5.7 ? fade * (1 - (t - 5.25) / 0.45) : 0;
    fadeMesh(hole.current, 0.62, lerp(CELL.absY, CELL.itoY, up), 1.08, holeOp);
    let ex: number;
    let ey: number;
    let ez: number;
    let onWire = false;
    if (t < 1.55) {
      const k = smooth(clamp01(t / 1.55));
      ex = lerp(0.12, WIRE[0][0], k);
      ey = lerp(CELL.absY, CELL.metalY, k);
      ez = lerp(0.9, WIRE[0][2], k);
    } else if (t < 5.15) {
      onWire = true;
      const p = along(WIRE, (t - 1.55) / 3.5);
      ex = p[0];
      ey = p[1];
      ez = p[2];
    } else {
      ex = WIRE[3][0];
      ey = WIRE[3][1];
      ez = WIRE[3][2];
    }
    const elecOp = t < 5.25 ? fade : t < 5.7 ? fade * (1 - (t - 5.25) / 0.45) : 0;
    fadeMesh(electron.current, ex, ey, ez, elecOp);
    if (bulb.current) bulb.current.emissiveIntensity = onWire ? 1.8 : 0.06;
    if (flash.current) {
      const age = t - 5.15;
      const on = age > 0 && age < 0.7;
      flash.current.visible = on;
      flash.current.scale.setScalar(on ? 0.35 + age * 2.2 : 0.01);
      const mat = flash.current.material as THREE.MeshBasicMaterial;
      mat.opacity = on ? Math.max(0, 0.85 - age) : 0;
    }
  });
  return (
    <group>
      <Seg a={WIRE[0]} b={WIRE[1]} color="#d7dde6" radius={0.028} />
      <Seg a={WIRE[1]} b={WIRE[2]} color="#d7dde6" radius={0.028} />
      <Seg a={WIRE[2]} b={WIRE[3]} color="#d7dde6" radius={0.028} />
      <mesh position={[2.28, 0.06, 1.02]}>
        <sphereGeometry args={[0.22, 22, 16]} />
        <meshStandardMaterial ref={bulb} color="#fff6e4" emissive="#e4a23a" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[2.28, -0.14, 1.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.018, 8, 18]} />
        <meshStandardMaterial color="#d7dde6" metalness={0.65} roughness={0.28} />
      </mesh>
      <GlowBall ballRef={hole} color="#e08a55" radius={0.11} position={[0.62, CELL.absY, 1.08]} />
      <GlowBall ballRef={electron} color="#79b0ff" radius={0.09} position={[0.12, CELL.absY, 0.9]} />
      <mesh ref={flash} position={[0.62, CELL.itoY, 1.12]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshBasicMaterial color="#fff1c9" transparent opacity={0} />
      </mesh>
      {meet ? (
        <Tag position={[0.62, 1.5, 0]}>gặp lại, khép mạch</Tag>
      ) : (
        <Tag position={[0.62, 1.5, 0]}>lỗ trống → ITO</Tag>
      )}
      <Tag position={[0.9, -1.32, 0]}>điện tử → kim loại</Tag>
      <Tag position={[2.28, 0.48, 1.02]}>chạy dây qua đèn</Tag>
    </group>
  );
}

const LOOP_LABEL = ["1 · hấp thụ", "2 · sinh cặp", "3 · tách", "4 · thu"] as const;

/** Step 5: one clean loop of the successful path — absorb, pair, separate, collect. */
function AllAct() {
  const photon = useRef<THREE.Mesh>(null);
  const electron = useRef<THREE.Mesh>(null);
  const hole = useRef<THREE.Mesh>(null);
  const heat = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.Mesh>(null);
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const [phase, setPhase] = useState(0);
  const phaseRef = useRef(0);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 11.2;
    const next = t < 2 ? 0 : t < 3.7 ? 1 : t < 5.5 ? 2 : 3;
    if (phaseRef.current !== next) {
      phaseRef.current = next;
      setPhase(next);
    }
    const pU = smooth(clamp01(t / 1.45));
    const pOp = t < 1.65 ? 1 : t < 2.1 ? 1 - (t - 1.65) / 0.45 : 0;
    fadeMesh(photon.current, 0, lerp(1.9, CELL.absY, pU), CELL.z, pOp);

    const climb = smooth(clamp01((t - 1.7) / 1.1));
    let hx = -0.16;
    let hy = CELL.vbY;
    let hz = CELL.z;
    let hop = 0;
    if (t >= 1.7 && t < 3.7) {
      hop = 1;
    } else if (t < 5.4) {
      const k = smooth((t - 3.7) / 1.5);
      hop = 1;
      hy = lerp(CELL.vbY, CELL.htlY, k);
    } else if (t < 6.6) {
      const k = smooth((t - 5.4) / 1.1);
      hop = 1;
      hx = lerp(-0.16, 0.62, k);
      hy = lerp(CELL.htlY, CELL.itoY, k);
      hz = lerp(CELL.z, 1.08, k);
    } else if (t < 9.45) {
      hop = 1;
      hx = 0.62;
      hy = CELL.itoY;
      hz = 1.08;
    } else if (t < 9.95) {
      hop = 1 - (t - 9.45) / 0.5;
      hx = 0.62;
      hy = CELL.itoY;
      hz = 1.08;
    }
    let ex = -0.16;
    let ey = CELL.vbY;
    let ez = CELL.z;
    let eop = 0;
    if (t >= 1.7 && t < 3.7) {
      eop = 1;
      ey = lerp(CELL.vbY, CELL.cbY, climb);
    } else if (t < 5.4) {
      const k = smooth((t - 3.7) / 1.5);
      eop = 1;
      ex = lerp(-0.16, 0.12, k);
      ey = lerp(CELL.cbY, CELL.etlY, k);
    } else if (t < 6.5) {
      const k = smooth((t - 5.4) / 1.0);
      eop = 1;
      ex = lerp(0.12, WIRE[0][0], k);
      ey = lerp(CELL.etlY, CELL.metalY, k);
      ez = lerp(CELL.z, WIRE[0][2], k);
    } else if (t < 9.4) {
      eop = 1;
      const p = along(WIRE, (t - 6.5) / 2.9);
      ex = p[0];
      ey = p[1];
      ez = p[2];
    } else if (t < 9.95) {
      eop = 1 - (t - 9.45) / 0.5;
      ex = WIRE[3][0];
      ey = WIRE[3][1];
      ez = WIRE[3][2];
    }
    fadeMesh(hole.current, hx, hy, hz, hop);
    fadeMesh(electron.current, ex, ey, ez, eop);
    const heatT = clamp01((t - 1.85) / 1.25);
    const heatOn = t > 1.85 && t < 3.45;
    fadeMesh(
      heat.current,
      lerp(0.05, -1.2, smooth(heatT)),
      lerp(0.04, 0.16, smooth(heatT)),
      CELL.z,
      heatOn ? Math.sin(Math.PI * heatT) : 0,
    );
    if (bulb.current) bulb.current.emissiveIntensity = t >= 6.5 && t < 9.45 ? 1.8 : 0.06;
    if (flash.current) {
      const age = t - 9.4;
      const on = age > 0 && age < 0.6;
      flash.current.visible = on;
      flash.current.scale.setScalar(on ? 0.3 + age * 2.6 : 0.01);
      const mat = flash.current.material as THREE.MeshBasicMaterial;
      mat.opacity = on ? Math.max(0, 0.9 - age * 1.4) : 0;
    }
  });
  return (
    <group>
      <Slab position={[0, CELL.vbY, 0.7]} size={[1.5, 0.04, 0.04]} color="#e08a55" emissive={0.35} />
      <Slab position={[0, CELL.cbY, 0.7]} size={[1.5, 0.04, 0.04]} color="#79b0ff" emissive={0.35} />
      <Seg a={WIRE[0]} b={WIRE[1]} color="#d7dde6" radius={0.028} />
      <Seg a={WIRE[1]} b={WIRE[2]} color="#d7dde6" radius={0.028} />
      <Seg a={WIRE[2]} b={WIRE[3]} color="#d7dde6" radius={0.028} />
      <mesh position={[2.28, 0.06, 1.02]}>
        <sphereGeometry args={[0.22, 22, 16]} />
        <meshStandardMaterial ref={bulb} color="#fff6e4" emissive="#e4a23a" emissiveIntensity={0.06} />
      </mesh>
      <mesh position={[2.28, -0.14, 1.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.018, 8, 18]} />
        <meshStandardMaterial color="#d7dde6" metalness={0.65} roughness={0.28} />
      </mesh>
      <GlowBall ballRef={photon} color="#e4a23a" radius={0.1} position={[0, 1.9, CELL.z]} />
      <GlowBall ballRef={electron} color="#79b0ff" radius={0.09} />
      <GlowBall ballRef={hole} color="#e08a55" radius={0.09} />
      <GlowBall ballRef={heat} color="#e08a55" radius={0.05} />
      <mesh ref={flash} position={[0.62, CELL.itoY, 1.12]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshBasicMaterial color="#fff1c9" transparent opacity={0} />
      </mesh>
      <Tag position={[-1.42, 0.16, 0]} accent>
        {LOOP_LABEL[phase]}
      </Tag>
    </group>
  );
}

function CellScene({ step }: { step: number }) {
  return (
    <group position={[-0.15, 0.08, 0]}>
      <CellStack />
      {step <= 0 ? <AbsorbAct /> : null}
      {step === 1 ? <PairAct /> : null}
      {step === 2 ? <SplitAct /> : null}
      {step === 3 ? <CollectAct /> : null}
      {step >= 4 ? <AllAct /> : null}
    </group>
  );
}

function MetricsScene(_props: { step: number }) {
  const voc = useSim((s) => s.voc);
  const jsc = useSim((s) => s.jsc);
  const ff = useSim((s) => s.ff);
  const curve = useMemo(() => ivCurve(voc, jsc, ff, 28), [voc, jsc, ff]);
  return (
    <PlotFrame x0={0} x1={1.35} y0={0} y1={30} xLabel="V (Voc)" yLabel="mA/cm²">
      {(map) => {
        const pts = curve.pts.map((p) => map(p.v, p.j));
        const a = map(0, 0);
        const b = map(curve.vmp, 0);
        const c = map(curve.vmp, curve.jmp);
        const d = map(0, curve.jmp);
        return (
          <group>
            <Polyline pts={pts} color="#e4a23a" radius={0.035} />
            <Polyline pts={[a, b, c, d, a]} color="#8fd0a8" radius={0.02} />
            <Tag position={map(voc, 1.2)} accent>
              Voc {voc.toFixed(2)} V
            </Tag>
            <Tag position={map(0.08, jsc)}>{jsc.toFixed(1)}</Tag>
            <Tag position={map(curve.vmp, curve.jmp + 1.5)}>FF {ff.toFixed(2)}</Tag>
          </group>
        );
      }}
    </PlotFrame>
  );
}

const RAIN = [
  { e: 0.95, color: "#e15b4c", x: -0.5 },
  { e: 1.2, color: "#e07a32", x: -0.25 },
  { e: 1.55, color: "#e4a23a", x: 0 },
  { e: 2.2, color: "#3cba84", x: 0.25 },
  { e: 3.0, color: "#7a4de8", x: 0.5 },
] as const;

const SQ_HINT = [
  "hai lỗ hổng không tránh được",
  "nhiệt nhiều · áp thấp",
  "bỏ photon đỏ · dòng nhỏ",
  "cân bằng · đỉnh trần",
  "hai lớp chia phổ",
] as const;

function OneAbsorber({ eg }: { eg: number }) {
  const gap = 0.16 + Math.max(0, eg - 0.4) * 0.28;
  const vb = -0.3;
  const cb = vb + gap;
  return (
    <group>
      <Slab position={[0, 0.02, 0]} size={[1.7, 1.18, 0.78]} color="#241c38" opacity={0.92} emissive={0.12} />
      <Slab position={[0, vb, 0.46]} size={[1.28, 0.045, 0.05]} color="#e08a55" emissive={0.5} />
      <Slab position={[0, cb, 0.46]} size={[1.28, 0.045, 0.05]} color="#79b0ff" emissive={0.5} />
      <Tag position={[0.62, vb, 0.55]}>hóa trị</Tag>
      <Tag position={[0.62, cb, 0.55]}>dẫn</Tag>
      <Tag position={[-0.2, (vb + cb) / 2, 0.55]}>Eg</Tag>
    </group>
  );
}

function TwoAbsorbers() {
  return (
    <group>
      <Slab position={[0, 0.72, 0]} size={[1.7, 0.36, 0.78]} color="#3a2a55" emissive={0.18} />
      <Tag position={[-1.15, 0.95, 0]}>trên · ≈ 1,7 eV</Tag>
      <Slab position={[0, -0.12, 0]} size={[1.7, 0.42, 0.78]} color="#241c38" emissive={0.14} />
      <Tag position={[-1.15, -0.42, 0]}>dưới · ≈ 1,1 eV</Tag>
    </group>
  );
}

function SqMeters({ eg }: { eg: number }) {
  const pct = sqEfficiency(eg);
  const vH = 0.24 + eg * 0.36;
  const uH = 0.2 + (pct / 40) * 1.25;
  const n = RAIN.filter((p) => p.e >= eg).length;
  const swallowed = `nuốt ${n}/5` as "nuốt 0/5" | "nuốt 1/5" | "nuốt 2/5" | "nuốt 3/5" | "nuốt 4/5" | "nuốt 5/5";
  return (
    <group>
      <mesh position={[-1.48, -0.48 + vH / 2, 0]}>
        <boxGeometry args={[0.14, vH, 0.14]} />
        <meshStandardMaterial color="#79b0ff" emissive="#79b0ff" emissiveIntensity={0.45} />
      </mesh>
      <Tag position={[-2.15, 0.05, 0]}>áp theo Eg</Tag>
      <Tag position={[-2.15, -0.95, 0]}>{swallowed}</Tag>
      <mesh position={[1.48, -0.48 + uH / 2, 0]}>
        <boxGeometry args={[0.14, uH, 0.14]} />
        <meshStandardMaterial color="#8fd0a8" emissive="#8fd0a8" emissiveIntensity={0.4} />
      </mesh>
      <Tag position={[2.15, 0.05, 0]} accent>
        {pct.toFixed(1)}%
      </Tag>
      <Tag position={[2.15, -0.95, 0]}>phần giữ lại</Tag>
    </group>
  );
}

function SqRain({ eg, tandem }: { eg: number; tandem: boolean }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);
  const d = useRef<THREE.Mesh>(null);
  const e = useRef<THREE.Mesh>(null);
  const ha = useRef<THREE.Mesh>(null);
  const hb = useRef<THREE.Mesh>(null);
  const hc = useRef<THREE.Mesh>(null);
  const hd = useRef<THREE.Mesh>(null);
  const he = useRef<THREE.Mesh>(null);
  const photons = [a, b, c, d, e];
  const heats = [ha, hb, hc, hd, he];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 5.4;
    const gate = t < 0.18 ? t / 0.18 : t > 4.75 ? 1 - (t - 4.75) / 0.65 : 1;
    const y0 = 1.62;
    const speed = 1.05;
    const yNow = y0 - speed * t;
    RAIN.forEach((p, i) => {
      const topGap = tandem ? 1.7 : eg;
      const stopTop = p.e >= topGap;
      const stopBot = tandem && !stopTop && p.e >= 1.1;
      const stops = stopTop || stopBot;
      const stopY = tandem ? (stopTop ? 0.72 : -0.12) : 0.05;
      if (!stops) {
        const yy = Math.max(-1.15, yNow);
        const fade = yy < -0.42 ? clamp01((yy + 1.15) / 0.73) : 1;
        fadeMesh(photons[i]!.current, p.x, yy, 0.55, gate * fade);
        fadeMesh(heats[i]!.current, p.x, stopY, 0.6, 0);
      } else {
        const yy = Math.max(stopY, yNow);
        const arrival = (y0 - stopY) / speed;
        const age = t - arrival;
        const hold = age > 2.15 ? Math.max(0, 1 - (age - 2.15) / 1.1) : 1;
        fadeMesh(photons[i]!.current, p.x, yy, 0.55, gate * (age > 0 ? hold : 1));
        const gap = stopBot ? 1.1 : topGap;
        const leftover = Math.max(0, p.e - gap);
        const ht = clamp01(age / 1.05);
        const heatOp = age > 0 && age < 1.2 ? Math.sin(Math.PI * ht) * Math.min(1, 0.3 + leftover * 0.45) : 0;
        fadeMesh(
          heats[i]!.current,
          lerp(p.x, p.x - 0.12 - leftover * 0.2, smooth(ht)),
          lerp(stopY + 0.08, stopY + 0.2, smooth(ht)),
          0.62,
          gate * heatOp,
        );
        if (heats[i]!.current) heats[i]!.current.scale.setScalar(0.5 + Math.min(1.35, leftover * 0.48));
      }
    });
  });
  return (
    <group>
      {RAIN.map((p, i) => (
        <GlowBall key={p.color} ballRef={photons[i]!} color={p.color} radius={0.09} position={[p.x, 1.62, 0.55]} />
      ))}
      {RAIN.map((p, i) => (
        <GlowBall key={`heat-${p.color}`} ballRef={heats[i]!} color="#e08a55" radius={0.07} />
      ))}
    </group>
  );
}

function SqCurve({ eg, shade }: { eg: number; shade: boolean }) {
  const y = sqEfficiency(eg);
  return (
    <group position={[2.35, 0.08, -0.15]}>
      <PlotFrame x0={0.5} x1={3} y0={0} y1={40} w={3.25} h={2.4} xLabel="Eg (eV)" yLabel="%">
        {(map) => {
          const line: [number, number, number][] = [];
          for (let i = 0; i <= 28; i++) {
            const x = 0.5 + (i / 28) * 2.5;
            line.push(map(x, sqEfficiency(x)));
          }
          const lo = map(1.0, 0);
          const hi = map(1.6, 31);
          return (
            <group>
              {shade ? (
                <mesh position={[(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, -0.05]}>
                  <boxGeometry args={[Math.abs(hi[0] - lo[0]), Math.abs(hi[1] - lo[1]), 0.02]} />
                  <meshBasicMaterial color="#8fd0a8" transparent opacity={0.2} depthWrite={false} />
                </mesh>
              ) : null}
              <Polyline pts={line} color="#79b0ff" radius={0.026} />
              {Math.abs(eg - 1.34) > 0.08 ? <Tag position={map(1.55, 37.5)}>đỉnh 33,7%</Tag> : null}
              {shade ? <Tag position={map(1.3, 5)}>{"> 30%"}</Tag> : null}
              <mesh position={map(eg, y)}>
                <sphereGeometry args={[0.1, 16, 12]} />
                <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.9} />
              </mesh>
              <Tag position={map(Math.min(2.55, Math.max(0.85, eg)), Math.min(37.5, y + 5))} accent>
                {eg.toFixed(2)} eV · {y.toFixed(1)}%
              </Tag>
            </group>
          );
        }}
      </PlotFrame>
    </group>
  );
}

function SqScene({ step }: { step: number }) {
  const eg = useSim((s) => s.eg);
  const tandem = step >= 4;
  return (
    <group position={[0.05, 0.08, 0]}>
      <group position={[-2.05, 0, 0]}>
        {tandem ? <TwoAbsorbers /> : <OneAbsorber eg={eg} />}
        <SqRain eg={eg} tandem={tandem} />
        {tandem ? null : <SqMeters eg={eg} />}
        <mesh position={[0, 1.82, 0.1]}>
          <sphereGeometry args={[0.15, 20, 16]} />
          <meshStandardMaterial color="#ffe1a3" emissive="#e4a23a" emissiveIntensity={1.2} />
        </mesh>
        <Tag position={[0.55, 1.82, 0]}>nắng</Tag>
        <Tag position={[0, tandem ? -0.95 : -1.28, 0]} accent>
          {SQ_HINT[Math.min(step, 4)]}
        </Tag>
      </group>
      <SqCurve eg={eg} shade={step === 3} />
    </group>
  );
}

function SiliconScene({ step }: { step: number }) {
  const wobble = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (wobble.current) wobble.current.rotation.z = Math.sin(clock.elapsedTime * 6) * 0.08;
  });
  return (
    <group>
      <group position={[-1.5, 0, 0]}>
        <Slab position={[0, 0, 0]} size={[1.5, 1.7, 1.1]} color="#b7c3ce" />
        <Tag position={[0, 1.15, 0]}>Si · 150–180 µm</Tag>
        {step >= 1 ? (
          <group ref={wobble}>
            <Tag position={[0, -1.2, 0]}>cần dao động mạng</Tag>
          </group>
        ) : null}
      </group>
      <group position={[1.5, -0.7, 0]}>
        <Slab position={[0, 0, 0]} size={[1.5, 0.06, 1.1]} color="#3a2a55" emissive={0.2} />
        <Tag position={[0, 0.4, 0]}>perovskite · 0,5 µm</Tag>
      </group>
      {step >= 2 ? (
        <Pop>
          <group position={[0, 1.45, 0]}>
            <Slab position={[-0.8, 0, 0]} size={[1.1, 0.45, 0.4]} color="#e08a55" emissive={0.45} />
            <Tag position={[-0.8, 0.55, 0]}>1400 °C</Tag>
            <Slab position={[0.9, 0, 0]} size={[1.1, 0.45, 0.4]} color="#e4a23a" emissive={0.2} />
            <Tag position={[0.9, 0.55, 0]}>150 °C</Tag>
          </group>
        </Pop>
      ) : null}
      {step >= 3 ? (
        <Pop>
          <group position={[1.5, 0.15, 0]}>
            <Slab position={[0, 0.28, 0]} size={[1.5, 0.08, 1.1]} color="#6d4bd6" />
            <Tag position={[0, 0.7, 0]}>lớp trên cho tandem</Tag>
          </group>
        </Pop>
      ) : null}
    </group>
  );
}

const CHECKS = [
  "Eg hợp",
  "Hấp thụ mạnh",
  "Đi xa",
  "Ít bẫy",
  "Rẻ",
  "Bền, không độc",
];

function IdealScene({ step }: { step: number }) {
  return (
    <group>
      <UnitCell a="#e6c15a" b="#c5ccd6" x="#6d4bd6" bLabel="ABX₃" />
      {CHECKS.map((label, i) => {
        const ok = i < 5 ? step >= 1 : false;
        const show = step === 0 || i < 5 || step >= 2 || step >= 1;
        if (!show) return null;
        const ang = (i / CHECKS.length) * Math.PI * 2;
        const x = Math.cos(ang) * 2.3;
        const z = Math.sin(ang) * 2.3;
        const color = i === 5 ? "#e08a55" : ok || step === 0 ? (step === 0 ? "#1e2832" : "#8fd0a8") : "#1e2832";
        return (
          <group key={label} position={[x, -0.4, z]}>
            <Slab position={[0, 0.3, 0]} size={[0.9, 0.42, 0.12]} color={color} emissive={i === 5 ? 0.25 : 0} />
            <Tag position={[0, 0.85, 0]}>{i === 5 ? "Chưa" : step >= 1 ? "Có" : label}</Tag>
            <Tag position={[0, -0.15, 0]}>{label}</Tag>
          </group>
        );
      })}
    </group>
  );
}

export const earlyScenes = {
  sun: SunScene,
  foundation: FoundationScene,
  photon: PhotonScene,
  bands: BandsScene,
  cell: CellScene,
  metrics: MetricsScene,
  sq: SqScene,
  silicon: SiliconScene,
  ideal: IdealScene,
};
