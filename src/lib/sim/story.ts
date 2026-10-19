/**
 * Story lessons (sections 3.1 – 3.6 and the recap).
 * Every text is written once as a Vietnamese/English pair with `t()`. The Vietnamese
 * string stays the key (like the rest of the site) and `tr()` finds the English one
 * through STORY_EN.
 */
import type { NoteKind } from "./content";
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

export type StoryOptions = "absorb" | "defects" | "bandgap" | "coating" | "none";

export type StorySpec = {
  id: string;
  scene: string;
  section: string;
  title: string;
  /** One sentence, 20 words or fewer. */
  sentence: string;
  final: string;
  qa: { q: string; a: string };
  legend: {
    swatch:
      "electron" | "hole" | "sun" | "iodine" | "br" | "good" | "warn" | "etl" | "htl" | "metal";
    label: string;
  }[];
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
];

export const STORY_IDS: ReadonlySet<string> = new Set(STORIES.map((s) => s.id));

export function storyOf(id: string): StorySpec | undefined {
  return STORIES.find((s) => s.id === id);
}

export function isStory(id: string): boolean {
  return STORY_IDS.has(id);
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
    auto: "Tự chuyển bước",
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
    auto: "Auto-step",
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
  },
} as const;

export type StoryUiKey = keyof (typeof SUI)["vi"];

export function su(locale: "vi" | "en", key: StoryUiKey): string {
  return SUI[locale][key];
}
