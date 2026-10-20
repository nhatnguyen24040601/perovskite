import { DECK, DECK_SECTIONS } from "@/lib/sim/deck";
import { tr } from "@/lib/sim/i18n";
import { useSim } from "@/lib/sim/store";

/** The talk's title slide. */
export function TitleSlide() {
  const locale = useSim((s) => s.locale);
  return (
    <div className="page-scroll dk-page">
      <div className="dk-center">
        <span className="m5-kicker">{tr(locale, DECK.kicker)}</span>
        <h1 className="dk-title">{tr(locale, DECK.title)}</h1>
        <p className="dk-sub">{tr(locale, DECK.subtitle)}</p>
        <ul className="dk-chips">
          {DECK.chips.map((c) => (
            <li key={c}>{tr(locale, c)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** The agenda: one row per big section; a click jumps to that section. */
export function AgendaSlide() {
  const locale = useSim((s) => s.locale);
  const setLesson = useSim((s) => s.setLesson);
  return (
    <div className="page-scroll dk-page">
      <div className="dk-wide">
        <h2 className="dk-h2">{tr(locale, DECK.agendaTitle)}</h2>
        <ol className="dk-agenda">
          {DECK_SECTIONS.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => setLesson(s.id)}>
                <b>{s.n}</b>
                <span>{tr(locale, s.title)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The slide between two big sections: which part comes next. */
export function DividerSlide() {
  const locale = useSim((s) => s.locale);
  const lessonId = useSim((s) => s.lessonId);
  const sec = DECK_SECTIONS.find((s) => s.id === lessonId) ?? DECK_SECTIONS[0]!;
  return (
    <div className="page-scroll dk-page">
      <div className="dk-center">
        <span className="dk-num">{sec.n}</span>
        <span className="m5-kicker">{tr(locale, DECK.part(sec.n))}</span>
        <h1 className="dk-title">{tr(locale, sec.title)}</h1>
        <p className="dk-sub">{tr(locale, sec.teaser)}</p>
        <ol className="dk-dots" aria-hidden="true">
          {DECK_SECTIONS.map((s) => (
            <li key={s.id} className={s.n === sec.n ? "on" : s.n < sec.n ? "seen" : ""} />
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The last slide: thanks and questions. */
export function ThanksSlide() {
  const locale = useSim((s) => s.locale);
  return (
    <div className="page-scroll dk-page">
      <div className="dk-center">
        <h1 className="dk-title">{tr(locale, DECK.thanks)}</h1>
        <p className="dk-q">{tr(locale, DECK.questions)}</p>
      </div>
    </div>
  );
}
