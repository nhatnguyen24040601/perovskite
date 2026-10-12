import { useState } from "react";
import { REFS } from "@/lib/sim/content";
import { tr } from "@/lib/sim/i18n";
import { useSim } from "@/lib/sim/store";

export function RichText({ text }: { text: string }) {
  const [hot, setHot] = useState<number | null>(null);
  const locale = useSim((s) => s.locale);
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[(\d+)\]$/.exec(part);
        if (!m) {
          return (
            <span key={i} className={hot === i + 1 ? "cited" : undefined}>
              {part}
            </span>
          );
        }
        const ref = REFS.find((r) => r.n === m[1]);
        return (
          <span
            key={i}
            className="cite"
            tabIndex={0}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
          >
            {part}
            <span className="cite-tip" role="tooltip">
              {ref ? tr(locale, ref.cite) : `[${m[1]}]`}
            </span>
          </span>
        );
      })}
    </>
  );
}