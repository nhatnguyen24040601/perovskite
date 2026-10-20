import { useEffect, useState } from "react";
import { useSim } from "@/lib/sim/store";
import { tr } from "@/lib/sim/i18n";
import { sourceOf } from "@/lib/sim/sources";
import { PHASES, M5, MAT_COLOR, MAT_LAYERS, type MatId } from "@/lib/sim/materials5";
import { Pause, Play, RotateCcw } from "lucide-react";
import { RichText } from "./RichText";

/* geometry of the flat cross-section (viewBox units) */
const X0 = 100;
const W = 230;
const XR = X0 + W;
const XB = 392;
const ROWS: Record<MatId, { y: number; h: number }> = {
  tco: { y: 84, h: 42 },
  htl: { y: 130, h: 44 },
  perov: { y: 178, h: 84 },
  etl: { y: 266, h: 44 },
  metal: { y: 314, h: 40 },
};
const mid = (id: MatId) => ROWS[id].y + ROWS[id].h / 2;
/** where the charges are born (low in the absorber, clear of its caption) */
const Y0 = ROWS.perov.y + 62;
const PAIRS = [X0 + 22, X0 + W - 22];

/** The flat map of the cell: light in, five layers, charges out, one current. */
function Diagram({ sel, onPick, phase }: { sel: MatId; onPick: (id: MatId) => void; phase: number }) {
  const locale = useSim((s) => s.locale);
  const on = (n: number) => (phase >= n ? ` on${n}` : "");
  const cls = `m5-svg ph${phase}${on(1)}${on(2)}${on(3)}${on(4)}${on(5)}`;
  const yTop = mid("tco");
  const yBot = mid("metal");
  const [hWord, hSym] = tr(locale, M5.holes).split(" ");
  const [eWord, eSym] = tr(locale, M5.electrons).split(" ");
  return (
    <svg className={cls} viewBox="0 0 500 380" role="img" aria-label={tr(locale, M5.hint)}>
      {/* the sun and the rays */}
      <circle className="m5-sun" cx={X0 + W / 2} cy="28" r="14" />
      <text className="m5-note-t" x={X0 + W / 2 + 24} y="33">
        {tr(locale, M5.light)}
      </text>
      {[X0 + 50, X0 + W / 2, X0 + W - 50].map((x, i) => (
        <path key={x} className="m5-ray" style={{ animationDelay: `${i * 0.25}s` }} d={`M${x} 48 V80 m-6 -7 l6 7 l6 -7`} />
      ))}

      {/* the five layers */}
      {MAT_LAYERS.map((l) => {
        const r = ROWS[l.id];
        const picked = sel === l.id;
        const big = l.id === "perov";
        return (
          <g
            key={l.id}
            className={picked ? "m5-layer on" : "m5-layer"}
            role="button"
            tabIndex={0}
            aria-pressed={picked}
            aria-label={tr(locale, l.name)}
            onClick={() => onPick(l.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(l.id);
              }
            }}
          >
            <rect className={big ? "m5-rect m5-abs" : "m5-rect"} x={X0} y={r.y} width={W} height={r.h} rx="5" fill={MAT_COLOR[l.id]} />
            <text className="m5-lt" x={X0 + W / 2} y={r.y + (big ? 22 : r.h / 2 - 1)}>
              {tr(locale, l.name).replace(/ \(.+\)$/, "")}
            </text>
            <text className="m5-ls" x={X0 + W / 2} y={r.y + (big ? 40 : r.h / 2 + 14)}>
              {tr(locale, l.short)}
            </text>
          </g>
        );
      })}

      {/* charges: holes go up to the transparent electrode, electrons go down to the metal */}
      {PAIRS.map((x, i) => (
        <g key={x} className="m5-pair" style={{ ["--d" as string]: `${i * 0.2}s` }}>
          <circle className="m5-h" cx={x - 8} cy={Y0} r="6" style={{ ["--a" as string]: `${mid("htl") - Y0}px`, ["--b" as string]: `${yTop - Y0}px` }} />
          <circle className="m5-e" cx={x + 8} cy={Y0} r="6" style={{ ["--a" as string]: `${mid("etl") - Y0}px`, ["--b" as string]: `${yBot - Y0}px` }} />
        </g>
      ))}

      {/* big arrows beside the stack */}
      <g className="m5-arrow m5-arrow-h">
        <path d={`M76 ${Y0 - 12} V${yTop + 6} m-8 10 l8 -10 l8 10`} />
        <text x="64" y={mid("htl") + 2} textAnchor="end">{hWord}</text>
        <text x="64" y={mid("htl") + 16} textAnchor="end">{hSym}</text>
      </g>
      <g className="m5-arrow m5-arrow-e">
        <path d={`M76 ${Y0 + 12} V${yBot - 6} m-8 -10 l8 10 l8 -10`} />
        <text x="64" y={mid("etl") - 2} textAnchor="end">{eWord}</text>
        <text x="64" y={mid("etl") + 12} textAnchor="end">{eSym}</text>
      </g>

      {/* the circuit and its lamp */}
      <path className="m5-wire" d={`M${XR} ${yTop} H${XB} V${yBot} H${XR}`} />
      <path className="m5-flow" d={`M${XR} ${yBot} H${XB} V${yTop} H${XR}`} />
      <circle className="m5-bulb" cx={XB} cy={(yTop + yBot) / 2} r="16" />
      <text className="m5-pole" x={XR + 12} y={yTop - 6}>+</text>
      <text className="m5-pole" x={XR + 12} y={yBot + 18}>−</text>
      <text className="m5-note-t" x={XB + 24} y={(yTop + yBot) / 2 + 4}>
        {tr(locale, M5.electricity)}
      </text>
    </svg>
  );
}

export function Source({ n }: { n: number }) {
  const locale = useSim((s) => s.locale);
  const s = sourceOf(n);
  if (!s) return null;
  const first = s.by.split(",")[0]!.trim();
  const more = s.by.includes(",") ? " et al." : "";
  const year = s.date.slice(0, 4);
  return (
    <li className="m5-src">
      <RichText text={`[${n}]`} />{" "}
      <span>
        {first}
        {more}, {s.journal ?? ""}, {year}. <i>{s.title}</i>
      </span>
      {s.url ? (
        <a href={s.url} target="_blank" rel="noopener noreferrer">
          {s.doi ? `doi:${s.doi}` : tr(locale, M5.sources)}
        </a>
      ) : null}
    </li>
  );
}

export function MaterialsPage() {
  const locale = useSim((s) => s.locale);
  const replay = useSim((s) => s.replay);
  const [sel, setSel] = useState<MatId>("perov");
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(true);
  const layer = MAT_LAYERS.find((l) => l.id === sel)!;

  // the six-beat story: about four and a half seconds a beat, so the whole path takes about 27 seconds
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 4500);
    return () => window.clearInterval(id);
  }, [auto]);
  useEffect(() => {
    setPhase(0);
    setAuto(true);
  }, [replay]);
  // dev only: lets the browser tests pin a beat
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const w = window as unknown as { __m5Phase?: number };
    if (w.__m5Phase !== undefined) {
      setPhase(w.__m5Phase);
      setAuto(false);
    }
  }, []);

  const used = Array.from(
    new Set(MAT_LAYERS.flatMap((l) => [...l.jobCite, ...l.examples.flatMap((e) => e.cite), ...l.learn.flatMap((p) => p.cite)])),
  ).sort((a, b) => a - b);

  return (
    <div className="page-scroll m5-page">
      <div className="m5-inner">
        <header className="m5-head">
          <span className="m5-kicker">{tr(locale, M5.kicker)}</span>
          <h2>{tr(locale, M5.title)}</h2>
        </header>

        <section className="m5-main">
          <figure className="m5-figure">
            <Diagram sel={sel} onPick={setSel} phase={phase} />
            <figcaption>
              <p className="m5-beat" aria-live="polite">
                <b>{phase + 1}</b> {tr(locale, PHASES[phase]!)}
              </p>
              <div className="m5-beats" role="group" aria-label="story">
                {PHASES.map((p, i) => (
                  <button key={p} type="button" className={i === phase ? "on" : i < phase ? "seen" : ""} aria-label={`${i + 1}. ${tr(locale, p)}`} onClick={() => { setPhase(i); setAuto(false); }}>
                    {i + 1}
                  </button>
                ))}
                <button type="button" className="m5-ctl" onClick={() => setAuto(!auto)} aria-label={tr(locale, auto ? M5.pause : M5.play)}>
                  {auto ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button type="button" className="m5-ctl" onClick={() => { setPhase(0); setAuto(true); }} aria-label={tr(locale, M5.replay)}>
                  <RotateCcw size={14} />
                </button>
              </div>
              <p className="m5-fine">{tr(locale, M5.concept)}</p>
            </figcaption>
          </figure>

          <div className="m5-side">
            <div className="m5-chips" role="group" aria-label={tr(locale, M5.pick)}>
              {MAT_LAYERS.map((l) => (
                <button key={l.id} type="button" className={sel === l.id ? "on" : ""} aria-pressed={sel === l.id} onClick={() => setSel(l.id)} style={{ ["--c" as string]: MAT_COLOR[l.id] }}>
                  <i aria-hidden="true" />
                  {tr(locale, l.chip)}
                </button>
              ))}
            </div>
            <article className="m5-card" style={{ ["--c" as string]: MAT_COLOR[sel] }} aria-label={tr(locale, M5.selected)}>
              <h3>{tr(locale, layer.name)}</h3>
              <p className="m5-job">{tr(locale, layer.job)}</p>
              <ul className="m5-ex m5-key">
                {layer.want.map((w) => (
                  <li key={w}>{tr(locale, w)}</li>
                ))}
              </ul>
              <h4>{tr(locale, M5.examples)}</h4>
              <ul className="m5-ex">
                {layer.examples.map((e) => (
                  <li key={e.n}>{tr(locale, e.n)}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <p className="m5-formula">
          <b>{tr(locale, M5.formulaA)}</b> + <b>{tr(locale, M5.formulaB)}</b> = <b>{tr(locale, M5.formulaC)}</b>
        </p>

        <details className="m5-sec m5-sources">
          <summary>{tr(locale, M5.sources)}</summary>
          <ol>
            {used.map((n) => (
              <Source key={n} n={n} />
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
