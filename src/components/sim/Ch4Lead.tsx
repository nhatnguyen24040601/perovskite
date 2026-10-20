import { useState } from "react";
import { useSim } from "@/lib/sim/store";
import { tr } from "@/lib/sim/i18n";
import { L4, L4_CITES, L4_COLS, L4_ROWS } from "@/lib/sim/lead4";
import { Source } from "./Ch5Materials";

/** 4.5: the four absorber families in one flat table. */
export function LeadPage() {
  const locale = useSim((s) => s.locale);
  const [pick, setPick] = useState<string | null>(null);
  const on = (id: string) => (pick === id ? " on" : "");

  return (
    <div className="page-scroll m5-page">
      <div className="m5-inner">
        <header className="m5-head">
          <span className="m5-kicker">{tr(locale, L4.kicker)}</span>
          <h2>{tr(locale, L4.title)}</h2>
        </header>

        <div className="l4-wrap">
          <table className="l4-table">
            <thead>
              <tr>
                <td />
                {L4_COLS.map((c) => (
                  <th key={c.id} scope="col" className={on(c.id)}>
                    <button type="button" aria-pressed={pick === c.id} aria-label={`${tr(locale, L4.pick)}: ${tr(locale, c.name)}`} onClick={() => setPick(pick === c.id ? null : c.id)}>
                      <b>{tr(locale, c.name)}</b>
                      <small>{c.sub}</small>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {L4_ROWS.map((r) => (
                <tr key={r.dim}>
                  <th scope="row">{tr(locale, r.dim)}</th>
                  {r.cells.map((c, i) => (
                    <td key={L4_COLS[i]!.id} className={`l4-${c.tone}${on(L4_COLS[i]!.id)}`}>
                      <span>{tr(locale, c.text)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="m5-fine">{tr(locale, L4.fine)}</p>
        </div>

        <p className="m5-formula l4-conclude">
          <b>{tr(locale, L4.conclude)}</b>
        </p>

        <details className="m5-sec m5-sources">
          <summary>{tr(locale, L4.sources)}</summary>
          <ol>
            {L4_CITES.map((n) => (
              <Source key={n} n={n} />
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
