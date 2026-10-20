import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { tr } from "@/lib/sim/i18n";
import { useSim } from "@/lib/sim/store";
import { t, type StorySpec } from "@/lib/sim/story";
import {
  ABSORBER_REQS,
  C5,
  ARCH_ROWS,
  CANDS,
  CAT_LABEL,
  CHECKLIST,
  CRITERIA,
  ENC,
  ENERGY,
  FIN_STAGES,
  HEX,
  ISO_FAMILIES,
  ISO_HEAD,
  ISO_TEXT,
  LAYERS,
  LAYER_IDS,
  P,
  WHY_LAYER,
  type Cand,
  type IsoFam,
  type LayerId,
} from "@/lib/sim/story5";
import { RichText } from "./RichText";

const cites = (a: number[]) => a.map((n) => `[${n}]`).join(" ");

/* ───────────────────────── small shared pieces ───────────────────────── */

function useFab() {
  const fab = useSim((s) => s.fab);
  const patch = useSim((s) => s.patch);
  return { fab, set: (k: string, v: string | number) => patch({ fab: { ...useSim.getState().fab, [k]: v } }) };
}

function Dot({ c }: { c: string }) {
  return <i className="c5-dot" style={{ background: c }} aria-hidden="true" />;
}


/** The row of layer buttons: the same list on the model and in the panel. */
function LayerChips({ ids, value, onPick }: { ids: (LayerId | "enc")[]; value: string | undefined; onPick: (id: LayerId | "enc") => void }) {
  const locale = useSim((s) => s.locale);
  return (
    <div className="c5-chips" role="group" aria-label={tr(locale, C5.layers)}>
      {ids.map((id) => (
        <button key={id} type="button" className={value === id ? "c5-chip on" : "c5-chip"} aria-pressed={value === id} onClick={() => onPick(id)}>
          <Dot c={HEX[id]} />
          {tr(locale, id === "enc" ? ENC.name : LAYERS[id].name)}
        </button>
      ))}
    </div>
  );
}

function LayerCard({ id }: { id: LayerId }) {
  const locale = useSim((s) => s.locale);
  const info = LAYERS[id];
  return (
    <article className="c5-card" style={{ borderColor: HEX[id] }}>
      <h4>
        <Dot c={HEX[id]} />
        {tr(locale, info.name)}
      </h4>
      <dl>
        <dt>{tr(locale, C5.role)}</dt>
        <dd>{tr(locale, info.role)}</dd>
        <dt>{tr(locale, C5.materials)}</dt>
        <dd>{tr(locale, info.materials)}</dd>
        <dt>{tr(locale, C5.consider)}</dt>
        <dd>{tr(locale, info.consider)}</dd>
      </dl>
      <p className="c5-cites">
        <RichText text={cites(info.cite)} />
      </p>
    </article>
  );
}

/* ───────────────────────── 5.1 / 5.2 ───────────────────────── */

const ARCH = {
  pin: [
    t("Kính", "Glass"),
    t("ITO", "ITO"),
    t("HTL / SAM (chọn lọc lỗ trống)", "HTL / SAM (hole-selective)"),
    t("Perovskite", "Perovskite"),
    t("ETL (C₆₀)", "ETL (C₆₀)"),
    t("Lớp đệm (tùy chọn)", "Buffer (optional)"),
    t("Kim loại", "Metal"),
  ],
  nip: [
    t("Kính", "Glass"),
    t("Điện cực trong suốt", "Transparent electrode"),
    t("ETL, ví dụ SnO₂", "ETL, e.g. SnO₂"),
    t("Perovskite", "Perovskite"),
    t("HTL, ví dụ spiro-OMeTAD", "HTL, e.g. spiro-OMeTAD"),
    t("Kim loại", "Metal"),
  ],
};

function ArchCompare() {
  const locale = useSim((s) => s.locale);
  return (
    <div className="lead-table-wrap c5-table">
      <table className="lead-table">
        <thead>
          <tr>
            <th>{tr(locale, t("Tiêu chí", "Criterion"))}</th>
            <th>p–i–n</th>
            <th>n–i–p</th>
          </tr>
        </thead>
        <tbody>
          {ARCH_ROWS.map((r) => (
            <tr key={r.id}>
              <th scope="row">
                <b>{tr(locale, r.name)}</b>
              </th>
              {([r.pin, r.nip] as const).map((side, i) => (
                <td key={i} className={`c5-cell c5-${side.c ?? "info"}`}>
                  {side.c ? <b>{tr(locale, CAT_LABEL[side.c])}</b> : null}
                  <span>{tr(locale, side.text)}</span>
                  {side.cite ? (
                    <span className="c5-cites">
                      <RichText text={cites(side.cite)} />
                    </span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="c5-note">
        {tr(locale, t("Nhãn định tính, không có điểm số.", "Qualitative labels, no scores."))}
      </p>
    </div>
  );
}


function CompareGoodPoor() {
  const locale = useSim((s) => s.locale);
  const rows: [string, string, string][] = [
    [t("Giao diện", "Interface"), t("Sạch, không viền đỏ", "Clean, no red outline"), t("Có khuyết tật (viền đỏ)", "Defective (red outline)")],
    [t("Điện tử và lỗ trống", "Electrons and holes"), t("Tới đúng điện cực", "Reach the right electrodes"), t("Một phần tái hợp (chớp đỏ)", "Partly recombine (red flashes)")],
    [t("Dòng ra mạch ngoài", "Current in the circuit"), t("Mạnh (tải sáng)", "Strong (bright load)"), t("Giảm (tải mờ)", "Reduced (dim load)")],
    [t("Nguyên nhân thường gặp", "Typical cause"), t("Chọn lọc phù hợp, đường lấy điện tích thuận lợi", "Appropriate selectivity, favourable pathways"), t("Năng lượng không khớp hoặc giao diện khuyết tật", "Misaligned energy or defective interface")],
  ];
  return (
    <div className="lead-table-wrap c5-table">
      <table className="lead-table">
        <thead>
          <tr>
            <th>{tr(locale, t("Quan sát", "What to look for"))}</th>
            <th className="c5-good-h">{tr(locale, t("Thiết kế tốt", "Good design"))}</th>
            <th className="c5-bad-h">{tr(locale, t("Thiết kế kém", "Poor design"))}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, g, b]) => (
            <tr key={k}>
              <th scope="row">
                <b>{tr(locale, k)}</b>
              </th>
              <td className="c5-cell c5-adv">
                <span>{tr(locale, g)}</span>
              </td>
              <td className="c5-cell c5-trade">
                <span>{tr(locale, b)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="c5-note">
        <b>{tr(locale, P.concept)}</b> <RichText text="[102] [103]" />
      </p>
    </div>
  );
}

function DeviceColumn({ spec }: { spec: StorySpec; step: number }) {
  const locale = useSim((s) => s.locale);
  return (
    <>
      {spec.id === "pin" ? <ArchCompare /> : <CompareGoodPoor />}
      <p className="c5-note">{tr(locale, P.notScale)}</p>
    </>
  );
}

/* ───────────────────────── 5.3 ───────────────────────── */

function Spectrum() {
  const locale = useSim((s) => s.locale);
  return (
    <figure className="c5-fig">
      <svg viewBox="0 0 300 130" role="img" aria-label={tr(locale, t("Phổ hấp thụ khái niệm và sơ đồ vùng năng lượng", "Conceptual absorption spectrum and band diagram"))}>
        <line className="ax" x1="12" y1="104" x2="150" y2="104" />
        <line className="ax" x1="12" y1="104" x2="12" y2="16" />
        <path d="M12 30 C70 30 92 32 104 44 C112 54 114 90 150 98" className="curve" />
        <line className="edge" x1="108" y1="20" x2="108" y2="104" />
        <text x="112" y="26" className="tx">{tr(locale, t("mép hấp thụ", "absorption edge"))}</text>
        <text x="14" y="118" className="tx">{tr(locale, t("bước sóng (ngắn → dài)", "wavelength (short → long)"))}</text>
        <text x="16" y="14" className="tx">{tr(locale, t("hấp thụ", "absorption"))}</text>
        {/* bands */}
        <line className="band" x1="190" y1="30" x2="280" y2="30" />
        <line className="band" x1="190" y1="90" x2="280" y2="90" />
        <text x="196" y="24" className="tx">{tr(locale, t("vùng dẫn", "conduction band"))}</text>
        <text x="196" y="104" className="tx">{tr(locale, t("vùng hóa trị", "valence band"))}</text>
        <line className="gap" x1="235" y1="33" x2="235" y2="87" />
        <text x="241" y="64" className="tx">Eg</text>
        <circle cx="262" cy="30" r="5" fill={HEX.e} />
        <circle cx="262" cy="90" r="5" fill="none" stroke={HEX.h} strokeWidth="2" />
      </svg>
      <figcaption>{tr(locale, t("Minh họa khái niệm, không phải bộ số liệu có trích dẫn.", "Conceptual illustration, not a cited dataset."))}</figcaption>
    </figure>
  );
}

function EnergyDiagram() {
  const locale = useSim((s) => s.locale);
  const [sc, setSc] = useState("good");
  const cur = ENERGY.find((e) => e.id === sc) ?? ENERGY[0]!;
  // levels (y grows downward; higher on screen = higher electron energy)
  const htlHomo = sc === "barrier" ? 108 : 86;
  const etlLumo = 52;
  return (
    <div className="c5-energy">
      <div className="c5-tabs" role="tablist">
        {ENERGY.map((e) => (
          <button key={e.id} type="button" role="tab" aria-selected={sc === e.id} className={sc === e.id ? "c5-tab on" : "c5-tab"} onClick={() => setSc(e.id)}>
            {tr(locale, e.name)}
          </button>
        ))}
      </div>
      <figure className="c5-fig">
        <svg viewBox="0 0 300 150" role="img" aria-label={tr(locale, cur.name)}>
          <text x="6" y="12" className="tx">{tr(locale, t("năng lượng điện tử ↑", "electron energy ↑"))}</text>
          {/* HTL */}
          <rect x="14" y={htlHomo} width="64" height="3" fill={HEX.htl} />
          <rect x="14" y="30" width="64" height="3" fill={HEX.htl} opacity="0.35" />
          <text x="22" y="124" className="tx">HTL</text>
          {/* perovskite */}
          <rect x="118" y="38" width="64" height="3" fill={HEX.perov} />
          <rect x="118" y="96" width="64" height="3" fill={HEX.perov} />
          <text x="122" y="124" className="tx">{tr(locale, t("Perovskite", "Perovskite"))}</text>
          {/* ETL */}
          <rect x="222" y={etlLumo} width="64" height="3" fill={HEX.etl} />
          <rect x="222" y="120" width="64" height="3" fill={HEX.etl} opacity="0.35" />
          <text x="244" y="140" className="tx">ETL</text>
          {/* electron: conduction band of perovskite down to the ETL */}
          <path d={`M182 40 L222 ${etlLumo}`} stroke={HEX.e} strokeWidth="2" fill="none" />
          <circle cx="182" cy="40" r="4" fill={HEX.e} />
          {/* hole: valence band of perovskite up to the HTL (holes float up) */}
          <path d={`M118 98 L78 ${htlHomo}`} stroke={HEX.h} strokeWidth="2" fill="none" strokeDasharray={sc === "barrier" ? "3 3" : undefined} />
          <circle cx="118" cy="98" r="4" fill="none" stroke={HEX.h} strokeWidth="2" />
          {sc === "barrier" ? (
            <text x="64" y={htlHomo - 6} fill={HEX.defect} fontSize="14" fontWeight="700">✕</text>
          ) : null}
          {sc === "hard" ? (
            <text x="228" y="42" fill="#ffd36a" fontSize="10">⚠ {tr(locale, t("khó phủ đều", "hard to coat"))}</text>
          ) : null}
        </svg>
        <figcaption>{tr(locale, t("Khái niệm — không có giá trị số, không phải mức đo của vật liệu cụ thể.", "Conceptual — no numerical values, not measured levels of specific materials."))}</figcaption>
      </figure>
      <p className="c5-note">{tr(locale, cur.text)}</p>
    </div>
  );
}

function CandCard({ c }: { c: Cand }) {
  const locale = useSim((s) => s.locale);
  return (
    <article className="c5-card">
      <h4>{tr(locale, c.name)}</h4>
      <dl>
        <dt>{tr(locale, t("Vì sao có ích", "Why it can help"))}</dt>
        <dd>{tr(locale, c.why)}</dd>
        <dt>{tr(locale, t("Hạn chế / rủi ro", "Limitations / risks"))}</dt>
        <dd>{tr(locale, c.limits)}</dd>
        <dt>{tr(locale, t("Giao diện", "Interface"))}</dt>
        <dd>{tr(locale, c.iface)}</dd>
        <dt>{tr(locale, t("Chế tạo", "Fabrication"))}</dt>
        <dd>{tr(locale, c.fab)}</dd>
      </dl>
      {c.cite.length ? (
        <p className="c5-cites">
          <RichText text={cites(c.cite)} />
        </p>
      ) : null}
    </article>
  );
}

function CompareTable({ cands }: { cands: Cand[] }) {
  const locale = useSim((s) => s.locale);
  return (
    <div className="lead-table-wrap c5-table">
      <table className="lead-table">
        <thead>
          <tr>
            <th>{tr(locale, t("Tiêu chí so sánh", "Criterion"))}</th>
            {cands.map((c) => (
              <th key={c.id}>{tr(locale, c.name)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CRITERIA.map((cr) => (
            <tr key={cr.id}>
              <th scope="row">
                <b>{tr(locale, cr.name)}</b>
                <span className="c5-q">{tr(locale, cr.q)}</span>
              </th>
              {cands.map((c) => {
                const cell = c.cells[cr.id] ?? { c: "nv" as const };
                return (
                  <td key={c.id} className={`c5-cell c5-${cell.c}`}>
                    <b>{tr(locale, CAT_LABEL[cell.c])}</b>
                    {cell.note ? <span>{tr(locale, cell.note)}</span> : null}
                    {cell.cite ? (
                      <span className="c5-cites">
                        <RichText text={cites(cell.cite)} />
                      </span>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="c5-note">
        {tr(locale, t("Nhãn định tính kèm nguồn; không có điểm số. “Cần kiểm chứng” nghĩa là bộ nguồn của chương này chưa có bằng chứng.", "Qualitative labels with sources; no scores. “Needs validation” means this chapter's source set has no evidence."))}
      </p>
    </div>
  );
}

const TCO_NOTE = {
  bal: t("Điện cực cân bằng: truyền phần lớn ánh sáng và dẫn điện đủ tốt.", "Balanced electrode: transmits most of the light and conducts well enough."),
  clear: t("Điện cực giả định rất trong suốt nhưng dẫn kém: ánh sáng tới đủ, nhưng dòng điện bị nghẽn.", "Hypothetical very transparent but poorly conducting electrode: plenty of light arrives, but the current is choked."),
};

function MaterialColumn({ step }: { step: number }) {
  const { fab, set } = useFab();
  const locale = useSim((s) => s.locale);
  const stepLayer = WHY_LAYER[step] ?? "all";
  const layer = (fab.layer as LayerId | "enc" | undefined) ?? (stepLayer === "all" ? "htl" : stepLayer);
  // the selected layer follows the step
  useEffect(() => {
    set("layer", stepLayer === "all" ? "htl" : stepLayer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  const cands = CANDS[layer] ?? [];
  const candSel = String(fab[`cand-${layer}`] ?? cands[0]?.id ?? "");
  const cur = cands.find((c) => c.id === candSel) ?? cands[0];
  const energy = fab.energy === "on";
  return (
    <>
      <LayerChips ids={["tco", "htl", "perov", "etl", "buf", "metal", "enc"]} value={layer} onPick={(id) => set("layer", id)} />
      {cands.length && step === 6 ? (
        <details className="c5-details" open={step === 6} key={`${layer}-${step === 6 ? "t" : "f"}`}>
          <summary>{tr(locale, t("Bảng so sánh 10 tiêu chí", "Ten-criterion comparison table"))}</summary>
          <CompareTable cands={cands} />
        </details>
      ) : null}
      {layer === "tco" && step === 0 ? (
        <article className="c5-card">
          <h4>{tr(locale, t("Điện cực giả định", "Hypothetical electrode"))}</h4>
          <p>{tr(locale, TCO_NOTE[String(fab.tcoc ?? "bal") === "clear" ? "clear" : "bal"])}</p>
          <p className="c5-note">{tr(locale, t("Chỉ để minh họa; không phải số đo.", "Illustration only; not measured values."))}</p>
        </article>
      ) : null}
      {layer === "perov" ? (
        <article className="c5-card" style={{ borderColor: HEX.perov }}>
          <h4>
            <Dot c={HEX.perov} />
            {tr(locale, LAYERS.perov.name)}
          </h4>
          <ul className="c5-reqs">
            {ABSORBER_REQS.map((r) => (
              <li key={r.name}>
                <b>{tr(locale, r.name)}</b> {tr(locale, r.text)}
              </li>
            ))}
          </ul>
          <Spectrum />
          <p className="c5-note">
            {tr(locale, t("Vùng cấm, độ hấp thụ, độ linh động hạt tải và độ bền là các tính chất khác nhau.", "Bandgap, absorption, carrier mobility and stability are different properties."))} <RichText text="[101] [103]" />
          </p>
        </article>
      ) : cands.length ? (
        <>
          <div className="c5-tabs" role="tablist">
            {cands.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={cur?.id === c.id} className={cur?.id === c.id ? "c5-tab on" : "c5-tab"} onClick={() => set(`cand-${layer}`, c.id)}>
                {tr(locale, c.name)}
              </button>
            ))}
          </div>
          {cur ? <CandCard c={cur} /> : null}
        </>
      ) : null}
      {energy ? <EnergyDiagram /> : null}
      {cands.length && step !== 6 ? (
        <details className="c5-details" open={step === 6} key={`${layer}-${step === 6 ? "t" : "f"}`}>
          <summary>{tr(locale, t("Bảng so sánh 10 tiêu chí", "Ten-criterion comparison table"))}</summary>
          <CompareTable cands={cands} />
        </details>
      ) : null}
    </>
  );
}

/* ───────────────────────── 5.4 ───────────────────────── */

/** Illustrative curves for the kind of behaviour each test group is meant to reveal. They are not data. */
export function isoCurve(fam: IsoFam, lvl: number, x: number): number {
  const r = [0.12, 0.3, 0.5][Math.min(2, Math.max(0, lvl - 1))]!;
  const trend = 1 - r * 0.55 * x;
  switch (fam) {
    case "D":
      return 1 - r * 0.45 * x ** 1.1;
    case "V":
      return 1 - r * 0.6 * x;
    case "L":
      return trend - 0.07 * (1 - Math.exp(-x / 0.05));
    case "O":
      return 1 - r * 0.4 * x + 0.025 * Math.sin(x * Math.PI * 2 * 10);
    case "T": {
      const k = Math.floor(x * 8);
      return 1 - r * 0.35 * (k / 8) - 0.012 * ((x * 8) % 1);
    }
    case "LC": {
      const ph = (x * 10) % 1;
      const tri = ph < 0.5 ? ph / 0.5 : (1 - ph) / 0.5;
      return trend - 0.07 * tri;
    }
    case "LT":
      return 1 - r * 0.45 * x + 0.02 * Math.sin(x * Math.PI * 2 * 12);
  }
}

function curvePath(fam: IsoFam, lvl: number, until = 1, w = 280, h = 150, x0 = 34, y0 = 12): string {
  const pts: string[] = [];
  const n = 160;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * until;
    const y = Math.max(0.6, Math.min(1.05, isoCurve(fam, lvl, x)));
    const px = x0 + (w - x0 - 8) * (i / n) * until;
    const py = y0 + (h - y0 - 22) * (1 - (y - 0.6) / 0.45);
    pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return pts.join(" ");
}

function crossing(fam: IsoFam, lvl: number, target: number): number | null {
  const n = 400;
  for (let i = 1; i <= n; i++) {
    const x = i / n;
    if (isoCurve(fam, lvl, x) <= target) return x;
  }
  return null;
}

/** Normalised-PCE chart. Always marked as illustrative: the curves are shapes, not data. */
export function PerformanceChart({
  lines,
  progress = 1,
  showMetrics = false,
}: {
  lines: { fam: IsoFam; lvl: number; color: string; label: string }[];
  progress?: number;
  showMetrics?: boolean;
}) {
  const locale = useSim((s) => s.locale);
  const w = 280;
  const h = 150;
  const x0 = 34;
  const y0 = 12;
  const py = (v: number) => y0 + (h - y0 - 22) * (1 - (v - 0.6) / 0.45);
  const px = (x: number) => x0 + (w - x0 - 8) * x;
  return (
    <figure className="c5-fig c5-chart">
      <div className="c5-warn" role="note">
        {tr(locale, ISO_TEXT.illustrative)}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={tr(locale, t("PCE chuẩn hóa theo thời gian thử (minh họa)", "Normalised PCE versus test time (illustrative)"))}>
        {[0.6, 0.8, 1.0].map((v) => (
          <g key={v}>
            <line className="grid" x1={x0} x2={w - 8} y1={py(v)} y2={py(v)} />
            <text x={x0 - 4} y={py(v) + 3} textAnchor="end" className="tx">{v.toFixed(1)}</text>
          </g>
        ))}
        <line className="ref" x1={x0} x2={w - 8} y1={py(0.95)} y2={py(0.95)} />
        <text x={w - 10} y={py(0.95) - 2} textAnchor="end" className="tx">T95</text>
        <line className="ref" x1={x0} x2={w - 8} y1={py(0.8)} y2={py(0.8)} />
        <text x={w - 10} y={py(0.8) - 2} textAnchor="end" className="tx">T80</text>
        <line className="ax" x1={x0} y1={py(0.6)} x2={w - 8} y2={py(0.6)} />
        <line className="ax" x1={x0} y1={py(1.05)} x2={x0} y2={py(0.6)} />
        <text x={x0} y={h - 6} className="tx">{tr(locale, t("bắt đầu", "start"))}</text>
        <text x={w - 8} y={h - 6} textAnchor="end" className="tx">{tr(locale, t("thời gian thử (thang minh họa) →", "test time (illustrative scale) →"))}</text>
        <text x="2" y={y0 + 4} className="tx">PCE</text>
        <text x="2" y={y0 + 13} className="tx">/ PCE₀</text>
        {lines.map((l, i) => (
          <path key={`${l.fam}${l.lvl}${i}`} d={curvePath(l.fam, l.lvl, progress, w, h, x0, y0)} fill="none" stroke={l.color} strokeWidth="2" strokeDasharray={i > 0 ? "5 3" : undefined} className="c5-curve" />
        ))}
        {showMetrics
          ? lines.map((l, i) => {
              const c80 = crossing(l.fam, l.lvl, 0.8);
              return c80 !== null ? (
                <g key={`m${i}`}>
                  <line x1={px(c80)} x2={px(c80)} y1={py(0.8)} y2={py(0.6)} stroke={l.color} strokeDasharray="2 2" />
                  <circle cx={px(c80)} cy={py(0.8)} r="3" fill={l.color} />
                </g>
              ) : null;
            })
          : null}
      </svg>
      <figcaption>
        {lines.map((l, i) => (
          <span key={i} className="c5-leg">
            <i style={{ background: l.color }} />
            {tr(locale, l.label)}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

function ProtocolTable({ fam, lvl }: { fam: IsoFam; lvl: number }) {
  const locale = useSim((s) => s.locale);
  const f = ISO_FAMILIES.find((x) => x.fam === fam) ?? ISO_FAMILIES[2]!;
  return (
    <div className="lead-table-wrap c5-table">
      <table className="lead-table">
        <thead>
          <tr>
            <th>{tr(locale, ISO_HEAD.id)}</th>
            <th>{tr(locale, ISO_HEAD.light)}</th>
            <th>{tr(locale, ISO_HEAD.temp)}</th>
            <th>{tr(locale, ISO_HEAD.rh)}</th>
            <th>{tr(locale, ISO_HEAD.env)}</th>
            <th>{tr(locale, ISO_HEAD.load)}</th>
          </tr>
        </thead>
        <tbody>
          {f.rows.map((r, i) => (
            <tr key={r.id} className={i + 1 === lvl ? "c5-row on" : "c5-row"}>
              <th scope="row">ISOS-{r.id}</th>
              <td>{tr(locale, r.light)}</td>
              <td>{tr(locale, r.temp)}</td>
              <td>{tr(locale, r.rh)}</td>
              <td>{tr(locale, r.env)}</td>
              <td>{tr(locale, r.load)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="c5-note">
        {tr(locale, t("Chép từ Bảng 1 của tuyên bố đồng thuận. Bảng không ghi sẵn thời lượng: người làm thí nghiệm chọn và phải báo cáo.", "Copied from Table 1 of the consensus statement. The table gives no fixed duration: the experimenter chooses it and must report it."))} <RichText text="[38]" />
      </p>
    </div>
  );
}

const RECORD = [
  t("PCE ban đầu", "Initial PCE"),
  t("Công suất cực đại ban đầu", "Initial maximum power"),
  t("Nhiệt độ thử", "Test temperature"),
  t("Cường độ và phổ ánh sáng", "Light intensity and spectrum"),
  t("Độ ẩm tương đối", "Relative humidity"),
  t("Tình trạng đóng gói", "Encapsulation status"),
  t("Diện tích và loại thiết bị", "Device area and type"),
];

function RecordCard({ fam, lvl }: { fam: IsoFam; lvl: number }) {
  const locale = useSim((s) => s.locale);
  const f = ISO_FAMILIES.find((x) => x.fam === fam) ?? ISO_FAMILIES[2]!;
  const row = f.rows[lvl - 1] ?? f.rows[0]!;
  const val: string[] = [
    t("do trước khi lão hóa; tác giả báo cáo", "measured before ageing; authors report it"),
    t("đo cùng lúc; tác giả báo cáo", "measured at the same time; authors report it"),
    row.temp,
    row.light,
    row.rh,
    t("có hay không, và chi tiết; tác giả báo cáo", "yes or no, and details; authors report it"),
    t("tác giả báo cáo", "authors report it"),
  ];
  return (
    <article className="c5-card">
      <h4>{tr(locale, t("Bản ghi tại t = 0", "Record at t = 0"))}</h4>
      <dl>
        {RECORD.map((r, i) => (
          <div key={r}>
            <dt>{tr(locale, r)}</dt>
            <dd>{tr(locale, val[i]!)}</dd>
          </div>
        ))}
      </dl>
      <p className="c5-note">
        {tr(locale, t("Ví dụ điền theo giao thức đang chọn (ISOS-", "Pre-filled from the protocol currently chosen (ISOS-"))}
        {row.id}
        {"). "}
        {tr(locale, t("Hiệu suất ban đầu khác độ bền lâu dài.", "Initial efficiency is not long-term stability."))} <RichText text="[38]" />
      </p>
    </article>
  );
}

function Checklist() {
  const { fab, set } = useFab();
  const locale = useSim((s) => s.locale);
  const raw = String(fab.chk ?? "").padEnd(CHECKLIST.length, "0");
  const cycle = (i: number) => {
    const next = ({ "0": "1", "1": "2", "2": "0" } as Record<string, string>)[raw[i]!] ?? "0";
    set("chk", raw.slice(0, i) + next + raw.slice(i + 1));
  };
  const n1 = [...raw].filter((c) => c === "1").length;
  const n2 = [...raw].filter((c) => c === "2").length;
  const label: Record<string, string> = {
    "0": t("chưa kiểm", "unchecked"),
    "1": t("đã báo cáo", "reported"),
    "2": t("không báo cáo", "not reported"),
  };
  return (
    <div className="c5-check">
      <p className="c5-note">{tr(locale, t("Đọc một bài báo và bấm từng mục: chưa kiểm → đã báo cáo → không báo cáo.", "Read a paper and click each item: unchecked → reported → not reported."))}</p>
      <ul>
        {CHECKLIST.map((it, i) => (
          <li key={it.id}>
            <button type="button" className={`c5-ck c5-ck-${raw[i]}`} onClick={() => cycle(i)} aria-label={`${tr(locale, it.name)}: ${tr(locale, label[raw[i]!]!)}`}>
              <span className="c5-ck-mark" aria-hidden="true">{raw[i] === "1" ? "✓" : raw[i] === "2" ? "–" : ""}</span>
              <span>
                <b>{tr(locale, it.name)}</b>
                <small>{tr(locale, it.why)}</small>
              </span>
              <em>{tr(locale, label[raw[i]!]!)}</em>
            </button>
          </li>
        ))}
      </ul>
      <p className="c5-note">
        <b>
          {n1} {tr(locale, t("đã báo cáo", "reported"))} · {n2} {tr(locale, t("không báo cáo", "not reported"))}
        </b>
        {" — "}
        {tr(locale, t("“Không báo cáo” không làm bài báo vô giá trị; nó chỉ hạn chế khả năng tái lập và so sánh trực tiếp.", "“Not reported” does not make a paper invalid; it only limits reproducibility and direct comparison."))} <RichText text="[38]" />
      </p>
    </div>
  );
}

function VsQualification() {
  const locale = useSim((s) => s.locale);
  return (
    <div className="c5-arch">
      <article className="c5-card good">
        <h4>{tr(locale, ISO_TEXT.qualL)}</h4>
        <ul>
          {ISO_TEXT.qualLItems.map((x) => (
            <li key={x}>{tr(locale, x)}</li>
          ))}
        </ul>
      </article>
      <article className="c5-card">
        <h4>{tr(locale, ISO_TEXT.qualR)}</h4>
        <ul>
          {ISO_TEXT.qualRItems.map((x) => (
            <li key={x}>{tr(locale, x)}</li>
          ))}
        </ul>
      </article>
      <p className="c5-note">
        <b>{tr(locale, ISO_TEXT.notCert)}</b> <RichText text="[38]" />
      </p>
    </div>
  );
}

const TAB_DEFAULT = ["setup", "setup", "setup", "chart", "chart", "chart", "chart", "vs"];

function IsosColumn({ step }: { step: number }) {
  const { fab } = useFab();
  const locale = useSim((s) => s.locale);
  const [tab, setTab] = useState(TAB_DEFAULT[step] ?? "setup");
  useEffect(() => setTab(TAB_DEFAULT[step] ?? "setup"), [step]);
  const fam = (String(fab.iso ?? "L") as IsoFam) || "L";
  const lvl = Number(fab.lvl ?? 2) || 2;
  const f = ISO_FAMILIES.find((x) => x.fam === fam) ?? ISO_FAMILIES[2]!;
  const row = f.rows[lvl - 1] ?? f.rows[0]!;
  const tabs: [string, string][] = [
    ["setup", t("Điều kiện thử", "Test conditions")],
    ["chart", t("Biểu đồ", "Chart")],
    ["check", t("Danh sách báo cáo", "Reporting checklist")],
    ["vs", t("ISOS và chứng nhận", "ISOS vs qualification")],
  ];
  const compare = step === 6;
  const lines = useMemo(
    () =>
      compare
        ? [
            { fam: "L" as IsoFam, lvl: 2, color: "#ffd36a", label: t("Mẫu A · ISOS-L-2 (minh họa)", "Sample A · ISOS-L-2 (illustrative)") },
            { fam: "D" as IsoFam, lvl: 3, color: "#79b0ff", label: t("Mẫu B · ISOS-D-3 (minh họa)", "Sample B · ISOS-D-3 (illustrative)") },
          ]
        : [{ fam, lvl, color: "#ffd36a", label: t(`ISOS-${row.id} (minh họa)`, `ISOS-${row.id} (illustrative)`) }],
    [compare, fam, lvl, row.id],
  );
  return (
    <>
      <div className="c5-tabs" role="tablist">
        {tabs.map(([id, name]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "c5-tab on" : "c5-tab"} onClick={() => setTab(id)}>
            {tr(locale, name)}
          </button>
        ))}
      </div>
      {tab === "setup" ? (
        <>
          <article className="c5-card">
            <h4>{tr(locale, f.name)}</h4>
            <p>{tr(locale, f.what)}</p>
            <p className="c5-note">
              <b>{tr(locale, ISO_TEXT.isosName)}.</b> {tr(locale, ISO_TEXT.isosWhat)}
            </p>
          </article>
          {step === 0 ? <RecordCard fam={fam} lvl={lvl} /> : <ProtocolTable fam={fam} lvl={lvl} />}
          {step >= 2 ? (
            <p className="c5-note">
              {tr(locale, t("Biến áp dụng cho nhóm này: ánh sáng, nhiệt độ, độ ẩm, môi trường, tải điện. Thời lượng do người làm thí nghiệm chọn và báo cáo.", "Variables that apply to this group: light, temperature, humidity, environment, electrical load. Duration is chosen by the experimenter and reported."))}
            </p>
          ) : null}
        </>
      ) : null}
      {tab === "chart" ? (
        <>
          <PerformanceChart lines={lines} showMetrics={step >= 5} />
          <p className="c5-note">
            {tr(locale, t("Trục dọc: PCE chuẩn hóa, 1,0 = 100% giá trị tham chiếu (ở đây là PCE ban đầu). Hình dạng đường cong chỉ minh họa kiểu hành vi của nhóm thử này, không phải kết quả của bài nào.", "Vertical axis: normalised PCE, 1.0 = 100% of the reference value (here the initial PCE). The shape only illustrates the kind of behaviour this group reveals; it is not any paper's result."))} <RichText text="[38]" />
          </p>
          {step >= 5 ? (
            <article className="c5-card">
              <h4>{tr(locale, t("Chỉ số độ bền", "Stability metrics"))}</h4>
              <dl>
                <dt>T80</dt>
                <dd>{tr(locale, t("Thời gian để chỉ số đã chọn (ví dụ PCE) còn 80% giá trị tham chiếu đã xác định, từ t = 0.", "Time for the chosen metric (e.g. PCE) to fall to 80% of its defined reference value, from t = 0."))}</dd>
                <dt>TS80</dt>
                <dd>{tr(locale, t("Như T80 nhưng tính từ một mốc khác (cực đại, hoặc cuối giai đoạn burn-in).", "Like T80 but counted from another point (the maximum, or the end of burn-in)."))}</dd>
                <dt>T95</dt>
                <dd>{tr(locale, t("Tương tự cho 95%.", "The same for 95%."))}</dd>
                <dt>η₁₀₀₀</dt>
                <dd>{tr(locale, t("Nếu chưa tới T80, báo cáo mức giảm sau 1000 giờ.", "If T80 is not reached, report the decrease after 1000 h."))}</dd>
              </dl>
              <p className="c5-note">
                {tr(locale, t("Không suy ra tuổi thọ vận hành từ một phép thử ngắn nếu không có mô hình được chứng minh.", "Do not infer an operating lifetime from a short test without a justified model."))} <RichText text="[38]" />
              </p>
            </article>
          ) : null}
        </>
      ) : null}
      {tab === "check" ? <Checklist /> : null}
      {tab === "vs" ? <VsQualification /> : null}
    </>
  );
}

/* ───────────────────────── 5.5 ───────────────────────── */

function FinColumn({ step }: { step: number }) {
  const locale = useSim((s) => s.locale);
  return (
    <ol className="c5-stages">
      {FIN_STAGES.map((s, i) => (
        <li key={s.n} className={step === i ? "on" : step > i || step === 4 ? "seen" : ""}>
          <b>
            {s.n}. {tr(locale, s.name)}
          </b>
          <span>{tr(locale, s.sub)}</span>
        </li>
      ))}
      <li className={step === 4 ? "on loop" : "loop"}>
        <b>↻ {tr(locale, t("Thiết kế lại dựa trên bằng chứng", "Evidence-based redesign"))}</b>
      </li>
    </ol>
  );
}

/* ───────────────────────── the column ───────────────────────── */

/** Steps whose content lives in the column: it opens by itself when they start. */
const PANEL_STEPS: Record<string, number[]> = { pin: [], stack: [], why: [2, 6], verify: [0, 1, 2, 3, 4, 5, 6, 7], c5fin: [0, 1, 2, 3, 4] };

export function Ch5Panel({ spec, step }: { spec: StorySpec; step: number }) {
  const locale = useSim((s) => s.locale);
  const open = useSim((s) => s.fab.panel !== "closed");
  const setOpen = (v: boolean) => useSim.setState({ fab: { ...useSim.getState().fab, panel: v ? "open" : "closed" } });
  useEffect(() => {
    if (PANEL_STEPS[spec.id]?.includes(step)) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.id, step]);
  return (
    <>
      <button type="button" className="btn c5-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        {tr(locale, spec.id === "pin" ? (open ? C5.hideTable : C5.table) : spec.id === "stack" ? (open ? C5.hideLook : C5.look) : open ? C5.hideDetails : C5.details)}
      </button>
      {open ? (
        <aside className={spec.id === "pin" || spec.id === "stack" ? "c5-panel c5-full" : spec.id === "why" && step === 6 ? "c5-panel c5-wide" : "c5-panel"} aria-label={tr(locale, C5.details)}>
          <ul className="c5-legend">
            {spec.legend.map((l) => (
              <li key={l.label}>
                <i className={`swatch swatch-${l.swatch}`} aria-hidden="true" />
                {tr(locale, l.label)}
              </li>
            ))}
          </ul>
          {spec.id === "pin" || spec.id === "stack" ? <DeviceColumn spec={spec} step={step} /> : null}
          {spec.id === "why" ? <MaterialColumn step={step} /> : null}
          {spec.id === "verify" ? <IsosColumn step={step} /> : null}
          {spec.id === "c5fin" ? <FinColumn step={step} /> : null}
        </aside>
      ) : null}
    </>
  );
}

/** The compact scientific-facts panel of a Chapter 5 section. */
export function FactsPanel5({ spec, onClose }: { spec: StorySpec; onClose: () => void }) {
  const locale = useSim((s) => s.locale);
  return (
    <section className="facts-panel" aria-label={tr(locale, C5.facts)}>
      <div className="cite-card-head">
        <span className="kicker">{tr(locale, C5.facts)}</span>
        <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>
      <dl>
        {(spec.factList ?? []).map((r) => (
          <div key={r.k}>
            <dt>{tr(locale, r.k)}</dt>
            <dd>{tr(locale, r.v)}</dd>
          </div>
        ))}
      </dl>
      {spec.factRefs?.length ? (
        <p className="story-cites">
          <b>{tr(locale, C5.sources)}:</b> <RichText text={cites(spec.factRefs)} />
        </p>
      ) : null}
    </section>
  );
}
