import { t } from "./story";

/** 6 · one closing slide: what perovskite and halide perovskite are, why they shine, and what is left. */
export type C6Card = { id: string; head: string; big?: string; bigNote?: string; points: string[] };

export const C6_CARDS: C6Card[] = [
  {
    id: "what",
    head: t("Perovskite halide", "Halide perovskite"),
    big: "ABX₃",
    bigNote: t("Một khung tinh thể, ba “núm vặn”", "One crystal frame, three knobs"),
    points: [t("A: cation lớn", "A: large cation"), t("B: chì hoặc thiếc", "B: lead or tin"), t("X: iod, brom, clo (halide)", "X: iodide, bromide, chloride (halide)")],
  },
  {
    id: "why",
    head: t("Vì sao nổi bật", "Why it stands out"),
    points: [t("Hấp thụ ánh sáng mạnh", "Strong light absorption"), t("Màng rất mỏng", "Very thin film"), t("Điện tích đi xa", "Charges travel far"), t("Chế tạo nhiệt độ thấp", "Low-temperature processing")],
  },
  {
    id: "progress",
    head: t("Tiến bộ", "Progress"),
    big: "3.8% → 27%+",
    bigNote: t("pin một lớp, 2009 → nay", "single junction, 2009 → today"),
    points: [t("Tandem perovskite/silicon: khoảng 35%", "Perovskite/silicon tandem: about 35%")],
  },
  {
    id: "left",
    head: t("Việc còn lại", "Work left"),
    points: [t("Độ bền: ẩm, oxy, nhiệt, UV, ion", "Durability: moisture, oxygen, heat, UV, ions"), t("Chì: giữ và quản lý", "Lead: contain and manage"), t("Phủ diện tích lớn", "Large-area coating")],
  },
];

export const C6 = {
  kicker: t("6", "6"),
  title: t("Kết luận", "Conclusion"),
  closing: t("Hấp thụ ánh sáng rất tốt. Còn lại: độ bền và chì.", "A great light absorber. What is left: durability and lead."),
  next: t("Đường gần nhất: tandem trên silicon.", "Nearest path: tandem on silicon."),
  lessonBody: t("Một trang tổng kết về perovskite và perovskite halide.", "One summary page on perovskite and halide perovskite."),
};
