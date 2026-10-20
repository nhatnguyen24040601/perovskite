/**
 * Chapter 5: the one solar-cell model used by all four sections.
 *
 * `DeviceRig` draws the stack (glass / transparent electrode / hole-selective contact / perovskite /
 * electron transport layer / buffer / metal), the external circuit, the defect patch, the encapsulation shell
 * and the photons, electrons and holes. A scene only writes numbers into a `DevState` and a `CarrierCfg`
 * every frame; nothing here re-renders React. Thicknesses are exaggerated and not to scale.
 */
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { HEX, LAYERS, LAYER_IDS, type LayerId } from "@/lib/sim/story5";
import { useSim } from "@/lib/sim/store";
import { Flashes, StoryTag, Swarm, burst, useGate, type FlashApi, type SwarmApi } from "./storyKit";
import { along, clamp01, hash1, lerp, pathLength, smooth, type V3 } from "./world";

export const W = 2.6;
export const D = 1.7;
/** Wire x (right of the stack). */
export const XW = W / 2 + 0.55;

/** Layer heights in scene units. Exaggerated for clarity: not to scale. */
export const H: Record<LayerId, number> = { glass: 0.26, tco: 0.08, htl: 0.05, perov: 0.3, etl: 0.07, buf: 0.05, metal: 0.09 };
const BASE_OP: Record<LayerId, number> = { glass: 0.34, tco: 0.6, htl: 0.95, perov: 0.95, etl: 0.95, buf: 0.95, metal: 1 };

const ORDER_PIN: LayerId[] = ["glass", "tco", "htl", "perov", "etl", "buf", "metal"];
const ORDER_NIP: LayerId[] = ["glass", "tco", "etl", "perov", "htl", "metal"];

const BOX = new THREE.BoxGeometry(1, 1, 1);
const EDGES = new THREE.EdgesGeometry(BOX);

const rec = <T,>(v: T): Record<LayerId, T> => ({ glass: v, tco: v, htl: v, perov: v, etl: v, buf: v, metal: v });

export type DevState = {
  /** 0 assembled .. 1 exploded */
  explode: number;
  /** target architecture: 0 = p–i–n, 1 = n–i–p */
  nip: number;
  /** animated architecture (written by the stack) */
  mix: number;
  /** emphasis 0..1 per layer */
  hi: Record<LayerId, number>;
  /** how much the non-emphasised layers fade (0..1) */
  dim: number;
  sel: LayerId | null;
  defect: number;
  defectAt: "htl" | "etl" | "buf";
  /** encapsulation shell opacity 0..1 */
  shell: number;
  /** p / i / n region bars 0..1 */
  region: number;
  /** external circuit 0..1 */
  circuit: number;
  /** how strongly the load glows 0..1 */
  current: number;
  /** extra opacity multiplier per layer */
  op: Record<LayerId, number>;
  /** which layer labels are shown */
  tags: Record<LayerId, boolean>;
  /** show the "+" and "−" terminals */
  poles: boolean;
  /** clock of the current step */
  T: number;
  /** charge pathway guides on the model */
  paths: number;
  /** output: current centre y of every layer, and total extents */
  cy: Record<LayerId, number>;
  hh: Record<LayerId, number>;
  top: number;
  bottom: number;
};

export function newDev(): DevState {
  return {
    explode: 0,
    nip: 0,
    mix: 0,
    hi: rec(0),
    dim: 0,
    sel: null,
    defect: 0,
    defectAt: "etl",
    shell: 0,
    region: 0,
    circuit: 0,
    current: 0,
    op: rec(1),
    tags: rec(false),
    poles: false,
    T: 0,
    paths: 0,
    cy: rec(0),
    hh: { ...H },
    top: 1,
    bottom: -1,
  };
}

/** Everything the carriers need to know about the moment. */
export type CarrierCfg = {
  T: number;
  light: number;
  photons: boolean;
  pairs: boolean;
  /** how far along its journey (0..1) a carrier is drawn */
  reach: number;
  rate: number;
  defect: number;
  reject: "none" | "htl" | "etl";
  ext: boolean;
  unabs: number;
  clab: boolean;
  /** draw only one kind of carrier (the other is hidden to keep the focus) */
  only: "both" | "e" | "h";
  /** share of photons that are lost in the transparent electrode (hypothetical contact) */
  parasitic: number;
};

export function newCfg(): CarrierCfg {
  return { T: 0, light: 1, photons: true, pairs: true, reach: 1, rate: 0.13, defect: 0, reject: "none", ext: true, unabs: 0, clab: false, only: "both", parasitic: 0 };
}

function layout(order: LayerId[], hh: Record<LayerId, number>, gap: number, out: Record<LayerId, number>) {
  const p = order.indexOf("perov");
  out.perov = 0;
  let cur = -hh.perov / 2;
  for (let i = p + 1; i < order.length; i++) {
    const id = order[i]!;
    cur -= gap;
    out[id] = cur - hh[id] / 2;
    cur -= hh[id];
  }
  cur = hh.perov / 2;
  for (let i = p - 1; i >= 0; i--) {
    const id = order[i]!;
    cur += gap;
    out[id] = cur + hh[id] / 2;
    cur += hh[id];
  }
}

const NAME_REG = {
  p: t("p · chọn lọc lỗ trống", "p · hole-selective"),
  i: t("i · quang hoạt", "i · photoactive"),
  n: t("n · chọn lọc điện tử", "n · electron-selective"),
};
const NAME_REG_SHORT = {
  p: t("p · HTL", "p · HTL"),
  i: t("i · Perovskite", "i · Perovskite"),
  n: t("n · ETL", "n · ETL"),
};
const SIGN = { plus: "+", minus: "−" };
const SHORT: Record<LayerId, string> = {
  glass: t("Kính", "Glass"),
  tco: t("ITO", "ITO"),
  htl: t("HTL", "HTL"),
  perov: t("Perovskite", "Perovskite"),
  etl: t("ETL", "ETL"),
  buf: t("Lớp đệm", "Buffer"),
  metal: t("Kim loại", "Metal"),
};

function LayerTag({ id, st, arch, x, short }: { id: LayerId; st: MutableRefObject<DevState>; arch: "pin" | "nip"; x: number; short: boolean }) {
  // while the p / i / n region tags are up they name the three central layers themselves
  const on = useGate(
    () =>
      st.current.tags[id] &&
      !(id === "buf" && st.current.mix > 0.5) &&
      !(st.current.region > 0.6 && (id === "htl" || id === "perov" || id === "etl")),
  );
  if (!on) return null;
  const info = LAYERS[id];
  const text = short ? SHORT[id] : arch === "nip" && info.tagNip ? info.tagNip : info.tag;
  return (
    <StoryTag position={[x, 0, D / 2]} kind="layer">
      {text}
    </StoryTag>
  );
}

function RegionTag({ k, st, short, x }: { k: "p" | "i" | "n"; st: MutableRefObject<DevState>; short: boolean; x: number }) {
  const on = useGate(() => st.current.region > 0.6);
  if (!on) return null;
  return (
    <StoryTag position={[x - 0.05, 0, D / 2]} kind={k === "i" ? "good" : "concept"}>
      {short ? NAME_REG_SHORT[k] : NAME_REG[k]}
    </StoryTag>
  );
}

function PoleTag({ sign, st }: { sign: string; st: MutableRefObject<DevState> }) {
  const on = useGate(() => st.current.poles && st.current.circuit > 0.5);
  if (!on) return null;
  return (
    <StoryTag position={[0.2, 0.12, 0]} kind="tiny">
      {sign}
    </StoryTag>
  );
}

/* ───────────────────────── the stack ───────────────────────── */

export function DeviceStack({
  st,
  arch,
  pickable = false,
  tagX = -W / 2 - 0.65,
  short = false,
}: {
  st: MutableRefObject<DevState>;
  arch: "pin" | "nip";
  pickable?: boolean;
  tagX?: number;
  short?: boolean;
}) {
  const grp = useRef<Record<string, THREE.Group | null>>({});
  const mesh = useRef<Record<string, THREE.Mesh | null>>({});
  const mat = useRef<Record<string, THREE.MeshStandardMaterial | null>>({});
  const outline = useRef<Record<string, THREE.LineSegments | null>>({});
  const bars = useRef<Record<string, THREE.Mesh | null>>({});
  const defectG = useRef<THREE.Group>(null);
  const defectMat = useRef<THREE.MeshBasicMaterial>(null);
  const shellM = useRef<THREE.Mesh>(null);
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const shellEdge = useRef<THREE.LineSegments>(null);
  const wire = useRef<{ top: THREE.Mesh | null; v: THREE.Mesh | null; bot: THREE.Mesh | null; load: THREE.Group | null; topG: THREE.Group | null; botG: THREE.Group | null }>({
    top: null,
    v: null,
    bot: null,
    load: null,
    topG: null,
    botG: null,
  });
  const loadMat = useRef<THREE.MeshStandardMaterial>(null);
  const cones = useRef<(THREE.Mesh | null)[]>([]);
  const guides = useRef<(THREE.Mesh | null)[]>([]);
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);
  const qq = useMemo(() => new THREE.Quaternion(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const color = useMemo(() => new THREE.Color(), []);
  const pyP = useMemo(() => rec(0), []);
  const pyN = useMemo(() => rec(0), []);
  const hover = useRef<LayerId | null>(null);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  useFrame((_, dtRaw) => {
    const d = st.current;
    const dt = Math.min(dtRaw, 0.05);
    d.mix += (d.nip - d.mix) * Math.min(1, dt * 3.4);
    if (Math.abs(d.nip - d.mix) < 0.001) d.mix = d.nip;
    const e = smooth(d.mix);
    const gap = 0.035 + 0.5 * d.explode;
    const hp = { ...H };
    const hn = { ...H, buf: 0 };
    layout(ORDER_PIN, hp, gap, pyP);
    layout(ORDER_NIP, hn, gap, pyN);
    pyN.buf = pyN.metal + H.metal / 2;
    if (pickable) {
      const f = useSim.getState().fab;
      d.sel = (f.layer && LAYER_IDS.includes(f.layer as LayerId) ? (f.layer as LayerId) : null) ?? d.sel;
    }
    let top = -9;
    let bottom = 9;
    for (const id of LAYER_IDS) {
      const h = id === "buf" ? lerp(H.buf, 0, e) : H[id];
      const y = lerp(pyP[id], pyN[id], e);
      d.cy[id] = y;
      d.hh[id] = h;
      top = Math.max(top, y + h / 2);
      bottom = Math.min(bottom, y - h / 2);
      const g = grp.current[id];
      const m = mesh.current[id];
      const mm = mat.current[id];
      if (g) g.position.y = y;
      if (m) {
        m.scale.set(W, Math.max(1e-4, h), D);
        m.visible = h > 0.002;
      }
      if (mm) {
        const emph = Math.max(d.hi[id], d.sel === id ? 1 : 0, hover.current === id ? 0.5 : 0);
        const k = 1 - 0.62 * d.dim * (1 - emph);
        mm.opacity = Math.min(1, BASE_OP[id] * k * d.op[id]);
        mm.emissiveIntensity = emph * 0.65;
        mm.emissive.set(HEX[id]);
        mm.depthWrite = mm.opacity > 0.9;
      }
      const o = outline.current[id];
      if (o) o.visible = d.sel === id;
    }
    d.top = top;
    d.bottom = bottom;

    // p / i / n bars
    const bar = (key: string, id: LayerId) => {
      const b = bars.current[key];
      if (!b) return;
      const h = d.hh[id] + (key === "i" ? 0.02 : 0.1);
      b.visible = d.region > 0.02;
      b.scale.set(0.08, h * Math.min(1, d.region * 1.4), 0.08);
      b.position.set(-W / 2 - 0.25, d.cy[id], 0);
    };
    bar("p", "htl");
    bar("i", "perov");
    bar("n", "etl");

    // defect patch on the interface between the perovskite and the chosen contact
    if (defectG.current && defectMat.current) {
      const dir = d.defectAt === "etl" ? (e > 0.5 ? 1 : -1) : e > 0.5 ? -1 : 1;
      const y =
        d.defectAt === "buf"
          ? (d.cy.etl - d.hh.etl / 2 + d.cy.metal + d.hh.metal / 2) / 2
          : d.cy.perov + dir * (H.perov / 2 + 0.012);
      defectG.current.visible = d.defect > 0.02;
      defectG.current.position.set(0.28, y, 0.12);
      defectMat.current.opacity = 0.9 * clamp01(d.defect);
    }

    // encapsulation shell
    if (shellM.current && shellMat.current) {
      const hgt = top - bottom + 0.34;
      shellM.current.visible = d.shell > 0.02;
      shellM.current.scale.set(W + 0.34, hgt, D + 0.34);
      shellM.current.position.set(0, (top + bottom) / 2, 0);
      shellMat.current.opacity = 0.2 * d.shell;
      if (shellEdge.current) {
        shellEdge.current.visible = d.shell > 0.02;
        shellEdge.current.scale.copy(shellM.current.scale);
        shellEdge.current.position.copy(shellM.current.position);
        (shellEdge.current.material as THREE.LineBasicMaterial).opacity = 0.65 * d.shell;
      }
    }

    // external circuit
    const w = wire.current;
    const eEl = d.mix > 0.5 ? d.cy.tco : d.cy.metal;
    const hEl = d.mix > 0.5 ? d.cy.metal : d.cy.tco;
    const yT = d.cy.tco;
    const yB = d.cy.metal;
    const vis = d.circuit > 0.02;
    if (w.top && w.v && w.bot && w.load) {
      const thick = 0.034;
      w.top.visible = vis;
      w.top.scale.set(XW - W / 2, thick, thick);
      w.top.position.set((XW + W / 2) / 2, yT, 0);
      w.bot.visible = vis;
      w.bot.scale.set(XW - W / 2, thick, thick);
      w.bot.position.set((XW + W / 2) / 2, yB, 0);
      w.v.visible = vis;
      w.v.scale.set(thick, Math.max(0.01, yT - yB), thick);
      w.v.position.set(XW, (yT + yB) / 2, 0);
      w.load.visible = vis;
      w.load.position.set(XW, (yT + yB) / 2, 0);
      if (w.topG) w.topG.position.set(W / 2 + 0.2, yT, 0);
      if (w.botG) w.botG.position.set(W / 2 + 0.2, yB, 0);
    }
    if (loadMat.current) {
      loadMat.current.emissiveIntensity = 0.1 + 1.5 * d.current * (0.8 + 0.2 * Math.sin(d.T * 6));
    }
    // conventional current: from the positive terminal through the load to the negative one
    const plus = hEl;
    const minus = eEl;
    const P: V3[] = [
      [W / 2, plus, 0],
      [XW, plus, 0],
      [XW, minus, 0],
      [W / 2, minus, 0],
    ];
    const L = pathLength(P);
    for (let i = 0; i < 3; i++) {
      const c = cones.current[i];
      if (!c) continue;
      const on = vis && d.current > 0.05;
      c.visible = on;
      if (!on) continue;
      const u = (d.T * 0.22 + i / 3) % 1;
      const p0 = along(P, u, L);
      const p1 = along(P, Math.min(1, u + 0.015), L);
      c.position.set(p0[0], p0[1], p0[2]);
      tmpA.set(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
      if (tmpA.lengthSq() > 1e-9) {
        qq.setFromUnitVectors(up, tmpA.normalize());
        c.quaternion.copy(qq);
      }
    }

    // pathway guides: electron (blue) and hole (orange) routes drawn on the model
    const gv = d.paths > 0.02;
    const gE = guides.current[0];
    const gH = guides.current[1];
    const gEc = guides.current[2];
    const gHc = guides.current[3];
    const eSign = d.mix > 0.5 ? 1 : -1;
    const yE0 = d.cy.perov;
    const yE1 = eEl;
    const yH1 = hEl;
    const setGuide = (rod: THREE.Mesh | null, cone: THREE.Mesh | null, x: number, y0: number, y1: number) => {
      if (!rod || !cone) return;
      rod.visible = gv;
      cone.visible = gv;
      const len = Math.abs(y1 - y0);
      rod.scale.set(0.016, Math.max(0.01, len), 0.016);
      rod.position.set(x, (y0 + y1) / 2, D / 2 - 0.05);
      cone.position.set(x, y1, D / 2 - 0.05);
      cone.rotation.set(y1 > y0 ? 0 : Math.PI, 0, 0);
    };
    setGuide(gE ?? null, gEc ?? null, 0.95, yE0, yE1);
    setGuide(gH ?? null, gHc ?? null, 0.75, yE0, yH1);
    void eSign;
    void tmpB;
    void color;
  });

  const poleSigns = arch === "pin" ? [SIGN.plus, SIGN.minus] : [SIGN.minus, SIGN.plus];

  return (
    <group>
      {LAYER_IDS.map((id) => (
        <group key={id} ref={(el) => void (grp.current[id] = el)}>
          <mesh
            ref={(el) => void (mesh.current[id] = el)}
            geometry={BOX}
            scale={[W, H[id], D]}
            onClick={
              pickable
                ? (ev) => {
                    ev.stopPropagation();
                    const f = useSim.getState().fab;
                    useSim.setState({ fab: { ...f, layer: id, panel: "open" } });
                  }
                : undefined
            }
            onPointerOver={
              pickable
                ? (ev) => {
                    ev.stopPropagation();
                    hover.current = id;
                    document.body.style.cursor = "pointer";
                  }
                : undefined
            }
            onPointerOut={
              pickable
                ? () => {
                    hover.current = null;
                    document.body.style.cursor = "";
                  }
                : undefined
            }
          >
            <meshStandardMaterial
              ref={(el) => void (mat.current[id] = el)}
              color={HEX[id]}
              transparent
              opacity={BASE_OP[id]}
              roughness={id === "metal" ? 0.28 : id === "glass" ? 0.1 : 0.5}
              metalness={id === "metal" ? 0.85 : 0.08}
              emissive={HEX[id]}
              emissiveIntensity={0}
            />
            <lineSegments geometry={EDGES}>
              <lineBasicMaterial color="#eaf3fb" transparent opacity={0.42} />
            </lineSegments>
            <lineSegments ref={(el) => void (outline.current[id] = el)} geometry={EDGES} scale={1.03} visible={false}>
              <lineBasicMaterial color="#ffffff" />
            </lineSegments>
          </mesh>
          <LayerTag id={id} st={st} arch={arch} x={tagX} short={short} />
        </group>
      ))}

      {/* p / i / n region bars */}
      {(["p", "i", "n"] as const).map((k) => (
        <mesh key={k} ref={(el) => void (bars.current[k] = el)} geometry={BOX} visible={false}>
          <meshBasicMaterial color={k === "p" ? HEX.htl : k === "i" ? HEX.perov : HEX.etl} />
        </mesh>
      ))}
      <group position={[0, 0, 0]}>
        <RegionTagGroup st={st} short={short} x={tagX} />
      </group>

      {/* interface defect: red outline patch with a few trap spheres */}
      <group ref={defectG} visible={false}>
        <mesh geometry={BOX} scale={[0.9, 0.02, 0.62]}>
          <meshBasicMaterial ref={defectMat} color={HEX.defect} transparent opacity={0.8} depthWrite={false} />
        </mesh>
        <lineSegments geometry={EDGES} scale={[0.92, 0.03, 0.64]}>
          <lineBasicMaterial color="#ffd0d4" />
        </lineSegments>
        {/* a red band on the front edge of the interface, so the damaged contact reads from the side too */}
        <mesh geometry={BOX} position={[-0.28, 0, D / 2 - 0.12 + 0.02]} scale={[1.7, 0.05, 0.04]}>
          <meshBasicMaterial color={HEX.defect} transparent opacity={0.95} depthWrite={false} />
        </mesh>
        {[-1.0, -0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <mesh key={`f${i}`} position={[x, 0.01, D / 2 - 0.12 + 0.03]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshBasicMaterial color="#ffd0d4" />
          </mesh>
        ))}
        {[
          [-0.3, 0.06, 0.1],
          [0.05, 0.07, -0.12],
          [0.3, 0.05, 0.14],
          [0.1, 0.06, 0.2],
        ].map((p, i) => (
          <mesh key={i} position={p as V3}>
            <sphereGeometry args={[0.035, 10, 8]} />
            <meshBasicMaterial color={HEX.defect} />
          </mesh>
        ))}
      </group>

      {/* encapsulation shell */}
      <mesh ref={shellM} geometry={BOX} visible={false} renderOrder={5}>
        <meshStandardMaterial ref={shellMat} color={HEX.enc} transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <lineSegments ref={shellEdge} geometry={EDGES} visible={false}>
        <lineBasicMaterial color={HEX.enc} transparent opacity={0.6} />
      </lineSegments>

      {/* external circuit */}
      <mesh ref={(el) => void (wire.current.top = el)} geometry={BOX} visible={false}>
        <meshStandardMaterial color="#cfd6de" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={(el) => void (wire.current.bot = el)} geometry={BOX} visible={false}>
        <meshStandardMaterial color="#cfd6de" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={(el) => void (wire.current.v = el)} geometry={BOX} visible={false}>
        <meshStandardMaterial color="#cfd6de" metalness={0.8} roughness={0.3} />
      </mesh>
      <group ref={(el) => void (wire.current.load = el)} visible={false}>
        <mesh geometry={BOX} scale={[0.2, 0.3, 0.2]}>
          <meshStandardMaterial ref={loadMat} color="#2b2f36" emissive="#ffb347" emissiveIntensity={0.1} />
        </mesh>
      </group>
      <group ref={(el) => void (wire.current.topG = el)}>
        <PoleTag sign={poleSigns[0]!} st={st} />
      </group>
      <group ref={(el) => void (wire.current.botG = el)}>
        <PoleTag sign={poleSigns[1]!} st={st} />
      </group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => void (cones.current[i] = el)} visible={false}>
          <coneGeometry args={[0.055, 0.15, 10]} />
          <meshBasicMaterial color="#fff6c8" />
        </mesh>
      ))}

      {/* pathway guides */}
      {[0, 1].map((i) => (
        <mesh key={`g${i}`} ref={(el) => void (guides.current[i] = el)} geometry={BOX} visible={false}>
          <meshBasicMaterial color={i === 0 ? HEX.e : HEX.h} transparent opacity={0.65} depthWrite={false} />
        </mesh>
      ))}
      {[0, 1].map((i) => (
        <mesh key={`c${i}`} ref={(el) => void (guides.current[2 + i] = el)} visible={false}>
          <coneGeometry args={[0.05, 0.12, 10]} />
          <meshBasicMaterial color={i === 0 ? HEX.e : HEX.h} />
        </mesh>
      ))}
    </group>
  );
}

function RegionTagGroup({ st, short, x }: { st: MutableRefObject<DevState>; short: boolean; x: number }) {
  // the three tags follow their bars
  const gp = useRef<THREE.Group>(null);
  const gi = useRef<THREE.Group>(null);
  const gn = useRef<THREE.Group>(null);
  useFrame(() => {
    const d = st.current;
    gp.current?.position.set(0, d.cy.htl, 0);
    gi.current?.position.set(0, d.cy.perov, 0);
    gn.current?.position.set(0, d.cy.etl, 0);
  });
  return (
    <>
      <group ref={gp}>
        <RegionTag k="p" st={st} short={short} x={x} />
      </group>
      <group ref={gi}>
        <RegionTag k="i" st={st} short={short} x={x} />
      </group>
      <group ref={gn}>
        <RegionTag k="n" st={st} short={short} x={x} />
      </group>
    </>
  );
}

/* ───────────────────────── photons, electrons, holes ───────────────────────── */

const N = 12;
const GHOST = 3;

const seg = (p: number, a: number, b: number) => smooth((p - a) / (b - a));

export function CarrierField({ st, cf }: { st: MutableRefObject<DevState>; cf: MutableRefObject<CarrierCfg> }) {
  const ph = useRef<SwarmApi>(null);
  const el = useRef<SwarmApi>(null);
  const ho = useRef<SwarmApi>(null);
  const flashY = useRef<FlashApi>(null);
  const flashR = useRef<FlashApi>(null);
  const flashG = useRef<FlashApi>(null);
  const eTag = useRef<THREE.Group>(null);
  const hTag = useRef<THREE.Group>(null);
  const tagState = useRef({ e: false, h: false });
  const gE = useGate(() => cf.current.clab && tagState.current.e);
  const gH = useGate(() => cf.current.clab && tagState.current.h);
  const ptsA = useMemo<V3[]>(() => [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]], []);

  useFrame(() => {
    const d = st.current;
    const c = cf.current;
    const nip = d.mix > 0.5;
    const hp = H.perov / 2;
    const dir = nip ? 1 : -1; // from the perovskite toward the ETL
    const yE = d.cy.perov + dir * hp;
    const yH = d.cy.perov - dir * hp;
    const yEl = d.cy.etl;
    const yHl = d.cy.htl;
    const yEel = nip ? d.cy.tco : d.cy.metal;
    const yHel = nip ? d.cy.metal : d.cy.tco;
    const yStart = d.cy.glass + H.glass / 2 + 1.0;
    const yRefl = Math.min(d.cy.metal, d.cy.tco) + (nip ? 0 : H.metal / 2);
    ptsA[0] = [W / 2, yEel, 0];
    ptsA[1] = [XW, yEel, 0];
    ptsA[2] = [XW, yHel, 0];
    ptsA[3] = [W / 2, yHel, 0];
    const L = pathLength(ptsA);
    const defY =
      d.defectAt === "buf"
        ? (d.cy.etl - d.hh.etl / 2 + d.cy.metal + d.hh.metal / 2) / 2
        : d.defectAt === "etl"
          ? d.cy.perov + dir * hp
          : d.cy.perov - dir * hp;
    const dx = 0.28;
    const dz = 0.12;
    const light = c.light > 0.02;
    for (let i = 0; i < N; i++) {
      const p = (c.T * c.rate + i / N) % 1;
      const ax = (hash1(i * 3.1) - 0.5) * (W - 0.7);
      const az = (hash1(i * 5.7) - 0.5) * (D - 0.55);
      const ya = d.cy.perov + (hash1(i * 9.3) - 0.5) * H.perov * 0.7;
      const unabs = c.unabs > 0 && i % 4 === 3;
      const para = c.parasitic > 0 && i % 6 === 5;
      const lost = ((i * 5) % N) / N < c.defect * 0.6;

      // photon
      let phOn = false;
      if (light && c.photons) {
        if (unabs) {
          if (p < 0.55) {
            const down = p < 0.28;
            const y = down ? lerp(yStart, yRefl, seg(p, 0, 0.28)) : lerp(yRefl, yStart, seg(p, 0.28, 0.55));
            ph.current?.set(i, ax, y, az, down ? 1 : 0.8);
            phOn = true;
          }
        } else if (c.parasitic > 0 && i % 6 === 5) {
          // lost in the transparent electrode: stops there and fades
          if (p < 0.2) {
            ph.current?.set(i, ax, lerp(yStart, d.cy.tco, p / 0.2), az, 1 - 0.7 * seg(p, 0.1, 0.2));
            phOn = true;
          }
        } else if (p < 0.22) {
          ph.current?.set(i, ax, lerp(yStart, ya, p / 0.22), az, 1);
          phOn = true;
        }
      }
      if (!phOn) ph.current?.hide(i);

      // absorption flash
      const fy = light && !unabs && !para && (c.pairs || c.photons) ? burst(p, 0.22, 0.1, 0.17) : null;
      if (fy) flashY.current?.set(i, ax, ya, az, fy.r, fy.a * 1.5);
      else flashY.current?.hide(i);

      // the pair
      let eOn = false;
      let hOn = false;
      let rOn = false;
      if (light && c.pairs && !unabs && !para && p >= 0.24 && p <= c.reach) {
        const fade = clamp01((c.reach - p) / 0.04);
        const wob = Math.sin(c.T * 3 + i * 2.1) * 0.035;
        if (lost) {
          if (p < 0.5) {
            const k = seg(p, 0.27, 0.5);
            const ex = lerp(ax, dx, k) + wob;
            const ey = lerp(ya, defY, k);
            const ez = lerp(az, dz, k);
            if (c.only !== "h") el.current?.set(i, ex, ey, ez, fade);
            else el.current?.hide(i);
            if (c.only !== "e") ho.current?.set(i, ex + 0.04, ey, ez, fade);
            else ho.current?.hide(i);
            eOn = hOn = true;
            if (i === 1) {
              eTag.current?.position.set(ex, ey, ez);
              hTag.current?.position.set(ex + 0.04, ey, ez);
            }
          } else {
            const b = burst(p, 0.5, 0.1, 0.22);
            if (b) {
              flashR.current?.set(i, dx, defY, dz, b.r, b.a * 1.8);
              rOn = true;
            }
          }
        } else {
          // electron
          let ex = ax;
          let ey = ya;
          let ez = az;
          if (p < 0.52) {
            const k = seg(p, 0.26, 0.52);
            ey = lerp(ya, yE, k);
            ex = ax + wob;
          } else if (p < 0.64) {
            ey = lerp(yE, yEl, seg(p, 0.52, 0.64));
          } else if (p < 0.74) {
            const k = seg(p, 0.64, 0.74);
            ey = lerp(yEl, yEel, k);
            ex = lerp(ax, W / 2, k);
            ez = lerp(az, 0, k);
          } else if (c.ext) {
            const u = seg(p, 0.74, 0.96);
            const q = along(ptsA, u, L);
            ex = q[0];
            ey = q[1];
            ez = q[2];
          } else {
            ex = W / 2;
            ey = yEel;
            ez = 0;
          }
          if ((p < 0.97 || !c.ext) && c.only !== "h") {
            el.current?.set(i, ex, ey, ez, fade);
            eOn = true;
            if (i === 1) eTag.current?.position.set(ex, ey, ez);
          }
          // hole
          let hx = ax;
          let hy = ya;
          let hz = az;
          if (p < 0.52) {
            hy = lerp(ya, yH, seg(p, 0.26, 0.52));
            hx = ax - wob;
          } else if (p < 0.64) {
            hy = lerp(yH, yHl, seg(p, 0.52, 0.64));
          } else {
            const k = seg(p, 0.64, 0.74);
            hy = lerp(yHl, yHel, k);
            hx = lerp(ax, W / 2, k);
            hz = lerp(az, 0, k);
          }
          if ((p < 0.97 || !c.ext) && c.only !== "e") {
            ho.current?.set(i, hx, hy, hz, fade);
            hOn = true;
            if (i === 1) hTag.current?.position.set(hx, hy, hz);
          }
          // the electron that came round the circuit meets the waiting hole
          const b = c.ext ? burst(p, 0.96, 0.05, 0.16) : null;
          if (b) {
            flashG.current?.set(i, W / 2, yHel, 0, b.r, b.a * 1.6);
          } else flashG.current?.hide(i);
        }
      }
      if (!eOn) el.current?.hide(i);
      if (!hOn) ho.current?.hide(i);
      if (!rOn) flashR.current?.hide(i);
      if (i === 1) {
        tagState.current.e = eOn;
        tagState.current.h = hOn;
      }
      if (!c.ext || !(light && c.pairs)) flashG.current?.hide(i);
    }

    // carriers that turn back at the wrong contact (selectivity is a preference, not a wall)
    for (let k = 0; k < GHOST; k++) {
      const g = (c.T * 0.4 + k / GHOST) % 1;
      const tri = g < 0.55 ? g / 0.55 : 1 - (g - 0.55) / 0.45;
      const gx = (hash1(k * 11.3) - 0.5) * (W - 1.2);
      const gz = (hash1(k * 6.1) - 0.5) * (D - 0.8);
      if (c.reject === "htl" && light) {
        el.current?.set(N + k, gx, lerp(d.cy.perov, yH + dir * 0.015, smooth(tri)), gz, 0.8);
        ho.current?.hide(N + k);
      } else if (c.reject === "etl" && light) {
        ho.current?.set(N + k, gx, lerp(d.cy.perov, yE - dir * 0.015, smooth(tri)), gz, 0.8);
        el.current?.hide(N + k);
      } else {
        el.current?.hide(N + k);
        ho.current?.hide(N + k);
      }
    }
    ph.current?.flush();
    el.current?.flush();
    ho.current?.flush();
    flashY.current?.flush();
    flashR.current?.flush();
    flashG.current?.flush();
  });

  return (
    <group>
      <Swarm ref={ph} count={N} color={HEX.ph} radius={0.045} halo={2.4} haloOpacity={0.2} emissive={1.6} />
      <Swarm ref={el} count={N + GHOST} color={HEX.e} radius={0.05} halo={2.2} haloOpacity={0.22} emissive={1.5} />
      <Swarm ref={ho} count={N + GHOST} color={HEX.h} radius={0.055} halo={2.2} haloOpacity={0.22} emissive={1.4} />
      <Flashes ref={flashY} count={N} color={HEX.ph} />
      <Flashes ref={flashR} count={N} color={HEX.defect} />
      <Flashes ref={flashG} count={N} color="#ffffff" />
      <group ref={eTag}>
        {gE ? (
          <StoryTag position={[0.12, 0.1, 0.1]} kind="particle" minor>
            {t("e−", "e−")}
          </StoryTag>
        ) : null}
      </group>
      <group ref={hTag}>
        {gH ? (
          <StoryTag position={[-0.14, 0.1, 0.1]} kind="particle" minor>
            {t("h+", "h+")}
          </StoryTag>
        ) : null}
      </group>
    </group>
  );
}

/** The stack with its carriers, placed and scaled as one piece (so two can stand side by side). */
export function DeviceRig({
  st,
  cf,
  arch,
  pos = [0, 0, 0],
  scale = 1,
  pickable = false,
  tagX,
  short = false,
}: {
  st: MutableRefObject<DevState>;
  cf: MutableRefObject<CarrierCfg>;
  arch: "pin" | "nip";
  pos?: V3;
  scale?: number;
  pickable?: boolean;
  tagX?: number;
  short?: boolean;
}) {
  return (
    <group position={pos} scale={scale}>
      <DeviceStack st={st} arch={arch} pickable={pickable} tagX={tagX} short={short} />
      <CarrierField st={st} cf={cf} />
    </group>
  );
}
