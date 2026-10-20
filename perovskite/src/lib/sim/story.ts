/**
 * Story lessons (sections 3.1 – 3.6 and the recap).
 * Every text is written once as a Vietnamese/English pair with `t()`. The Vietnamese
 * string stays the key (like the rest of the site) and `tr()` finds the English one
 * through STORY_EN.
 */
import type { NoteKind, Swatch } from "./content";
import type { Tune } from "./types";

export const STORY_EN: Record<string, string> = {};

/** Register a vi → en pair and return the Vietnamese source string. */
export function t(vi: string, en: string): string {
  STORY_EN[vi] = en;
  return vi;
}

export type CamKey = string;

export type StoryStep = {
  title: string;
  body: string;
  /** Reference numbers (REFS) that support this step; shown as clickable citations. */
  cite?: number[];
  /** "Why it matters" — one short sentence. */
  why?: string;
  /** Small information box shown on the stage. */
  info?: string;
  /** Camera pose of this step (see camera.ts). */
  cam: CamKey;
  /** Seconds of animation before the step holds and loops. */
  dur: number;
  /** Last step of the section: show the final message. */
  final?: boolean;
};

export type StoryOptions =
  | "absorb"
  | "defects"
  | "bandgap"
  | "coating"
  | "heat"
  | "light"
  | "uv"
  | "field"
  | "none";

/** One interactive control of a Chapter 4 lesson. The scene reads its value from `useSim().fab[key]`. */
export type FabControl =
  | {
      kind: "slider";
      key: string;
      label: string;
      lo: string;
      hi: string;
      min: number;
      max: number;
      step: number;
      def: number;
      /** Shown only on these steps (all steps when omitted). */
      at?: number[];
    }
  | {
      kind: "seg";
      key: string;
      label: string;
      opts: { v: string; label: string }[];
      def: string;
      at?: number[];
    };

/** The "method facts" panel of a fabrication lesson. */
export type Facts = {
  inputs: string;
  equipment: string;
  process: string;
  result: string;
  pros: string;
  cons: string;
  scale: string;
  refs: number[];
};

export type StorySpec = {
  id: string;
  scene: string;
  section: string;
  title: string;
  /** One sentence, 20 words or fewer. */
  sentence: string;
  final: string;
  qa: { q: string; a: string };
  legend: { swatch: Swatch; label: string }[];
  /** Part of the degradation set (3.8): shows the mechanism tabs and the zoom / camera controls. */
  group?: "degrade" | "fab" | "design";
  /** Chapter 4: names of the three camera levels (equipment, film, lattice). */
  views?: [string, string, string];
  /** Chapter 4: show the micro-zoom switch (off keeps the camera on the equipment). */
  microSwitch?: boolean;
  controls?: FabControl[];
  facts?: Facts;
  /** Chapter 5: the compact scientific-facts panel, as label / text rows plus the references behind them. */
  factList?: { k: string; v: string }[];
  factRefs?: number[];
  /** Short plain-language analogy shown once, under the first step. */
  simple?: string;
  /** The story card shows only the title and the "why" line; the full text lives in the notes panel. */
  brief?: boolean;
  options: StoryOptions;
  steps: StoryStep[];
  tune?: Tune[];
};

const LEG = {
  photon: { swatch: "sun" as const, label: t("Photon", "Photon") },
  electron: { swatch: "electron" as const, label: t("Điện tử e⁻", "Electron e⁻") },
  hole: { swatch: "hole" as const, label: t("Lỗ trống h⁺", "Hole h⁺") },
};

export const STORIES: StorySpec[] = [
  /* ───────────────────────── 3.1 ───────────────────────── */
  {
    id: "absorb",
    scene: "absorb",
    section: "3.1",
    title: t("3.1 Hấp thụ ánh sáng mạnh", "3.1 Strong Light Absorption"),
    sentence: t(
      "Perovskite hấp thụ rất nhiều ánh sáng mặt trời dù lớp hấp thụ rất mỏng.",
      "Perovskite absorbs a lot of sunlight even when the absorber layer is very thin.",
    ),
    final: t("Lớp mỏng, hấp thụ mạnh.", "Thin layer, strong absorption."),
    qa: {
      q: t(
        "Vì sao perovskite chỉ cần một lớp mỏng?",
        "Why does perovskite need only a thin layer?",
      ),
      a: t("Vì nó hấp thụ ánh sáng rất mạnh.", "Because it absorbs light strongly."),
    },
    legend: [LEG.photon, LEG.electron, LEG.hole],
    options: "absorb",
    steps: [
      {
        title: t("Ánh sáng đi vào pin", "Sunlight enters the cell"),
        body: t(
          "Photon từ Mặt Trời đi xuống qua lớp kính, tới lớp perovskite.",
          "Photons from the Sun travel down through the glass toward the perovskite layer.",
        ),
        cam: "1",
        dur: 5.5,
      },
      {
        title: t("Lớp mỏng bắt gần hết ánh sáng", "A thin layer catches the light"),
        body: t(
          "Hầu hết photon bị hấp thụ ngay trong lớp perovskite mỏng. Chỉ vài photon đi xuyên qua.",
          "Almost every photon is absorbed inside the thin perovskite layer. Only a few pass through.",
        ),
        cam: "2",
        dur: 5.5,
      },
      {
        title: t("Một photon, một cặp hạt", "One photon, one pair"),
        body: t(
          "Mỗi photon bị hấp thụ tạo ra một điện tử và một lỗ trống.",
          "Each absorbed photon creates one electron and one hole.",
        ),
        cam: "3",
        dur: 5,
      },
      {
        title: t("Mỏng hay dày?", "Thin or thick?"),
        body: t(
          "Vật liệu hấp thụ yếu hơn cần lớp dày hơn nhiều để bắt cùng lượng ánh sáng. Đây chỉ là so sánh khái niệm.",
          "A weaker absorber needs a much thicker layer to catch the same light. A conceptual comparison only.",
        ),
        why: t(
          "Lớp mỏng dùng ít vật liệu hơn, nên pin nhẹ và rẻ hơn.",
          "A thinner layer uses less material, so the cell can be lighter and cheaper.",
        ),
        cam: "wide",
        dur: 15,
      },
      {
        title: t("Ý chính", "Takeaway"),
        body: t(
          "Một lớp dày vài trăm nanomet đã hấp thụ phần lớn ánh sáng nhìn thấy.",
          "A layer a few hundred nanometres thick can absorb most visible sunlight.",
        ),
        cam: "1",
        dur: 5.5,
        final: true,
      },
    ],
  },

  /* ───────────────────────── 3.2 ───────────────────────── */
  {
    id: "diffusion",
    scene: "diffusion",
    section: "3.2",
    title: t("3.2 Điện tích đi được xa", "3.2 Charges Can Travel Far"),
    sentence: t(
      "Điện tử và lỗ trống đi qua lớp perovskite mỏng để tới các lớp truyền tải.",
      "Electrons and holes can travel through the thin perovskite layer before reaching the transport layers.",
    ),
    final: t(
      "Điện tích phải tới điện cực trước khi tái hợp.",
      "Charges must reach the electrodes before they recombine.",
    ),
    qa: {
      q: t("Vì sao điện tích sinh ra thu được?", "Why can the generated charges be collected?"),
      a: t(
        "Chúng đi hết lớp mỏng trước khi tái hợp.",
        "They can travel through the thin absorber before recombination.",
      ),
    },
    legend: [LEG.electron, LEG.hole],
    options: "none",
    steps: [
      {
        title: t("Cặp hạt xuất hiện", "Pairs appear"),
        body: t(
          "Ánh sáng tạo ra các cặp điện tử – lỗ trống bên trong lớp perovskite.",
          "Light creates electron–hole pairs inside the perovskite layer.",
        ),
        cam: "2",
        dur: 3.5,
      },
      {
        title: t("Điện tích đi, va chạm, đi tiếp", "Charges wander, bump, and move on"),
        body: t(
          "Chúng đi theo những bước ngẫu nhiên, thỉnh thoảng bị tán xạ, nhưng vẫn tiến về đúng lớp của mình.",
          "They take small random steps and scatter now and then, but keep heading for their own layer.",
        ),
        cam: "2",
        dur: 8,
      },
      {
        title: t("Đường đi dài hơn bề dày", "The path is longer than the layer"),
        body: t(
          "Quãng đường điện tích đi được dài hơn bề dày lớp hấp thụ.",
          "The distance a charge can travel is longer than the thickness of the absorber.",
        ),
        why: t(
          "Lớp đủ mỏng thì điện tích tới được nơi cần tới.",
          "If the layer is thin enough, charges can reach where they need to go.",
        ),
        cam: "2",
        dur: 8,
      },
      {
        title: t("Thời gian sống quá ngắn", "A lifetime that is too short"),
        body: t(
          "Nếu điện tích sống quá ngắn, nó tái hợp trước khi tới nơi và năng lượng bị mất.",
          "If a charge lives too briefly, it recombines before it arrives and its energy is lost.",
        ),
        cam: "2",
        dur: 8,
      },
      {
        title: t("Thời gian sống đủ dài", "A long enough lifetime"),
        body: t(
          "Với thời gian sống đủ dài, cùng điện tích đó tới được lớp truyền tải và được thu.",
          "With a long enough lifetime, the same charge reaches the transport layer and is collected.",
        ),
        cam: "2",
        dur: 8,
      },
      {
        title: t("Ý chính", "Takeaway"),
        body: t(
          "Điện tích phải tới điện cực trước khi tái hợp.",
          "Charges must reach the electrodes before they recombine.",
        ),
        cam: "1",
        dur: 8,
        final: true,
      },
    ],
  },

  /* ───────────────────────── 3.3 ───────────────────────── */
  {
    id: "exciton",
    scene: "exciton",
    section: "3.3",
    title: t("3.3 Tách điện tử – lỗ trống", "3.3 Electron–Hole Separation"),
    sentence: t(
      "Ánh sáng tạo ra một cặp điện tử – lỗ trống, và cặp này dễ trở thành điện tích tự do trong perovskite.",
      "Light creates an electron–hole pair, which can become mobile charges in the perovskite.",
    ),
    final: t(
      "Ánh sáng tạo ra điện tích có thể di chuyển và được thu lại.",
      "Light creates charges that can move and be collected.",
    ),
    qa: {
      q: t("Sau khi ánh sáng bị hấp thụ thì sao?", "What happens after light is absorbed?"),
      a: t(
        "Điện tử và lỗ trống tự do, rồi đi về hai phía khác nhau.",
        "Electron and hole become mobile and move toward different sides.",
      ),
    },
    legend: [LEG.photon, LEG.electron, LEG.hole],
    options: "none",
    steps: [
      {
        title: t("Photon tới", "A photon arrives"),
        body: t(
          "Một photon đi vào tinh thể perovskite.",
          "A photon of light enters the perovskite crystal.",
        ),
        cam: "3",
        dur: 3.5,
      },
      {
        title: t("Photon bị hấp thụ", "The photon is absorbed"),
        body: t(
          "Năng lượng của photon tạo ra một cặp điện tử – lỗ trống nằm sát nhau.",
          "The photon's energy creates an electron–hole pair that starts out close together.",
        ),
        cam: "3",
        dur: 4,
      },
      {
        title: t("Điện tử được kích thích", "The electron is excited"),
        body: t(
          "Năng lượng nhấc điện tử ra khỏi liên kết. Chỗ trống nó để lại là lỗ trống.",
          "The energy lifts an electron out of its bond. The empty spot it leaves is the hole.",
        ),
        cam: "3",
        dur: 4.5,
      },
      {
        title: t("Điện tích trở nên tự do", "The charges become mobile"),
        body: t(
          "Lực hút giữa chúng yếu nên chúng nhanh chóng thành điện tích tự do.",
          "The pull between them is weak, so they quickly become free-moving charges.",
        ),
        info: t(
          "Liên kết của chúng tương đối yếu, nên các hạt tải tự do dễ hình thành.",
          "Their binding is relatively weak, so mobile charge carriers can form easily.",
        ),
        cam: "3",
        dur: 5.5,
      },
      {
        title: t("Đi về hai phía", "Opposite directions"),
        body: t(
          "Điện tử đi về một phía, lỗ trống đi về phía ngược lại.",
          "The electron moves toward one side and the hole toward the other.",
        ),
        cam: "3",
        dur: 6.5,
      },
      {
        title: t("Được thu thành dòng điện", "Collected as a current"),
        body: t(
          "Các lớp truyền tải thu điện tích, và dòng điện chạy qua mạch ngoài.",
          "The transport layers collect the charges, and a current flows through the circuit.",
        ),
        cam: "1",
        dur: 9,
        final: true,
      },
    ],
  },

  /* ───────────────────────── 3.4 ───────────────────────── */
  {
    id: "defects",
    scene: "defects",
    section: "3.4",
    title: t("3.4 Dung thứ khuyết tật", "3.4 Defect Tolerance"),
    sentence: t(
      "Một số khuyết tật không bẫy điện tích mạnh, nên điện tích vẫn tiếp tục di chuyển.",
      "Some defects do not strongly trap charges, allowing them to keep moving through the material.",
    ),
    final: t(
      "Perovskite chịu được một số khuyết tật, nhưng các bẫy có hại vẫn phải được kiểm soát.",
      "Perovskite can tolerate some defects, but harmful traps still need to be controlled.",
    ),
    qa: {
      q: t(
        "Vì sao perovskite không hoàn hảo vẫn dùng tốt?",
        "Why can imperfect perovskite still work well?",
      ),
      a: t(
        "Một số khuyết tật khá vô hại, dù bẫy sâu vẫn có hại.",
        "Some defects are relatively harmless, although deep traps remain harmful.",
      ),
    },
    legend: [
      LEG.electron,
      LEG.hole,
      { swatch: "good", label: t("Khuyết tật", "Defect") },
      { swatch: "warn", label: t("Bẫy sâu", "Deep trap") },
    ],
    options: "defects",
    steps: [
      {
        title: t("Tinh thể thật không hoàn hảo", "Real crystals are not perfect"),
        body: t(
          "Tinh thể thật có chỗ thiếu nguyên tử, ranh giới hạt và bề mặt gồ ghề.",
          "Real crystals have missing atoms, grain boundaries and rough surfaces.",
        ),
        cam: "mid",
        dur: 5,
      },
      {
        title: t("Nhiều khuyết tật khá vô hại", "Many defects are fairly harmless"),
        body: t(
          "Điện tích có thể đi qua một khuyết tật vô hại và tiếp tục di chuyển.",
          "A charge can pass a relatively harmless defect and keep on moving.",
        ),
        info: t(
          "Một số khuyết tật khá vô hại. Bẫy sâu vẫn có thể gây tái hợp.",
          "Some defects are relatively harmless. Deep traps can still cause recombination.",
        ),
        cam: "mid",
        dur: 9,
      },
      {
        title: t("Bẫy sâu thì có hại", "A deep trap is harmful"),
        body: t(
          "Bẫy sâu giữ chặt điện tích. Khi lỗ trống tới, chúng tái hợp và điện tích bị mất.",
          "A deep trap holds a charge. When a hole arrives, they recombine and the charge is lost.",
        ),
        info: t(
          "Một số khuyết tật khá vô hại. Bẫy sâu vẫn có thể gây tái hợp.",
          "Some defects are relatively harmless. Deep traps can still cause recombination.",
        ),
        cam: "mid",
        dur: 9.5,
      },
      {
        title: t("Tinh thể hoàn hảo hay tinh thể thật?", "Perfect or real crystal?"),
        body: t(
          "Tinh thể thật vẫn truyền điện tích tốt, nhưng bẫy sâu vẫn cần được kiểm soát.",
          "The real crystal still carries charge, but deep traps still need to be controlled.",
        ),
        info: t(
          "Một số khuyết tật khá vô hại. Bẫy sâu vẫn có thể gây tái hợp.",
          "Some defects are relatively harmless. Deep traps can still cause recombination.",
        ),
        cam: "mid",
        dur: 12,
      },
      {
        title: t("Ý chính", "Takeaway"),
        body: t(
          "Dung thứ khuyết tật không có nghĩa là khuyết tật không quan trọng.",
          "Defect tolerance does not mean that defects do not matter.",
        ),
        cam: "2",
        dur: 8,
        final: true,
      },
    ],
  },

  /* ───────────────────────── 3.5 ───────────────────────── */
  {
    id: "tune",
    scene: "tune",
    section: "3.5",
    title: t("3.5 Vùng cấm chỉnh được", "3.5 Tunable Bandgap"),
    sentence: t(
      "Đổi thành phần halide làm đổi vùng cấm, và đổi dải ánh sáng vật liệu hấp thụ được.",
      "Changing the halide composition changes the bandgap and the range of light the material can absorb.",
    ),
    final: t(
      "Đổi thành phần → đổi vùng cấm → chỉnh được ánh sáng hấp thụ.",
      "Change the composition → change the bandgap → tune the light absorption.",
    ),
    qa: {
      q: t(
        "Vì sao ta đổi được thành phần perovskite?",
        "Why can we change the perovskite composition?",
      ),
      a: t(
        "Để đổi vùng cấm và chỉnh ánh sáng hấp thụ.",
        "To change the bandgap and tune light absorption.",
      ),
    },
    legend: [
      { swatch: "iodine", label: t("Iodide (I⁻)", "Iodide (I⁻)") },
      { swatch: "br", label: t("Bromide (Br⁻)", "Bromide (Br⁻)") },
      LEG.photon,
    ],
    options: "bandgap",
    tune: [{ br: 0 }, { br: 0 }, { br: 45 }, { br: 0 }, { br: 25 }, { br: 45 }],
    steps: [
      {
        title: t("Tinh thể halide pha trộn", "A mixed-halide crystal"),
        body: t(
          "Các vị trí X của tinh thể có thể chứa iodide, bromide, hoặc hỗn hợp cả hai.",
          "The X sites of the crystal can hold iodide, bromide, or a mix of both.",
        ),
        cam: "3",
        dur: 5,
      },
      {
        title: t("Thay iodide bằng bromide", "Swap iodide for bromide"),
        body: t(
          "Thanh trượt đổi tỉ lệ I/Br. Càng nhiều bromide, vùng cấm càng rộng.",
          "The slider changes the I/Br ratio. More bromide makes the bandgap wider.",
        ),
        cam: "2",
        dur: 10,
      },
      {
        title: t("Photon được hấp thụ hay đi xuyên", "Photons: absorbed or transmitted"),
        body: t(
          "Photon chỉ bị hấp thụ nếu năng lượng của nó không nhỏ hơn vùng cấm. Nếu không, nó đi xuyên qua.",
          "A photon is absorbed only if its energy is at least the bandgap. Otherwise it passes through.",
        ),
        cam: "2",
        dur: 11,
      },
      {
        title: t("Thành phần → vùng cấm → hấp thụ", "Composition → bandgap → absorption"),
        body: t(
          "Bốn mắt xích: thành phần, vùng cấm, ngưỡng hấp thụ, ánh sáng bị hấp thụ.",
          "Four links: composition, bandgap, absorption threshold, absorbed light.",
        ),
        cam: "1",
        dur: 14,
      },
      {
        title: t("Pin tandem", "A tandem cell"),
        body: t(
          "Trong pin tandem, perovskite vùng cấm rộng nhận ánh sáng năng lượng cao, silicon nhận phần còn lại.",
          "In a tandem cell, a wide-gap perovskite takes the high-energy light and silicon takes the rest.",
        ),
        cam: "tandem",
        dur: 9,
      },
      {
        title: t("Ý chính", "Takeaway"),
        body: t(
          "Đổi thành phần là cách đổi vùng cấm và chỉnh ánh sáng mà vật liệu hấp thụ.",
          "Changing the composition is how the bandgap, and the light that is absorbed, gets tuned.",
        ),
        cam: "2",
        dur: 9,
        final: true,
      },
    ],
  },

  /* ───────────────────────── 3.6 ───────────────────────── */
  {
    id: "ink",
    scene: "ink",
    section: "3.6",
    title: t("3.6 Chế tạo ở nhiệt độ thấp", "3.6 Low-Temperature Fabrication"),
    sentence: t(
      "Màng perovskite có thể làm từ dung dịch, ở nhiệt độ xử lý tương đối thấp.",
      "Perovskite films can be made from solution using relatively low-temperature processing.",
    ),
    final: t("Dung dịch → màng mỏng → pin mặt trời.", "Solution → thin film → solar cell."),
    qa: {
      q: t("Vì sao việc chế tạo hấp dẫn?", "Why is fabrication attractive?"),
      a: t(
        "Màng mỏng làm được từ dung dịch ở nhiệt độ tương đối thấp.",
        "Thin films can be made from solution using relatively low-temperature processes.",
      ),
    },
    legend: [],
    options: "coating",
    steps: [
      {
        title: t("Pha mực", "Make the ink"),
        body: t(
          "Nguyên liệu perovskite được hòa tan trong dung môi thành mực tiền chất.",
          "Perovskite ingredients are dissolved in a liquid to make a precursor ink.",
        ),
        cam: "1",
        dur: 7,
      },
      {
        title: t("Phủ mực lên đế", "Coat the ink"),
        body: t(
          "Mực được trải lên đế bằng phủ quay, phủ khe hoặc in phun.",
          "The ink is spread over a substrate by spin coating, slot-die coating or inkjet printing.",
        ),
        cam: "2",
        dur: 9,
      },
      {
        title: t("Hình thành màng ướt", "A wet film forms"),
        body: t(
          "Một lớp dung dịch mỏng phủ kín đế.",
          "A thin layer of liquid covers the substrate.",
        ),
        cam: "2",
        dur: 5,
      },
      {
        title: t("Dung môi bay hơi", "The solvent leaves"),
        body: t(
          "Dung môi bay hơi và để lại các thành phần đã hòa tan.",
          "The solvent evaporates and leaves the dissolved ingredients behind.",
        ),
        cam: "2",
        dur: 7,
      },
      {
        title: t("Tinh thể lớn dần", "Crystals grow"),
        body: t(
          "Những mầm tinh thể nhỏ lớn dần cho tới khi nối thành một màng liền.",
          "Tiny crystal seeds grow larger until they join into one continuous film.",
        ),
        cam: "3",
        dur: 9,
      },
      {
        title: t("Gia nhiệt nhẹ", "Gentle heating"),
        body: t(
          "Nhiệt nhẹ hoàn thiện các tinh thể. Nhiều quy trình giữ dưới khoảng 150 °C.",
          "A gentle heat finishes the crystals. Many processes stay below about 150 °C.",
        ),
        info: t(
          "Nhiệt độ xử lý phụ thuộc vào vật liệu và cấu trúc pin.",
          "Processing temperature depends on material and device architecture.",
        ),
        why: t(
          "Nhiệt độ thấp tiết kiệm năng lượng và cho phép dùng cả đế nhựa.",
          "Low temperatures save energy and make plastic substrates possible.",
        ),
        cam: "1",
        dur: 8,
      },
      {
        title: t("Ghép thành pin", "Build the solar cell"),
        body: t(
          "Màng hoàn thiện được đặt giữa các lớp truyền tải và điện cực.",
          "The finished film is placed between the transport layers and the electrodes.",
        ),
        cam: "stack",
        dur: 10,
      },
      {
        title: t("Đế dẻo", "A flexible substrate"),
        body: t(
          "Trên đế nhựa, pin hoàn chỉnh có thể uốn nhẹ.",
          "On a plastic substrate, the finished cell can bend slightly.",
        ),
        cam: "stack",
        dur: 9,
        final: true,
      },
    ],
  },

  /* ───────────────────────── recap ───────────────────────── */
  {
    id: "recap",
    scene: "recap",
    section: "3.1–3.6",
    title: t("Ghép sáu lý do lại", "Putting the six reasons together"),
    sentence: t(
      "Từ ánh sáng mặt trời tới điện: mỗi lý do là một mắt xích của cùng một câu chuyện.",
      "From sunlight to electricity: each reason is one link in the same story.",
    ),
    final: t(
      "Perovskite kết hợp hấp thụ ánh sáng mạnh, tạo và truyền điện tích hiệu quả, tính chất quang chỉnh được và chế tạo ở nhiệt độ thấp.",
      "Perovskite combines strong light absorption, efficient charge generation and transport, tunable optical properties, and low-temperature processability.",
    ),
    qa: {
      q: t("Vì sao perovskite hợp làm pin mặt trời?", "Why does perovskite suit a solar cell?"),
      a: t("Sáu lý do nối thành một câu chuyện.", "Six reasons that join into one story."),
    },
    legend: [LEG.photon, LEG.electron, LEG.hole],
    options: "none",
    steps: [
      {
        title: t("Ánh sáng mặt trời", "Sunlight"),
        body: t(
          "Mọi thứ bắt đầu từ photon của Mặt Trời.",
          "It all starts with photons from the Sun.",
        ),
        cam: "1",
        dur: 6,
      },
      {
        title: t("Lớp hấp thụ perovskite", "The perovskite absorber"),
        body: t(
          "Lớp mỏng hấp thụ mạnh, và vùng cấm được chỉnh cho hợp với ánh sáng.",
          "A thin layer absorbs strongly, and its bandgap can be tuned to the light.",
        ),
        cam: "1",
        dur: 6,
      },
      {
        title: t("Điện tử + lỗ trống", "Electron + hole"),
        body: t(
          "Mỗi photon bị hấp thụ cho một cặp điện tích dễ tách ra.",
          "Each absorbed photon gives a pair of charges that separate easily.",
        ),
        cam: "1",
        dur: 6,
      },
      {
        title: t("Truyền điện tích", "Charge transport"),
        body: t(
          "Điện tích đi qua lớp mỏng, bỏ qua được một số khuyết tật, và tới các lớp truyền tải.",
          "The charges cross the thin layer, get past some defects, and reach the transport layers.",
        ),
        cam: "1",
        dur: 7,
      },
      {
        title: t("Điện", "Electricity"),
        body: t(
          "Điện tích được thu lại chảy qua mạch ngoài thành dòng điện.",
          "The collected charges flow through the outside circuit as electricity.",
        ),
        cam: "1",
        dur: 7,
      },
      {
        title: t("Cả câu chuyện", "The whole story"),
        body: t(
          "Và cả lớp màng ấy làm được từ dung dịch, ở nhiệt độ tương đối thấp.",
          "And the whole film can be made from solution at a relatively low temperature.",
        ),
        cam: "1",
        dur: 10,
        final: true,
      },
    ],
  },

  /* ───────────────────────── 3.8 · degradation ───────────────────────── */
  {
    id: "dmoist",
    scene: "dmoist",
    section: "3.8.1",
    group: "degrade",
    title: t("3.8.1 Hơi ẩm", "3.8.1 Moisture"),
    sentence: t(
      "Nước có thể chui vào theo các đường yếu như ranh giới hạt và làm perovskite phân hủy nhanh hơn.",
      "Water can enter along weak paths such as grain boundaries and speed up perovskite breakdown.",
    ),
    final: t(
      "Hơi ẩm đi vào qua các đường yếu và làm perovskite phân hủy nhanh hơn.",
      "Moisture enters through vulnerable pathways and accelerates perovskite decomposition.",
    ),
    qa: {
      q: t("Nước làm gì với perovskite?", "What does water do to perovskite?"),
      a: t(
        "Nó đi vào theo ranh giới hạt và làm tinh thể phân hủy nhanh hơn.",
        "It enters along grain boundaries and speeds up decomposition.",
      ),
    },
    legend: [
      { swatch: "water", label: t("Phân tử nước H₂O", "Water molecule H₂O") },
      { swatch: "pbi2", label: t("PbI₂ (sản phẩm phân hủy)", "PbI₂ (breakdown product)") },
      LEG.electron,
    ],
    options: "none",
    steps: [
      {
        title: t("Một pin khỏe mạnh", "A healthy solar cell"),
        body: t(
          "Ánh sáng đi vào. Lớp perovskite tạo điện tích. Điện tích chạy ra thành dòng điện.",
          "Light comes in. The perovskite layer makes charges. The charges flow out as current.",
        ),
        cam: "1",
        dur: 6.5,
      },
      {
        title: t("Phóng vào lớp perovskite", "Zoom into the perovskite"),
        body: t(
          "Lớp này gồm nhiều tinh thể nhỏ gọi là hạt. Khe giữa các hạt là ranh giới hạt.",
          "The layer is made of many tiny crystals called grains. The gaps between them are grain boundaries.",
        ),
        cam: "2",
        dur: 7,
      },
      {
        title: t("Nước tới", "Water arrives"),
        body: t(
          "Phân tử nước rơi xuống bề mặt. Phần lớn trượt dọc theo ranh giới hạt.",
          "Water molecules land on the surface. Most of them slide along the grain boundaries.",
        ),
        info: t(
          "Đã đơn giản hóa: các lớp phía trên được nhấc ra để thấy các hạt.",
          "Simplified: the top layers are lifted away so the grains can be seen.",
        ),
        cam: "2",
        dur: 10,
      },
      {
        title: t("Xuống theo ranh giới hạt", "Down a grain boundary"),
        body: t(
          "Ranh giới là lối đi dễ dàng. Nước đi sâu xuống và chạm vào bên trong tinh thể.",
          "A boundary is an easy path. Water goes deep and reaches the inside of the crystal.",
        ),
        cam: "gb",
        dur: 8,
      },
      {
        title: t("Hư hại cục bộ, từ từ", "Slow, local damage"),
        body: t(
          "Gần chỗ có nước, mạng tinh thể mất trật tự dần. Một vùng PbI₂ màu vàng bắt đầu hình thành.",
          "Near the water, the crystal slowly loses its order. A yellow PbI₂ region starts to form.",
        ),
        why: t(
          "Hư hại bắt đầu nhỏ rồi lan dần theo thời gian.",
          "The damage starts small and spreads over time.",
        ),
        info: t(
          "PbI₂ chỉ là hình đơn giản cho sản phẩm phân hủy. Không phải mọi phân tử nước đều phá hủy ngay.",
          "PbI₂ is a simplified picture of the breakdown product. Not every water molecule destroys the crystal at once.",
        ),
        cam: "3",
        dur: 13,
      },
      {
        title: t("Quay lại tế bào pin", "Back to the solar cell"),
        body: t(
          "Vùng bị hư thu điện tích kém. Ít dòng điện hơn tới mạch ngoài.",
          "The damaged zone collects charge poorly. Less current reaches the outside circuit.",
        ),
        cam: "1",
        dur: 10,
        final: true,
      },
    ],
  },

  {
    id: "doxy",
    scene: "doxy",
    section: "3.8.2",
    group: "degrade",
    title: t("3.8.2 Oxy + ánh sáng", "3.8.2 Oxygen + Light"),
    sentence: t(
      "Dưới ánh sáng, oxy có thể tham gia phản ứng hóa học làm perovskite xuống cấp nhanh hơn.",
      "Under light, oxygen can join chemical reactions that make perovskite degrade faster.",
    ),
    final: t(
      "Oxy gây hại nhiều hơn khi có ánh sáng và có thể làm suy giảm hóa học nhanh hơn.",
      "Oxygen becomes more harmful under illumination and can accelerate chemical degradation.",
    ),
    qa: {
      q: t("Khi nào oxy gây hại nhiều nhất?", "When is oxygen most harmful?"),
      a: t("Khi pin đang được chiếu sáng.", "When the cell is lit."),
    },
    legend: [
      { swatch: "oxygen", label: t("Phân tử oxy O₂", "Oxygen molecule O₂") },
      LEG.photon,
      LEG.electron,
      LEG.hole,
    ],
    options: "light",
    steps: [
      {
        title: t("Pin khỏe dưới ánh sáng", "A healthy cell in the light"),
        body: t(
          "Ánh sáng tạo điện tích và chúng chạy ra ngoài. Mọi thứ hoạt động tốt.",
          "Sunlight makes charges and they flow out. Everything works well.",
        ),
        cam: "1",
        dur: 6.5,
      },
      {
        title: t("Oxy ở gần bề mặt", "Oxygen gathers at the surface"),
        body: t(
          "Phân tử oxy (O₂) tụ lại quanh bề mặt perovskite. Khi tắt đèn, hầu như chưa có gì xảy ra.",
          "Oxygen (O₂) molecules gather around the perovskite surface. With the light off, little happens.",
        ),
        cam: "2",
        dur: 9,
      },
      {
        title: t("Bật đèn", "Light switches on"),
        body: t(
          "Photon đi vào perovskite và tạo điện tử và lỗ trống. Các điện tích này đang được kích thích.",
          "Photons enter the perovskite and make electrons and holes. These charges are now excited.",
        ),
        cam: "2",
        dur: 9,
      },
      {
        title: t("Phản ứng nhờ ánh sáng", "A light-assisted reaction"),
        body: t(
          "Điện tích bị kích thích gặp oxy ở gần bề mặt. Các dạng oxy hoạt động có thể hình thành.",
          "Excited charges meet oxygen near the surface. Reactive oxygen species can form.",
        ),
        info: t(
          "Đã đơn giản hóa: hình không khẳng định một con đường hóa học duy nhất.",
          "Simplified: the picture does not claim one single chemical pathway.",
        ),
        cam: "3",
        dur: 11,
      },
      {
        title: t("Hư hại tích lũy", "Damage builds up"),
        body: t(
          "Vị trí ở bề mặt và mặt tiếp xúc đổi dần. Khuyết tật xuất hiện nhiều hơn.",
          "Sites at the surface and interface slowly change. More defects appear.",
        ),
        why: t(
          "Khuyết tật là nơi điện tích bị giữ lại và mất đi.",
          "Defects are where charges get caught and lost.",
        ),
        cam: "3",
        dur: 11,
      },
      {
        title: t("Ít điện hơn", "Less current"),
        body: t(
          "Khuyết tật giữ điện tích lại. Ít điện tích hơn tới điện cực.",
          "Defects trap charges. Fewer charges reach the electrodes.",
        ),
        cam: "1",
        dur: 10,
        final: true,
      },
    ],
  },

  {
    id: "dheat",
    scene: "dheat",
    section: "3.8.3",
    group: "degrade",
    title: t("3.8.3 Nhiệt", "3.8.3 Heat"),
    sentence: t(
      "Nhiệt độ cao làm nguyên tử và ion chuyển động nhiều hơn, nên hư hại diễn ra nhanh hơn.",
      "Higher temperature makes atoms and ions move more, so damage happens faster.",
    ),
    final: t(
      "Nhiệt làm tăng tốc sự xuống cấp và chuyển động của nguyên tử, ion trong perovskite.",
      "Heat speeds up degradation and atomic/ion movement inside the perovskite.",
    ),
    qa: {
      q: t("Nhiệt làm gì bên trong perovskite?", "What does heat do inside perovskite?"),
      a: t(
        "Nguyên tử rung mạnh hơn, ion di chuyển nhiều hơn, hư hại nhanh hơn.",
        "Atoms vibrate harder, ions move more, and damage is faster.",
      ),
    },
    legend: [
      { swatch: "iodine", label: t("Ion iodide I⁻", "Iodide ion I⁻") },
      { swatch: "warn", label: t("Nhiệt độ cao", "High temperature") },
      { swatch: "pbi2", label: t("Vùng hư hại", "Damaged region") },
    ],
    options: "heat",
    tune: [{ temp: 25 }, { temp: 25 }, { temp: 50 }, { temp: 75 }, { temp: 100 }, { temp: 100 }],
    steps: [
      {
        title: t("Một pin ở 25 °C", "A cell at 25 °C"),
        body: t(
          "Pin đang ở nhiệt độ phòng. Hãy nhìn vào nguyên tử bên trong.",
          "The cell is at room temperature. Let us look at the atoms inside.",
        ),
        cam: "1",
        dur: 6.5,
      },
      {
        title: t("Nguyên tử yên ổn", "Calm atoms"),
        body: t(
          "Ở 25 °C nguyên tử chỉ rung nhẹ. Mạng tinh thể ổn định.",
          "At 25 °C the atoms only vibrate a little. The lattice is stable.",
        ),
        cam: "3",
        dur: 8,
      },
      {
        title: t("Tăng nhiệt độ", "Turn up the heat"),
        body: t(
          "Ở 50 °C nguyên tử rung mạnh hơn.",
          "At 50 °C the atoms vibrate harder.",
        ),
        cam: "3",
        dur: 8,
      },
      {
        title: t("Ion bắt đầu di chuyển", "Ions start to move"),
        body: t(
          "Ở 75 °C ion nhảy thường hơn và mạng tinh thể bị cong nhẹ.",
          "At 75 °C ions jump more often and the lattice bends a little.",
        ),
        cam: "3",
        dur: 9,
      },
      {
        title: t("Hư hại nhanh hơn", "Faster degradation"),
        body: t(
          "Ở 100 °C hư hại lớn nhanh. Thanh trượt nhiệt độ quyết định tốc độ.",
          "At 100 °C the damage grows quickly. The slider sets the speed.",
        ),
        why: t(
          "Cùng một pin, càng nóng thì càng nhanh xuống cấp.",
          "The same cell degrades faster the hotter it gets.",
        ),
        info: t(
          "Các mức nhiệt chỉ để minh họa, không phải ngưỡng hỏng chung cho mọi pin.",
          "These temperatures are for illustration only. They are not universal failure limits.",
        ),
        cam: "3",
        dur: 12,
      },
      {
        title: t("Quay lại tế bào pin", "Back to the solar cell"),
        body: t(
          "Lớp hấp thụ nóng và hư thu điện tích kém hơn. Công suất giảm.",
          "The hot, damaged absorber collects charge poorly. Output falls.",
        ),
        cam: "1",
        dur: 10,
        final: true,
      },
    ],
  },

  {
    id: "duv",
    scene: "duv",
    section: "3.8.4",
    group: "degrade",
    title: t("3.8.4 Tia cực tím (UV)", "3.8.4 Ultraviolet (UV)"),
    sentence: t(
      "Tia UV năng lượng cao có thể làm hư nhanh hơn, nhất là ở các mặt tiếp xúc và lớp truyền tải.",
      "High-energy UV light can speed up damage, especially at interfaces and transport layers.",
    ),
    final: t(
      "UV có thể làm suy giảm nhanh hơn, nhất là ở các mặt tiếp xúc yếu.",
      "UV exposure can accelerate degradation, especially at vulnerable interfaces.",
    ),
    qa: {
      q: t("UV gây hại nhiều nhất ở đâu?", "Where does UV hurt most?"),
      a: t(
        "Ở các mặt tiếp xúc yếu và lớp truyền tải.",
        "At vulnerable interfaces and transport layers.",
      ),
    },
    legend: [
      { swatch: "sun", label: t("Photon ánh sáng nhìn thấy", "Visible-light photon") },
      { swatch: "uv", label: t("Photon UV (năng lượng cao)", "UV photon (higher energy)") },
      { swatch: "etl", label: t("Lớp truyền điện tử (ETL)", "Electron transport layer (ETL)") },
    ],
    options: "uv",
    steps: [
      {
        title: t("Ánh sáng mặt trời bình thường", "Normal sunlight"),
        body: t(
          "Photon ánh sáng nhìn thấy đi vào pin và tạo điện.",
          "Visible-light photons enter the cell and make power.",
        ),
        cam: "1",
        dur: 6.5,
      },
      {
        title: t("Chọn loại ánh sáng", "Pick the light"),
        body: t(
          "Đổi giữa ánh sáng nhìn thấy và UV. Photon UV mang nhiều năng lượng hơn.",
          "Switch between visible light and UV. UV photons carry more energy.",
        ),
        cam: "1",
        dur: 10,
      },
      {
        title: t("UV đập vào pin", "UV hits the device"),
        body: t(
          "Photon UV đập vào các lớp phía trên trước. Lớp truyền tải và mặt tiếp xúc của nó chịu nhiều nhất.",
          "UV photons strike the top layers first. The transport layer and its interface take the most.",
        ),
        cam: "1",
        dur: 9,
      },
      {
        title: t("Hư hại ở mặt tiếp xúc", "Damage at the interface"),
        body: t(
          "Tại mặt tiếp xúc giữa lớp truyền tải và perovskite, UV kích thích điện tích và tạo khuyết tật.",
          "At the interface between the transport layer and the perovskite, UV excites charges and creates defects.",
        ),
        info: t(
          "Đã đơn giản hóa: UV không phải lúc nào cũng phân hủy trực tiếp khối perovskite.",
          "Simplified: UV does not always break down the bulk perovskite directly.",
        ),
        cam: "ins",
        dur: 12,
      },
      {
        title: t("Điện tích bị kẹt", "Charges get stuck"),
        body: t(
          "Khuyết tật giữ điện tử lại trước lớp truyền tải. Việc thu điện tích kém đi.",
          "Defects hold electrons back before the transport layer. Collection gets worse.",
        ),
        cam: "mid",
        dur: 10,
      },
      {
        title: t("Quay lại tế bào pin", "Back to the solar cell"),
        body: t(
          "Công suất thấp hơn. Mặt tiếp xúc yếu là nơi gây ra vấn đề.",
          "Output is lower. The weak interface is the trouble spot.",
        ),
        cam: "1",
        dur: 10,
        final: true,
      },
    ],
  },

  {
    id: "dion",
    scene: "dion",
    section: "3.8.5",
    group: "degrade",
    title: t("3.8.5 Ion iodide di chuyển", "3.8.5 Mobile iodide ions"),
    sentence: t(
      "Ion iodide có thể di chuyển trong perovskite khi có nhiệt, ánh sáng hoặc điện trường.",
      "Iodide ions can move through perovskite under heat, light or an electric field.",
    ),
    final: t(
      "Ion iodide di động có thể dồn chỗ dưới nhiệt, ánh sáng hoặc điện trường, làm đổi tính chất cục bộ và giảm độ bền của pin.",
      "Mobile iodide ions can redistribute under heat, light, or electric fields, changing local material properties and reducing device stability.",
    ),
    qa: {
      q: t("Điều gì xảy ra khi ion iodide di chuyển?", "What happens when iodide ions move?"),
      a: t(
        "Thành phần cục bộ đổi, và tính chất cục bộ đổi theo.",
        "The local composition changes, and so do the local properties.",
      ),
    },
    legend: [
      { swatch: "ma", label: t("Ion vị trí A", "A-site ion") },
      { swatch: "lead", label: t("Chì Pb²⁺", "Lead Pb²⁺") },
      { swatch: "iodine", label: t("Iodide I⁻", "Iodide I⁻") },
      { swatch: "br", label: t("Bromide Br⁻", "Bromide Br⁻") },
    ],
    options: "field",
    steps: [
      {
        title: t("Bên trong lớp hấp thụ", "Inside the absorber"),
        body: t(
          "Bên trong tinh thể perovskite có các ion. Một số ion có thể di chuyển.",
          "Inside the perovskite crystal there are ions. Some of them can move.",
        ),
        cam: "1",
        dur: 6.5,
      },
      {
        title: t("Mạng ABX₃", "The ABX₃ lattice"),
        body: t(
          "Ion vị trí A, chì (Pb) và halide (I⁻, Br⁻) tạo nên tinh thể.",
          "A-site ions, lead (Pb) and halides (I⁻, Br⁻) build the crystal.",
        ),
        cam: "3",
        dur: 9,
      },
      {
        title: t("Chỗ trống là lối đi", "Vacancies are pathways"),
        body: t(
          "Hầu hết ion đứng yên. Chỗ trống halide cho iodide một nơi để nhảy tới.",
          "Most ions stay put. Empty halide sites give iodide a place to hop to.",
        ),
        cam: "3",
        dur: 9,
      },
      {
        title: t("Bật điện trường", "Turn on an electric field"),
        body: t(
          "Điện trường đẩy lên các ion mang điện. Iodide âm bị kéo về phía cực dương.",
          "An electric field pushes on charged ions. Negative iodide is pulled toward the + side.",
        ),
        cam: "3",
        dur: 8,
      },
      {
        title: t("Vài ion nhảy", "Selected ions hop"),
        body: t(
          "Chỉ một số ion I⁻ nhảy, mỗi lần một ô, vào chỗ trống kế bên.",
          "Only some I⁻ ions hop, one site at a time, into a neighbouring vacancy.",
        ),
        cam: "3",
        dur: 13,
      },
      {
        title: t("Iodide dồn lại một phía", "Iodide piles up on one side"),
        body: t(
          "Dần dần một phía có nhiều I⁻ hơn, phía kia nhiều Br⁻ hơn.",
          "Over time one side gets more I⁻ and the other side gets more Br⁻.",
        ),
        cam: "3",
        dur: 12,
      },
      {
        title: t("Mỗi vùng một tính chất", "Each region, its own properties"),
        body: t(
          "Vùng giàu iodide có vùng cấm nhỏ hơn. Vùng giàu bromide có vùng cấm lớn hơn.",
          "The iodide-rich region has a smaller bandgap. The bromide-rich region has a larger one.",
        ),
        cam: "3",
        dur: 10,
      },
      {
        title: t("Quay lại tế bào pin", "Back to the solar cell"),
        body: t(
          "Điện tử rơi vào vùng cấm nhỏ và bị mất. Pin kém bền hơn.",
          "Electrons roll into the low-gap region and are lost. The cell is less stable.",
        ),
        cam: "1",
        dur: 11,
        final: true,
      },
    ],
  },

  {
    id: "dall",
    scene: "dall",
    section: "3.8.6",
    group: "degrade",
    title: t("3.8.6 Năm căng thẳng, một kết quả", "3.8.6 Five stresses, one result"),
    sentence: t(
      "Nước, oxy với ánh sáng, nhiệt, UV và ion di động đều tác động lên cùng một lớp hấp thụ.",
      "Water, oxygen with light, heat, UV and mobile ions all act on the same absorber.",
    ),
    final: t(
      "Căng thẳng môi trường và vận hành làm perovskite xuống cấp, sinh khuyết tật, làm mất điện tích và hạ hiệu suất.",
      "Environmental and operating stress degrades perovskite, creates defects, loses charge and lowers efficiency.",
    ),
    qa: {
      q: t("Vì sao cả năm điều này làm pin kém đi?", "Why do all five hurt the cell?"),
      a: t(
        "Chúng đều tạo khuyết tật hoặc đổi thành phần, nên mất điện tích.",
        "They all create defects or change the composition, so charge is lost.",
      ),
    },
    legend: [],
    options: "none",
    steps: [
      {
        title: t("Một pin, năm căng thẳng", "One cell, five stresses"),
        body: t(
          "Nước, oxy, nhiệt, UV và ion di động cùng tác động vào lớp perovskite.",
          "Water, oxygen, heat, UV and moving ions all act on the perovskite layer.",
        ),
        cam: "wide",
        dur: 8,
      },
      {
        title: t("Hơi ẩm", "Moisture"),
        body: t("Nước → phân hủy.", "Water → decomposition."),
        cam: "wide",
        dur: 6,
      },
      {
        title: t("Oxy + ánh sáng", "Oxygen + light"),
        body: t(
          "O₂ + chiếu sáng → suy giảm quang hóa.",
          "O₂ + illumination → photo-chemical degradation.",
        ),
        cam: "wide",
        dur: 6,
      },
      {
        title: t("Nhiệt", "Heat"),
        body: t(
          "Nhiệt độ ↑ → phản ứng và chuyển động ion ↑.",
          "Temperature ↑ → reactions and ion movement ↑.",
        ),
        cam: "wide",
        dur: 6,
      },
      {
        title: t("Tia UV", "UV"),
        body: t(
          "Bức xạ năng lượng cao → hư hại nhanh hơn.",
          "High-energy radiation → accelerated damage.",
        ),
        cam: "wide",
        dur: 6,
      },
      {
        title: t("Ion di chuyển", "Ion migration"),
        body: t(
          "I⁻ di chuyển → đổi thành phần và tính chất.",
          "I⁻ movement → composition and property changes.",
        ),
        cam: "wide",
        dur: 6,
      },
      {
        title: t("Căng thẳng → xuống cấp", "Stress → degradation"),
        body: t(
          "Mọi căng thẳng đều làm perovskite xuống cấp.",
          "Every stress makes the perovskite degrade.",
        ),
        cam: "1",
        dur: 8,
      },
      {
        title: t("Khuyết tật → mất điện tích", "Defects → charge loss"),
        body: t(
          "Xuống cấp sinh thêm khuyết tật hoặc đổi thành phần. Điện tích bị giữ lại và mất.",
          "Degradation creates more defects or changes the composition. Charges are caught and lost.",
        ),
        cam: "1",
        dur: 9,
      },
      {
        title: t("Hiệu suất và độ bền giảm", "Lower efficiency and stability"),
        body: t(
          "Mất điện tích nghĩa là ít điện hơn và pin sống ngắn hơn.",
          "Lost charge means less power and a shorter cell life.",
        ),
        cam: "1",
        dur: 10,
        final: true,
      },
    ],
  },
];

export const STORY_IDS: Set<string> = new Set(STORIES.map((s) => s.id));

/** Chapter 4 adds its lessons here (story4.ts), so this file does not have to know them. */
export function registerStories(list: StorySpec[]): void {
  for (const spec of list) {
    if (STORY_IDS.has(spec.id)) continue;
    STORIES.push(spec);
    STORY_IDS.add(spec.id);
  }
}

export function storyOf(id: string): StorySpec | undefined {
  return STORIES.find((s) => s.id === id);
}

export function isStory(id: string): boolean {
  return STORY_IDS.has(id);
}

/** Starting value of every control of a lesson. */
export function fabDefaults(spec: StorySpec | undefined): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  for (const c of spec?.controls ?? []) out[c.key] = c.def;
  return out;
}

export const NOTE_WHY: { kind: NoteKind; title: string } = {
  kind: "base",
  title: t("Vì sao quan trọng", "Why it matters"),
};
export const NOTE_INFO: { kind: NoteKind; title: string } = {
  kind: "warn",
  title: t("Lưu ý", "Note"),
};

/** Short names for the six sections, used in the recap badges. */
export const STORY_BADGES: { icon: string; text: string }[] = [
  { icon: "☀️", text: t("Photon tới", "Photon enters") },
  { icon: "⚡", text: t("Điện tích đi", "Charges travel") },
  { icon: "↔️", text: t("Điện tử và lỗ trống tách", "Electron and hole separate") },
  { icon: "🛡️", text: t("Điện tích sống sót qua khuyết tật", "Charges survive defects") },
  { icon: "🎨", text: t("Thành phần chỉnh ánh sáng hấp thụ", "Composition tunes the light") },
  { icon: "🏭", text: t("Chế tạo thành màng mỏng", "Fabricated as a thin film") },
];

/** Labels drawn in the 3D scenes. */
export const L = {
  photon: t("Photon", "Photon"),
  electron: t("Điện tử e⁻", "Electron e⁻"),
  hole: t("Lỗ trống h⁺", "Hole h⁺"),
  thinLayer: t("Lớp perovskite mỏng", "Thin perovskite layer"),
  thinAbsorber: t("Lớp hấp thụ mỏng", "Thin absorber"),
  thickAbsorber: t("Lớp hấp thụ dày", "Thick absorber"),
  thickNote: t("Cần vật liệu dày hơn nhiều", "Much thicker material required"),
  thinNote: t("Hấp thụ mạnh", "Strong absorption"),
  scale: t("≈ 300–600 nm, không đúng tỉ lệ", "≈ 300–600 nm, not to scale"),
  glass: t("Kính", "Glass"),
  etl: t("Lớp truyền điện tử (ETL)", "Electron transport layer (ETL)"),
  perov: t("Lớp hấp thụ perovskite", "Perovskite absorber"),
  htl: t("Lớp truyền lỗ trống (HTL)", "Hole transport layer (HTL)"),
  electrode: t("Điện cực kim loại", "Metal electrode"),
  etlShort: t("ETL", "ETL"),
  htlShort: t("HTL", "HTL"),
  transport: t("Lớp truyền tải", "Transport layer"),
  recombination: t("Tái hợp", "Recombination"),
  collected: t("Được thu", "Collected"),
  thickness: t("Bề dày lớp hấp thụ", "Absorber thickness"),
  travel: t("Quãng đường điện tích đi", "Carrier travel distance"),
  shortLife: t("Thời gian sống ngắn", "Short lifetime"),
  longLife: t("Thời gian sống đủ dài", "Long enough lifetime"),
  mobile: t("Điện tích tự do", "Mobile charges"),
  separation: t("Tách điện tích", "Charge separation"),
  current: t("Dòng điện", "Current"),
  vacancy: t("Chỗ trống", "Vacancy"),
  defect: t("Khuyết tật", "Defect"),
  halideVac: t("trống halide", "halide vacancy"),
  cationVac: t("thiếu cation", "missing cation"),
  grainBoundary: t("ranh giới hạt", "grain boundary"),
  surfaceDefect: t("khuyết tật bề mặt", "surface defect"),
  continues: t("Điện tích vẫn tiếp tục", "Charge continues"),
  deepTrap: t("Bẫy sâu", "Deep trap"),
  deepLoss: t("Bẫy sâu → mất điện tích", "Deep trap → charge loss"),
  iodide: t("Iodide", "Iodide"),
  bromide: t("Bromide", "Bromide"),
  bandgap: t("Vùng cấm Eg", "Bandgap Eg"),
  cb: t("Vùng dẫn", "Conduction band"),
  vb: t("Vùng hóa trị", "Valence band"),
  absorbed: t("Bị hấp thụ", "Absorbed"),
  transmitted: t("Đi xuyên qua", "Transmitted"),
  threshold: t("Ngưỡng hấp thụ", "Absorption threshold"),
  spectrum: t("Phổ ánh sáng mặt trời", "Sunlight spectrum"),
  tandem: t("Pin tandem", "Tandem solar cell"),
  topCell: t("Perovskite (lớp trên)", "Perovskite top cell"),
  bottomCell: t("Silicon (lớp dưới)", "Silicon bottom cell"),
  link1: t("① Thành phần", "① Composition"),
  link2: t("② Vùng cấm", "② Bandgap"),
  link3: t("③ Ngưỡng hấp thụ", "③ Absorption threshold"),
  link4: t("④ Photon bị hấp thụ", "④ Photons absorbed"),
  ink: t("Mực tiền chất perovskite", "Perovskite precursor ink"),
  coating: t("Phủ", "Coating"),
  spinName: t("Phủ quay", "Spin coating"),
  slotName: t("Phủ khe", "Slot-die coating"),
  inkjetName: t("In phun", "Inkjet printing"),
  ions: t("Pb²⁺  I⁻  A⁺", "Pb²⁺  I⁻  A⁺"),
  sunBadge: t("Ánh sáng mặt trời", "Sunlight"),
  wetFilm: t("Màng ướt", "Wet film"),
  solvent: t("Dung môi bay hơi", "Solvent evaporation"),
  crystalGrowth: t("Tinh thể lớn dần", "Crystal growth"),
  nuclei: t("Mầm tinh thể", "Nuclei"),
  lowTemp: t("Xử lý nhiệt độ thấp", "Low-temperature processing"),
  temp: t("< 150 °C", "< 150 °C"),
  thinFilm: t("Màng mỏng", "Thin film"),
  flexible: t("Đế dẻo", "Flexible substrate"),
  hotPlate: t("Bàn nhiệt", "Hot plate"),
  sun: t("Ánh sáng mặt trời", "Sunlight"),
  absorberNode: t("Lớp hấp thụ perovskite", "Perovskite absorber"),
  pairNode: t("Điện tử + lỗ trống", "Electron + hole"),
  transportNode: t("Truyền điện tích", "Charge transport"),
  electricity: t("Điện", "Electricity"),
};

/** Labels of the degradation set (3.8). */
export const LD = {
  sunlight: t("Ánh sáng mặt trời", "Sunlight"),
  transparent: t("Điện cực trong suốt", "Transparent electrode"),
  etl: t("Lớp truyền điện tử (ETL)", "Electron transport layer (ETL)"),
  perov: t("Lớp hấp thụ perovskite", "Perovskite absorber"),
  htl: t("Lớp truyền lỗ trống (HTL)", "Hole transport layer (HTL)"),
  metal: t("Điện cực kim loại", "Metal electrode"),
  grain: t("Hạt tinh thể", "Grain"),
  boundary: t("Ranh giới hạt", "Grain boundary"),
  perovskite: t("Perovskite", "Perovskite"),
  water: t("Nước", "Water"),
  degraded: t("Vùng bị suy giảm", "Degraded region"),
  pbi2: t("PbI₂", "PbI₂"),
  healthy: t("Pin khỏe", "Healthy cell"),
  lookHere: t("Phóng vào đây", "Zoom in here"),
  poorCollect: t("Thu điện tích kém", "Poor charge collection"),
  charges: t("Điện tích", "Charges"),
  power: t("Công suất", "Power output"),
  oxygen: t("Oxy O₂", "Oxygen O₂"),
  lightOn: t("Đèn bật", "Light ON"),
  lightOff: t("Đèn tắt", "Light OFF"),
  reactive: t("Dạng oxy hoạt động", "Reactive oxygen species"),
  simplified: t("(đơn giản hóa)", "(simplified)"),
  defects: t("Khuyết tật tăng", "More defects"),
  surface: t("Bề mặt / mặt tiếp xúc", "Surface / interface"),
  excited: t("Điện tích bị kích thích", "Excited charge"),
  atTemp: t("Nhiệt độ", "Temperature"),
  vibration: t("Rung mạnh hơn", "Stronger vibration"),
  ionMove: t("Ion di chuyển nhiều hơn", "More ion movement"),
  degSpeed: t("Tốc độ hư hại", "Degradation speed"),
  stable: t("Mạng ổn định", "Stable lattice"),
  visible: t("Ánh sáng nhìn thấy", "Visible light"),
  uv: t("Tia UV", "UV light"),
  uvPhoton: t("Photon UV", "UV photon"),
  highEnergy: t("năng lượng cao", "higher energy"),
  interface: t("Mặt tiếp xúc ETL / perovskite", "ETL / perovskite interface"),
  etlLattice: t("Lớp truyền điện tử", "Transport layer"),
  stuck: t("Điện tử bị kẹt", "Electron stuck"),
  aSite: t("Ion vị trí A", "A-site ion"),
  pb: t("Chì Pb²⁺", "Lead Pb²⁺"),
  iodideI: t("Iodide I⁻", "Iodide I⁻"),
  bromideBr: t("Bromide Br⁻", "Bromide Br⁻"),
  vacancy: t("Chỗ trống halide", "Halide vacancy"),
  field: t("Điện trường", "Electric field"),
  hop: t("Nhảy vào chỗ trống", "Hops into a vacancy"),
  iRich: t("Nhiều iodide", "Iodide-rich"),
  brRich: t("Nhiều bromide", "Bromide-rich"),
  smallGap: t("Vùng cấm nhỏ", "Smaller bandgap"),
  largeGap: t("Vùng cấm lớn", "Larger bandgap"),
  before: t("Trước", "Before"),
  after: t("Sau khi dồn", "After redistribution"),
  lowGap: t("Vùng năng lượng thấp", "Low-energy region"),
  lossHere: t("Mất điện tích", "Charge loss"),
  normalPath: t("Đường bình thường", "Normal path"),
  divertedPath: t("Sau khi ion dồn", "After ion redistribution"),
  moist: t("Hơi ẩm", "Moisture"),
  oxyLight: t("Oxy + ánh sáng", "Oxygen + light"),
  heat: t("Nhiệt", "Heat"),
  ionMig: t("Ion di chuyển", "Ion migration"),
  moistTag: t("💧 Hơi ẩm", "💧 Moisture"),
  oxyTag: t("O₂ + ánh sáng", "O₂ + light"),
  heatTag: t("🔥 Nhiệt", "🔥 Heat"),
  uvTag: t("UV", "UV"),
  ionTag: t("I⁻ di chuyển", "I⁻ migration"),
};

/** Mechanism tabs of the degradation set, in teaching order. */
export const DEGRADE_TABS: { id: string; icon: string; name: string }[] = [
  { id: "dmoist", icon: "💧", name: t("Hơi ẩm", "Moisture") },
  { id: "doxy", icon: "O₂", name: t("Oxy + ánh sáng", "Oxygen + light") },
  { id: "dheat", icon: "🔥", name: t("Nhiệt", "Heat") },
  { id: "duv", icon: "UV", name: t("Tia UV", "UV") },
  { id: "dion", icon: "I⁻", name: t("Ion di chuyển", "Ion migration") },
  { id: "dall", icon: "Σ", name: t("Tổng kết", "Summary") },
];

/** The comparison screen: what attacks, and what it does. */
export const STRESS_ROWS: { icon: string; name: string; effect: string }[] = [
  { icon: "💧", name: t("HƠI ẨM", "MOISTURE"), effect: t("Nước → phân hủy", "Water → decomposition") },
  {
    icon: "O₂",
    name: t("OXY + ÁNH SÁNG", "OXYGEN + LIGHT"),
    effect: t("O₂ + chiếu sáng → suy giảm quang hóa", "O₂ + illumination → photo-chemical degradation"),
  },
  {
    icon: "🔥",
    name: t("NHIỆT", "HEAT"),
    effect: t("Nhiệt độ ↑ → phản ứng và chuyển động ion ↑", "Temperature ↑ → reactions and ion movement ↑"),
  },
  {
    icon: "UV",
    name: t("TIA UV", "UV"),
    effect: t("Bức xạ năng lượng cao → hư hại nhanh hơn", "High-energy radiation → accelerated damage"),
  },
  {
    icon: "I⁻",
    name: t("ION DI CHUYỂN", "ION MIGRATION"),
    effect: t("I⁻ di chuyển → đổi thành phần và tính chất", "I⁻ movement → composition and property changes"),
  },
];

/** The cause → consequence chain of the summary. */
export const STRESS_CHAIN: string[] = [
  t("Căng thẳng môi trường / vận hành", "Environmental / operating stress"),
  t("Perovskite xuống cấp", "Perovskite degradation"),
  t("Thêm khuyết tật / đổi thành phần", "More defects / altered composition"),
  t("Mất điện tích", "Charge loss"),
  t("Hiệu suất và độ bền thấp hơn", "Lower efficiency and stability"),
];

/** Toolbar and overlay strings. */
const SUI = {
  vi: {
    view: "Tầm nhìn",
    cam1: "Pin",
    cam2: "Lớp perovskite",
    cam3: "Nguyên tử",
    labels: "Nhãn",
    on: "Bật",
    off: "Tắt",
    speed: "Tốc độ",
    normal: "Thường",
    slow: "Chậm",
    auto: "Tự chuyển",
    reset: "Đặt lại",
    thin: "Perovskite mỏng",
    thick: "Lớp hấp thụ dày",
    thickHint: "So sánh khái niệm, không phải số đo",
    perfect: "Tinh thể hoàn hảo",
    real: "Tinh thể thật",
    spin: "Phủ quay",
    slot: "Phủ khe",
    inkjet: "In phun",
    method: "Cách phủ",
    iodide: "Nhiều iodide",
    bromide: "Nhiều bromide",
    ratio: "Tỉ lệ I/Br",
    q: "Câu hỏi",
    a: "Trả lời",
    why: "Vì sao quan trọng",
    keys: "← → đổi bước · Space phát/dừng · R đặt lại",
    chain: "Chuỗi liên hệ",
    micro: "Phóng vi mô",
    camReset: "Đặt lại camera",
    lightSwitch: "Ánh sáng",
    lightAuto: "Theo bài",
    lightOnBtn: "Bật",
    lightOffBtn: "Tắt",
    visibleBtn: "Ánh sáng nhìn thấy",
    uvBtn: "Tia UV",
    fieldSwitch: "Điện trường",
    temperature: "Nhiệt độ",
    illustration: "Chỉ để minh họa",
    compare: "So sánh năm căng thẳng",
    tabs: "Chọn cơ chế",
    more: "Xem thêm",
    less: "Thu gọn",
  },
  en: {
    view: "View",
    cam1: "Cell",
    cam2: "Layer",
    cam3: "Atoms",
    labels: "Labels",
    on: "On",
    off: "Off",
    speed: "Speed",
    normal: "Normal",
    slow: "Slow",
    auto: "Auto",
    reset: "Reset",
    thin: "Thin perovskite",
    thick: "Thick absorber",
    thickHint: "A conceptual comparison, not measured data",
    perfect: "Perfect crystal",
    real: "Real crystal",
    spin: "Spin coating",
    slot: "Slot-die coating",
    inkjet: "Inkjet printing",
    method: "Coating method",
    iodide: "More iodide",
    bromide: "More bromide",
    ratio: "I/Br ratio",
    q: "Question",
    a: "Answer",
    why: "Why it matters",
    keys: "← → step · Space play/pause · R reset",
    chain: "The chain",
    micro: "Micro-zoom",
    camReset: "Camera reset",
    lightSwitch: "Light",
    lightAuto: "Follow lesson",
    lightOnBtn: "On",
    lightOffBtn: "Off",
    visibleBtn: "Visible light",
    uvBtn: "UV light",
    fieldSwitch: "Electric field",
    temperature: "Temperature",
    illustration: "For illustration only",
    compare: "The five stresses compared",
    tabs: "Choose a mechanism",
    more: "Read more",
    less: "Show less",
  },
} as const;

export type StoryUiKey = keyof (typeof SUI)["vi"];

export function su(locale: "vi" | "en", key: StoryUiKey): string {
  return SUI[locale][key];
}
