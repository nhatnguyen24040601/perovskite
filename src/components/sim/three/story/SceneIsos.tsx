import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { HEX, ISO_FAMILIES, LAYER_IDS, type IsoFam } from "@/lib/sim/story5";
import { GlowBall, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { DeviceRig, newCfg, newDev, type CarrierCfg, type DevState } from "./stackKit";
import { between, hash1, lerp } from "./world";

const LBL = {
  sample: t("Mẫu (pin perovskite)", "Sample (perovskite cell)"),
  sim: t("Nguồn sáng: máy mô phỏng mặt trời", "Light source: solar simulator"),
  instr: t("Thiết bị đo (đường J–V, theo dõi MPP)", "Measurement instrument (J–V, MPP tracking)"),
  chamber: t("Buồng thử có kiểm soát", "Controlled test chamber"),
  light: t("Ánh sáng", "Light"),
  temp: t("Nhiệt độ", "Temperature"),
  rh: t("Độ ẩm tương đối", "Relative humidity"),
  env: t("Môi trường", "Environment"),
  load: t("Tải điện", "Electrical load"),
  a: t("Mẫu A", "Sample A"),
  b: t("Mẫu B", "Sample B"),
  aSub: t("ISOS-L-2: ánh sáng + nhiệt (minh họa)", "ISOS-L-2: light + heat (illustrative)"),
  bSub: t("ISOS-D-3: nhiệt ẩm trong tối (minh họa)", "ISOS-D-3: damp heat in the dark (illustrative)"),
  illus: t("minh họa — không phải kết quả đo", "illustrative — not measured results"),
  whole: t("Trở lại toàn bộ pin", "Back to the whole cell"),
  enc: t("Phải báo cáo: có đóng gói hay không, và chi tiết", "Report it: encapsulated or not, and the details"),
  outdoor: t("Ngoài trời: ghi nhận nhiệt độ, độ ẩm, bức xạ", "Outdoors: temperature, humidity and irradiance are recorded"),
  dark: t("Trong tối", "In the dark"),
  bench: t("Bàn đo", "Bench"),
};

type Chamber = { lamp: number; heat: number; rh: number; door: number; outdoor: boolean; bias: boolean };

/** What a test group looks like inside the chamber: only the variables the protocol defines. */
function conditions(fam: IsoFam, lvl: number, T: number): Chamber {
  const hot = lvl >= 2 ? 0.7 : 0;
  const rh3 = lvl === 3;
  const tri = (x: number) => 1 - Math.abs(((x % 2) + 2) % 2 - 1);
  switch (fam) {
    case "D":
      return { lamp: 0, heat: hot, rh: rh3 ? 0.85 : 0, door: 0, outdoor: false, bias: false };
    case "V":
      return { lamp: 0, heat: hot, rh: rh3 ? 0.85 : 0, door: 0, outdoor: false, bias: true };
    case "L":
      return { lamp: 1, heat: hot, rh: rh3 ? 0.5 : 0, door: 0, outdoor: false, bias: false };
    case "O":
      return { lamp: 1, heat: 0.1, rh: 0.2, door: 0, outdoor: true, bias: false };
    case "T":
      return { lamp: 0, heat: lvl === 3 ? -0.8 + 1.6 * tri(T * 0.35) : 0.7 * tri(T * 0.35), rh: lvl === 3 ? 0.3 : 0, door: 0, outdoor: false, bias: false };
    case "LC":
      return { lamp: Math.sin(T * 1.2) > 0 ? 1 : 0.05, heat: hot, rh: rh3 ? 0.5 : 0, door: 0, outdoor: false, bias: false };
    case "LT":
      return {
        lamp: 1,
        heat: lvl === 1 ? 0.5 * tri(T * 0.3) : lvl === 2 ? -0.1 + 0.8 * tri(T * 0.3) : -0.6 + 1.3 * tri(T * 0.3),
        rh: lvl === 1 ? 0.2 : 0.5,
        door: 0,
        outdoor: false,
        bias: false,
      };
  }
}

const UP = new THREE.Vector3(0, 1, 0);
const FEED = new THREE.Vector3(-1.5, -0.3, 0.3);
const tmpD = new THREE.Vector3();
function placeRod(m: THREE.Mesh | null, a: THREE.Vector3, b: THREE.Vector3, r = 0.02, show = true) {
  if (!m) return;
  m.visible = show;
  if (!show) return;
  tmpD.copy(b).sub(a);
  const len = Math.max(1e-3, tmpD.length());
  m.position.copy(a).addScaledVector(tmpD, 0.5);
  m.quaternion.setFromUnitVectors(UP, tmpD.normalize());
  m.scale.set(r, len, r);
}

const NDROP = 24;

/** One test chamber: frame, glass door, lamp panel, heater plate, droplets, thermometer. */
function ChamberBox({ cfg, T, pos = [0, 0, 0], scale = 1, shown = true }: { cfg: MutableRefObject<Chamber>; T: MutableRefObject<number>; pos?: [number, number, number]; scale?: number; shown?: boolean }) {
  const door = useRef<THREE.Group>(null);
  const lampMat = useRef<THREE.MeshBasicMaterial>(null);
  const cone = useRef<THREE.Mesh>(null);
  const coneMat = useRef<THREE.MeshBasicMaterial>(null);
  const heatMat = useRef<THREE.MeshStandardMaterial>(null);
  const fill = useRef<THREE.Mesh>(null);
  const fillMat = useRef<THREE.MeshStandardMaterial>(null);
  const drops = useRef<SwarmApi>(null);
  const colHot = useMemo(() => new THREE.Color("#ff6a3a"), []);
  const colCold = useMemo(() => new THREE.Color("#4aa3ff"), []);
  const tmpC = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const c = cfg.current;
    const tt = T.current;
    if (door.current) door.current.rotation.y = -1.45 * c.door;
    if (lampMat.current) lampMat.current.color.setScalar(0.25 + 0.75 * c.lamp);
    if (coneMat.current) coneMat.current.opacity = 0.11 * c.lamp;
    if (cone.current) cone.current.visible = c.lamp > 0.05;
    if (heatMat.current) {
      tmpC.copy(c.heat >= 0 ? colHot : colCold);
      heatMat.current.emissive.copy(tmpC);
      heatMat.current.emissiveIntensity = Math.abs(c.heat) * 1.4;
    }
    if (fill.current && fillMat.current) {
      const frac = 0.5 + 0.5 * c.heat;
      fill.current.scale.set(0.08, Math.max(0.02, 1.2 * frac), 0.08);
      fill.current.position.y = -0.6 + 0.6 * frac;
      tmpC.copy(colCold).lerp(colHot, frac);
      fillMat.current.color.copy(tmpC);
      fillMat.current.emissive.copy(tmpC);
    }
    const n = Math.round(c.rh * NDROP);
    for (let i = 0; i < NDROP; i++) {
      if (i >= n) {
        drops.current?.hide(i);
        continue;
      }
      const life = (tt * 0.12 + hash1(i * 3.3)) % 1;
      drops.current?.set(i, (hash1(i * 5.1) - 0.5) * 2.4, 0.72 - life * 1.4, (hash1(i * 7.9) - 0.5) * 1.4, 1);
    }
    drops.current?.flush();
  });

  return (
    <group position={pos} scale={scale} visible={shown}>
      {/* frame and walls */}
      <mesh position={[0, -0.82, 0]}>
        <boxGeometry args={[3.0, 0.1, 2.0]} />
        <meshStandardMaterial color="#3a444f" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[3.0, 0.1, 2.0]} />
        <meshStandardMaterial color="#3a444f" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.03, -0.97]}>
        <boxGeometry args={[3.0, 1.7, 0.06]} />
        <meshStandardMaterial color="#27303a" />
      </mesh>
      {[-1.47, 1.47].map((x) => (
        <mesh key={x} position={[x, 0.03, 0]}>
          <boxGeometry args={[0.06, 1.7, 2.0]} />
          <meshStandardMaterial color="#aeb8c4" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
      {/* glass door, hinged on the left */}
      <group position={[-1.47, 0.03, 0.98]}>
        <group ref={door}>
          <mesh position={[1.47, 0, 0]}>
            <boxGeometry args={[2.94, 1.7, 0.04]} />
            <meshStandardMaterial color="#cfe9fb" transparent opacity={0.16} depthWrite={false} />
          </mesh>
        </group>
      </group>
      {/* lamp panel and its cone of light */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.2, 0.05, 1.4]} />
        <meshBasicMaterial ref={lampMat} color="#ffeeb0" />
      </mesh>
      <mesh ref={cone} position={[0, 0.1, 0]} visible={false}>
        <cylinderGeometry args={[0.95, 1.2, 1.45, 24, 1, true]} />
        <meshBasicMaterial ref={coneMat} color="#ffe9a0" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      {/* heater plate */}
      <mesh position={[0, -0.74, 0]}>
        <boxGeometry args={[2.3, 0.05, 1.5]} />
        <meshStandardMaterial ref={heatMat} color="#2a2f36" emissive="#ff6a3a" emissiveIntensity={0} />
      </mesh>
      <Swarm ref={drops} count={NDROP} color={HEX.enc} radius={0.035} halo={1.8} haloOpacity={0.15} emissive={1} />
      {/* thermometer on the right wall */}
      <mesh position={[1.62, 0.03, 0.5]}>
        <boxGeometry args={[0.16, 1.3, 0.1]} />
        <meshStandardMaterial color="#1b222a" />
      </mesh>
      <mesh ref={fill} position={[1.62, 0, 0.56]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial ref={fillMat} color="#ff6a3a" emissive="#ff6a3a" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

/** A rack with the sun above it and a small weather station: the outdoor group. */
function OutdoorRack({ shown }: { shown: boolean }) {
  return (
    <group visible={shown}>
      <mesh position={[0, -0.86, 0]}>
        <boxGeometry args={[4.6, 0.06, 3]} />
        <meshStandardMaterial color="#263a2b" />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.7, 0.1]} />
        <meshStandardMaterial color="#9aa6b2" metalness={0.6} />
      </mesh>
      <group position={[2.0, -0.35, -0.4]}>
        <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.06, 1.0, 0.06]} />
        <meshStandardMaterial color="#9aa6b2" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.35, 0.12, 0.35]} />
          <meshStandardMaterial color="#cfd6de" />
        </mesh>
      </group>
      <GlowBall position={[-1.8, 2.3, -0.6]} color="#ffe14a" radius={0.22} intensity={1.8} />
    </group>
  );
}

/** 5.4 · Prove it with ISOS: a test lab whose chamber shows only the variables of the chosen protocol group. */
export function IsosScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("verify", step), 2);
  const T = useRef(0);
  const st = useRef<DevState>(newDev());
  const cf = useRef<CarrierCfg>(newCfg());
  const st2 = useRef<DevState>(newDev());
  const cf2 = useRef<CarrierCfg>(newCfg());
  const chA = useRef<Chamber>({ lamp: 0, heat: 0, rh: 0, door: 1, outdoor: false, bias: false });
  const chB = useRef<Chamber>({ lamp: 0, heat: 0, rh: 0, door: 0, outdoor: false, bias: false });
  const sampleG = useRef<THREE.Group>(null);
  const sampleG2 = useRef<THREE.Group>(null);
  const grpA = useRef<THREE.Group>(null);
  const grpB = useRef<THREE.Group>(null);
  const bench = useRef<THREE.Group>(null);
  const simHead = useRef<THREE.Group>(null);
  const instr = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const cab1 = useRef<THREE.Mesh>(null);
  const cab2 = useRef<THREE.Mesh>(null);
  const rack = useRef<THREE.Group>(null);
  const a0 = useMemo(() => new THREE.Vector3(), []);
  const b0 = useMemo(() => new THREE.Vector3(), []);
  const fam = useSim((s) => String(s.fab.iso ?? "L") as IsoFam);
  const lvl = useSim((s) => Number(s.fab.lvl ?? 2) || 2);
  const row = (ISO_FAMILIES.find((f) => f.fam === fam) ?? ISO_FAMILIES[2]!).rows[lvl - 1]!;
  const outdoor = fam === "O";

  const gBench = useGate(() => step === 0);
  const gVars = useGate(() => step === 2);
  const gRun = useGate(() => step >= 3 && step <= 5);
  const gCmp = useGate(() => step === 6);
  const gEnd = useGate(() => step === 7);

  useFrame(() => {
    const tt = clock.current.t;
    T.current = tt;
    const f = useSim.getState().fab;
    const fm = String(f.iso ?? "L") as IsoFam;
    const lv = Number(f.lvl ?? 2) || 2;
    const cmp = step === 6;
    const end = step === 7;
    const cond = cmp ? conditions("L", 2, tt) : conditions(fm, lv, tt);
    const condB = conditions("D", 3, tt);
    // how far the chamber is "up": ghosted while choosing, full while running
    const run = step <= 0 ? 0 : step === 1 ? 0.35 : step === 2 ? 0.7 : step === 3 ? between(tt, 1.0, 4.0) : 1;
    const a = chA.current;
    a.lamp = cond.lamp * run;
    a.heat = cond.heat * run;
    a.rh = cond.rh * run;
    a.door = step <= 2 ? 1 : step === 3 ? 1 - between(tt, 3.3, 4.2) : 0;
    const b = chB.current;
    b.lamp = condB.lamp;
    b.heat = condB.heat;
    b.rh = condB.rh;
    b.door = 0;

    // where the sample is
    const inside = step >= 3;
    const kIn = step === 3 ? between(tt, 0.4, 3.4) : inside ? 1 : 0;
    const out = !outdoor;
    const sx = lerp(-0.3, 0, kIn);
    const sy = lerp(-0.62, outdoor ? -0.3 : -0.4, kIn);
    const sz = lerp(2.3, 0, kIn);
    const sc = lerp(0.5, outdoor ? 0.55 : 0.42, kIn);
    const sg = sampleG.current;
    if (sg) {
      if (cmp) {
        sg.position.set(-1.2, -0.4 * 0.42, 0);
        sg.scale.setScalar(0.42 * 0.42);
      } else if (end) {
        sg.position.set(0, 0, 0);
        sg.scale.setScalar(1);
      } else {
        sg.position.set(sx, sy, sz);
        sg.scale.setScalar(sc);
      }
    }
    if (sampleG2.current) {
      sampleG2.current.visible = cmp;
      sampleG2.current.position.set(1.2, -0.4 * 0.42, 0);
      sampleG2.current.scale.setScalar(0.42 * 0.42);
    }
    if (grpA.current) {
      grpA.current.position.set(cmp ? -1.2 : 0, 0, 0);
      grpA.current.scale.setScalar(cmp ? 0.42 : 1);
      grpA.current.visible = !end && out;
    }
    if (grpB.current) {
      grpB.current.visible = cmp;
      grpB.current.position.set(1.2, 0, 0);
      grpB.current.scale.setScalar(0.42);
    }
    if (rack.current) rack.current.visible = outdoor && !end && !cmp;
    if (bench.current) bench.current.visible = !end;
    if (instr.current) instr.current.visible = !end && !cmp;
    if (simHead.current) simHead.current.visible = step <= 2 && !end;
    if (screenMat.current) screenMat.current.color.set(step >= 3 && step <= 5 ? "#5ff0a5" : "#2a6a4a");

    // sample state
    const d = st.current;
    const c = cf.current;
    d.T = tt;
    c.T = tt;
    d.nip = 0;
    for (const id of LAYER_IDS) {
      d.hi[id] = 0;
      d.tags[id] = end;
      d.op[id] = 1;
    }
    d.dim = 0;
    d.sel = null;
    d.region = 0;
    d.paths = 0;
    d.defect = 0;
    d.poles = false;
    d.circuit = 0;
    d.current = 0;
    d.shell = end ? between(tt, 0.8, 2.2) * 0.9 : 0;
    d.explode += ((end ? 0.45 : 0) - d.explode) * 0.08;
    const lit = (step === 0 && true) || (step >= 3 && a.lamp > 0.5 && !cmp) || (cmp && a.lamp > 0.5);
    c.light = lit && !end ? 1 : 0;
    c.photons = true;
    c.pairs = true;
    c.reach = 1;
    c.ext = false;
    c.rate = 0.1;
    c.defect = 0;
    c.reject = "none";
    c.only = "both";
    c.unabs = 0;
    c.parasitic = 0;
    c.clab = false;
    const d2 = st2.current;
    const c2 = cf2.current;
    d2.T = tt;
    c2.T = tt;
    d2.nip = 0;
    d2.explode = 0;
    for (const id of LAYER_IDS) {
      d2.hi[id] = 0;
      d2.tags[id] = false;
      d2.op[id] = 1;
    }
    d2.shell = 0;
    d2.defect = 0;
    d2.circuit = 0;
    d2.current = 0;
    d2.dim = 0;
    d2.region = 0;
    d2.paths = 0;
    d2.poles = false;
    c2.light = 0;

    // cables from the sample to the instrument
    const insideChamber = inside && out && !end;
    const term = a0.set(sg ? sg.position.x - 1.3 * (sg.scale.x || 1) : 0, sg ? sg.position.y : 0, sg ? sg.position.z : 0);
    const port = b0.set(-3.55, -0.3, 0.2);
    if (insideChamber) {
      placeRod(cab1.current, term, FEED, 0.02, !cmp);
      placeRod(cab2.current, FEED, port, 0.02, !cmp);
    } else {
      placeRod(cab1.current, term, port, 0.02, !end && !cmp);
      placeRod(cab2.current, term, port, 0.02, false);
    }
  });

  const labelsRun = gRun;
  return (
    <group>
      {/* bench */}
      <group ref={bench}>
        <mesh position={[0, -0.93, 0.4]}>
          <boxGeometry args={[9.2, 0.1, 5.4]} />
          <meshStandardMaterial color="#18202a" />
        </mesh>
        <mesh position={[-0.3, -0.84, 2.3]}>
          <boxGeometry args={[1.6, 0.07, 1.1]} />
          <meshStandardMaterial color="#2a3340" metalness={0.3} />
        </mesh>
      </group>

      <group ref={grpA}>
        <ChamberBox cfg={chA} T={T} />
      </group>
      <group ref={grpB}>
        <ChamberBox cfg={chB} T={T} />
      </group>
      <group ref={rack}>
        <OutdoorRack shown />
      </group>

      {/* the solar simulator over the bench sample */}
      <group ref={simHead} position={[-0.3, 0.55, 2.3]}>
        <mesh>
          <boxGeometry args={[1.0, 0.18, 0.8]} />
          <meshStandardMaterial color="#4a5560" metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.85, 0.04, 0.65]} />
          <meshBasicMaterial color="#ffeeb0" />
        </mesh>
      </group>

      {/* measurement instrument */}
      <group ref={instr} position={[-3.9, -0.3, 0.2]}>
        <mesh>
          <boxGeometry args={[0.7, 0.9, 0.8]} />
          <meshStandardMaterial color="#27313c" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0.0, 0.18, 0.41]}>
          <boxGeometry args={[0.52, 0.36, 0.02]} />
          <meshBasicMaterial ref={screenMat} color="#2a6a4a" />
        </mesh>
        <mesh position={[-0.2, -0.2, 0.41]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={1} />
        </mesh>
      </group>
      <mesh ref={cab1}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#cfd6de" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh ref={cab2} visible={false}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#cfd6de" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* the sample: the same device as 5.1 – 5.3 */}
      <group ref={sampleG}>
        <DeviceRig st={st} cf={cf} arch="pin" />
      </group>
      <group ref={sampleG2}>
        <DeviceRig st={st2} cf={cf2} arch="pin" />
      </group>

      {/* labels */}
      {gBench ? (
        <>
          <StoryTag position={[-0.3, -0.15, 2.9]} kind="layer">
            {LBL.sample}
          </StoryTag>
          <StoryTag position={[-0.3, 0.95, 2.3]} kind="concept">
            {LBL.sim}
          </StoryTag>
          <StoryTag position={[-3.9, 0.45, 0.2]} kind="concept">
            {LBL.instr}
          </StoryTag>
        </>
      ) : null}
      {gVars ? (
        <>
          <StoryTag position={[0, 1.25, 0]} kind="tiny" sub={row.light}>
            {outdoor ? t("Ánh sáng: ánh nắng", "Light: sunlight") : LBL.light}
          </StoryTag>
          <StoryTag position={[1.9, 0.6, 0.3]} kind="tiny" sub={row.temp}>
            {LBL.temp}
          </StoryTag>
          <StoryTag position={[-2.0, -0.2, 0.6]} kind="tiny" sub={row.rh}>
            {LBL.rh}
          </StoryTag>
          <StoryTag position={[0, -1.15, 1.2]} kind="tiny" sub={row.env}>
            {LBL.env}
          </StoryTag>
          <StoryTag position={[-3.9, 0.55, 0.2]} kind="tiny" sub={row.load}>
            {LBL.load}
          </StoryTag>
        </>
      ) : null}
      {labelsRun ? (
        <>
          <StoryTag position={[0, 1.2, 0]} kind="concept" sub={t(`ISOS-${row.id}`, `ISOS-${row.id}`)}>
            {LBL.chamber}
          </StoryTag>
          {step >= 3 ? (
            <StoryTag position={[0, -1.25, 1.2]} kind="tiny">
              {LBL.illus}
            </StoryTag>
          ) : null}
        </>
      ) : null}
      {gCmp ? (
        <>
          <StoryTag position={[-1.2, 0.6, 0]} kind="layer" sub={LBL.aSub}>
            {LBL.a}
          </StoryTag>
          <StoryTag position={[1.2, 0.6, 0]} kind="layer" sub={LBL.bSub}>
            {LBL.b}
          </StoryTag>
          <StoryTag position={[0, -0.85, 0.8]} kind="tiny">
            {LBL.illus}
          </StoryTag>
        </>
      ) : null}
      {gEnd ? (
        <>
          <StoryTag position={[0, 2.3, 0]} kind="concept">
            {LBL.whole}
          </StoryTag>
          <StoryTag position={[0, -1.7, 0]} kind="tiny">
            {LBL.enc}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
