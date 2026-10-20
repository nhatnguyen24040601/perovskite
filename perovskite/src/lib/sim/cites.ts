import { REFS, getLesson } from "./content";
import { L4_CITES } from "./lead4";
import { MAT_LAYERS } from "./materials5";
import { MK_CITES } from "./market4";
import { TABLES } from "./i18n";
import { sourceOf } from "./sources";
import { storyOf } from "./story";

const CONCLUSION_CITES = [7, 1, 2];

/** every [n] mark inside a piece of content, in any language */
const marks = (x: unknown): number[] => Array.from(JSON.stringify(x ?? "").matchAll(/\[(\d+)\]/g), (m) => Number(m[1]));

const unique = (xs: number[]) => Array.from(new Set(xs)).sort((a, b) => a - b);

/** The sources the slide on screen relies on. Flat pages list theirs; story lessons use the step's; other lessons use the [n] marks in the step text. */
export function citesFor(lessonId: string, step: number): number[] {
  const lesson = getLesson(lessonId);
  if (lesson.page) {
    if (lesson.page === "materials") {
      return unique(MAT_LAYERS.flatMap((l) => [...l.jobCite, ...l.examples.flatMap((e) => e.cite), ...l.learn.flatMap((p) => p.cite)]));
    }
    if (lesson.page === "market") return unique([...MK_CITES, ...marks(TABLES[lessonId])]);
    if (lesson.page === "lead") return unique(L4_CITES);
    if (lesson.page === "conclusion") return unique(CONCLUSION_CITES);
    return [];
  }
  const spec = storyOf(lessonId);
  if (spec) {
    const s = spec.steps[step];
    return unique([...(s?.cite ?? []), ...marks(s)]);
  }
  // the notes table of the lesson is on screen too, so its sources count
  return unique([...marks(lesson.steps[step]), ...marks(TABLES[lessonId])]);
}

/** One line for the footer: "H. Lee et al., 2023", plus the title when there are only a few sources. */
export function shortCite(n: number, withTitle: boolean): string {
  const s = sourceOf(n);
  if (s) {
    const first = s.by.split(",")[0]!.trim();
    const more = s.by.includes(",") ? " et al." : "";
    const head = `${first}${more}, ${s.date.slice(0, 4)}`;
    if (!withTitle) return head;
    return `${head} · ${s.title.length > 52 ? `${s.title.slice(0, 50)}…` : s.title}`;
  }
  const ref = REFS.find((r) => r.n === String(n));
  if (!ref) return "";
  // older entries read "Authors. Journal Year, vol, page. A note"; keep everything up to the year part
  const parts: string[] = [];
  for (const seg of ref.cite.replace(/\s*DOI:.*$/i, "").split(/\.\s+/)) {
    parts.push(seg.replace(/\.$/, ""));
    if (/\b(19|20)\d{2}\b/.test(seg)) break;
  }
  const text = parts.join(". ");
  return text.length > 72 ? `${text.slice(0, 70)}…` : text;
}
