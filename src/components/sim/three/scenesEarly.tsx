import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ivCurve, photonEnergy, sqEfficiency, wavelengthHex } from "@/lib/sim/physics";
import { useSim } from "@/lib/sim/store";
import { FlowDots, Ion, Molecule, OctaMesh, Pop, SPHERE, Slab, Tag, UnitCell } from "./kit";
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

function PhotonScene({ step }: { step: number }) {
  const nm = useSim((s) => s.wavelength);
  const color = wavelengthHex(nm);
  const e = photonEnergy(nm);
  const bars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const w = 320 + (i / 27) * 880;
        return { w, c: wavelengthHex(w), x: -3.2 + (i / 27) * 6.4 };
      }),
    [],
  );
  const x = -3.2 + ((nm - 320) / 880) * 6.4;
  return (
    <group>
      {bars.map((b) => (
        <mesh key={b.w} position={[b.x, -0.7, 0]}>
          <boxGeometry args={[0.2, 0.7 + (b.w < 780 && b.w > 400 ? 0.8 : 0.25), 0.2]} />
          <meshStandardMaterial color={b.c} emissive={b.c} emissiveIntensity={0.35} />
        </mesh>
      ))}
      <Tag position={[-3.2, -1.45, 0]}>UV</Tag>
      <Tag position={[0, -1.45, 0]}>nhìn thấy</Tag>
      <Tag position={[3.1, -1.45, 0]}>IR</Tag>
      <mesh position={[x, 0.85, 0.4]}>
        <sphereGeometry args={[0.28, 24, 18]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
      <Tag position={[x, 1.45, 0.4]} accent>
        {nm.toFixed(0)} nm · {e.toFixed(2)} eV
      </Tag>
      {step >= 2 ? (
        <Pop>
          <Tag position={[0, 2.05, 0]}>Gần nửa năng lượng nằm ở hồng ngoại</Tag>
        </Pop>
      ) : null}
    </group>
  );
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

function BandsScene({ step }: { step: number }) {
  if (step >= 4) {
    return (
      <group>
        <BandBuilding gap={0.02} label="kim loại" position={[-2.4, -0.2, 0]} />
        <BandBuilding gap={0.7} label="bán dẫn" position={[0.3, -0.2, 0]} jump />
        <BandBuilding gap={1.7} label="cách điện" position={[3.1, -0.2, 0]} />
      </group>
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

function CellScene({ step }: { step: number }) {
  return (
    <group>
      <Slab position={[0, -1.15, 0]} size={[2.3, 0.14, 1.35]} color="#d5e2ea" />
      <Tag position={[1.45, -1.15, 0]}>ITO</Tag>
      <Slab position={[0, -0.9, 0]} size={[2.2, 0.22, 1.25]} color="#c46a45" />
      <Tag position={[1.45, -0.9, 0]}>HTL</Tag>
      <Slab position={[0, -0.25, 0]} size={[2.1, 0.85, 1.15]} color="#2a2140" emissive={0.18} />
      <Tag position={[1.55, -0.25, 0]}>hấp thụ</Tag>
      <Slab position={[0, 0.42, 0]} size={[2.2, 0.2, 1.25]} color="#4d86d6" />
      <Tag position={[1.45, 0.42, 0]}>ETL</Tag>
      <Slab position={[0, 0.68, 0]} size={[2.3, 0.12, 1.35]} color="#e0b15a" />
      <Tag position={[1.5, 0.68, 0]}>kim loại</Tag>
      <FlowDots
        count={5}
        color="#e4a23a"
        speed={step === 0 ? 0.22 : 0.12}
        path={(t) => {
          const y = -1.8 + t * 2.5;
          const pass = t > 0.55 && Math.floor(t * 20) % 2 === 0 && step === 0;
          return [pass ? 0.35 : -0.25, Math.min(y, step === 0 && !pass ? -0.1 : y), 0.2];
        }}
      />
      {step >= 1 ? (
        <Pop>
          <group position={[-2.6, 0, 0]}>
            <Slab position={[0, -0.45, 0]} size={[1.3, 0.22, 0.2]} color="#c46a45" />
            <Slab position={[0, 0.55, 0]} size={[1.3, 0.22, 0.2]} color="#4d86d6" />
            <FlowDots count={1} color="#79b0ff" speed={0.3} path={(t) => [0.2, -0.3 + t * 0.8, 0.2]} />
            <Tag position={[0, 1.05, 0]}>e⁻ lên vùng dẫn</Tag>
            <Tag position={[0, -0.85, 0]}>lỗ trống ở lại</Tag>
          </group>
        </Pop>
      ) : null}
      {step >= 2 ? (
        <Pop>
          <FlowDots count={3} color="#79b0ff" speed={0.25} path={(t) => [0.15, -0.2 + t * 0.85, 0.35]} />
          <FlowDots count={3} color="#e08a55" speed={0.25} path={(t) => [-0.15, -0.15 - t * 0.7, 0.35]} />
          <mesh position={[0, -0.2, 0.5]}>
            <sphereGeometry args={[0.08, 12, 10]} />
            <meshBasicMaterial color="#f4efe6" transparent opacity={0.35} />
          </mesh>
          <Tag position={[0, 1.15, 0]}>tách trước khi tái hợp</Tag>
        </Pop>
      ) : null}
      {step >= 3 ? (
        <Pop>
          <mesh position={[2.3, -0.2, 0]}>
            <sphereGeometry args={[0.28, 20, 16]} />
            <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={1.1} />
          </mesh>
          <Tag position={[2.3, 0.35, 0]}>mạch ngoài</Tag>
          <FlowDots
            count={4}
            color="#79b0ff"
            speed={0.2}
            path={(t) => [1.15 + Math.sin(t * Math.PI) * 1.15, 0.68 - t * 1.83, 0.8]}
          />
        </Pop>
      ) : null}
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

function SqScene(_props: { step: number }) {
  const eg = useSim((s) => s.eg);
  return (
    <PlotFrame x0={0.5} x1={3} y0={0} y1={40} xLabel="Eg (eV)" yLabel="%">
      {(map) => {
        const line: [number, number, number][] = [];
        for (let i = 0; i <= 32; i++) {
          const x = 0.5 + (i / 32) * 2.5;
          line.push(map(x, sqEfficiency(x)));
        }
        const y = sqEfficiency(eg);
        return (
          <group>
            <Polyline pts={line} color="#79b0ff" />
            <SegMark at={map(1.34, 33.7)} label="33,7%" />
            <mesh position={map(eg, y)}>
              <sphereGeometry args={[0.12, 16, 12]} />
              <meshStandardMaterial color="#e4a23a" emissive="#e4a23a" emissiveIntensity={0.8} />
            </mesh>
            <Tag position={map(eg, y + 3)} accent>
              {eg.toFixed(2)} eV · ~{y.toFixed(1)}%
            </Tag>
          </group>
        );
      }}
    </PlotFrame>
  );
}

function SegMark({ at, label }: { at: [number, number, number]; label: string }) {
  return <Tag position={at}>{label}</Tag>;
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
