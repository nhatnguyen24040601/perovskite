/**
 * Chapter 4 sources. Each entry has the details the citation card shows: title, author or
 * organisation, date, kind of source, DOI / URL and the specific claim it supports.
 * Bibliographic details of papers were checked against Crossref; company and chart pages were
 * opened on 2026-10-19 (see `checked`). `n` is the number in the site bibliography (REFS).
 */
import { t } from "./story";

export type SourceKind = "paper" | "review" | "consensus" | "table" | "company" | "chart" | "forecast" | "news" | "report";

/** What kind of value a claim next to this source is: measured in an experiment, reported in the literature, a consensus procedure, or an illustration. */
export type Evidence = "measured" | "literature" | "consensus" | "illustrative";

export type Source = {
  n: number;
  title: string;
  by: string;
  date: string;
  kind: SourceKind;
  url: string;
  doi?: string;
  /** The claim in the lesson this source supports. */
  supports: string;
  /** What was verified at the source, if anything needs saying. */
  note?: string;
  /** Journal or publisher, shown on the card for papers. */
  journal?: string;
  /** Chapter 5: whether the facts taken from the source are measured, literature-reported, a consensus procedure or illustrative. */
  evidence?: Evidence;
};

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  measured: t("Đo bằng thực nghiệm", "Experimentally measured"),
  literature: t("Số liệu/ý kiến trong tài liệu (tổng quan)", "Literature-reported (review)"),
  consensus: t("Quy trình đồng thuận của cộng đồng", "Community consensus procedure"),
  illustrative: t("Minh họa, không phải kết quả đo", "Illustrative, not a measured result"),
};

export const KIND_LABEL: Record<SourceKind, string> = {
  paper: t("Bài báo bình duyệt", "Peer-reviewed paper"),
  review: t("Bài tổng quan bình duyệt", "Peer-reviewed review"),
  consensus: t("Tuyên bố đồng thuận", "Consensus statement"),
  table: t("Bảng hiệu suất", "Efficiency table"),
  company: t("Thông cáo công ty", "Company announcement"),
  chart: t("Biểu đồ chính thức", "Official chart"),
  forecast: t("Dự báo thị trường", "Market forecast"),
  news: t("Tin ngành", "Industry news"),
  report: t("Báo cáo phân tích", "Analysis report"),
};

export const SOURCES: Source[] = [
  {
    n: 1,
    title: "Best Research-Cell Efficiency Chart",
    by: "NREL / NLR",
    date: "2026",
    kind: "chart",
    url: "https://nrel.sitefinity.cloud/pv/cell-efficiency",
    supports: t(
      "Biểu đồ kỷ lục tế bào nghiên cứu: nơi tra các mốc một lớp và tandem.",
      "Research-cell record chart: where single-junction and tandem records are looked up.",
    ),
    note: t(
      "Trang ghi 'Last Updated Aug. 14, 2026'. Số liệu nằm trong ảnh biểu đồ nên không đọc được từ văn bản trang.",
      "The page says 'Last Updated Aug. 14, 2026'. The values sit in the chart image, so they cannot be read from the page text.",
    ),
  },
  {
    n: 2,
    title: "Solar cell efficiency tables: Version 68",
    by: "M. A. Green, E. D. Dunlop, M. Yoshita, N. Kopidakis et al.",
    date: "2026-07",
    kind: "table",
    url: "https://doi.org/10.1016/j.joule.2026.102494",
    doi: "10.1016/j.joule.2026.102494",
    supports: t(
      "Bảng hiệu suất đối chiếu: pin perovskite 28,0% (0,05 cm²), tandem Si/perovskite 35,2% (1 cm²), module tandem 29,4% (khoảng 1,7 m²).",
      "Reference table: 28.0% perovskite cell (0.05 cm²), 35.2% perovskite/silicon tandem cell (1 cm²), 29.4% tandem module (about 1.7 m²).",
    ),
    note: t(
      "Metadata kiểm qua Crossref. Các con số được đối chiếu qua bản tin pv magazine [100] vì trang bài báo không mở được.",
      "Metadata checked through Crossref. The values were cross-checked through the pv magazine report [100] because the paper page could not be opened.",
    ),
  },
  {
    n: 4,
    title: "34.85%! LONGi breaks world record for crystalline silicon–perovskite tandem solar cell efficiency again",
    by: "LONGi",
    date: "2025-04-21",
    kind: "company",
    url: "https://www.longi.com/us/news/longi-world-record-crystalline-silicon-perovskite/",
    supports: t(
      "LONGi công bố pin tandem hai cực 34,85% và nói NREL đã chứng nhận.",
      "LONGi announced a 34.85% two-terminal tandem cell and states that NREL certified it.",
    ),
    note: t(
      "Trang không ghi diện tích pin. Đây là kết quả TẾ BÀO, không phải module.",
      "The page gives no device area. This is a CELL result, not a module.",
    ),
  },
  {
    n: 5,
    title: "Crystalline silicon–perovskite tandem solar cell: new world efficiency 35.5%",
    by: "LONGi",
    date: "2026-07-15",
    kind: "company",
    url: "https://www.longi.com/en/news/crystalline-silicon-perovskite-tandem-solar-cell-new-world-efficiency-2026/",
    supports: t(
      "Thông cáo công bố ngày 14/7/2026 (đăng 15/7/2026): 35,5%, công ty nói đã được ESTI chứng nhận.",
      "Announced 14 July 2026 (published 15 July 2026): 35.5%, which the company says ESTI certified.",
    ),
    note: t(
      "Trang không ghi diện tích pin 35,5%. Con số chưa có trong Version 68 vì bảng đó chốt dữ liệu trước ngày công bố.",
      "The page gives no area for the 35.5% cell. It is not in Version 68 because that table closed before the announcement.",
    ),
  },
  {
    n: 38,
    title: "Consensus statement for stability assessment and reporting for perovskite photovoltaics based on ISOS procedures",
    by: "M. V. Khenkin, E. A. Katz, A. Abate, … M. Lira-Cantu (consortium of 50+ authors)",
    date: "2020-01-22",
    kind: "consensus",
    journal: "Nature Energy 5, 35–49",
    evidence: "consensus",
    url: "https://doi.org/10.1038/s41560-019-0529-5",
    doi: "10.1038/s41560-019-0529-5",
    supports: t(
      "Các nhóm giao thức ISOS (D, V, L, O, T, LC, LT) và ba mức, bảng điều kiện thử, định nghĩa T80/TS80/T95, danh sách cần báo cáo, và điều ISOS KHÔNG phải: không phải thử nghiệm chứng nhận, \"một pin không thể đạt hay trượt phép thử ISOS\".",
      "The ISOS protocol groups (D, V, L, O, T, LC, LT) and their three levels, the test-condition table, the T80 / TS80 / T95 definitions, the reporting checklist, and what ISOS is NOT: not a qualification test, \"a solar cell cannot pass or fail ISOS stability tests\".",
    ),
    note: t(
      "Trang Nature chuyển hướng sang đăng nhập; đã đọc toàn văn bản PDF mở của Đại học Glasgow (eprints.gla.ac.uk/238866), đối chiếu Bảng 1, 3, 5 và các câu về phạm vi. Metadata kiểm qua Crossref.",
      "The Nature page redirects to a login; the full open-access PDF from the University of Glasgow (eprints.gla.ac.uk/238866) was read and Tables 1, 3, 5 and the scope sentences were checked against it. Metadata checked through Crossref.",
    ),
  },
  {
    n: 61,
    title: "Oxford PV debuts commercial solar module with record 26.9% efficiency",
    by: "Optics.org",
    date: "2024-06-19",
    kind: "news",
    url: "https://optics.org/news/15/6/33",
    supports: t("Tin ngành về module Oxford PV 26,9%.", "Industry coverage of the 26.9% Oxford PV module."),
  },
  {
    n: 62,
    title: "Caelux ships first commercial order of perovskite-coated glass",
    by: "Solar Power World",
    date: "2025-07-08",
    kind: "news",
    url: "https://www.solarpowerworldonline.com/2025/07/caelux-ships-first-commercial-order-of-perovskite-coated-glass/",
    supports: t(
      "Tin ngành độc lập về lô hàng Caelux, kể cả việc khách hàng không được nêu tên.",
      "Independent industry coverage of the Caelux shipment, including that the customer was not named.",
    ),
  },
  {
    n: 63,
    title: "IDTechEx estimates that annual perovskite PV revenue will reach almost US$12 billion by 2035",
    by: "Perovskite-Info (reporting an IDTechEx forecast)",
    date: "2025-01-17",
    kind: "forecast",
    url: "https://perovskite-info.com/idtechex-estimates-annual-perovskite-pv-revenue-will-reach-almost-us12-billion",
    supports: t(
      "Dự báo doanh thu hằng năm gần 12 tỷ USD vào 2035 — là dự báo, không phải doanh thu đã quan sát.",
      "Forecast of almost US$12 billion annual revenue by 2035 — a forecast, not observed revenue.",
    ),
  },
  {
    n: 80,
    title: "Topical advances in fabrication technologies of perovskite solar cell heterostructures: Performance and future perspective",
    by: "A. Raj, M. Kumar, A. Anshul",
    date: "2023-06",
    kind: "paper",
    url: "https://doi.org/10.1016/j.matlet.2023.134171",
    doi: "10.1016/j.matlet.2023.134171",
    supports: t(
      "Tổng quan các cách chế tạo pin perovskite và các lớp của cấu trúc pin.",
      "Overview of perovskite device fabrication approaches and the layers of the device stack.",
    ),
  },
  {
    n: 81,
    title: "Review on perovskite solar cells via vacuum and non-vacuum solution based methods",
    by: "C. Yadav, S. Kumar",
    date: "2024-02",
    kind: "paper",
    url: "https://doi.org/10.1016/j.rsurfi.2024.100210",
    doi: "10.1016/j.rsurfi.2024.100210",
    supports: t(
      "So sánh phủ từ dung dịch (quay phủ, hai bước) với lắng đọng chân không.",
      "Compares solution coating (spin coating, two-step) with vacuum deposition.",
    ),
  },
  {
    n: 82,
    title: "Processing methods towards scalable fabrication of perovskite solar cells: A brief review",
    by: "A. Kumar, S. K. Tripathi, M. Shkir et al.",
    date: "2024-11",
    kind: "paper",
    url: "https://doi.org/10.1016/j.inoche.2024.113115",
    doi: "10.1016/j.inoche.2024.113115",
    supports: t(
      "Phủ dao gạt và phủ khe là hướng mở rộng diện tích; những thách thức về độ đồng đều và sấy.",
      "Blade and slot-die coating as routes to larger areas; the challenges of uniformity and drying.",
    ),
  },
  {
    n: 83,
    title: "Single crystal perovskite-based solar cells: Growth, challenges, and potential strategies",
    by: "S. Pandey, J. Ko, B. Park et al.",
    date: "2023-06",
    kind: "paper",
    url: "https://doi.org/10.1016/j.cej.2023.143019",
    doi: "10.1016/j.cej.2023.143019",
    supports: t(
      "Các cách nuôi đơn tinh thể perovskite, thách thức và hạn chế.",
      "Growth routes for perovskite single crystals, their challenges and limits.",
    ),
  },
  {
    n: 84,
    title: "Perovskite colloidal quantum dots with tailored properties: Synthesis strategies and photovoltaic applications",
    by: "D. Choi, H. Kim, Y. Bae, S. Lim et al.",
    date: "2024-05-09",
    kind: "paper",
    url: "https://doi.org/10.1021/acsenergylett.4c00632",
    doi: "10.1021/acsenergylett.4c00632",
    supports: t(
      "Tổng hợp chấm lượng tử perovskite (chích nóng và các cách khác), tinh chế, và màng chấm.",
      "Synthesis of perovskite quantum dots (hot injection and other routes), purification and dot films.",
    ),
  },
  {
    n: 85,
    title: "Oxford PV sets new solar module efficiency world record",
    by: "Oxford PV",
    date: "2024-06-19",
    kind: "company",
    url: "https://www.oxfordpv.com/press-releases/oxford-pv-solar-sustainability-initiative",
    supports: t(
      "Module tandem 60 tế bào cỡ dân dụng, 26,9%, diện tích chỉ định hơn 1,6 m², Fraunhofer CalLab đo và chứng nhận độc lập.",
      "60-cell residential-size tandem module, 26.9%, designated area just over 1.6 m², independently measured and certified by Fraunhofer CalLab.",
    ),
    note: t(
      "Trang được mở và đọc ngày 19/10/2026; nội dung trên trang khớp với các chi tiết này.",
      "The page was opened and read on 19 Oct 2026; its text matches these details.",
    ),
  },
  {
    n: 86,
    title: "34.85%! LONGi breaks world record for crystalline silicon–perovskite tandem solar cell efficiency again",
    by: "LONGi",
    date: "2025-04-21",
    kind: "company",
    url: "https://www.longi.com/us/news/longi-world-record-crystalline-silicon-perovskite/",
    supports: t(
      "Pin tandem hai cực silicon/perovskite 34,85%; công ty ghi NREL chứng nhận.",
      "Two-terminal silicon/perovskite tandem cell at 34.85%; the company states NREL certified it.",
    ),
  },
  {
    n: 87,
    title: "Caelux completes first commercial shipment of its proprietary Active Glass technology",
    by: "Caelux",
    date: "2025-07-08",
    kind: "company",
    url: "https://caelux.com/caelux-completes-first-commercial-shipment-of-its-proprietary-active-glass-technology-marking-major-company-milestone/",
    supports: t(
      "Lô giao khách hàng thương mại đầu tiên của Active Glass: kính phủ perovskite ghép với module silicon thành tandem lai.",
      "First commercial customer shipment of Active Glass: perovskite-coated glass paired with a silicon module as a hybrid tandem.",
    ),
    note: t(
      "Trang gốc của công ty không tải được nên nội dung được đối chiếu qua tin ngành [62]. Một lô hàng không chứng minh sản xuất hàng loạt hay độ bền ngoài trời.",
      "The company page did not load here, so the details were cross-checked with industry coverage [62]. One shipment does not prove mass production or outdoor durability.",
    ),
  },
  {
    n: 88,
    title: "Crystalline silicon–perovskite tandem solar cell: new world efficiency 35.5%",
    by: "LONGi",
    date: "2026-07-15",
    kind: "company",
    url: "https://www.longi.com/en/news/crystalline-silicon-perovskite-tandem-solar-cell-new-world-efficiency-2026/",
    supports: t(
      "35,5%, công bố 14/7/2026; công ty ghi kết quả do ESTI chứng nhận.",
      "35.5%, announced 14 July 2026; the company states ESTI certified the result.",
    ),
  },
  {
    n: 89,
    title: "Best Research-Cell Efficiency Chart (interactive and static)",
    by: "NREL / National Laboratory of the Rockies",
    date: "2026-08-14",
    kind: "chart",
    url: "https://nrel.sitefinity.cloud/pv/cell-efficiency",
    supports: t("Biểu đồ chính thức của tế bào nghiên cứu.", "The official research-cell chart."),
  },
  {
    n: 90,
    title: "Champion Module Efficiency Chart",
    by: "NREL / National Laboratory of the Rockies",
    date: "2026-08-17",
    kind: "chart",
    url: "https://nrel.sitefinity.cloud/pv/module-efficiency",
    supports: t("Biểu đồ chính thức của module, tách theo cỡ.", "The official module chart, split by module size."),
  },
  {
    n: 91,
    title: "Improving tandem efficiency can lower solar photovoltaic module cost per watt",
    by: "NREL (J. Cordell, M. Woodhouse, E. Warren; Joule)",
    date: "2025-01-09",
    kind: "report",
    url: "https://nrel.sitefinity.cloud/news/detail/press/2025/improving-tandem-efficiency-can-lower-solar-photovoltaic-module-cost-per-watt",
    supports: t(
      "Phân tích kinh tế kỹ thuật tandem Si/perovskite: sản lượng nhà máy và hiệu suất module ảnh hưởng nhất tới chi phí; mô hình không xét sản lượng điện hay tuổi thọ.",
      "Techno-economic analysis of perovskite/silicon tandems: factory throughput and module efficiency matter most to cost; the model does not cover energy yield or lifetime.",
    ),
  },
  {
    n: 92,
    title: "Perovskite Photovoltaic Markets 2025–2035: Technologies, Players and Trends",
    by: "IDTechEx",
    date: "2025",
    kind: "forecast",
    url: "https://www.idtechex.com/en/research-report/perovskite-photovoltaic-market-2025/1062",
    supports: t(
      "Báo cáo dự báo doanh thu perovskite PV hằng năm gần 12 tỷ USD vào 2035.",
      "The report forecasts annual perovskite PV revenue approaching US$12 billion by 2035.",
    ),
    note: t(
      "Trang báo cáo không tải được nội dung ở đây; con số được xác nhận qua bản tin [63].",
      "The report page returned no content here; the figure was confirmed through the news item [63].",
    ),
  },
  {
    n: 93,
    title: "Lead immobilization for environmentally sustainable perovskite solar cells",
    by: "H. Zhang, J.-W. Lee, G. Nasti, R. Handy et al.",
    date: "2023-05-24",
    kind: "paper",
    url: "https://doi.org/10.1038/s41586-023-05938-4",
    doi: "10.1038/s41586-023-05938-4",
    supports: t(
      "Tổng quan các cách cố định chì: cô lập hạt, tạo phức chì, gắn vào cấu trúc, hấp phụ chì rò rỉ.",
      "Review of lead-immobilization approaches: grain isolation, lead complexation, structure integration and adsorption of leaked lead.",
    ),
  },
  {
    n: 94,
    title: "Mitigating lead toxicity towards safer commercialization of perovskite solar cells",
    by: "D. Lin, Y. Huang, Q. Chen, Z. Yang et al.",
    date: "2026-04-24",
    kind: "paper",
    url: "https://doi.org/10.1038/s41560-026-02037-2",
    doi: "10.1038/s41560-026-02037-2",
    supports: t(
      "Tổng quan cô lập và cố định chì, hiệu quả giữ chì lâu dài, khả năng mở rộng, chi phí và tái chế vòng kín.",
      "Review of lead isolation and immobilization, long-term sequestration efficiency, scalability, cost and closed-loop recycling.",
    ),
  },
  {
    n: 95,
    title: "Reduction of lead leakage from damaged lead halide perovskite solar modules using self-healing polymer-based encapsulation",
    by: "Y. Jiang, L. Qiu, E. J. Juarez-Perez, L. K. Ono et al.",
    date: "2019-06-17",
    kind: "paper",
    url: "https://doi.org/10.1038/s41560-019-0406-2",
    doi: "10.1038/s41560-019-0406-2",
    supports: t(
      "Bọc kín bằng polymer tự lành làm giảm lượng chì rò từ module hỏng.",
      "Self-healing polymer encapsulation reduces lead leakage from damaged modules.",
    ),
  },
  {
    n: 96,
    title: "Progress and outlook of Sn–Pb mixed perovskite solar cells",
    by: "H. Lee, S. B. Kang, S. Lee, K. Zhu, D. H. Kim",
    date: "2023-06-16",
    kind: "paper",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10275830/",
    supports: t(
      "Hàm lượng chì của perovskite Sn–Pb thấp hơn 50–60% so với perovskite chì; Sn²⁺ dễ bị oxy hóa thành Sn⁴⁺.",
      "The Pb content of Sn–Pb perovskites is 50–60% lower than Pb-based ones; Sn²⁺ oxidizes easily to Sn⁴⁺.",
    ),
    note: t(
      "Đã mở và đọc trang. Bài vẫn chứa chì, chỉ giảm.",
      "The page was opened and read. These materials still contain lead; it is reduced, not removed.",
    ),
  },
  {
    n: 97,
    title: "Advancements in preventing Sn²⁺ oxidation in tin-based perovskite solar cells: A review",
    by: "Anoop K. M., D. Devadiga, Sunitha M. S., Ahipa T. N.",
    date: "2024-12-16",
    kind: "paper",
    url: "https://doi.org/10.1002/pssa.202400569",
    doi: "10.1002/pssa.202400569",
    supports: t(
      "Perovskite thiếc: oxy hóa Sn²⁺ → Sn⁴⁺ gây khuyết tật, ổn định kém, hiệu suất thấp.",
      "Tin perovskites: Sn²⁺ → Sn⁴⁺ oxidation causes defects, poor stability and lower efficiency.",
    ),
  },
  {
    n: 98,
    title: "Recent progress on raising the efficiency of lead free double perovskite solar cells",
    by: "P. Phonglamjiakngam, Z. A. M. Hazaea, M. Wang et al.",
    date: "2026-01",
    kind: "paper",
    url: "https://doi.org/10.1016/j.solener.2025.114164",
    doi: "10.1016/j.solener.2025.114164",
    supports: t(
      "Perovskite kép không chì: hiệu suất pin nghiên cứu còn xa pin perovskite chì.",
      "Lead-free double perovskites: research-cell efficiency remains far behind lead-halide perovskites.",
    ),
  },
  {
    n: 99,
    title: "Recent advances in Cs₂AgBiBr₆-based halide double perovskites as lead-free and inorganic light absorbers for perovskite solar cells",
    by: "X. Yang, W. Wang, R. Ran, W. Zhou et al.",
    date: "2020-08-03",
    kind: "paper",
    url: "https://doi.org/10.1021/acs.energyfuels.0c02236",
    doi: "10.1021/acs.energyfuels.0c02236",
    supports: t(
      "Cs₂AgBiBr₆: không chì, vô cơ, bền cấu trúc; hiệu suất bị giới hạn mạnh.",
      "Cs₂AgBiBr₆: lead-free, inorganic, structurally stable; its efficiency is strongly restricted.",
    ),
  },
  {
    n: 100,
    title: "All solar cell efficiencies at a glance – updated (Version 68 report)",
    by: "pv magazine USA",
    date: "2026",
    kind: "news",
    url: "https://pv-magazine-usa.com/?p=20587",
    supports: t(
      "Bản tin về Version 68: 28,0% (0,05 cm², Hainan University), tandem 35,2% (1 cm²) và 34,3% (261 cm²), module tandem 31,4% (0,17 m²) và 29,4% (1,7 m²), đều của LONGi.",
      "Report on Version 68: 28.0% (0.05 cm², Hainan University), tandem 35.2% (1 cm²) and 34.3% (261 cm²), tandem modules 31.4% (0.17 m²) and 29.4% (1.7 m²), all by LONGi.",
    ),
    note: t(
      "Bản tin không nêu phòng đo cho các kết quả perovskite. Phòng đo nằm trong bảng gốc [2].",
      "The report names no test laboratory for the perovskite results. The laboratory is in the original table [2].",
    ),
  },
  {
    n: 101,
    title: "Rapid advances enabling high-performance inverted perovskite solar cells",
    by: "Qi Jiang, Kai Zhu",
    date: "2024-05-17",
    kind: "review",
    journal: "Nature Reviews Materials 9, 399–419",
    evidence: "literature",
    url: "https://doi.org/10.1038/s41578-024-00678-x",
    doi: "10.1038/s41578-024-00678-x",
    supports: t(
      "Tổng quan về pin perovskite đảo (p–i–n): vì sao cấu trúc này hấp dẫn và tiến bộ đến từ vật liệu vận chuyển điện tích, thành phần perovskite và cách chế tạo.",
      "Review of inverted (p–i–n) perovskite cells: why the architecture is attractive, and that progress came from charge-transport materials, perovskite compositions and fabrication methods.",
    ),
    note: t(
      "Metadata kiểm qua Crossref. Toàn văn không mở được (trang Nature yêu cầu đăng nhập, bản OSTI không tải được), nên chỉ dùng mức tóm tắt; không lấy số liệu cụ thể từ bài này.",
      "Metadata checked through Crossref. The full text could not be opened (Nature login wall, OSTI copy unreachable), so only abstract-level statements are used; no specific numbers are taken from this review.",
    ),
  },
  {
    n: 102,
    title: "Recent Advances of Inverted Perovskite Solar Cells",
    by: "Xinhui Luo, Xiao Liu, Xuesong Lin, Tianhao Wu, Yanbo Wang, Qifeng Han, Yongzhen Wu, Hiroshi Segawa, Liyuan Han",
    date: "2024-03-12",
    kind: "review",
    journal: "ACS Energy Letters 9(4), 1487–1506",
    evidence: "literature",
    url: "https://doi.org/10.1021/acsenergylett.4c00140",
    doi: "10.1021/acsenergylett.4c00140",
    supports: t(
      "Tổng quan về pin p–i–n: vật liệu vận chuyển lỗ trống (nhấn mạnh SAM), vật liệu vận chuyển điện tử, vật liệu chỉnh sửa giao diện để thụ động hóa khuyết tật, và thách thức về hiệu suất và độ bền.",
      "Review of p–i–n cells: hole-transport materials (SAMs highlighted), electron-transport materials, interface-modification materials that passivate defects, and the efficiency and stability challenges.",
    ),
    note: t(
      "Metadata và phần tóm tắt kiểm qua Crossref/OpenAlex. Toàn văn bị khóa; các ví dụ vật liệu cụ thể được đối chiếu thêm với [105], [106]. Tên PCBM nêu trong đề bài được xác nhận ở [106].",
      "Metadata and abstract checked through Crossref/OpenAlex. The full text is paywalled; specific material examples were cross-checked against [105] and [106]. PCBM, named in the brief, is confirmed in [106].",
    ),
  },
  {
    n: 103,
    title: "Molecular cation and low-dimensional perovskite surface passivation in perovskite solar cells",
    by: "Sam Teale, Matteo Degani, Bin Chen, Edward H. Sargent, Giulia Grancini",
    date: "2024-07-04",
    kind: "review",
    journal: "Nature Energy 9, 779–792",
    evidence: "literature",
    url: "https://doi.org/10.1038/s41560-024-01529-3",
    doi: "10.1038/s41560-024-01529-3",
    supports: t(
      "Tái hợp cao hơn nhiều ở giao diện lớp vận chuyển/perovskite; thụ động hóa bằng cation amoni; lớp 2D có thể cản điện tử và làm hại pin p–i–n; lớp chắn (SnO₂…) cản di chuyển halide; ánh sáng và nhiệt độ gây hại hơn ẩm khi đã đóng gói.",
      "Non-radiative recombination is much higher at charge-transport-layer / perovskite interfaces; ammonium-cation passivation; a conformal 2D layer can block electrons and hurt p–i–n cells; barrier layers (SnO₂…) hinder halide migration; light and heat are more damaging than moisture once encapsulated.",
    ),
    note: t(
      "Đã đọc toàn văn (bản PDF mở của Northwestern). Định nghĩa n–i–p và p–i–n ở phần \"Implications for photovoltaic efficiency\". Ví dụ SnO₂ và spiro-OMeTAD trong pin n–i–p được suy ra từ danh mục tài liệu tham khảo của bài.",
      "Full text read (open PDF from Northwestern). The n–i–p / p–i–n definition is in \"Implications for photovoltaic efficiency\". The SnO₂ and spiro-OMeTAD examples for n–i–p cells are inferred from the article's reference list.",
    ),
  },
  {
    n: 104,
    title: "Self-assembled monolayers for perovskite solar cells",
    by: "Dongdong Xu, Pu Wu, Hairen Tan",
    date: "2024-03-14",
    kind: "review",
    journal: "Information & Functional Materials 1(1), 2–25",
    evidence: "literature",
    url: "https://doi.org/10.1002/ifm2.8",
    doi: "10.1002/ifm2.8",
    supports: t(
      "SAM nối oxit kim loại và perovskite: ở giao diện oxit/perovskite có tái hợp, mức năng lượng chưa tối ưu, khuếch tán ion và ăn mòn hóa học; SAM giúp thụ động hóa, chỉnh mức năng lượng và giảm ăn mòn giao diện.",
      "SAMs bridge metal oxides and perovskite: the oxide/perovskite interface suffers recombination, non-optimal energy levels, ion diffusion and chemical corrosion; SAMs help with passivation, energy-level tuning and reducing interface corrosion.",
    ),
    note: t(
      "Metadata và phần tóm tắt kiểm qua Crossref/OpenAlex. Trang Wiley trả 403 nên chưa đọc toàn văn; chỉ dùng các câu có trong tóm tắt.",
      "Metadata and abstract checked through Crossref/OpenAlex. The Wiley page returned 403, so the full text was not read; only statements in the abstract are used.",
    ),
  },
  {
    n: 105,
    title: "Self-Assembled Monolayer-Based Hole-Transporting Materials for Perovskite Solar Cells",
    by: "Doyeong Yeo, Juyeon Shin, Dabit Kim, Jae Jaung, In Jung",
    date: "2024-01-12",
    kind: "review",
    journal: "Nanomaterials 14(2), 175",
    evidence: "literature",
    url: "https://doi.org/10.3390/nano14020175",
    doi: "10.3390/nano14020175",
    supports: t(
      "SAM gồm nhóm đầu, nhóm nối và nhóm neo (phosphonic, carboxylic…); SAM nằm giữa ITO và perovskite; lợi thế (tổng hợp đơn giản, lớp cực mỏng, hợp diện tích lớn) và hạn chế (ít loại nhóm neo, độ axit ảnh hưởng độ bền, đa số xử lý dung dịch).",
      "A SAM has head, linker and anchoring groups (phosphonic, carboxylic…); it sits between ITO and the perovskite; advantages (simple synthesis, extremely thin, suited to large area) and limits (few anchor types, acidity affects stability, mostly solution-processed).",
    ),
    note: t(
      "Đã đọc toàn văn trên PMC (PMC10818599). Các bảng thiết bị của bài theo mẫu ITO/SAM/perovskite/C₆₀/BCP/kim loại.",
      "Full text read on PMC (PMC10818599). The review's device tables follow the pattern ITO / SAM / perovskite / C₆₀ / BCP / metal.",
    ),
  },
  {
    n: 106,
    title: "Recent Advances in Inverted Perovskite Solar Cells: Designing and Fabrication",
    by: "Jiayan Yang, Xingrui Luo, Yankai Zhou, Yingying Li, Qingqing Qiu, Tengfeng Xie",
    date: "2022-10-04",
    kind: "review",
    journal: "International Journal of Molecular Sciences 23(19), 11792",
    evidence: "literature",
    url: "https://doi.org/10.3390/ijms231911792",
    doi: "10.3390/ijms231911792",
    supports: t(
      "Chồng lớp TCO / HTL / lớp hấp thụ / ETL / điện cực kim loại; NiOₓ trong suốt, lấy điện tích tốt nhưng cần pha tạp để dẫn tốt; PTAA kỵ nước nhưng dẫn kém và khó thấm ướt; ETL chủ yếu là fullerene (PCBM, C₆₀), BCP ở giao diện kim loại; ổn định, diện tích lớn và đóng gói là nút thắt.",
      "TCO / HTL / absorber / ETL / metal-electrode stack; NiOₓ is transparent and extracts charge well but needs doping for conductivity; PTAA is hydrophobic but conducts poorly and is hard to wet; ETLs are mostly fullerenes (PCBM, C₆₀) with BCP at the metal interface; stability, large area and protection are the bottlenecks.",
    ),
    note: t(
      "Đã đọc phần lớn toàn văn trên PMC (PMC9569998); phần cuối (khoảng 16 000 ký tự) chỉ là danh mục tài liệu. Không tìm thấy trong bài: vai trò của SnO₂ ALD, phản ứng ăn mòn của kim loại với halide.",
      "Most of the full text was read on PMC (PMC9569998); the last ~16,000 characters are the reference list. Not found in the article: the role of ALD SnO₂, and metal-halide corrosion.",
    ),
  },
  {
    n: 107,
    title: "Advances in inverted perovskite solar cells",
    by: "Xin Zhang, Shengfan Wu, Hong Zhang, Alex K.-Y. Jen, Yiqiang Zhan, Junhao Chu",
    date: "2024-10-28",
    kind: "review",
    journal: "Nature Photonics 18(12), 1243–1253",
    evidence: "literature",
    url: "https://doi.org/10.1038/s41566-024-01541-9",
    doi: "10.1038/s41566-024-01541-9",
    supports: t(
      "Pin p–i–n (đảo) đã bắt đầu sánh ngang pin n–i–p thường về hiệu suất, và được dùng làm pin con trong tandem.",
      "Inverted (p–i–n) cells have begun to rival regular (n–i–p) cells in efficiency, and serve as sub-cells in tandems.",
    ),
    note: t(
      "Metadata kiểm qua Crossref. Trang Nature yêu cầu đăng nhập nên không mở được tóm tắt hay toàn văn; ý trên lấy từ bản tóm tắt qua công cụ tìm kiếm, chưa đối chiếu với bài. Không dùng con số cụ thể từ bài này.",
      "Metadata checked through Crossref. The Nature page sits behind a login, so neither the abstract nor the full text was opened; the statement comes from a search-engine summary of the abstract and was not checked against the paper. No specific numbers are used from it.",
    ),
  },
  {
    n: 108,
    title: "Inverted Hysteresis in n–i–p and p–i–n Perovskite Solar Cells",
    by: "Rodrigo García-Rodríguez, Antonio J. Riquelme, Matthew Cowley, Karen Valadez-Villalobos, Gerko Oskam, Laurence J. Bennett, Matthew J. Wolf, Lidia Contreras-Bernal, Petra J. Cameron, Alison B. Walker, Juan A. Anta",
    date: "2022-12-31",
    kind: "paper",
    journal: "Energy Technology 10(12), 2200507",
    evidence: "measured",
    url: "https://doi.org/10.1002/ente.202200507",
    doi: "10.1002/ente.202200507",
    supports: t(
      "Cả hai kiến trúc đều có trễ dòng–thế: p–i–n có thể cho trễ đảo ở tốc độ quét đủ cao, n–i–p thường cho trễ thuận; kết quả phụ thuộc lớp vận chuyển, độ kết tinh perovskite và tiền xử lý.",
      "Both architectures show current–voltage hysteresis: p–i–n cells can show inverted hysteresis at a high enough scan rate while n–i–p cells usually show normal hysteresis; the result depends on the transport layers, perovskite crystallinity and preconditioning.",
    ),
    note: t(
      "Phần tóm tắt đọc qua cổng nghiên cứu của Đại học Bath; chưa mở toàn văn. Bài kết hợp thực nghiệm và mô hình trôi–khuếch tán.",
      "Abstract read through the University of Bath research portal; the full text was not opened. The paper combines experiments with drift-diffusion modelling.",
    ),
  },
  {
    n: 109,
    title: "Rapid and low temperature processing of mesoporous TiO2 for perovskite solar cells on flexible and rigid substrates",
    by: "Benjamin Feleki, Guy Bex, Ronn Andriessen, Yulia Galagan, Francesco Di Giacomo",
    date: "2017-12",
    kind: "paper",
    journal: "Materials Today Communications 13, 232–240",
    evidence: "measured",
    url: "https://doi.org/10.1016/j.mtcomm.2017.09.007",
    doi: "10.1016/j.mtcomm.2017.09.007",
    supports: t(
      "Lớp TiO₂ truyền thống thường cần thiêu kết 450–500 °C trong 30 phút, không hợp với đế nhựa; xử lý bằng xung ánh sáng cường độ cao rút thời gian còn vài giây.",
      "Conventional TiO₂ layers often need sintering at 450–500 °C for 30 min, which does not suit plastic substrates; intense pulsed light cuts the time to a few seconds.",
    ),
    note: t(
      "Phần tóm tắt đọc qua cổng nghiên cứu của TU Eindhoven; chưa mở toàn văn.",
      "Abstract read through the TU Eindhoven research portal; the full text was not opened.",
    ),
  },
  {
    n: 110,
    title: "How to Make over 20% Efficient Perovskite Solar Cells in Regular (n–i–p) and Inverted (p–i–n) Architectures",
    by: "Michael Saliba, Juan-Pablo Correa-Baena, Christian M. Wolff, Martin Stolterfoht, Nga Phung, Steve Albrecht, Dieter Neher, Antonio Abate",
    date: "2018-06-11",
    kind: "paper",
    journal: "Chemistry of Materials 30(13), 4193–4201",
    evidence: "measured",
    url: "https://doi.org/10.1021/acs.chemmater.8b00136",
    doi: "10.1021/acs.chemmater.8b00136",
    supports: t(
      "Cả pin n–i–p thường và p–i–n đảo đều có quy trình đã công bố cho hiệu suất từ 20% trở lên; các tác giả nhấn mạnh quy trình chi tiết và dễ lặp lại.",
      "Both regular n–i–p and inverted p–i–n cells have published protocols for efficiencies of 20% or more; the authors stress detailed, reproducible protocols.",
    ),
    note: t(
      "Phần tóm tắt đọc qua OpenAlex; chưa mở toàn văn. Chỉ dùng để nói cả hai kiến trúc đều làm được trên 20%; không dùng để xếp hạng.",
      "Abstract read through OpenAlex; the full text was not opened. Used only to say both architectures reach above 20%, not to rank them.",
    ),
  },
];

export function sourceOf(n: number): Source | undefined {
  return SOURCES.find((s) => s.n === n);
}
