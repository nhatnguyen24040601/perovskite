import { useSim } from "@/lib/sim/store";
import { tr } from "@/lib/sim/i18n";
import { MK, MK_CITES, MK_ROWS } from "@/lib/sim/market4";
import { Source } from "./Ch5Materials";

/** 4.4: the market milestones in one flat table. */
export function MarketPage() {
  const locale = useSim((s) => s.locale);
  return (
    <div className="page-scroll m5-page">
      <div className="m5-inner">
        <header className="m5-head">
          <span className="m5-kicker">{tr(locale, MK.kicker)}</span>
          <h2>{tr(locale, MK.title)}</h2>
        </header>

        <table className="mk4-table">
          <thead>
            <tr>
              {MK.head.map((h) => (
                <th key={h} scope="col">
                  {tr(locale, h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MK_ROWS.map((r) => (
              <tr key={r.date + r.who}>
                <th scope="row">{tr(locale, r.date)}</th>
                <td className="mk4-who">{tr(locale, r.who)}</td>
                <td>
                  <span className="mk4-kind">{tr(locale, r.kind)}</span>
                </td>
                <td className="mk4-res">
                  {r.result.map((x) => (
                    <span key={x}>{tr(locale, x)}</span>
                  ))}
                </td>
                <td>
                  <span className={`mk4-status mk4-${r.tone}`}>{tr(locale, r.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="m5-formula mk4-conclude">
          <b>{tr(locale, MK.conclude)}</b>
          <span>{tr(locale, MK.warn)}</span>
        </p>

        <details className="m5-sec m5-sources">
          <summary>{tr(locale, MK.sources)}</summary>
          <ol>
            {MK_CITES.map((n) => (
              <Source key={n} n={n} />
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
