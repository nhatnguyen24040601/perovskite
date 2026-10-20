import { BookOpen, ChevronLeft, ChevronRight, CircleHelp, Image as ImageIcon, Maximize2, Minimize2, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { chapters, getLesson, GLOSSARY, lessons } from "@/lib/sim/content";
import { GLOSS_EN, HELP, TABLES, tr, ui } from "@/lib/sim/i18n";
import { photoAlt, photosFor, type Photo } from "@/lib/sim/media";
import { storyOf } from "@/lib/sim/story";
import {
  diffusionUm,
  egFromHalide,
  pce,
  phaseFromTemp,
  photonEnergy,
  sqEfficiency,
  tolerance,
  ION,
} from "@/lib/sim/physics";
import { useSim, type Locale } from "@/lib/sim/store";
import type { Cation } from "@/lib/sim/types";
import type { ControlKind } from "@/lib/sim/content";
import { Ch4Landing, CiteCard } from "./Ch4Pages";
import { LeadPage } from "./Ch4Lead";
import { MarketPage } from "./Ch4Market";
import { ConclusionPage } from "./Ch6Conclusion";
import { RichText } from "./RichText";
import { MaterialsPage } from "./Ch5Materials";
import { StoryOverlay } from "./StoryOverlay";
import { Stage } from "./three/Stage";

const FOCUS_SWATCH: Record<string, "fa" | "lead" | "iodine" | "electron" | "sun" | "warn" | "br"> = {
  A: "fa",
  B: "lead",
  X: "iodine",
  band: "electron",
  cell: "sun",
  defect: "warn",
  nano: "br",
};

function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" rx="8" fill="#151c24" />
      <path d="M18 5 30 18 18 31 6 18Z" fill="none" stroke="#e4a23a" strokeWidth="1.6" />
      <path d="M6 18h24M18 5l7 13-7 13-7-13Z" fill="none" stroke="#6d4bd6" strokeWidth="1.2" />
      <circle cx="18" cy="18" r="2.2" fill="#c5ccd6" />
    </svg>
  );
}

export function SimApp() {
  const lessonId = useSim((s) => s.lessonId);
  const step = useSim((s) => s.step);
  const explain = useSim((s) => s.explain);
  const navOpen = useSim((s) => s.navOpen);
  const playing = useSim((s) => s.playing);
  const help = useSim((s) => s.help);
  const query = useSim((s) => s.query);
  const inspect = useSim((s) => s.inspect);
  const locale = useSim((s) => s.locale);
  const textScale = useSim((s) => s.textScale);
  const presenting = useSim((s) => s.presenting);
  const photos = useSim((s) => s.photos);
  const setLocale = useSim((s) => s.setLocale);
  const setTextScale = useSim((s) => s.setTextScale);
  const togglePresent = useSim((s) => s.togglePresent);
  const togglePhotos = useSim((s) => s.togglePhotos);
  const lesson = getLesson(lessonId);
  const story = lesson.story ? storyOf(lesson.id) : undefined;
  const current = lesson.steps[step] ?? lesson.steps[0]!;
  const setLesson = useSim((s) => s.setLesson);
  const setStep = useSim((s) => s.setStep);
  const next = useSim((s) => s.next);
  const prev = useSim((s) => s.prev);
  const togglePlay = useSim((s) => s.togglePlay);
  const toggleExplain = useSim((s) => s.toggleExplain);
  const toggleNav = useSim((s) => s.toggleNav);
  const toggleRotate = useSim((s) => s.toggleRotate);
  const autoRotate = useSim((s) => s.autoRotate);
  const bumpReplay = useSim((s) => s.bumpReplay);
  const resetStory = useSim((s) => s.resetStory);
  const toggleHelp = useSim((s) => s.toggleHelp);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("perovskite-lab-v1");
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        lessonId?: string;
        explain?: boolean;
        locale?: Locale;
        textScale?: number;
        navOpen?: boolean;
      };
      if (saved.lessonId && lessons.some((l) => l.id === saved.lessonId)) {
        useSim.getState().setLesson(saved.lessonId);
      }
      if (saved.locale === "vi" || saved.locale === "en") useSim.setState({ locale: saved.locale });
      if (typeof saved.textScale === "number") useSim.getState().setTextScale(saved.textScale);
      if (typeof saved.explain === "boolean") {
        const id = useSim.getState().lessonId;
        const force = id === "glossary" || id === "refs";
        useSim.setState({ explain: force ? true : saved.explain });
      }
      if (typeof saved.navOpen === "boolean") useSim.setState({ navOpen: saved.navOpen });
    } catch {
      /* ignore broken saves */
    }
  }, []);

  useEffect(() => {
    return useSim.subscribe((s) => {
      localStorage.setItem(
        "perovskite-lab-v1",
        JSON.stringify({
          lessonId: s.lessonId,
          explain: s.explain,
          navOpen: s.navOpen,
          locale: s.locale,
          textScale: s.textScale,
        }),
      );
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      useSim.setState({ autoRotate: false, playing: false });
    }
  }, []);

  useEffect(() => {
    if (step >= lesson.steps.length) setStep(0);
  }, [step, lesson.steps.length, setStep]);

  useEffect(() => {
    // Story lessons run their own clock: Play only freezes or unfreezes the animation.
    if (!playing || lesson.story) return;
    const id = window.setInterval(() => useSim.getState().next(), 8000);
    return () => window.clearInterval(id);
  }, [playing, lessonId, step, lesson.story]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "r" || e.key === "R") {
        if (useSim.getState().lessonId && getLesson(useSim.getState().lessonId).story) useSim.getState().resetStory();
        else useSim.getState().bumpReplay();
      }
      if (e.key === "e" || e.key === "E") toggleExplain();
      if (e.key === "[") useSim.getState().toggleNav();
      if (e.key === "Escape") {
        if (useSim.getState().photos) useSim.getState().togglePhotos();
        else if (useSim.getState().presenting && !document.fullscreenElement) useSim.getState().togglePresent();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, toggleExplain, togglePlay]);

  const onPresent = () => {
    const go = async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch {
        togglePresent();
      }
    };
    void go();
  };

  useEffect(() => {
    const sync = () => {
      const on = Boolean(document.fullscreenElement);
      if (on !== useSim.getState().presenting) useSim.setState({ presenting: on });
    };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const filtered = lesson.steps
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => {
      if (!query.trim()) return true;
      const hay = `${s.title} ${s.body}`.toLowerCase();
      return hay.includes(query.trim().toLowerCase());
    });

  const table = TABLES[lesson.id];
  const figure = current.caption ? tr(locale, current.caption) : table?.caption[locale];
  const gloss = lesson.id === "glossary" ? GLOSSARY[step] : undefined;
  const appClass = [
    "app",
    explain ? "" : "explain-off",
    navOpen ? "" : "nav-off",
    presenting ? "presenting" : "",
    lesson.story ? "story-lesson" : "",
    story?.group === "degrade" ? "degrade-lesson" : "",
    story?.group === "design" ? "design-lesson" : "",
    lesson.page ? "page-lesson" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appClass} style={{ ["--type" as string]: String(textScale) }}>
      <header className="topbar">
        <div className="brand">
          <Mark />
          <div>
            <div className="brand-name">{ui(locale, "brand")}</div>
            <div className="brand-sub">{ui(locale, "sub")}</div>
          </div>
        </div>
        <div className="top-title">
          <span className="kicker">{tr(locale, lesson.section)}</span>
          <h1>{tr(locale, lesson.title)}</h1>
          <p className="journey">{story ? tr(locale, story.sentence) : ui(locale, "journey")}</p>
        </div>
        <div className="top-actions">
          <div className="seg" role="group" aria-label={ui(locale, "lang")}>
            {(["vi", "en"] as Locale[]).map((code) => (
              <button key={code} type="button" className={locale === code ? "btn on" : "btn"} onClick={() => setLocale(code)}>
                {code === "vi" ? "VI" : "EN"}
              </button>
            ))}
          </div>
          <div className="seg" role="group" aria-label={ui(locale, "size")}>
            {[0.85, 1, 1.2, 1.45].map((n) => (
              <button
                key={n}
                type="button"
                className={textScale === n ? "btn on" : "btn"}
                onClick={() => setTextScale(n)}
              >
                {n === 0.85 ? "A−" : n === 1 ? "A" : n === 1.2 ? "A+" : "A++"}
              </button>
            ))}
          </div>
          <button type="button" className={photos ? "btn on" : "btn"} onClick={togglePhotos} aria-label={ui(locale, "photos")}>
            <ImageIcon size={16} />
            <span className="btn-label">{photos ? ui(locale, "photosHide") : ui(locale, "photos")}</span>
          </button>
          <button type="button" className={presenting ? "btn on" : "btn"} onClick={onPresent} aria-label={ui(locale, "present")}>
            {presenting ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="btn-label">{presenting ? ui(locale, "presentExit") : ui(locale, "present")}</span>
          </button>
          <button type="button" className="btn btn-icon" onClick={toggleHelp} aria-label={ui(locale, "help")}>
            <CircleHelp size={18} />
          </button>
          <button
            type="button"
            className={navOpen ? "btn on" : "btn"}
            aria-pressed={navOpen}
            onClick={toggleNav}
            aria-label={ui(locale, navOpen ? "hideNav" : "showNav")}
          >
            {navOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            <span className="btn-label">{ui(locale, "nav")}</span>
          </button>
          <button
            type="button"
            className={explain ? "btn on" : "btn"}
            aria-pressed={explain}
            onClick={toggleExplain}
            aria-label={ui(locale, explain ? "hideNotes" : "showNotes")}
          >
            <BookOpen size={16} />
            <span className="btn-label">{ui(locale, explain ? "hideNotes" : "showNotes")}</span>
          </button>
        </div>
      </header>

      <nav className="nav" aria-label={ui(locale, "nav")}>
        <div className="side-head">
          <span className="kicker">{ui(locale, "nav")}</span>
          <button
            type="button"
            className="btn btn-icon"
            onClick={toggleNav}
            aria-expanded={navOpen}
            aria-label={ui(locale, navOpen ? "hideNav" : "showNav")}
          >
            {navOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
        {navOpen ? (
        <div className="nav-scroll">
          {chapters.map((chapter) => (
            <section key={chapter.id} className="chapter-block">
              <h2 className="chapter-label">
                {chapter.num} {tr(locale, chapter.title)}
              </h2>
              <div className="lesson-list">
                {chapter.lessonIds.map((id) => {
                  const item = getLesson(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={id === lessonId ? "lesson-btn active" : "lesson-btn"}
                      onClick={() => setLesson(id)}
                    >
                      <span className="lesson-idx">{tr(locale, item.section)}</span>
                      <span className="lesson-name">{tr(locale, item.title)}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        ) : null}
      </nav>

      <div className="stage-wrap">
        {lesson.page === "landing" ? <Ch4Landing /> : null}
        {lesson.page === "materials" ? <MaterialsPage /> : null}
        {lesson.page === "lead" ? <LeadPage /> : null}
        {lesson.page === "market" ? <MarketPage /> : null}
        {lesson.page === "conclusion" ? <ConclusionPage /> : null}
        {lesson.page ? null : (
          <div className="stage">
            <Stage />
          </div>
        )}
        {lesson.page ? null : lesson.story ? (
          <StoryOverlay lessonId={lessonId} />
        ) : (
          <div className="stage-caption">
            <span>
              {ui(locale, "step")} {step + 1}/{lesson.steps.length}
              {inspect ? ` · ${tr(locale, inspect)}` : ""}
            </span>
            <strong>{tr(locale, current.title)}</strong>
            {figure ? (
              <em className="figure-cap">
                <RichText text={figure} />
              </em>
            ) : null}
          </div>
        )}
        {lesson.legend && !lesson.page ? (
          <div className="legend">
            {lesson.legend.map((item) => (
              <div key={item.label} className="legend-row">
                <span className={`swatch swatch-${item.swatch}`} />
                {tr(locale, item.label)}
              </div>
            ))}
          </div>
        ) : null}
        <ControlDock kinds={lesson.controls ?? []} />
        {photos && !explain ? <PhotoDrawer lessonId={lessonId} locale={locale} onClose={togglePhotos} /> : null}
      </div>

      <div className="playback">
        <button type="button" className="btn btn-icon" onClick={prev} aria-label={ui(locale, "prev")}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" className="btn btn-icon" onClick={togglePlay} aria-label={playing ? ui(locale, "pause") : ui(locale, "play")}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          className="btn btn-icon"
          onClick={lesson.story ? resetStory : bumpReplay}
          aria-label={lesson.story ? "Reset" : ui(locale, "replay")}
          title={lesson.story ? "Reset (R)" : undefined}
        >
          <RotateCcw size={16} />
        </button>
        {lesson.story ? null : (
          <button type="button" className={autoRotate ? "btn on" : "btn"} onClick={toggleRotate}>
            {ui(locale, "rotate")}
          </button>
        )}
        <span className="step-count">
          {step + 1}/{lesson.steps.length}
        </span>
        {lesson.steps.length <= 16 ? (
          <div className="dots">
            {lesson.steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className={i === step ? "dot on" : i < step ? "dot seen" : "dot"}
                aria-label={tr(locale, s.title)}
                onClick={() => setStep(i)}
              />
            ))}
          </div>
        ) : null}
        <button type="button" className="btn btn-icon" onClick={next} aria-label={ui(locale, "next")}>
          <ChevronRight size={18} />
        </button>
      </div>

      <aside className="panel" aria-label={ui(locale, "notes")}>
        <div className="side-head">
          <span className="kicker">{ui(locale, explain ? "notes" : "showNotes")}</span>
          <button
            type="button"
            className="btn btn-icon"
            onClick={toggleExplain}
            aria-expanded={explain}
            aria-label={ui(locale, explain ? "hideNotes" : "showNotes")}
          >
            {explain ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        {explain ? (
        <div className="panel-scroll">
            {photos ? <PhotoDrawer lessonId={lessonId} locale={locale} onClose={togglePhotos} embedded /> : null}
            {lesson.id === "glossary" || lesson.id === "refs" ? (
              <input
                className="search"
                value={query}
                placeholder={lesson.id === "glossary" ? ui(locale, "searchTerms") : ui(locale, "searchRefs")}
                onChange={(e) => useSim.getState().patch({ query: e.target.value })}
              />
            ) : null}
            <span className="kicker">
              {ui(locale, "step")} {step + 1} · {tr(locale, lesson.section)}
            </span>
            <h2>{tr(locale, current.title)}</h2>
            {gloss ? (
              <p className="term-line">
                <span className={`swatch swatch-${FOCUS_SWATCH[gloss.focus] ?? "sun"}`} />
                <strong>{gloss.en}</strong>
              </p>
            ) : null}
            <p className="prose">
              <RichText
                text={
                  gloss && locale === "en"
                    ? `${gloss.en}. ${GLOSS_EN[gloss.vi] ?? gloss.blurb}`
                    : tr(locale, current.body) + (story?.steps[step]?.cite ? ` ${story.steps[step]!.cite!.map((n) => `[${n}]`).join(" ")}` : "")
                }
              />
            </p>
            {current.more ? (
              <p className="prose more">
                <span className="kicker">{ui(locale, "more")}</span>
                <RichText text={tr(locale, current.more)} />
              </p>
            ) : null}
            {current.why ? (
              <div className="callout idea">
                <span className="call-label">{story ? tr(locale, "Vì sao quan trọng") : ""}</span>
                <RichText text={tr(locale, current.why)} />
              </div>
            ) : null}
            {current.note ? (
              <div className={`callout ${current.note.kind === "base" ? "" : current.note.kind}`}>
                <span className="call-label">{tr(locale, current.note.title)}</span>
                <RichText text={tr(locale, current.note.text)} />
              </div>
            ) : null}
            {table ? (
              <figure className="data-fig">
                <figcaption>
                  <span className="kicker">{ui(locale, "table")}</span>
                  <RichText text={table.caption[locale]} />
                </figcaption>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {table.headers[locale].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows[locale].map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell, i) => (
                            <td key={`${cell}-${i}`}>
                              <RichText text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </figure>
            ) : null}
            <div className="step-jump">
              {filtered.map(({ s, i }) => (
                <button key={`${s.title}-${i}`} type="button" className={i === step ? "on" : ""} onClick={() => setStep(i)}>
                  <small>
                    {lesson.id === "refs" || lesson.id === "glossary" ? tr(locale, s.title) : `${ui(locale, "step")} ${i + 1}`}
                  </small>
                  {lesson.id === "refs" ? tr(locale, s.body) : tr(locale, s.title)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <CiteCard />

      {help ? (
        <div className="help-layer" onClick={toggleHelp} role="presentation">
          <div
            className="help-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="help-title"
          >
            <span className="kicker">{ui(locale, "help")}</span>
            <h2 id="help-title">{ui(locale, "helpTitle")}</h2>
            <ul>
              {HELP[locale].map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <button type="button" className="btn btn-accent" onClick={toggleHelp}>
              {ui(locale, "enter")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PhotoDrawer({
  lessonId,
  locale,
  onClose,
  embedded = false,
}: {
  lessonId: string;
  locale: Locale;
  onClose: () => void;
  embedded?: boolean;
}) {
  const step = useSim((s) => s.step);
  const shots = photosFor(lessonId, step);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [lessonId, step]);
  const photo: Photo = shots[Math.min(index, Math.max(0, shots.length - 1))] ?? shots[0]!;
  const n = shots.length;
  return (
    <aside className={embedded ? "photo-dock embedded" : "photo-dock"} role="dialog" aria-label={ui(locale, "photos")}>
      <div className="photo-bar">
        <span className="kicker">
          {ui(locale, "photos")} {Math.min(index, n - 1) + 1}/{n}
        </span>
        <button type="button" className="btn btn-icon" onClick={onClose} aria-label={ui(locale, "close")}>
          <X size={16} />
        </button>
      </div>
      <img className="photo-img" src={photo.src} alt={photoAlt(photo, locale)} />
      <p className="photo-alt">{photoAlt(photo, locale)}</p>
      <div className="photo-bar">
        <button
          type="button"
          className="btn btn-icon"
          aria-label={ui(locale, "prev")}
          onClick={() => setIndex((i) => (i - 1 + n) % n)}
        >
          <ChevronLeft size={16} />
        </button>
        <a className="photo-credit" href={photo.href} target="_blank" rel="noreferrer">
          {ui(locale, "credit")}: {photo.credit}
        </a>
        <button
          type="button"
          className="btn btn-icon"
          aria-label={ui(locale, "next")}
          onClick={() => setIndex((i) => (i + 1) % n)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </aside>
  );
}

function ControlDock({ kinds }: { kinds: ControlKind[] }) {
  const s = useSim();
  const locale = s.locale;
  if (kinds.length === 0) return null;
  return (
    <div className="dock">
      {kinds.includes("wavelength") ? (
        <label className="ctrl">
          <span>
            {ui(locale, "wave")} <strong>{s.wavelength.toFixed(0)} nm</strong> · E ≈ {photonEnergy(s.wavelength).toFixed(2)} eV
          </span>
          <input
            type="range"
            min={320}
            max={1200}
            value={s.wavelength}
            onChange={(e) => s.patch({ wavelength: Number(e.target.value) })}
          />
          <span className="chip-row">
            <button type="button" className="btn" onClick={() => s.patch({ wavelength: 500 })}>
              {ui(locale, "green")}
            </button>
            <button type="button" className="btn" onClick={() => s.patch({ wavelength: 700 })}>
              {ui(locale, "red")}
            </button>
            <button type="button" className="btn" onClick={() => s.patch({ wavelength: 1100 })}>
              {ui(locale, "ir")}
            </button>
          </span>
        </label>
      ) : null}
      {kinds.includes("iv") ? (
        <div className="ctrl">
          <span>
            PCE <strong>{pce(s.voc, s.jsc, s.ff).toFixed(1)}%</strong> = {s.voc.toFixed(2)} × {s.jsc.toFixed(1)} × {s.ff.toFixed(2)} / 100
          </span>
          <span>Voc {s.voc.toFixed(2)} V</span>
          <input type="range" min={80} max={135} value={Math.round(s.voc * 100)} onChange={(e) => s.patch({ voc: Number(e.target.value) / 100 })} />
          <span>Jsc {s.jsc.toFixed(1)} mA/cm²</span>
          <input type="range" min={10} max={30} step={0.1} value={s.jsc} onChange={(e) => s.patch({ jsc: Number(e.target.value) })} />
          <span>FF {s.ff.toFixed(2)}</span>
          <input type="range" min={40} max={90} value={Math.round(s.ff * 100)} onChange={(e) => s.patch({ ff: Number(e.target.value) / 100 })} />
          <button type="button" className="btn" onClick={() => s.patch({ voc: 1.19, jsc: 25.8, ff: 0.86 })}>
            {ui(locale, "example")}
          </button>
        </div>
      ) : null}
      {kinds.includes("eg") ? (
        <label className="ctrl">
          <span>
            {ui(locale, "shownEg")} <strong>{s.eg.toFixed(2)} eV</strong> · {ui(locale, "sqCap")} ~{sqEfficiency(s.eg).toFixed(1)}%
          </span>
          <input
            type="range"
            min={50}
            max={300}
            value={Math.round(s.eg * 100)}
            onChange={(e) => s.patch({ eg: Number(e.target.value) / 100 })}
          />
        </label>
      ) : null}
      {kinds.includes("cation") ? (
        <div className="ctrl">
          <span>
            t ≈{" "}
            <strong>
              {tolerance(
                s.mixCs ? ION.fa * 0.95 + ION.cs * 0.05 : s.cation === "Cs" ? ION.cs : s.cation === "MA" ? ION.ma : ION.fa,
              ).toFixed(2)}
            </strong>
          </span>
          <span className="chip-row">
            {(["Cs", "MA", "FA"] as Cation[]).map((c) => (
              <button key={c} type="button" className={s.cation === c && !s.mixCs ? "btn on" : "btn"} onClick={() => s.patch({ cation: c, mixCs: false })}>
                {c}
              </button>
            ))}
            <button type="button" className={s.mixCs ? "btn on" : "btn"} onClick={() => s.patch({ mixCs: true, cation: "FA" })}>
              FA₀.₉₅Cs₀.₀₅
            </button>
          </span>
        </div>
      ) : null}
      {kinds.includes("bromide") ? (
        <label className="ctrl">
          <span>
            {ui(locale, "bromine")} <strong>{s.br.toFixed(0)}%</strong> · Eg {egFromHalide(s.br, s.sn).toFixed(2)} eV
          </span>
          <input type="range" min={0} max={100} value={s.br} onChange={(e) => s.patch({ br: Number(e.target.value) })} />
        </label>
      ) : null}
      {kinds.includes("sn") ? (
        <label className="ctrl">
          <span>
            {ui(locale, "tin")} <strong>{s.sn.toFixed(0)}%</strong>
          </span>
          <input type="range" min={0} max={100} value={s.sn} onChange={(e) => s.patch({ sn: Number(e.target.value) })} />
        </label>
      ) : null}
      {kinds.includes("light") ? (
        <button type="button" className={s.light ? "btn on" : "btn"} onClick={() => s.patch({ light: !s.light })}>
          {s.light ? ui(locale, "hokeOn") : ui(locale, "hokeOff")}
        </button>
      ) : null}
      {kinds.includes("temperature") ? (
        <label className="ctrl">
          <span>
            {tr(locale, phaseFromTemp(s.temp).name)} · <strong>{s.temp.toFixed(0)} °C</strong>
            {" · "}
            {tr(locale, phaseFromTemp(s.temp).range)}
          </span>
          <input type="range" min={-150} max={90} value={s.temp} onChange={(e) => s.patch({ temp: Number(e.target.value) })} />
        </label>
      ) : null}
      {kinds.includes("lifetime") ? (
        <div className="ctrl">
          <span>
            τ <strong>{s.tau < 1000 ? `${s.tau.toFixed(0)} ns` : `${(s.tau / 1000).toFixed(1)} µs`}</strong> · L ≈ {diffusionUm(s.tau, s.singleCrystal).toFixed(s.singleCrystal ? 0 : 2)} µm
          </span>
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(((Math.log(s.tau) - Math.log(10)) / (Math.log(6e6) - Math.log(10))) * 1000)}
            onChange={(e) => {
              const u = Number(e.target.value) / 1000;
              const tau = Math.exp(Math.log(10) + u * (Math.log(6e6) - Math.log(10)));
              s.patch({ tau });
            }}
          />
          <button type="button" className={s.singleCrystal ? "btn on" : "btn"} onClick={() => s.patch({ singleCrystal: !s.singleCrystal })}>
            {s.singleCrystal ? ui(locale, "crystal") : ui(locale, "film")}
          </button>
        </div>
      ) : null}
      {kinds.includes("explode") ? (
        <label className="ctrl">
          <span>
            {ui(locale, "split")} <strong>{Math.round(s.explode * 100)}%</strong>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(s.explode * 100)}
            onChange={(e) => s.patch({ explode: Number(e.target.value) / 100 })}
          />
        </label>
      ) : null}
      {kinds.includes("nwell") ? (
        <div className="ctrl">
          <span>{ui(locale, "wells")}</span>
          <span className="chip-row">
            {[1, 2, 3, 4, 99].map((n) => (
              <button key={n} type="button" className={s.nWell === n ? "btn on" : "btn"} onClick={() => s.patch({ nWell: n })}>
                {n === 99 ? "3D" : `n=${n}`}
              </button>
            ))}
          </span>
        </div>
      ) : null}
      {kinds.includes("architecture") ? (
        <div className="chip-row">
          <button type="button" className={s.architecture === "nip" ? "btn on" : "btn"} onClick={() => s.patch({ architecture: "nip" })}>
            n-i-p
          </button>
          <button type="button" className={s.architecture === "pin" ? "btn on" : "btn"} onClick={() => s.patch({ architecture: "pin" })}>
            p-i-n
          </button>
        </div>
      ) : null}
    </div>
  );
}
