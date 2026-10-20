/**
 * Chapter 5 · Proposed improvement: choose a p–i–n stack, give every layer a job, justify the materials,
 * and prove stability with ISOS procedures.
 *
 *   5.1  Step 1 — choose a p–i–n stack          (scene sPin)
 *   5.2  Step 2 — one job per layer             (scene sFunc)
 *   5.3  Step 3 — why those ingredients         (scene sMat)
 *
 * Same engine as Chapters 3 and 4: every text is a Vietnamese / English pair written once with `t()`.
 * Everything here is a conceptual teaching model unless a citation says otherwise.
 */
import { registerStories, t, type FabControl, type StorySpec, type StoryStep } from "./story";

/* ───────────────────────── the one device model ───────────────────────── */

export const LAYER_IDS = ["glass", "tco", "htl", "perov", "etl", "buf", "metal"] as const;
export type LayerId = (typeof LAYER_IDS)[number];

/** One colour per layer and per particle, identical in every scene of the chapter. They are conventions, not physical properties. */
export const HEX = {
  glass: "#bcd9ee",
  tco: "#a9c2d8",
  htl: "#3fbf7f",
  perov: "#f2b233",
  etl: "#8a5cd6",
  buf: "#e3a6d0",
  metal: "#c9d1da",
  enc: "#9fe8f4",
  e: "#4aa3ff",
  h: "#ff7a2f",
  ph: "#ffe14a",
  defect: "#ff3b4a",
};

export type LayerInfo = {
  name: string;
  /** Label drawn on the model (p–i–n wording). */
  tag: string;
  /** Label when the layers are arranged n–i–p (only the two contacts change). */
  tagNip?: string;
  role: string;
  materials: string;
  consider: string;
  cite: number[];
};

export const LAYERS: Record<LayerId, LayerInfo> = {
  glass: {
    name: t("Kính nền", "Glass substrate"),
    tag: t("Kính", "Glass"),
    role: t(
      "Đỡ cả thiết bị và cho ánh sáng đi vào. Trong ví dụ này ánh sáng vào từ phía kính.",
      "Supports the whole device and lets sunlight in. In this example light enters from the glass side.",
    ),
    materials: t("Một tấm kính; thường chính nó là lớp bảo vệ mặt trước.", "A sheet of glass; it often also serves as the front protection."),
    consider: t("Phải phẳng và trong suốt với phần phổ mà lớp hấp thụ cần.", "It must be flat and transparent to the part of the spectrum the absorber needs."),
    cite: [101],
  },
  tco: {
    name: t("Điện cực trong suốt", "Transparent electrode"),
    tag: t("Điện cực trong suốt (ITO)", "Transparent electrode (ITO)"),
    role: t(
      "Cho ánh sáng đi qua và đồng thời thu dòng điện về mạch ngoài.",
      "Lets light through and, at the same time, collects the current for the external circuit.",
    ),
    materials: t(
      "ITO (oxit thiếc–indi) trong chồng lớp ví dụ. Tùy thiết kế, các điện cực trong suốt khác cũng được dùng.",
      "ITO (indium tin oxide) in the example stack. Other transparent electrodes are used depending on the design.",
    ),
    consider: t(
      "Phải cân bằng hai việc đối nghịch nhau: trong suốt và dẫn điện tốt.",
      "It must balance two requirements that pull against each other: being transparent and conducting well.",
    ),
    cite: [105],
  },
  htl: {
    name: t("Tiếp xúc chọn lọc lỗ trống (HTL)", "Hole-selective contact (HTL)"),
    tag: t("HTL / SAM (chọn lọc lỗ trống)", "HTL / SAM (hole-selective)"),
    tagNip: t("HTL, ví dụ Spiro-OMeTAD", "HTL, e.g. spiro-OMeTAD"),
    role: t(
      "Ưu tiên lấy lỗ trống ra điện cực và hạn chế điện tử đi vào cùng cửa này.",
      "Preferentially takes holes to the electrode and makes it harder for electrons to enter by the same door.",
    ),
    materials: t(
      "Đơn lớp tự sắp xếp (SAM) như 2PACz hay MeO-2PACz; hoặc lớp oxit như NiOₓ; hoặc polyme như PTAA. Đây là các lựa chọn thay thế nhau, không phải chồng cả ba.",
      "A self-assembled monolayer (SAM) such as 2PACz or MeO-2PACz; or an oxide such as NiOₓ; or a polymer such as PTAA. These are alternatives, not a stack of all three.",
    ),
    consider: t(
      "SAM: độ phủ và độ axit của nhóm neo ảnh hưởng độ bền. NiOₓ: giao diện oxit/perovskite có thể gây tái hợp và ăn mòn hóa học.",
      "SAM: coverage and the acidity of the anchoring group affect stability. NiOₓ: the oxide/perovskite interface can cause recombination and chemical corrosion.",
    ),
    cite: [102, 104, 105, 106],
  },
  perov: {
    name: t("Chất hấp thụ perovskite", "Perovskite absorber"),
    tag: t("Chất hấp thụ perovskite", "Perovskite absorber"),
    role: t(
      "Hấp thụ photon để tạo điện tử và lỗ trống di động, rồi để chúng đi tới các lớp tiếp xúc.",
      "Absorbs photons to make mobile electrons and holes, then lets them travel to the contacts.",
    ),
    materials: t(
      "Perovskite halide dạng ABX₃. Thành phần được chọn theo vùng cấm, độ bền và quy trình chế tạo.",
      "A halide perovskite of the ABX₃ type. The composition is chosen for bandgap, stability and fabrication route.",
    ),
    consider: t(
      "Tái hợp ở bề mặt và ở giao diện với lớp vận chuyển thường lớn hơn trong khối, nên giao diện được chăm sóc nhiều.",
      "Recombination at the surface and at the interfaces with the transport layers is usually larger than in the bulk, so interfaces get a lot of attention.",
    ),
    cite: [101, 103],
  },
  etl: {
    name: t("Lớp vận chuyển điện tử (ETL)", "Electron transport layer (ETL)"),
    tag: t("ETL (C₆₀)", "ETL (C₆₀)"),
    tagNip: t("ETL, ví dụ SnO₂", "ETL, e.g. SnO₂"),
    role: t(
      "Ưu tiên lấy điện tử ra điện cực và hạn chế lỗ trống đi vào cùng cửa này.",
      "Preferentially takes electrons to the electrode and makes it harder for holes to enter by the same door.",
    ),
    materials: t(
      "C₆₀ trong ví dụ; PCBM và các fullerene khác cũng hay dùng trong pin p–i–n.",
      "C₆₀ in the example; PCBM and other fullerenes are also common in p–i–n cells.",
    ),
    consider: t(
      "Giao diện C₆₀/perovskite là nơi tái hợp mạnh: huỳnh quang của màng bị dập tắt nhiều, nên cần xử lý giao diện.",
      "The C₆₀/perovskite interface is a strong recombination site: the film's photoluminescence is quenched a lot, so the interface needs treatment.",
    ),
    cite: [103, 106],
  },
  buf: {
    name: t("Lớp đệm / lớp giao diện (tùy chọn)", "Buffer / interfacial layer (optional)"),
    tag: t("Lớp đệm (tùy chọn)", "Buffer (optional)"),
    role: t(
      "Một lớp rất mỏng giữa ETL và kim loại: cải thiện tiếp xúc, chặn lỗ trống rò, hoặc cản ion di chuyển tới điện cực.",
      "A very thin layer between the ETL and the metal: improves contact, blocks leaking holes, or hinders ions on their way to the electrode.",
    ),
    materials: t(
      "BCP là ví dụ hay gặp; lớp oxit mỏng như SnO₂ được dùng làm lớp chắn.",
      "BCP is a common example; a thin oxide such as SnO₂ is used as a barrier layer.",
    ),
    consider: t(
      "Tác dụng phụ thuộc hóa học, độ dày và quy trình; một lớp đệm hợp với chồng này có thể không hợp với chồng khác.",
      "The effect depends on chemistry, thickness and process; a buffer that suits one stack may not suit another.",
    ),
    cite: [103, 106],
  },
  metal: {
    name: t("Điện cực kim loại", "Metal electrode"),
    tag: t("Điện cực kim loại", "Metal electrode"),
    role: t(
      "Thu điện tích ở mặt sau (điện tử trong p–i–n, lỗ trống trong n–i–p) và nối ra mạch ngoài.",
      "Collects charge at the back (electrons in p–i–n, holes in n–i–p) and connects to the external circuit.",
    ),
    materials: t(
      "Bạc trong hình; vàng và nhôm cũng xuất hiện trong các thiết bị đã công bố.",
      "Silver in the drawing; gold and aluminium also appear in published devices.",
    ),
    consider: t(
      "Ion halide di chuyển có thể tới tận điện cực, nên người ta thêm lớp chắn và cần một chiến lược bảo vệ chung.",
      "Mobile halide ions can reach the electrode, so barrier layers are added and an overall protection strategy is needed.",
    ),
    cite: [103, 106],
  },
};

export const ENC = {
  name: t("Đóng gói", "Encapsulation"),
  tag: t("Đóng gói (vỏ bảo vệ)", "Encapsulation (protective shell)"),
  role: t(
    "Bao kín thiết bị bằng vật liệu bảo vệ để giảm tiếp xúc với môi trường; nó cũng có thể giữ lại sản phẩm phân hủy dễ bay hơi.",
    "Encloses the device in protective materials to reduce exposure to the environment; it may also keep volatile decomposition products in.",
  ),
  cite: [38, 103],
};

export const P = {
  e: t("Điện tử e⁻", "Electron e⁻"),
  h: t("Lỗ trống h⁺", "Hole h⁺"),
  ph: t("Photon", "Photon"),
  eShort: t("Electron (e−)", "Electron (e−)"),
  hShort: t("Hole (h+)", "Hole (h+)"),
  defect: t("Khuyết tật giao diện", "Interface defect"),
  notScale: t("Không đúng tỉ lệ: lớp SAM và C₆₀ thật chỉ dày cỡ nanomet", "Not to scale: a real SAM and C₆₀ layer are nanometres thick"),
  concept: t("Minh họa khái niệm, không phải mô phỏng định lượng.", "Conceptual illustration, not a quantitative simulation."),
  carriersConcept: t("Quỹ đạo hạt chỉ minh họa ý tưởng, không phải mô phỏng.", "Particle paths illustrate the idea; they are not a simulation."),
  back: t("Quay lại tổng quan", "Back to overview"),
};

const step = (
  title: string,
  body: string,
  why: string,
  cam: string,
  dur: number,
  cite?: number[],
  extra?: Partial<StoryStep>,
): StoryStep => ({ title, body, why, cam, dur, cite, ...extra });

const seg = (key: string, label: string, opts: [string, string][], def: string, at?: number[]): FabControl => ({
  kind: "seg",
  key,
  label,
  opts: opts.map(([v, l]) => ({ v, label: l })),
  def,
  at,
});

/** The detail column opens and closes with this (never shown in the bar: `at` is empty). */
const panelCtl = (def: "open" | "closed"): FabControl => seg("panel", t("Chi tiết", "Details"), [["open", "open"], ["closed", "closed"]], def, []);

const ON = t("Bật", "On");
const OFF = t("Tắt", "Off");

/* ───────────────────────── 5.1 ───────────────────────── */

/** 5.1 · the p–i–n vs n–i–p comparison table. `c` is the qualitative label; a missing `c` is a plain description. */
export type ArchSide = { text: string; c?: Cat; cite?: number[] };
export type ArchRow = { id: string; name: string; pin: ArchSide; nip: ArchSide };

export const ARCH_ROWS: ArchRow[] = [
  {
    id: "order",
    name: t("Thứ tự lớp / hướng sáng", "Layer order / light direction"),
    pin: { text: t("Sáng → HTL (p) → Perovskite (i) → ETL (n)", "Light → HTL (p) → Perovskite (i) → ETL (n)"), cite: [103] },
    nip: { text: t("Sáng → ETL (n) → Perovskite (i) → HTL (p)", "Light → ETL (n) → Perovskite (i) → HTL (p)"), cite: [103] },
  },
  {
    id: "pce",
    name: t("Hiệu suất (PCE)", "Efficiency (PCE)"),
    pin: { text: t("Đã tiến sát n–i–p", "Close to n–i–p"), c: "adv", cite: [107, 101] },
    nip: { text: t("Đã đạt hiệu suất cao", "Has reached high efficiency"), cite: [110] },
  },
  {
    id: "stab",
    name: t("Độ ổn định", "Stability"),
    pin: { text: t("Vận hành ổn định (theo tổng quan)", "Stable in operation (per reviews)"), c: "adv", cite: [101, 107] },
    nip: { text: t("Tùy HTL và thiết kế", "Depends on the HTL and the design") },
  },
  {
    id: "hyst",
    name: t("Trễ dòng–thế", "Hysteresis"),
    pin: { text: t("Thường ít trễ, nhưng có thể trễ đảo", "Usually small, but can invert"), c: "trade", cite: [108] },
    nip: { text: t("Thường trễ thuận, tùy tốc độ quét", "Usually normal; depends on scan rate"), c: "trade", cite: [108] },
  },
  {
    id: "temp",
    name: t("Nhiệt độ chế tạo", "Fabrication temperature"),
    pin: { text: t("Nhiệt thấp, hợp đế dẻo", "Low temperature, flexible-friendly"), c: "adv", cite: [101] },
    nip: { text: t("TiO₂ mesoporous: 450–500 °C, khó với đế nhựa", "Mesoporous TiO₂: 450–500 °C, hard on plastic"), c: "trade", cite: [109] },
  },
  {
    id: "mat",
    name: t("Vật liệu điển hình", "Typical materials"),
    pin: { text: t("HTL: SAM, NiOₓ, PTAA · ETL: C₆₀, PCBM", "HTL: SAM, NiOₓ, PTAA · ETL: C₆₀, PCBM"), cite: [102, 106] },
    nip: { text: t("ETL: TiO₂, SnO₂ · HTL: spiro-OMeTAD", "ETL: TiO₂, SnO₂ · HTL: spiro-OMeTAD"), cite: [103, 109] },
  },
  {
    id: "tandem",
    name: t("Tandem", "Tandem"),
    pin: { text: t("Rất tương thích", "Highly compatible"), c: "adv", cite: [101, 107] },
    nip: { text: t("Có thể dùng làm tandem", "Can be used in tandems") },
  },
  {
    id: "pros",
    name: t("Ưu điểm chính", "Main strengths"),
    pin: { text: t("Ổn định, nhiệt thấp, hợp tandem", "Stable, low temperature, tandem-ready"), c: "adv", cite: [101, 107] },
    nip: { text: t("Cấu trúc kinh điển, nhiều nhóm đạt hiệu suất cao", "Classic structure, many high-efficiency results"), c: "adv", cite: [110] },
  },
  {
    id: "cons",
    name: t("Nhược điểm chính", "Main limitations"),
    pin: { text: t("PTAA khó thấm ướt, dẫn kém", "PTAA is hard to wet and conducts poorly"), c: "trade", cite: [106] },
    nip: { text: t("TiO₂ cần nhiệt cao; trễ và độ bền cần kiểm", "TiO₂ needs heat; hysteresis and durability to check"), c: "trade", cite: [109, 108] },
  },
];


const PIN: StorySpec = {
  id: "pin",
  scene: "sPin",
  section: "5.1",
  group: "design",
  microSwitch: false,
  views: [t("Hai pin", "Both cells"), t("Gần hơn", "Closer"), t("Xa hơn", "Wider")],
  title: t("Bước 1 — chọn kiến trúc p-i-n", "Step 1 — Choose a p–i–n stack"),
  sentence: t(
    "Trước khi cải tiến, hãy chọn kiến trúc: lớp nào nằm ở đâu quanh lớp hấp thụ perovskite.",
    "Before improving a cell, choose the architecture: which layer sits where around the perovskite absorber.",
  ),
  final: t("5.1 là chọn kiến trúc: lớp nào đặt ở đâu.", "5.1 is about choosing the architecture: which layer goes where."),
  qa: {
    q: t("Kiến trúc quyết định điều gì?", "What does the architecture decide?"),
    a: t("Thứ tự lớp, đường đi của điện tích và các giao diện phải tối ưu.", "The order of the layers, the charge-extraction path and the interfaces to optimise."),
  },
  legend: [
    { swatch: "c5tco", label: t("Điện cực trong suốt", "Transparent electrode") },
    { swatch: "c5htl", label: t("HTL (lỗ trống)", "HTL (holes)") },
    { swatch: "c5perov", label: t("Perovskite", "Perovskite") },
    { swatch: "c5etl", label: t("ETL (điện tử)", "ETL (electrons)") },
    { swatch: "c5metal", label: t("Kim loại", "Metal") },
  ],
  simple: t(
    "Pin perovskite là một chiếc bánh kẹp: lớp ở giữa hấp thụ ánh sáng, hai lớp hai bên giúp điện tích đi ra đúng cửa.",
    "A perovskite cell is a sandwich: the middle layer catches the light, and the two layers beside it help charges leave by the right door.",
  ),
  options: "none",
  brief: true,
  controls: [
    panelCtl("closed"),
    seg("ex", t("Tách lớp", "Exploded view"), [["auto", t("Tự động", "Auto")], ["asm", t("Ghép", "Assembled")], ["exp", t("Đã tách", "Exploded")]], "auto", [0]),
    seg("clab", t("Nhãn hạt tải", "Carrier labels"), [["on", ON], ["off", OFF]], "off", [0]),
  ],
  factList: [
    { k: t("Câu hỏi của bước này", "Question of this step"), v: t("Các lớp nên sắp xếp thế nào?", "How should the layers be arranged?") },
    { k: t("Chồng lớp ví dụ", "Example stack"), v: t("Kính / ITO / SAM / perovskite / C₆₀ / lớp đệm / kim loại. Chỉ là một ví dụ minh họa, không phải công thức chung.", "Glass / ITO / SAM / perovskite / C₆₀ / buffer / metal. An illustrative example, not a universal recipe.") },
    { k: "p–i–n", v: t("Kiến trúc có vùng chọn lọc lỗ trống (p), vùng quang hoạt (i) và vùng chọn lọc điện tử (n). Lớp perovskite không phải ba lớp p, i, n.", "An architecture with a hole-selective side (p), a photoactive region (i) and an electron-selective side (n). The absorber is not literally three p, i, n layers.") },
    { k: t("So với n–i–p", "Compared with n–i–p"), v: t("Hai kiến trúc đều tạo ra điện. Chọn cái nào còn tùy hiệu suất, độ bền, vật liệu, quy trình và ứng dụng.", "Both generate electricity. The choice depends on performance, stability, materials, processing and application.") },
    { k: t("Về bảng so sánh", "About the comparison table"), v: t("Mỗi ô có nhãn định tính và nguồn. Các ý về độ ổn định chủ yếu từ tổng quan, chưa phải so sánh đối chứng.", "Each cell has a qualitative label and sources. The stability points come mostly from reviews, not a controlled comparison.") },
    { k: t("Độ dày", "Thickness"), v: t("Vẽ phóng đại cho dễ nhìn; không đúng tỉ lệ.", "Exaggerated for clarity; not to scale.") },
  ],
  factRefs: [101, 102, 103, 107, 108, 109, 110],
  steps: [
    step(
      t("So sánh p–i–n với n–i–p", "Compare p–i–n with n–i–p"),
      t(
        "Hai pin cạnh nhau, cùng chiếu sáng từ phía kính. Cả hai đều có đủ ba vùng: chọn lọc lỗ trống (p), perovskite quang hoạt (i) và chọn lọc điện tử (n); khác nhau ở thứ tự. p–i–n: sáng → HTL → perovskite → ETL. n–i–p: sáng → ETL → perovskite → HTL, nên điện tử và lỗ trống ra hai điện cực ngược lại. Tên p–i–n không có nghĩa lớp perovskite gồm ba lớp p, i, n. Nút “Bảng so sánh” trên sân khấu mở bảng chín tiêu chí, mỗi ô có nhãn và nguồn. Kiến trúc nào hợp hơn tùy hiệu suất, độ bền, vật liệu, quy trình và ứng dụng.",
        "Two cells side by side, lit from the glass side. Both have the same three regions: hole-selective (p), photoactive perovskite (i) and electron-selective (n); only the order differs. p–i–n: light → HTL → perovskite → ETL. n–i–p: light → ETL → perovskite → HTL, so electrons and holes leave through opposite electrodes. The name p–i–n does not mean the perovskite itself is made of three p, i, n layers. The “p–i–n vs n–i–p table” button on the stage opens a nine-criteria table, each cell with a label and sources. Which architecture suits better depends on performance, stability, materials, processing and application.",
      ),
      t("p–i–n không phải “tốt hơn mọi mặt”: nó là một lựa chọn với đánh đổi riêng, và n–i–p cũng vậy.", "p–i–n is not “better in every way”: it is one choice with its own trade-offs, and so is n–i–p."),
      "1",
      18,
      [101, 102, 103, 107, 108, 109, 110],
      { info: t("p = vùng chọn lọc lỗ trống · i = vùng quang hoạt · n = vùng chọn lọc điện tử. Ví dụ minh họa, không đúng tỉ lệ.", "p = hole-selective region · i = photoactive region · n = electron-selective region. Illustrative, not to scale."), final: true },
    ),
  ],
};

/* ───────────────────────── 5.2 ───────────────────────── */

const FUNC: StorySpec = {
  id: "stack",
  scene: "sFunc",
  section: "5.2",
  group: "design",
  microSwitch: false,
  views: [t("Hai thiết bị", "Both devices"), t("Gần hơn", "Closer"), t("Xa hơn", "Wider")],
  title: t("Bước 2 — mỗi lớp một việc", "Step 2 — One job per layer"),
  sentence: t(
    "Mỗi lớp có một vai trò chính; thiết kế tốt đưa đúng điện tích về đúng điện cực và giảm tổn thất.",
    "Each layer has a primary role; a good design brings the right charge to the right electrode and reduces losses.",
  ),
  final: t("5.2: mỗi lớp giúp đúng điện tích tới đúng cửa.", "5.2: each layer helps the right charge exit."),
  qa: {
    q: t("Vì sao chỉ nói “mỗi lớp một việc”?", "Why say “one job per layer”?"),
    a: t("Đó là cách đơn giản hóa; thực tế một lớp có thể làm nhiều việc, nhưng mỗi lớp cần một vai trò chính rõ ràng.", "It is a simplification; real layers can do several things, but each needs one clearly understood primary role."),
  },
  legend: [
    { swatch: "sun", label: t("Photon", "Photon") },
    { swatch: "electron", label: t("Điện tử e⁻", "Electron e⁻") },
    { swatch: "hole", label: t("Lỗ trống h⁺", "Hole h⁺") },
    { swatch: "c5defect", label: t("Khuyết tật giao diện", "Interface defect") },
  ],
  simple: t(
    "Giống một sân ga có hai cửa ra: lỗ trống được dẫn tới cửa này, điện tử tới cửa kia; nếu có chỗ hỏng, một số hành khách bị lạc.",
    "Like a station with two exits: holes are guided to one, electrons to the other; where the platform is damaged, some passengers get lost.",
  ),
  options: "none",
  brief: true,
  controls: [
    panelCtl("closed"),
    seg("ex", t("Tách lớp", "Exploded view"), [["auto", t("Tự động", "Auto")], ["asm", t("Ghép", "Assembled")], ["exp", t("Đã tách", "Exploded")]], "auto", [0]),
    seg("clab", t("Nhãn hạt tải", "Carrier labels"), [["on", ON], ["off", OFF]], "off", [0]),
  ],
  factList: [
    { k: t("Câu hỏi của bước này", "Question of this step"), v: t("Cùng một chồng lớp: thiết kế tốt và thiết kế kém khác nhau ở đâu?", "Same stack: how do a good and a poor design differ?") },
    { k: t("Thiết kế tốt", "Good design"), v: t("Mỗi lớp làm đúng việc: perovskite hấp thụ, HTL lấy lỗ trống, ETL lấy điện tử; hạt tải tới đúng điện cực.", "Each layer does its job: the perovskite absorbs, the HTL takes holes, the ETL takes electrons; carriers reach the right electrode.") },
    { k: t("Thiết kế kém", "Poor design"), v: t("Năng lượng không khớp hoặc giao diện khuyết tật: một số hạt tải tái hợp ở giao diện thay vì ra mạch ngoài.", "Misaligned energy levels or a defective interface: some carriers recombine at the interface instead of reaching the circuit.") },
    { k: t("Giao diện", "Interfaces"), v: t("Tái hợp ở giao diện lớp vận chuyển/perovskite thường lớn hơn trong khối, nên giao diện là nơi tổn thất tập trung.", "Recombination at transport-layer / perovskite interfaces is usually larger than in the bulk, so interfaces are where losses concentrate.") },
    { k: t("So sánh", "The comparison"), v: t("Chỉ là minh họa khái niệm, không có số đo hiệu suất.", "A conceptual illustration only; no efficiency numbers.") },
  ],
  factRefs: [102, 103],
  steps: [
    step(
      t("So sánh thiết kế tốt và kém", "Compare good and poor designs"),
      t(
        "Hai thiết bị cùng chồng lớp, cùng ánh sáng, cạnh nhau. Thiết kế tốt (trái): chọn lọc phù hợp, đường lấy điện tích thuận lợi; điện tử và lỗ trống tới đúng điện cực và mạch ngoài có dòng mạnh. Thiết kế kém (phải): năng lượng không khớp hoặc giao diện có khuyết tật (viền đỏ); một số điện tử và lỗ trống gặp nhau ở đó rồi tái hợp (chớp đỏ) thay vì ra mạch ngoài, nên dòng hữu ích giảm. Tái hợp là khi điện tử và lỗ trống mất đi cùng nhau mà không đóng góp dòng ra ngoài.",
        "Two devices with the same stack and the same light, side by side. Good design (left): appropriate selectivity and favourable extraction pathways; electrons and holes reach the right electrodes and the circuit carries a strong current. Poor design (right): misaligned energy levels or a defective interface (red outline); some electrons and holes meet there and recombine (red flashes) instead of reaching the circuit, so the usable current drops. Recombination is when an electron and a hole are lost together without contributing to the external current.",
      ),
      t("Cùng chồng lớp, chỉ khác chất lượng giao diện, đã khác kết quả — và đó là điều các nhà nghiên cứu phải đo.", "The same stack with only the interface quality changed already gives a different result — and that is what researchers have to measure."),
      "1",
      18,
      [102, 103],
      { info: t("Thiết kế tốt → nhiều hạt tải ra mạch ngoài. Thiết kế kém → thêm tái hợp ở giao diện. Minh họa khái niệm, không có số hiệu suất.", "Good design → more carriers reach the circuit. Poor design → extra recombination at the interface. Conceptual illustration; no efficiency number."), final: true },
    ),
  ],
};

/* ───────────────────────── 5.3 ───────────────────────── */

export type Crit =
  | "align"
  | "select"
  | "cond"
  | "optical"
  | "passiv"
  | "chem"
  | "process"
  | "stab"
  | "manuf"
  | "cost";

export const CRITERIA: { id: Crit; name: string; q: string }[] = [
  { id: "align", name: t("Khớp mức năng lượng", "Energy-level alignment"), q: t("Lấy được đúng điện tích mà không mất quá nhiều năng lượng không?", "Can the desired charge be extracted without excessive energy loss?") },
  { id: "select", name: t("Chọn lọc hạt tải", "Carrier selectivity"), q: t("Lớp có ưu tiên hạt tải mà nó phục vụ không?", "Does the contact favour its intended carrier?") },
  { id: "cond", name: t("Độ dẫn / điện trở tiếp xúc", "Conductivity / contact resistance"), q: t("Điện tích đi qua mà không tổn thất điện quá lớn?", "Can charge move without excessive electrical losses?") },
  { id: "optical", name: t("Độ truyền quang", "Optical transmission"), q: t("Lớp có để phần ánh sáng cần thiết tới lớp hấp thụ không?", "Does the layer let the required light reach the absorber?") },
  { id: "passiv", name: t("Thụ động hóa khuyết tật", "Defect passivation"), q: t("Lớp có giảm khuyết tật giao diện hay tái hợp có hại không?", "Can the layer reduce harmful interface defects or recombination?") },
  { id: "chem", name: t("Tương thích hóa học", "Chemical compatibility"), q: t("Vật liệu có sống chung với perovskite và các lớp kề không?", "Can the material coexist with the perovskite and neighbouring layers?") },
  { id: "process", name: t("Tương thích nhiệt / quy trình", "Thermal / process compatibility"), q: t("Chịu được điều kiện chế tạo và vận hành không?", "Can it tolerate the required fabrication and operating conditions?") },
  { id: "stab", name: t("Độ bền", "Stability"), q: t("Còn hiệu quả khi chịu ánh sáng, nhiệt và môi trường không?", "Does it remain effective during exposure to light, heat and the environment?") },
  { id: "manuf", name: t("Khả năng sản xuất", "Manufacturability"), q: t("Phủ đồng đều được bằng một quy trình thực tế không?", "Can it be deposited uniformly with a practical process?") },
  { id: "cost", name: t("Chi phí và an toàn", "Cost and safety"), q: t("Chi phí, nguồn cung, độc tính và xử lý chất thải có kiểm soát được không?", "Are cost, supply, hazards and disposal manageable?") },
];

export type Cat = "adv" | "trade" | "nv";

export const CAT_LABEL: Record<Cat, string> = {
  adv: t("Là ưu điểm", "Advantage"),
  trade: t("Đánh đổi", "Trade-off"),
  nv: t("Cần kiểm chứng", "Needs validation"),
};

export type Cell = { c: Cat; note?: string; cite?: number[] };
export type Cand = {
  id: string;
  name: string;
  why: string;
  limits: string;
  iface: string;
  fab: string;
  cite: number[];
  cells: Partial<Record<Crit, Cell>>;
};

/** Candidate materials per layer. Categories are qualitative and come with the source behind each cell; "needs validation" is the default. */
export const CANDS: Partial<Record<LayerId | "enc", Cand[]>> = {
  tco: [
    {
      id: "ito",
      name: t("ITO", "ITO"),
      why: t("Là điện cực trong suốt trong các chồng lớp ITO/SAM/perovskite/C₆₀ của các bài tổng quan.", "It is the transparent electrode in the ITO / SAM / perovskite / C₆₀ stacks of the reviews."),
      limits: t("Phải cân bằng độ trong suốt với độ dẫn; bài này không có số liệu so sánh các điện cực.", "Transparency has to be balanced against conductivity; this chapter has no data comparing electrodes."),
      iface: t("Nhóm neo của SAM gắn vào bề mặt ITO; nhóm neo có tính axit mạnh có thể gây ăn mòn.", "A SAM's anchoring group binds to the ITO surface; strongly acidic anchors can cause corrosion."),
      fab: t("Chưa đánh giá ở đây; xem bài gốc.", "Not assessed here; see the original papers."),
      cite: [105],
      cells: { chem: { c: "trade", note: t("Neo axit có thể ăn mòn ITO; neo ít axit giảm ăn mòn.", "Acidic anchors can corrode ITO; low-acidity anchors reduce it."), cite: [105] } },
    },
    {
      id: "other",
      name: t("Điện cực trong suốt khác", "Other transparent electrodes"),
      why: t("Tùy thiết kế thiết bị, các điện cực trong suốt khác cũng được dùng.", "Depending on the device design, other transparent electrodes are used."),
      limits: t("Chưa có bằng chứng so sánh trong bộ nguồn của chương này.", "No comparative evidence in this chapter's source set."),
      iface: t("Cần kiểm chứng.", "Needs validation."),
      fab: t("Cần kiểm chứng.", "Needs validation."),
      cite: [],
      cells: {},
    },
  ],
  htl: [
    {
      id: "sam",
      name: t("SAM (2PACz, MeO-2PACz)", "SAM (2PACz, MeO-2PACz)"),
      why: t(
        "Lớp đơn phân tử cực mỏng, nhóm neo gắn vào ITO nên dịch chuyển công thoát và giảm khuyết tật bề mặt; các SAM như MeO-2PACz/2PACz được báo cáo là khớp năng lượng thuận lợi và giảm tái hợp không bức xạ.",
        "An extremely thin molecular layer whose anchoring group binds ITO, shifting the work function and reducing surface defects; SAMs such as MeO-2PACz / 2PACz are reported with favourable energy alignment and reduced non-radiative recombination.",
      ),
      limits: t(
        "Loại nhóm neo còn ít; độ axit ảnh hưởng độ bền; một dẫn xuất chỉ giữ khoảng 60% sau 1600 giờ trong bài tổng quan; mức khớp năng lượng nhỏ nhất chưa chắc cho hiệu suất cao nhất.",
        "Few anchoring-group types; acidity affects stability; one derivative kept only about 60% after 1600 h in the review; the smallest energy offset does not always give the best performance.",
      ),
      iface: t("Cần phủ kín bề mặt ITO; nhóm đầu quyết định tương tác với perovskite (ví dụ phối trí với Pb²⁺).", "It must cover the ITO surface; the head group sets the interaction with the perovskite (for example coordination to Pb²⁺)."),
      fab: t("Phần lớn xử lý dung dịch; lắng đọng chân không chưa phổ biến nhưng đã được báo cáo cho 2PACz.", "Mostly solution-processed; vacuum deposition is not widespread but has been reported for 2PACz."),
      cite: [105, 104],
      cells: {
        align: { c: "trade", note: t("Điều chỉnh được công thoát, nhưng mức lệch nhỏ nhất không phải lúc nào cũng tốt nhất.", "Work function is tunable, but the smallest offset is not always best."), cite: [105] },
        select: { c: "adv", note: t("Đóng vai lớp vận chuyển lỗ trống trong pin p–i–n.", "Works as the hole-transporting layer in p–i–n cells."), cite: [105] },
        passiv: { c: "adv", note: t("Giảm khuyết tật bề mặt ITO; nhóm đầu có thể thụ động hóa perovskite.", "Reduces ITO surface defects; the head group can passivate the perovskite."), cite: [105, 104] },
        chem: { c: "trade", note: t("Nhóm neo axit có thể ăn mòn ITO; neo axit boronic ít axit giảm ăn mòn.", "Acidic anchors can corrode ITO; a low-acidity boronic-acid anchor reduced corrosion."), cite: [105] },
        process: { c: "trade", note: t("Chủ yếu xử lý dung dịch; chân không ít dùng.", "Mostly solution-processed; vacuum deposition is rarely used."), cite: [105] },
        stab: { c: "trade", note: t("Tùy phân tử: một số kém bền do độ axit.", "Molecule-dependent: some are less stable because of acidity."), cite: [105] },
        manuf: { c: "adv", note: t("Tổng hợp đơn giản, dùng rất ít phân tử, hợp diện tích lớn.", "Simple synthesis, tiny amounts of molecule, suited to large area."), cite: [105] },
      },
    },
    {
      id: "nio",
      name: t("NiOₓ", "NiOₓ"),
      why: t("Oxit trong suốt, lấy điện tích hiệu quả và mức năng lượng phù hợp với perovskite theo bài tổng quan.", "A transparent oxide that, according to the review, extracts charge efficiently and has energy levels matched to the perovskite."),
      limits: t("Độ dẫn của NiOₓ cần được cải thiện bằng pha tạp; giao diện oxit/perovskite có tái hợp, mức năng lượng chưa tối ưu và ăn mòn hóa học.", "NiOₓ conductivity is improved by doping; the oxide/perovskite interface shows recombination, non-optimal levels and chemical corrosion."),
      iface: t("Một SAM có thể được đặt giữa oxit và perovskite để giảm các vấn đề này, nên NiOₓ và SAM có thể là bổ sung chứ không chỉ là lựa chọn thay thế.", "A SAM can be placed between the oxide and the perovskite to ease these problems, so NiOₓ and a SAM can be complementary and not only alternatives."),
      fab: t("Chưa đánh giá ở đây.", "Not assessed here."),
      cite: [106, 104],
      cells: {
        align: { c: "trade", note: t("Được mô tả là khớp năng lượng, nhưng giao diện oxit/perovskite có mức chưa tối ưu.", "Described as energy-matched, yet the oxide/perovskite interface shows non-optimal levels."), cite: [106, 104] },
        cond: { c: "trade", note: t("Pha tạp được dùng để tăng độ dẫn.", "Doping is used to raise conductivity."), cite: [106] },
        optical: { c: "adv", note: t("Độ truyền quang cao.", "High transmissivity."), cite: [106] },
        passiv: { c: "trade", note: t("Có tái hợp ở giao diện oxit/perovskite.", "Recombination occurs at the oxide/perovskite interface."), cite: [104] },
        chem: { c: "trade", note: t("Có ăn mòn hóa học giữa oxit và perovskite.", "Chemical corrosion occurs between oxide and perovskite."), cite: [104] },
      },
    },
    {
      id: "ptaa",
      name: t("PTAA (polyme)", "PTAA (polymer)"),
      why: t("Màng polyme đặc, đồng đều, kỵ nước nên có thể có lợi cho độ bền.", "A dense, uniform polymer film; its hydrophobicity can favour stability."),
      limits: t("Dẫn điện kém, bị hỏng do tia UV, năng lượng bề mặt cao nên khó thấm ướt bằng dung dịch perovskite.", "Poor conductivity, UV-induced degradation, and a high surface energy that makes the perovskite solution hard to spread."),
      iface: t("Khó thấm ướt là vấn đề giao diện chính.", "Poor wetting is the main interface issue."),
      fab: t("Xử lý dung dịch.", "Solution-processed."),
      cite: [106],
      cells: {
        cond: { c: "trade", note: t("Dẫn điện kém.", "Poor electrical conductivity."), cite: [106] },
        chem: { c: "trade", note: t("Thấm ướt kém bởi dung dịch perovskite.", "Poorly wetted by the perovskite solution."), cite: [106] },
        stab: { c: "trade", note: t("Kỵ nước có lợi; nhưng bị hỏng do UV.", "Hydrophobic is helpful; but UV degrades it."), cite: [106] },
      },
    },
  ],
  etl: [
    {
      id: "c60",
      name: t("C₆₀", "C₆₀"),
      why: t("Fullerene: mức năng lượng phù hợp, độ linh động điện tử tốt và tạo màng đơn giản (nói chung cho fullerene).", "A fullerene: applicable energy levels, good electron mobility and simple film forming (said of fullerenes in general)."),
      limits: t("Giao diện C₆₀/perovskite tái hợp mạnh; huỳnh quang màng giảm 1–2 bậc độ lớn.", "The C₆₀/perovskite interface recombines strongly; film photoluminescence drops by one to two orders of magnitude."),
      iface: t("Thường có thêm lớp đệm (BCP) giữa C₆₀ và kim loại.", "A buffer (BCP) is often added between C₆₀ and the metal."),
      fab: t("Chưa đánh giá ở đây.", "Not assessed here."),
      cite: [103, 106],
      cells: {
        align: { c: "adv", note: t("Fullerene có mức năng lượng phù hợp.", "Fullerenes have applicable energy levels."), cite: [106] },
        cond: { c: "adv", note: t("Độ linh động điện tử tốt.", "Good electron mobility."), cite: [106] },
        passiv: { c: "trade", note: t("Tái hợp mạnh ở giao diện C₆₀/perovskite.", "Strong recombination at the C₆₀/perovskite interface."), cite: [103] },
        manuf: { c: "adv", note: t("Tạo màng đơn giản (fullerene nói chung).", "Simple film forming (fullerenes in general)."), cite: [106] },
      },
    },
    {
      id: "pcbm",
      name: t("PCBM", "PCBM"),
      why: t("Dẫn xuất fullerene tan được, cũng được dùng rộng rãi làm ETL trong pin đảo.", "A soluble fullerene derivative, also widely used as an ETL in inverted cells."),
      limits: t("Bài tổng quan nêu dẫn điện kém và tái hợp điện tích đáng kể; cải thiện bằng chỉnh sửa giao diện hoặc pha tạp.", "The review notes poor conductivity and serious charge recombination; interface modification or doping is used to improve it."),
      iface: t("Thường kèm một lớp đệm ở giao diện với kim loại, ví dụ BCP.", "Often paired with a buffer at the metal interface, for example BCP."),
      fab: t("Chưa đánh giá ở đây.", "Not assessed here."),
      cite: [106],
      cells: {
        align: { c: "adv", note: t("Fullerene có mức năng lượng phù hợp.", "Fullerenes have applicable energy levels."), cite: [106] },
        cond: { c: "trade", note: t("Dẫn điện kém.", "Poor electrical conductivity."), cite: [106] },
        passiv: { c: "trade", note: t("Tái hợp điện tích đáng kể.", "Serious charge recombination."), cite: [106] },
        manuf: { c: "adv", note: t("Tạo màng đơn giản (fullerene nói chung).", "Simple film forming (fullerenes in general)."), cite: [106] },
      },
    },
  ],
  buf: [
    {
      id: "bcp",
      name: t("BCP", "BCP"),
      why: t("Màng BCP mỏng ở giao diện fullerene/kim loại được báo cáo là cải thiện tiếp xúc và ngăn tái hợp lỗ trống–điện tử ở giao diện.", "A thin BCP film at the fullerene/metal interface is reported to improve contact and prevent hole–electron recombination at the interface."),
      limits: t("Bài tổng quan không bàn nhược điểm riêng của BCP; cần xem bài gốc.", "The review does not discuss BCP-specific drawbacks; see the original papers."),
      iface: t("Nằm giữa ETL và kim loại.", "Sits between the ETL and the metal."),
      fab: t("Chưa đánh giá ở đây.", "Not assessed here."),
      cite: [106],
      cells: {
        select: { c: "adv", note: t("Giúp ngăn lỗ trống rò tới kim loại.", "Helps stop holes leaking to the metal."), cite: [106] },
        cond: { c: "adv", note: t("Cải thiện tiếp xúc.", "Improves contact."), cite: [106] },
      },
    },
    {
      id: "sno2",
      name: t("Lớp chắn oxit mỏng (SnO₂)", "Thin oxide barrier (SnO₂)"),
      why: t("Các lớp chắn (oxit indi, SnO₂, Cr) được thêm để cản di chuyển ion halide tới điện cực.", "Barrier layers (indium oxide, SnO₂, Cr) are added to hinder halide-ion migration toward the electrode."),
      limits: t("Hiệu quả phụ thuộc độ dày, độ đặc khít và quy trình; có thể làm hỏng bề mặt nếu quy trình không hợp.", "Effectiveness depends on thickness, density and process; a poorly matched process could damage the surface (to be validated)."),
      iface: t("Nằm giữa ETL và kim loại để cản halide.", "Sits between the ETL and the metal to hinder halides."),
      fab: t("Chưa đánh giá ở đây; bài tổng quan [106] không nêu vai trò của SnO₂ lắng đọng lớp nguyên tử.", "Not assessed here; review [106] does not describe the role of atomic-layer-deposited SnO₂."),
      cite: [103],
      cells: {
        stab: { c: "adv", note: t("Cản di chuyển halide, nguyên nhân gây hỏng khi chịu sáng và nhiệt.", "Hinders halide migration, a cause of failure under light and heat."), cite: [103] },
      },
    },
  ],
  metal: [
    {
      id: "metals",
      name: t("Bạc / vàng / nhôm", "Silver / gold / aluminium"),
      why: t("Cả ba đều xuất hiện làm điện cực sau trong các thiết bị đã công bố.", "All three appear as back electrodes in published devices."),
      limits: t("Bài tổng quan không bàn phản ứng ăn mòn kim loại–halide; cần kiểm chứng trên chồng lớp cụ thể.", "The review does not discuss metal–halide corrosion; it must be validated on the specific stack."),
      iface: t("Nên tránh để halide di chuyển tới kim loại; lớp đệm/chắn được dùng.", "Mobile halides should not reach the metal; buffer or barrier layers are used."),
      fab: t("Chưa đánh giá ở đây.", "Not assessed here."),
      cite: [106, 103],
      cells: {},
    },
  ],
  enc: [
    {
      id: "enc",
      name: t("Đóng gói", "Encapsulation"),
      why: t("Giảm tiếp xúc với hơi ẩm và oxy, và có thể giữ lại sản phẩm phân hủy dễ bay hơi.", "Reduces exposure to moisture and oxygen, and may keep volatile decomposition products in."),
      limits: t("Không tự động ngăn mọi hư hỏng: sáng và nhiệt vẫn gây di chuyển ion bên trong thiết bị.", "It does not automatically stop all degradation: light and heat still drive ion migration inside the device."),
      iface: t("Chi tiết đóng gói (vật liệu, độ dày, keo viền) phải được báo cáo cùng kết quả độ bền.", "Encapsulation details (materials, thickness, edge sealant) must be reported with stability results."),
      fab: t("Cần kiểm chứng theo vật liệu đóng gói cụ thể.", "To be validated for the specific encapsulant."),
      cite: [38, 103],
      cells: {
        stab: { c: "trade", note: t("Giảm tác động môi trường nhưng không loại bỏ hư hỏng do sáng và nhiệt.", "Reduces environmental effects but does not remove light- and heat-driven degradation."), cite: [103] },
      },
    },
  ],
};

export const STORIES5: StorySpec[] = [PIN, FUNC];
registerStories(STORIES5);

export const C5 = {
  layers: t("Các lớp", "Layers"),
  materials: t("Vật liệu ví dụ", "Example materials"),
  consider: t("Lưu ý thiết kế", "Design note"),
  role: t("Vai trò chính", "Primary role"),
  facts: t("Thông tin khoa học", "Scientific facts"),
  sources: t("Nguồn", "Sources"),
  pick: t("Bấm một lớp để xem chi tiết", "Click a layer for details"),
  details: t("Thông tin chi tiết", "Details"),
  hideDetails: t("Ẩn chi tiết", "Hide details"),
  table: t("Bảng so sánh p–i–n và n–i–p", "p–i–n vs n–i–p table"),
  hideTable: t("Ẩn bảng so sánh", "Hide table"),
  look: t("Khác biệt tốt / kém", "Good vs poor differences"),
  hideLook: t("Ẩn khác biệt", "Hide differences"),
};
