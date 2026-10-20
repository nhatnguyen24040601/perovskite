/**
 * Chapter 5 · Proposed improvement: choose a p–i–n stack, give every layer a job, justify the materials,
 * and prove stability with ISOS procedures.
 *
 *   5.1  Step 1 — choose a p–i–n stack          (scene sPin)
 *   5.2  Step 2 — one job per layer             (scene sFunc)
 *   5.3  Step 3 — why those ingredients         (scene sMat)
 *   5.4  Step 4 — prove it with ISOS            (scene sIsos)
 *   5.5  Putting it together                    (scene sFin)
 *
 * Same engine as Chapters 3 and 4: every text is a Vietnamese / English pair written once with `t()`.
 * Everything here is a conceptual teaching model unless a citation says otherwise.
 */
import { STORY_EN, registerStories, t, type FabControl, type StorySpec, type StoryStep } from "./story";

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

/** Layer of each step of 5.3 (the selected layer follows the step; the viewer can pick another). */
export const WHY_LAYER: (LayerId | "enc" | "all")[] = ["tco", "htl", "perov", "etl", "buf", "metal", "all"];

/** Requirements of the absorber (step 3). `kind` tells the viewer these are different properties. */
export const ABSORBER_REQS: { name: string; text: string }[] = [
  { name: t("Hấp thụ", "Absorption"), text: t("Hấp thụ mạnh ở vùng phổ cần dùng.", "Strong absorption in the intended spectral range.") },
  { name: t("Vùng cấm", "Bandgap"), text: t("Vùng cấm phù hợp với kiến trúc thiết bị (một lớp hay tandem).", "A bandgap suited to the device architecture (single junction or tandem).") },
  { name: t("Vận chuyển hạt tải", "Carrier transport"), text: t("Sinh và vận chuyển hạt tải hiệu quả.", "Effective generation and transport of carriers.") },
  { name: t("Tái hợp", "Recombination"), text: t("Tổn thất tái hợp có hại thấp.", "Low harmful recombination losses.") },
  { name: t("Độ bền", "Stability"), text: t("Bền hóa học và cấu trúc.", "Chemical and structural stability.") },
  { name: t("Tương thích", "Compatibility"), text: t("Hợp với các lớp kề và quy trình chế tạo.", "Compatible with neighbouring layers and the fabrication process.") },
];

const WHY: StorySpec = {
  id: "why",
  scene: "sMat",
  section: "5.3",
  group: "design",
  microSwitch: true,
  views: [t("Toàn thiết bị", "Device"), t("Lớp", "Layer"), t("Giao diện", "Interface")],
  title: t("Bước 3 — vì sao đúng những chất ấy", "Step 3 — Why those ingredients?"),
  sentence: t(
    "Chọn vật liệu bằng cách cân nhắc vai trò, mức năng lượng, tương thích và khả năng chịu quy trình, không chỉ hiệu suất ban đầu.",
    "Choose materials by weighing role, energy alignment, compatibility and process survival, not just initial efficiency.",
  ),
  final: t("5.3 là về lý do chọn: vì sao vật liệu này thuộc về đúng lớp này.", "5.3 is about justification: why this material belongs in this specific layer."),
  qa: {
    q: t("Vì sao không chọn vật liệu chỉ vì hiệu suất ban đầu cao?", "Why not pick a material only for high initial efficiency?"),
    a: t("Vì nó còn phải khớp vai trò, mức năng lượng, hợp với lớp kề và sống sót qua chế tạo và vận hành.", "Because it must also fit its role, align energetically, be compatible with neighbours and survive fabrication and operation."),
  },
  legend: [
    { swatch: "c5htl", label: t("HTL", "HTL") },
    { swatch: "c5perov", label: t("Perovskite", "Perovskite") },
    { swatch: "c5etl", label: t("ETL", "ETL") },
    { swatch: "c5defect", label: t("Giao diện có vấn đề", "Problem interface") },
    { swatch: "c5shell", label: t("Đóng gói", "Encapsulation") },
  ],
  simple: t(
    "Chọn vật liệu giống chọn người vào một đội: giỏi một việc chưa đủ, còn phải hợp với đồng đội và chịu được áp lực.",
    "Choosing materials is like picking a team: being good at one thing is not enough; they must fit with teammates and stand the pressure.",
  ),
  options: "none",
  brief: true,
  controls: [
    panelCtl("open"),
    seg("tcoc", t("Điện cực giả định", "Hypothetical electrode"), [["bal", t("Cân bằng", "Balanced")], ["clear", t("Trong suốt nhưng dẫn kém", "Clear but poorly conducting")]], "bal", [0]),
    seg("htlc", t("Ứng viên HTL", "HTL candidate"), [["sam", "SAM"], ["nio", "NiOₓ"]], "sam", [1]),
    seg("ifc", t("Giao diện", "Interface"), [["ok", t("Ổn", "Fine")], ["bad", t("Có vấn đề", "Problem")]], "ok", [1]),
    seg("buf", t("Lớp đệm", "Buffer"), [["no", t("Không có lớp đệm", "Without")], ["yes", t("Có lớp đệm", "With")]], "no", [4]),
    seg("energy", t("Sơ đồ mức năng lượng", "Energy-level diagram"), [["off", OFF], ["on", ON]], "off", [1, 2, 3, 4]),
  ],
  factList: [
    { k: t("Câu hỏi của bước này", "Question of this step"), v: t("Vì sao những vật liệu này phù hợp với vai trò của chúng?", "Why are these materials suitable for their roles?") },
    { k: t("Tiêu chí", "Criteria"), v: t("Mười tiêu chí: khớp năng lượng, chọn lọc, dẫn điện, truyền quang, thụ động hóa, tương thích hóa học, quy trình, độ bền, sản xuất, chi phí–an toàn.", "Ten criteria: alignment, selectivity, conductivity, transmission, passivation, chemical compatibility, process, stability, manufacturability, cost–safety.") },
    { k: t("Không có điểm số", "No scores"), v: t("Bảng dùng nhãn định tính (ưu điểm, đánh đổi, cần kiểm chứng) kèm nguồn; không gán điểm số tùy ý.", "The table uses qualitative labels (advantage, trade-off, needs validation) with sources; no arbitrary numeric scores.") },
    { k: t("Mức năng lượng", "Energy levels"), v: t("Sơ đồ chỉ là khái niệm, không có giá trị số.", "The diagram is conceptual and has no numerical values.") },
  ],
  factRefs: [101, 102, 103, 104, 105, 106],
  steps: [
    step(
      t("Chọn điện cực trong suốt", "Choose the transparent electrode"),
      t(
        "Điện cực trong suốt phải truyền ánh sáng tới và đồng thời dẫn điện. So sánh hai điện cực giả định: một cái rất trong suốt nhưng dẫn kém, một cái cân bằng giữa truyền quang và dẫn điện. Các tính chất này chỉ để minh họa, không phải số đo.",
        "The transparent electrode must let light through and carry current at once. Compare two hypothetical electrodes: one very transparent but poorly conducting, one balancing transmission and conductivity. These properties are illustrative, not measurements.",
      ),
      t("Một điện cực chỉ giỏi một việc vẫn làm hỏng cả pin.", "An electrode that is good at only one job still ruins the cell."),
      "1",
      10,
      [105],
      { info: t("Tính chất của hai điện cực này là giả định để minh họa.", "The properties of these two electrodes are hypothetical, for illustration.") },
    ),
    step(
      t("Chọn tiếp xúc chọn lọc lỗ trống", "Choose the hole-selective contact"),
      t(
        "Phóng to giao diện ITO – tiếp xúc chọn lọc lỗ trống – perovskite. Hai ví dụ: đơn lớp tự sắp xếp (như MeO-2PACz, 2PACz) và lớp oxit NiOₓ. Chúng là lựa chọn dùng trong các kiến trúc và quy trình khác nhau, không tự động chồng cả hai vào mọi thiết bị. Tiêu chí: lấy lỗ trống, khớp mức năng lượng, chất lượng giao diện, tương thích hóa học, nhiệt độ và dung môi, điện trở tiếp xúc, độ bền.",
        "Zoom into the ITO – hole-selective contact – perovskite interface. Two examples: a self-assembled monolayer (such as MeO-2PACz or 2PACz) and an oxide layer, NiOₓ. They are alternatives used in different architectures and processes; they should not automatically be stacked together in every device. Criteria: hole extraction, energy alignment, interface quality, chemical compatibility, temperature and solvent compatibility, contact resistance, stability.",
      ),
      t("Hai cách đều có ưu điểm và nhược điểm; câu hỏi là cách nào hợp với phần còn lại của chồng lớp.", "Both have strengths and weaknesses; the question is which fits the rest of the stack."),
      "3",
      14,
      [102, 104, 105, 106],
    ),
    step(
      t("Chọn lớp hấp thụ perovskite", "Choose the perovskite absorber"),
      t(
        "Lớp hấp thụ phải thỏa nhiều yêu cầu khác nhau: hấp thụ mạnh, vùng cấm phù hợp, vận chuyển hạt tải, ít tái hợp, bền, và hợp với lớp kề và quy trình. Vùng cấm, độ hấp thụ, độ linh động hạt tải và độ bền là bốn tính chất khác nhau, không phải một. Phổ hấp thụ và sơ đồ vùng chỉ là khái niệm.",
        "The absorber must meet several different requirements: strong absorption, a suitable bandgap, carrier transport, low recombination, stability, and compatibility with neighbours and process. Bandgap, absorption, carrier mobility and stability are four different properties, not one. The spectrum and band diagram are conceptual.",
      ),
      t("Một lớp hấp thụ tuyệt vời về ánh sáng vẫn có thể thất bại nếu giao diện hoặc độ bền kém.", "An absorber that is excellent at catching light can still fail if its interfaces or stability are poor."),
      "1",
      13,
      [101, 103],
    ),
    step(
      t("Chọn tiếp xúc chọn lọc điện tử", "Choose the electron-selective contact"),
      t(
        "Ví dụ: C₆₀ hoặc PCBM, tùy kiến trúc. Lớp này cần hỗ trợ lấy điện tử hiệu quả và giảm truyền lỗ trống không mong muốn. Các đánh đổi: vận chuyển điện tích, điện trở tiếp xúc, mật độ khuyết tật, hóa học giao diện, độ phủ màng, quy trình. Không có vật liệu nào tối ưu cho mọi thành phần perovskite và mọi chồng lớp.",
        "Examples: C₆₀ or PCBM, depending on the architecture. This layer must support effective electron extraction and reduce unwanted hole transfer. Trade-offs: charge transport, contact resistance, defect density, interface chemistry, film coverage, process. No single material is optimal for every perovskite composition and device stack.",
      ),
      t("Hai fullerene gần giống nhau vẫn có ưu và nhược điểm khác nhau.", "Two similar fullerenes still have different strengths and weaknesses."),
      "3",
      12,
      [103, 106],
    ),
    step(
      t("Xét lớp đệm / lớp giao diện", "Consider the buffer or interfacial layer"),
      t(
        "Một lớp giao diện mỏng, tùy chọn, có thể chỉnh hóa học bề mặt, khớp mức năng lượng, thụ động hóa khuyết tật hoặc bảo vệ lớp kề. Chuyển công tắc “Lớp đệm” để xem giao diện không có và có lớp phù hợp. Kết quả thật phụ thuộc hóa học, độ dày và quy trình, và một lớp phủ hợp với chồng này có thể gây hại ở chồng khác.",
        "An optional, thin interfacial layer can modify surface chemistry, align energy levels, passivate defects or protect a neighbouring material. Switch the “Buffer” control to see the interface without and with a suitable layer. The real result depends on chemistry, thickness and process, and a layer that suits one stack can hurt in another.",
      ),
      t("Ví dụ: lớp 2D thụ động hóa rất có lợi ở pin n–i–p nhưng có thể làm hại pin p–i–n [103].", "Example: a 2D passivation layer helps n–i–p cells a lot but can harm p–i–n cells [103]."),
      "buf",
      13,
      [103, 106],
      { info: t("Mô hình chỉ minh họa ý tưởng: không có lớp → nhiều chỗ tái hợp hơn; có lớp phù hợp → giảm tổn thất giao diện.", "The model only illustrates the idea: no layer → more recombination sites; a suitable layer → reduced interface losses.") },
    ),
    step(
      t("Chọn điện cực và chiến lược bảo vệ", "Choose the electrode and the protection strategy"),
      t(
        "Làm nổi bật điện cực kim loại và lớp đóng gói. Thiết bị cần không chỉ tiếp xúc điện mà còn một chiến lược bảo vệ chung để giới hạn hơi ẩm, oxy và các tác nhân môi trường khác. Điện cực và đóng gói không tự động ngăn mọi hư hỏng: ánh sáng và nhiệt vẫn có thể gây di chuyển ion bên trong.",
        "The metal electrode and the encapsulation are highlighted. The device needs not only electrical contacts but a coherent protection strategy that limits moisture, oxygen and other environmental stresses. Neither the electrode nor the encapsulation automatically prevents all degradation: light and heat can still drive ion migration inside.",
      ),
      t("Bảo vệ là một phần của thiết kế chồng lớp, không phải thứ thêm vào sau cùng.", "Protection is part of the stack design, not an afterthought."),
      "1",
      12,
      [38, 103],
    ),
    step(
      t("So sánh các ứng viên", "Compare the candidates"),
      t(
        "Chọn một lớp trong cột bên để xem bảng so sánh mười tiêu chí. Ô được gắn nhãn ưu điểm, đánh đổi hoặc cần kiểm chứng, mỗi ô kèm nguồn; không có điểm số tùy ý. Nhiều ô là “cần kiểm chứng” vì bộ nguồn của chương này chưa đủ bằng chứng — và đó là thông tin trung thực.",
        "Pick a layer in the side column to see the ten-criterion comparison table. Cells are labelled advantage, trade-off or needs validation, each with its source; there are no arbitrary scores. Many cells say “needs validation” because this chapter's source set lacks the evidence — and that is honest information.",
      ),
      t("Chọn vật liệu là cân bằng nhiều yêu cầu; cải thiện một tính chất có thể tạo vấn đề ở nơi khác.", "Choosing materials is balancing many requirements; improving one property can create a problem elsewhere."),
      "1",
      12,
      [101, 102, 103, 104, 105, 106],
      { final: true },
    ),
  ],
};

/** Conceptual energy-level scenarios (no numbers). */
export const ENERGY: { id: string; name: string; text: string }[] = [
  {
    id: "good",
    name: t("Khớp thuận lợi", "Favourable alignment"),
    text: t(
      "Mức năng lượng của hai tiếp xúc nằm đúng phía so với perovskite: điện tử có đường xuống dốc về ETL, lỗ trống có đường về HTL.",
      "The contacts' energy levels sit on the right side of the perovskite's: electrons have a downhill path to the ETL, holes a path to the HTL.",
    ),
  },
  {
    id: "barrier",
    name: t("Bền nhưng lệch mức", "Stable but misaligned"),
    text: t(
      "Một vật liệu có thể bền hóa học mà vẫn lệch mức năng lượng: lỗ trống gặp một rào khi vào HTL. Bền không đồng nghĩa với phù hợp về điện.",
      "A material can be chemically stable and still be misaligned: holes meet a barrier entering the HTL. Stable does not mean electrically suitable.",
    ),
  },
  {
    id: "hard",
    name: t("Khớp nhưng khó chế tạo", "Aligned but hard to make"),
    text: t(
      "Mức năng lượng đẹp nhưng vật liệu khó phủ đều, không hợp dung môi hoặc kém bền: hấp dẫn về điện nhưng khó đưa vào sản xuất.",
      "The levels look attractive but the material is hard to coat uniformly, clashes with the solvent or is unstable: electronically attractive, difficult to put into production.",
    ),
  },
];

/* ───────────────────────── 5.4 ───────────────────────── */

export type IsoFam = "D" | "V" | "L" | "O" | "T" | "LC" | "LT";
export type IsoRow = { id: string; light: string; temp: string; rh: string; env: string; load: string };

const AMB = t("Môi trường (23 ± 4 °C)", "Ambient (23 ± 4 °C)");
const AMBRH = t("Môi trường xung quanh", "Ambient");
const NONE = t("Không dùng", "None");
const SIM = t("Mô phỏng mặt trời", "Solar simulator");
const OC = "OC";
const MPPOC = t("MPP hoặc OC", "MPP or OC");

export const ISO_FAMILIES: { fam: IsoFam; name: string; what: string; rows: IsoRow[] }[] = [
  {
    fam: "D",
    name: t("Lưu trữ trong tối (ISOS-D)", "Dark storage (ISOS-D)"),
    what: t("Thiết bị được cất trong tối để khảo sát độ bền khi lưu trữ ở khí quyển và nhiệt độ đã nêu.", "The device is stored in the dark to investigate storage stability under the stated atmosphere and temperature."),
    rows: [
      { id: "D-1", light: NONE, temp: AMB, rh: AMBRH, env: t("Không khí môi trường", "Ambient air"), load: OC },
      { id: "D-2", light: NONE, temp: "65, 85 °C", rh: AMBRH, env: t("Lò, không khí môi trường", "Oven, ambient air"), load: OC },
      { id: "D-3", light: NONE, temp: "65, 85 °C", rh: "85%", env: t("Buồng môi trường", "Environmental chamber"), load: OC },
    ],
  },
  {
    fam: "V",
    name: t("Phân cực điện trong tối (ISOS-V)", "Electrical bias in the dark (ISOS-V)"),
    what: t("Thiết bị chịu một điện áp phân cực trong tối, vì phân cực điện có thể kích hoạt di chuyển ion.", "The device is held at an electrical bias in the dark, because bias can trigger ion migration."),
    rows: [
      { id: "V-1", light: NONE, temp: AMB, rh: AMBRH, env: t("Không khí môi trường", "Ambient air"), load: t("Phân cực điện (xem Bảng 1)", "Electrical bias (see Table 1)") },
      { id: "V-2", light: NONE, temp: "65, 85 °C", rh: AMBRH, env: t("Lò, không khí môi trường", "Oven, ambient air"), load: t("Phân cực điện (xem Bảng 1)", "Electrical bias (see Table 1)") },
      { id: "V-3", light: NONE, temp: "65, 85 °C", rh: "85%", env: t("Buồng môi trường", "Environmental chamber"), load: t("Phân cực điện (xem Bảng 1)", "Electrical bias (see Table 1)") },
    ],
  },
  {
    fam: "L",
    name: t("Chiếu sáng liên tục (ISOS-L)", "Light soaking (ISOS-L)"),
    what: t("Thiết bị được chiếu sáng trong điều kiện được báo cáo rõ. Ánh sáng có thể ảnh hưởng hóa học vật liệu, sự phân bố lại ion và hiệu suất.", "The device is illuminated under explicitly reported conditions. Light can affect material chemistry, ion redistribution and device performance."),
    rows: [
      { id: "L-1", light: SIM, temp: AMB, rh: AMBRH, env: t("Chỉ ánh sáng", "Light only"), load: MPPOC },
      { id: "L-2", light: SIM, temp: "65, 85 °C", rh: AMBRH, env: t("Ánh sáng và nhiệt độ", "Light & temperature"), load: MPPOC },
      { id: "L-3", light: SIM, temp: "65, 85 °C", rh: "~50%", env: t("Ánh sáng, nhiệt độ và độ ẩm", "Light, temperature & RH"), load: "MPP" },
    ],
  },
  {
    fam: "O",
    name: t("Ngoài trời (ISOS-O)", "Outdoor exposure (ISOS-O)"),
    what: t("Thiết bị được thử ngoài trời trong khi các yếu tố môi trường và điện được theo dõi hoặc báo cáo.", "The device is tested outdoors while the relevant environmental and electrical conditions are monitored or reported."),
    rows: [
      { id: "O-1", light: t("Ánh nắng", "Sunlight"), temp: AMBRH, rh: AMBRH, env: t("Ngoài trời", "Outdoor"), load: MPPOC },
      { id: "O-2", light: t("Ánh nắng", "Sunlight"), temp: AMBRH, rh: AMBRH, env: t("Ngoài trời", "Outdoor"), load: MPPOC },
      { id: "O-3", light: t("Ánh nắng", "Sunlight"), temp: AMBRH, rh: AMBRH, env: t("Ngoài trời", "Outdoor"), load: "MPP" },
    ],
  },
  {
    fam: "T",
    name: t("Chu kỳ nhiệt trong tối (ISOS-T)", "Thermal cycling in the dark (ISOS-T)"),
    what: t("Nhiệt độ thay đổi theo chu kỳ để khảo sát tác hại của các lần đổi nhiệt lặp lại.", "The temperature is cycled to investigate the effect of repeated thermal changes."),
    rows: [
      { id: "T-1", light: NONE, temp: t("Nhiệt độ phòng đến 65, 85 °C", "Room temp. to 65, 85 °C"), rh: AMBRH, env: t("Bàn nhiệt / lò", "Hot plate / oven"), load: OC },
      { id: "T-2", light: NONE, temp: t("Nhiệt độ phòng đến 65, 85 °C", "Room temp. to 65, 85 °C"), rh: AMBRH, env: t("Lò / buồng môi trường", "Oven / environmental chamber"), load: OC },
      { id: "T-3", light: NONE, temp: "−40 → +85 °C", rh: t("< 55% (kiểm soát khi > 40 °C)", "< 55% (controlled above 40 °C)"), env: t("Buồng môi trường", "Environmental chamber"), load: OC },
    ],
  },
  {
    fam: "LC",
    name: t("Chu kỳ sáng–tối (ISOS-LC)", "Light–dark cycling (ISOS-LC)"),
    what: t("Bật tắt ánh sáng mô phỏng chu kỳ 2, 8 hoặc 24 giờ để thấy phần hư hỏng có thể phục hồi trong tối (chu kỳ ngày–đêm).", "Simulated sunlight is switched on and off with cycle periods of 2, 8 or 24 h to reveal damage that recovers in the dark (day–night cycles)."),
    rows: [
      { id: "LC-1", light: t("Mô phỏng mặt trời / tối; chu kỳ 2, 8, 24 giờ; sáng:tối 1:1 hoặc 1:2", "Solar simulator / dark; cycle 2, 8 or 24 h; light:dark 1:1 or 1:2"), temp: AMB, rh: AMBRH, env: t("Chỉ ánh sáng", "Light only"), load: MPPOC },
      { id: "LC-2", light: t("Như LC-1", "As LC-1"), temp: "65, 85 °C", rh: AMBRH, env: t("Ánh sáng và nhiệt độ", "Light & temperature"), load: MPPOC },
      { id: "LC-3", light: t("Như LC-1", "As LC-1"), temp: "65, 85 °C", rh: "< 50%", env: t("Ánh sáng, nhiệt độ và độ ẩm", "Light, temperature & RH"), load: "MPP" },
    ],
  },
  {
    fam: "LT",
    name: t("Chu kỳ sáng–ẩm–nhiệt (ISOS-LT)", "Light–humidity–thermal cycling (ISOS-LT)"),
    what: t("Thiết bị chịu ánh sáng cùng độ ẩm và nhiệt độ thay đổi, mô phỏng biến thiên ngày–mùa của thời tiết.", "The device sees light together with changing humidity and temperature, resembling diurnal and seasonal weather variation."),
    rows: [
      { id: "LT-1", light: SIM, temp: t("Tăng giảm tuyến tính hoặc bậc: phòng → 65 °C", "Linear or step ramp: room → 65 °C"), rh: t("Chỉ theo dõi, không kiểm soát", "Monitored, uncontrolled"), env: t("Buồng thời tiết", "Weathering chamber"), load: MPPOC },
      { id: "LT-2", light: SIM, temp: t("Tăng giảm tuyến tính 5 → 65 °C", "Linear ramp 5 → 65 °C"), rh: t("Theo dõi; kiểm soát 50% khi > 40 °C", "Monitored; controlled at 50% above 40 °C"), env: t("Buồng môi trường có đèn mô phỏng", "Environmental chamber with sun simulator"), load: MPPOC },
      { id: "LT-3", light: SIM, temp: t("Tăng giảm tuyến tính −25 → 65 °C", "Linear ramp −25 → 65 °C"), rh: t("Theo dõi; kiểm soát 50% khi > 40 °C", "Monitored; controlled at 50% above 40 °C"), env: t("Buồng có đèn mô phỏng và làm lạnh", "Chamber with sun simulator and freezing"), load: MPPOC },
    ],
  },
];

export const ISO_HEAD = {
  id: t("Mã", "Code"),
  light: t("Nguồn sáng", "Light source"),
  temp: t("Nhiệt độ", "Temperature"),
  rh: t("Độ ẩm tương đối", "Relative humidity"),
  env: t("Môi trường / bố trí", "Environment / set-up"),
  load: t("Tải điện", "Electrical load"),
};

/** The checklist of the reporting framework (the consensus statement's Table 3, grouped). */
export const CHECKLIST: { id: string; name: string; why: string }[] = [
  { id: "arch", name: t("Kiến trúc thiết bị", "Device architecture"), why: t("Để biết chồng lớp nào được thử.", "So the reader knows which stack was tested.") },
  { id: "area", name: t("Diện tích hoạt động và loại mẫu", "Active area and sample type"), why: t("Ô, mini-module hay module cho kết quả khác nhau.", "Cells, mini-modules and modules behave differently.") },
  { id: "init", name: t("Hiệu suất ban đầu và cách đo", "Initial performance and measurement method"), why: t("Cần để biết giá trị 100% là gì.", "Needed to know what 100% refers to.") },
  { id: "light", name: t("Nguồn sáng, phổ, cường độ", "Light source, spectrum, intensity"), why: t("“AM1.5G” mà không nêu nguồn sáng là chưa đủ.", "“AM1.5G” without naming the source is not enough.") },
  { id: "temp", name: t("Nhiệt độ", "Temperature"), why: t("Cả trong bóng tối và khi chiếu sáng.", "In the dark and under illumination.") },
  { id: "rh", name: t("Độ ẩm tương đối", "Relative humidity"), why: t("Kể cả khi không được kiểm soát vẫn phải ghi lại.", "Even if uncontrolled it should still be monitored and reported.") },
  { id: "atm", name: t("Khí quyển", "Atmosphere"), why: t("Không khí, hộp găng, túi kín, buồng môi trường…", "Air, glovebox, sealed pouch, environmental chamber…") },
  { id: "bias", name: t("Điện áp đặt hoặc điều kiện làm việc", "Applied bias or operating condition"), why: t("Hở mạch, điểm công suất cực đại, ngắn mạch…", "Open circuit, maximum power point, short circuit…") },
  { id: "enc", name: t("Chi tiết đóng gói", "Encapsulation details"), why: t("Vật liệu, độ dày, keo viền; có hay không đóng gói.", "Materials, thickness, edge sealant; encapsulated or not.") },
  { id: "dur", name: t("Thời gian thử", "Test duration"), why: t("Thời gian chịu ứng suất và tổn thất tương ứng.", "Stress duration and the matching performance loss.") },
  { id: "freq", name: t("Tần suất ghi dữ liệu", "Data-collection frequency"), why: t("Tần suất đo J–V hoặc theo dõi MPP.", "How often J–V curves or MPP tracking were recorded.") },
  { id: "n", name: t("Số mẫu và độ biến thiên", "Sample count and variability"), why: t("Một mẫu duy nhất không thể nói về độ lặp lại.", "A single sample says nothing about reproducibility.") },
  { id: "norm", name: t("Chỉ số chuẩn hóa", "Normalised performance metric"), why: t("Phải nêu giá trị dùng để chuẩn hóa.", "State the value the curve is normalised to.") },
  { id: "stop", name: t("Tiêu chí hỏng hoặc dừng thử", "Failure or stopping criterion"), why: t("Nếu có dùng.", "If one was used.") },
  { id: "src", name: t("Trích dẫn nguồn", "Source citation"), why: t("Để người đọc kiểm tra được.", "So the reader can check it.") },
];

export const ISO_TEXT = {
  isosName: t("ISOS: International Summit on Organic PV Stability", "ISOS: International Summit on Organic Photovoltaic Stability"),
  isosWhat: t(
    "Một họ quy trình thử và báo cáo độ bền, ban đầu cho pin hữu cơ rồi được điều chỉnh cho perovskite [38].",
    "A family of stability-testing and reporting procedures, first made for organic cells and then adapted for perovskites [38].",
  ),
  notCert: t(
    "ISOS là quy trình nghiên cứu và báo cáo, không phải chứng nhận đạt/trượt về tuổi thọ, và không thay thế các tiêu chuẩn chứng nhận sản phẩm.",
    "ISOS protocols are research testing and reporting procedures. They are not a universal pass/fail certification of lifetime, and they do not replace product-qualification standards.",
  ),
  illustrative: t("DỮ LIỆU MINH HỌA — KHÔNG PHẢI KẾT QUẢ THỰC NGHIỆM.", "ILLUSTRATIVE DATA — NOT EXPERIMENTAL RESULTS."),
  qualL: t("Thử nghiệm nghiên cứu dựa trên ISOS", "ISOS-based research testing"),
  qualR: t("Tiêu chuẩn chứng nhận sản phẩm PV", "PV product-qualification standards"),
  qualLItems: [
    t("Giúp nhà nghiên cứu khảo sát cơ chế suy giảm.", "Helps researchers investigate degradation mechanisms."),
    t("Giúp chuẩn hóa cách báo cáo thí nghiệm.", "Helps standardise how experiments are reported."),
    t("Làm cho việc so sánh giữa các nghiên cứu có ý nghĩa hơn khi điều kiện trùng nhau.", "Makes comparison between studies more meaningful when the conditions align."),
    t("Không cho một chứng chỉ tuổi thọ đạt/trượt: “một pin không thể đạt hay trượt phép thử ISOS”.", "Gives no universal pass/fail lifetime certificate: “a solar cell cannot pass or fail ISOS stability tests”."),
  ],
  qualRItems: [
    t("Đưa ra yêu cầu chứng nhận và độ tin cậy phù hợp với sản phẩm và tiêu chuẩn liên quan (ví dụ IEC 61215 cho tấm silicon).", "Set qualification and reliability requirements appropriate to the product and standard concerned (for example IEC 61215 for silicon panels)."),
    t("Không thể thay thế cho nhau với một thí nghiệm lão hóa ISOS đơn lẻ trong phòng thí nghiệm.", "Are not interchangeable with a single laboratory ISOS ageing experiment."),
    t("Không bao giờ nói vượt qua một phép thử ISOS chung chung đảm bảo 25 năm hoạt động.", "Never say that passing a generic ISOS test guarantees 25 years of operation."),
  ],
};

const VERIFY: StorySpec = {
  id: "verify",
  scene: "sIsos",
  section: "5.4",
  group: "design",
  microSwitch: true,
  views: [t("Phòng thử", "Test lab"), t("Mẫu", "Sample"), t("Số liệu", "Data")],
  title: t("Bước 4 — chứng minh bằng chuẩn ISOS", "Step 4 — Prove it with ISOS"),
  sentence: t(
    "Hiệu suất ban đầu cao chưa chứng minh pin bền; độ bền phải được đo trong điều kiện xác định và báo cáo đủ chi tiết.",
    "A high initial efficiency does not prove durability; stability must be measured under defined conditions and reported in detail.",
  ),
  final: t(
    "Cải tiến đáng tin cần cả hiệu suất ban đầu tốt và bằng chứng tái lập rằng pin giữ được hiệu suất trong điều kiện được báo cáo rõ.",
    "Reliable improvement requires both good initial performance and reproducible evidence that the device retains its performance under clearly reported conditions.",
  ),
  qa: {
    q: t("ISOS có phải chứng nhận tuổi thọ không?", "Is ISOS a lifetime certification?"),
    a: t("Không: đó là quy trình nghiên cứu và báo cáo, không có đạt/trượt.", "No: it is a research and reporting procedure, with no pass/fail."),
  },
  legend: [
    { swatch: "sun", label: t("Ánh sáng", "Light") },
    { swatch: "c5heat", label: t("Nhiệt", "Heat") },
    { swatch: "c5humid", label: t("Độ ẩm", "Humidity") },
    { swatch: "c5shell", label: t("Đóng gói", "Encapsulation") },
  ],
  simple: t(
    "Giống như đưa một chiếc áo qua nhiều kiểu thử: giặt, phơi nắng, mưa. Mỗi phép thử cho biết một điểm yếu khác nhau.",
    "Like putting a coat through different tests: washing, sun, rain. Each test shows a different weakness.",
  ),
  options: "none",
  brief: true,
  controls: [
    panelCtl("open"),
    seg(
      "iso",
      t("Nhóm thử", "Test group"),
      [["D", "D"], ["V", "V"], ["L", "L"], ["O", "O"], ["T", "T"], ["LC", "LC"], ["LT", "LT"]],
      "L",
      [1, 2, 3],
    ),
    seg("lvl", t("Mức", "Level"), [["1", "1"], ["2", "2"], ["3", "3"]], "2", [1, 2, 3]),
  ],
  factList: [
    { k: t("Câu hỏi của bước này", "Question of this step"), v: t("Làm sao đánh giá pin còn giữ được hiệu suất theo thời gian?", "How do researchers evaluate whether the device remains stable over time?") },
    { k: "ISOS", v: ISO_TEXT.isosWhat },
    { k: t("Điều ISOS không phải", "What ISOS is not"), v: ISO_TEXT.notCert },
    { k: t("Số liệu trên biểu đồ", "Chart data"), v: t("Các đường cong là minh họa, không phải kết quả thí nghiệm của bài báo nào.", "The curves are illustrative; they are not the experimental result of any paper.") },
    { k: t("Điều kiện thử", "Test conditions"), v: t("Chép từ Bảng 1 của tuyên bố đồng thuận [38]; không tự bịa mã giao thức, thời lượng hay điều kiện.", "Copied from Table 1 of the consensus statement [38]; no protocol code, duration or condition is invented.") },
  ],
  factRefs: [38, 103],
  steps: [
    step(
      t("Đo hiệu suất ban đầu", "Measure the initial performance"),
      t(
        "Mẫu chưa lão hóa được đo trước. Cần ghi lại: hiệu suất chuyển đổi ban đầu (PCE), công suất cực đại, nhiệt độ thử, cường độ và phổ ánh sáng, độ ẩm, tình trạng đóng gói, diện tích và loại thiết bị. Hiệu suất ban đầu không phải độ bền lâu dài.",
        "The un-aged sample is measured first. Record: initial power conversion efficiency (PCE), maximum power output, test temperature, light intensity and spectrum, humidity, encapsulation status, device area and device type. Initial efficiency is not long-term stability.",
      ),
      t("Không có giá trị ban đầu rõ ràng thì không biết “100%” là gì.", "Without a clear initial value, nobody knows what “100%” means."),
      "1",
      9,
      [38],
      { info: t("Bảng bên liệt kê điều phải ghi; các giá trị điền sẵn lấy từ giao thức đã chọn ở bước sau.", "The side table lists what must be recorded; the pre-filled values come from the protocol chosen in the next step.") },
    ),
    step(
      t("Chọn một điều kiện thử", "Choose a test condition"),
      t(
        "Chọn nhóm thử: lưu trữ trong tối (D), phân cực trong tối (V), chiếu sáng (L), ngoài trời (O), chu kỳ nhiệt (T), chu kỳ sáng–tối (LC) hoặc chu kỳ sáng–ẩm–nhiệt (LT). Không phòng thí nghiệm nào dùng tất cả; mỗi nhóm có ba mức phức tạp tăng dần.",
        "Choose a test group: dark storage (D), bias in the dark (V), light soaking (L), outdoor (O), thermal cycling (T), light–dark cycling (LC) or light–humidity–thermal cycling (LT). No laboratory uses all of them; each group has three levels of increasing sophistication.",
      ),
      t("Mỗi nhóm thử một điểm yếu khác nhau.", "Each group probes a different weakness."),
      "2",
      12,
      [38],
    ),
    step(
      t("Cấu hình điều kiện ứng suất", "Configure the stress conditions"),
      t(
        "Buồng thử hiện các biến của nhóm đã chọn: ánh sáng, nhiệt độ, độ ẩm, khí quyển, tải điện. Chỉ hiện các điều khiển phù hợp: không có thanh trượt trộn các quy trình không tương thích. Một kịch bản tự chế không tự động là phép thử ISOS tiêu chuẩn.",
        "The chamber shows the variables of the chosen group: light, temperature, humidity, atmosphere, electrical load. Only appropriate controls appear: there is no slider that mixes incompatible protocols. A custom scenario is not automatically a standard ISOS test.",
      ),
      t("Điều kiện phải được nói ra, nếu không kết quả không so sánh được.", "The conditions must be stated, otherwise results cannot be compared."),
      "1",
      13,
      [38],
    ),
    step(
      t("Bắt đầu lão hóa", "Begin ageing"),
      t(
        "Mẫu vào buồng và chịu ứng suất đã chọn; thiết bị đo ghi lại đáp ứng. Biểu đồ trong cột bên là minh họa: DỮ LIỆU MINH HỌA — KHÔNG PHẢI KẾT QUẢ THỰC NGHIỆM.",
        "The sample enters the chamber and sees the chosen stress; the instrument records the response. The chart in the side column is illustrative: ILLUSTRATIVE DATA — NOT EXPERIMENTAL RESULTS.",
      ),
      t("Đường cong chỉ cho thấy các kiểu hành vi có thể xảy ra, không phải số đo của bài nào.", "The curve only shows kinds of behaviour that can occur, not a measurement from any paper."),
      "2",
      14,
      [38],
      { info: ISO_TEXT.illustrative },
    ),
    step(
      t("Theo dõi hiệu suất theo thời gian", "Track performance over time"),
      t(
        "Trục ngang là thời gian thử; trục dọc là PCE chuẩn hóa (1,0 là 100% giá trị tham chiếu đã chọn). Không phải pin nào cũng suy giảm đơn điệu: vài thay đổi có thể tạm thời hoặc đảo ngược, và phụ thuộc cách đo và lịch sử thiết bị. Ví dụ ISOS-LC cho thấy phục hồi trong tối.",
        "The horizontal axis is test time; the vertical axis is normalised PCE (1.0 is 100% of the chosen reference value). Not every cell declines monotonically: some changes are temporary or reversible and depend on the measurement protocol and the device history. ISOS-LC, for example, reveals recovery in the dark.",
      ),
      t("Một đường cong chỉ có nghĩa khi biết nó được chuẩn hóa theo giá trị nào.", "A curve only means something once you know the value it is normalised to."),
      "3",
      13,
      [38],
      { info: ISO_TEXT.illustrative },
    ),
    step(
      t("Giải thích các chỉ số độ bền", "Explain the stability metrics"),
      t(
        "T80 là thời gian cho đến khi chỉ số đã chọn (ví dụ PCE) giảm còn 80% giá trị tham chiếu đã xác định, tính từ lúc bắt đầu (t = 0). TS80 tính từ một điểm khác (cực đại hoặc cuối giai đoạn “burn-in”). T95 tương tự cho 95%. Nếu chưa tới T80 trong thời gian thử, báo cáo mức giảm sau 1000 giờ. Không suy ra tuổi thọ vận hành từ một phép thử ngắn nếu không có mô hình được chứng minh.",
        "T80 is the time until the chosen metric (for example PCE) falls to 80% of its explicitly defined reference value, counted from the start (t = 0). TS80 counts from another point (the maximum, or the end of the “burn-in”). T95 is the same for 95%. If T80 is not reached within the test, report the decrease after 1000 h. Do not infer an operating lifetime from a short test without a justified model.",
      ),
      t("“T80 = 1000 giờ” chỉ có nghĩa kèm đủ điều kiện, chỉ số nào và mốc tham chiếu nào.", "“T80 = 1000 h” only means something together with the conditions, the metric and the reference."),
      "3",
      14,
      [38],
    ),
    step(
      t("So sánh hai điều kiện thử", "Compare two test conditions"),
      t(
        "Hai mẫu cạnh nhau: A chiếu sáng cùng nhiệt (ISOS-L-2), B nhiệt ẩm trong tối (ISOS-D-3). Hai đường cong đều minh họa và không so sánh được trực tiếp. Điều học được: các phép thử khác nhau bộc lộ những điểm yếu khác nhau. Một kết quả ở một điều kiện không chứng minh độ bền ở mọi điều kiện thực tế.",
        "Two samples side by side: A under light and heat (ISOS-L-2), B under damp heat in the dark (ISOS-D-3). Both curves are illustrative and not directly comparable. The lesson: different tests reveal different weaknesses. A result under one stress condition does not establish stability under every real-world condition.",
      ),
      t("Một bài kiểm tra tốt không thay cho tất cả các bài kiểm tra khác.", "One good test does not replace all the other tests."),
      "cmp",
      15,
      [38],
      { info: ISO_TEXT.illustrative },
    ),
    step(
      t("Trở lại pin hoàn chỉnh", "Back to the complete solar cell"),
      t(
        "Rời buồng thử, ta thấy lại toàn bộ pin. Đã đo: hiệu suất ban đầu và đáp ứng dưới một ứng suất xác định. Còn chưa biết: hành vi dưới mọi ứng suất khác, ở diện tích lớn hơn, và trong nhiều năm ngoài trời. ISOS giúp báo cáo và so sánh có trách nhiệm; nó không phải chứng nhận.",
        "Leaving the test chamber, we see the whole cell again. Measured: initial performance and the response under one defined stress. Still unknown: behaviour under every other stress, at larger area, and over years outdoors. ISOS helps to report and compare responsibly; it is not a certification.",
      ),
      t("Cải tiến đáng tin cần cả hiệu suất ban đầu tốt và bằng chứng độ bền tái lập được.", "Reliable improvement needs both good initial performance and reproducible stability evidence."),
      "1",
      13,
      [38],
      { final: true },
    ),
  ],
};

/* ───────────────────────── 5.5 ───────────────────────── */

export const FIN_STAGES: { n: string; name: string; sub: string; line: string }[] = [
  {
    n: "1",
    name: t("Chọn kiến trúc", "Choose the architecture"),
    sub: t("Chồng lớp p–i–n", "p–i–n stack"),
    line: t("Thứ tự lớp xác lập cấu trúc lấy điện tích của thiết bị.", "The layer order establishes the device's charge-extraction structure."),
  },
  {
    n: "2",
    name: t("Xác định chức năng từng lớp", "Define the primary function of each layer"),
    sub: t("Hấp thụ + vận chuyển chọn lọc + thu điện", "Absorption + selective charge transport + electrical collection"),
    line: t("Các lớp phải phối hợp để tạo dòng điện hữu ích.", "The layers must cooperate to create useful current."),
  },
  {
    n: "3",
    name: t("Biện minh lựa chọn vật liệu", "Justify the material choices"),
    sub: t("Khớp năng lượng + tương thích giao diện + khả năng chế tạo + độ bền", "Energy alignment + interface compatibility + processability + stability"),
    line: t("Các vật liệu phải hoạt động tốt cùng nhau trong cả chồng lớp.", "The material choices must work together as a complete stack."),
  },
  {
    n: "4",
    name: t("Kiểm chứng độ bền", "Verify stability"),
    sub: t("Điều kiện ứng suất xác định + hiệu suất đo được + báo cáo minh bạch", "Defined stress conditions + measured performance + transparent reporting"),
    line: t("Thiết bị phải được đánh giá vượt ra ngoài hiệu suất ban đầu.", "The device must be evaluated beyond its initial efficiency."),
  },
];

const FIN: StorySpec = {
  id: "c5fin",
  scene: "sFin",
  section: "5.5",
  group: "design",
  microSwitch: false,
  views: [t("Toàn thiết bị", "Device"), t("Các lớp", "Layers"), t("Giao diện", "Interface")],
  title: t("Tổng hợp — từ kiến trúc đến bằng chứng", "Putting it together — from architecture to evidence"),
  sentence: t(
    "Bốn bước nối thành một vòng: kiến trúc, chức năng, vật liệu, rồi bằng chứng độ bền để thiết kế lại.",
    "The four steps form one loop: architecture, function, materials, then stability evidence to redesign.",
  ),
  final: t(
    "Một pin perovskite tốt hơn không chỉ là một lớp hấp thụ hiệu suất cao. Đó là một chồng lớp được thiết kế tốt từ các vật liệu tương thích, với hiệu suất và độ bền được chứng minh bằng các phép thử tái lập.",
    "A better perovskite solar cell is not just a high-efficiency absorber. It is a well-designed stack made from compatible materials, with performance and stability demonstrated using reproducible tests.",
  ),
  qa: {
    q: t("Vòng thiết kế đi qua những gì?", "What does the design loop go through?"),
    a: t("Kiến trúc → chức năng lớp → vật liệu và giao diện → thử độ bền → thiết kế lại dựa trên bằng chứng.", "Architecture → layer functions → materials and interfaces → stability testing → evidence-based redesign."),
  },
  legend: [],
  options: "none",
  brief: true,
  controls: [panelCtl("open")],
  steps: [
    ...FIN_STAGES.map((s, i) =>
      step(
        t(`Giai đoạn ${s.n}: ${s.name}`, `Stage ${s.n}: ${STORY_EN[s.name] ?? s.name}`),
        s.line,
        s.sub,
        i === 3 ? "2" : i === 2 ? "3" : "1",
        10,
        i === 0 ? [101, 102] : i === 1 ? [102, 103] : i === 2 ? [104, 105, 106] : [38],
      ),
    ),
    step(
      t("Vòng khép lại: thiết kế lại dựa trên bằng chứng", "Closing the loop: evidence-based redesign"),
      t(
        "Kết quả thử độ bền quay lại kiến trúc, lớp và vật liệu: chỗ nào hỏng thì sửa chỗ đó, rồi thử lại. Chuỗi này là: kiến trúc → chức năng lớp → vật liệu và giao diện → thử độ bền → thiết kế lại dựa trên bằng chứng.",
        "The stability results flow back into the architecture, layers and materials: fix what failed and test again. The chain is: architecture → layer functions → materials and interfaces → stability testing → evidence-based redesign.",
      ),
      t("Cải tiến là một vòng lặp, không phải một lần chọn.", "Improvement is a loop, not a single choice."),
      "1",
      12,
      [38, 101],
      { final: true },
    ),
  ],
};

export const STORIES5: StorySpec[] = [PIN, FUNC, WHY, VERIFY, FIN];
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
