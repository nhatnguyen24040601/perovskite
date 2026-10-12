import { create } from "zustand";
import { getLesson, lessonIndex, lessons, nextLessonId, prevLessonId } from "./content";
import type { Architecture, Cation } from "./types";

export type Locale = "vi" | "en";

type SimState = {
  lessonId: string;
  step: number;
  playing: boolean;
  explain: boolean;
  navOpen: boolean;
  autoRotate: boolean;
  replay: number;
  help: boolean;
  visited: string[];
  query: string;
  wavelength: number;
  voc: number;
  jsc: number;
  ff: number;
  eg: number;
  br: number;
  sn: number;
  cation: Cation;
  mixCs: boolean;
  temp: number;
  tau: number;
  singleCrystal: boolean;
  plqy: number;
  enemy: number;
  defense: boolean;
  explode: number;
  light: boolean;
  nWell: number;
  architecture: Architecture;
  inspect: string | null;
  quiz: (number | null)[];
  locale: Locale;
  textScale: number;
  presenting: boolean;
  photos: boolean;
  setLesson: (id: string) => void;
  setStep: (n: number) => void;
  next: () => void;
  prev: () => void;
  togglePlay: () => void;
  toggleExplain: () => void;
  toggleNav: () => void;
  toggleRotate: () => void;
  bumpReplay: () => void;
  toggleHelp: () => void;
  patch: (p: Partial<SimState>) => void;
  answerQuiz: (q: number, choice: number) => void;
  setLocale: (locale: Locale) => void;
  setTextScale: (n: number) => void;
  togglePresent: () => void;
  togglePhotos: () => void;
};

export const useSim = create<SimState>((set, get) => ({
  lessonId: "intro",
  step: 0,
  playing: false,
  explain: true,
  navOpen: true,
  autoRotate: true,
  replay: 0,
  help: false,
  visited: ["intro"],
  query: "",
  wavelength: 500,
  voc: 1.19,
  jsc: 25.8,
  ff: 0.86,
  eg: 1.34,
  br: 0,
  sn: 0,
  cation: "MA",
  mixCs: false,
  temp: 25,
  tau: 273,
  singleCrystal: false,
  plqy: 0.05,
  enemy: 1,
  defense: false,
  explode: 0.75,
  light: false,
  nWell: 2,
  architecture: "pin",
  inspect: null,
  quiz: [null, null, null, null, null, null],
  locale: "vi",
  textScale: 1,
  presenting: false,
  photos: false,
  setLesson: (id) => {
    const lesson = getLesson(id);
    set((s) => ({
      lessonId: lesson.id,
      step: 0,
      playing: false,
      inspect: null,
      query: "",
      explain: lesson.id === "glossary" || lesson.id === "refs" || lesson.id === "quiz" ? true : s.explain,
      visited: s.visited.includes(lesson.id) ? s.visited : [...s.visited, lesson.id],
    }));
    const tune = lesson.tune?.[0];
    if (tune) set(tune);
  },
  setStep: (n) => {
    const lesson = getLesson(get().lessonId);
    const step = Math.max(0, Math.min(lesson.steps.length - 1, n));
    set({ step, inspect: null });
    const tune = lesson.tune?.[step];
    if (tune) set(tune);
  },
  next: () => {
    const { lessonId, step } = get();
    const lesson = getLesson(lessonId);
    if (step < lesson.steps.length - 1) get().setStep(step + 1);
    else {
      const nxt = nextLessonId(lessonId);
      if (nxt) get().setLesson(nxt);
      else set({ playing: false });
    }
  },
  prev: () => {
    const { lessonId, step } = get();
    if (step > 0) get().setStep(step - 1);
    else {
      const prev = prevLessonId(lessonId);
      if (!prev) return;
      const lesson = getLesson(prev);
      get().setLesson(prev);
      get().setStep(lesson.steps.length - 1);
    }
  },
  togglePlay: () => set((s) => ({ playing: !s.playing })),
  toggleExplain: () => set((s) => ({ explain: !s.explain })),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
  toggleRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
  bumpReplay: () => set((s) => ({ replay: s.replay + 1 })),
  toggleHelp: () => set((s) => ({ help: !s.help })),
  patch: (p) => set(p),
  answerQuiz: (q, choice) =>
    set((s) => {
      const quiz = s.quiz.slice();
      quiz[q] = choice;
      return { quiz };
    }),
  setLocale: (locale) => set({ locale }),
  setTextScale: (n) => set({ textScale: Math.min(1.45, Math.max(0.85, n)) }),
  togglePresent: () => set((s) => ({ presenting: !s.presenting })),
  togglePhotos: () => set((s) => ({ photos: !s.photos })),
}));

export function progressLabel(): string {
  const id = useSim.getState().lessonId;
  return `${lessonIndex(id) + 1}/${lessons.length}`;
}