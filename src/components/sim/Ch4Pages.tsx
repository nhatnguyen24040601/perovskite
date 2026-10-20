import { ArrowLeft, ExternalLink, X } from "lucide-react";
import { REFS } from "@/lib/sim/content";
import { tr } from "@/lib/sim/i18n";
import { EVIDENCE_LABEL, KIND_LABEL, sourceOf } from "@/lib/sim/sources";
import { t, type Facts, type StorySpec } from "@/lib/sim/story";
import { C4, GROUPS, LANDING } from "@/lib/sim/story4";
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
    <div className="page-scroll m5-page">
      <div className="m5-inner">
        <header className="m5-head">
          <span className="m5-kicker">{tr(locale, LANDING.kicker)}</span>
          <h2>{tr(locale, LANDING.title)}</h2>
        </header>
        <ol className="l0-flow" aria-label={tr(locale, LANDING.flow)}>
          {GROUPS.map((g, gi) => (
            <li key={g.title} className="l0-col">
              <span className="l0-step">{gi + 1}</span>
              <h3>{tr(locale, g.title)}</h3>
              <div className="l0-cards">
                {g.cards.map((c) => (
                  <button key={c.id} type="button" className="l0-card" onClick={() => setLesson(c.id)}>
                    <span className="l0-icon" aria-hidden="true">
                      {c.icon}
                    </span>
                    <span className="l0-num">{c.num}</span>
                    <strong>{tr(locale, c.name)}</strong>
                    <span className="l0-line">{tr(locale, c.line)}</span>
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <p className="l0-tail">{tr(locale, LANDING.tail)}</p>
      </div>
    </div>
  );
}

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
