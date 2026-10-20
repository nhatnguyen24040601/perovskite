import { t } from "./story";

/** The framing slides of the talk: title, agenda, one divider per big section, and the closing Q&A. */
export const DECK_SECTIONS = [
  { n: 1, id: "div1", title: t("Từ ánh sáng đến điện", "From light to electricity"), teaser: t("Pin mặt trời cần gì ở vật liệu hấp thụ?", "What does a solar cell need from its absorber?") },
  { n: 2, id: "div2", title: t("Khung ABX₃", "The ABX₃ frame"), teaser: t("Một khung tinh thể, ba núm vặn.", "One crystal frame, three knobs.") },
  { n: 3, id: "div3", title: t("Vì sao hợp làm pin", "Why it suits a solar cell"), teaser: t("Vì sao hấp thụ ánh sáng tốt, và vì sao dễ hỏng.", "Why it absorbs light so well, and why it degrades.") },
  { n: 4, id: "div4", title: t("Phương pháp chế tạo", "Fabrication methods"), teaser: t("Chế tạo, mở rộng, thị trường và chì.", "Making it, scaling it, the market and lead.") },
  { n: 5, id: "div5", title: t("Đề xuất cải tiến", "Proposed improvement"), teaser: t("Chồng lớp được thiết kế, đúng vật liệu cho từng lớp.", "A designed layer stack, the right material for each layer.") },
  { n: 6, id: "div6", title: t("Kết luận", "Conclusion"), teaser: t("Tóm tắt và việc còn lại.", "The summary and what is left.") },
];

export const DECK = {
  titleLesson: t("Giới thiệu", "Introduction"),
  titleSection: t("Mở đầu", "Opening"),
  kicker: t("Giới thiệu", "Introduction"),
  title: t("Pin mặt trời perovskite halide", "Halide perovskite solar cells"),
  subtitle: t("Từ ánh sáng đến điện: cách hoạt động, cách chế tạo, việc còn lại.", "From light to electricity: how they work, how they are made, what is left."),
  chips: [t("Tinh thể ABX₃", "ABX₃ crystal"), t("Pin màng mỏng", "Thin-film solar cell"), t("Hiệu suất tăng nhanh", "Fast-rising efficiency")],
  agendaLesson: t("Các phần chính", "Main sections"),
  agendaTitle: t("Nội dung", "Agenda"),
  part: (n: number) => t(`Phần ${n}`, `Part ${n}`),
  thanksSection: t("Hỏi đáp", "Q&A"),
  thanksLesson: t("Cảm ơn · Câu hỏi", "Thank you · Questions"),
  thanks: t("Cảm ơn đã lắng nghe", "Thank you for listening"),
  questions: t("Câu hỏi?", "Questions?"),
  body: t("Trang trình chiếu.", "A presentation slide."),
};
