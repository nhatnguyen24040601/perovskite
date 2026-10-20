import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { HEX, LAYER_IDS } from "@/lib/sim/story5";
import { StoryTag, Swarm, stepDur, useStoryClock, type SwarmApi } from "./storyKit";
import { DeviceRig, newCfg, newDev, type CarrierCfg, type DevState } from "./stackKit";
import { MatTags, Weather } from "./SceneMat";
import { between } from "./world";

const LBL = {
  s1: t("1 · Kiến trúc", "1 · Architecture"),
  s2: t("2 · Chức năng", "2 · Function"),
  s3: t("3 · Vật liệu", "3 · Materials"),
  s4: t("4 · Độ bền", "4 · Stability"),
  redesign: t("Thiết kế lại dựa trên bằng chứng", "Evidence-based redesign"),
  stress: t("Ánh sáng · nhiệt · độ ẩm — điều kiện xác định", "Light · heat · humidity — defined conditions"),
  concept: t("minh họa khái niệm", "conceptual illustration"),
};

const RING_R = 2.5;
const NR = 18;
const ringPt = (a: number): [number, number, number] => [Math.sin(a) * RING_R, Math.cos(a) * RING_R * 0.62 + 0.1, -1.4];

/** 5.5 · The same device, walked through the four steps and then closed into a loop. */
export function FinScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("c5fin", step), 2);
  const st = useRef<DevState>(newDev());
  const cf = useRef<CarrierCfg>(newCfg());
  const ring = useRef<SwarmApi>(null);

  useFrame((_, dtRaw) => {
    const T = clock.current.t;
    const dt = Math.min(dtRaw, 0.05);
    const d = st.current;
    const c = cf.current;
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
    d.poles = false;
    d.circuit = 0;
    d.current = 0;
    d.shell = 0;
    d.sel = null;
    c.light = 1;
    c.photons = true;
    c.pairs = false;
    c.reach = 1;
    c.ext = false;
    c.defect = 0;
    c.reject = "none";
    c.only = "both";
    c.unabs = 0;
    c.parasitic = 0;
    c.clab = false;
    let ex = 0.45;
    switch (step) {
      case 0:
        d.region = between(T, 0.4, 2);
        d.tags.glass = d.tags.tco = d.tags.buf = d.tags.metal = T > 2.5;
        break;
      case 1:
        ex = 0.2;
        c.pairs = true;
        c.ext = true;
        d.circuit = between(T, 0.2, 1.4);
        d.current = between(T, 1, 3);
        d.hi.htl = 0.8;
        d.hi.perov = 0.8;
        d.hi.etl = 0.8;
        d.dim = 0.4;
        break;
      case 2:
        ex = 0.55;
        d.defect = 0.5 + 0.2 * Math.sin(T * 3);
        d.defectAt = "etl";
        c.light = 0.0;
        break;
      case 3:
        ex = 0.1;
        d.shell = between(T, 0.5, 1.8);
        c.pairs = true;
        c.ext = true;
        d.circuit = 1;
        d.current = 0.8;
        break;
      default:
        ex = 0.35;
        c.pairs = true;
        c.ext = true;
        d.circuit = 1;
        d.current = 0.8;
        d.shell = 0.8;
        break;
    }
    d.explode += (ex - d.explode) * Math.min(1, dt * 3);

    // particles travelling round the loop of stages
    const on = step === 4;
    for (let i = 0; i < NR; i++) {
      if (!on) {
        ring.current?.hide(i);
        continue;
      }
      const a = (((T * 0.18 + i / NR) % 1) * Math.PI * 2) % (Math.PI * 2);
      const p = ringPt(a);
      ring.current?.set(i, p[0], p[1], p[2], 1);
    }
    ring.current?.flush();
    void useSim;
  });

  const showMat = step === 2;
  return (
    <group>
      <DeviceRig st={st} cf={cf} arch="pin" short />
      <MatTags st={st} on={showMat} />
      <Weather st={st} on={step === 3} />
      {step === 4 ? (
        <mesh position={[0, 0.1, -1.4]} scale={[1, 0.62, 1]}>
          <torusGeometry args={[RING_R, 0.012, 8, 120]} />
          <meshBasicMaterial color={HEX.ph} transparent opacity={0.45} />
        </mesh>
      ) : null}
      <Swarm ref={ring} count={NR} color={HEX.ph} radius={0.05} halo={2.2} haloOpacity={0.2} emissive={1.4} />
      {step === 3 ? (
        <StoryTag position={[0, -1.5, 0.5]} kind="concept" sub={LBL.concept}>
          {LBL.stress}
        </StoryTag>
      ) : null}
      {step === 4 ? (
        <>
          <StoryTag position={ringPt(0)} kind="layer">
            {LBL.s1}
          </StoryTag>
          <StoryTag position={ringPt(Math.PI / 2)} kind="layer">
            {LBL.s2}
          </StoryTag>
          <StoryTag position={ringPt(Math.PI)} kind="layer">
            {LBL.s3}
          </StoryTag>
          <StoryTag position={ringPt(Math.PI * 1.5)} kind="layer">
            {LBL.s4}
          </StoryTag>
          <StoryTag position={[0, 2.2, 0]} kind="good">
            {LBL.redesign}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}
