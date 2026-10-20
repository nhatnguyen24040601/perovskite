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
import { CrystalScene } from "./SceneCrystal";
import { QdScene } from "./SceneQd";
import { BladeScene } from "./SceneBlade";
import { SlotScene } from "./SceneSlot";
import { MarketScene } from "./SceneMarket";
import { LeadAScene, LeadBScene, LeadCScene } from "./SceneLead";
import { SpinScene } from "./SceneSpin";
import { VacuumScene } from "./SceneVacuum";
import { TwoStepScene } from "./SceneTwoStep";
import { TransportScene } from "./SceneTransport";
import { PinScene } from "./ScenePin";
import { FuncScene } from "./SceneFunc";
import { MatScene } from "./SceneMat";
import { IsosScene } from "./SceneIsos";
import { FinScene } from "./SceneFin";

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
  sLeadA: LeadAScene,
  sLeadB: LeadBScene,
  sLeadC: LeadCScene,
  sMkt: MarketScene,
  sSlot: SlotScene,
  sBlade: BladeScene,
  sQd: QdScene,
  sCry: CrystalScene,
  sVac: VacuumScene,
  sTwo: TwoStepScene,
  sPin: PinScene,
  sFunc: FuncScene,
  sMat: MatScene,
  sIsos: IsosScene,
  sFin: FinScene,
};
