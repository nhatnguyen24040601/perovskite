import { Crosshair, Eye, EyeOff, FastForward, Gauge, Info, Microscope, Minimize2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { tr, ui } from "@/lib/sim/i18n";
import { egFromHalide } from "@/lib/sim/physics";
import {
  useSim,
  type AbsorbMode,
  type Coating,
  type DefectMode,
  type FieldMode,
  type LightMode,
  type UvMode,
} from "@/lib/sim/store";
import {
  DEGRADE_TABS,
  L,
  STORY_BADGES,
  STRESS_CHAIN,
  STRESS_ROWS,
  storyOf,
  su,
  type FabControl,
  type StorySpec,
} from "@/lib/sim/story";
import { C4 } from "@/lib/sim/story4";
import { BackToOverview, FactsPanel } from "./Ch4Pages";
import { Ch5Panel, FactsPanel5 } from "./Ch5Pages";
import { RichText } from "./RichText";

/** The 2D layer on top of the 3D scene in sections 3.1 – 3.6: story card, controls, final message. */
export function StoryOverlay({ lessonId }: { lessonId: string }) {
  const spec = storyOf(lessonId);
  const step = useSim((s) => s.step);
  const locale = useSim((s) => s.locale);
  const presenting = useSim((s) => s.presenting);
  if (!spec) return null;
  const current = spec.steps[step] ?? spec.steps[0]!;
  const tx = (text: string) => tr(locale, text);
  const cites = (current.cite ?? []).map((n) => `[${n}]`).join(" ");

  return (
    <div className="story-layer">
      <div className="story-top">
        {spec.group === "degrade" ? <DegradeTabs current={spec.id} /> : null}
        <div className="story-card">
          <span className="story-kicker">
            {tx(spec.section)} · {ui(locale, "step")} {step + 1}/{spec.steps.length}
          </span>
          <strong>{tx(current.title)}</strong>
          {spec.brief ? null : <CardText key={`${spec.id}-${step}`} text={tx(current.body)} cites={cites} />}
          {current.why ? (
            <p className="story-why">
              <b>{su(locale, "why")}:</b> {tx(current.why)}
            </p>
          ) : null}
          {spec.simple && step === 0 ? (
            <p className="story-simple">
              <b>{tx(C4.simple)}:</b> “{tx(spec.simple)}”
            </p>
          ) : null}
        </div>
        {spec.facts || spec.factList ? <FactsToggle spec={spec} /> : null}
      </div>
      {spec.group === "design" ? <Ch5Panel spec={spec} step={step} /> : null}

      {spec.id === "recap" ? <RecapChain step={step} /> : null}
      {spec.id === "dall" ? <StressSummary step={step} /> : null}

      {presenting ? <PresentChrome spec={spec} /> : null}
      <div className="story-stack">
        {current.info ? (
          <div className="story-info" role="note">
            {tx(current.info)}
          </div>
        ) : null}
        {current.final ? <FinalMessage spec={spec} /> : null}
        <StoryBar spec={spec} step={step} />
      </div>
    </div>
  );
}

/** The step text: long texts show three lines and a "Read more" switch, so the 3D model stays visible. */
function CardText({ text, cites }: { text: string; cites: string }) {
  const locale = useSim((s) => s.locale);
  const presenting = useSim((s) => s.presenting);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [text]);
  const long = text.length > 190 && !presenting;
  return (
    <>
      <p className={long && !open ? "story-clamp" : undefined}>
        <RichText text={text} />
      </p>
      {cites ? (
        <p className="story-cites">
          <RichText text={cites} />
        </p>
      ) : null}
      {long ? (
        <button type="button" className="story-more" onClick={() => setOpen(!open)}>
          {su(locale, open ? "less" : "more")}
        </button>
      ) : null}
    </>
  );
}

function FactsToggle({ spec }: { spec: StorySpec }) {
  const locale = useSim((s) => s.locale);
  const [open, setOpen] = useState(false);
  if (!spec.facts && !spec.factList) return null;
  return (
    <>
      <button
        type="button"
        className={open ? "btn on facts-btn" : "btn facts-btn"}
        aria-pressed={open}
        onClick={() => setOpen(!open)}
      >
        <Info size={14} />
        {tr(locale, C4.facts)}
      </button>
      {open ? (
        spec.facts ? <FactsPanel facts={spec.facts} onClose={() => setOpen(false)} /> : <FactsPanel5 spec={spec} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

/** The sliders and switches of a Chapter 4 lesson, shown on the steps they belong to. */
function FabControls({ spec, step }: { spec: StorySpec; step: number }) {
  const locale = useSim((s) => s.locale);
  const fab = useSim((s) => s.fab);
  const patch = useSim((s) => s.patch);
  const set = (key: string, v: number | string) => patch({ fab: { ...fab, [key]: v } });
  const shown = (spec.controls ?? []).filter((c) => !c.at || c.at.includes(step));
  if (shown.length === 0) return null;
  const render = (c: FabControl) => {
    if (c.kind === "slider") {
      const v = Number(fab[c.key] ?? c.def);
      return (
        <div key={c.key} className="fab-group fab-slider">
          <span className="story-cap">{tr(locale, c.label)}</span>
          <span className="story-cap">{tr(locale, c.lo)}</span>
          <input
            type="range"
            min={c.min}
            max={c.max}
            step={c.step}
            value={v}
            aria-label={tr(locale, c.label)}
            onChange={(e) => set(c.key, Number(e.target.value))}
          />
          <span className="story-cap">{tr(locale, c.hi)}</span>
        </div>
      );
    }
    const cur = String(fab[c.key] ?? c.def);
    return (
      <div key={c.key} className="fab-group">
        <span className="story-cap">{tr(locale, c.label)}</span>
        <div className="seg" role="group" aria-label={tr(locale, c.label)}>
          {c.opts.map((o) => (
            <button
              key={o.v}
              type="button"
              className={cur === o.v ? "btn on" : "btn"}
              aria-pressed={cur === o.v}
              onClick={() => set(c.key, o.v)}
            >
              {tr(locale, o.label)}
            </button>
          ))}
        </div>
      </div>
    );
  };
  return <div className="story-row fab-row">{shown.map(render)}</div>;
}

function FinalMessage({ spec }: { spec: StorySpec }) {
  const locale = useSim((s) => s.locale);
  const compact = spec.brief || spec.group === "design";
  return (
    <div className={compact ? "story-final story-final-brief" : "story-final"} role="status">
      <strong>{tr(locale, spec.final)}</strong>
      {compact ? null : (
        <span>
          <b>{su(locale, "q")}:</b> {tr(locale, spec.qa.q)} <b>→</b> {tr(locale, spec.qa.a)}
        </span>
      )}
    </div>
  );
}

function exitPresenting() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else useSim.getState().togglePresent();
}

function PresentChrome({ spec }: { spec: StorySpec }) {
  const locale = useSim((s) => s.locale);
  const step = useSim((s) => s.step);
  return (
    <>
      <div className="story-present-title">
        <span>{tr(locale, spec.title)}</span>
        <span className="story-present-step">
          {step + 1}/{spec.steps.length}
        </span>
      </div>
      <p className="story-keys">{su(locale, "keys")}</p>
      <button type="button" className="btn story-exit" onClick={exitPresenting}>
        <Minimize2 size={14} />
        {ui(locale, "presentExit")}
      </button>
    </>
  );
}

/** The five mechanisms of 3.8 and the summary: one click moves to another. */
function DegradeTabs({ current }: { current: string }) {
  const locale = useSim((s) => s.locale);
  const setLesson = useSim((s) => s.setLesson);
  return (
    <div className="story-tabs" role="tablist" aria-label={su(locale, "tabs")}>
      {DEGRADE_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === current}
          className={tab.id === current ? "btn on" : "btn"}
          onClick={(e) => {
            setLesson(tab.id);
            e.currentTarget.blur();
          }}
        >
          <span className="story-tab-icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="story-tab-name">{tr(locale, tab.name)}</span>
        </button>
      ))}
    </div>
  );
}

/** Summary screen: the five stresses side by side, then the cause → consequence chain. */
function StressSummary({ step }: { step: number }) {
  const locale = useSim((s) => s.locale);
  if (step <= 5) {
    return (
      <ul className="story-compare" aria-label={su(locale, "compare")}>
        {STRESS_ROWS.map((row, i) => (
          <li key={row.name} className={step === i + 1 ? "on" : ""}>
            <span className="story-compare-head">
              <span className="story-compare-icon" aria-hidden="true">
                {row.icon}
              </span>
              <b>{tr(locale, row.name)}</b>
            </span>
            <span className="story-compare-effect">{tr(locale, row.effect)}</span>
          </li>
        ))}
      </ul>
    );
  }
  const k = step === 6 ? 1 : step === 7 ? 3 : 4;
  return (
    <div className="story-chain story-chain-down" aria-label={su(locale, "chain")}>
      <ol>
        {STRESS_CHAIN.map((name, i) => (
          <li key={name} className={i === k ? "on" : i < k ? "seen" : i > k ? "later" : ""}>
            {tr(locale, name)}
          </li>
        ))}
      </ol>
    </div>
  );
}

const CHAIN = [L.sun, L.absorberNode, L.pairNode, L.transportNode, L.electricity];

/** SUNLIGHT → ABSORBER → ELECTRON + HOLE → TRANSPORT → ELECTRICITY, lit one link at a time. */
function RecapChain({ step }: { step: number }) {
  const locale = useSim((s) => s.locale);
  return (
    <div className="story-chain" aria-label={su(locale, "chain")}>
      <ol>
        {CHAIN.map((name, i) => (
          <li key={name} className={step >= 5 || i === step ? "on" : i < step ? "seen" : ""}>
            {tr(locale, name)}
          </li>
        ))}
      </ol>
      {step >= 5 ? (
        <ul className="story-badges">
          {STORY_BADGES.map((b) => (
            <li key={b.text}>
              <span aria-hidden="true">{b.icon}</span> {tr(locale, b.text)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function StoryBar({ spec, step }: { spec: StorySpec; step: number }) {
  const locale = useSim((s) => s.locale);
  const labels = useSim((s) => s.labels);
  const slow = useSim((s) => s.slow);
  const auto = useSim((s) => s.auto);
  const camLevel = useSim((s) => s.camLevel);
  const toggleLabels = useSim((s) => s.toggleLabels);
  const toggleSlow = useSim((s) => s.toggleSlow);
  const toggleAuto = useSim((s) => s.toggleAuto);
  const micro = useSim((s) => s.micro);
  const patch = useSim((s) => s.patch);
  const camNonce = useSim((s) => s.camNonce);
  const cam = spec.steps[step]?.cam ?? "1";
  const active = camLevel || (/^[123]$/.test(cam) ? Number(cam) : 0);

  return (
    <div
      className="story-bar"
      // keyboard shortcuts (← → Space R) must keep working after a click, so controls give back the focus
      onClick={(e) => (e.target as HTMLElement).closest("button")?.blur()}
      onPointerUp={(e) => (e.target as HTMLElement).closest("input")?.blur()}
    >
      <div className="story-row">
        <BackToOverview spec={spec} />
        <span className="story-cap">{su(locale, "view")}</span>
        <div className="seg" role="group" aria-label={su(locale, "view")}>
          {([1, 2, 3] as const).map((n) => (
            <button
              key={n}
              type="button"
              className={active === n ? "btn on" : "btn"}
              aria-pressed={active === n}
              onClick={() => patch({ camLevel: n })}
            >
              {n}
              <span className="story-btn-text">
                {" · "}
                {spec.views ? tr(locale, spec.views[n - 1]!) : su(locale, n === 1 ? "cam1" : n === 2 ? "cam2" : "cam3")}
              </span>
            </button>
          ))}
        </div>
        {spec.group === "degrade" || spec.microSwitch ? (
          <button
            type="button"
            className={micro ? "btn on" : "btn"}
            aria-pressed={micro}
            title={su(locale, "micro")}
            onClick={() => patch({ micro: !micro, camLevel: 0, camNonce: camNonce + 1 })}
          >
            <Microscope size={14} />
            <span className="story-btn-text">
              {su(locale, "micro")}: {su(locale, micro ? "on" : "off")}
            </span>
          </button>
        ) : null}
        <button
          type="button"
          className="btn"
          title={su(locale, "camReset")}
          aria-label={su(locale, "camReset")}
          onClick={() => patch({ camLevel: 0, camNonce: camNonce + 1 })}
        >
          <Crosshair size={14} />
        </button>
        <button
          type="button"
          className={labels ? "btn on" : "btn"}
          aria-pressed={labels}
          onClick={toggleLabels}
        >
          {labels ? <Eye size={14} /> : <EyeOff size={14} />}
          <span className="story-btn-text">
            {su(locale, "labels")}: {su(locale, labels ? "on" : "off")}
          </span>
        </button>
        <div className="seg story-speed" role="group" aria-label={su(locale, "speed")}>
          <button
            type="button"
            className={slow ? "btn" : "btn on"}
            aria-pressed={!slow}
            onClick={() => slow && toggleSlow()}
          >
            <Gauge size={14} />
            {su(locale, "normal")}
          </button>
          <button
            type="button"
            className={slow ? "btn on" : "btn"}
            aria-pressed={slow}
            onClick={() => !slow && toggleSlow()}
          >
            {su(locale, "slow")}
          </button>
        </div>
        <button
          type="button"
          className={auto ? "btn on story-auto" : "btn story-auto"}
          aria-pressed={auto}
          onClick={toggleAuto}
        >
          <FastForward size={14} />
          {su(locale, "auto")}
        </button>
      </div>
      <StoryOptions spec={spec} step={step} />
      <FabControls spec={spec} step={step} />
    </div>
  );
}

function StoryOptions({ spec, step }: { spec: StorySpec; step: number }) {
  const locale = useSim((s) => s.locale);
  const absorbMode = useSim((s) => s.absorbMode);
  const defectMode = useSim((s) => s.defectMode);
  const coating = useSim((s) => s.coating);
  const br = useSim((s) => s.br);
  const temp = useSim((s) => s.temp);
  const lightMode = useSim((s) => s.lightMode);
  const uvMode = useSim((s) => s.uvMode);
  const fieldMode = useSim((s) => s.fieldMode);
  const patch = useSim((s) => s.patch);

  if (spec.options === "light") {
    const modes: LightMode[] = ["auto", "on", "off"];
    const name: Record<LightMode, "lightAuto" | "lightOnBtn" | "lightOffBtn"> = {
      auto: "lightAuto",
      on: "lightOnBtn",
      off: "lightOffBtn",
    };
    return (
      <div className="story-row">
        <span className="story-cap">{su(locale, "lightSwitch")}</span>
        <div className="seg" role="group" aria-label={su(locale, "lightSwitch")}>
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              className={lightMode === m ? "btn on" : "btn"}
              aria-pressed={lightMode === m}
              onClick={() => patch({ lightMode: m })}
            >
              {su(locale, name[m])}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (spec.options === "uv") {
    const pick = (m: UvMode) => patch({ uvMode: uvMode === m ? "auto" : m });
    return (
      <div className="story-row">
        <div className="seg" role="group" aria-label={su(locale, "lightSwitch")}>
          <button
            type="button"
            className={uvMode === "visible" ? "btn on" : "btn"}
            aria-pressed={uvMode === "visible"}
            onClick={() => pick("visible")}
          >
            {su(locale, "visibleBtn")}
          </button>
          <button
            type="button"
            className={uvMode === "uv" ? "btn on" : "btn"}
            aria-pressed={uvMode === "uv"}
            onClick={() => pick("uv")}
          >
            {su(locale, "uvBtn")}
          </button>
        </div>
      </div>
    );
  }

  if (spec.options === "field") {
    const modes: FieldMode[] = ["auto", "on", "off"];
    const name: Record<FieldMode, "lightAuto" | "lightOnBtn" | "lightOffBtn"> = {
      auto: "lightAuto",
      on: "lightOnBtn",
      off: "lightOffBtn",
    };
    return (
      <div className="story-row">
        <span className="story-cap">{su(locale, "fieldSwitch")}</span>
        <div className="seg" role="group" aria-label={su(locale, "fieldSwitch")}>
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              className={fieldMode === m ? "btn on" : "btn"}
              aria-pressed={fieldMode === m}
              onClick={() => patch({ fieldMode: m })}
            >
              {su(locale, name[m])}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (spec.options === "heat") {
    return (
      <div className="story-row story-slider">
        <span className="story-cap">{su(locale, "temperature")}</span>
        <div className="story-temp">
          <input
            type="range"
            min={25}
            max={100}
            step={5}
            value={Math.round(temp)}
            aria-label={su(locale, "temperature")}
            onChange={(e) => patch({ temp: Number(e.target.value) })}
          />
          <div className="story-ticks" aria-hidden="true">
            {[25, 50, 75, 100].map((n) => (
              <span key={n}>{n} °C</span>
            ))}
          </div>
        </div>
        <span className="story-eg">{Math.round(temp)} °C</span>
        <span className="story-cap">{su(locale, "illustration")}</span>
      </div>
    );
  }

  if (spec.options === "absorb" && step === 3) {
    const pick = (m: AbsorbMode) => patch({ absorbMode: absorbMode === m ? "auto" : m });
    return (
      <div className="story-row">
        <span className="story-cap">
          <Sparkles size={13} /> {su(locale, "thickHint")}
        </span>
        <div className="seg" role="group">
          <button
            type="button"
            className={absorbMode === "thin" ? "btn on" : "btn"}
            onClick={() => pick("thin")}
          >
            {su(locale, "thin")}
          </button>
          <button
            type="button"
            className={absorbMode === "thick" ? "btn on" : "btn"}
            onClick={() => pick("thick")}
          >
            {su(locale, "thick")}
          </button>
        </div>
      </div>
    );
  }

  if (spec.options === "defects" && step === 3) {
    return (
      <div className="story-row">
        <div className="seg" role="group">
          {(["perfect", "real"] as DefectMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={defectMode === m ? "btn on" : "btn"}
              onClick={() => patch({ defectMode: m })}
            >
              {su(locale, m)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (spec.options === "coating" && (step === 1 || step === 2)) {
    return (
      <div className="story-row">
        <span className="story-cap">{su(locale, "method")}</span>
        <div className="seg" role="group">
          {(["spin", "slot", "inkjet"] as Coating[]).map((m) => (
            <button
              key={m}
              type="button"
              className={coating === m ? "btn on" : "btn"}
              onClick={() => patch({ coating: m })}
            >
              {su(locale, m)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (spec.options === "bandgap" && step !== 4) {
    return (
      <div className="story-row story-slider">
        <span className="story-cap">{su(locale, "iodide")}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(br)}
          aria-label={su(locale, "ratio")}
          onChange={(e) => patch({ br: Number(e.target.value), brLock: true })}
        />
        <span className="story-cap">{su(locale, "bromide")}</span>
        <span className="story-eg">
          Br {Math.round(br)}% · Eg {egFromHalide(br, 0).toFixed(2)} eV
        </span>
      </div>
    );
  }
  return null;
}
