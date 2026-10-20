import { create } from "zustand";
import { getLesson, lessonIndex, lessons, nextLessonId, prevLessonId } from "./content";
import { fabDefaults, storyOf } from "./story";
import type { Architecture, Cation } from "./types";

export type Locale = "vi" | "en";
export type AbsorbMode = "auto" | "thin" | "thick";
export type DefectMode = "real" | "perfect";
export type Coating = "spin" | "slot" | "inkjet";
/** 3.8 switches: "auto" lets the lesson's own script decide. */
export type LightMode = "auto" | "on" | "off";
export type UvMode = "auto" | "visible" | "uv";
export type FieldMode = "auto" | "on" | "off";

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
  locale: Locale;
  textScale: number;
  presenting: boolean;
  photos: boolean;
  /** Story lessons (3.1 – 3.6): scientific labels on or off. */
  labels: boolean;
  /** Story lessons: slow animations for the classroom. */
  slow: boolean;
  /** Story lessons: move on to the next step by itself when a step finishes. */
  auto: boolean;
  /** Story lessons: camera level chosen by the viewer (0 = the step decides). */
  camLevel: 0 | 1 | 2 | 3;
  /** The viewer moved the I/Br slider, so the demo sweep must stop writing to it. */
  brLock: boolean;
  absorbMode: AbsorbMode;
  defectMode: DefectMode;
  coating: Coating;
  /** 3.8: microscopic zoom. Off keeps the camera on the whole solar cell. */
  micro: boolean;
  /** 3.8: bumped by "Camera reset" so the camera glides back to the pose of the step. */
  camNonce: number;
  lightMode: LightMode;
  uvMode: UvMode;
  fieldMode: FieldMode;
  /** Chapter 4: current value of each control of the open lesson (see FabControl). */
  fab: Record<string, number | string>;
  /** Chapter 4: the open citation card (reference number) or null. */
  cite: number | null;
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
  setLocale: (locale: Locale) => void;
  setTextScale: (n: number) => void;
  togglePresent: () => void;
  togglePhotos: () => void;
  toggleLabels: () => void;
  toggleSlow: () => void;
  toggleAuto: () => void;
  /** Back to the first step with every story option at its starting value. */
  resetStory: () => void;
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
  locale: "vi",
  textScale: 1,
  presenting: false,
  photos: false,
  labels: true,
  slow: false,
  auto: false,
  camLevel: 0,
  brLock: false,
  absorbMode: "auto",
  defectMode: "real",
  coating: "spin",
  micro: true,
  camNonce: 0,
  lightMode: "auto",
  uvMode: "auto",
  fieldMode: "auto",
  fab: {},
  cite: null,
  setLesson: (id) => {
    const lesson = getLesson(id);
    set((s) => ({
      lessonId: lesson.id,
      step: 0,
      playing: lesson.story === true,
      camLevel: 0,
      brLock: false,
      absorbMode: "auto",
      defectMode: "real",
      lightMode: "auto",
      uvMode: "auto",
      fieldMode: "auto",
      fab: fabDefaults(storyOf(lesson.id)),
      cite: null,
      // the temperature slider of 3.8.3 must not leak into the phase lesson
      temp: 25,
      inspect: null,
      query: "",
      explain: lesson.id === "glossary" || lesson.id === "refs" ? true : s.explain,
      visited: s.visited.includes(lesson.id) ? s.visited : [...s.visited, lesson.id],
    }));
    const tune = lesson.tune?.[0];
    if (tune) set(tune);
  },
  setStep: (n) => {
    const lesson = getLesson(get().lessonId);
    const step = Math.max(0, Math.min(lesson.steps.length - 1, n));
    // Choosing a step in a story lesson always plays it, so the presenter sees the motion.
    set(lesson.story ? { step, inspect: null, camLevel: 0, brLock: false, playing: true } : { step, inspect: null });
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
  setLocale: (locale) => set({ locale }),
  setTextScale: (n) => set({ textScale: Math.min(1.45, Math.max(0.85, n)) }),
  togglePresent: () => set((s) => ({ presenting: !s.presenting })),
  togglePhotos: () => set((s) => ({ photos: !s.photos })),
  toggleLabels: () => set((s) => ({ labels: !s.labels })),
  toggleSlow: () => set((s) => ({ slow: !s.slow })),
  toggleAuto: () => set((s) => ({ auto: !s.auto })),
  resetStory: () => {
    const lesson = getLesson(get().lessonId);
    set((s) => ({
      step: 0,
      playing: true,
      camLevel: 0,
      brLock: false,
      absorbMode: "auto",
      defectMode: "real",
      lightMode: "auto",
      uvMode: "auto",
      fieldMode: "auto",
      fab: fabDefaults(storyOf(lesson.id)),
      cite: null,
      replay: s.replay + 1,
      inspect: null,
    }));
    const tune = lesson.tune?.[0];
    if (tune) set(tune);
  },
}));

// Dev only: lets the browser tests pick a lesson and step directly (compiled out of production builds).
if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as unknown as { __sim?: typeof useSim }).__sim = useSim;
}

export function progressLabel(): string {
  const id = useSim.getState().lessonId;
  return `${lessonIndex(id) + 1}/${lessons.length}`;
}