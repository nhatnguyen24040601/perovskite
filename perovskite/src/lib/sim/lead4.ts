import { t } from "./story";

/** 4.5 · one flat table: four absorber families, three short rows. Qualitative on purpose: no efficiency numbers. */
export type LeadTone = "good" | "warn" | "bad";
export type LeadCell = { text: string; tone: LeadTone };

export const L4_COLS = [
  { id: "pb", name: t("Chì Pb", "Lead Pb"), sub: "Pb" },
  { id: "snpb", name: t("Thiếc–chì", "Tin–lead"), sub: "Sn–Pb" },
  { id: "sn", name: t("Chỉ thiếc", "Tin only"), sub: "Sn" },
  { id: "dbl", name: t("Perovskite kép", "Double perovskite"), sub: "Cs₂AgBiBr₆" },
];

export const L4_ROWS: { dim: string; cells: LeadCell[] }[] = [
  {
    dim: t("Có chì?", "Lead?"),
    cells: [
      { text: t("Có", "Yes"), tone: "bad" },
      { text: t("Ít hơn", "Less"), tone: "warn" },
      { text: t("Không", "No"), tone: "good" },
      { text: t("Không", "No"), tone: "good" },
    ],
  },
  {
    dim: t("Hiệu suất", "Efficiency"),
    cells: [
      { text: t("Cao nhất", "Highest"), tone: "good" },
      { text: t("Tiềm năng cao", "High potential"), tone: "good" },
      { text: t("Đang phát triển", "Developing"), tone: "warn" },
      { text: t("Còn xa", "Far behind"), tone: "bad" },
    ],
  },
  {
    dim: t("Vấn đề chính", "Main problem"),
    cells: [
      { text: t("Rò rỉ chì", "Lead leakage"), tone: "bad" },
      { text: t("Sn bị oxy hóa", "Sn oxidizes"), tone: "warn" },
      { text: t("Sn bị oxy hóa", "Sn oxidizes"), tone: "bad" },
      { text: t("Hấp thụ yếu", "Weak absorption"), tone: "bad" },
    ],
  },
];

/** sources behind the table */
export const L4_CITES = [93, 94, 96, 97, 98, 99];

export const L4 = {
  kicker: t("4.5", "4.5"),
  title: t("Chì và các lựa chọn thay thế", "Lead and its alternatives"),
  pick: t("Chọn một họ vật liệu", "Pick a family"),
  conclude: t("Không lựa chọn nào bỏ chì mà không đánh đổi.", "No option drops lead without a trade-off."),
  fine: t("So sánh định tính, không có số hiệu suất.", "Qualitative comparison, no efficiency numbers."),
  sources: t("Nguồn", "Sources"),
  lessonBody: t("Bốn họ vật liệu hấp thụ, một bảng so sánh.", "Four absorber families, one comparison table."),
};
