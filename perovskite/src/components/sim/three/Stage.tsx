import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ui } from "@/lib/sim/i18n";
import { getLesson } from "@/lib/sim/content";
import { storyOf } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import { crystalScenes } from "./scenesCrystal";
import { earlyScenes } from "./scenesEarly";
import { lateScenes } from "./scenesLate";
import { RaceDiagram } from "../RaceDiagram";
import { StoryRig, poseFor } from "./story/camera";
import { storyScenes } from "./story";
import { LabelList, LabelProjector } from "./story/labels";

const CAM: Record<string, [number, number, number]> = {
  default: [4.4, 2.5, 5.2],
  crystal: [3.4, 2.15, 4.1],
  wide: [6.4, 3.2, 7.2],
  plot: [0.2, 1.5, 7.4],
  stack: [4.6, 1.8, 6.1],
  module: [2.4, 3.15, 4.35],
};

const SCENES = { ...earlyScenes, ...crystalScenes, ...lateScenes, ...storyScenes };

function CameraRig({ cam }: { cam: string }) {
  const { camera, controls } = useThree();
  const applied = useRef("");
  useFrame(() => {
    if (applied.current === cam) return;
    const orbit = controls as { target?: THREE.Vector3; update?: () => void } | null;
    if (!orbit?.target) return;
    const p = CAM[cam] ?? CAM.default;
    camera.position.set(p?.[0] ?? 4.4, p?.[1] ?? 2.5, p?.[2] ?? 5.2);
    orbit.target.set(0, 0, 0);
    orbit.update?.();
    applied.current = cam;
  });
  return null;
}

function World({ scene, step }: { scene: string; step: number }) {
  const Cmp = SCENES[scene as keyof typeof SCENES] ?? earlyScenes.sun;
  return <Cmp step={step} />;
}

export function Stage() {
  const lessonId = useSim((s) => s.lessonId);
  const step = useSim((s) => s.step);
  const replay = useSim((s) => s.replay);
  const autoRotate = useSim((s) => s.autoRotate);
  const camLevel = useSim((s) => s.camLevel);
  const lesson = getLesson(lessonId);
  const micro = useSim((s) => s.micro);
  const spec = lesson.story ? storyOf(lesson.id) : undefined;
  // 3.8: with the microscope off the camera stays on the whole solar cell
  const stepCam = (spec?.group === "degrade" || spec?.microSwitch) && !micro ? "1" : (spec?.steps[step]?.cam ?? "1");
  const storyCam = lesson.story ? (camLevel ? String(camLevel) : stepCam) : "";
  const locale = useSim((s) => s.locale);
  const theme = useSim((s) => s.theme);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="stage-wait">{ui(locale, "building")}</div>;
  if (lesson.scene === "race") {
    return (
      <div className="race-diagram">
        <RaceDiagram step={step} />
      </div>
    );
  }
  const startPose = lesson.story ? poseFor(lesson.scene, storyCam) : null;
  return (
    <>
    <Canvas
      camera={{ position: startPose?.pos ?? CAM[lesson.cam] ?? CAM.default, fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[theme === "light" ? "#f1eaf6" : "#0e0a13"]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#f4efe6", "#1a140e", 0.45]} />
      <directionalLight position={[4.5, 6, 3]} intensity={1.45} />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#8ea2ff" />
      <Grid
        args={[24, 24]}
        cellSize={0.5}
        cellThickness={0.55}
        sectionSize={2}
        sectionThickness={1}
        fadeDistance={18}
        fadeStrength={1.5}
        cellColor="#24303a"
        sectionColor="#314555"
        position={[0, -1.65, 0]}
        infiniteGrid
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate && !lesson.story}
        autoRotateSpeed={0.45}
        maxDistance={lesson.story ? 14 : 16}
        minDistance={lesson.story ? 0.5 : 1.6}
      />
      {lesson.story ? <StoryRig scene={lesson.scene} cam={storyCam} /> : <CameraRig cam={lesson.cam} />}
      <World key={`${lesson.scene}-${replay}`} scene={lesson.scene} step={step} />
      {lesson.story ? <LabelProjector /> : null}
    </Canvas>
    {lesson.story ? <LabelList /> : null}
    </>
  );
}
