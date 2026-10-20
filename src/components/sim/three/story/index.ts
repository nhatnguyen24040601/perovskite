import { AbsorbScene } from "./SceneAbsorb";
import { BandgapScene } from "./SceneBandgap";
import { DefectsScene } from "./SceneDefects";
import { FabScene } from "./SceneFab";
import { HeatScene } from "./SceneHeat";
import { IonsScene } from "./SceneIons";
import { MoistureScene } from "./SceneMoisture";
import { OxygenScene } from "./SceneOxygen";
import { RecapScene } from "./SceneRecap";
import { SeparateScene } from "./SceneSeparate";
import { UvScene } from "./SceneUV";
import { StressScene } from "./SceneStress";
import { BladeScene } from "./SceneBlade";
import { SpinScene } from "./SceneSpin";
import { VacuumScene } from "./SceneVacuum";
import { TransportScene } from "./SceneTransport";
import { PinScene } from "./ScenePin";
import { FuncScene } from "./SceneFunc";

/** The interactive scenes of sections 3.1 – 3.6 and their recap. Keys are the lesson scene ids. */
export const storyScenes = {
  absorb: AbsorbScene,
  diffusion: TransportScene,
  exciton: SeparateScene,
  defects: DefectsScene,
  tune: BandgapScene,
  ink: FabScene,
  recap: RecapScene,
  dmoist: MoistureScene,
  doxy: OxygenScene,
  dheat: HeatScene,
  duv: UvScene,
  dion: IonsScene,
  dall: StressScene,
  sSpin: SpinScene,
  sBlade: BladeScene,
  sVac: VacuumScene,
  sPin: PinScene,
  sFunc: FuncScene,
};
