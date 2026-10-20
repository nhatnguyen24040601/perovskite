import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { egFromHalide, wavelengthHex } from "@/lib/sim/physics";
import { L } from "@/lib/sim/story";
import { useSim } from "@/lib/sim/store";
import {
  Arrow3,
  BeamSet,
  Flashes,
  Lattice,
  StoryTag,
  Swarm,
  buildAtoms,
  burst,
  stepDur,
  useStoryClock,
  type Atom,
  type AtomOut,
  type FlashApi,
  type SwarmApi,
} from "./storyKit";
import { COLOR, between, clamp01, hash1, lerp, smooth, type V3 } from "./world";

/* ── layout ── */
const C: V3 = [-1.05, 0.4, 0]; // crystal centre
const D: V3 = [1.2, 0, 0]; // energy diagram centre
const VB_Y = -0.4;
const STRIP = { x0: -2.0, x1: 2.0, y: -1.3, z: 0.4, h: 0.2 };
const E_LEFT = 3.4;
const E_RIGHT = 1.0;

const CRYSTAL_ATOMS = buildAtoms(3, 3, 3, 0.55);
const CRYSTAL_RADII = { A: 0.1, B: 0.075, X: 0.085 };
const COLORS = { A: COLOR.A, B: COLOR.B, X: COLOR.iodide };
const IODIDE = new THREE.Color(COLOR.iodide);
const BROMIDE = new THREE.Color(COLOR.bromide);

const stripX = (e: number) => lerp(STRIP.x0, STRIP.x1, clamp01((E_LEFT - e) / (E_LEFT - E_RIGHT)));
const gapH = (eg: number) => 0.55 * eg;

/** Six photons of different energy (eV). */
const PHOTONS = [3.0, 2.6, 2.2, 1.9, 1.7, 1.3];
const LANE_X = [-0.55, -0.33, -0.11, 0.11, 0.33, 0.55];
const P_Y0 = 2.25;
const P_SPEED = 1.15;
const P_GAP = 0.55;
const P_PERIOD = 7.4;

/** Tandem demo: perovskite top (≈1.75 eV) over silicon (1.12 eV). */
const TANDEM_E = [3.0, 2.5, 2.0, 1.6, 1.3, 1.15];
const TANDEM_X = [-1.25, -0.75, -0.25, 0.25, 0.75, 1.25];
const TOP_EG = 1.75;

function spectrumTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 8;
  const g = canvas.getContext("2d")!;
  for (let x = 0; x < 512; x++) {
    const e = E_LEFT - (x / 511) * (E_LEFT - E_RIGHT);
    g.fillStyle = e < 1.65 ? "#4a2a2a" : e > 3.1 ? "#6a4aa0" : wavelengthHex(1240 / e);
    g.fillRect(x, 0, 1, 8);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function BandgapScene({ step }: { step: number }) {
  const clock = useStoryClock(step, stepDur("tune", step), 2);
  const tandem = step === 4;
  const chain = step === 3;

  const photons = useRef<SwarmApi>(null);
  const bandE = useRef<SwarmApi>(null);
  const bandH = useRef<SwarmApi>(null);
  const flashes = useRef<FlashApi>(null);
  const tPhotons = useRef<SwarmApi>(null);
  const tFlashes = useRef<FlashApi>(null);
  const cbGroup = useRef<THREE.Group>(null);
  const vbGroup = useRef<THREE.Group>(null);
  const gapLine = useRef<THREE.Mesh>(null);
  const gapTop = useRef<THREE.Mesh>(null);
  const gapBot = useRef<THREE.Mesh>(null);
  const dim = useRef<THREE.Mesh>(null);
  const cut = useRef<THREE.Mesh>(null);
  const cutTag = useRef<THREE.Group>(null);
  const absTag = useRef<THREE.Group>(null);
  const trnTag = useRef<THREE.Group>(null);
  const egTag = useRef<THREE.Group>(null);
  const brShown = useRef(useSim.getState().br);
  const lastWrite = useRef(0);
  const [egText, setEgText] = useState(() => egFromHalide(useSim.getState().br, 0).toFixed(2));
  const [hi, setHi] = useState(0);
  const hiRef = useRef(0);

  const texture = useMemo(() => spectrumTexture(), []);

  // every photon carries the colour of its energy
  useLayoutEffect(() => {
    PHOTONS.forEach((e, i) => photons.current?.tint(i, photonHex(e)));
    TANDEM_E.forEach((e, i) => tPhotons.current?.tint(i, photonHex(e)));
    photons.current?.flush();
    tPhotons.current?.flush();
  }, []);

  const xStyle = useRef({ frac: 0 });
  const style = useMemo(
    () => (a: Atom, out: AtomOut) => {
      if (a.kind === "A") out.color.multiplyScalar(0.55);
      if (a.kind !== "X") return;
      const frac = xStyle.current.frac;
      const rank = hash1(a.id * 1.31 + 4);
      const k = smooth((frac - rank) / 0.06 + 0.5);
      out.color.copy(IODIDE).lerp(BROMIDE, k);
      const bump = Math.exp(-(((frac - rank) / 0.035) ** 2)) * 0.45;
      out.scale = lerp(CRYSTAL_RADII.X, CRYSTAL_RADII.X * 0.84, k) * (1 + bump);
    },
    [],
  );

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const c = clock.current;
    const s = useSim.getState();
    const t = c.t;

    // The demo sweeps the I/Br slider in steps 1 and 3 until the viewer moves it.
    let target = s.br;
    if ((step === 1 || step === 3) && !s.brLock) {
      const period = step === 1 ? 11 : 14;
      target = 50 * (1 - Math.cos((2 * Math.PI * t) / period));
      const now = performance.now();
      if (Math.abs(target - s.br) >= 0.6 && now - lastWrite.current > 70) {
        lastWrite.current = now;
        useSim.setState({ br: target });
      }
    }
    brShown.current += (target - brShown.current) * Math.min(1, dt * 4);
    const frac = clamp01(brShown.current / 100);
    xStyle.current.frac = frac;
    const eg = egFromHalide(brShown.current, 0);
    const txt = eg.toFixed(2);
    setEgText((prev) => (prev === txt ? prev : txt));

    // ── energy diagram ──
    const gap = gapH(eg);
    const cbY = VB_Y + gap;
    cbGroup.current?.position.set(D[0], cbY, D[2]);
    vbGroup.current?.position.set(D[0], VB_Y, D[2]);
    if (gapLine.current) {
      gapLine.current.position.set(D[0] + 0.45, VB_Y + gap / 2, D[2]);
      gapLine.current.scale.set(1, gap, 1);
    }
    gapTop.current?.position.set(D[0] + 0.45, cbY - 0.05, D[2]);
    gapBot.current?.position.set(D[0] + 0.45, VB_Y + 0.05, D[2]);
    egTag.current?.position.set(D[0] - 0.1, VB_Y + gap / 2, D[2]);

    // ── spectrum strip: everything right of the threshold is transmitted ──
    const xc = stripX(eg);
    if (dim.current) {
      const w = Math.max(0.001, STRIP.x1 - xc);
      dim.current.position.set(xc + w / 2, STRIP.y, STRIP.z + 0.004);
      dim.current.scale.set(w, 1, 1);
    }
    cut.current?.position.set(xc, STRIP.y, STRIP.z + 0.01);
    cutTag.current?.position.set(xc, STRIP.y - 0.46, STRIP.z);
    absTag.current?.position.set((STRIP.x0 + xc) / 2, STRIP.y + 0.22, STRIP.z);
    trnTag.current?.position.set((xc + STRIP.x1) / 2, STRIP.y + 0.22, STRIP.z);
    if (absTag.current) absTag.current.visible = xc - STRIP.x0 > 0.7;
    if (trnTag.current) trnTag.current.visible = STRIP.x1 - xc > 0.7;

    const p = photons.current;
    const be = bandE.current;
    const bh = bandH.current;
    const f = flashes.current;
    const tp = tPhotons.current;
    const tf = tFlashes.current;
    if (!p || !be || !bh || !f || !tp || !tf) return;

    // ── photons on the crystal ──
    const run = t % P_PERIOD;
    for (let i = 0; i < 6; i++) {
      const launch = i * P_GAP;
      const local = run - launch;
      const e = PHOTONS[i]!;
      const absorbed = e >= eg;
      const x = C[0] + LANE_X[i]!;
      const yAbs = C[1] + 0.35 - (i % 3) * 0.28;
      const yEnd = C[1] - 1.05;
      const y = P_Y0 - P_SPEED * local;
      const tAbs = (P_Y0 - yAbs) / P_SPEED;
      const tEnd = (P_Y0 - yEnd) / P_SPEED;
      if (tandem || local < 0 || (absorbed && local >= tAbs) || (!absorbed && local >= tEnd))
        p.hide(i);
      else p.set(i, x, y, C[2], 1);
      const fb = !tandem && absorbed && local >= tAbs ? burst(local, tAbs, 0.8, 0.22) : null;
      if (fb) f.set(i, x, yAbs, C[2], fb.r, fb.a);
      else f.hide(i);
      // electron jumps from the valence band to the conduction band
      const jx = D[0] - 0.55 + i * 0.16;
      if (!tandem && absorbed && local >= tAbs) {
        const k = between(local, tAbs + 0.1, tAbs + 0.9);
        const fade = 1 - between(run, P_PERIOD - 0.5, P_PERIOD);
        be.set(i, jx, lerp(VB_Y, cbY, k), D[2], fade);
        bh.set(i, jx, VB_Y, D[2], fade);
      } else {
        be.hide(i);
        bh.hide(i);
      }
    }

    // ── tandem photons ──
    for (let i = 0; i < 6; i++) {
      const launch = i * 0.5;
      const local = (t % 8.2) - launch;
      const e = TANDEM_E[i]!;
      const x = TANDEM_X[i]!;
      const topAbs = e >= TOP_EG;
      const yTop = 0.62;
      const ySi = -0.02 - (i % 2) * 0.18;
      const y = 2.0 - 1.1 * local;
      const aTop = (2.0 - yTop) / 1.1;
      const aSi = (2.0 - ySi) / 1.1;
      const stop = topAbs ? aTop : aSi;
      if (!tandem || local < 0 || local >= stop) tp.hide(i);
      else tp.set(i, x, y, 0, 1);
      const fb = tandem && local >= stop ? burst(local, stop, 0.8, 0.22) : null;
      if (fb) tf.set(i, x, topAbs ? yTop : ySi, 0, fb.r, fb.a);
      else tf.hide(i);
    }
    p.flush();
    be.flush();
    bh.flush();
    f.flush();
    tp.flush();
    tf.flush();

    // highlighted link of the chain
    const idx = chain ? Math.floor(t / 3.2) % 4 : 0;
    if (idx !== hiRef.current) {
      hiRef.current = idx;
      setHi(idx);
    }
  });

  const showMain = !tandem;
  const link = (n: number) => (chain ? (hi === n ? "good" : "tiny") : "tiny");

  return (
    <group>
      {/* ── the crystal ── */}
      {showMain ? (
        <group position={C}>
          <Lattice
            atoms={CRYSTAL_ATOMS}
            radii={CRYSTAL_RADII}
            colors={COLORS}
            style={style}
            dynamic
            bondOpacity={0.4}
          />
        </group>
      ) : null}

      {/* ── the energy diagram ── */}
      {showMain ? (
        <group>
          <group ref={cbGroup} position={[D[0], VB_Y + gapH(1.57), D[2]]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.4, 0.04, 0.1]} />
              <meshBasicMaterial color="#79b0ff" />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <boxGeometry args={[1.4, 0.44, 0.08]} />
              <meshBasicMaterial color="#79b0ff" transparent opacity={0.16} depthWrite={false} />
            </mesh>
            <StoryTag position={[-0.45, 0.17, 0]} kind="tiny" minor>
              {L.cb}
            </StoryTag>
          </group>
          <group ref={vbGroup} position={[D[0], VB_Y, D[2]]}>
            <mesh>
              <boxGeometry args={[1.4, 0.04, 0.1]} />
              <meshBasicMaterial color="#e08a55" />
            </mesh>
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[1.4, 0.44, 0.08]} />
              <meshBasicMaterial color="#e08a55" transparent opacity={0.16} depthWrite={false} />
            </mesh>
            <StoryTag position={[-0.45, -0.17, 0]} kind="tiny" minor>
              {L.vb}
            </StoryTag>
          </group>
          <mesh ref={gapLine} position={[D[0] + 0.45, VB_Y + 0.4, D[2]]}>
            <boxGeometry args={[0.02, 1, 0.02]} />
            <meshBasicMaterial color={COLOR.photon} />
          </mesh>
          <mesh ref={gapTop}>
            <coneGeometry args={[0.06, 0.12, 12]} />
            <meshBasicMaterial color={COLOR.photon} />
          </mesh>
          <mesh ref={gapBot} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.06, 0.12, 12]} />
            <meshBasicMaterial color={COLOR.photon} />
          </mesh>
          <group ref={egTag}>
            <StoryTag position={[-0.05, 0, 0]} kind="good" sub={`${egText} eV`}>
              {L.bandgap}
            </StoryTag>
          </group>
        </group>
      ) : null}

      {/* ── the spectrum strip ── */}
      {showMain ? (
        <group>
          <mesh position={[(STRIP.x0 + STRIP.x1) / 2, STRIP.y, STRIP.z]}>
            <planeGeometry args={[STRIP.x1 - STRIP.x0, STRIP.h]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
          <mesh ref={dim} position={[0, STRIP.y, STRIP.z + 0.004]}>
            <planeGeometry args={[1, STRIP.h * 1.02]} />
            <meshBasicMaterial color="#05080b" transparent opacity={0.78} depthWrite={false} />
          </mesh>
          <mesh ref={cut} position={[0, STRIP.y, STRIP.z + 0.01]}>
            <boxGeometry args={[0.025, STRIP.h * 1.9, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <group ref={absTag}>
            <StoryTag position={[0, 0, 0]} kind="good">
              {L.absorbed}
            </StoryTag>
          </group>
          <group ref={trnTag}>
            <StoryTag position={[0, 0, 0]} kind="bad">
              {L.transmitted}
            </StoryTag>
          </group>
          <group ref={cutTag}>
            <StoryTag position={[0, 0, 0]} kind={chain ? link(2) : "tiny"} minor={!chain}>
              {chain ? L.link3 : L.threshold}
            </StoryTag>
          </group>
          <StoryTag position={[STRIP.x0 + 0.1, STRIP.y - 0.26, STRIP.z]} kind="tiny" minor>
            {"3 eV"}
          </StoryTag>
          <StoryTag position={[stripX(2), STRIP.y - 0.26, STRIP.z]} kind="tiny" minor>
            {"2 eV"}
          </StoryTag>
          <StoryTag position={[STRIP.x1 - 0.1, STRIP.y - 0.26, STRIP.z]} kind="tiny" minor>
            {"1 eV"}
          </StoryTag>
        </group>
      ) : null}

      {/* ── photons ── */}
      <group>
        <BeamSet
          count={6}
          color="#ffe9a0"
          update={(i, out) => {
            const e = PHOTONS[i]!;
            const absorbed = e >= gapEgNow(brShown.current);
            out.x = C[0] + LANE_X[i]!;
            out.z = C[2];
            out.y0 = P_Y0;
            out.y1 = absorbed ? C[1] + 0.35 - (i % 3) * 0.28 : C[1] - 1.05;
            out.alpha = tandem ? 0 : 0.22;
          }}
        />
      </group>
      <Swarm ref={photons} count={6} color="#ffffff" radius={0.055} basic />
      <Swarm ref={bandE} count={6} color={COLOR.electron} radius={0.05} />
      <Swarm ref={bandH} count={6} color={COLOR.hole} radius={0.05} />
      <Flashes ref={flashes} count={6} color="#ffd98a" />

      {/* ── tandem demo ── */}
      {tandem ? <TandemStack /> : null}
      <Swarm ref={tPhotons} count={6} color="#ffffff" radius={0.055} basic />
      <Flashes ref={tFlashes} count={6} color="#ffd98a" />

      {/* ── labels ── */}
      {showMain && !chain ? (
        <>
          <StoryTag position={[C[0] - 0.55, C[1] - 1.05, 0.9]} kind="iodide">
            {L.iodide}
          </StoryTag>
          <StoryTag position={[C[0] + 0.45, C[1] - 1.05, 0.9]} kind="bromide">
            {L.bromide}
          </StoryTag>
          <StoryTag position={[C[0] + 0.75, 1.65, 0]} kind="particle" minor={step !== 2}>
            {L.photon}
          </StoryTag>
        </>
      ) : null}
      {showMain && step === 2 ? (
        <>
          <StoryTag position={[C[0] - 1.0, C[1] + 0.5, 0]} kind="good" minor>
            {L.absorbed}
          </StoryTag>
        </>
      ) : null}
      {chain ? (
        <>
          <StoryTag position={[C[0], C[1] + 1.15, 0]} kind={link(0)}>
            {L.link1}
          </StoryTag>
          <StoryTag position={[D[0], VB_Y + 1.8, 0]} kind={link(1)}>
            {L.link2}
          </StoryTag>
          <StoryTag position={[C[0] + 1.35, 1.75, 0]} kind={link(3)}>
            {L.link4}
          </StoryTag>
          <Arrow3
            a={[C[0] + 1.0, C[1] + 0.2, 0]}
            b={[D[0] - 0.85, VB_Y + 0.75, 0]}
            color={COLOR.photon}
          />
          <Arrow3
            a={[D[0] - 0.2, VB_Y - 0.45, 0]}
            b={[0.9, STRIP.y + 0.2, STRIP.z]}
            color={COLOR.photon}
          />
          <Arrow3
            a={[-1.5, STRIP.y + 0.25, STRIP.z]}
            b={[C[0] - 0.6, C[1] - 0.95, 0]}
            color={COLOR.photon}
          />
        </>
      ) : null}
    </group>
  );
}

function gapEgNow(br: number): number {
  return egFromHalide(br, 0);
}

/** Visible colour of a photon of `e` eV; infrared is drawn as a dim warm white so it still shows. */
function photonHex(e: number): string {
  return e < 1.65 ? "#d9a98a" : wavelengthHex(1240 / e);
}

function TandemStack() {
  return (
    <group>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[3.3, 0.1, 1.6]} />
        <meshStandardMaterial color="#a9d3f0" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[3.3, 0.32, 1.6]} />
        <meshStandardMaterial
          color="#b0552b"
          transparent
          opacity={0.62}
          emissive="#b0552b"
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[3.3, 0.9, 1.6]} />
        <meshStandardMaterial
          color="#42566e"
          transparent
          opacity={0.72}
          emissive="#42566e"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[3.3, 0.08, 1.6]} />
        <meshStandardMaterial color="#d7dde6" metalness={0.6} roughness={0.3} />
      </mesh>
      <StoryTag position={[0, 1.55, 0]} kind="good">
        {L.tandem}
      </StoryTag>
      <StoryTag position={[2.55, 0.62, 0.6]} kind="concept">
        {L.topCell}
      </StoryTag>
      <StoryTag position={[2.55, -0.2, 0.6]} kind="concept">
        {L.bottomCell}
      </StoryTag>
      <StoryTag position={[-1.9, 1.5, 0]} kind="particle" minor>
        {L.photon}
      </StoryTag>
      <StoryTag position={[-0.75, 0.95, 0.9]} kind="good" minor>
        {L.absorbed}
      </StoryTag>
      <StoryTag position={[1.0, 0.28, 0.9]} kind="bad" minor>
        {L.transmitted}
      </StoryTag>
      <StoryTag position={[0.9, -0.55, 0.9]} kind="good" minor>
        {L.absorbed}
      </StoryTag>
    </group>
  );
}
