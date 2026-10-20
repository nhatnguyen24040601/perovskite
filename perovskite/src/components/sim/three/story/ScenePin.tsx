import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { LAYER_IDS } from "@/lib/sim/story5";
import { GlowBall, StoryTag, stepDur, useStoryClock } from "./storyKit";
import { DeviceRig, newCfg, newDev, type CarrierCfg, type DevState } from "./stackKit";

const ORDER_PIN = t("Sáng → HTL (p) → Perovskite (i) → ETL (n)", "Light → HTL (p) → Perovskite (i) → ETL (n)");
const ORDER_NIP = t("Sáng → ETL (n) → Perovskite (i) → HTL (p)", "Light → ETL (n) → Perovskite (i) → HTL (p)");
const X = 2.05;
const S = 0.6;

/** 5.1 · Choose a p–i–n stack: p–i–n and n–i–p standing next to each other under the same light. */
export function PinScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("pin", step), 2);
  const a = useRef<DevState>(newDev());
  const ca = useRef<CarrierCfg>(newCfg());
  const b = useRef<DevState>(newDev());
  const cb = useRef<CarrierCfg>(newCfg());
  // on a phone only the two names stay: the layer tags would cover the cells
  const narrow = useThree((s) => s.size.width < 600);
  const nameA = useRef<THREE.Group>(null);
  const nameB = useRef<THREE.Group>(null);
  const orderA = useRef<THREE.Group>(null);
  const orderB = useRef<THREE.Group>(null);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const f = useSim.getState().fab;
    const ex = f.ex === "asm" ? 0 : f.ex === "exp" ? 0.65 : 0.4;
    for (const [d, c, nip] of [
      [a.current, ca.current, 0],
      [b.current, cb.current, 1],
    ] as const) {
      d.nip = d.mix = nip;
      d.T = c.T = clock.current.t;
      d.explode += (ex - d.explode) * Math.min(1, dt * 3);
      for (const id of LAYER_IDS) {
        d.hi[id] = 0;
        d.tags[id] = !narrow;
      }
      d.dim = 0;
      d.sel = null;
      d.region = narrow ? 0.5 : 1;
      d.circuit = 1;
      d.poles = true;
      d.current = 1;
      d.paths = 0;
      d.defect = 0;
      c.light = 1;
      c.photons = true;
      c.pairs = true;
      c.reach = 1;
      c.ext = true;
      c.clab = f.clab === "on";
      c.unabs = 0;
      c.reject = "none";
      c.defect = 0;
    }
    // names float above each cell
    const y = a.current.top + 0.55;
    nameA.current?.position.set(-X, y * S, 0);
    nameB.current?.position.set(X, (b.current.top + 0.55) * S, 0);
    orderA.current?.position.set(-X, (a.current.bottom - 0.4) * S, 0.3);
    orderB.current?.position.set(X, (b.current.bottom - 0.4) * S, 0.3);
  });

  return (
    <group>
      <GlowBall position={[0, 2.7, 0.5]} color="#ffe14a" radius={0.17} intensity={1.6} />
      <DeviceRig st={a} cf={ca} arch="pin" pos={[-X, 0, 0]} scale={S} short />
      <DeviceRig st={b} cf={cb} arch="nip" pos={[X, 0, 0]} scale={S} short />
      <group ref={nameA}>
        <StoryTag position={[0, 0, 0]} kind="good">
          {t("p–i–n", "p–i–n")}
        </StoryTag>
      </group>
      <group ref={nameB}>
        <StoryTag position={[0, 0, 0]} kind="good">
          {t("n–i–p", "n–i–p")}
        </StoryTag>
      </group>
      {narrow ? null : (
        <>
          <group ref={orderA}>
            <StoryTag position={[0, 0, 0]} kind="concept">
              {ORDER_PIN}
            </StoryTag>
          </group>
          <group ref={orderB}>
            <StoryTag position={[0, 0, 0]} kind="concept">
              {ORDER_NIP}
            </StoryTag>
          </group>
        </>
      )}
    </group>
  );
}
