import { citesFor, shortCite } from "@/lib/sim/cites";
import { tr } from "@/lib/sim/i18n";
import { t } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { RichText } from "./RichText";

const LABEL = t("Nguồn", "Sources");

/** Presentation mode: the sources of what is on screen, small, at the bottom left. */
export function SourceFooter() {
  const locale = useSim((s) => s.locale);
  const lessonId = useSim((s) => s.lessonId);
  const step = useSim((s) => s.step);
  const cites = citesFor(lessonId, step);
  if (cites.length === 0) return null;
  const withTitle = cites.length <= 3;
  return (
    <footer className="src-foot" aria-label={tr(locale, LABEL)}>
      <b>{tr(locale, LABEL)}</b>
      <ul>
        {cites.map((n) => (
          <li key={n}>
            <RichText text={`[${n}]`} /> <span>{tr(locale, shortCite(n, withTitle))}</span>
          </li>
        ))}
      </ul>
    </footer>
  );
}
