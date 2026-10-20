import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from "react";
import * as THREE from "three";
import { tr } from "@/lib/sim/i18n";
import { useSim } from "@/lib/sim/store";

/**
 * Scientific labels for the story scenes.
 *
 * A `StoryTag` inside the Canvas only registers a position (a bare Object3D that follows its parents).
 * `LabelProjector` (inside the Canvas) moves the matching DOM element each frame, and `LabelList`
 * (outside the Canvas, ordinary React DOM) draws the elements. No drei `Html`, so no extra React roots
 * are created and destroyed while the story steps change.
 */
export type TagKind =
  "concept" | "layer" | "particle" | "good" | "bad" | "tiny" | "iodide" | "bromide";

type Entry = {
  id: number;
  obj: THREE.Object3D;
  text: string;
  sub?: string;
  kind: TagKind;
  minor: boolean;
};

let nextId = 1;
const entries = new Map<number, Entry>();
const elements = new Map<number, HTMLDivElement>();
const listeners = new Set<() => void>();
let snapshot: Entry[] = [];

function emit() {
  snapshot = Array.from(entries.values());
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return "";
}

/** Place inside the Canvas, at the 3D point the label should point to. */
export function StoryTag({
  position,
  children,
  kind = "concept",
  minor = false,
  sub,
}: {
  position: [number, number, number];
  children: ReactNode;
  kind?: TagKind;
  /** Hidden in presentation mode, which keeps only the essential labels. */
  minor?: boolean;
  sub?: string;
}) {
  const ref = useRef<THREE.Object3D>(null);
  const text = textOf(children);
  // One id per tag for its whole life, so a changing text updates the label instead of re-creating it.
  const id = useRef(0);
  if (id.current === 0) id.current = nextId++;
  useLayoutEffect(() => {
    const obj = ref.current;
    if (!obj) return;
    entries.set(id.current, { id: id.current, obj, text, sub, kind, minor });
    emit();
  }, [text, sub, kind, minor]);
  useLayoutEffect(() => {
    const mine = id.current;
    return () => {
      entries.delete(mine);
      elements.delete(mine);
      emit();
    };
  }, []);
  return <object3D ref={ref} position={position} />;
}

/** Inside the Canvas: keeps every label glued to its 3D point. */
export function LabelProjector() {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    for (const e of entries.values()) {
      const el = elements.get(e.id);
      if (!el) continue;
      e.obj.getWorldPosition(v);
      v.project(camera);
      if (v.z > 1 || v.z < -1) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    }
  });
  return null;
}

/** Outside the Canvas: the label elements themselves. */
export function LabelList() {
  const list = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => snapshot,
  );
  const labels = useSim((s) => s.labels);
  const presenting = useSim((s) => s.presenting);
  const locale = useSim((s) => s.locale);
  const textScale = useSim((s) => s.textScale);
  if (!labels) return <div className="story-labels" aria-hidden="true" />;
  return (
    <div className="story-labels" aria-hidden="true">
      {list
        .filter((e) => !(presenting && e.minor))
        .map((e) => (
          <div
            key={e.id}
            ref={(el) => {
              if (el) elements.set(e.id, el);
              else elements.delete(e.id);
            }}
            className={`float-label story-tag tag-${e.kind}`}
            style={{ fontSize: `${12.5 * textScale}px`, visibility: "hidden" }}
          >
            {tr(locale, e.text)}
            {e.sub ? <small>{tr(locale, e.sub)}</small> : null}
          </div>
        ))}
    </div>
  );
}
