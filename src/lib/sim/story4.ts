/**
 * Chapter 4 · Perovskite fabrication, market readiness and lead safety.
 * Same engine as sections 3.1 – 3.8: every text is a Vietnamese / English pair written once with `t()`.
 *
 *   4.1, 4.2    laboratory film deposition (spin coating, vacuum)
 *   4.3         industrial coating and scale-up (blade)
 *   4.4         market 2024 – 2026 (flat table page, market4.ts)
 *   4.5         lead and its alternatives (flat table page, lead4.ts)
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
    scale: t("Thường dùng cho mẫu nhỏ; lên diện tích lớn gặp thách thức thực tế nên có thêm các cách phủ khác (4.3).", "Mostly used for small samples; larger areas bring practical challenges, which is why other coating methods exist (4.3)."),
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

const VAC: StorySpec = {
  id: "vacuum",
  scene: "sVac",
  section: "4.2",
  group: "fab",
  microSwitch: true,
  views: [t("Buồng", "Chamber"), t("Đế", "Substrate"), t("Mặt cắt", "Cross-section")],
  title: t("4.2 Lắng đọng chân không", "4.2 Vacuum Deposition"),
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

const BLADE: StorySpec = {
  id: "blade",
  scene: "sBlade",
  section: "4.3",
  group: "fab",
  microSwitch: true,
  views: [t("Thiết bị", "Equipment"), t("Màng ướt", "Wet film"), t("Tinh thể", "Crystals")],
  title: t("4.3 Phủ dao gạt", "4.3 Blade Coating"),
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

export const STORIES4: StorySpec[] = [SPIN, VAC, BLADE];

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
  scale: t("Mở rộng công nghiệp", "Industrial scale-up"),
  market: t("Thị trường", "Market"),
  safety: t("An toàn", "Safety"),
};

export const GROUPS: { title: string; cards: MethodCard[] }[] = [
  {
    title: t("Chuẩn bị trong phòng thí nghiệm", "Laboratory preparation"),
    cards: [
      { id: "spin", num: "4.1", icon: "🌀", name: t("Quay phủ", "Spin coating"), line: t("Trải chất lỏng bằng quay.", "Spread liquid by rotation."), kind: CATEGORY.film },
      { id: "vacuum", num: "4.2", icon: "🫧", name: t("Chân không", "Vacuum deposition"), line: t("Lắng đọng vật liệu từ hơi.", "Deposit material from vapor."), kind: CATEGORY.film },
    ],
  },
  {
    title: t("Phủ công nghiệp và mở rộng", "Industrial coating and scale-up"),
    cards: [
      { id: "blade", num: "4.3", icon: "🔪", name: t("Dao gạt", "Blade coating"), line: t("Trải mực bằng lưỡi dao chuyển động.", "Spread ink with a moving blade."), kind: CATEGORY.scale },
    ],
  },
  {
    title: t("Thị trường và bền vững", "Market and sustainability"),
    cards: [
      { id: "market", num: "4.4", icon: "📈", name: t("Thị trường 2024–2026", "Market 2024–2026"), line: t("Đường gần nhất là tandem.", "The nearest path is tandem."), kind: CATEGORY.market },
      { id: "lead", num: "4.5", icon: "🛡️", name: t("Chì và lựa chọn thay thế", "Lead, alternatives and safety"), line: t("Bốn họ vật liệu, một bảng.", "Four families, one table."), kind: CATEGORY.safety },
    ],
  },
];

export const C4_INTRO = {
  title: t("Chương 4 — Chế tạo, thị trường và an toàn chì", "Chapter 4 — Fabrication, market and lead safety"),
  body: t(
    "Chọn một mục ở giữa màn hình. Mỗi mục có mô hình 3D, từng bước, bảng thông tin và nguồn.",
    "Choose a section in the centre of the screen. Each has a 3D model, step-by-step explanation, a facts panel and sources.",
  ),
};

export const LANDING = {
  lead: t(
    "Chọn một mục để học độc lập: cách chế tạo, mở rộng quy mô, thị trường và an toàn chì.",
    "Pick any section to learn on its own: how it is made, how it scales, the market and lead safety.",
  ),
  open: t("Mở", "Open"),
};

export type { Facts };
