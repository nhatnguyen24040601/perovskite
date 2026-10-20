/**
 * Chapter 4 · Perovskite fabrication, market readiness and lead safety.
 * Same engine as sections 3.1 – 3.8: every text is a Vietnamese / English pair written once with `t()`.
 *
 *   4.1 – 4.5   laboratory preparation and material growth
 *   4.6         market 2024 – 2026 (wide camera)
 *   4.7, 4.8    industrial coating and scale-up
 *   4.9 A–C     lead, alternatives and environmental safety
 */
import { registerStories, t, type Facts, type FabControl, type StorySpec, type StoryStep } from "./story";

const step = (
  title: string,
  body: string,
  why: string,
  cam: string,
  dur: number,
  cite?: number[],
  extra?: Partial<StoryStep>,
): StoryStep => ({ title, body, why, cam, dur, cite, ...extra });

const slider = (
  key: string,
  label: string,
  lo: string,
  hi: string,
  def = 0.5,
  at?: number[],
): FabControl => ({ kind: "slider", key, label, lo, hi, min: 0, max: 1, step: 0.05, def, at });

const MODEL = t(
  "Mô hình giáo dục đã đơn giản hóa, không phải mô phỏng định lượng.",
  "A simplified teaching model, not a quantitative simulation.",
);

/* ───────── shared wording ───────── */

export const C4 = {
  overview: t("Về tổng quan chương", "Chapter overview"),
  facts: t("Thông tin phương pháp", "Method facts"),
  inputs: t("Nguyên liệu", "Input materials"),
  equipment: t("Thiết bị", "Equipment"),
  process: t("Quá trình vật lý", "Physical process"),
  result: t("Vật liệu thu được", "Resulting material"),
  pros: t("Ưu điểm", "Advantages"),
  cons: t("Hạn chế", "Limitations"),
  scale: t("Khả năng mở rộng", "Scale-up potential"),
  sources: t("Nguồn", "Sources"),
  simple: t("Nói đơn giản", "In simple terms"),
  conceptual: t("Minh họa khái niệm", "Conceptual illustration"),
  model: MODEL,
  back: t("Quay lại tổng quan", "Back to overview"),
};

const SPIN: StorySpec = {
  id: "spin",
  scene: "sSpin",
  section: "4.1",
  group: "fab",
  microSwitch: true,
  views: [t("Thiết bị", "Equipment"), t("Đế", "Substrate"), t("Tinh thể", "Crystals")],
  title: t("4.1 Quay phủ", "4.1 Spin Coating"),
  sentence: t(
    "Quay phủ trải mực lỏng trên đế đang quay; dung môi bay đi và phần còn lại kết tinh thành màng.",
    "Spin coating spreads liquid ink across a rotating substrate. The solvent then evaporates, and the remaining material forms a crystalline film.",
  ),
  final: t("Mực lỏng → màng ướt mỏng → màng tinh thể.", "Liquid ink → thin wet film → crystalline film."),
  qa: {
    q: t("Quay phủ làm gì với mực?", "What does spin coating do to the ink?"),
    a: t("Trải thành màng mỏng, rồi dung môi bay để tinh thể hình thành.", "Spreads it thin; then the solvent leaves and crystals form."),
  },
  legend: [
    { swatch: "iodine", label: t("Mực tiền chất", "Precursor ink") },
    { swatch: "sun", label: t("Hạt dung môi", "Solvent particles") },
    { swatch: "perov", label: t("Màng perovskite", "Perovskite film") },
  ],
  simple: t(
    "Giống như nhỏ chất lỏng lên một cái đĩa rồi quay đĩa để trải chất lỏng thành lớp mỏng.",
    "Like putting liquid on a plate and spinning it to spread the liquid into a thin layer.",
  ),
  options: "none",
  controls: [
    slider("speed", t("Tốc độ quay", "Spin speed"), t("chậm", "slower"), t("nhanh", "faster"), 0.5, [2, 3, 4]),
    slider("time", t("Thời gian quay (minh họa)", "Spin time (illustrative)"), t("ngắn", "shorter"), t("dài", "longer"), 0.5, [3, 4]),
  ],
  facts: {
    inputs: t(
      "Mực tiền chất: PbI₂ và muối hữu cơ (như MAI) hòa trong dung môi (như DMF/DMSO). “Tiền chất” là các nguyên liệu để tạo vật liệu cuối.",
      "Precursor ink: PbI₂ and an organic salt (such as MAI) dissolved in solvents (such as DMF/DMSO). “Precursors” are the ingredients used to make the final material.",
    ),
    equipment: t("Máy quay phủ (mâm hút chân không, động cơ), pipet, bàn nhiệt.", "Spin coater (vacuum chuck, motor), pipette, hot plate."),
    process: t("Lực ly tâm trải mực; dung môi bay; kết tinh.", "Centrifugal spreading, solvent evaporation, crystallization."),
    result: t("Màng perovskite đa tinh thể dày vào cỡ vài trăm nanomet.", "A polycrystalline perovskite film on the order of a few hundred nanometres thick."),
    pros: t("Dụng cụ đơn giản; phổ biến trong nghiên cứu; tiện thử nhiều công thức.", "Simple laboratory setup; widely used in research; convenient for testing formulations."),
    cons: t(
      "Phần mực thừa bị văng đi; khó giữ độ đồng đều khi đổi điều kiện và cỡ đế; dùng vật liệu hiệu quả và sản xuất liên tục cần cân nhắc thêm.",
      "Excess ink is thrown off; uniformity is harder to keep as conditions and substrate size change; high material use and continuous production need extra consideration.",
    ),
    scale: t("Thường dùng cho mẫu nhỏ; lên diện tích lớn gặp thách thức thực tế nên có thêm các cách phủ khác (4.7, 4.8).", "Mostly used for small samples; larger areas bring practical challenges, which is why other coating methods exist (4.7, 4.8)."),
    refs: [81, 80, 47],
  },
  steps: [
    step(
      t("Đặt đế lên mâm", "Place the substrate"),
      t(
        "“Đế” (substrate) là bề mặt để vật liệu hình thành trên đó. Ở đây là một tấm kính phẳng đặt trên mâm quay (chuck).",
        "A “substrate” is the surface on which the material is formed. Here it is a flat glass plate sitting on a rotating chuck.",
      ),
      t("Đế phẳng, sạch, nằm yên giữa mâm thì lớp mực mới trải đều.", "A flat, clean substrate centred on the chuck is what lets the ink spread evenly."),
      "1", 5, [81],
    ),
    step(
      t("Nhỏ mực tiền chất", "Dispense the precursor ink"),
      t(
        "Pipet nhỏ một giọt dung dịch tiền chất perovskite gần tâm đế. Dung dịch chứa các nguyên liệu để tạo perovskite.",
        "A pipette releases a droplet of perovskite precursor solution near the centre. The liquid contains the ingredients needed to form perovskite.",
      ),
      t("Đủ mực thì phủ kín đế; thiếu thì màng bị thủng.", "Enough ink covers the whole substrate; too little leaves holes."),
      "2", 5, [81],
    ),
    step(
      t("Bắt đầu quay", "Start rotation"),
      t(
        "Mâm quay nhanh dần. Mực chảy từ tâm ra rìa theo hướng bán kính; lớp lỏng trượt trên đế chứ không quay như một khối cứng. Kéo thanh trượt để đổi tốc độ.",
        "The chuck spins up. The liquid flows outward from the centre; it slides over the substrate instead of turning as a rigid block. Drag the slider to change the speed.",
      ),
      t("Chuyển động ly tâm biến một giọt thành lớp phủ rộng.", "Centrifugal motion turns one drop into a wide coating."),
      "2", 7, [81],
    ),
    step(
      t("Hình thành màng ướt", "Form the wet film"),
      t(
        "Lớp lỏng mỏng dần và phần thừa văng khỏi mép. Quay nhanh hơn thường cho lớp mỏng hơn, nhưng độ dày và độ đồng đều còn phụ thuộc tính chất dung dịch, thời gian, nhiệt độ và môi trường.",
        "The liquid thins out and the excess is flung off the edge. Faster spinning usually gives a thinner layer, but thickness and uniformity also depend on the solution, the time, the temperature and the surroundings.",
      ),
      t("Tốc độ không phải biến duy nhất; mô hình chỉ minh họa xu hướng.", "Speed is not the only variable; the model only shows the trend."),
      "2", 8, [81],
      { info: t("Chỉ báo độ dày là minh họa khái niệm (dày hơn / mỏng hơn), không phải số đo.", "The thickness indicator is conceptual (thicker / thinner), not a measured value.") },
    ),
    step(
      t("Dung môi bay đi", "Remove the solvent"),
      t(
        "Các hạt dung môi rời màng. Lớp ướt dần mất tính lỏng và trở nên đặc quánh.",
        "Solvent particles leave the film. The wet layer gradually loses its liquid character and thickens.",
      ),
      t("Khi dung môi hết, các ion tiền chất bị dồn lại và sẵn sàng kết tinh.", "As the solvent goes, the precursor ions crowd together, ready to crystallize."),
      "2", 6, [81, 47],
    ),
    step(
      t("Kết tinh", "Crystallize"),
      t(
        "“Kết tinh” là các ion sắp xếp thành cấu trúc có trật tự. Màng ngả tối, hiện vân hạt tinh thể; mỗi hạt có mạng ABX₃ riêng và giữa các hạt có ranh giới.",
        "“Crystallization” is ions arranging into an ordered crystal structure. The film darkens and shows crystal grains; each grain has its own ABX₃ lattice, with boundaries between grains.",
      ),
      t("Hạt lớn, ít ranh giới thường giúp điện tích đi thông hơn.", "Larger grains with fewer boundaries generally let charges move more freely."),
      "3", 7, [47, 81],
    ),
    step(
      t("Kiểm tra màng hoàn thiện", "Inspect the final film"),
      t(
        "Quay đế và xem mặt cắt: màng phủ kín đế nhưng mỏng hơn tấm kính rất nhiều.",
        "Rotate the substrate and view the cross-section: the film covers the substrate but is far thinner than the glass.",
      ),
      t("Một lớp mỏng cỡ vài trăm nanomet là đủ để hấp thụ ánh sáng.", "A layer a few hundred nanometres thick is enough to absorb sunlight."),
      "xs", 7, [81],
      { final: true },
    ),
  ],
};

const TWO: StorySpec = {
  id: "twostep",
  scene: "sTwo",
  section: "4.2",
  group: "fab",
  microSwitch: true,
  views: [t("Thiết bị", "Equipment"), t("Đế", "Substrate"), t("Mặt cắt", "Cross-section")],
  title: t("4.2 Lắng đọng hai bước", "4.2 Two-Step Sequential Deposition"),
  sentence: t(
    "Phủ trước một tiền chất, rồi cho tiền chất thứ hai vào để hai thành phần phản ứng thành perovskite.",
    "First deposit one precursor layer. Then introduce the second precursor so that the two components react to form perovskite.",
  ),
  final: t("Lớp PbI₂ + MAI → màng MAPbI₃.", "PbI₂ layer + MAI → MAPbI₃ film."),
  qa: {
    q: t("Lớp PbI₂ đã là perovskite chưa?", "Is the PbI₂ layer already perovskite?"),
    a: t("Chưa. Nó chỉ thành perovskite sau khi phản ứng với MAI.", "No. It becomes perovskite only after it reacts with MAI."),
  },
  legend: [
    { swatch: "pbi2", label: "PbI₂" },
    { swatch: "ma", label: "MAI" },
    { swatch: "perov", label: "MAPbI₃" },
  ],
  simple: t(
    "Thay vì trộn mọi nguyên liệu rồi phủ một lần, ta phủ một nguyên liệu trước, rồi thêm nguyên liệu kia. Chúng phản ứng để tạo perovskite.",
    "Instead of mixing and depositing all ingredients at once, we deposit one ingredient first and add another afterward. They react to form perovskite.",
  ),
  options: "none",
  controls: [
    {
      kind: "seg",
      key: "focus",
      label: t("Quan sát", "Examine"),
      def: "all",
      at: [3, 4, 5],
      opts: [
        { v: "all", label: t("Tất cả", "All") },
        { v: "pbi2", label: t("Tiền chất 1 (PbI₂)", "First precursor") },
        { v: "mai", label: t("Tiền chất 2 (MAI)", "Second precursor") },
        { v: "zone", label: t("Vùng phản ứng", "Reaction region") },
        { v: "perov", label: t("Perovskite cuối", "Final perovskite") },
      ],
    },
    {
      kind: "seg",
      key: "ba",
      label: t("Trước / Sau", "Before / After"),
      def: "auto",
      at: [5],
      opts: [
        { v: "auto", label: t("Tự động", "Auto") },
        { v: "before", label: t("Trước: PbI₂", "Before: PbI₂") },
        { v: "after", label: t("Sau: perovskite", "After: perovskite") },
      ],
    },
  ],
  facts: {
    inputs: t(
      "Ví dụ minh họa MAPbI₃: PbI₂ (tiền chất 1), MAI (tiền chất 2). Công thức thật thay đổi theo thành phần và quy trình.",
      "Illustrative MAPbI₃ route: PbI₂ (first precursor), MAI (second precursor). Real recipes vary with composition and process.",
    ),
    equipment: t("Máy quay phủ hoặc bể nhúng, pipet, bàn nhiệt.", "Spin coater or dip bath, pipette, hot plate."),
    process: t("Lắng đọng lớp PbI₂; ion hữu cơ khuếch tán vào và phản ứng; kết tinh.", "Deposit a PbI₂ layer; organic ions diffuse in and react; crystallize."),
    result: t("Màng MAPbI₃ đa tinh thể.", "A polycrystalline MAPbI₃ film."),
    pros: t("Có thêm chỗ để điều khiển mức chuyển hóa và sự hình thành tinh thể.", "Gives extra control over conversion and crystal formation."),
    cons: t(
      "Chuyển hóa chưa hết, tiền chất còn dư, thời gian xử lý và độ đồng đều cần kiểm soát. Không phải lúc nào cũng tốt hơn một bước.",
      "Incomplete conversion, residual precursor, processing time and uniformity need control. It is not universally better than one-step deposition.",
    ),
    scale: t("Phù hợp cả quay phủ lẫn phủ diện rộng nếu kiểm soát tốt bước phản ứng.", "Can pair with spin or large-area coating if the reaction step is well controlled."),
    refs: [46, 81],
  },
  steps: [
    step(
      t("Chuẩn bị đế", "Prepare the substrate"),
      t("Một đế sạch nằm trên bệ phủ. Mọi lớp sau đều bám lên mặt này.", "A clean substrate sits on the coating stage. Every later layer builds on this surface."),
      t("Bề mặt sạch giúp các lớp sau bám đều.", "A clean surface helps later layers stick evenly."),
      "1", 4.5, [46],
    ),
    step(
      t("Phủ tiền chất thứ nhất", "Deposit the first precursor"),
      t(
        "Dung dịch PbI₂ được phủ thành lớp mỏng màu vàng. Lớp trung gian này là “lớp tiền chất PbI₂”, chưa phải perovskite.",
        "A PbI₂ solution is deposited as a thin yellow layer. This intermediate is the “PbI₂ precursor layer”, not finished perovskite.",
      ),
      t("Lớp này là khung chì halide mà perovskite sẽ lớn lên từ đó.", "This layer is the lead-halide scaffold the perovskite grows from."),
      "2", 6, [46],
    ),
    step(
      t("Đưa tiền chất thứ hai vào", "Introduce the second precursor"),
      t(
        "Một dung dịch MAI (muối hữu cơ) được phủ lên trên hoặc nhúng vào. Nó là dung dịch riêng, khác lớp PbI₂ bên dưới.",
        "A solution of MAI (an organic salt) is applied on top or the sample is dipped. It is a separate solution, distinct from the PbI₂ layer below.",
      ),
      t("Đây là thành phần còn thiếu để PbI₂ thành ABX₃.", "This is the missing component that turns PbI₂ into ABX₃."),
      "2", 6, [46],
    ),
    step(
      t("Khuếch tán và phản ứng", "Diffusion and reaction"),
      t(
        "Phóng vào mặt cắt: ion MA⁺ và I⁻ đi vào lớp PbI₂ và phản ứng. Màu đổi dần từ vàng sang đen, từ trên xuống, không đổi tức thì. Có thể tạm dừng và chọn từng phần để xem.",
        "Zoom into the cross-section: MA⁺ and I⁻ enter the PbI₂ layer and react. The colour changes gradually from yellow to dark, from the top down, not instantly. Pause and pick any part to examine.",
      ),
      t("Phản ứng chạy hết chiều dày hay không quyết định màng còn PbI₂ dư hay không.", "Whether the reaction runs through the full thickness decides whether PbI₂ is left over."),
      "xs", 9, [46],
    ),
    step(
      t("Perovskite hình thành", "Perovskite forms"),
      t(
        "Lớp trung gian chuyển thành màng MAPbI₃ tinh thể. Phương trình rút gọn: PbI₂ + MAI → MAPbI₃.",
        "The intermediate turns into a crystalline MAPbI₃ film. Simplified equation: PbI₂ + MAI → MAPbI₃.",
      ),
      t("Đây chỉ là ví dụ đơn giản; công thức thật còn nhiều cation và halide khác.", "This is a simplified example; real recipes use more cations and halides."),
      "3", 7, [46, 81],
      { info: t("Phương trình rút gọn, dùng để minh họa.", "Simplified equation, for illustration.") },
    ),
    step(
      t("Kiểm tra và so sánh", "Final inspection"),
      t(
        "So sánh lớp PbI₂ ban đầu với màng perovskite sau phản ứng bằng nút Trước / Sau.",
        "Compare the initial PbI₂ layer with the reacted perovskite film using the Before / After control.",
      ),
      t("Thấy rõ vật liệu đã đổi: màu, cấu trúc và vai trò.", "You can see what changed: colour, structure and role."),
      "xs", 7, [46, 81],
      { final: true },
    ),
  ],
};

const VAC: StorySpec = {
  id: "vacuum",
  scene: "sVac",
  section: "4.3",
  group: "fab",
  microSwitch: true,
  views: [t("Buồng", "Chamber"), t("Đế", "Substrate"), t("Mặt cắt", "Cross-section")],
  title: t("4.3 Lắng đọng chân không", "4.3 Vacuum Deposition"),
  sentence: t(
    "Lắng đọng chân không tạo màng từ hơi, thay vì trải mực lỏng lên đế.",
    "Vacuum deposition forms a film from vapor instead of spreading a liquid ink over the substrate.",
  ),
  final: t("Hơi vật liệu → ngưng tụ trên đế → màng.", "Material vapor → condenses on the substrate → film."),
  qa: {
    q: t("Vì sao cần buồng chân không?", "Why a vacuum chamber?"),
    a: t("Áp suất thấp để hơi vật liệu đi tới đế mà ít va chạm với không khí.", "Low pressure lets the vapor reach the substrate with few collisions with air."),
  },
  legend: [
    { swatch: "pbi2", label: t("Hơi nguồn A (chì halide)", "Vapor from source A (lead halide)") },
    { swatch: "ma", label: t("Hơi nguồn B (muối hữu cơ)", "Vapor from source B (organic salt)") },
    { swatch: "perov", label: t("Màng", "Film") },
  ],
  simple: t(
    "Hãy tưởng tượng biến một chất rắn thành hơi, rồi để hơi đó đậu xuống một bề mặt và xây thành màng mỏng.",
    "Imagine turning a solid material into vapor and letting that vapor deposit on a surface to build a thin film.",
  ),
  options: "none",
  controls: [
    {
      kind: "seg",
      key: "mode",
      label: t("Quy trình", "Process"),
      def: "seq",
      opts: [
        { v: "seq", label: t("Bay hơi tuần tự", "Sequential vapor deposition") },
        { v: "co", label: t("Đồng bay hơi", "Co-evaporation") },
      ],
    },
    {
      kind: "seg",
      key: "srcA",
      label: t("Nguồn A (chì halide)", "Source A (lead halide)"),
      def: "on",
      at: [2, 3, 4, 5, 6],
      opts: [
        { v: "on", label: t("Bật", "On") },
        { v: "off", label: t("Tắt", "Off") },
      ],
    },
    {
      kind: "seg",
      key: "srcB",
      label: t("Nguồn B (muối hữu cơ)", "Source B (organic salt)"),
      def: "on",
      at: [2, 3, 4, 5, 6],
      opts: [
        { v: "on", label: t("Bật", "On") },
        { v: "off", label: t("Tắt", "Off") },
      ],
    },
    slider("time", t("Thời gian lắng đọng (minh họa)", "Deposition time (illustrative)"), t("ngắn", "shorter"), t("dài", "longer"), 0.6, [4, 5]),
  ],
  facts: {
    inputs: t("Chất rắn nguồn: chì halide (như PbI₂) và muối hữu cơ (như MAI hoặc FAI).", "Source solids: a lead halide (such as PbI₂) and an organic salt (such as MAI or FAI)."),
    equipment: t("Buồng chân không, bơm, nguồn gia nhiệt (thuyền bay hơi), giá đỡ đế, đồng hồ áp suất.", "Vacuum chamber, pump, heated sources (evaporation boats), substrate holder, pressure gauge."),
    process: t("Hơi bay từ nguồn nóng, đi qua buồng áp suất thấp, ngưng tụ hoặc phản ứng trên đế.", "Vapor leaves hot sources, crosses a low-pressure chamber, condenses or reacts on the substrate."),
    result: t("Màng perovskite phủ đều cả trên bề mặt gồ ghề.", "A perovskite film that can follow even rough surfaces."),
    pros: t("Kiểm soát độ dày tốt; có tiềm năng đồng đều; không dùng dung môi.", "Good thickness control; uniformity potential; no solvents."),
    cons: t(
      "Thiết bị phức tạp, cần chân không và năng lượng; không phải kỹ thuật chân không nào cũng dùng thiết bị hay điều kiện tiền chất giống nhau.",
      "Complex equipment, vacuum and energy needs; not every vacuum technique uses the same equipment or precursor conditions.",
    ),
    scale: t("Ngành màn hình và bán dẫn đã quen thiết bị chân không khổ lớn, nhưng cần chứng minh cho perovskite.", "Display and semiconductor industries know large vacuum tools, but this still has to be shown for perovskite."),
    refs: [81, 80, 51],
  },
  steps: [
    step(
      t("Nạp đế vào buồng", "Load the substrate"),
      t("Đế được đặt vào giá đỡ trong buồng; cửa buồng đóng lại.", "The substrate is placed on the holder inside the chamber; the chamber door closes."),
      t("Buồng kín mới hút được chân không.", "Only a sealed chamber can be pumped down."),
      "1", 5, [81],
    ),
    step(
      t("Tạo chân không", "Establish the vacuum"),
      t(
        "Bơm chạy và đồng hồ áp suất giảm. Nhiều quy trình lắng đọng chân không cần buồng áp suất thấp. Số trên đồng hồ chỉ để minh họa.",
        "The pump runs and the gauge falls. Many vacuum-deposition processes need a low-pressure chamber. The gauge readings are illustrative.",
      ),
      t("Ít phân tử khí hơn nghĩa là hơi vật liệu ít bị cản đường.", "Fewer gas molecules means the vapor is hindered less on its way."),
      "1", 6, [81],
    ),
    step(
      t("Tạo hơi", "Generate vapor"),
      t(
        "Nguồn được gia nhiệt và các hạt vật liệu bắt đầu bay lên. Bật/tắt từng nguồn để thấy mỗi nguồn đóng góp gì.",
        "The sources are heated and material particles start to leave. Switch each source on or off to see what it contributes.",
      ),
      t("Mỗi nguồn cấp một thành phần; thiếu nguồn thì không ra đủ ABX₃.", "Each source supplies one ingredient; with one missing you do not get full ABX₃."),
      "1", 6, [81],
    ),
    step(
      t("Vận chuyển hơi", "Transport the vapor"),
      t("Hạt hơi bay thẳng qua buồng về phía đế đặt phía trên.", "Vapor particles travel in nearly straight lines across the chamber toward the substrate above."),
      t("Đường đi gần thẳng giúp hơi bám cả mặt gồ ghề.", "Straight paths let the vapor coat rough surfaces too."),
      "1", 6, [81],
    ),
    step(
      t("Màng hình thành", "Film formation"),
      t(
        "Hạt đến đế thì ngưng tụ hoặc phản ứng và tạo màng dày dần. Tuần tự: lớp chì halide trước, rồi muối hữu cơ. Đồng bay hơi: cả hai cùng lúc.",
        "Particles reaching the substrate condense or react and the film grows. Sequential: lead-halide layer first, then organic salt. Co-evaporation: both together.",
      ),
      t("Hai quy trình khác nhau về thứ tự, nên không được vẽ thành một.", "The two processes differ in order, so they are shown separately."),
      "2", 8, [81],
    ),
    step(
      t("Hoàn tất lắng đọng", "Complete the deposition"),
      t("Màng liên tục dày thêm. Thanh chỉ báo độ dày chỉ là minh họa, không dựa trên tốc độ lắng đọng thật.", "A continuous film thickens. The thickness bar is illustrative, not based on real deposition rates."),
      t("Thời gian lắng đọng càng dài, màng càng dày.", "A longer deposition time builds a thicker film."),
      "2", 6, [81],
    ),
    step(
      t("Kiểm tra lớp thu được", "Inspect the resulting layer"),
      t("Camera tiến sát đế để xem mặt cắt: màng đồng đều bám trên đế.", "The camera moves toward the substrate for a cross-section: an even film on the substrate."),
      t("Cho thấy kết quả cuối của việc xây màng từ hơi.", "Shows the end result of building a film from vapor."),
      "xs", 7, [81, 51],
      { final: true },
    ),
  ],
};

const CRY: StorySpec = {
  id: "crystal",
  scene: "sCry",
  section: "4.4",
  group: "fab",
  views: [t("Bình", "Vessel"), t("Tinh thể", "Crystal"), t("Mạng tinh thể", "Lattice")],
  microSwitch: true,
  title: t("4.4 Nuôi đơn tinh thể", "4.4 Single-Crystal Growth"),
  sentence: t(
    "Đơn tinh thể là một tinh thể liên tục, không phải màng gồm nhiều hạt tinh thể riêng.",
    "A single crystal is one continuous crystal, rather than a film made up of many separate crystalline grains.",
  ),
  final: t("Một tinh thể trật tự liên tục.", "One continuous ordered crystal."),
  qa: {
    q: t("Đơn tinh thể khác màng ở đâu?", "How does a single crystal differ from a film?"),
    a: t("Mô hình lý tưởng không có ranh giới hạt bên trong.", "In the idealized model it has no internal grain boundaries."),
  },
  legend: [
    { swatch: "iodine", label: t("Ion trong dung dịch", "Ions in solution") },
    { swatch: "perov", label: t("Tinh thể", "Crystal") },
  ],
  simple: t(
    "Nuôi đơn tinh thể giống như nuôi một tinh thể lớn có trật tự, thay vì ghép nhiều tinh thể nhỏ lại.",
    "Single-crystal growth is like growing one large, ordered crystal instead of joining many smaller crystals together.",
  ),
  options: "none",
  controls: [
    {
      kind: "seg",
      key: "mat",
      label: t("Mô hình", "Model"),
      def: "single",
      at: [5, 6],
      opts: [
        { v: "single", label: t("Đơn tinh thể", "Single crystal") },
        { v: "poly", label: t("Đa tinh thể", "Polycrystalline") },
      ],
    },
  ],
  facts: {
    inputs: t("Muối tiền chất (như PbI₂ và MAI) hòa trong dung môi.", "Precursor salts (such as PbI₂ and MAI) dissolved in a solvent."),
    equipment: t("Bình nuôi trong suốt, bể điều nhiệt, nhíp, dụng cụ quan sát.", "Transparent growth vessel, temperature-controlled bath, tweezers, inspection tools."),
    process: t("Dung dịch quá bão hòa → tạo mầm → ion bám vào mầm → tinh thể lớn dần.", "Supersaturated solution → nucleation → ions attach → the crystal grows."),
    result: t("Tinh thể khối cỡ milimet đến lớn hơn.", "A bulk crystal of millimetre size or larger."),
    pros: t("Giúp nghiên cứu tính chất vốn có và giảm ảnh hưởng ranh giới hạt.", "Helps study intrinsic properties and reduces grain-boundary effects."),
    cons: t(
      "Không tự giải quyết mọi khuyết tật hay độ bền; tinh thể khối không tương đương quy trình sản xuất module diện rộng đã thành thục.",
      "Does not automatically solve every defect or stability problem; bulk crystal growth is not an established large-area module process.",
    ),
    scale: t("Chủ yếu dùng nghiên cứu và đầu dò; không phải tuyến sản xuất module.", "Mostly for research and detectors; not a module production line."),
    refs: [83, 49, 11],
  },
  steps: [
    step(
      t("Chuẩn bị dung dịch", "Prepare the precursor solution"),
      t("Các nguyên liệu được hòa tan trong bình. “Tiền chất” là nguyên liệu để tạo vật liệu cuối.", "The ingredients are dissolved in a vessel. “Precursors” are the ingredients used to make the final material."),
      t("Dung dịch trong, đồng nhất là điểm xuất phát.", "A clear, uniform solution is the starting point."),
      "1", 5, [83],
    ),
    step(
      t("Tạo điều kiện lớn", "Create growth conditions"),
      t(
        "Mô hình chọn một cách: làm nguội chậm dung dịch quá bão hòa. Thực tế có nhiều cách nuôi tinh thể; đây chỉ là một ví dụ.",
        "The model shows one route: slow cooling of a supersaturated solution. Real single-crystal growth has several methods; this is one example.",
      ),
      t("Quá bão hòa nghĩa là dung dịch chứa nhiều chất tan hơn mức nó giữ ổn định.", "Supersaturated means the solution holds more dissolved material than it can keep stable."),
      "1", 6, [83, 49],
      { info: t("Một ví dụ về cách nuôi; không phải cách duy nhất.", "One example of a growth route; not the only one.") },
    ),
    step(
      t("Tạo mầm", "Nucleation"),
      t("Một mầm tinh thể nhỏ xuất hiện trong dung dịch. Vùng có trật tự đầu tiên nhỏ hơn rất nhiều so với tinh thể cuối.", "A small crystal nucleus forms. The first ordered region is far smaller than the final crystal."),
      t("Mầm là chỗ tinh thể bắt đầu; ít mầm thì cho tinh thể lớn.", "The nucleus is where the crystal begins; few nuclei favour one large crystal."),
      "2", 6, [83],
    ),
    step(
      t("Tinh thể lớn lên", "Crystal growth"),
      t("Ion trong dung dịch bám lên mặt tinh thể theo từng lớp; tinh thể nở dần.", "Ions from the solution attach to the crystal faces layer by layer; the crystal expands."),
      t("Mỗi ion bám đúng vị trí giữ cho mạng liên tục.", "Each ion landing in the right place keeps the lattice continuous."),
      "2", 8, [83],
    ),
    step(
      t("Lấy tinh thể ra", "Recover the crystal"),
      t("Dùng nhíp nhấc tinh thể ra khỏi dung dịch nuôi.", "Tweezers lift the crystal out of the growth solution."),
      t("Tinh thể thu được mới đo và dùng được.", "A recovered crystal can be measured and used."),
      "1", 6, [83],
    ),
    step(
      t("Quan sát cấu trúc", "Inspect the structure"),
      t("Phóng vào bên trong: mạng ABX₃ trật tự, liên tục, không bị cắt bởi ranh giới.", "Zoom in: an ordered ABX₃ lattice, continuous, not interrupted by boundaries."),
      t("Thấy tận mắt thế nào là một tinh thể liên tục.", "You can see what “one continuous crystal” means."),
      "3", 7, [83],
    ),
    step(
      t("So sánh với màng đa tinh thể", "Compare with a polycrystalline film"),
      t(
        "Bên trái: màng đa tinh thể có nhiều hạt và ranh giới hạt. Bên phải: đơn tinh thể, trong mô hình lý tưởng không có ranh giới hạt bên trong. Chuyển qua lại bằng nút chọn mô hình.",
        "Left: a polycrystalline film with many grains and grain boundaries. Right: a single crystal, which in the idealized model has no internal grain boundaries. Use the model switch to flip between them.",
      ),
      t("Ranh giới hạt là nơi dễ có khuyết tật và rò điện tích.", "Grain boundaries are where defects and charge losses tend to occur."),
      "cmp", 9, [83, 11],
      { final: true },
    ),
  ],
};

const QD: StorySpec = {
  id: "qdot",
  scene: "sQd",
  section: "4.5",
  group: "fab",
  views: [t("Lọ", "Vial"), t("Vùng phóng đại", "Magnified"), t("Chấm lượng tử", "Dots")],
  microSwitch: true,
  title: t("4.5 Chấm lượng tử perovskite", "4.5 Perovskite Quantum Dots"),
  sentence: t(
    "Chế tạo chấm lượng tử tạo ra các tinh thể perovskite cực nhỏ, có tính chất quang khác với perovskite khối.",
    "Quantum-dot fabrication creates tiny perovskite crystals. These nanocrystals can have optical properties different from bulk perovskite.",
  ),
  final: t("Tổng hợp chấm là một giai đoạn; phủ màng chấm là giai đoạn khác.", "Synthesizing dots is one stage; depositing a dot film is another."),
  qa: {
    q: t("Chấm lượng tử có phải là màng perovskite thường?", "Is a quantum dot just a normal perovskite film?"),
    a: t("Không. Đó là nano tinh thể riêng lẻ, sau đó có thể phủ thành màng.", "No. They are individual nanocrystals that can later be deposited into a film."),
  },
  legend: [
    { swatch: "dot", label: t("Chấm lượng tử", "Quantum dot") },
    { swatch: "iodine", label: t("Tiền chất", "Precursors") },
  ],
  simple: t(
    "Chấm lượng tử là nano tinh thể bán dẫn nhỏ đến mức kích thước của chúng ảnh hưởng đến cách hấp thụ và phát sáng.",
    "Quantum dots are semiconductor nanocrystals so small that their size can influence the way they absorb and emit light.",
  ),
  options: "none",
  controls: [
    slider("size", t("Kích thước chấm (minh họa)", "Dot size (conceptual)"), t("nhỏ hơn", "smaller"), t("lớn hơn", "larger"), 0.5, [3, 5]),
  ],
  facts: {
    inputs: t(
      "Muối chì halide, muối cesium (như Cs-oleate), dung môi, phối tử (như oleic acid, oleylamine).",
      "A lead halide, a cesium salt (such as Cs-oleate), solvent and ligands (such as oleic acid and oleylamine).",
    ),
    equipment: t("Bình cầu, gia nhiệt, bơm tiêm, ly tâm; để làm màng: máy phủ.", "Flask, heater, syringe, centrifuge; for films: a coater."),
    process: t("Mầm bùng phát → nano tinh thể lớn lên → dừng phản ứng → tinh chế → (tuỳ chọn) phủ màng.", "Burst nucleation → nanocrystal growth → quench → purification → (optionally) film deposition."),
    result: t("Nano tinh thể riêng lẻ trong dung dịch (mực chấm lượng tử).", "Individual nanocrystals in a solution (a quantum-dot ink)."),
    pros: t("Chỉnh được kích thước và thành phần; hữu ích cho ứng dụng quang học.", "Tunable size and composition; useful for optical applications."),
    cons: t(
      "Phối tử có thể cản vận chuyển điện tích; độ ổn định và sản xuất lặp lại còn là thách thức.",
      "Ligands can hinder charge transport; stability and reproducible manufacturing remain challenges.",
    ),
    scale: t("Tổng hợp theo mẻ; sau đó mực có thể phủ bằng các cách ở 4.1, 4.7, 4.8.", "Synthesis is batch-based; the ink can then be coated with the methods of 4.1, 4.7 and 4.8."),
    refs: [84, 45, 73],
  },
  steps: [
    step(
      t("Chuẩn bị nguyên liệu", "Prepare precursor ingredients"),
      t("Một lọ chứa dung dịch tiền chất chì halide cùng phối tử; dung dịch cesium chuẩn bị riêng.", "A vial holds the lead-halide precursor solution with ligands; the cesium solution is prepared separately."),
      t("Hai dung dịch chỉ gặp nhau ở thời điểm ta chọn.", "The two solutions meet only at the moment we choose."),
      "1", 5, [84, 45],
    ),
    step(
      t("Kích hoạt tạo mầm", "Trigger nucleation"),
      t(
        "Ví dụ: chích nhanh dung dịch cesium vào dung dịch chì đang nóng (chích nóng). Đây là một ví dụ về cách tổng hợp, không phải cách duy nhất.",
        "Example: rapidly inject the cesium solution into the hot lead solution (hot injection). This is one example of synthesis, not the only route.",
      ),
      t("Chích nhanh làm nhiều mầm xuất hiện gần như cùng lúc.", "A fast injection makes many nuclei appear almost together."),
      "1", 6, [45, 73],
      { info: t("Một ví dụ tổng hợp: chích nóng.", "One synthesis example: hot injection.") },
    ),
    step(
      t("Nano tinh thể hình thành", "Nanocrystals form"),
      t("Trong vùng phóng đại, các hạt tinh thể nhỏ xuất hiện. Hình phóng đại không đúng tỉ lệ so với lọ.", "In the magnified region, small crystalline particles appear. The magnified dots are not at their true size relative to the vial."),
      t("Đây là bước chấm lượng tử ra đời.", "This is the moment the quantum dots are born."),
      "2", 6, [84, 45],
    ),
    step(
      t("Điều khiển sự lớn lên", "Control particle growth"),
      t(
        "Các chấm có nhiều kích cỡ. Điều kiện phản ứng và thành phần ảnh hưởng kích cỡ, độ đồng đều và tính chất vật liệu. Kéo thanh trượt để xem minh họa.",
        "Dots come in several sizes. Reaction conditions and composition affect size, distribution and material properties. Drag the slider for the illustration.",
      ),
      t("Kích cỡ đều thì màu phát sáng thuần hơn.", "A uniform size gives a purer emission colour."),
      "3", 7, [84, 73],
    ),
    step(
      t("Tách chấm", "Isolate the dots"),
      t("Tinh chế đơn giản hóa: thêm chất kết tủa, ly tâm, bỏ phần dung dịch, hòa lại chấm trong dung môi sạch.", "Simplified purification: add an antisolvent, centrifuge, discard the liquid, re-disperse the dots in clean solvent."),
      t("Loại bỏ nguyên liệu dư để còn lại mực chấm tinh khiết.", "Removes leftover ingredients, leaving a clean dot ink."),
      "1", 7, [84],
    ),
    step(
      t("Tính chất quang", "Optical properties"),
      t(
        "Mỗi kích cỡ phát một màu khác nhau (minh họa khái niệm, chưa phải bộ số liệu thực nghiệm). Chấm nhỏ hơn thường phát sáng ở năng lượng cao hơn, nhưng thành phần cũng đổi màu.",
        "Each size glows a different colour (a conceptual illustration, not an experimental dataset). Smaller dots usually emit at higher energy, and composition also shifts the colour.",
      ),
      t("Màu có thể chỉnh bằng kích thước và thành phần.", "Colour can be tuned through size and composition."),
      "1", 7, [84, 45],
      { info: t("Phổ minh họa khái niệm, không tính theo mô hình lượng tử chính xác.", "The spectrum is a conceptual illustration, not an exact quantum-confinement calculation.") },
    ),
    step(
      t("Tạo màng chấm (tuỳ chọn)", "Optional film formation"),
      t(
        "Mực chấm được phủ lên đế, dung môi bay đi, các chấm xếp thành màng. Tổng hợp chấm và phủ màng là hai giai đoạn khác nhau.",
        "The dot ink is coated onto a substrate, the solvent leaves, and the dots pack into a film. Synthesizing dots and depositing a film are different stages.",
      ),
      t("Chỉ sau giai đoạn này chấm mới thành lớp dùng được trong linh kiện.", "Only after this stage do the dots become a layer a device can use."),
      "1", 7, [84],
      { final: true },
    ),
  ],
};

const BLADE: StorySpec = {
  id: "blade",
  scene: "sBlade",
  section: "4.7",
  group: "fab",
  microSwitch: true,
  views: [t("Thiết bị", "Equipment"), t("Màng ướt", "Wet film"), t("Tinh thể", "Crystals")],
  title: t("4.7 Phủ dao gạt", "4.7 Blade Coating"),
  sentence: t(
    "Phủ dao gạt dùng một lưỡi dao di chuyển để trải mực tiền chất lên đế.",
    "Blade coating uses a moving blade to spread precursor ink across a substrate.",
  ),
  final: t("Lưỡi dao → màng ướt liên tục → sấy → màng tinh thể.", "Blade → continuous wet film → drying → crystalline film."),
  qa: {
    q: t("Khe dao ảnh hưởng gì?", "What does the blade gap affect?"),
    a: t("Độ dày màng ướt, cùng với tốc độ, tính chất mực và sấy.", "The wet-film thickness, together with speed, ink properties and drying."),
  },
  legend: [
    { swatch: "iodine", label: t("Mực", "Ink") },
    { swatch: "sun", label: t("Hạt dung môi", "Solvent particles") },
    { swatch: "perov", label: t("Màng perovskite", "Perovskite film") },
  ],
  simple: t(
    "Giống như dùng dao gạt trải một lớp chất lỏng rồi để khô thành màng mỏng.",
    "Like spreading a layer of liquid with a blade or scraper, then drying it to create a thin film.",
  ),
  options: "none",
  controls: [
    slider("gap", t("Khe dao (minh họa)", "Blade gap (illustrative)"), t("hẹp", "narrow"), t("rộng", "wide"), 0.5, [2, 3, 4, 6]),
    slider("speed", t("Tốc độ dao", "Blade speed"), t("chậm", "slow"), t("nhanh", "fast"), 0.5, [2, 3]),
  ],
  facts: {
    inputs: t("Mực tiền chất perovskite trong dung môi.", "Perovskite precursor ink in solvent."),
    equipment: t("Lưỡi dao gạt, bệ phẳng chuyển động hoặc dao chuyển động, bàn sấy.", "Coating blade, moving flat stage or moving blade, drying plate."),
    process: t("Trải mực thành màng ướt; sấy; kết tinh.", "Spread ink into a wet film; dry; crystallize."),
    result: t("Màng perovskite đa tinh thể trên diện tích lớn hơn quay phủ.", "A polycrystalline perovskite film over a larger area than spin coating."),
    pros: t("Hợp phủ diện rộng; thiết bị khá đơn giản; có thể dùng mực hiệu quả hơn quay phủ.", "Suited to larger areas; fairly simple equipment; potentially better ink use than spin coating."),
    cons: t(
      "Chất lượng màng, hành vi sấy, độ đồng đều và điều kiện quy trình cần tối ưu; không tự động đồng đều hay sẵn sàng sản xuất ở mọi cấu hình.",
      "Film quality, drying behaviour, uniformity and process conditions need optimization; it is not automatically uniform or production-ready in every configuration.",
    ),
    scale: t("Triển vọng mở rộng diện tích tốt hơn quay phủ; cần chứng minh năng suất cao.", "Better area scaling prospects than spin coating; high yield still needs demonstration."),
    refs: [82, 50],
  },
  steps: [
    step(
      t("Chuẩn bị đế", "Prepare the substrate"),
      t("Đế sạch được đặt dưới dụng cụ phủ.", "A clean substrate sits beneath the coating tool."),
      t("Đế phẳng, sạch giúp màng ướt không bị vỡ.", "A flat, clean substrate keeps the wet film from breaking."),
      "1", 4.5, [82],
    ),
    step(
      t("Nhỏ mực", "Apply the ink"),
      t("Mực lỏng được đặt thành một vệt phía trước lưỡi dao.", "Liquid ink is placed as a bead in front of the blade."),
      t("Vệt mực là kho cấp chất lỏng cho lớp phủ.", "The bead is the reservoir that feeds the coating."),
      "2", 5, [82],
    ),
    step(
      t("Di chuyển lưỡi dao", "Move the blade"),
      t("Lưỡi dao chạy dọc đế; mực trải thành lớp ướt liên tục phía sau lưỡi.", "The blade travels along the substrate; the ink spreads into a continuous wet coating behind it."),
      t("Chuyển động đều tạo một dải đều.", "Steady motion makes an even strip."),
      "2", 8, [82, 50],
    ),
    step(
      t("Xem độ dày màng", "Examine film thickness"),
      t(
        "Phóng vào màng ướt. Khe dao, tốc độ, tính chất mực và điều kiện sấy đều có thể ảnh hưởng kết quả. Thử đổi khe dao.",
        "Zoom into the wet film. Blade gap, speed, ink properties and drying conditions can all influence the result. Try changing the gap.",
      ),
      t("Hiểu các biến số để chọn điều kiện phủ.", "Knowing the variables helps you choose the coating conditions."),
      "gap", 8, [82, 50],
      { info: t("Độ dày là loại khái niệm (mỏng / vừa / dày), không phải số đo.", "Thickness is shown as conceptual categories (thin / moderate / thick), not measured values.") },
    ),
    step(
      t("Sấy màng", "Dry the film"),
      t("Dung môi bay hơi và lớp ướt dần đặc lại.", "Solvent evaporates and the wet layer gradually thickens."),
      t("Tốc độ sấy ảnh hưởng đến cách tinh thể hình thành.", "Drying speed influences how the crystals form."),
      "2", 6, [82],
    ),
    step(
      t("Kết tinh perovskite", "Crystallize the perovskite"),
      t("Lớp phủ thành màng tinh thể mỏng, các hạt hiện ra.", "The coating becomes a thin crystalline film; grains appear."),
      t("Đây là lớp hấp thụ của pin.", "This is the absorber layer of the cell."),
      "3", 7, [82, 47],
    ),
    step(
      t("Kiểm tra lớp cuối", "Inspect the final layer"),
      t("Màng đồng đều là mục tiêu lý tưởng. Bấm khe dao rộng/hẹp để thấy đổi độ dày và lỗi phủ có thể xảy ra.", "A uniform film is the idealized target. Move the gap to see thickness variation and possible coating defects."),
      t("Lỗi phủ thấy ở đây có thể trở thành đường rò trong pin.", "Coating defects seen here can become leakage paths in a cell."),
      "xs", 8, [82],
      { final: true },
    ),
  ],
};

const SLOT: StorySpec = {
  id: "slot",
  scene: "sSlot",
  section: "4.8",
  group: "fab",
  microSwitch: true,
  views: [t("Dây chuyền", "Line"), t("Đầu phủ", "Die head"), t("Tinh thể", "Crystals")],
  title: t("4.8 Phủ khe (slot-die)", "4.8 Slot-Die Coating"),
  sentence: t(
    "Phủ khe bơm mực qua một khe hẹp lên đế đang chạy, tạo lớp lỏng có kiểm soát.",
    "Slot-die coating meters precursor ink through a narrow slot and coats a moving substrate with a controlled liquid layer.",
  ),
  final: t("Bơm → khe → cầu mực → màng ướt → sấy → kết tinh.", "Pump → slot → bead → wet film → drying → crystallization."),
  qa: {
    q: t("Phủ khe khác nhỏ mực từ ống thế nào?", "How is slot-die coating different from dripping ink from a tube?"),
    a: t("Mực được bơm đo lường qua khe hẹp tạo cầu mực liên tục.", "The ink is metered through a narrow slot, forming a continuous coating bead."),
  },
  legend: [
    { swatch: "iodine", label: t("Mực", "Ink") },
    { swatch: "sun", label: t("Hạt dung môi", "Solvent particles") },
    { swatch: "perov", label: t("Màng perovskite", "Perovskite film") },
  ],
  simple: t(
    "Giống một chiếc máy in có kiểm soát: mực đi qua một khe hẹp và được phủ liên tục khi đế chuyển động.",
    "Similar to a controlled printer: ink passes through a narrow opening and is deposited continuously as the substrate moves.",
  ),
  options: "none",
  controls: [
    slider("speed", t("Tốc độ đế", "Substrate speed"), t("chậm", "slow"), t("nhanh", "fast"), 0.5, [3, 4, 5, 6]),
    slider("flow", t("Lưu lượng mực", "Ink flow"), t("thấp", "low"), t("cao", "high"), 0.5, [2, 3, 4, 5, 6]),
    slider("gap", t("Khe đầu phủ – đế", "Die-to-substrate gap"), t("hẹp", "narrow"), t("rộng", "wide"), 0.5, [2, 3, 4, 5, 6]),
  ],
  facts: {
    inputs: t("Mực tiền chất perovskite trong dung môi.", "Perovskite precursor ink in solvent."),
    equipment: t("Bình chứa mực, bơm, ống dẫn, đầu phủ khe, đế chuyển động hoặc cuộn, vùng sấy.", "Ink reservoir, pump, feed line, slot-die head, moving or roll substrate, drying zone."),
    process: t("Bơm đo lường mực qua khe; cầu mực nối đầu phủ với đế; sấy; kết tinh.", "Metered pumping through a slot; a bead bridges die and substrate; drying; crystallization."),
    result: t("Màng perovskite đa tinh thể liên tục trên đế dài hoặc cuộn.", "A continuous polycrystalline perovskite film on a long or roll substrate."),
    pros: t("Hợp phủ liên tục diện rộng; có thể cuộn-sang-cuộn; ít lãng phí mực.", "Suited to continuous large-area coating; roll-to-roll capable; little ink waste."),
    cons: t(
      "Cần dòng ổn định, kiểm soát cầu mực, điều kiện sấy, tính lưu biến của mực, lỗi và khả năng lặp lại quy trình.",
      "Needs flow stability, bead control, drying conditions, ink rheology, defect control and process reproducibility.",
    ),
    scale: t("Tiềm năng mở rộng cao nhưng khác với sản xuất lớn đã chứng minh hiệu suất cao, năng suất cao.", "High scale-up potential, which is different from demonstrated high-yield large-scale manufacturing."),
    refs: [82, 50],
  },
  steps: [
    step(
      t("Chuẩn bị mực", "Prepare the ink"),
      t("Mực tiền chất nằm trong bình chứa của dây chuyền.", "The precursor ink sits in the reservoir of the line."),
      t("Mực ổn định, đồng nhất là điều kiện để phủ ổn định.", "Stable, uniform ink is needed for stable coating."),
      "tank", 4.5, [82],
    ),
    step(
      t("Bơm mực", "Pump the ink"),
      t("Bơm đẩy mực qua ống dẫn vào đầu phủ khe.", "The pump pushes ink through the feed line into the slot-die head."),
      t("Bơm cấp lưu lượng đo được thay vì để mực nhỏ giọt tùy ý.", "The pump gives a metered flow instead of ink dripping freely."),
      "tank", 7, [82],
    ),
    step(
      t("Tạo cầu mực", "Establish the coating bead"),
      t("Phóng vào khe hẹp giữa đầu phủ và đế: một cầu mực có kiểm soát nối hai bên.", "Zoom into the narrow gap between the die and substrate: a controlled liquid bead bridges them."),
      t("Cầu mực ổn định là trái tim của phủ khe.", "A stable bead is the heart of slot-die coating."),
      "2", 7, [82, 50],
    ),
    step(
      t("Đế chuyển động", "Move the substrate"),
      t("Đế chạy liên tục dưới đầu phủ; màng ướt hình thành phía sau đầu phủ. Thử đổi tốc độ, lưu lượng và khe.", "The substrate runs continuously beneath the die; the wet coating forms behind it. Try changing the speed, flow and gap."),
      t("Lưu lượng, tốc độ và khe cùng quyết định lớp phủ.", "Flow, speed and gap together shape the coating."),
      "mid", 9, [82, 50],
      { info: t("Chỉ báo là khái niệm (ổn định / thiếu / thừa), không phải độ dày đo được.", "The indicator is conceptual (stable / starved / flooded), not a measured thickness.") },
    ),
    step(
      t("Sấy màng ướt", "Dry the wet film"),
      t("Đế đi vào vùng sấy; dung môi bay hơi.", "The coated substrate enters the drying region; solvent evaporates."),
      t("Sấy đúng cách giữ màng đều khi tinh thể hình thành.", "Proper drying keeps the film even as crystals form."),
      "dry", 7, [82],
    ),
    step(
      t("Kết tinh perovskite", "Crystallize the perovskite"),
      t("Màng ướt thành lớp tinh thể perovskite.", "The wet film becomes a crystalline perovskite layer."),
      t("Đây là lớp hấp thụ ánh sáng của pin.", "This is the light-absorbing layer of the cell."),
      "3", 7, [82, 47],
    ),
    step(
      t("Nối với dây chuyền sản xuất", "Connect to industrial production"),
      t(
        "Thu nhỏ để thấy cả dây chuyền cuộn-sang-cuộn: cuộn đế, con lăn, trạm phủ, trạm sấy. Khả năng mở rộng khác với sản xuất lớn đã chứng minh.",
        "Zoom out to the whole roll-to-roll line: the web substrate, rollers, coating station and drying station. Scale-up potential is not the same as demonstrated large-scale manufacturing.",
      ),
      t("Đây là lý do phủ khe được xem là hướng mở rộng.", "This is why slot-die coating is seen as a scale-up route."),
      "line", 9, [82, 50],
      { final: true },
    ),
  ],
};

/* ───────── 4.6 market ───────── */

const MKT: StorySpec = {
  id: "market",
  scene: "sMkt",
  section: "4.6",
  group: "fab",
  brief: true,
  views: [t("Toàn cảnh", "Overview"), t("Thiết bị", "Device"), t("Chi tiết", "Detail")],
  title: t("4.6 Thị trường 2024–2026 — đường gần nhất là tandem", "4.6 Market 2024–2026 — The Nearest Path Is Tandem"),
  sentence: t(
    "Từ kỷ lục trong phòng thí nghiệm đến những bước thương mại đầu tiên: tế bào, module, chứng nhận, thông cáo và dự báo là những thứ khác nhau.",
    "From laboratory records to early commercial steps: cells, modules, certifications, announcements and forecasts are different things.",
  ),
  final: t(
    "Tandem perovskite/silicon là hướng tăng hiệu suất module đầy hứa hẹn, nhưng thương mại hóa còn cần sản phẩm bền, sản xuất mở rộng được, kiểm tra đáng tin cậy và quản lý chì có trách nhiệm.",
    "Perovskite/silicon tandem technology offers a promising route to increase module efficiency, but successful commercialization also requires durable products, scalable manufacturing, reliable testing, and responsible lead management.",
  ),
  qa: {
    q: t("Vì sao không so trực tiếp 35,2% và 29,4%?", "Why not compare 35.2% and 29.4% directly?"),
    a: t("Một là tế bào 1 cm², một là module khoảng 1,7 m².", "One is a 1 cm² cell, the other a module of about 1.7 m²."),
  },
  legend: [
    { swatch: "br", label: t("Lớp perovskite phía trên", "Perovskite top layer") },
    { swatch: "etl", label: t("Tế bào silicon phía dưới", "Silicon bottom cell") },
    { swatch: "sun", label: t("Ánh sáng mặt trời", "Sunlight") },
  ],
  options: "none",
  controls: [
    {
      kind: "seg",
      key: "scope",
      label: t("Kết quả", "Results"),
      def: "cell",
      at: [3],
      opts: [
        { v: "cell", label: t("Tế bào", "Cell results") },
        { v: "module", label: t("Module", "Module results") },
      ],
    },
  ],
  steps: [
    step(
      t("6/2024 · Oxford PV: module 26,9%", "June 2024 · Oxford PV: 26.9% module"),
      t(
        "Module tandem perovskite-trên-silicon 60 tế bào cỡ dân dụng, hiệu suất module 26,9% trên diện tích chỉ định hơn 1,6 m², được Fraunhofer CalLab đo và chứng nhận độc lập. Nhìn một tế bào, rồi trở lại cả module: hiệu suất tế bào và module không phải một con số.",
        "A 60-cell residential-size perovskite-on-silicon tandem module: 26.9% module efficiency over a designated area just over 1.6 m², independently measured and certified by Fraunhofer CalLab. Look into one cell, then back to the whole module: cell and module efficiency are not the same number.",
      ),
      t("Đây là kết quả MODULE được chứng nhận độc lập, ngày 19/6/2024.", "A MODULE result, independently certified, dated 19 June 2024."),
      "w", 12, [85, 61],
    ),
    step(
      t("4/2025 · LONGi: tế bào 34,85%", "April 2025 · LONGi: 34.85% cell"),
      t(
        "Tế bào tandem silicon/perovskite trong phòng thí nghiệm: ánh sáng đến lớp perovskite phía trên rồi đến tế bào silicon phía dưới. Hai lớp dùng phần khác nhau của phổ mặt trời nên lý thuyết có thể vượt hiệu suất của pin một lớp. LONGi nói kết quả được NREL chứng nhận.",
        "A laboratory silicon/perovskite tandem cell: sunlight reaches the perovskite top cell and then the silicon bottom cell. The two absorbers use different parts of the solar spectrum, so the theoretical efficiency can exceed a single-junction device. LONGi states NREL certified the result.",
      ),
      t("Đây là kết quả TẾ BÀO (công bố của công ty), không phải module.", "A CELL result (company announcement), not a module result."),
      "dev", 12, [86, 4],
    ),
    step(
      t("7/2025 · Caelux: lô kính đầu tiên", "July 2025 · Caelux: first glass shipment"),
      t(
        "Caelux (8/7/2025) giao lô thương mại đầu tiên của Active Glass: kính phủ perovskite ghép với module silicon thành tandem lai. Kính đi qua trạm phủ, rồi vào dây chuyền lắp ráp. Một lô giao hàng không chứng minh sản xuất hàng loạt, hiệu suất module được chứng nhận hay độ bền ngoài trời.",
        "Caelux (8 July 2025) shipped the first commercial order of Active Glass: perovskite-coated glass paired with a silicon module as a hybrid tandem. The glass passes a coating station, then an assembly line. One shipment does not prove mass production, certified module efficiency or outdoor durability.",
      ),
      t("Một mốc giao hàng, không phải sản xuất đại trà.", "A shipment milestone, not mass manufacturing."),
      "line", 14, [87, 62],
    ),
    step(
      t("2026 · Mốc tham chiếu", "2026 · Current reference benchmarks"),
      t(
        "Bảng hiệu suất Version 68: 28,0% cho tế bào perovskite chì halide nhỏ 0,05 cm²; 35,2% cho tế bào tandem Si/perovskite 1 cm²; 29,4% cho module tandem khoảng 1,7 m². Ba vật thể khác hẳn về cỡ. Chuyển giữa Tế bào và Module.",
        "Efficiency Tables Version 68: 28.0% for a small 0.05 cm² lead-halide perovskite cell; 35.2% for a 1 cm² perovskite/silicon tandem cell; 29.4% for a tandem module of about 1.7 m². Three very different objects. Switch between Cell and Module results.",
      ),
      t("Không so trực tiếp 29,4% (module) với 35,2% (tế bào 1 cm²).", "Do not compare 29.4% (module) directly with 35.2% (1 cm² cell)."),
      "bench", 14, [2, 100, 89, 90],
    ),
    step(
      t("7/2026 · LONGi công bố 35,5%", "July 2026 · LONGi announces 35.5%"),
      t(
        "LONGi công bố 35,5% cho tế bào tandem silicon/perovskite (14/7/2026, đăng 15/7) và nói ESTI đã chứng nhận. Con số này sau thời điểm chốt dữ liệu của Version 68 nên chưa có trong bảng đó. Vắng trong bảng không có nghĩa là “chưa được chứng nhận”.",
        "LONGi announced 35.5% for a silicon/perovskite tandem cell (14 July 2026, published 15 July) and states ESTI certified it. It came after the Version 68 data cutoff, so it is not in that table. Being absent from the table does not mean “uncertified”.",
      ),
      t("Công bố của công ty ≠ chứng nhận ≠ có trong bảng tham chiếu.", "Company announcement ≠ certification ≠ inclusion in a reference table."),
      "cmp", 12, [88, 5, 2],
    ),
    step(
      t("Vì sao tandem là con đường công nghiệp gần nhất", "Why tandem is the nearest industrial path"),
      t(
        "Thêm một lớp perovskite mỏng (hoặc kính phủ perovskite) lên silicon sẵn có: module silicon điển hình khoảng 22–24% so với mục tiêu tandem gần 30% (giá trị đại diện/mục tiêu, không phải đảm bảo). Rào cản: độ bền ngoài trời, độ ẩm, nhiệt, ánh sáng, UV, năng suất, phủ diện rộng, bọc kín, kiểm soát rò chì, tái chế, chi phí.",
        "Add a thin perovskite absorber (or perovskite-coated glass) onto existing silicon: typical silicon modules at about 22–24% versus a tandem target approaching 30% (representative/target values, not a guarantee). Hurdles: outdoor stability, moisture, heat, light, UV, yield, large-area coating, encapsulation, lead-leakage control, recycling, cost.",
      ),
      t("Dây chuyền silicon vẫn cần thiết bị, quy trình và kiểm chứng độ tin cậy mới.", "Silicon lines would still need new equipment, process changes and reliability validation."),
      "tandem", 16, [91, 92, 63],
      { final: true },
    ),
  ],
};

/* ───────── 4.9 lead ───────── */

const LEAD_A: StorySpec = {
  id: "lead",
  scene: "sLeadA",
  section: "4.9 · A",
  group: "fab",
  views: [t("Toàn cảnh", "Overview"), t("Mạng tinh thể", "Lattice"), t("Nguyên tử", "Atoms")],
  title: t("4.9 A · So sánh bốn họ vật liệu hấp thụ", "4.9 A · Four absorber families compared"),
  sentence: t(
    "Chì giúp perovskite đạt hiệu suất cao nhưng gây lo ngại; các lựa chọn thay thế cũng có đánh đổi.",
    "Lead helps perovskites reach high efficiency but raises concerns; each alternative has its own trade-offs.",
  ),
  final: t(
    "Không có lựa chọn nào thay thế chì mà không đánh đổi; cần xét hiệu suất, độ bền và vòng đời đầy đủ.",
    "No option replaces lead without trade-offs; efficiency, stability and the full life cycle must all be weighed.",
  ),
  qa: {
    q: t("Sn–Pb có phải không chì?", "Is mixed Sn–Pb lead-free?"),
    a: t("Không. Nó giảm lượng chì nhưng vẫn chứa chì.", "No. It reduces lead but still contains lead."),
  },
  legend: [
    { swatch: "lead", label: t("Pb", "Pb") },
    { swatch: "tin", label: t("Sn", "Sn") },
    { swatch: "iodine", label: t("Halide", "Halide") },
  ],
  options: "none",
  controls: [
    {
      kind: "seg",
      key: "dmg",
      label: t("Tình huống", "Scenario"),
      def: "ok",
      at: [1],
      opts: [
        { v: "ok", label: t("Linh kiện nguyên vẹn", "Intact device") },
        { v: "wet", label: t("Hỏng + nước vào", "Damaged + water ingress") },
      ],
    },
    slider("ox", t("Mức oxy hóa Sn²⁺ → Sn⁴⁺ (sơ đồ)", "Sn²⁺ → Sn⁴⁺ oxidation (schematic)"), t("sạch", "clean"), t("oxy hóa nhiều", "more oxidized"), 0, [3]),
    {
      kind: "seg",
      key: "pick",
      label: t("Chọn họ vật liệu", "Pick a family"),
      def: "pb",
      at: [5],
      opts: [
        { v: "pb", label: "Pb" },
        { v: "snpb", label: "Sn–Pb" },
        { v: "sn", label: "Sn" },
        { v: "dbl", label: "Cs₂AgBiBr₆" },
      ],
    },
  ],
  steps: [
    step(
      t("Bốn họ vật liệu", "Four families"),
      t(
        "Bốn mạng tinh thể cạnh nhau: perovskite chì halide, hỗn hợp Sn–Pb, chỉ thiếc, và perovskite kép Cs₂AgBiBr₆. Màu cho thấy kim loại ở vị trí B.",
        "Four lattices side by side: lead-halide perovskite, mixed Sn–Pb, tin-only, and the double perovskite Cs₂AgBiBr₆. Colour shows the metal on the B-site.",
      ),
      t("Câu hỏi không chỉ là “có chì hay không” mà là cái giá của từng lựa chọn.", "The question is not only “lead or not” but what each choice costs."),
      "1", 8, [96, 97, 98],
    ),
    step(
      t("Perovskite chì halide", "Lead-halide perovskite"),
      t(
        "Đã phát triển cao và đạt một số kỷ lục hiệu suất pin perovskite và tandem perovskite/silicon. Chì trong lớp hấp thụ có thể gây rủi ro sức khỏe và môi trường nếu linh kiện hỏng làm vật liệu chứa chì thoát ra, hoặc chất thải xử lý kém. Hiệu suất cao không thay thế đánh giá rò rỉ, tuổi thọ và tái chế. Thử tình huống “Hỏng + nước vào”.",
        "Highly developed, with some of the strongest perovskite-cell and perovskite/silicon tandem records. The lead in the absorber is a potential health and environmental risk if a damaged device lets lead-containing material escape or if waste is handled poorly. High efficiency does not remove the need for leakage, lifetime and recycling assessment. Try the “Damaged + water ingress” scenario.",
      ),
      t("Hiệu suất cao và rủi ro chì cùng tồn tại; cả hai phải được quản lý.", "High efficiency and lead risk exist together; both must be managed."),
      "pb", 10, [93, 94, 2],
      { info: t("⚠ Cảnh báo: cảnh “hỏng + nước vào” chỉ là minh họa khái niệm.", "⚠ Warning: the “damaged + water ingress” scene is a conceptual illustration.") },
    ),
    step(
      t("Hỗn hợp Sn–Pb", "Mixed Sn–Pb"),
      t(
        "Một phần chì được thay bằng thiếc. Theo tài liệu dẫn, một số thành phần giảm khoảng 50–60% lượng chì so với thành phần toàn chì. Vật liệu này vẫn chứa chì, và Sn²⁺ có thể oxy hóa thành Sn⁴⁺ tạo thêm khuyết tật.",
        "Part of the lead is replaced by tin. In the cited literature, selected compositions have roughly 50–60% less lead than comparable all-lead ones. They still contain lead, and Sn²⁺ can oxidize into Sn⁴⁺, creating more defects.",
      ),
      t("Giảm chì không phải là không chì.", "Less lead is not no lead."),
      "snpb", 9, [96],
    ),
    step(
      t("Perovskite chỉ thiếc", "Tin-only perovskite"),
      t(
        "Loại bỏ chì khỏi lớp hấp thụ. Nhưng Sn²⁺ dễ oxy hóa thành Sn⁴⁺, sinh khuyết tật, màng kém, vận hành kém ổn định. Kéo thanh trượt để xem sơ đồ oxy hóa: không phải mọi nguyên tử thiếc oxy hóa cùng lúc.",
        "Removes lead from the absorber. But Sn²⁺ oxidizes easily into Sn⁴⁺, producing defects, weaker films and less stable operation. Drag the slider for a schematic of oxidation: not every tin atom oxidizes at once.",
      ),
      t("Hướng nghiên cứu quan trọng, chưa phải vật liệu thay thế “lắp vào là chạy”.", "An important research direction, not a drop-in replacement."),
      "sn", 10, [97, 96],
      { info: t("Sơ đồ đơn giản hóa; hình phạt hiệu suất chỉ mang tính khái niệm.", "Simplified schematic; the performance penalty is conceptual.") },
    ),
    step(
      t("Perovskite kép Cs₂AgBiBr₆", "Double perovskite Cs₂AgBiBr₆"),
      t(
        "Vô cơ, không chì: gồm cesium, bạc, bismuth và bromide. Bỏ chì loại bỏ đúng mối lo về chì nhưng không tự làm mọi thành phần vô hại với môi trường. Vùng cấm gián tiếp tương đối rộng hạn chế hấp thụ ánh sáng; hiệu suất pin nghiên cứu còn xa perovskite chì hàng đầu.",
        "All-inorganic and lead-free: cesium, silver, bismuth and bromide. Removing lead removes the specific lead concern but does not make every component environmentally free. A relatively wide indirect bandgap limits light harvesting; research-cell performance is far behind leading lead-halide perovskites.",
      ),
      t("Cấu trúc băng năng lượng khác nghĩa là bắt ánh sáng kém hơn.", "A different band structure means weaker light harvesting."),
      "dbl", 10, [98, 99],
    ),
    step(
      t("Bảng so sánh định tính", "Qualitative comparison"),
      t(
        "Chọn một họ vật liệu để xem hàng của nó. Đây là bảng định tính, không thay cho chuẩn so sánh theo tài liệu.",
        "Pick a family to highlight its column. This table is qualitative, not a literature-backed benchmark.",
      ),
      t("So các chiều khác nhau thay vì chỉ một con số hiệu suất.", "Compare across several dimensions, not one efficiency number."),
      "1", 12, [96, 97, 98, 99, 93],
      { final: true },
    ),
  ],
};

const LEAD_B: StorySpec = {
  id: "leadmit",
  scene: "sLeadB",
  section: "4.9 · B",
  group: "fab",
  views: [t("Module", "Module"), t("Lớp bảo vệ", "Protection"), t("Chi tiết", "Detail")],
  title: t("4.9 B · Làm gì ngay bây giờ để giảm rủi ro chì", "4.9 B · What can be done now to reduce lead risk"),
  sentence: t(
    "Năm chiến lược bổ trợ nhau: bọc kín, giữ chì, thiết kế tự lành, kiểm soát nhà máy, thu gom và tái chế.",
    "Five complementary strategies: encapsulation, lead capture, self-healing designs, factory containment, and collection and recycling.",
  ),
  final: t(
    "Quản lý chì là vấn đề của cả hệ thống.",
    "Lead management is a system-level problem.",
  ),
  qa: {
    q: t("Cố định chì có làm chì biến mất không?", "Does lead immobilization make the lead disappear?"),
    a: t("Không. Nó giảm độ linh động và sự giải phóng, nhưng vẫn là vật liệu chứa chì.", "No. It reduces mobility and release, but it is still lead-containing material."),
  },
  legend: [
    { swatch: "lead", label: t("Chất chứa chì", "Lead-containing species") },
    { swatch: "water", label: t("Nước", "Water") },
    { swatch: "good", label: t("Lớp giữ chì", "Lead-capture layer") },
  ],
  options: "none",
  controls: [
    {
      kind: "seg",
      key: "prot",
      label: t("Mức bảo vệ", "Protection level"),
      def: "enc",
      at: [1],
      opts: [
        { v: "enc", label: t("Bọc kín", "Encapsulation") },
        { v: "cap", label: t("+ Giữ chì", "+ Lead capture") },
        { v: "heal", label: t("+ Tự lành", "+ Self-healing") },
      ],
    },
  ],
  steps: [
    step(
      t("Các lớp của module", "Layers of the module"),
      t(
        "Kính trước, chất bọc (encapsulant), linh kiện chứa perovskite, lớp chắn hoặc kính sau, viền kín, và một lớp giữ chì tùy chọn.",
        "Front glass, encapsulant, the perovskite device, a rear barrier or glass, an edge seal, and an optional lead-sequestering layer.",
      ),
      t("Mỗi lớp là một rào chắn giữa chì và môi trường.", "Each layer is a barrier between the lead and the environment."),
      "1", 8, [94, 93],
    ),
    step(
      t("Chiến lược 1 · Bọc kín vật lý", "Strategy 1 · Physical encapsulation"),
      t(
        "Kính, chất bọc và viền kín ngăn nước vào và vật liệu thoát ra. Mưa rơi bên ngoài nhưng không tới lớp hấp thụ. Rồi một vết nứt: độ nguyên vẹn và độ bền quyết định. Bọc kín tốt giảm khả năng phơi nhiễm, nhưng không đảm bảo không rò rỉ suốt đời mọi module.",
        "Glass, encapsulant and edge seals keep water out and material in. Rain falls outside but does not reach the absorber. Then a crack: integrity and durability decide. Good encapsulation lowers the chance of exposure but does not guarantee zero leakage over the life of every module.",
      ),
      t("Rào chắn chỉ tốt khi còn nguyên vẹn.", "A barrier only works while it stays intact."),
      "2", 12, [94, 95],
    ),
    step(
      t("Chiến lược 2 · Giữ và cố định chì", "Strategy 2 · Lead capture and immobilization"),
      t(
        "Dù linh kiện hỏng, chất chứa chì có thể bị giữ hoặc cố định hóa học. Không có lớp giữ chì: nước vào, chì chứa trong chất lỏng di chuyển ra ngoài. Có lớp giữ chì: chúng tới lớp này và bị liên kết, giảm độ linh động. Đây là các cách đã công bố trong nghiên cứu (tạo phức, lớp giữ, hợp chất phosphate, hấp phụ), không phải tiêu chuẩn công nghiệp.",
        "Even if a device is damaged, lead-containing species can be captured or chemically immobilized. Without capture: water enters and lead-containing species move away. With capture: they reach the capture layer and are bound, reducing mobility. These are published research approaches (complexation, capture layers, phosphate-based management, adsorbents), not standard industrial practice.",
      ),
      t("Giữ lại không phải làm biến mất: chì vẫn cần được xử lý có trách nhiệm.", "Captured is not gone: the lead still has to be handled responsibly."),
      "cmp", 13, [93, 94],
      { info: t("Cố định chì giảm độ linh động và sự giải phóng của chất chứa chì; không loại bỏ mọi rủi ro liên quan đến chì.", "Lead immobilization reduces the mobility and release of lead-containing species; it does not remove all lead-related risk.") },
    ),
    step(
      t("Chiến lược 3 · Thiết kế chịu hỏng, tự lành", "Strategy 3 · Damage-resistant, self-healing designs"),
      t(
        "Một vết nứt trong lớp bọc. Với polymer tự lành (minh họa khái niệm của một hướng đã công bố), lớp bọc có thể phục hồi một phần chức năng chắn. Không phải mọi lớp bọc đều lành mọi vết nứt thật.",
        "A crack in the encapsulating layer. With a self-healing polymer (a conceptual illustration of a published approach) the barrier can recover part of its protective function. Not every encapsulant heals every real crack.",
      ),
      t("Giảm lượng chì rò ra từ module hỏng là mục tiêu của hướng này.", "Cutting leakage from damaged modules is the goal of this approach."),
      "3", 11, [95],
      { info: t("Minh họa khái niệm của một hướng nghiên cứu đã công bố.", "Conceptual illustration of a published research approach.") },
    ),
    step(
      t("Chiến lược 4 · Kiểm soát chì trong nhà máy", "Strategy 4 · Factory containment and testing"),
      t(
        "Cảnh nhà máy riêng: thu gom chất thải chứa chì, giữ vật liệu nhiễm trong thùng kín, xử lý nước thải thích hợp, dán nhãn và chuyển chất thải có kiểm soát. Kiểm soát chất thải nhà máy và phơi nhiễm của công nhân là việc khác với ngăn rò rỉ từ module hoàn chỉnh.",
        "A separate factory scene: collecting lead-containing process waste, containing contaminated materials, handling wastewater properly, labelling and controlled waste transfer. Controlling factory waste and worker exposure is separate from preventing leakage from a finished module.",
      ),
      t("Rủi ro chì bắt đầu từ nhà máy, không chỉ khi pin ra ngoài trời.", "Lead risk starts in the factory, not only when panels are outdoors."),
      "fact", 12, [94],
    ),
    step(
      t("Chiến lược 5 · Thu gom cuối đời và tái chế", "Strategy 5 · End-of-life collection and recycling"),
      t(
        "Module cũ hoặc hỏng đi vào quy trình: thu gom → tháo dỡ có kiểm soát → thu hồi vật liệu dùng lại → phần chứa chì chuyển đi thu hồi/xử lý thích hợp. Tái chế được thiết kế tốt có thể thu hồi thành phần có giá trị và giảm rủi ro. Đập vỡ không kiểm soát, đổ bỏ hay xả vào nước thải thường không phải cách thải bỏ chấp nhận được.",
        "An old or damaged module enters the workflow: collection → controlled dismantling → recovery of reusable materials → the lead-containing fraction sent for appropriate recovery or handling. Properly engineered recycling can recover valuable parts and reduce risk. Uncontrolled breakage, dumping or discharge into ordinary wastewater is not acceptable disposal.",
      ),
      t("Vòng đời kết thúc có kế hoạch là một phần của an toàn.", "A planned end of life is part of safety."),
      "recy", 13, [94],
    ),
    step(
      t("Tổng hợp", "Putting it together"),
      t(
        "Bọc kín, giữ chì, thiết kế tự lành, kiểm soát nhà máy, thu gom và tái chế bổ trợ cho nhau. Không biện pháp nào đứng một mình.",
        "Encapsulation, capture, self-healing, factory control, collection and recycling complement one another. No measure stands alone.",
      ),
      t("An toàn là kết quả của cả hệ thống.", "Safety comes from the whole system."),
      "1", 8, [94, 93],
      { final: true },
    ),
  ],
};

const LEAD_C: StorySpec = {
  id: "leadcmp",
  scene: "sLeadC",
  section: "4.9 · C",
  group: "fab",
  views: [t("Module", "Module"), t("Bên trong", "Inside"), t("Chi tiết", "Detail")],
  title: t("4.9 C · So sánh ba thiết kế bảo vệ", "4.9 C · Comparing three protection designs"),
  sentence: t(
    "Cùng một kịch bản mưa và hư hỏng, ba thiết kế phản ứng khác nhau.",
    "The same rain-and-damage scenario, three designs, three different outcomes.",
  ),
  final: t(
    "Quản lý chì là vấn đề của cả hệ thống: chọn thành phần, thiết kế bảo vệ, thử rò rỉ có kiểm chứng, kiểm soát nhà máy, thu gom và tái chế phải đi cùng nhau.",
    "Lead management is a system-level problem. Composition choices, protective design, validated leakage testing, factory controls, collection, and recycling work together.",
  ),
  qa: {
    q: t("Có thể nói “không rò rỉ” không?", "Can we say “zero leakage”?"),
    a: t("Chỉ khi một thử nghiệm đã công bố chứng minh điều đó cho đúng thiết kế ấy.", "Only if a published test supports it for that exact design."),
  },
  legend: [
    { swatch: "water", label: t("Nước", "Water") },
    { swatch: "lead", label: t("Chất chứa chì", "Lead-containing species") },
    { swatch: "good", label: t("Lớp giữ chì", "Lead-capture layer") },
  ],
  options: "none",
  controls: [
    {
      kind: "seg",
      key: "design",
      label: t("Thiết kế", "Design"),
      def: "1",
      opts: [
        { v: "1", label: t("1 · Bọc kín chuẩn", "1 · Standard encapsulation") },
        { v: "2", label: t("2 · + giữ chì", "2 · + lead capture") },
        { v: "3", label: t("3 · + giữ chì + kế hoạch cuối đời", "3 · + capture + end-of-life plan") },
      ],
    },
  ],
  steps: [
    step(
      t("Mưa ngoài module", "Rain outside the module"),
      t("Mưa rơi lên module. Chọn thiết kế ở dưới để so sánh.", "Rain falls on the module. Choose a design below to compare."),
      t("Cùng một điều kiện cho cả ba thiết kế thì mới so sánh công bằng.", "Identical conditions are what make the comparison fair."),
      "1", 7, [94],
    ),
    step(
      t("Nước có tới lớp hấp thụ không?", "Does water reach the absorber?"),
      t("Quan sát viền và lớp bọc: với bọc kín nguyên vẹn, nước bị chặn.", "Watch the edge and encapsulant: with an intact encapsulation, water is blocked."),
      t("Bước đầu của mọi chuỗi rò rỉ là nước tới được lớp hấp thụ.", "The first link in any leakage chain is water reaching the absorber."),
      "2", 8, [94, 95],
    ),
    step(
      t("Khi module bị nứt", "When the module cracks"),
      t("Một vết nứt mở ra. Thiết kế 1: chất chứa chì có thể thoát. Thiết kế 2 và 3: lớp giữ chì liên kết chúng, giảm độ linh động.", "A crack opens. Design 1: lead-containing species can escape. Designs 2 and 3: the capture layer binds them, reducing their mobility."),
      t("Hỏng hóc là chuyện cần chuẩn bị, không phải chuyện hiếm đến mức bỏ qua.", "Damage is something to plan for, not too rare to consider."),
      "3", 11, [93, 94],
    ),
    step(
      t("Hết vòng đời", "At end of life"),
      t("Thiết kế 3 có kế hoạch thu gom và tái chế. Ở thiết kế 1–2, chì vẫn tồn tại và cần được xử lý có trách nhiệm; kế hoạch cuối đời là thứ phân biệt.", "Design 3 comes with a collection and recycling plan. In designs 1–2 the lead still exists and must be handled responsibly; the end-of-life plan makes the difference."),
      t("Giữ chì lại không có nghĩa là chì biến mất.", "Captured lead has not disappeared."),
      "1", 8, [94],
    ),
    step(
      t("So sánh định tính", "Qualitative comparison"),
      t("Bảng định tính cho cả ba thiết kế. Không có số phần trăm rò rỉ được bịa ra; số liệu chỉ nên dùng khi có thử nghiệm đã công bố cho đúng thiết kế.", "A qualitative table for all three designs. No leakage percentages are invented; numbers belong only where a published test covers that exact design."),
      t("Chỉ báo định tính tránh hứa quá mức.", "Qualitative indicators avoid over-promising."),
      "1", 12, [93, 94, 95],
      { final: true },
    ),
  ],
};

export const STORIES4: StorySpec[] = [SPIN, TWO, VAC, CRY, QD, MKT, BLADE, SLOT, LEAD_A, LEAD_B, LEAD_C];

registerStories(STORIES4);

/* ───────── chapter overview and synthesis ───────── */

export type MethodCard = {
  id: string;
  num: string;
  icon: string;
  name: string;
  line: string;
  kind: string;
};

export const CATEGORY = {
  film: t("Phủ màng", "Film deposition"),
  crystal: t("Nuôi tinh thể", "Crystal growth"),
  nano: t("Tổng hợp vật liệu nano", "Nanomaterial synthesis"),
  scale: t("Mở rộng công nghiệp", "Industrial scale-up"),
  market: t("Thị trường", "Market"),
  safety: t("An toàn", "Safety"),
};

export const GROUPS: { title: string; cards: MethodCard[] }[] = [
  {
    title: t("Chuẩn bị trong phòng thí nghiệm và nuôi vật liệu", "Laboratory preparation and material growth"),
    cards: [
      { id: "spin", num: "4.1", icon: "🌀", name: t("Quay phủ", "Spin coating"), line: t("Trải chất lỏng bằng quay.", "Spread liquid by rotation."), kind: CATEGORY.film },
      { id: "twostep", num: "4.2", icon: "⚗️", name: t("Hai bước", "Two-step deposition"), line: t("Phủ tiền chất lần lượt rồi phản ứng.", "Sequential precursor coating and reaction."), kind: CATEGORY.film },
      { id: "vacuum", num: "4.3", icon: "🫧", name: t("Chân không", "Vacuum deposition"), line: t("Lắng đọng vật liệu từ hơi.", "Deposit material from vapor."), kind: CATEGORY.film },
      { id: "crystal", num: "4.4", icon: "💎", name: t("Đơn tinh thể", "Single-crystal growth"), line: t("Nuôi một tinh thể liên tục.", "Grow one continuous crystal."), kind: CATEGORY.crystal },
      { id: "qdot", num: "4.5", icon: "✨", name: t("Chấm lượng tử", "Quantum dots"), line: t("Tổng hợp nano tinh thể perovskite cực nhỏ.", "Synthesize tiny perovskite nanocrystals."), kind: CATEGORY.nano },
    ],
  },
  {
    title: t("Phủ công nghiệp và mở rộng", "Industrial coating and scale-up"),
    cards: [
      { id: "blade", num: "4.7", icon: "🔪", name: t("Dao gạt", "Blade coating"), line: t("Trải mực bằng lưỡi dao chuyển động.", "Spread ink with a moving blade."), kind: CATEGORY.scale },
      { id: "slot", num: "4.8", icon: "🏭", name: t("Phủ khe", "Slot-die coating"), line: t("Đẩy mực qua khe hẹp lên đế đang chạy.", "Meter ink through a narrow slot onto a moving substrate."), kind: CATEGORY.scale },
    ],
  },
  {
    title: t("Thị trường và bền vững", "Market and sustainability"),
    cards: [
      { id: "market", num: "4.6", icon: "📈", name: t("Thị trường 2024–2026", "Market 2024–2026"), line: t("Đường gần nhất là tandem.", "The nearest path is tandem."), kind: CATEGORY.market },
      { id: "lead", num: "4.9", icon: "🛡️", name: t("Chì và lựa chọn thay thế", "Lead, alternatives and safety"), line: t("So vật liệu và giảm rủi ro chì.", "Compare absorbers and reduce lead risk."), kind: CATEGORY.safety },
    ],
  },
];

export const C4_INTRO = {
  title: t("Chương 4 — Chế tạo, thị trường và an toàn chì", "Chapter 4 — Fabrication, market and lead safety"),
  body: t(
    "Chọn một phương pháp ở giữa màn hình. Mỗi phương pháp có mô hình 3D, từng bước, bảng thông tin và nguồn.",
    "Choose a method in the centre of the screen. Each has a 3D model, step-by-step explanation, a facts panel and sources.",
  ),
  sumTitle: t("Tổng kết chương 4", "Chapter 4 synthesis"),
  sumBody: t(
    "Ba bảng: cách chế tạo, thương mại hóa và trách nhiệm môi trường.",
    "Three panels: how perovskite is made, how close it is to the market, and environmental responsibility.",
  ),
};

export const LANDING = {
  lead: t(
    "Chọn một mục để học độc lập. Mỗi trang cho bạn thấy nguyên liệu, thiết bị, từng bước, vật liệu thu được và đánh đổi.",
    "Pick any section to learn on its own. Each page shows the materials, the equipment, every step, the resulting material and the trade-offs.",
  ),
  distinct: t(
    "Phân biệt quan trọng: màng mỏng, đơn tinh thể và chấm lượng tử không thay thế cho nhau.",
    "An important distinction: thin films, single crystals and quantum dots are not interchangeable.",
  ),
  notes: [
    t(
      "Phủ màng (4.1–4.3, 4.7, 4.8) tạo một lớp perovskite mỏng trên đế.",
      "Film deposition (4.1–4.3, 4.7, 4.8) forms a thin perovskite layer on a substrate.",
    ),
    t(
      "Nuôi tinh thể (4.4) tạo ra một tinh thể khối, không phải màng.",
      "Crystal growth (4.4) produces a bulk crystal, not a film.",
    ),
    t(
      "Tổng hợp nano (4.5) tạo nano tinh thể riêng lẻ; chúng có thể được phủ thành màng ở giai đoạn sau.",
      "Nanomaterial synthesis (4.5) produces individual nanocrystals that may later be deposited into a film.",
    ),
    t(
      "Mở rộng công nghiệp (4.7, 4.8) là cách phủ màng ướt cho diện tích lớn.",
      "Industrial scale-up (4.7, 4.8) are wet-coating routes for larger areas.",
    ),
  ],
  open: t("Mở", "Open"),
};

export const SUMMARY = {
  a: t("A · Perovskite có thể được chế tạo thế nào", "A · How perovskite can be fabricated"),
  b: t("B · Công nghệ và thương mại hóa", "B · Technology and commercialization"),
  c: t("C · Hiệu suất và trách nhiệm môi trường", "C · Efficiency and environmental responsibility"),
  routes: [
    { id: "spin", icon: "🌀", name: t("Quay phủ", "Spin coating"), line: t("Trải chất lỏng bằng quay.", "Spread liquid by rotation."), kind: t("Phòng thí nghiệm", "Laboratory") },
    { id: "twostep", icon: "⚗️", name: t("Hai bước", "Two-step deposition"), line: t("Phủ tiền chất lần lượt rồi phản ứng.", "Sequential precursor coating and reaction."), kind: t("Phòng thí nghiệm", "Laboratory") },
    { id: "vacuum", icon: "🫧", name: t("Chân không", "Vacuum deposition"), line: t("Lắng đọng vật liệu từ hơi.", "Deposit material from vapor."), kind: t("Phòng thí nghiệm / công nghiệp", "Laboratory / industrial") },
    { id: "crystal", icon: "💎", name: t("Đơn tinh thể", "Single-crystal growth"), line: t("Nuôi một tinh thể liên tục.", "Grow one continuous crystal."), kind: t("Nuôi vật liệu", "Material growth") },
    { id: "qdot", icon: "✨", name: t("Chấm lượng tử", "Quantum dots"), line: t("Tổng hợp nano tinh thể perovskite cực nhỏ.", "Synthesize tiny perovskite nanocrystals."), kind: t("Nuôi vật liệu", "Material growth") },
    { id: "blade", icon: "🔪", name: t("Dao gạt", "Blade coating"), line: t("Trải mực bằng lưỡi dao chuyển động.", "Spread ink with a moving blade."), kind: t("Phủ mở rộng", "Scalable coating") },
    { id: "slot", icon: "🏭", name: t("Phủ khe", "Slot-die coating"), line: t("Đẩy mực qua khe hẹp lên đế đang chạy.", "Meter ink through a narrow slot onto a moving substrate."), kind: t("Phủ mở rộng", "Scalable coating") },
  ],
  noBest: t("Không có phương pháp nào là “tốt nhất” cho mọi mục đích.", "No method is universally “the best”."),
  ladder: [
    { label: t("Tế bào perovskite nhỏ", "Small-area lab cell"), val: "28.0%", note: t("0,05 cm² · bảng Version 68", "0.05 cm² · Version 68 table"), kind: "table" },
    { label: t("Tế bào tandem", "Tandem cell"), val: "35.2%", note: t("1 cm² · bảng Version 68", "1 cm² · Version 68 table"), kind: "table" },
    { label: t("Tandem công bố của công ty", "Company-announced tandem cell"), val: "35.5%", note: t("LONGi, 7/2026 · công ty nói ESTI chứng nhận · chưa trong Version 68", "LONGi, Jul 2026 · company states ESTI certified · not in Version 68"), kind: "company" },
    { label: t("Module tandem cỡ lớn", "Large-area tandem module"), val: "29.4%", note: t("≈1,7 m² · bảng Version 68", "≈1.7 m² · Version 68 table"), kind: "table" },
    { label: t("Lô giao hàng thương mại đầu tiên", "Early commercial shipment"), val: "—", note: t("Caelux, 7/2025 · mốc giao hàng, không phải sản xuất hàng loạt", "Caelux, Jul 2025 · a shipment, not mass production"), kind: "company" },
    { label: t("Dự báo thị trường", "Market forecast"), val: "≈US$12B", note: t("IDTechEx, năm 2035 · dự báo, không phải doanh thu đã quan sát", "IDTechEx, by 2035 · forecast, not observed revenue"), kind: "forecast" },
  ],
  bnote: t(
    "Kết quả nghiên cứu, kết quả module, chứng nhận và triển khai thương mại là các sự thật khác nhau.",
    "Research results, module results, certification and commercial deployment are different facts.",
  ),
  cItems: [
    t("Perovskite chì dẫn đầu nhiều mốc hiệu suất nghiên cứu.", "Lead-based perovskites currently lead many high-efficiency research benchmarks."),
    t("Sn–Pb giảm nhưng không loại bỏ chì.", "Mixed Sn–Pb materials reduce but do not eliminate lead content."),
    t("Chỉ thiếc loại chì khỏi lớp hấp thụ nhưng gặp oxy hóa và độ ổn định.", "Tin-only materials remove Pb from the absorber but face oxidation and stability challenges."),
    t("Cs₂AgBiBr₆ là ứng viên không chì với giới hạn quang điện lớn.", "Cs₂AgBiBr₆ is a lead-free research candidate with substantial photovoltaic limits."),
    t("Bọc kín, cố định/giữ chì, thử rò rỉ chuẩn hóa, quản lý chất thải, thu gom và tái chế bổ trợ nhau.", "Encapsulation, immobilization/capture, standardized leakage testing, controlled waste management, collection and recycling are complementary."),
  ],
  closing: t(
    "Thành công thương mại không chỉ nhờ hiệu suất cao mà còn nhờ sản xuất diện tích lớn, hiệu năng đáng tin cậy, an toàn môi trường và quản lý cuối đời có trách nhiệm.",
    "Commercial success depends not only on high efficiency, but also on large-area manufacturing, reliable performance, environmental safety, and responsible end-of-life management.",
  ),
};

export type { Facts };
