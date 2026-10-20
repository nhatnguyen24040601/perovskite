import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { AssemblingLattice, Bx, Cy, PAL, Tube, VGauge } from "./fabKit";
import { ModuleSlab, Ground, newScn, type Scn } from "./leadKit";
import { Arrow3, Rod, StoryTag, Swarm, stepDur, useGate, useStoryClock, type SwarmApi } from "./storyKit";
import type { Atom, AtomOut } from "./storyKit";
import { between, hash1, lerp } from "./world";

/* ═════════════════════════ 4.9 A · four absorber families ═════════════════════════ */

const LA = {
  pb: t("Perovskite chì halide", "Lead-halide perovskite"),
  snpb: t("Hỗn hợp Sn–Pb", "Mixed Sn–Pb"),
  sn: t("Chỉ thiếc", "Tin-only"),
  dbl: t("Perovskite kép Cs₂AgBiBr₆", "Double perovskite Cs₂AgBiBr₆"),
  siteB: t("Vị trí B: Pb²⁺", "B-site: Pb²⁺"),
  siteMix: t("Vị trí B: Pb²⁺ và Sn²⁺", "B-site: Pb²⁺ and Sn²⁺"),
  siteSn: t("Vị trí B: Sn²⁺", "B-site: Sn²⁺"),
  siteDbl: t("Vị trí B: Ag⁺ và Bi³⁺", "B-site: Ag⁺ and Bi³⁺"),
  warn: t("⚠ Minh họa khái niệm: nước vào linh kiện hỏng", "⚠ Conceptual: water entering a damaged device"),
  intact: t("Linh kiện nguyên vẹn: nước bị chặn", "Intact device: water is blocked"),
  leak: t("Chất chứa chì có thể thoát ra", "Lead-containing species may escape"),
  leadRef: t("Hàm lượng chì: mốc so sánh (toàn Pb)", "Lead content: reference (all Pb)"),
  leadMix: t("Sn–Pb: giảm khoảng 50–60% trong tài liệu dẫn", "Sn–Pb: roughly 50–60% lower in the cited literature"),
  stillPb: t("Vẫn chứa chì", "Still contains lead"),
  ox: t("Sn²⁺ → Sn⁴⁺ (sơ đồ đơn giản)", "Sn²⁺ → Sn⁴⁺ (simplified schematic)"),
  vac: t("Khuyết tật (vị trí trống)", "Defects (vacant sites)"),
  penalty: t("Hình phạt hiệu suất (khái niệm)", "Performance penalty (conceptual)"),
  noPb: t("Không có chì trong lớp hấp thụ", "No lead in the absorber"),
  abs: t("Hấp thụ ánh sáng (minh họa, không phải số liệu)", "Light absorption (illustrative, not data)"),
  absPb: t("Perovskite chì: bờ hấp thụ dốc", "Lead-halide perovskite: steep onset"),
  absDbl: t("Cs₂AgBiBr₆: yếu hơn, bắt đầu muộn (vùng cấm gián tiếp)", "Cs₂AgBiBr₆: weaker, later onset (indirect gap)"),
  energy: t("Năng lượng photon →", "Photon energy →"),
  notFree: t("Không chì ≠ không tác động môi trường", "Lead-free ≠ free of all environmental impact"),
};

const FAM_X = [-3.3, -1.1, 1.1, 3.3];
const LAT_Y = 0.25;
const C_PB = new THREE.Color(PAL.pb);
const C_SN = new THREE.Color(PAL.sn);
const C_AG = new THREE.Color("#f5f6f8");
const C_BI = new THREE.Color("#b78be0");
const C_OX = new THREE.Color("#ff5a47");
const N2: [number, number, number] = [2, 2, 2];
const RAD = { A: 0.056, B: 0.046, X: 0.038 };

function styleB(kind: "pb" | "snpb" | "sn" | "dbl", ox: { current: number }) {
  return (a: Atom, out: AtomOut) => {
    if (a.kind !== "B") return;
    const odd = (a.i + a.j + a.k) % 2 === 1;
    if (kind === "pb") out.color.copy(C_PB);
    else if (kind === "snpb") out.color.copy(odd ? C_SN : C_PB);
    else if (kind === "dbl") {
      out.color.copy(odd ? C_BI : C_AG);
      out.scale *= odd ? 1.1 : 0.95;
    } else {
      const h = hash1(a.id * 3.7);
      out.color.copy(C_SN);
      if (h < ox.current) {
        out.color.copy(C_OX);
        out.scale *= 1.18;
      }
      if (h < ox.current * 0.4) out.scale *= 0.25;
    }
  };
}

function AbsPlot({ show }: { show: { current: number } }) {
  const grp = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const mk = (fn: (e: number) => number) => {
      const n = 60;
      const pts: number[] = [];
      for (let i = 0; i < n; i++) {
        const e = 1.2 + (2.2 * i) / (n - 1);
        pts.push(((e - 1.2) / 2.2) * 2 - 1, fn(e) * 1.0, 0);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      return g;
    };
    return {
      pb: mk((e) => 0.92 / (1 + Math.exp(-(e - 1.6) / 0.05)) + 0.06 * Math.max(0, e - 1.6)),
      dbl: mk((e) => 0.3 / (1 + Math.exp(-(e - 2.4) / 0.22)) + 0.05 / (1 + Math.exp(-(e - 2.0) / 0.2))),
    };
  }, []);
  const linePb = useMemo(() => new THREE.Line(geo.pb, new THREE.LineBasicMaterial({ color: "#8fd0ff" })), [geo]);
  const lineDbl = useMemo(() => new THREE.Line(geo.dbl, new THREE.LineBasicMaterial({ color: "#ffb04a" })), [geo]);
  useFrame(() => {
    if (grp.current) {
      grp.current.visible = show.current > 0.02;
      grp.current.scale.setScalar(Math.max(1e-4, show.current));
    }
  });
  return (
    <group ref={grp}>
      <Bx p={[0, 0.5, -0.02]} s={[2.4, 1.25, 0.02]} c="#10161c" o={0.8} />
      <Bx p={[0, -0.02, 0]} s={[2.1, 0.012, 0.01]} c="#c5ccd6" />
      <Bx p={[-1.05, 0.5, 0]} s={[0.012, 1.1, 0.01]} c="#c5ccd6" />
      <primitive object={linePb} />
      <primitive object={lineDbl} />
    </group>
  );
}

export function LeadAScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("lead", step), 2);
  const grp = [useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null), useRef<THREE.Group>(null)];
  const asm = useRef(0);
  const ox = useRef(0);
  const absShow = useRef(0);
  const gauge = useRef(1);
  const scn = useRef<Scn>(newScn());
  const slab = useRef<THREE.Group>(null);
  const bars = useRef<THREE.Group>(null);
  const leadBar = useRef<THREE.Mesh>(null);
  const styles = useMemo(
    () => ({ pb: styleB("pb", ox), snpb: styleB("snpb", ox), sn: styleB("sn", ox), dbl: styleB("dbl", ox) }),
    [],
  );

  const gWarn = useGate(() => step === 1 && String(useSim.getState().fab.dmg ?? "ok") === "wet" && clock.current.t > 3);
  const gIntact = useGate(() => step === 1 && String(useSim.getState().fab.dmg ?? "ok") === "ok" && clock.current.t > 2);
  const gOx = useGate(() => step === 3 && clock.current.t > 1.5);
  const gVac = useGate(() => step === 3 && ox.current > 0.3);
  const gAbs = useGate(() => step === 4 && clock.current.t > 1.5);
  const gSite = useGate(() => step >= 1 && step <= 4 && clock.current.t > 1);

  useFrame(() => {
    const T = clock.current.t;
    const f = useSim.getState().fab;
    asm.current = between(T, 0.2, step === 0 ? 3.0 : 1.2) + (step > 0 ? 1 : 0);
    asm.current = Math.min(1, asm.current);
    ox.current = step === 3 ? Number(f.ox ?? 0) : 0;
    const pick = step === 5 ? String(f.pick ?? "pb") : "";
    const em = (i: number): number => {
      const id = ["pb", "snpb", "sn", "dbl"][i]!;
      if (step === 0) return 1;
      if (step === 1) return i === 0 ? 1.25 : 0.7;
      if (step === 2) return i <= 1 ? 1.15 : 0.7;
      if (step === 3) return i === 2 ? 1.25 : 0.7;
      if (step === 4) return i === 3 ? 1.25 : 0.7;
      return id === pick ? 1.2 : 0.85;
    };
    grp.forEach((r, i) => {
      if (r.current) r.current.scale.setScalar(lerp(r.current.scale.x, em(i), 0.1));
    });
    absShow.current = step === 4 ? between(T, 1.0, 2.2) : 0;
    gauge.current = 1 - 0.6 * ox.current;

    // damaged-device scenario under the lead-halide lattice (step 1)
    const s = scn.current;
    const wet = String(f.dmg ?? "ok") === "wet";
    s.T = T;
    s.rain = step === 1 ? between(T, 0.5, 1.2) : 0;
    s.crack = step === 1 && wet ? between(T, 1.2, 2.5) : 0;
    s.capture = false;
    s.heal = false;
    s.leakAt = 2.6;
    if (slab.current) slab.current.visible = step === 1;
    if (bars.current) bars.current.visible = step === 2;
    if (leadBar.current) leadBar.current.scale.x = 2.0 * 0.45 * between(T, 1.0, 2.4) + 1e-4;
  });

  return (
    <group>
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 5]} />
        <meshStandardMaterial color="#10171d" roughness={1} />
      </mesh>
      {FAM_X.map((x) => (
        <Bx key={x} p={[x, -0.55, 0]} s={[1.8, 0.05, 1.4]} c="#26313b" rough={0.8} />
      ))}
      {FAM_X.map((x, i) => (
        <group key={`g${x}`} ref={grp[i]} position={[x, LAT_Y, 0]}>
          {i === 0 ? (
            <AssemblingLattice n={N2} a={0.34} asm={asm} radii={RAD} style={styles.pb} colors={{ A: "#3cba84", B: PAL.pb, X: "#7a56e0" }} />
          ) : i === 1 ? (
            <AssemblingLattice n={N2} a={0.34} asm={asm} radii={RAD} style={styles.snpb} colors={{ A: "#3cba84", B: PAL.pb, X: "#7a56e0" }} />
          ) : i === 2 ? (
            <AssemblingLattice n={N2} a={0.34} asm={asm} radii={RAD} style={styles.sn} colors={{ A: "#3cba84", B: PAL.sn, X: "#7a56e0" }} />
          ) : (
            <AssemblingLattice n={N2} a={0.34} asm={asm} radii={RAD} style={styles.dbl} colors={{ A: "#79b0ff", B: "#ffffff", X: "#e07a32" }} />
          )}
        </group>
      ))}

      {/* step 1: the lead-halide device and a damaged-device scenario */}
      <group ref={slab} position={[FAM_X[0]!, -0.45, 0]} scale={0.5} visible={false}>
        <ModuleSlab scn={scn} ground={-1.3} />
      </group>
      {step === 1 ? (
        <group position={[FAM_X[0]!, 0, 0]}>
          <Ground y={-1.1} w={2.2} d={1.2} />
        </group>
      ) : null}

      {/* step 2: lead content, all-Pb versus Sn–Pb (relative) */}
      <group ref={bars} position={[-2.2, -0.6, 0.6]} visible={false}>
        <Bx p={[0, 0.3, 0]} s={[2.0, 0.14, 0.14]} c={PAL.pb} />
        <Bx p={[-1.0 + 0.45, -0.1, 0]} s={[0.9, 0.14, 0.14]} c={PAL.pb} />
        <Bx p={[-1.0 + 0.9 + 0.55, -0.1, 0]} s={[1.1, 0.14, 0.14]} c={PAL.sn} o={0.5} edge="#d2a36a" />
        <mesh ref={leadBar} position={[0, -0.32, 0]} visible={false}>
          <boxGeometry args={[1, 0.02, 0.02]} />
          <meshBasicMaterial color="#e4a23a" />
        </mesh>
      </group>

      {/* step 3: performance penalty, conceptual */}
      {step === 3 ? <VGauge p={[2.2, 0.1, 0.5]} h={1.0} value={gauge} color="#ff8a4c" /> : null}

      {/* step 4: absorption comparison */}
      <group position={[3.3, -1.65, 0.9]} scale={0.8}>
        <AbsPlot show={absShow} />
      </group>

      {/* labels */}
      {FAM_X.map((x, i) => (
        <StoryTag key={`t${x}`} position={[x, 1.35, 0]} kind={i === 0 ? "layer" : i === 3 ? "good" : "concept"}>
          {[LA.pb, LA.snpb, LA.sn, LA.dbl][i]!}
        </StoryTag>
      ))}
      {gSite ? (
        <>
          {step <= 2 ? (
            <StoryTag position={[FAM_X[0]!, 0.35, 0.8]} kind="tiny" minor>
              {LA.siteB}
            </StoryTag>
          ) : null}
          {step === 2 ? (
            <StoryTag position={[FAM_X[1]!, 0.35, 0.8]} kind="tiny" minor>
              {LA.siteMix}
            </StoryTag>
          ) : null}
          {step === 3 ? (
            <StoryTag position={[FAM_X[2]!, 0.35, 0.8]} kind="tiny" minor>
              {LA.siteSn}
            </StoryTag>
          ) : null}
          {step === 4 ? (
            <StoryTag position={[FAM_X[3]!, 0.35, 0.8]} kind="tiny" minor>
              {LA.siteDbl}
            </StoryTag>
          ) : null}
        </>
      ) : null}
      {gWarn ? (
        <>
          <StoryTag position={[FAM_X[0]!, -1.35, 0.9]} kind="bad" sub={LA.leak}>
            {LA.warn}
          </StoryTag>
        </>
      ) : null}
      {gIntact ? (
        <StoryTag position={[FAM_X[0]!, -1.35, 0.9]} kind="good">
          {LA.intact}
        </StoryTag>
      ) : null}
      {step === 2 ? (
        <>
          <StoryTag position={[-2.2, -0.05, 0.6]} kind="layer" minor>
            {LA.leadRef}
          </StoryTag>
          <StoryTag position={[-2.2, -0.62, 0.6]} kind="concept" sub={LA.stillPb}>
            {LA.leadMix}
          </StoryTag>
        </>
      ) : null}
      {gOx ? (
        <StoryTag position={[FAM_X[2]!, 1.9, 0.5]} kind="bad" minor>
          {LA.ox}
        </StoryTag>
      ) : null}
      {gVac ? (
        <StoryTag position={[FAM_X[2]!, 0.1, 0.8]} kind="bad">
          {LA.vac}
        </StoryTag>
      ) : null}
      {step === 3 ? (
        <>
          <StoryTag position={[2.2, 0.85, 0.5]} kind="tiny" minor sub={LA.penalty}>
            {t("Hiệu suất", "Performance")}
          </StoryTag>
          <StoryTag position={[1.1, -0.9, 0.9]} kind="good" minor>
            {LA.noPb}
          </StoryTag>
        </>
      ) : null}
      {gAbs ? (
        <>
          <StoryTag position={[3.3, -0.45, 0.9]} kind="tiny" sub={LA.energy}>
            {LA.abs}
          </StoryTag>
          <StoryTag position={[3.3, -2.05, 0.9]} kind="concept" minor sub={LA.absDbl}>
            {LA.absPb}
          </StoryTag>
          <StoryTag position={[3.3, 1.2, 0.5]} kind="tiny" minor>
            {LA.notFree}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}

/* ═════════════════════════ 4.9 B · mitigation strategies ═════════════════════════ */

const LB = {
  front: t("Kính trước", "Front glass"),
  enc: t("Chất bọc (encapsulant)", "Encapsulant"),
  dev: t("Linh kiện perovskite", "Perovskite device"),
  cap: t("Lớp giữ chì (tùy chọn)", "Lead-capture layer (optional)"),
  rear: t("Lớp chắn / kính sau", "Rear barrier / glass"),
  seal: t("Viền kín", "Edge seal"),
  rain: t("Mưa", "Rain"),
  blocked: t("Nước bị chặn khi còn nguyên vẹn", "Water blocked while intact"),
  crack: t("Vết nứt", "Crack"),
  enters: t("Nước vào qua vết nứt", "Water enters through the crack"),
  species: t("Chất chứa chì", "Lead-containing species"),
  escape: t("Có thể thoát ra môi trường (khái niệm)", "May escape to the environment (conceptual)"),
  bound: t("Bị liên kết ở lớp giữ chì (khái niệm)", "Bound at the capture layer (conceptual)"),
  without: t("Không có lớp giữ chì", "Without lead capture"),
  withCap: t("Có lớp giữ chì", "With lead capture"),
  immobilized: t("Cố định chì giảm độ linh động và sự giải phóng; không loại bỏ mọi rủi ro", "Immobilization reduces mobility and release; it does not remove all risk"),
  research: t("Các cách đã công bố trong nghiên cứu, chưa phải tiêu chuẩn công nghiệp", "Published research approaches, not standard industrial practice"),
  heal: t("Polymer tự lành đóng một phần vết nứt", "Self-healing polymer closes part of the crack"),
  healNote: t("Minh họa khái niệm một hướng nghiên cứu đã công bố", "Conceptual illustration of a published research approach"),
  line: t("Dây chuyền sản xuất", "Production line"),
  waste: t("Chất thải chứa chì", "Lead-containing process waste"),
  drum: t("Thùng chứa kín", "Sealed container"),
  tray: t("Khay chứa dự phòng", "Secondary containment"),
  label: t("Dán nhãn", "Labelled"),
  transfer: t("Vận chuyển chất thải có kiểm soát", "Controlled waste transfer"),
  water: t("Nước thải", "Wastewater"),
  treat: t("Xử lý nước thải trước khi xả", "Treated before discharge"),
  sep: t("Kiểm soát nhà máy khác với ngăn rò rỉ từ module", "Factory control is separate from preventing leakage from a module"),
  oldMod: t("Module cũ / hỏng", "Old or damaged module"),
  collect: t("Thu gom", "Collection"),
  dismantle: t("Tháo dỡ có kiểm soát", "Controlled dismantling"),
  glassRec: t("Kính và khung: thu hồi vật liệu dùng lại", "Glass and frame: reusable materials recovered"),
  leadFrac: t("Phần chứa chì: thu hồi / xử lý thích hợp", "Lead-containing fraction: appropriate recovery / handling"),
  never: t("Không đập vỡ, đổ bỏ hay xả vào nước thải thường", "No uncontrolled breakage, dumping or ordinary wastewater"),
  all: t("Mọi biện pháp bổ trợ cho nhau", "The measures complement each other"),
  s1: t("1 · Bọc kín", "1 · Encapsulation"),
  s2: t("2 · Giữ chì", "2 · Lead capture"),
  s3: t("3 · Tự lành", "3 · Self-healing"),
  s4: t("4 · Kiểm soát nhà máy", "4 · Factory control"),
  s5: t("5 · Thu gom và tái chế", "5 · Collection and recycling"),
  env: t("Môi trường (đất / nước)", "Environment (soil / water)"),
};

const GROUND_Y = -1.25;
const N_WASTE = 16;

function Factory() {
  const waste = useRef<SwarmApi>(null);
  const drum = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Mesh>(null);
  const truck = useRef<THREE.Group>(null);
  const treat = useRef<THREE.MeshStandardMaterial>(null);
  const water = useRef<SwarmApi>(null);
  const clk = useRef(0);
  useFrame((_, dt) => {
    clk.current += Math.min(dt, 0.05);
    const T = useSim.getState().playing ? clk.current : clk.current;
    const loop = T % 12;
    const lidK = between(loop, 3.0, 4.0);
    const mv = between(loop, 5.5, 8.5);
    if (lid.current) lid.current.position.y = lerp(0.62, 0.36, lidK);
    if (drum.current) drum.current.position.set(lerp(-1.4, 1.5, mv), -0.7, 0.2);
    if (truck.current) truck.current.position.x = lerp(4.6, 3.3, between(loop, 7, 9));
    if (treat.current) treat.current.emissiveIntensity = 0.2 + 0.6 * between(loop, 7, 10);
    if (waste.current) {
      for (let i = 0; i < N_WASTE; i++) {
        const on = loop < 3.2;
        if (!on) {
          waste.current.hide(i);
          continue;
        }
        const life = (loop * 0.5 + i / N_WASTE) % 1;
        waste.current.set(i, lerp(-2.4, -1.4, life), lerp(-0.25, 0.45 - life * 0.9, life), 0.2, 1);
      }
      waste.current.flush();
    }
    if (water.current) {
      for (let i = 0; i < 12; i++) {
        const life = (T * 0.3 + i / 12) % 1;
        const x = lerp(-2.7, 0.5, life);
        water.current.set(i, x, lerp(-0.1, -0.55, life) + Math.sin(life * 6) * 0.04, -1.1, 1);
      }
      water.current.flush();
    }
  });
  return (
    <group>
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 4]} />
        <meshStandardMaterial color="#141b21" roughness={1} />
      </mesh>
      <Bx p={[-3.2, -0.45, 0]} s={[1.6, 0.9, 1.2]} c={PAL.steelDark} metal={0.5} rough={0.5} />
      <Bx p={[-3.2, 0.12, 0]} s={[1.3, 0.2, 1.0]} c="#17305e" />
      <Tube a={[-2.4, -0.25, 0.2]} b={[-1.4, 0.55, 0.2]} rad={0.05} c={PAL.steel} o={0.6} />
      <Bx p={[-1.4, -0.84, 0.2]} s={[1.0, 0.06, 0.9]} c="#5a6572" />
      <Bx p={[0.2, -0.84, 0.2]} s={[4.2, 0.06, 0.7]} c="#2a323b" />
      <group ref={drum} position={[-1.4, -0.7, 0.2]}>
        <Cy rad={0.32} h={0.7} c="#d4a72c" metal={0.3} rough={0.5} />
        <Cy p={[0, 0.0, 0]} rad={0.325} h={0.14} c="#161a1f" />
        <mesh ref={lid} position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.05, 24]} />
          <meshStandardMaterial color="#5a6572" metalness={0.6} roughness={0.4} />
        </mesh>
        <Bx p={[0, 0.08, 0.33]} s={[0.26, 0.26, 0.01]} c="#ffffff" />
        <Bx p={[0, 0.08, 0.335]} s={[0.2, 0.04, 0.01]} c="#d33" />
      </group>
      <Swarm ref={waste} count={N_WASTE} color="#ff9a7a" radius={0.04} halo={1.6} haloOpacity={0.15} emissive={0.8} />
      {/* controlled waste bin and transfer */}
      <Bx p={[1.9, -0.45, -0.1]} s={[1.0, 0.8, 1.0]} c="#33404d" rough={0.6} />
      <Bx p={[1.9, 0.0, 0.41]} s={[0.7, 0.2, 0.02]} c="#ffffff" />
      <Bx p={[1.9, 0.0, 0.42]} s={[0.5, 0.05, 0.02]} c="#d33" />
      <group ref={truck} position={[4.6, -0.55, 0]}>
        <Bx s={[1.5, 0.7, 0.9]} c="#e8edf2" rough={0.6} />
        <Bx p={[-0.95, -0.1, 0]} s={[0.5, 0.5, 0.85]} c="#4d86d6" />
        {[-0.5, 0.4].map((x) => (
          <Cy key={x} p={[x, -0.4, 0.45]} rad={0.14} h={0.1} r={[Math.PI / 2, 0, 0]} c="#0e1318" />
        ))}
      </group>
      {/* wastewater: tank, filter, treated tank */}
      <Cy p={[-2.7, -0.4, -1.1]} rad={0.35} h={0.9} c={PAL.steelDark} metal={0.4} />
      <Tube a={[-2.35, -0.3, -1.1]} b={[0.5, -0.55, -1.1]} rad={0.05} c={PAL.steel} o={0.7} />
      <Bx p={[-0.9, -0.55, -1.1]} s={[0.5, 0.5, 0.5]} c="#2a323b" metal={0.4} />
      <Cy p={[0.9, -0.4, -1.1]} rad={0.35} h={0.9} c="#cfe9fb" o={0.3} />
      <mesh position={[0.9, -0.55, -1.1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.55, 20]} />
        <meshStandardMaterial ref={treat} color="#5fd391" emissive="#5fd391" emissiveIntensity={0.2} transparent opacity={0.8} />
      </mesh>
      <Swarm ref={water} count={12} color={PAL.water} radius={0.03} halo={1.6} haloOpacity={0.14} emissive={1} />
    </group>
  );
}

function Recycling() {
  const mod = useRef<THREE.Group>(null);
  const glass = useRef<THREE.Group>(null);
  const dev = useRef<THREE.Group>(null);
  const frame = useRef<THREE.Group>(null);
  const sawA = useRef<THREE.Group>(null);
  const clk = useRef(0);
  useFrame((_, dt) => {
    clk.current += Math.min(dt, 0.05);
    const loop = clk.current % 13;
    const run = between(loop, 0.5, 3.5);
    const split = between(loop, 4.2, 6.0);
    const away = between(loop, 6.0, 9.0);
    const baseX = lerp(-3.4, -0.2, run);
    if (mod.current) mod.current.visible = loop < 13;
    if (frame.current) frame.current.position.set(baseX + away * 0, 0, 0);
    // pieces separate once at the station, then travel to their destinations
    if (glass.current) glass.current.position.set(baseX + lerp(0, 2.6, away), 0.1 + 0.45 * split + lerp(0, 0.1, away), 0.0);
    if (dev.current) dev.current.position.set(baseX + lerp(0, 2.6, away), 0.0 - 0.1 * split - 0.35 * away, 0.0);
    if (frame.current) frame.current.position.set(baseX + lerp(0, 2.6, away), 0.1, lerp(0, 0.0, away) + 0.0);
    if (sawA.current) sawA.current.rotation.z = loop * 12 * (split > 0 && split < 1 ? 1 : 0);
  });
  return (
    <group>
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 4]} />
        <meshStandardMaterial color="#141b21" roughness={1} />
      </mesh>
      <Bx p={[-0.4, -0.75, 0]} s={[8.4, 0.1, 0.9]} c="#2a323b" />
      {/* collection bin */}
      <Bx p={[-4.0, -0.4, 0]} s={[1.2, 0.8, 1.1]} c="#33404d" rough={0.6} />
      <Bx p={[-4.0, 0.03, 0.56]} s={[0.8, 0.18, 0.02]} c="#ffffff" />
      {/* dismantling station */}
      <Bx p={[-0.2, 0.55, 0]} s={[1.6, 0.18, 1.4]} c={PAL.steelDark} metal={0.5} />
      {[-0.7, 0.7].map((x) => (
        <Bx key={x} p={[x - 0.2, 0.0, 0]} s={[0.1, 1.2, 1.3]} c={PAL.steel} metal={0.6} />
      ))}
      <group ref={sawA} position={[-0.2, 0.3, 0.75]}>
        <Cy rad={0.18} h={0.03} r={[Math.PI / 2, 0, 0]} c="#c9d1da" metal={0.8} lo />
      </group>
      {/* the module and its parts */}
      <group ref={mod}>
        <group ref={glass} position={[-3.4, 0.1, 0]}>
          <Bx s={[1.7, 0.06, 1.0]} c="#a9d3f0" o={0.5} edge="#cfe9fb" />
        </group>
        <group ref={dev} position={[-3.4, 0.0, 0]}>
          <Bx s={[1.6, 0.06, 0.95]} c="#241a30" />
          <Bx p={[0, 0.035, 0]} s={[1.6, 0.012, 0.95]} c="#c9772e" />
        </group>
        <group ref={frame} position={[-3.4, 0.1, 0]}>
          <Bx p={[0, 0.0, 0.52]} s={[1.8, 0.1, 0.05]} c="#cfd6de" metal={0.6} />
          <Bx p={[0, 0.0, -0.52]} s={[1.8, 0.1, 0.05]} c="#cfd6de" metal={0.6} />
        </group>
      </group>
      {/* destinations */}
      <Bx p={[2.8, -0.4, -0.2]} s={[1.3, 0.8, 1.2]} c="#2f6b8a" o={0.6} rough={0.4} />
      <Bx p={[2.8, -0.35, 1.0]} s={[1.0, 0.7, 0.8]} c="#7a1f1f" rough={0.5} />
      <Bx p={[2.8, -0.0, 1.41]} s={[0.6, 0.16, 0.02]} c="#ffffff" />
    </group>
  );
}

export function LeadBScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("leadmit", step), 2);
  const protSel = useSim((s) => String(s.fab.prot ?? "enc"));
  const main = useRef<Scn>(newScn());
  const left = useRef<Scn>(newScn());
  const right = useRef<Scn>(newScn());
  const gMain = useRef<THREE.Group>(null);
  const gSplit = useRef<THREE.Group>(null);
  const gFact = useRef<THREE.Group>(null);
  const gRec = useRef<THREE.Group>(null);
  const g0 = useGate(() => step === 0 && clock.current.t > 3);
  const g1a = useGate(() => step === 1 && clock.current.t > 1.5 && clock.current.t < 6);
  const g1b = useGate(() => step === 1 && clock.current.t > 7);
  const g1c = useGate(() => step === 1 && clock.current.t > 9);
  const g2 = useGate(() => step === 2 && clock.current.t > 4);
  const g3 = useGate(() => step === 3 && clock.current.t > 5);
  const g6 = useGate(() => step === 6 && clock.current.t > 1);

  useFrame(() => {
    const T = clock.current.t;
    const f = useSim.getState().fab;
    const prot = String(f.prot ?? "enc");
    const m = main.current;
    m.T = T;
    m.capture = step === 1 ? prot !== "enc" : step === 3 || step === 6;
    m.heal = step === 1 ? prot === "heal" : step === 3;
    m.explode = step === 0 ? between(T, 0.4, 3.2) * (1 - between(T, 8.5, 10.5)) : 0;
    m.rain = step === 1 ? between(T, 0.5, 1.5) : step === 3 ? between(T, 0.3, 1) : 0;
    m.crack = step === 1 ? between(T, 6, 8) : step === 3 ? between(T, 1, 2.5) : 0;
    m.healed = step === 1 ? (m.heal ? 0.75 * between(T, 9.5, 12) : 0) : step === 3 ? between(T, 4.5, 9) : 0;
    m.leakAt = step === 1 ? 7.5 : 2.6;
    const l = left.current;
    const r = right.current;
    for (const sc of [l, r]) {
      sc.T = T;
      sc.rain = step === 2 ? between(T, 0.4, 1) : 0;
      sc.crack = step === 2 ? between(T, 2, 3.5) : 0;
      sc.heal = false;
      sc.healed = 0;
      sc.leakAt = 3.2;
    }
    l.capture = false;
    r.capture = true;
    if (gMain.current) gMain.current.visible = step === 0 || step === 1 || step === 3 || step === 6;
    if (gSplit.current) gSplit.current.visible = step === 2;
    if (gFact.current) gFact.current.visible = step === 4;
    if (gRec.current) gRec.current.visible = step === 5;
  });

  return (
    <group>
      {step <= 3 || step === 6 ? <Ground y={GROUND_Y} w={9} d={3.6} /> : null}
      <group ref={gMain} visible={false}>
        <ModuleSlab scn={main} />
      </group>
      <group ref={gSplit} visible={false}>
        <group position={[-2.1, 0, 0]} scale={0.62}>
          <ModuleSlab scn={left} ground={-1.35} />
        </group>
        <group position={[2.1, 0, 0]} scale={0.62}>
          <ModuleSlab scn={right} ground={-1.35} />
        </group>
      </group>
      <group ref={gFact} visible={false}>
        <Factory />
      </group>
      <group ref={gRec} visible={false}>
        <Recycling />
      </group>

      {g0 ? (
        <>
          <StoryTag position={[-2.3, 1.9, 0.4]} kind="layer">
            {LB.front}
          </StoryTag>
          <StoryTag position={[-2.3, 1.3, 0.4]} kind="concept" minor>
            {LB.enc}
          </StoryTag>
          <StoryTag position={[-2.3, 0.7, 0.4]} kind="good">
            {LB.dev}
          </StoryTag>
          <StoryTag position={[-2.3, 0.1, 0.4]} kind="good" minor>
            {LB.cap}
          </StoryTag>
          <StoryTag position={[-2.3, -0.5, 0.4]} kind="layer" minor>
            {LB.rear}
          </StoryTag>
          <StoryTag position={[2.2, 0.5, 1.2]} kind="concept">
            {LB.seal}
          </StoryTag>
        </>
      ) : null}
      {g1a ? (
        <StoryTag position={[-0.6, 1.3, 0.8]} kind="good">
          {LB.blocked}
        </StoryTag>
      ) : null}
      {g1b ? (
        <>
          <StoryTag position={[0.45, 0.95, 0.9]} kind="bad">
            {LB.crack}
          </StoryTag>
          <StoryTag position={[-1.6, 0.0, 0.9]} kind="particle" minor>
            {LB.enters}
          </StoryTag>
        </>
      ) : null}
      {g1c ? (
        <StoryTag position={[0.5, -1.55, 0.9]} kind={protSel === "enc" ? "bad" : "good"} sub={LB.research}>
          {protSel === "enc" ? LB.escape : LB.bound}
        </StoryTag>
      ) : null}
      {step === 2 ? (
        <>
          <StoryTag position={[-2.1, 1.35, 0.4]} kind="bad">
            {LB.without}
          </StoryTag>
          <StoryTag position={[2.1, 1.35, 0.4]} kind="good">
            {LB.withCap}
          </StoryTag>
        </>
      ) : null}
      {g2 ? (
        <>
          <StoryTag position={[-2.1, -1.2, 0.9]} kind="bad" minor>
            {LB.escape}
          </StoryTag>
          <StoryTag position={[2.1, -1.2, 0.9]} kind="good" sub={LB.immobilized}>
            {LB.bound}
          </StoryTag>
        </>
      ) : null}
      {g3 ? (
        <StoryTag position={[0.45, 1.0, 0.9]} kind="good" sub={LB.healNote}>
          {LB.heal}
        </StoryTag>
      ) : null}
      {step === 4 ? (
        <>
          <StoryTag position={[-3.4, 1.1, 0.5]} kind="layer">
            {LB.line}
          </StoryTag>
          <StoryTag position={[-1.4, 1.1, 0.6]} kind="bad" minor>
            {LB.waste}
          </StoryTag>
          <StoryTag position={[-1.4, -1.25, 0.8]} kind="concept" minor>
            {LB.tray}
          </StoryTag>
          <StoryTag position={[1.9, 0.45, 0.6]} kind="concept" sub={LB.label}>
            {LB.drum}
          </StoryTag>
          <StoryTag position={[3.4, 0.0, 0.6]} kind="good" minor>
            {LB.transfer}
          </StoryTag>
          <StoryTag position={[-3.1, -1.05, -0.8]} kind="particle" minor>
            {LB.water}
          </StoryTag>
          <StoryTag position={[0.9, -1.05, -0.8]} kind="good" minor>
            {LB.treat}
          </StoryTag>
          <StoryTag position={[0, -1.4, 1.2]} kind="tiny">
            {LB.sep}
          </StoryTag>
        </>
      ) : null}
      {step === 5 ? (
        <>
          <StoryTag position={[-4.0, 0.2, 0.7]} kind="concept" sub={LB.oldMod}>
            {LB.collect}
          </StoryTag>
          <StoryTag position={[-0.2, 1.1, 0.5]} kind="layer">
            {LB.dismantle}
          </StoryTag>
          <StoryTag position={[2.8, 0.35, 0]} kind="good" minor>
            {LB.glassRec}
          </StoryTag>
          <StoryTag position={[2.8, -0.1, 1.5]} kind="bad" minor>
            {LB.leadFrac}
          </StoryTag>
          <StoryTag position={[0, -1.4, 1.2]} kind="tiny">
            {LB.never}
          </StoryTag>
        </>
      ) : null}
      {g6 ? (
        <>
          <StoryTag position={[-2.4, 1.5, 0.5]} kind="layer">
            {LB.s1}
          </StoryTag>
          <StoryTag position={[-2.4, 0.9, 0.5]} kind="good">
            {LB.s2}
          </StoryTag>
          <StoryTag position={[2.4, 1.5, 0.5]} kind="good">
            {LB.s3}
          </StoryTag>
          <StoryTag position={[2.4, 0.9, 0.5]} kind="concept">
            {LB.s4}
          </StoryTag>
          <StoryTag position={[0, 1.9, 0.5]} kind="concept">
            {LB.s5}
          </StoryTag>
          <StoryTag position={[0, -1.7, 0.9]} kind="tiny">
            {LB.all}
          </StoryTag>
        </>
      ) : null}
    </group>
  );
}

/* ═════════════════════════ 4.9 C · three protection designs ═════════════════════════ */

const LC = {
  rain: t("Mưa rơi lên module", "Rain falls on the module"),
  seal: t("Bọc kín nguyên vẹn chặn nước", "The intact encapsulation blocks water"),
  crack: t("Vết nứt mở ra", "A crack opens"),
  escape: t("Chất chứa chì có thể thoát ra", "Lead-containing species may escape"),
  bound: t("Bị giữ ở lớp giữ chì, độ linh động giảm", "Held at the capture layer, mobility reduced"),
  design: t("Thiết kế", "Design"),
  d1: t("1 · Bọc kín chuẩn", "1 · Standard encapsulation"),
  d2: t("2 · + giữ chì", "2 · + lead capture"),
  d3: t("3 · + giữ chì + kế hoạch cuối đời", "3 · + capture + end-of-life plan"),
  eolPlan: t("Kế hoạch cuối đời: thu gom → tháo dỡ → thu hồi", "End-of-life plan: collection → dismantling → recovery"),
  eolNone: t("Chưa có kế hoạch cuối đời: chì vẫn còn đó", "No end-of-life plan: the lead is still there"),
  eolNeed: t("Vẫn cần thu gom và xử lý có kiểm soát", "Still needs controlled collection and handling"),
  noZero: t("Không có số phần trăm rò rỉ nào được nêu; không gọi là “không rò rỉ”", "No leakage percentage is given; nothing is called “zero leakage”"),
};

export function LeadCScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("leadcmp", step), 2);
  const designSel = useSim((s) => String(s.fab.design ?? "1"));
  const scn = useRef<Scn>(newScn());
  const slab = useRef<THREE.Group>(null);
  const bin = useRef<THREE.Group>(null);
  const flag = useRef<THREE.Group>(null);
  const g1 = useGate(() => step === 1 && clock.current.t > 2);
  const g2a = useGate(() => step === 2 && clock.current.t > 3);
  const g2b = useGate(() => step === 2 && clock.current.t > 5);
  const g3 = useGate(() => step === 3 && clock.current.t > 3);

  useFrame(() => {
    const T = clock.current.t;
    const f = useSim.getState().fab;
    const design = Number(String(f.design ?? "1"));
    const s = scn.current;
    s.T = T;
    s.capture = design >= 2;
    s.heal = false;
    s.healed = 0;
    s.rain = step === 0 ? between(T, 0.3, 1) : step === 1 ? 1 : step === 2 ? 1 : step === 3 ? 0.2 : step === 4 ? 0.8 : 0;
    s.crack = step === 2 ? between(T, 1.2, 2.8) : step >= 3 ? 1 : 0;
    s.leakAt = step === 2 ? 3.2 : 0.1;
    if (slab.current) {
      const toBin = step === 3 && design === 3 ? between(T, 4, 7) : 0;
      slab.current.position.set(lerp(0, 3.0, toBin), lerp(0, -0.6, toBin), 0);
      slab.current.scale.setScalar(lerp(1, 0.6, toBin));
    }
    if (bin.current) bin.current.visible = step === 3 && design === 3;
    if (flag.current) flag.current.visible = step === 3 && design !== 3;
  });

  return (
    <group>
      <Ground y={GROUND_Y} w={9} d={3.6} />
      <group ref={slab}>
        <ModuleSlab scn={scn} />
      </group>
      <group ref={bin} position={[3.0, -0.7, 0]} visible={false}>
        <Bx s={[1.3, 0.9, 1.1]} c="#33404d" rough={0.6} />
        <Bx p={[0, 0.1, 0.56]} s={[0.8, 0.2, 0.02]} c="#ffffff" />
        <Arrow3 a={[-1.6, 0.9, 0]} b={[-0.4, 0.9, 0]} color="#79e0a0" head={0.08} />
      </group>
      <group ref={flag} position={[2.9, -0.2, 0]} visible={false}>
        <Bx p={[0, 0.4, 0]} s={[0.05, 1.2, 0.05]} c={PAL.steel} />
        <Bx p={[0.35, 0.9, 0]} s={[0.7, 0.4, 0.03]} c="#e4a23a" />
      </group>
      {step === 1 ? <Rod a={[-1.7, 0.2, 1.05]} b={[1.7, 0.2, 1.05]} color="#79e0a0" radius={0.01} opacity={0.5} /> : null}

      {step === 0 ? (
        <StoryTag position={[-1.6, 1.4, 0.5]} kind="particle">
          {LC.rain}
        </StoryTag>
      ) : null}
      {g1 ? (
        <StoryTag position={[0, 1.0, 1.0]} kind="good">
          {LC.seal}
        </StoryTag>
      ) : null}
      {g2a ? (
        <StoryTag position={[0.45, 0.95, 0.9]} kind="bad">
          {LC.crack}
        </StoryTag>
      ) : null}
      {g2b ? (
        <StoryTag position={[0.3, -1.5, 0.9]} kind={designSel === "1" ? "bad" : "good"}>
          {designSel === "1" ? LC.escape : LC.bound}
        </StoryTag>
      ) : null}
      {g3 ? (
        <>
          {designSel === "3" ? (
            <StoryTag position={[3.0, 0.3, 0.7]} kind="good">
              {LC.eolPlan}
            </StoryTag>
          ) : (
            <>
              <StoryTag position={[2.6, 1.4, 0.5]} kind="bad">
                {LC.eolNone}
              </StoryTag>
              <StoryTag position={[0, -1.7, 0.9]} kind="tiny">
                {LC.eolNeed}
              </StoryTag>
            </>
          )}
        </>
      ) : null}
      {step === 4 ? (
        <StoryTag position={[0, -1.7, 0.9]} kind="tiny">
          {LC.noZero}
        </StoryTag>
      ) : null}
    </group>
  );
}

