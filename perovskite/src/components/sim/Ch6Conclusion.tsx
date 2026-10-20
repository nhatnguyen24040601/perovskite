import { useSim } from "@/lib/sim/store";
import { tr } from "@/lib/sim/i18n";
import { C6, C6_CARDS } from "@/lib/sim/conclusion6";
import { RichText } from "./RichText";

/** 6: the closing slide. */
export function ConclusionPage() {
  const locale = useSim((s) => s.locale);
  return (
    <div className="page-scroll m5-page">
      <div className="m5-inner">
        <header className="m5-head">
          <span className="m5-kicker">{tr(locale, C6.kicker)}</span>
          <h2>{tr(locale, C6.title)}</h2>
        </header>

        <div className="c6-grid">
          {C6_CARDS.map((c) => (
            <article key={c.id} className={`c6-card c6-${c.id}`}>
              <h3>{tr(locale, c.head)}</h3>
              {c.big ? <strong className="c6-big">{c.big}</strong> : null}
              {c.bigNote ? <small className="c6-note">{tr(locale, c.bigNote)}</small> : null}
              <ul>
                {c.points.map((p) => (
                  <li key={p}>{tr(locale, p)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="m5-formula c6-closing">
          <b>{tr(locale, C6.closing)}</b>
          <span>{tr(locale, C6.next)}</span>
        </p>

        <p className="m5-fine c6-src">
          <RichText text="[7] [1] [2]" />
        </p>
      </div>
    </div>
  );
}
