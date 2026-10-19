import { Eye, EyeOff, FastForward, Gauge, Minimize2, Sparkles } from "lucide-react";
import { tr, ui } from "@/lib/sim/i18n";
import { egFromHalide } from "@/lib/sim/physics";
import { useSim, type AbsorbMode, type Coating, type DefectMode } from "@/lib/sim/store";
import { L, STORY_BADGES, storyOf, su, type StorySpec } from "@/lib/sim/story";

/** The 2D layer on top of the 3D scene in sections 3.1 – 3.6: story card, controls, final message. */
export function StoryOverlay({ lessonId }: { lessonId: string }) {
  const spec = storyOf(lessonId);
  const step = useSim((s) => s.step);
  const locale = useSim((s) => s.locale);
  const presenting = useSim((s) => s.presenting);
  if (!spec) return null;
  const current = spec.steps[step] ?? spec.steps[0]!;
  const tx = (text: string) => tr(locale, text);

  return (
    <div className="story-layer">
      <div className="story-card">
        <span className="story-kicker">
          {tx(spec.section)} · {ui(locale, "step")} {step + 1}/{spec.steps.length}
        </span>
        <strong>{tx(current.title)}</strong>
        <p>{tx(current.body)}</p>
        {current.why ? (
          <p className="story-why">
            <b>{su(locale, "why")}:</b> {tx(current.why)}
          </p>
        ) : null}
      </div>

      {spec.id === "recap" ? <RecapChain step={step} /> : null}

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

function FinalMessage({ spec }: { spec: StorySpec }) {
  const locale = useSim((s) => s.locale);
  return (
    <div className="story-final" role="status">
      <strong>{tr(locale, spec.final)}</strong>
      <span>
        <b>{su(locale, "q")}:</b> {tr(locale, spec.qa.q)} <b>→</b> {tr(locale, spec.qa.a)}
      </span>
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
  const patch = useSim((s) => s.patch);
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
              {n} · {su(locale, n === 1 ? "cam1" : n === 2 ? "cam2" : "cam3")}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={labels ? "btn on" : "btn"}
          aria-pressed={labels}
          onClick={toggleLabels}
        >
          {labels ? <Eye size={14} /> : <EyeOff size={14} />}
          {su(locale, "labels")}: {su(locale, labels ? "on" : "off")}
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
    </div>
  );
}

function StoryOptions({ spec, step }: { spec: StorySpec; step: number }) {
  const locale = useSim((s) => s.locale);
  const absorbMode = useSim((s) => s.absorbMode);
  const defectMode = useSim((s) => s.defectMode);
  const coating = useSim((s) => s.coating);
  const br = useSim((s) => s.br);
  const patch = useSim((s) => s.patch);

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
