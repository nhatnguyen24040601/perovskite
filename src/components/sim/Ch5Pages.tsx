import { X } from "lucide-react";
import { useEffect } from "react";
import { tr } from "@/lib/sim/i18n";
import { useSim } from "@/lib/sim/store";
import { t, type StorySpec } from "@/lib/sim/story";
import {
  C5,
  ARCH_ROWS,
  CAT_LABEL,
  P,
} from "@/lib/sim/story5";
import { RichText } from "./RichText";

const cites = (a: number[]) => a.map((n) => `[${n}]`).join(" ");

/* ───────────────────────── small shared pieces ───────────────────────── */

/* ───────────────────────── 5.1 / 5.2 ───────────────────────── */

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

/* ───────────────────────── the column ───────────────────────── */

/** Steps whose content lives in the column: it opens by itself when they start. */
const PANEL_STEPS: Record<string, number[]> = { pin: [], stack: [] };

export function Ch5Panel({ spec, step }: { spec: StorySpec; step: number }) {
  const locale = useSim((s) => s.locale);
  const open = useSim((s) => s.fab.panel !== "closed");
  const setOpen = (v: boolean) => useSim.setState({ fab: { ...useSim.getState().fab, panel: v ? "open" : "closed" } });
  useEffect(() => {
    if (PANEL_STEPS[spec.id]?.includes(step)) setOpen(true);
  }, [spec.id, step]);
  return (
    <>
      <button type="button" className="btn c5-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        {tr(locale, spec.id === "pin" ? (open ? C5.hideTable : C5.table) : spec.id === "stack" ? (open ? C5.hideLook : C5.look) : open ? C5.hideDetails : C5.details)}
      </button>
      {open ? (
        <aside className={spec.id === "pin" || spec.id === "stack" ? "c5-panel c5-full" : "c5-panel"} aria-label={tr(locale, C5.details)}>
          <ul className="c5-legend">
            {spec.legend.map((l) => (
              <li key={l.label}>
                <i className={`swatch swatch-${l.swatch}`} aria-hidden="true" />
                {tr(locale, l.label)}
              </li>
            ))}
          </ul>
          {spec.id === "pin" || spec.id === "stack" ? <DeviceColumn spec={spec} step={step} /> : null}
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
