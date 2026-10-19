import { AbsorbScene } from "./SceneAbsorb";
import { BandgapScene } from "./SceneBandgap";
import { DefectsScene } from "./SceneDefects";
import { FabScene } from "./SceneFab";
import { RecapScene } from "./SceneRecap";
import { SeparateScene } from "./SceneSeparate";
import { TransportScene } from "./SceneTransport";

/** The interactive scenes of sections 3.1 – 3.6 and their recap. Keys are the lesson scene ids. */
export const storyScenes = {
  absorb: AbsorbScene,
  diffusion: TransportScene,
  exciton: SeparateScene,
  defects: DefectsScene,
  tune: BandgapScene,
  ink: FabScene,
  recap: RecapScene,
};
