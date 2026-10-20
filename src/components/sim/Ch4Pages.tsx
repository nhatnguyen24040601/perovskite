import { ArrowLeft, ExternalLink, X } from "lucide-react";
import { REFS } from "@/lib/sim/content";
import { tr } from "@/lib/sim/i18n";
import { EVIDENCE_LABEL, KIND_LABEL, sourceOf } from "@/lib/sim/sources";
import { t, type Facts, type StorySpec } from "@/lib/sim/story";
import { C4, GROUPS, LANDING, SUMMARY } from "@/lib/sim/story4";
import { useSim } from "@/lib/sim/store";
import { RichText } from "./RichText";

/* ───────────────────────── citation card ───────────────────────── */

const CARD = {
  by: t("Tác giả / tổ chức", "Author / organisation"),
  date: t("Ngày", "Date"),
  journal: t("Tạp chí / nhà xuất bản", "Journal / publisher"),
  evidence: t("Loại bằng chứng", "Kind of evidence"),
  kind: t("Loại nguồn", "Source type"),
  link: t("DOI / địa chỉ gốc", "DOI / original URL"),
  claim: t("Nguồn này hỗ trợ", "What this source supports"),
  note: t("Ghi chú kiểm tra", "Verification note"),
  plain: t("Mục trong thư mục tài liệu", "Entry in the bibliography"),
};

/** The popup that opens when a [n] citation is clicked. */
export function CiteCard() {
  const n = useSim((s) => s.cite);
  const locale = useSim((s) => s.locale);
  if (n === null) return null;
  const src = sourceOf(n);
  const ref = REFS.find((r) => r.n === String(n));
  const close = () => useSim.setState({ cite: null });
  return (
    <div className="cite-card" role="dialog" aria-label={`[${n}]`}>
      <div className="cite-card-head">
        <span className="kicker">[{n}]</span>
        <button type="button" className="btn btn-icon" onClick={close} aria-label="Close">
          <X size={14} />
        </button>
      </div>
      {src ? (
        <>
          <strong>{src.title}</strong>
          <dl>
            <dt>{tr(locale, CARD.by)}</dt>
            <dd>{src.by}</dd>
            <dt>{tr(locale, CARD.date)}</dt>
            <dd>{src.date}</dd>
            {src.journal ? (
              <>
                <dt>{tr(locale, CARD.journal)}</dt>
                <dd>{src.journal}</dd>
              </>
            ) : null}
            <dt>{tr(locale, CARD.kind)}</dt>
            <dd>
              <span className={`src-badge src-${src.kind}`}>{tr(locale, KIND_LABEL[src.kind])}</span>
            </dd>
            {src.evidence ? (
              <>
                <dt>{tr(locale, CARD.evidence)}</dt>
                <dd>{tr(locale, EVIDENCE_LABEL[src.evidence])}</dd>
              </>
            ) : null}
            <dt>{tr(locale, CARD.link)}</dt>
            <dd>
              <a href={src.url} target="_blank" rel="noreferrer">
                {src.doi ? `doi:${src.doi}` : src.url} <ExternalLink size={11} />
              </a>
            </dd>
            <dt>{tr(locale, CARD.claim)}</dt>
            <dd>{tr(locale, src.supports)}</dd>
            {src.note ? (
              <>
                <dt>{tr(locale, CARD.note)}</dt>
                <dd>{tr(locale, src.note)}</dd>
              </>
            ) : null}
          </dl>
        </>
      ) : (
        <>
          <span className="kicker">{tr(locale, CARD.plain)}</span>
          <p>{ref ? tr(locale, ref.cite) : `[${n}]`}</p>
        </>
      )}
    </div>
  );
}

/* ───────────────────────── facts panel ───────────────────────── */

export function FactsPanel({ facts, onClose }: { facts: Facts; onClose: () => void }) {
  const locale = useSim((s) => s.locale);
  const rows: [string, string][] = [
    [C4.inputs, facts.inputs],
    [C4.equipment, facts.equipment],
    [C4.process, facts.process],
    [C4.result, facts.result],
    [C4.pros, facts.pros],
    [C4.cons, facts.cons],
    [C4.scale, facts.scale],
  ];
  return (
    <section className="facts-panel" aria-label={tr(locale, C4.facts)}>
      <div className="cite-card-head">
        <span className="kicker">{tr(locale, C4.facts)}</span>
        <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{tr(locale, k)}</dt>
            <dd>{tr(locale, v)}</dd>
          </div>
        ))}
        <div>
          <dt>{tr(locale, C4.sources)}</dt>
          <dd>
            <RichText text={facts.refs.map((n) => `[${n}]`).join(" ")} />
          </dd>
        </div>
      </dl>
    </section>
  );
}

/* ───────────────────────── chapter overview ───────────────────────── */

export function Ch4Landing() {
  const locale = useSim((s) => s.locale);
  const setLesson = useSim((s) => s.setLesson);
  return (
    <div className="page-scroll">
      <div className="page-inner">
        <p className="page-lead">{tr(locale, LANDING.lead)}</p>
        <div className="page-note">
          <strong>{tr(locale, LANDING.distinct)}</strong>
          <ul>
            {LANDING.notes.map((n) => (
              <li key={n}>{tr(locale, n)}</li>
            ))}
          </ul>
        </div>
        {GROUPS.map((g) => (
          <section key={g.title} className="page-group">
            <h2>{tr(locale, g.title)}</h2>
            <div className="page-cards">
              {g.cards.map((c) => (
                <button key={c.id} type="button" className="page-card" onClick={() => setLesson(c.id)}>
                  <span className="page-card-icon" aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className="page-card-num">{c.num}</span>
                  <strong>{tr(locale, c.name)}</strong>
                  <span>{tr(locale, c.line)}</span>
                  <span className="page-card-kind">{tr(locale, c.kind)}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
        <button type="button" className="btn btn-accent" onClick={() => setLesson("c4sum")}>
          {tr(locale, C4_SUM_LINK)}
        </button>
      </div>
    </div>
  );
}

const C4_SUM_LINK = t("Xem tổng kết chương", "See the chapter synthesis");

/* ───────────────────────── chapter synthesis ───────────────────────── */

const KIND_CLASS: Record<string, string> = { table: "src-table", company: "src-company", forecast: "src-forecast" };
const KIND_NAME: Record<string, string> = {
  table: t("Bảng hiệu suất", "Efficiency table"),
  company: t("Thông cáo công ty", "Company announcement"),
  forecast: t("Dự báo", "Forecast"),
};

export function Ch4Summary() {
  const locale = useSim((s) => s.locale);
  const setLesson = useSim((s) => s.setLesson);
  return (
    <div className="page-scroll">
      <div className="page-inner page-three">
        <section className="page-panel">
          <h2>{tr(locale, SUMMARY.a)}</h2>
          <ul className="route-list">
            {SUMMARY.routes.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => setLesson(r.id)}>
                  <span aria-hidden="true">{r.icon}</span>
                  <span>
                    <b>{tr(locale, r.name)}</b> — {tr(locale, r.line)}
                    <em>{tr(locale, r.kind)}</em>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="page-foot">{tr(locale, SUMMARY.noBest)}</p>
        </section>
        <section className="page-panel">
          <h2>{tr(locale, SUMMARY.b)}</h2>
          <ol className="ladder">
            {SUMMARY.ladder.map((r) => (
              <li key={r.label}>
                <span className="ladder-val">{r.val}</span>
                <span>
                  <b>{tr(locale, r.label)}</b>
                  <small>{tr(locale, r.note)}</small>
                </span>
                <span className={`src-badge ${KIND_CLASS[r.kind] ?? ""}`}>{tr(locale, KIND_NAME[r.kind] ?? r.kind)}</span>
              </li>
            ))}
          </ol>
          <p className="page-foot">{tr(locale, SUMMARY.bnote)}</p>
          <p className="page-foot">
            <RichText text="[2] [5] [87] [92]" />
          </p>
        </section>
        <section className="page-panel">
          <h2>{tr(locale, SUMMARY.c)}</h2>
          <ul className="sum-list">
            {SUMMARY.cItems.map((c) => (
              <li key={c}>{tr(locale, c)}</li>
            ))}
          </ul>
          <p className="page-closing">{tr(locale, SUMMARY.closing)}</p>
          <p className="page-foot">
            <RichText text="[93] [94] [96] [97] [98]" />
          </p>
        </section>
      </div>
    </div>
  );
}

/* ───────────────────────── 4.6 market panels ───────────────────────── */

const MK = {
  timeline: t("Dòng thời gian", "Timeline"),
  cell: t("TẾ BÀO", "CELL"),
  module: t("MODULE", "MODULE"),
  ship: t("LÔ HÀNG", "SHIPMENT"),
  forecast: t("DỰ BÁO", "FORECAST"),
  ann: t("Thông cáo công ty", "Company announcement"),
  cert: t("Chứng nhận độc lập", "Independent certification"),
  table: t("Có trong bảng tham chiếu", "In a reference table"),
  measured: t("Hiệu năng thương mại đo được", "Measured commercial performance"),
  yes: t("có", "yes"),
  no: t("không", "no"),
  stated: t("công ty nói có", "stated by the company"),
  na: t("không áp dụng", "n/a"),
  warnTitle: t("Lưu ý khi đọc kỷ lục", "Reading records carefully"),
  warn: t(
    "Kỷ lục tế bào nghiên cứu, kỷ lục module, tình trạng chứng nhận và việc có trong bảng tham chiếu là các sự thật khác nhau. Luôn kiểm tra diện tích thiết bị, phòng đo và ngày nguồn.",
    "Research-cell record, module record, certification status, and inclusion in reference tables are different facts. Always check device area, test laboratory, and source date.",
  ),
  forecastNote: t("Dự báo của IDTechEx — không phải doanh thu thị trường đã quan sát.", "IDTechEx forecast — not observed market revenue."),
  schematic: t(
    "Đường nét đứt chỉ là sơ đồ nối hiện tại với điểm dự báo duy nhất; chỉ điểm 2035 đến từ dự báo.",
    "The dashed path is only a schematic joining today to the single forecast point; only the 2035 end point comes from the forecast.",
  ),
  rep: t("Giá trị đại diện / mục tiêu, không phải bảo đảm cho mọi sản phẩm.", "Representative / target values, not a guarantee for every product."),
  silicon: t("Module silicon điển hình", "Typical silicon module"),
  tandem: t("Mục tiêu module tandem", "Tandem module target"),
  hurdles: t("Rào cản chính", "Major hurdles"),
  chip: t("Kỷ lục công bố, chưa thành sản phẩm", "Record result, not a product"),
};

const HURDLES = [
  t("Độ bền ngoài trời lâu dài", "Long-term outdoor stability"),
  t("Bảo vệ khỏi ẩm, nhiệt, ánh sáng, UV", "Moisture, heat, light and UV protection"),
  t("Năng suất và độ đồng đều sản xuất", "Manufacturing yield and uniformity"),
  t("Phủ và lắng đọng diện tích lớn", "Large-area coating and deposition"),
  t("Bọc kín và độ bền cơ học", "Encapsulation and mechanical durability"),
  t("Kiểm soát rò rỉ chì", "Lead-leakage control"),
  t("Tái chế và quản lý cuối đời", "Recycling and end-of-life management"),
  t("Chi phí sản xuất và khả năng vay vốn (bankability)", "Manufacturing cost and bankability"),
];

type Evidence = {
  date: string;
  who: string;
  kind: string;
  value: string;
  area: string;
  flags: { ann: number; cert: number | "stated"; table: number; measured: number };
  line: string;
  refs: number[];
};

const EVIDENCE: Evidence[] = [
  {
    date: t("19/6/2024", "19 Jun 2024"),
    who: "Oxford PV",
    kind: MK.module,
    value: "26.9%",
    area: t("diện tích chỉ định > 1,6 m² · 60 tế bào", "designated area > 1.6 m² · 60 cells"),
    flags: { ann: 1, cert: 1, table: 0, measured: 0 },
    line: t("Fraunhofer CalLab đo và chứng nhận độc lập.", "Independently measured and certified by Fraunhofer CalLab."),
    refs: [85],
  },
  {
    date: t("4/2025", "Apr 2025"),
    who: "LONGi",
    kind: MK.cell,
    value: "34.85%",
    area: t("diện tích không nêu trong thông cáo", "area not stated in the release"),
    flags: { ann: 1, cert: "stated", table: 0, measured: 0 },
    line: t("LONGi nói NREL đã chứng nhận. Đây là tế bào, không phải module.", "LONGi states NREL certified it. This is a cell, not a module."),
    refs: [86],
  },
  {
    date: t("8/7/2025", "8 Jul 2025"),
    who: "Caelux",
    kind: MK.ship,
    value: t("lô đầu tiên", "first order"),
    area: t("kính phủ perovskite + module silicon", "perovskite-coated glass + silicon module"),
    flags: { ann: 1, cert: 0, table: 0, measured: 0 },
    line: t(
      "Một lô giao hàng không chứng minh sản xuất hàng loạt, hiệu suất module được chứng nhận hay độ tin cậy ngoài trời.",
      "One shipment does not prove mass production, certified module efficiency or long-term field reliability.",
    ),
    refs: [87, 62],
  },
  {
    date: t("2026 · Version 68", "2026 · Version 68"),
    who: t("Bảng hiệu suất (Green và cs.)", "Efficiency tables (Green et al.)"),
    kind: "",
    value: "",
    area: "",
    flags: { ann: 0, cert: 0, table: 1, measured: 0 },
    line: "",
    refs: [2, 100],
  },
  {
    date: t("14/7/2026", "14 Jul 2026"),
    who: "LONGi",
    kind: MK.cell,
    value: "35.5%",
    area: t("diện tích không nêu trong thông cáo", "area not stated in the release"),
    flags: { ann: 1, cert: "stated", table: 0, measured: 0 },
    line: t(
      "Công ty nói ESTI chứng nhận. Chưa có trong Version 68 vì thời điểm chốt dữ liệu của bảng đó sớm hơn.",
      "The company states ESTI certified it. Not in Version 68 because that table's data cutoff came earlier.",
    ),
    refs: [88],
  },
  {
    date: "2025–2035",
    who: "IDTechEx",
    kind: MK.forecast,
    value: "≈ US$12B",
    area: t("doanh thu perovskite PV hằng năm vào 2035", "annual perovskite PV revenue by 2035"),
    flags: { ann: 0, cert: 0, table: 0, measured: 0 },
    line: "",
    refs: [92, 63],
  },
];

function Flag({ label, v }: { label: string; v: number | "stated" }) {
  const locale = useSim((s) => s.locale);
  const text = v === "stated" ? MK.stated : v ? MK.yes : MK.no;
  return (
    <li className={v === 1 ? "yes" : v === "stated" ? "mid" : "no"}>
      <span>{tr(locale, label)}</span>
      <b>{tr(locale, text)}</b>
    </li>
  );
}

const TIMELINE = [
  t("6/2024", "Jun 2024"),
  t("4/2025", "Apr 2025"),
  t("7/2025", "Jul 2025"),
  t("2026", "2026"),
  t("7/2026", "Jul 2026"),
  t("→ 2035", "→ 2035"),
];

function ForecastChart() {
  const locale = useSim((s) => s.locale);
  return (
    <figure className="mk-chart">
      <svg viewBox="0 0 260 120" role="img" aria-label={tr(locale, MK.forecastNote)}>
        <line x1="26" y1="100" x2="250" y2="100" className="ax" />
        <line x1="26" y1="10" x2="26" y2="100" className="ax" />
        <path d="M30 96 C 110 96, 180 70, 238 18" className="fc" />
        <circle cx="30" cy="96" r="3.5" className="dot-obs" />
        <circle cx="238" cy="18" r="4.5" className="dot-fc" />
        <text x="30" y="113" className="tx">2025</text>
        <text x="218" y="113" className="tx">2035</text>
        <text x="152" y="22" className="tx tx-fc">≈ US$12B</text>
      </svg>
      <figcaption>
        <b>{tr(locale, MK.forecastNote)}</b> <RichText text="[92] [63]" />
        <br />
        {tr(locale, MK.schematic)}
      </figcaption>
    </figure>
  );
}

/** Right-hand evidence column of 4.6. */
export function MarketPanel({ step }: { step: number }) {
  const locale = useSim((s) => s.locale);
  const scope = useSim((s) => s.fab.scope);
  const setStep = useSim((s) => s.setStep);
  const ev = EVIDENCE[step] ?? EVIDENCE[0]!;
  return (
    <aside className="mk-panel" aria-label={tr(locale, MK.timeline)}>
      <ol className="mk-timeline" aria-label={tr(locale, MK.timeline)}>
        {TIMELINE.map((d, i) => (
          <li key={d} className={i === step ? "on" : i < step ? "seen" : ""}>
            <button type="button" onClick={() => setStep(i)} aria-label={tr(locale, d)}>
              <i />
              <span>{tr(locale, d)}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mk-card">
        {step === 3 ? (
          <>
            <div className="mk-head">
              <b>{tr(locale, ev.date)}</b>
              <span>{tr(locale, ev.who)}</span>
            </div>
            <ul className="mk-rows">
              {(scope === "module"
                ? [[MK.module, "29.4%", t("tandem · ≈ 1,7 m²", "tandem · ≈ 1.7 m²")]]
                : [
                    [MK.cell, "28.0%", t("perovskite chì halide · 0,05 cm²", "lead-halide perovskite · 0.05 cm²")],
                    [MK.cell, "35.2%", t("tandem Si/perovskite · 1 cm²", "Si/perovskite tandem · 1 cm²")],
                  ]
              ).map(([k, v, a]) => (
                <li key={`${k}${v}`}>
                  <span className="mk-kind">{tr(locale, k as string)}</span>
                  <strong>{v}</strong>
                  <small>{tr(locale, a as string)}</small>
                </li>
              ))}
            </ul>
            <p className="mk-line">
              {scope === "module"
                ? tr(locale, t("Cũng có module tandem nhỏ 0,17 m² đạt 31,4%. Phòng đo xem trong bảng gốc.", "A smaller 0.17 m² tandem module is listed at 31.4%. The test laboratory is in the original table."))
                : tr(locale, t("Không so trực tiếp với kết quả module: khác diện tích hàng chục nghìn lần.", "Do not compare directly with a module result: the areas differ by orders of magnitude."))}
            </p>
          </>
        ) : step === 5 ? null : (
          <>
            <div className="mk-head">
              <b>{tr(locale, ev.date)}</b>
              <span>{tr(locale, ev.who)}</span>
              <span className="mk-kind">{tr(locale, ev.kind)}</span>
            </div>
            <strong className="mk-value">{tr(locale, ev.value)}</strong>
            <small>{tr(locale, ev.area)}</small>
            <p className="mk-line">{tr(locale, ev.line)}</p>
          </>
        )}
        {step !== 5 ? (
          <ul className="mk-flags">
            <Flag label={MK.ann} v={ev.flags.ann} />
            <Flag label={MK.cert} v={ev.flags.cert} />
            <Flag label={MK.table} v={ev.flags.table} />
          </ul>
        ) : null}
        <p className="mk-cite">
          <RichText text={ev.refs.map((n) => `[${n}]`).join(" ")} />
        </p>
      </div>
      {step === 4 ? (
        <div className="mk-warn" role="note">
          <b>{tr(locale, MK.warnTitle)}</b>
          <p>{tr(locale, MK.warn)}</p>
        </div>
      ) : null}
      {step === 5 ? (
        <>
          <div className="mk-card">
            <div className="mk-head">
              <b>{tr(locale, MK.silicon)}</b> <span>≈ 22–24%</span>
              <b>{tr(locale, MK.tandem)}</b> <span>→ ≈ 30%</span>
            </div>
            <p className="mk-line">{tr(locale, MK.rep)}</p>
            <p className="mk-cite">
              <RichText text="[91]" />
            </p>
          </div>
          <div className="mk-card">
            <b className="mk-hurdle-title">{tr(locale, MK.hurdles)}</b>
            <ul className="mk-hurdles">
              {HURDLES.map((h) => (
                <li key={h}>{tr(locale, h)}</li>
              ))}
            </ul>
          </div>
          <ForecastChart />
        </>
      ) : null}
    </aside>
  );
}

/* ───────────────────────── 4.9 tables and tabs ───────────────────────── */

const LEAD_TABS = [
  { id: "lead", name: t("A · Vật liệu", "A · Materials") },
  { id: "leadmit", name: t("B · Giảm rủi ro", "B · Mitigation") },
  { id: "leadcmp", name: t("C · So sánh thiết kế", "C · Compare designs") },
];

export function LeadTabs({ current }: { current: string }) {
  const locale = useSim((s) => s.locale);
  const setLesson = useSim((s) => s.setLesson);
  return (
    <div className="story-tabs" role="tablist" aria-label="4.9">
      {LEAD_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === current}
          className={tab.id === current ? "btn on" : "btn"}
          onClick={(e) => {
            setLesson(tab.id);
            e.currentTarget.blur();
          }}
        >
          {tr(locale, tab.name)}
        </button>
      ))}
    </div>
  );
}

const FAMILIES = [
  { id: "pb", name: t("Perovskite chì", "Pb-based") },
  { id: "snpb", name: t("Sn–Pb hỗn hợp", "Mixed Sn–Pb") },
  { id: "sn", name: t("Chỉ thiếc", "Sn-only") },
  { id: "dbl", name: "Cs₂AgBiBr₆" },
];

const LEAD_ROWS: { dim: string; cells: string[] }[] = [
  {
    dim: t("Có chứa chì?", "Contains lead?"),
    cells: [t("Có", "Yes"), t("Có", "Yes"), t("Không", "No"), t("Không", "No")],
  },
  {
    dim: t("Hàm lượng chì tương đối", "Relative lead content"),
    cells: [t("Mốc so sánh", "Reference"), t("Giảm", "Reduced"), t("Không có", "None"), t("Không có", "None")],
  },
  {
    dim: t("Độ trưởng thành hiệu suất", "Efficiency maturity"),
    cells: [t("Mạnh", "Strong"), t("Tiềm năng nghiên cứu mạnh", "Strong research potential"), t("Đang phát triển", "Developing"), t("Đang phát triển", "Developing")],
  },
  {
    dim: t("Thách thức hóa học chính", "Main chemical challenge"),
    cells: [
      t("Giữ chì và độ ổn định vật liệu", "Lead containment and material stability"),
      t("Oxy hóa Sn và chì còn lại", "Sn oxidation plus residual Pb"),
      t("Oxy hóa Sn và kiểm soát khuyết tật", "Sn oxidation and defect control"),
      t("Vùng cấm/hấp thụ và vận chuyển điện tích", "Bandgap/absorption and charge-transport limitations"),
    ],
  },
  {
    dim: t("Cân nhắc môi trường chính", "Main environmental consideration"),
    cells: [
      t("Chì có thể rò rỉ; xử lý chất thải", "Potential Pb leakage and waste handling"),
      t("Giảm nhưng chưa loại bỏ mối lo về chì", "Reduced but not eliminated Pb concern"),
      t("Không có Pb trong lớp hấp thụ, nhưng vẫn đánh giá tác động khác", "No Pb in the absorber, but assess other impacts"),
      t("Không Pb, nhưng vẫn đánh giá toàn bộ vòng đời vật liệu", "No Pb, but still assess the full material lifecycle"),
    ],
  },
  {
    dim: t("Vai trò hiện nay", "Current role"),
    cells: [
      t("Dẫn đầu hiệu suất và phát triển tandem", "Leading efficiency and tandem development"),
      t("Nghiên cứu vùng cấm hẹp và tandem", "Narrow-bandgap and tandem research"),
      t("Nghiên cứu hấp thụ không chì", "Lead-free absorber research"),
      t("Nghiên cứu thay thế không chì", "Lead-free alternative research"),
    ],
  },
];

const LEAD_NOTE = t(
  "Bảng định tính, không thay cho chuẩn so sánh theo tài liệu. Chưa có con số hiệu suất nào được đưa vào vì mỗi số cần nêu loại linh kiện, diện tích hoạt động, cơ sở đo và ngày nguồn.",
  "A qualitative comparison, not a literature-backed benchmark. No efficiency numbers are shown because every number would need device type, active area, measurement basis and source date.",
);

export function LeadTable({ pick, foot }: { pick: string; foot?: string }) {
  const locale = useSim((s) => s.locale);
  return (
    <div className="lead-table-wrap">
      <table className="lead-table">
        <thead>
          <tr>
            <th />
            {FAMILIES.map((f) => (
              <th key={f.id} className={pick === f.id ? "on" : ""}>
                {tr(locale, f.name)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LEAD_ROWS.map((r) => (
            <tr key={r.dim}>
              <th scope="row">{tr(locale, r.dim)}</th>
              {r.cells.map((c, i) => (
                <td key={c + i} className={pick === FAMILIES[i]!.id ? "on" : ""}>
                  {tr(locale, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lead-note">
        {tr(locale, LEAD_NOTE)} <RichText text="[96] [97] [98] [99]" />
      </p>
      {foot ? <p className="lead-foot">{tr(locale, foot)}</p> : null}
    </div>
  );
}

const DESIGN_ROWS: { q: string; cells: [string, string, string]; level: [number, number, number] }[] = [
  {
    q: t("Nước có tới lớp hấp thụ?", "Does water reach the absorber?"),
    cells: [
      t("Bị chặn khi nguyên vẹn; có thể vào qua vết nứt", "Blocked while intact; can enter through a crack"),
      t("Như thiết kế 1", "Same as design 1"),
      t("Như thiết kế 1", "Same as design 1"),
    ],
    level: [1, 1, 1],
  },
  {
    q: t("Chất chứa chì có thoát ra?", "Can lead-containing species escape?"),
    cells: [
      t("Có thể, sau khi hỏng và nước vào", "Possible after damage and water ingress"),
      t("Giảm: bị giữ ở lớp giữ chì (không tuyệt đối)", "Reduced: held at the capture layer (not absolute)"),
      t("Giảm như thiết kế 2", "Reduced as in design 2"),
    ],
    level: [2, 1, 1],
  },
  {
    q: t("Có lớp giữ chì?", "Is a lead-capture layer present?"),
    cells: [t("Không", "No"), t("Có (cách đã công bố)", "Yes (published approach)"), t("Có (cách đã công bố)", "Yes (published approach)")],
    level: [2, 0, 0],
  },
  {
    q: t("Khi module bị hỏng?", "What happens when the module is damaged?"),
    cells: [
      t("Chì có thể di chuyển ra khỏi module", "Lead may move out of the module"),
      t("Chì tới lớp giữ và bị liên kết; vẫn còn chì", "Lead reaches the capture layer and is bound; lead is still present"),
      t("Như thiết kế 2", "As in design 2"),
    ],
    level: [2, 1, 1],
  },
  {
    q: t("Khi hết vòng đời?", "What must happen at end of life?"),
    cells: [
      t("Cần thu gom và xử lý có kiểm soát", "Needs controlled collection and handling"),
      t("Vẫn cần thu gom: chì đã giữ vẫn là chì", "Still needs collection: captured lead is still lead"),
      t("Có kế hoạch: thu gom → tháo dỡ → thu hồi", "Planned: collection → dismantling → recovery"),
    ],
    level: [2, 2, 0],
  },
];

const DESIGN_NAMES = [
  t("1 · Bọc kín chuẩn", "1 · Standard encapsulation"),
  t("2 · + giữ chì", "2 · + lead capture"),
  t("3 · + giữ chì + cuối đời", "3 · + capture + end of life"),
];

export function DesignTable({ design, foot }: { design: string; foot?: string }) {
  const locale = useSim((s) => s.locale);
  const sel = Math.max(0, Math.min(2, Number(design) - 1));
  return (
    <div className="lead-table-wrap">
      <table className="lead-table">
        <thead>
          <tr>
            <th />
            {DESIGN_NAMES.map((n, i) => (
              <th key={n} className={i === sel ? "on" : ""}>
                {tr(locale, n)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DESIGN_ROWS.map((r) => (
            <tr key={r.q}>
              <th scope="row">{tr(locale, r.q)}</th>
              {r.cells.map((c, i) => (
                <td key={c + i} className={`lvl-${r.level[i]} ${i === sel ? "on" : ""}`}>
                  {tr(locale, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lead-note">
        {tr(locale, DESIGN_NOTE)} <RichText text="[93] [94] [95]" />
      </p>
      {foot ? <p className="lead-foot">{tr(locale, foot)}</p> : null}
    </div>
  );
}

const DESIGN_NOTE = t(
  "Chỉ báo định tính. Không có tỉ lệ rò rỉ nào được nêu và không có thiết kế nào được coi là “không rò rỉ” khi chưa có thử nghiệm đã công bố.",
  "Qualitative indicators. No leakage percentage is given and no design is called “zero leakage” without a published test.",
);

/** Back to the chapter overview, used by every Chapter 4 lesson. */
export function BackToOverview({ spec }: { spec: StorySpec }) {
  const locale = useSim((s) => s.locale);
  const setLesson = useSim((s) => s.setLesson);
  if (spec.group !== "fab") return null;
  return (
    <button type="button" className="btn" onClick={() => setLesson("c4home")} title={tr(locale, C4.back)}>
      <ArrowLeft size={14} />
      <span className="story-btn-text">{tr(locale, C4.overview)}</span>
    </button>
  );
}
