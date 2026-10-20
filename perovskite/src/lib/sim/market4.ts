import { t } from "./story";

/** 4.4 · one flat table of market milestones. Each row says what kind of result it is and how far it is checked. */
export type MkTone = "good" | "warn" | "bad";

export type MkRow = {
  date: string;
  who: string;
  /** what kind of thing the result is */
  kind: string;
  /** one or two short result lines */
  result: string[];
  status: string;
  tone: MkTone;
};

const CELL = t("Tế bào", "Cell");
const MODULE = t("Module", "Module");

export const MK_ROWS: MkRow[] = [
  {
    date: t("6/2024", "Jun 2024"),
    who: "Oxford PV",
    kind: MODULE,
    result: ["26.9%", t("> 1,6 m²", "> 1.6 m²")],
    status: t("Chứng nhận độc lập", "Independently certified"),
    tone: "good",
  },
  {
    date: t("4/2025", "Apr 2025"),
    who: "LONGi",
    kind: CELL,
    result: ["34.85%"],
    status: t("Công ty nói NREL chứng nhận", "Company says NREL certified"),
    tone: "warn",
  },
  {
    date: t("7/2025", "Jul 2025"),
    who: "Caelux",
    kind: t("Lô hàng", "Shipment"),
    result: [t("Lô đầu tiên", "First order")],
    status: t("Chưa phải sản xuất hàng loạt", "Not mass production"),
    tone: "warn",
  },
  {
    date: "2026",
    who: t("Bảng hiệu suất v68", "Efficiency tables v68"),
    kind: t("Tế bào · Module", "Cell · Module"),
    result: [t("35.2% tế bào", "35.2% cell"), t("29.4% module", "29.4% module")],
    status: t("Bảng tham chiếu", "Reference table"),
    tone: "good",
  },
  {
    date: t("7/2026", "Jul 2026"),
    who: "LONGi",
    kind: CELL,
    result: ["35.5%"],
    status: t("Công ty nói ESTI chứng nhận", "Company says ESTI certified"),
    tone: "warn",
  },
  {
    date: "→ 2035",
    who: "IDTechEx",
    kind: t("Dự báo", "Forecast"),
    result: [t("≈ US$12 tỷ/năm", "≈ US$12B/yr")],
    status: t("Dự báo, không phải số đã quan sát", "Forecast, not observed"),
    tone: "bad",
  },
];

/** sources behind the table */
export const MK_CITES = [85, 86, 87, 2, 100, 88, 92];

export const MK = {
  kicker: t("4.4", "4.4"),
  title: t("Thị trường 2024–2026", "Market 2024–2026"),
  head: [t("Thời gian", "When"), t("Ai", "Who"), t("Loại", "Type"), t("Kết quả", "Result"), t("Mức kiểm chứng", "How solid")],
  conclude: t("Tandem perovskite/silicon là con đường gần nhất.", "Perovskite/silicon tandem is the nearest path."),
  warn: t("Đừng so tế bào với module.", "Don't compare a cell with a module."),
  sources: t("Nguồn", "Sources"),
  lessonTitle: t("4.4 Thị trường 2024–2026", "4.4 Market 2024–2026"),
  lessonBody: t("Sáu mốc, một bảng.", "Six milestones, one table."),
};
