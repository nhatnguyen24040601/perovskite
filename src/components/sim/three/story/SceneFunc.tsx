import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { LAYER_IDS } from "@/lib/sim/story5";
import { GlowBall, StoryTag, stepDur, useStoryClock } from "./storyKit";
import { DeviceRig, newCfg, newDev, type CarrierCfg, type DevState } from "./stackKit";

const LBL = {
  good: t("Thiết kế tốt", "Good design"),
  poor: t("Thiết kế kém", "Poor design"),
  goodSub: t("chọn lọc tốt, ít tổn thất giao diện", "good selectivity, fewer interface losses"),
  poorSub: t("lệch mức hoặc giao diện nhiều khuyết tật", "misaligned levels or a defective interface"),
  goodI: t("Giao diện sạch → dòng hữu ích lớn", "Clean interface → strong useful current"),
  poorI: t("Khuyết tật → tái hợp → dòng giảm", "Defect → recombination → reduced current"),
};

const X = 2.05;
const S = 0.6;

/** 5.2 · One job per layer: the same stack twice, a good design beside one with a defective interface. */
export function FuncScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("stack", step), 2);
  const good = useRef<DevState>(newDev());
  const cg = useRef<CarrierCfg>(newCfg());
  const poor = useRef<DevState>(newDev());
  const cp = useRef<CarrierCfg>(newCfg());
  // on a phone only the names and the two verdicts stay: the layer tags would cover the cells
  const narrow = useThree((s) => s.size.width < 600);
  const nameG = useRef<THREE.Group>(null);
  const nameP = useRef<THREE.Group>(null);
  const curG = useRef<THREE.Group>(null);
  const curP = useRef<THREE.Group>(null);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const T = clock.current.t;
    const f = useSim.getState().fab;
    const ex = f.ex === "asm" ? 0 : f.ex === "exp" ? 0.65 : 0.4;
    for (const [d, c, bad] of [
      [good.current, cg.current, 0],
      [poor.current, cp.current, 1],
    ] as const) {
      d.nip = d.mix = 0;
      d.T = c.T = T;
      d.explode += (ex - d.explode) * Math.min(1, dt * 3);
      for (const id of LAYER_IDS) {
        d.hi[id] = 0;
        d.tags[id] = !narrow;
      }
      d.dim = 0;
      d.sel = null;
      d.region = 0;
      d.shell = 0;
      d.paths = 0;
      d.circuit = 1;
      d.poles = true;
      d.defectAt = "etl";
      d.defect = bad;
      // the same light, the same stack: only the interface differs
      c.light = f.light === "off" ? 0 : 1;
      c.photons = true;
      c.pairs = true;
      c.reach = 1;
      c.ext = true;
      c.only = "both";
      c.reject = "none";
      c.unabs = 0;
      c.parasitic = 0;
      c.clab = f.clab === "on";
      c.defect = bad;
      d.current = (c.light > 0 ? 1 : 0) * (bad ? 0.3 : 1);
    }
    const g = good.current;
    const p = poor.current;
    nameG.current?.position.set(-X, (g.top + 0.55) * S, 0);
    nameP.current?.position.set(X, (p.top + 0.55) * S, 0);
    // one verdict under each cell
    curG.current?.position.set(-X, (g.bottom - 0.5) * S, 0.3);
    curP.current?.position.set(X, (p.bottom - 0.5) * S, 0.3);
  });

  return (
    <group>
      <GlowBall position={[0, 2.7, 0.5]} color="#ffe14a" radius={0.17} intensity={1.6} />
      <DeviceRig st={good} cf={cg} arch="pin" pos={[-X, 0, 0]} scale={S} short />
      <DeviceRig st={poor} cf={cp} arch="pin" pos={[X, 0, 0]} scale={S} short />
      <group ref={nameG}>
        <StoryTag position={[0, 0, 0]} kind="good" sub={narrow ? undefined : LBL.goodSub}>
          {LBL.good}
        </StoryTag>
      </group>
      <group ref={nameP}>
        <StoryTag position={[0, 0, 0]} kind="bad" sub={narrow ? undefined : LBL.poorSub}>
          {LBL.poor}
        </StoryTag>
      </group>
      {narrow ? null : (
        <>
          <group ref={curG}>
            <StoryTag position={[0, 0, 0]} kind="good">
              {LBL.goodI}
            </StoryTag>
          </group>
          <group ref={curP}>
            <StoryTag position={[0, 0, 0]} kind="bad">
              {LBL.poorI}
            </StoryTag>
          </group>
        </>
      )}
    </group>
  );
}
