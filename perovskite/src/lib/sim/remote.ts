import { useEffect } from "react";
import { chapters, getLesson, lessons, nextLessonId, prevLessonId } from "./content";
import { tr } from "./i18n";
import { useSim, type Locale } from "./store";

/**
 * Bridge to the iOS remote (see scripts/remote-control-plugin.mjs): applies the
 * commands the phone sends and posts back what the audience is looking at.
 * Dev server only; production builds have no relay and skip this entirely.
 */

type Command =
  | { cmd: "next" | "prev" | "nextLesson" | "prevLesson" | "togglePlay" | "replay" }
  | { cmd: "toggle"; key: "explain" | "theme" | "rotate" | "nav" | "labels" | "slow" | "auto" | "present" | "photos" }
  | { cmd: "goto"; lesson: string; step?: number }
  | { cmd: "step"; step: number }
  | { cmd: "locale"; locale: Locale }
  | { cmd: "textScale"; delta: number };

function apply(c: Command) {
  const s = useSim.getState();
  switch (c.cmd) {
    case "next":
      return s.next();
    case "prev":
      return s.prev();
    case "nextLesson": {
      const id = nextLessonId(s.lessonId);
      return id ? s.setLesson(id) : undefined;
    }
    case "prevLesson": {
      const id = prevLessonId(s.lessonId);
      return id ? s.setLesson(id) : undefined;
    }
    case "togglePlay":
      return s.togglePlay();
    case "replay":
      return getLesson(s.lessonId).story ? s.resetStory() : s.bumpReplay();
    case "goto":
      if (!lessons.some((l) => l.id === c.lesson)) return;
      s.setLesson(c.lesson);
      return c.step ? s.setStep(c.step) : undefined;
    case "step":
      return s.setStep(c.step);
    case "locale":
      return c.locale === "vi" || c.locale === "en" ? s.setLocale(c.locale) : undefined;
    case "textScale":
      return s.setTextScale(s.textScale + c.delta);
    case "toggle":
      switch (c.key) {
        case "explain":
          return s.toggleExplain();
        case "theme":
          return s.toggleTheme();
        case "rotate":
          return s.toggleRotate();
        case "nav":
          return s.toggleNav();
        case "labels":
          return s.toggleLabels();
        case "slow":
          return s.toggleSlow();
        case "auto":
          return s.toggleAuto();
        case "present":
          return s.togglePresent();
        case "photos":
          return s.togglePhotos();
      }
  }
}

function outline() {
  const known = new Set(lessons.map((l) => l.id));
  return chapters.map((ch) => ({
    id: ch.id,
    num: ch.num,
    title: ch.title,
    titleEn: tr("en", ch.title),
    lessons: ch.lessonIds
      .filter((id) => known.has(id))
      .map((id) => {
        const l = getLesson(id);
        return { id, title: l.title, titleEn: tr("en", l.title), steps: l.steps.length };
      }),
  }));
}

function snapshot() {
  const s = useSim.getState();
  const lesson = getLesson(s.lessonId);
  const step = lesson.steps[Math.min(s.step, lesson.steps.length - 1)];
  const chapter = chapters.find((c) => c.id === lesson.chapter);
  const t = (text: string | undefined) => (text ? tr(s.locale, text) : "");
  return {
    lessonId: lesson.id,
    lessonTitle: t(lesson.title),
    chapter: chapter ? `${chapter.num} ${t(chapter.title)}` : "",
    lessonIndex: lessons.findIndex((l) => l.id === lesson.id),
    lessonCount: lessons.length,
    step: s.step,
    stepCount: lesson.steps.length,
    stepTitle: t(step?.title),
    stepBody: t(step?.body),
    stepMore: t(step?.more),
    stepWhy: t(step?.why),
    isStory: lesson.story === true,
    playing: s.playing,
    explain: s.explain,
    theme: s.theme,
    locale: s.locale,
    textScale: s.textScale,
    autoRotate: s.autoRotate,
    navOpen: s.navOpen,
    labels: s.labels,
    slow: s.slow,
    auto: s.auto,
    presenting: s.presenting,
    photos: s.photos,
  };
}

export function useRemoteControl() {
  useEffect(() => {
    if (!import.meta.env.DEV || typeof EventSource === "undefined") return;

    let timer: number | undefined;
    let sendOutline = true;
    const post = () => {
      const body = { ...snapshot(), outline: sendOutline ? outline() : undefined };
      sendOutline = false;
      fetch("/__remote/state", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => {
        sendOutline = true;
      });
    };

    const source = new EventSource("/__remote/events?role=deck");
    source.onopen = () => {
      sendOutline = true;
      post();
    };
    source.addEventListener("cmd", (e) => {
      try {
        apply(JSON.parse((e as MessageEvent<string>).data) as Command);
      } catch {
        /* ignore a malformed command */
      }
    });

    const unsubscribe = useSim.subscribe(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(post, 80);
    });

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
      source.close();
    };
  }, []);
}
