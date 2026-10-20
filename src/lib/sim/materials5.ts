import { t } from "./story";
import { HEX } from "./story5";

/** 5.3 · the plain-language map of the solar cell: five layers, one job each. */
export type MatId = "tco" | "htl" | "perov" | "etl" | "metal";

export type MatExample = { n: string; cite: number[] };

export type MatLayer = {
  id: MatId;
  name: string;
  /** the button label */
  chip: string;
  /** one short line drawn inside the layer */
  short: string;
  job: string;
  /** sources for the job statement */
  jobCite: number[];
  want: string[];
  examples: MatExample[];
  /** which example the table shows */
  tableEx: number;
  matters: string;
  /** "Learn more" keyword lines */
  learn: { text: string; cite: number[] }[];
};

export const MAT_COLOR: Record<MatId, string> = { tco: HEX.tco, htl: HEX.htl, perov: HEX.perov, etl: HEX.etl, metal: HEX.metal };

export const MAT_LAYERS: MatLayer[] = [
  {
    id: "tco",
    chip: t("Trong suốt", "Transparent"),
    name: t("Điện cực trong suốt", "Transparent electrode"),
    short: t("Ánh sáng vào, dòng điện ra", "Light in, current out"),
    job: t("Ánh sáng vào · thu dòng", "Light in · collect current"),
    jobCite: [106],
    want: [t("Trong suốt", "Transparent"), t("Dẫn điện", "Conductive")],
    examples: [
      { n: "ITO", cite: [105] },
      { n: "FTO", cite: [114] },
    ],
    tableEx: 0,
    matters: t("Trong suốt + dẫn điện", "Transparency + conductivity"),
    learn: [
      {
        text: t("Dẫn điện tốt hơn thường che bớt ánh sáng: phải cân bằng.", "More conductive often blocks more light: a balance."),
        cite: [],
      },
    ],
  },
  {
    id: "htl",
    chip: t("HTL", "HTL"),
    name: t("Lớp chọn lọc lỗ trống (HTL)", "Hole-selective layer (HTL)"),
    short: t("HTL · dẫn lỗ trống", "HTL · moves holes"),
    job: t("Dẫn lỗ trống", "Moves holes"),
    jobCite: [106, 102],
    want: [t("Dẫn lỗ trống", "Hole transport"), t("Ít mất điện tích", "Low charge loss"), t("Giao diện tốt", "Good interface")],
    examples: [
      { n: "NiOₓ", cite: [106] },
      { n: "PTAA", cite: [106] },
      { n: "SAMs", cite: [104] },
    ],
    tableEx: 0,
    matters: t("Chọn lọc + giao diện", "Selectivity + interface"),
    learn: [],
  },
  {
    id: "perov",
    chip: t("Perovskite", "Perovskite"),
    name: t("Chất hấp thụ perovskite", "Perovskite absorber"),
    short: t("Hấp thụ ánh sáng", "Absorbs sunlight"),
    job: t("Hấp thụ ánh sáng", "Absorbs sunlight"),
    jobCite: [106, 111],
    want: [t("Hấp thụ mạnh", "Strong absorption"), t("Vùng cấm phù hợp", "Right bandgap"), t("Dẫn điện tích", "Charge transport"), t("Bền", "Stable")],
    examples: [
      { n: "MAPbI₃", cite: [111] },
      { n: t("Perovskite hỗn hợp cation", "Mixed-cation perovskites"), cite: [112] },
    ],
    tableEx: 0,
    matters: t("Hấp thụ + độ bền", "Absorption + stability"),
    learn: [
      { text: t("MAPbI₃: chất hấp thụ trong các pin perovskite đầu tiên.", "MAPbI₃: the absorber in early perovskite cells."), cite: [111] },
      { text: t("Hỗn hợp cation (thêm xesi) cải thiện thành phần.", "Mixed cations (adding cesium) improve the composition."), cite: [112] },
    ],
  },
  {
    id: "etl",
    chip: t("ETL", "ETL"),
    name: t("Lớp chọn lọc điện tử (ETL)", "Electron-selective layer (ETL)"),
    short: t("ETL · dẫn điện tử", "ETL · moves electrons"),
    job: t("Dẫn điện tử", "Moves electrons"),
    jobCite: [106, 102],
    want: [t("Dẫn điện tử", "Electron transport"), t("Ít mất điện tích", "Low charge loss"), t("Giao diện tốt", "Good interface")],
    examples: [
      { n: "C₆₀", cite: [106] },
      { n: "PCBM", cite: [106] },
      { n: "SnO₂", cite: [113] },
    ],
    tableEx: 2,
    matters: t("Chọn lọc + giao diện", "Selectivity + interface"),
    learn: [],
  },
  {
    id: "metal",
    chip: t("Kim loại", "Metal"),
    name: t("Điện cực kim loại", "Metal electrode"),
    short: t("Thu dòng điện", "Collects current"),
    job: t("Thu dòng · khép mạch", "Collect current · close circuit"),
    jobCite: [106],
    want: [t("Dẫn điện", "Conductive"), t("Hợp lớp kề", "Compatible"), t("Bền", "Stable")],
    examples: [
      { n: "Au", cite: [106] },
      { n: "Ag", cite: [106] },
      { n: "Al", cite: [106] },
    ],
    tableEx: 0,
    matters: t("Dẫn điện + độ bền", "Conductivity + stability"),
    learn: [],
  },
];

export const PHASES = [
  t("Ánh sáng đi vào.", "Sunlight enters."),
  t("Perovskite hấp thụ ánh sáng.", "Perovskite absorbs the light."),
  t("Điện tử và lỗ trống được tạo ra.", "Electrons and holes are created."),
  t("HTL dẫn lỗ trống. ETL dẫn điện tử.", "The HTL moves holes. The ETL moves electrons."),
  t("Các điện cực thu điện tích.", "The electrodes collect the charges."),
  t("Dòng điện chạy trong mạch.", "Electric current flows."),
];

export const M5 = {
  kicker: t("5.3", "5.3"),
  title: t("Chọn đúng vật liệu", "Choose the right materials"),
  lead: t("Mỗi lớp một việc — mỗi lớp cần đúng vật liệu.", "One job per layer — each layer needs the right material."),
  light: t("Ánh sáng", "Light"),
  electricity: t("Điện", "Electricity"),
  holes: t("lỗ trống h⁺", "holes h⁺"),
  electrons: t("điện tử e⁻", "electrons e⁻"),
  hint: t("Bấm vào một lớp để xem việc của nó", "Click a layer to learn more"),
  concept: t("Minh họa khái niệm — không đúng tỉ lệ.", "Conceptual illustration — not to scale."),
  play: t("Phát", "Play"),
  pause: t("Dừng", "Pause"),
  replay: t("Phát lại", "Replay"),
  pick: t("Chọn lớp", "Choose a layer"),
  selected: t("Lớp đang chọn", "Selected layer"),
  job: t("Việc của lớp", "Job"),
  want: t("Cần gì", "We want"),
  examples: t("Ví dụ", "Examples"),
  learn: t("Tìm hiểu thêm", "Learn more"),
  tableLayer: t("Lớp", "Layer"),
  tableJob: t("Việc", "Job"),
  tableMatters: t("Từ khóa", "Key points"),
  tableExample: t("Ví dụ", "Examples"),
  oneTitle: t("Sao không dùng một vật liệu?", "Why not one material?"),
  pairs: [
    [t("Hấp thụ giỏi", "Good absorber"), t("nhưng dẫn điện tích kém", "but bad transport")],
    [t("Dẫn điện giỏi", "Good conductor"), t("nhưng kém trong suốt", "but bad transparency")],
    [t("Dẫn điện tích giỏi", "Good transport"), t("nhưng kém bền", "but poor stability")],
  ],
  pairsNote: t("Ví dụ khái niệm.", "Conceptual examples."),
  conclude: t("Đúng vật liệu cho đúng việc.", "The right material for each job."),
  formulaA: t("Đúng vật liệu", "Right material"),
  formulaB: t("Đúng lớp", "Right layer"),
  formulaC: t("Pin tốt hơn", "Better solar cell"),
  sources: t("Nguồn", "Sources"),
  lessonTitle: t("Bước 3 — chọn đúng vật liệu", "Step 3 — Choose the right materials"),
  lessonBody: t("Mỗi lớp một việc. Bấm một lớp để xem việc, điều cần và ví dụ.", "One job per layer. Click a layer for its job, needs and examples."),
};
