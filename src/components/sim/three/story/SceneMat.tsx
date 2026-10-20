import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { HEX, LAYER_IDS, type LayerId } from "@/lib/sim/story5";
import { StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import { D, DeviceRig, W, newCfg, newDev, type CarrierCfg, type DevState } from "./stackKit";
import { between, hash1 } from "./world";

const LBL = {
  anchor: t("Nhóm neo → ITO", "Anchoring group → ITO"),
  head: t("Nhóm đầu → perovskite", "Head group → perovskite"),
  sam: t("SAM: phân tử đứng trên ITO", "SAM: molecules standing on ITO"),
  nio: t("NiOₓ: lớp oxit gồm các hạt", "NiOₓ: an oxide film of grains"),
  notScale: t("không đúng tỉ lệ", "not to scale"),
  hypo: t("điện cực giả định · minh họa", "hypothetical electrode · illustrative"),
  noBuf: t("Không có lớp đệm: tiếp xúc kém, hạt tải kẹt lại", "No buffer: poor contact, carriers stall"),
  withBuf: t("Có lớp đệm phù hợp: hạt tải đi tiếp", "A suitable buffer: carriers continue"),
  concept: t("minh họa khái niệm", "conceptual illustration"),
  shell: t("Đóng gói (vỏ bảo vệ)", "Encapsulation (protective shell)"),
  moist: t("Hơi ẩm", "Moisture"),
  oxy: t("Oxy", "Oxygen"),
  inside: t("Ánh sáng và nhiệt vẫn gây di chuyển ion bên trong", "Light and heat still drive ion migration inside"),
  ito: t("ITO", "ITO"),
  samOrNio: t("SAM / NiOₓ", "SAM / NiOₓ"),
  perov: t("Perovskite", "Perovskite"),
  etl: t("C₆₀ / PCBM", "C₆₀ / PCBM"),
  buf: t("BCP / SnO₂", "BCP / SnO₂"),
  metal: t("Ag / Au / Al", "Ag / Au / Al"),
  nonbest: t("Không có vật liệu nào tối ưu cho mọi chồng lớp", "No single material is best for every stack"),
};

const NM = 24;

/** The HTL interface close-up: SAM molecules standing between the ITO and the perovskite, or an oxide film of grains. */
function HtlDetail({ st, on }: { st: MutableRefObject<DevState>; on: boolean }) {
  const rods = useRef<THREE.InstancedMesh>(null);
  const anch = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const grains = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(() => {
    const d = st.current;
    const mode = String(useSim.getState().fab.htlc ?? "sam");
    const yTop = d.cy.tco - d.hh.tco / 2;
    const yBot = d.cy.perov + d.hh.perov / 2;
    const mid = (yTop + yBot) / 2;
    const len = Math.max(0.05, yTop - yBot - 0.03);
    const sam = on && mode === "sam";
    const nio = on && mode === "nio";
    const put = (m: THREE.InstancedMesh | null, i: number, x: number, y: number, z: number, sx: number, sy: number, sz: number, show: boolean) => {
      if (!m) return;
      dummy.position.set(x, show ? y : -60, z);
      dummy.scale.set(show ? sx : 1e-4, show ? sy : 1e-4, show ? sz : 1e-4);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    };
    for (let i = 0; i < NM; i++) {
      const x = ((i % 6) - 2.5) * 0.3 + (hash1(i * 3.3) - 0.5) * 0.07;
      const z = (Math.floor(i / 6) - 1.5) * 0.26 + (hash1(i * 7.7) - 0.5) * 0.07;
      put(rods.current, i, x, mid, z, 0.012, len, 0.012, sam);
      put(anch.current, i, x, yTop - 0.015, z, 0.032, 0.032, 0.032, sam);
      put(heads.current, i, x, yBot + 0.035, z, 0.055, 0.045, 0.055, sam);
      const wob = (hash1(i * 5.1) - 0.5) * 0.02;
      put(grains.current, i, x, mid + wob, z, 0.14, 0.05 + (hash1(i * 2.2) * 0.02), 0.12, nio);
    }
    for (const m of [rods.current, anch.current, heads.current, grains.current]) if (m) m.instanceMatrix.needsUpdate = true;
  });
  return (
    <group>
      <instancedMesh ref={rods} args={[undefined, undefined, NM]} frustumCulled={false}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color={HEX.htl} emissive={HEX.htl} emissiveIntensity={0.4} />
      </instancedMesh>
      <instancedMesh ref={anch} args={[undefined, undefined, NM]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#eaf3fb" emissive="#9fb7cf" emissiveIntensity={0.5} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, NM]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color="#7be3a8" emissive="#3fbf7f" emissiveIntensity={0.7} />
      </instancedMesh>
      <instancedMesh ref={grains} args={[undefined, undefined, NM]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial color="#2f9b73" emissive="#1c6b4c" emissiveIntensity={0.5} roughness={0.8} />
      </instancedMesh>
    </group>
  );
}

const NW = 14;
const NO = 10;

/** Moisture and oxygen arrive at the device and are turned away by the shell; before the shell exists they reach the stack. */
export function Weather({ st, on }: { st: MutableRefObject<DevState>; on: boolean }) {
  const water = useRef<SwarmApi>(null);
  const oxy = useRef<SwarmApi>(null);
  useFrame(({ clock }) => {
    const d = st.current;
    const T = clock.elapsedTime;
    const yc = (d.top + d.bottom) / 2;
    const hx = W / 2 + 0.17;
    const hy = (d.top - d.bottom) / 2 + 0.17;
    const hz = D / 2 + 0.17;
    const run = (api: SwarmApi | null, n: number, seed: number) => {
      if (!api) return;
      for (let i = 0; i < n; i++) {
        if (!on) {
          api.hide(i);
          continue;
        }
        const th = hash1(i * 4.1 + seed) * Math.PI * 2;
        const ph = (hash1(i * 7.3 + seed) - 0.3) * 1.3;
        const ux = Math.cos(th) * Math.cos(ph);
        const uy = Math.sin(ph);
        const uz = Math.sin(th) * Math.cos(ph);
        const rHit = 1 / Math.max(Math.abs(ux) / hx, Math.abs(uy) / hy, Math.abs(uz) / hz);
        const p = (T * 0.32 + hash1(i * 2.9 + seed)) % 1;
        const k = p < 0.5 ? p / 0.5 : 1 - (p - 0.5) / 0.5;
        const stop = rHit * (0.2 + 0.8 * Math.min(1, d.shell * 1.25));
        const r = rHit + 1.7 - (rHit + 1.7 - stop) * k * k;
        api.set(i, ux * r, yc + uy * r, uz * r, 1);
      }
      api.flush();
    };
    run(water.current, NW, 0);
    run(oxy.current, NO, 40);
  });
  return (
    <>
      <Swarm ref={water} count={NW} color={HEX.enc} radius={0.04} halo={1.8} haloOpacity={0.16} emissive={1.1} />
      <Swarm ref={oxy} count={NO} color="#e8eef5" radius={0.03} halo={1.8} haloOpacity={0.12} emissive={0.8} />
    </>
  );
}

export function MatTags({ st, on }: { st: MutableRefObject<DevState>; on: boolean }) {
  const refs = useRef<Record<string, THREE.Group | null>>({});
  const texts: Record<LayerId, string> = {
    glass: "",
    tco: LBL.ito,
    htl: LBL.samOrNio,
    perov: LBL.perov,
    etl: LBL.etl,
    buf: LBL.buf,
    metal: LBL.metal,
  };
  useFrame(() => {
    for (const id of LAYER_IDS) refs.current[id]?.position.set(0, st.current.cy[id], 0);
  });
  return (
    <>
      {LAYER_IDS.filter((id) => id !== "glass").map((id) => (
        <group key={id} ref={(el) => void (refs.current[id] = el)}>
          {on ? (
            <StoryTag position={[-W / 2 - 0.6, 0, D / 2]} kind="layer">
              {texts[id]}
            </StoryTag>
          ) : null}
        </group>
      ))}
    </>
  );
}

/** 5.3 · Why those ingredients: one layer at a time, with the interface close-ups the choice depends on. */
export function MatScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("why", step), 2);
  const st = useRef<DevState>(newDev());
  const cf = useRef<CarrierCfg>(newCfg());
  const gSam = useGate(() => step === 1 && String(useSim.getState().fab.htlc ?? "sam") === "sam");
  const gNio = useGate(() => step === 1 && String(useSim.getState().fab.htlc ?? "sam") === "nio");
  const gHypo = useGate(() => step === 0);
  const gNoBuf = useGate(() => step === 4 && String(useSim.getState().fab.buf ?? "no") === "no");
  const gBuf = useGate(() => step === 4 && String(useSim.getState().fab.buf ?? "no") === "yes");
  const gShell = useGate(() => step === 5 && st.current.shell > 0.5);
  const gCompare = useGate(() => step === 6);
  const bufTag = useRef<THREE.Group>(null);
  const htlTag = useRef<THREE.Group>(null);
  const shellTag = useRef<THREE.Group>(null);

  useFrame((_, dtRaw) => {
    const T = clock.current.t;
    const dt = Math.min(dtRaw, 0.05);
    const d = st.current;
    const c = cf.current;
    const f = useSim.getState().fab;
    d.T = T;
    c.T = T;
    d.nip = 0;
    for (const id of LAYER_IDS) {
      d.hi[id] = 0;
      d.op[id] = 1;
      d.tags[id] = false;
    }
    d.dim = 0;
    d.region = 0;
    d.paths = 0;
    d.defect = 0;
    d.defectAt = "etl";
    d.poles = false;
    d.circuit = 0;
    d.current = 0;
    d.shell = 0;
    d.sel = null;
    c.light = 1;
    c.photons = true;
    c.pairs = true;
    c.only = "both";
    c.reach = 1;
    c.ext = true;
    c.defect = 0;
    c.parasitic = 0;
    c.unabs = 0;
    c.reject = "none";
    c.clab = false;

    const ex = [0.45, 0.55, 0.5, 0.5, 0.45, 0.12, 0.5][step] ?? 0.4;
    d.explode += (ex - d.explode) * Math.min(1, dt * 3);

    switch (step) {
      case 0: {
        const clear = String(f.tcoc ?? "bal") === "clear";
        d.hi.tco = 1;
        d.dim = 0.5;
        d.tags.tco = d.tags.glass = true;
        c.parasitic = clear ? 0 : 1;
        d.circuit = 1;
        d.poles = true;
        d.current = clear ? 0.18 : 0.9;
        break;
      }
      case 1: {
        d.hi.htl = 1;
        d.op.htl = 0.22;
        d.dim = 0.55;
        d.tags.tco = d.tags.htl = d.tags.perov = true;
        c.only = "h";
        c.reach = 0.66;
        c.ext = false;
        if (String(f.ifc ?? "ok") === "bad") {
          d.defectAt = "htl";
          d.defect = 1;
          c.defect = 0.55;
        }
        break;
      }
      case 2:
        d.hi.perov = 1;
        d.dim = 0.5;
        d.tags.perov = true;
        c.reach = 0.54;
        c.ext = false;
        break;
      case 3:
        d.hi.etl = 1;
        d.dim = 0.55;
        d.tags.etl = d.tags.perov = true;
        c.only = "e";
        c.reach = 0.66;
        c.ext = false;
        break;
      case 4: {
        const yes = String(f.buf ?? "no") === "yes";
        d.hi.etl = 0.5;
        d.hi.buf = yes ? 1 : 0;
        d.op.buf = yes ? 1 : 0;
        d.dim = 0.5;
        d.tags.etl = true;
        d.tags.metal = true;
        d.tags.buf = yes;
        d.circuit = 1;
        d.poles = true;
        if (yes) {
          d.current = 0.9;
        } else {
          d.defectAt = "buf";
          d.defect = 1;
          c.defect = 0.5;
          d.current = 0.25;
        }
        break;
      }
      case 5:
        d.shell = between(T, 0.8, 2.4);
        d.hi.metal = 1;
        d.dim = 0.35;
        d.tags.metal = true;
        d.circuit = 1;
        d.current = 0.9;
        break;
      default:
        c.light = 0;
        break;
    }
    const L = f.layer;
    if (L === "enc") d.shell = Math.max(d.shell, 0.9);
    if (L && LAYER_IDS.includes(L as LayerId) && step !== 6) d.hi[L as LayerId] = Math.max(d.hi[L as LayerId], 0.5);

    if (bufTag.current) bufTag.current.position.set(0.3, (d.cy.etl + d.cy.metal) / 2, 0.4);
    if (htlTag.current) htlTag.current.position.set(0, d.cy.htl, 0);
    if (shellTag.current) shellTag.current.position.set(0, d.top + 0.25, 0);
  });

  return (
    <group>
      <DeviceRig st={st} cf={cf} arch="pin" pickable short />
      <HtlDetail st={st} on={step === 1} />
      <Weather st={st} on={step === 5} />
      <MatTags st={st} on={gCompare} />
      <group ref={htlTag}>
        {gSam ? (
          <>
            <StoryTag position={[0.95, 0.16, 0.4]} kind="concept" sub={LBL.notScale}>
              {LBL.sam}
            </StoryTag>
            <StoryTag position={[-0.4, 0.2, 0.65]} kind="tiny" minor>
              {LBL.anchor}
            </StoryTag>
            <StoryTag position={[-0.4, -0.2, 0.65]} kind="tiny" minor>
              {LBL.head}
            </StoryTag>
          </>
        ) : null}
        {gNio ? (
          <StoryTag position={[0.95, 0.16, 0.4]} kind="concept" sub={LBL.notScale}>
            {LBL.nio}
          </StoryTag>
        ) : null}
      </group>
      <group ref={bufTag}>
        {gNoBuf ? (
          <StoryTag position={[0.2, -0.05, 0]} kind="bad" sub={LBL.concept}>
            {LBL.noBuf}
          </StoryTag>
        ) : null}
        {gBuf ? (
          <StoryTag position={[0.2, -0.05, 0]} kind="good" sub={LBL.concept}>
            {LBL.withBuf}
          </StoryTag>
        ) : null}
      </group>
      <group ref={shellTag}>
        {gShell ? (
          <>
            <StoryTag position={[0, 0.1, 0]} kind="layer">
              {LBL.shell}
            </StoryTag>
            <StoryTag position={[-1.5, -0.8, 1]} kind="particle" minor>
              {LBL.moist}
            </StoryTag>
            <StoryTag position={[1.5, -0.8, 1]} kind="tiny" minor>
              {LBL.oxy}
            </StoryTag>
          </>
        ) : null}
      </group>
      {gHypo ? (
        <StoryTag position={[0, -1.45, 0]} kind="tiny">
          {LBL.hypo}
        </StoryTag>
      ) : null}
      {gCompare ? (
        <StoryTag position={[0, -1.5, 0]} kind="concept">
          {LBL.nonbest}
        </StoryTag>
      ) : null}
    </group>
  );
}
