import type { Tune } from "./types";

export type NoteKind = "base" | "warn" | "idea";

export type Step = {
  title: string;
  body: string;
  /** Extra concrete explanation shown under the main paragraph. */
  more?: string;
  /** Full figure caption for the 3D view, chart, or table on this step. */
  caption?: string;
  note?: { kind: NoteKind; title: string; text: string };
};

export type Swatch =
  | "iodine"
  | "lead"
  | "tin"
  | "ma"
  | "fa"
  | "cs"
  | "br"
  | "cl"
  | "electron"
  | "hole"
  | "sun"
  | "etl"
  | "htl"
  | "good"
  | "warn"
  | "oxide"
  | "metal";

export type ControlKind =
  | "wavelength"
  | "iv"
  | "cation"
  | "bromide"
  | "sn"
  | "temperature"
  | "lifetime"
  | "plqy"
  | "enemy"
  | "explode"
  | "eg"
  | "nwell"
  | "architecture"
  | "light";

export type Lesson = {
  id: string;
  chapter: string;
  section: string;
  title: string;
  scene: string;
  cam: "default" | "crystal" | "wide" | "plot" | "stack";
  legend?: { swatch: Swatch; label: string }[];
  controls?: ControlKind[];
  tune?: Tune[];
  steps: Step[];
};

export type Chapter = {
  id: string;
  num: string;
  title: string;
  lessonIds: string[];
};

const base = (
  text: string,
): Step["note"] => ({ kind: "base", title: "Kiến thức nền", text });
const warn = (text: string): Step["note"] => ({ kind: "warn", title: "Lưu ý", text });
const idea = (text: string): Step["note"] => ({
  kind: "idea",
  title: "Giả thuyết, chưa phải kết quả",
  text,
});

export const lessons: Lesson[] = [
  {
    id: "intro",
    chapter: "c0",
    section: "Mở đầu",
    title: "Nắng 1000 W/m² — điểm xuất phát",
    scene: "sun",
    cam: "wide",
    legend: [
      { swatch: "sun", label: "Photon mặt trời" },
      { swatch: "iodine", label: "Tấm pin" },
    ],
    steps: [
      {
        title: "Nắng gắt mang khoảng 1000 W/m²",
        body: "Mỗi giây, khi trời quang, Mặt Trời gửi tới mỗi mét vuông mặt đất khoảng 1000 oát năng lượng ánh sáng. Pin mặt trời biến một phần năng lượng đó trực tiếp thành điện.",
      },
      {
        title: "Không máy, không nhiên liệu",
        body: "Pin mặt trời (solar cell) không cần bộ phận chuyển động và không đốt nhiên liệu. Muốn hiểu vì sao perovskite được chú ý, trước hết phải thấy pin đòi hỏi gì ở vật liệu hấp thụ.",
      },
      {
        title: "Cách đọc phòng thí nghiệm này",
        body: "Mỗi mục đi từ trực giác, tới khái niệm, rồi con số. Bật «Giải thích từng bước» để đọc lời dẫn; tắt đi để chỉ xem mô hình. Kéo để xoay, cuộn để phóng.",
        note: base(
          "Hộp này là kiến thức nền — ion, electron-vôn, vùng năng lượng. Hộp cam là chỗ số liệu cần dè chừng. Số trong ngoặc vuông trỏ tới phụ lục tài liệu.",
        ),
      },
    ],
  },
  {
    id: "foundation",
    chapter: "c1",
    section: "1 · nền",
    title: "Hạt mang điện: nguyên tử, ion, eV",
    scene: "foundation",
    cam: "default",
    legend: [
      { swatch: "electron", label: "Điện tử" },
      { swatch: "hole", label: "Hạt nhân / ion dương" },
      { swatch: "iodine", label: "Ion âm" },
    ],
    steps: [
      {
        title: "Nguyên tử",
        body: "Mọi chất được tạo từ nguyên tử (atom): hạt nhân mang điện dương và các điện tử (electron) mang điện âm quay quanh.",
        note: base("Phần này giải thích từ vựng. Nếu bạn đã biết, nhảy sang mục photon."),
      },
      {
        title: "Mất điện tử thì thành cation",
        body: "Khi nguyên tử mất điện tử, nó thành ion dương (cation). Pb²⁺ là chì đã mất 2 điện tử. Khi nhận thêm điện tử, nó thành ion âm (anion), ví dụ I⁻.",
      },
      {
        title: "Dòng điện là dòng hạt mang điện",
        body: "Dòng điện (electric current) chỉ là các hạt mang điện chuyển động có hướng. Trong pin, đó là điện tử đi một chiều và lỗ trống đi chiều kia.",
      },
      {
        title: "Electron-vôn",
        body: "Năng lượng ở thang nguyên tử đo bằng electron-vôn (eV): năng lượng một điện tử nhận được khi đi qua hiệu điện thế 1 vôn. 1 meV = 0,001 eV.",
      },
    ],
  },
  {
    id: "photon",
    chapter: "c1",
    section: "1.1",
    title: "Photon — gói năng lượng của ánh sáng",
    scene: "photon",
    cam: "wide",
    controls: ["wavelength"],
    tune: [{ wavelength: 500 }, { wavelength: 700 }, { wavelength: 1100 }, { wavelength: 550 }],
    legend: [{ swatch: "sun", label: "Photon" }],
    steps: [
      {
        title: "Sóng, và cũng là hạt",
        body: "Ánh sáng là dòng các hạt năng lượng gọi là photon. Năng lượng mỗi photon phụ thuộc màu, tức bước sóng: xanh tím mang nhiều năng lượng hơn đỏ.",
      },
      {
        title: "Công thức tiện dụng",
        body: "E (eV) ≈ 1240 / λ (nm). Ánh sáng lục 500 nm ≈ 2,48 eV. Đỏ 700 nm ≈ 1,77 eV. Hồng ngoại gần 1100 nm ≈ 1,13 eV.",
      },
      {
        title: "Phổ mặt trời trải rất rộng",
        body: "Phổ mặt trời đi từ tử ngoại, qua vùng nhìn thấy, tới hồng ngoại. Gần một nửa năng lượng nằm ở hồng ngoại — nơi nhiều vật liệu hấp thụ bỏ qua.",
      },
      {
        title: "Tự kéo bước sóng",
        body: "Thanh trượt đổi màu và năng lượng của photon. So sánh một gói xanh với một gói hồng ngoại trước khi sang vùng cấm.",
      },
    ],
  },
  {
    id: "bands",
    chapter: "c1",
    section: "1.2",
    title: "Vùng cấm — bậc thang điện tử phải nhảy",
    scene: "bands",
    cam: "default",
    legend: [
      { swatch: "htl", label: "Vùng hóa trị" },
      { swatch: "electron", label: "Vùng dẫn" },
      { swatch: "sun", label: "Vùng cấm Eg" },
    ],
    steps: [
      {
        title: "Tòa nhà hai tầng",
        body: "Trong chất rắn, điện tử chỉ được nằm trong những dải năng lượng cho phép. Hãy hình dung một tòa nhà hai tầng.",
      },
      {
        title: "Tầng dưới chật kín",
        body: "Vùng hóa trị (valence band) chật điện tử. Chúng bị giữ trong liên kết hóa học nên không dẫn điện.",
      },
      {
        title: "Tầng trên gần như trống",
        body: "Vùng dẫn (conduction band) gần như trống. Điện tử lên được đây thì tự do di chuyển và dẫn điện.",
      },
      {
        title: "Khoảng giữa là vùng cấm",
        body: "Vùng cấm (bandgap, Eg) không có bậc thang. Điện tử muốn lên tầng trên phải nhận ít nhất một năng lượng bằng Eg.",
      },
      {
        title: "Kim loại, cách điện, bán dẫn",
        body: "Kim loại không có vùng cấm. Chất cách điện có Eg trên khoảng 4 eV, ánh sáng thường không đủ kích thích. Bán dẫn có Eg khoảng 0,5–3 eV, đúng cỡ photon mặt trời. Mọi pin mặt trời đều dùng chất bán dẫn.",
      },
    ],
  },
  {
    id: "cell",
    chapter: "c1",
    section: "1.3",
    title: "Bốn bước của pin: hấp thụ, sinh cặp, tách, thu",
    scene: "cell",
    cam: "stack",
    legend: [
      { swatch: "sun", label: "Photon" },
      { swatch: "electron", label: "Điện tử" },
      { swatch: "hole", label: "Lỗ trống" },
      { swatch: "etl", label: "ETL" },
      { swatch: "htl", label: "HTL" },
    ],
    steps: [
      {
        title: "Bước 1 — Hấp thụ",
        body: "Photon có năng lượng lớn hơn hoặc bằng Eg bị vật liệu nuốt. Photon yếu hơn Eg đi xuyên qua và bị lãng phí.",
      },
      {
        title: "Bước 2 — Sinh cặp điện tử–lỗ trống",
        body: "Điện tử nhảy lên vùng dẫn, để lại một chỗ trống ở vùng hóa trị. Chỗ trống hành xử như hạt mang điện dương: lỗ trống (hole). Năng lượng dư của photon nhanh chóng thành nhiệt — tổn thất nhiệt hóa (thermalization).",
      },
      {
        title: "Bước 3 — Tách trước khi tái hợp",
        body: "Điện tử và lỗ trống hút nhau. Nếu gặp lại, năng lượng mất thành nhiệt hoặc ánh sáng: tái hợp (recombination). Pin silicon dùng tiếp giáp p-n. Pin perovskite dùng hai lớp chọn lọc: ETL chỉ cho điện tử qua, HTL chỉ cho lỗ trống qua.",
      },
      {
        title: "Bước 4 — Thu vào mạch ngoài",
        body: "Điện tử tới một điện cực, lỗ trống tới điện cực kia. Nối qua một bóng đèn, điện tử chạy mạch ngoài để gặp lại lỗ trống — đó là dòng điện có ích.",
      },
    ],
  },
  {
    id: "metrics",
    chapter: "c1",
    section: "1.4",
    title: "Bốn số đo của pin: Voc, Jsc, FF, hiệu suất",
    scene: "metrics",
    cam: "plot",
    controls: ["iv"],
    tune: [{ voc: 1.19, jsc: 25.8, ff: 0.86 }],
    steps: [
      {
        title: "Điện áp hở mạch Voc",
        body: "Voc là điện áp lớn nhất khi không lấy dòng. Nó phụ thuộc Eg và mức độ tái hợp. Pin perovskite tốt thường khoảng 1,15–1,20 V.",
        caption: "Đường dòng–áp. Trục ngang là điện áp, trục dọc là dòng trên mỗi cm². Voc nằm trên trục điện áp khi dòng bằng không.",
      },
      {
        title: "Dòng ngắn mạch Jsc",
        body: "Jsc là dòng lớn nhất trên mỗi cm² khi nối tắt hai cực. Nó phụ thuộc số photon bị hấp thụ. Mức điển hình khoảng 25–26 mA/cm².",
        caption: "Jsc là chỗ đường cong cắt trục dòng, khi điện áp bằng không.",
      },
      {
        title: "Hệ số lấp đầy FF",
        body: "FF đo độ «vuông» của đường dòng–áp. Góc bị tròn vì điện trở. Pin tốt nằm khoảng 0,83–0,87. Hình chữ nhật công suất cực đại nằm trong đường cong.",
        caption: "Hình chữ nhật trong đường cong là công suất lớn nhất. FF là tỉ lệ hình chữ nhật ấy so với Voc nhân Jsc.",
      },
      {
        title: "PCE = Voc × Jsc × FF / Pin",
        body: "Với Pin = 100 mW/cm² (phổ AM1.5G). Ví dụ Voc 1,19 V, Jsc 25,8 mA/cm², FF 0,86 cho PCE ≈ 26,4%. Kỷ lục một lớp trong tài liệu khoảng 26–27%.",
        caption: "Hiệu suất đọc từ công thức trên hình. 26,4% là ví dụ khi kéo thanh, không phải một kỷ lục mới.",
      },
    ],
  },
  {
    id: "sq",
    chapter: "c1",
    section: "1.5",
    title: "Trần một lớp: Shockley–Queisser",
    scene: "sq",
    cam: "plot",
    controls: ["eg"],
    tune: [{ eg: 1.34 }, { eg: 0.9 }, { eg: 2.2 }, { eg: 1.34 }, { eg: 1.7 }],
    steps: [
      {
        title: "Trần khoảng 33,7%",
        body: "Năm 1961, Shockley và Queisser chỉ ra một pin một lớp hấp thụ không vượt khoảng 33,7% dưới ánh nắng chuẩn, dù vật liệu hoàn hảo [70]. Đường trên màn hình là dạng minh họa, đỉnh được giữ đúng 33,7%.",
        caption: "Đường trần một lớp theo vùng cấm. Đỉnh được giữ ở 33,7%. Dạng đường là minh họa, không phải từng điểm tính lại từ phổ mặt trời.",
      },
      {
        title: "Vùng cấm nhỏ",
        body: "Hấp thụ được nhiều photon nên dòng lớn, nhưng mỗi photon chỉ cho năng lượng cỡ Eg, phần dư thành nhiệt, điện áp thấp.",
        caption: "Eg thấp: dòng lớn, điện áp thấp, phần dư của photon thành nhiệt.",
      },
      {
        title: "Vùng cấm lớn",
        body: "Mỗi điện tử mang nhiều năng lượng, điện áp cao, nhưng bỏ phí nhiều photon đỏ và hồng ngoại, dòng nhỏ.",
        caption: "Eg cao: điện áp cao, nhưng nhiều photon đỏ và hồng ngoại không đủ năng lượng.",
      },
      {
        title: "Điểm cân bằng",
        body: "Tối ưu nằm quanh Eg ≈ 1,1–1,4 eV. Từ khoảng 1,0 đến 1,6 eV, trần vẫn trên 30%.",
        caption: "Đỉnh đường nằm quanh 1,1–1,4 eV. Từ 1,0 đến 1,6 eV, trần vẫn trên 30%.",
      },
      {
        title: "Muốn vượt trần thì phải xếp chồng",
        body: "Pin song song (tandem) đặt nhiều lớp có vùng cấm khác nhau: lớp trên nuốt photon năng lượng cao, lớp dưới nhặt phần còn lại. Sẽ gặp lại ở chương 3 và phần đề xuất cải tiến.",
        caption: "Tandem vượt một đường trần vì lớp trên và lớp dưới chia nhau phổ.",
      },
    ],
  },
  {
    id: "silicon",
    chapter: "c1",
    section: "1.6",
    title: "Silicon đã gần trần một lớp",
    scene: "silicon",
    cam: "wide",
    legend: [
      { swatch: "metal", label: "Silicon dày" },
      { swatch: "iodine", label: "Perovskite mỏng" },
    ],
    steps: [
      {
        title: "Hơn 95% thị trường",
        body: "Silicon tinh thể có Eg 1,12 eV, rất gần tối ưu, rẻ, bền 25–30 năm. Kỷ lục phòng thí nghiệm khoảng 27–28%, sát trần thực tế của chính nó (~29,4%).",
      },
      {
        title: "Vùng cấm gián tiếp",
        body: "Silicon hấp thụ yếu vì vùng cấm gián tiếp (indirect bandgap): điện tử cần thêm một dao động mạng. Lớp silicon phải dày khoảng 150–180 µm, cỡ 300 lần lớp perovskite.",
      },
      {
        title: "Nấu trên 1400 °C",
        body: "Phải nấu chảy silicon trên 1400 °C và tinh chế tới độ sạch 99,9999%. Tốn rất nhiều năng lượng ngay từ lúc chế tạo.",
      },
      {
        title: "Đã gần chạm trần",
        body: "Muốn tăng hiệu suất thêm một bước đáng kể, cần một vật liệu thứ hai xếp lên trên silicon. Đó là chỗ perovskite bước vào.",
      },
    ],
  },
  {
    id: "ideal",
    chapter: "c1",
    section: "1.7",
    title: "Vật liệu lý tưởng cần gì — perovskite đáp ứng thế nào",
    scene: "ideal",
    cam: "default",
    steps: [
      {
        title: "Sáu tiêu chí",
        body: "Vùng cấm hợp (khoảng 1,1–1,7 eV), hấp thụ mạnh, hạt tải đi xa, ít khuyết tật gây hại, rẻ và dễ làm, rồi bền nhiều năm và không độc.",
      },
      {
        title: "Perovskite halide gật đầu gần hết",
        body: "Chỉnh được Eg khoảng 1,2–3,0 eV. Lớp 0,5 µm hấp thụ gần hết ánh sáng nhìn thấy. Độ dài khuếch tán từ khoảng 1 µm tới hơn 100 µm ở đơn tinh thể. Dung thứ khuyết tật. Phủ từ dung dịch dưới 150 °C.",
      },
      {
        title: "Còn vướng độ bền và chì",
        body: "Cả tài liệu xoay quanh câu này: hiệu năng thì perovskite đáp ứng gần như mọi tiêu chí, nhưng độ bền ngoài trời và độc tính của chì vẫn là điểm yếu chính.",
        note: warn("Dòng «Chưa» trên mô hình không phải lời kết án — đó là bài toán các chương 3 đến 5 cố gắng xử lý."),
      },
    ],
  },
  {
    id: "origin",
    chapter: "c2",
    section: "2.1",
    title: "Từ tên khoáng vật đến công thức ABX₃",
    scene: "origin",
    cam: "crystal",
    legend: [
      { swatch: "oxide", label: "Oxy trong CaTiO₃" },
      { swatch: "iodine", label: "Halide I/Br/Cl" },
      { swatch: "ma", label: "Cation hữu cơ" },
    ],
    steps: [
      {
        title: "1839, dãy Ural",
        body: "Gustav Rose tìm thấy khoáng CaTiO₃ và đặt tên theo Lev Perovski. Về sau perovskite là tên của một kiểu sắp xếp nguyên tử, không phải một chất duy nhất.",
      },
      {
        title: "Công thức ABX₃",
        body: "Hợp chất nào có dạng ABX₃ và cách xếp ion giống CaTiO₃ đều gọi là perovskite. X là oxy thì đó là perovskite oxit, dùng làm tụ điện, vật liệu áp điện.",
      },
      {
        title: "Đổi oxy lấy halogen",
        body: "Khi X là iod, brom hoặc clo, ta có perovskite halide — nhân vật chính. Nếu A là phân tử hữu cơ như methylammonium, vật liệu là perovskite lai hữu cơ–vô cơ.",
      },
    ],
  },
  {
    id: "parts",
    chapter: "c2",
    section: "2.2",
    title: "A, B, X — ba vai trong cùng một khung",
    scene: "parts",
    cam: "crystal",
    legend: [
      { swatch: "ma", label: "A · cation lớn +1" },
      { swatch: "lead", label: "B · Pb²⁺ hoặc Sn²⁺" },
      { swatch: "iodine", label: "X · I⁻, Br⁻, Cl⁻" },
    ],
    steps: [
      {
        title: "B ngồi tâm bát diện",
        body: "Cation kim loại B, thường Pb²⁺, đôi khi Sn²⁺ hoặc Ge²⁺, quyết định chủ yếu vùng dẫn. Chì cho hiệu suất cao nhất nhưng độc.",
      },
      {
        title: "X là đỉnh bát diện",
        body: "Anion halide quyết định chủ yếu vùng hóa trị. Iod cho vùng cấm nhỏ; brom và clo làm vùng cấm lớn hơn, màu sáng hơn.",
      },
      {
        title: "A lấp khoảng trống",
        body: "MA⁺ = CH₃NH₃⁺, FA⁺ = HC(NH₂)₂⁺, hoặc Cs⁺. A không tạo vùng cấm trực tiếp; nó làm khung nghiêng và qua đó đổi Eg.",
      },
      {
        title: "Điện tích phải về không",
        body: "A(+1) + B(+2) + 3×X(−1) = 0. Ví dụ quen nhất là MAPbI₃, tức CH₃NH₃PbI₃. Bấm vào từng ion trên mô hình để khóa camera vào nó.",
      },
    ],
  },
  {
    id: "build",
    chapter: "c2",
    section: "2.3",
    title: "Dựng khung: bát diện, nối góc, đếm ABX₃",
    scene: "build",
    cam: "crystal",
    legend: [
      { swatch: "lead", label: "Pb²⁺" },
      { swatch: "iodine", label: "I⁻" },
      { swatch: "fa", label: "Cation A" },
    ],
    steps: [
      {
        title: "Bước 1 — Viên gạch bát diện",
        body: "Một ion Pb²⁺ được sáu ion I⁻ bao theo sáu hướng. Nối sáu iod được khối tám mặt: bát diện (octahedron) PbI₆.",
      },
      {
        title: "Bước 2 — Nối góc",
        body: "Các bát diện dùng chung đỉnh (corner-sharing). Mỗi iod là đỉnh chung của hai bát diện kề nhau. Lặp theo ba chiều thành một khung giàn.",
      },
      {
        title: "Bước 3 — Thả cation A vào hốc",
        body: "Giữa tám bát diện có một hốc lớn. MA⁺ và FA⁺ là phân tử, có thể xoay tương đối tự do trong hốc. Cs⁺ là ion đơn, không xoay như một phân tử.",
      },
      {
        title: "Bước 4 — Đếm ra ABX₃",
        body: "Trong một ô cơ sở: A ở 8 góc, mỗi góc chia cho 8 ô nên 8×1/8 = 1. B ở tâm = 1. X ở 6 tâm mặt, mỗi mặt chia 2 ô nên 6×1/2 = 3. Cộng lại là ABX₃.",
      },
    ],
  },
  {
    id: "tolerance",
    chapter: "c2",
    section: "2.4",
    title: "Hệ số t — ion A có vừa hốc không",
    scene: "tolerance",
    cam: "default",
    controls: ["cation"],
    tune: [
      { cation: "Cs", mixCs: false },
      { cation: "Cs", mixCs: false },
      { cation: "MA", mixCs: false },
      { cation: "FA", mixCs: false },
      { cation: "FA", mixCs: true },
      { cation: "FA", mixCs: true },
    ],
    steps: [
      {
        title: "Ion A có vừa hốc không?",
        body: "Không phải bộ ba A, B, X nào cũng thành perovskite 3D. Năm 1926 Goldschmidt đề xuất hệ số dung hạn t = (rA + rX) / [√2 (rB + rX)] [20]. t = 1 là vừa khít. Perovskite 3D thường nằm khoảng 0,8 đến 1,0.",
      },
      {
        title: "CsPbI₃, t ≈ 0,85",
        body: "Cs hơi nhỏ. Khung dễ sụp thành pha delta màu vàng, các bát diện dùng chung cạnh (edge-sharing), hấp thụ kém. Bán kính Shannon: Pb²⁺ 1,19 Å, I⁻ 2,20 Å, Cs⁺ 1,88 Å [64].",
      },
      {
        title: "MAPbI₃, t ≈ 0,91",
        body: "Nằm giữa vùng an toàn. Về mặt hình học, đây là perovskite 3D dễ chịu. Bán kính hiệu dụng MA⁺ ≈ 2,17 Å [65].",
      },
      {
        title: "FAPbI₃, t ≈ 0,99",
        body: "FA hơi lớn (≈ 2,53 Å). Ở nhiệt độ phòng dễ chuyển sang pha lục giác màu vàng, các bát diện dùng chung mặt (face-sharing).",
      },
      {
        title: "Trộn khoảng 5% Cs",
        body: "Pha FA với một ít Cs kéo kích thước trung bình về vùng an toàn. FA₀.₉₅Cs₀.₀₅PbI₃ là lõi của nhiều pin trên 27% [39].",
      },
      {
        title: "t chỉ là sàng lọc gần đúng",
        body: "Bán kính hiệu dụng của ion hữu cơ là ước lượng. Bartel và cộng sự (2019) thấy ngưỡng t chỉ đoán đúng khoảng 74% trường hợp; hệ số τ của họ đúng khoảng 92% [21].",
        note: warn("Đừng coi t = 0,91 là một lời đảm bảo bền ngoài trời. Nó chỉ nói hình học có chịu không."),
      },
    ],
  },
  {
    id: "phases",
    chapter: "c2",
    section: "2.5",
    title: "Khung nghiêng thì vùng cấm đổi",
    scene: "phases",
    cam: "default",
    controls: ["temperature"],
    tune: [{ temp: 70 }, { temp: 25 }, { temp: -130 }, { temp: 25 }],
    steps: [
      {
        title: "A nhỏ thì khung khom lại",
        body: "Khi ion A hơi nhỏ so với hốc, các bát diện xoay và nghiêng (octahedral tilting) để ôm lấy A. Góc liên kết Pb–I–Pb lệch khỏi 180°.",
      },
      {
        title: "MAPbI₃ có ba pha theo nhiệt độ",
        body: "Trên khoảng 54 °C: lập phương, không nghiêng, Pb–I–Pb = 180°. Từ khoảng −111 °C đến 54 °C: tứ phương, bát diện kề xoay ngược quanh một trục — đây là nhiệt độ phòng. Dưới khoảng −111 °C: trực thoi, nghiêng cả ba trục [67].",
      },
      {
        title: "Kéo xuống trực thoi",
        body: "Thanh nhiệt độ đi từ pha bạn đang sống (tứ phương) xuống pha lạnh. Mô hình phóng đại góc nghiêng để mắt thấy được; trong tinh thể thật độ nghiêng nhỏ hơn hình vẽ.",
      },
      {
        title: "Nghiêng nhiều thì vùng cấm rộng",
        body: "Góc càng lệch 180°, quỹ đạo của Pb và I càng chồng lấp kém, Eg càng rộng [68]. CsPbI₃ (A nhỏ, nghiêng nhiều) có Eg ≈ 1,73 eV. FAPbI₃ (A lớn, ít nghiêng) chỉ ≈ 1,48 eV. A điều khiển Eg gián tiếp qua hình học khung.",
      },
    ],
  },
  {
    id: "orbitals",
    chapter: "c2",
    section: "2.6",
    title: "Vì sao chì cho vùng cấm thẳng",
    scene: "orbitals",
    cam: "default",
    legend: [
      { swatch: "htl", label: "Đỉnh vùng hóa trị · I 5p + Pb 6s" },
      { swatch: "electron", label: "Đáy vùng dẫn · Pb 6p" },
    ],
    steps: [
      {
        title: "Cấu hình đảo ngược",
        body: "Ở perovskite chì iod, đỉnh vùng hóa trị đến từ quỹ đạo 5p của iod trộn với 6s của chì — cặp điện tử 6s² đơn độc (lone pair). Đáy vùng dẫn chủ yếu là quỹ đạo 6p của chì [16].",
      },
      {
        title: "Vùng cấm thẳng",
        body: "Điện tử nhảy lên vùng dẫn không cần mượn dao động mạng. Đó là vùng cấm thẳng (direct bandgap), nên hấp thụ rất mạnh — ngược với silicon.",
      },
      {
        title: "Khối lượng hiệu dụng nhỏ",
        body: "Cả điện tử và lỗ trống đều «nhẹ», di chuyển dễ. Đây là một nửa lý do điện tích đi được rất xa ở chương 3.",
      },
      {
        title: "Khuyết tật phổ biến chỉ nông",
        body: "Các khuyết tật dễ hình thành thường chỉ tạo mức nông, sát mép vùng. Phần dung thứ khuyết tật được kể kỹ ở mục 3.4.",
      },
      {
        title: "Spin–quỹ đạo hạ đáy vùng dẫn",
        body: "Chì nặng nên tương tác spin–quỹ đạo (spin–orbit coupling) mạnh, kéo đáy vùng dẫn xuống đáng kể. Mô phỏng mà bỏ hiệu ứng này sẽ đoán Eg sai.",
        note: base("Mục này nâng cao hơn các mục trước. Bạn có thể xem chuyển động rồi đọc lại."),
      },
    ],
  },
  {
    id: "alloy",
    chapter: "c2",
    section: "2.7",
    title: "Trộn A, B, X để vặn tính chất",
    scene: "alloy",
    cam: "crystal",
    controls: ["bromide", "sn", "light"],
    tune: [
      { br: 0, sn: 0, light: false },
      { br: 45, sn: 0, light: false },
      { br: 100, sn: 0, light: false },
      { br: 40, sn: 0, light: true },
      { br: 0, sn: 0, light: false },
      { br: 0, sn: 50, light: false },
    ],
    legend: [
      { swatch: "iodine", label: "Giàu iod" },
      { swatch: "br", label: "Giàu brom" },
      { swatch: "tin", label: "Thiếc trên vị trí B" },
    ],
    steps: [
      {
        title: "Trộn ở vị trí X",
        body: "Tăng tỉ lệ brom làm mạng co lại. Eg đi từ khoảng 1,57 eV (thuần iod) tới ≈ 2,3 eV (thuần brom). Màu chuyển từ nâu đen sang cam [18].",
      },
      {
        title: "Kéo thanh brom",
        body: "Mô hình đổi màu theo tỉ lệ Br. Đây là núm vặn thô nhất: cùng một khung tinh thể, chỉ đổi halogen là đổi màu và đổi Eg liên tục.",
      },
      {
        title: "Thuần brom",
        body: "Eg lớn hợp đèn và lớp màu, nhưng hấp thụ ít photon đỏ hơn. Pin một lớp thường không muốn Eg quá cao.",
      },
      {
        title: "Hiệu ứng Hoke",
        body: "Khi chiếu sáng, perovskite trộn I/Br có thể tự tách pha: iod gom thành vùng giàu iod, Eg thấp hơn. Điện tích dồn về đó, ánh sáng phát ra lệch về ≈ 1,68 eV, điện áp bị kéo xuống. Tắt đèn, ion trộn lại — hiện tượng thuận nghịch [24].",
        note: warn("Bài học thực hành: pin một lớp nên dùng thuần iod. Khi cần Eg cao, giữ brom vừa phải và ổn định giao diện."),
      },
      {
        title: "Trộn ở vị trí A",
        body: "Trộn ba cation Cs/MA/FA giúp màng bền hơn và lặp lại tốt. Saliba và Grätzel đạt 21,1% năm 2016 với triple cation [22].",
      },
      {
        title: "Trộn Sn/Pb ở vị trí B",
        body: "Thay một phần chì bằng thiếc kéo Eg xuống ≈ 1,2–1,3 eV — hợp làm lớp dưới của tandem toàn perovskite. Thiếc có bài toán oxy hóa riêng, xem mục chì.",
      },
    ],
  },
  {
    id: "nano",
    chapter: "c2",
    section: "2.8",
    title: "Ba dạng nano: màng, chấm lượng tử, lớp 2D",
    scene: "nano",
    cam: "default",
    controls: ["nwell"],
    tune: [{ nWell: 99 }, { nWell: 99 }, { nWell: 1 }, { nWell: 2 }, { nWell: 99 }],
    steps: [
      {
        title: "Vài nanomét quyết định pin",
        body: "Một nanomét là một phần tỷ mét. Perovskite được gọi là vật liệu nano vì những gì xảy ra từ vài nm đến vài trăm nm quyết định pin tốt hay xấu.",
      },
      {
        title: "Màng đa tinh thể",
        body: "Lớp hấp thụ trong pin dày khoảng 0,5 µm, hạt tinh thể vài trăm nm. Ranh giới hạt và bề mặt là nơi khuyết tật tập trung.",
      },
      {
        title: "Chấm lượng tử",
        body: "Nano tinh thể cỡ 5–15 nm, bọc bởi phối tử hữu cơ. Chúng phát sáng rất mạnh, màu tùy thành phần, khoảng 410–700 nm [45]. Dùng cho màn hình và LED.",
      },
      {
        title: "Giếng lượng tử 2D",
        body: "Perovskite Ruddlesden–Popper: ion hữu cơ lớn như butylammonium cắt khung 3D thành lớp. Điện tử bị nhốt trong lớp vô cơ — giếng lượng tử. n = 1 cho 2,43 eV, n = 2 cho 2,17 eV, 3D (n = ∞) ≈ 1,5 eV [69].",
      },
      {
        title: "Chỉ nên mặc một lớp áo mỏng",
        body: "Lớp 2D bền với nước nên dùng làm áo bảo vệ bề mặt. Điện tích khó xuyên lớp hữu cơ, nên áo phải thật mỏng.",
      },
    ],
  },
  {
    id: "props",
    chapter: "c2",
    section: "2.9",
    title: "Bảng tính chất sẽ dùng lại ở các chương sau",
    scene: "props",
    cam: "crystal",
    steps: [
      {
        title: "Vùng cấm chỉnh được",
        body: "Khoảng 1,48 eV với FAPbI₃, 1,57 eV với MAPbI₃, tới 2,3 eV với MAPbBr₃.",
      },
      {
        title: "Hấp thụ nông, bờ rất dốc",
        body: "Độ sâu hấp thụ vùng nhìn thấy chỉ khoảng 100 nm, nên lớp mỏng là đủ. Năng lượng Urbach ≈ 15 meV [13]: bờ hấp thụ dốc, ít mất điện áp.",
      },
      {
        title: "Exciton yếu, điện tích đi xa",
        body: "Năng lượng liên kết exciton chỉ vài meV ở nhiệt độ phòng [14]. Độ dài khuếch tán ≈ 0,1–1 µm trong màng, và hơn 10 µm tới hơn 175 µm trong đơn tinh thể [9][11].",
      },
      {
        title: "Ion iod cũng đi được — và đó là vấn đề",
        body: "Năng lượng hoạt hóa di chuyển của ion iod ≈ 0,6 eV [25]. Ion dễ nhảy nên vật liệu kém bền. Nhiệt độ xử lý chỉ 100–150 °C, nên chế tạo rẻ.",
        note: warn("Cùng một mạng ion «mềm» tạo ra cả ưu điểm lẫn nhược điểm. Đừng tách hai chuyện này ra."),
      },
    ],
  },
  {
    id: "race",
    chapter: "c3",
    section: "3",
    title: "Lý do tổng: từ 3,8% năm 2009 lên 27,3%",
    scene: "race",
    cam: "plot",
    steps: [
      {
        title: "2009, Miyasaka",
        body: "Nhóm Miyasaka ở Nhật lần đầu dùng perovskite trong pin và chỉ đạt 3,8% [7]. Silicon đã mất hơn 50 năm cho một quãng đường tương tự.",
        caption: "Mốc 3,8% năm 2009. Đường cam là một lớp. Đường lục ngang là mức 33,7%.",
      },
      {
        title: "Đường một lớp",
        body: "Trong khoảng 17 năm, pin một lớp leo tới 27,3% trên biểu đồ NREL 2026 được tài liệu dẫn [1]. Đường vẽ ở đây là minh họa các mốc tài liệu nêu, không phải từng điểm gốc.",
        caption: "Đường cam nối các mốc tài liệu nêu cho pin một lớp, tới 27,3%. Không phải số đo gốc từng năm.",
        note: warn("Số thị trường và thông cáo công ty ở chương 4 cần đối chiếu biểu đồ gốc tại nrel.gov trước khi trích dẫn."),
      },
      {
        title: "Tandem vượt trần một lớp",
        body: "Tandem perovskite/silicon được tài liệu ghi 35% [1]. Nó được phép vượt 33,7% vì không còn là pin một lớp.",
        caption: "Đường lam là tandem và được phép vượt 33,7% vì không còn là pin một lớp.",
      },
      {
        title: "Sáu lý do phía sau tốc độ ấy",
        body: "Hấp thụ mạnh, điện tích đi xa, exciton tự tách, dung thứ khuyết tật, chỉnh Eg dễ, chế tạo rẻ. Các mục sau lần lượt mở từng lý do.",
        caption: "Sáu lý do mở ở mục 3.1 đến 3.6. Hình chỉ giữ các đường để thấy chỗ đứng.",
      },
    ],
  },
  {
    id: "absorb",
    chapter: "c3",
    section: "3.1",
    title: "Lý do 1 — lớp mỏng vẫn hấp thụ gần hết",
    scene: "absorb",
    cam: "default",
    legend: [
      { swatch: "electron", label: "Xanh lam, chết ở mặt" },
      { swatch: "warn", label: "Đỏ, đi sâu hơn" },
      { swatch: "sun", label: "Hồng ngoại dài, xuyên qua" },
    ],
    steps: [
      {
        title: "Mỏng hơn sợi tóc khoảng 100 lần",
        body: "Nhờ vùng cấm thẳng, độ sâu hấp thụ ở vùng nhìn thấy chỉ cỡ 100 nm. Lớp dày 500 nm đã giữ gần hết ánh sáng nhìn thấy.",
      },
      {
        title: "Xanh chết sớm, đỏ đi sâu, hồng ngoại thoát",
        body: "Ánh sáng xanh lam bị nuốt sát bề mặt. Đỏ đi sâu hơn nhưng vẫn bị giữ phần lớn. Chỉ hồng ngoại dài hơn khoảng 790 nm — năng lượng dưới 1,57 eV — mới xuyên qua lớp MAPbI₃.",
      },
      {
        title: "Bờ Urbach dốc như GaAs",
        body: "Năng lượng Urbach chỉ ≈ 15 meV, ngang bán dẫn đơn tinh thể chất lượng cao, dù màng được phủ từ dung dịch [13]. Bờ dốc nghĩa là rất ít trạng thái đuôi trong vùng cấm, nên ít mất điện áp.",
      },
    ],
  },
  {
    id: "diffusion",
    chapter: "c3",
    section: "3.2",
    title: "Lý do 2 — điện tích kịp tới điện cực",
    scene: "diffusion",
    cam: "default",
    controls: ["lifetime"],
    tune: [{ tau: 273, singleCrystal: false }, { tau: 273, singleCrystal: false }, { tau: 273, singleCrystal: false }, { tau: 400000, singleCrystal: true }],
    steps: [
      {
        title: "Không chạy thẳng",
        body: "Sau khi sinh ra, điện tử đi ngẫu nhiên. Đó là khuếch tán (diffusion). Quãng đường trung bình trước khi tái hợp là độ dài khuếch tán.",
      },
      {
        title: "L = √(D·τ)",
        body: "D là hệ số khuếch tán, τ là thời gian sống. Pin tốt khi L lớn hơn bề dày lớp hấp thụ. Màn hình vẽ quả cầu bán kính L cạnh một lát màng 0,5 µm. Công thức dùng D minh họa 0,05 cm²/s cho màng và 0,8 cm²/s khi bật đơn tinh thể.",
      },
      {
        title: "Hai bài Science năm 2013",
        body: "Perovskite chứa clo có L vượt 1 µm, gấp đôi bề dày lớp, thời gian sống 273 ns [9][10]. Hai bài ấy là cột mốc khiến cả ngành bùng lên.",
      },
      {
        title: "Đơn tinh thể còn dài hơn",
        body: "Không còn ranh giới hạt, L vượt 10 µm, có phép đo hơn 175 µm [11][12]. Kéo thời gian sống, hoặc bật đơn tinh thể, để quả cầu nuốt gọn lát màng.",
      },
    ],
  },
  {
    id: "exciton",
    chapter: "c3",
    section: "3.3",
    title: "Lý do 3 — cặp điện tích tự tách ở nhiệt phòng",
    scene: "exciton",
    cam: "default",
    legend: [
      { swatch: "electron", label: "Điện tử" },
      { swatch: "hole", label: "Lỗ trống" },
    ],
    steps: [
      {
        title: "Exciton là một cặp bị hút",
        body: "Điện tử và lỗ trống có thể dính thành một cặp gọi là exciton. Năng lượng cần để tách chúng là năng lượng liên kết exciton.",
      },
      {
        title: "Vài meV thua nhiệt phòng",
        body: "Ở perovskite, năng lượng liên kết chỉ vài meV ở nhiệt độ phòng [14][43]. Dao động nhiệt kT ở 300 K khoảng 26 meV. Nhiệt độ phòng đủ lắc để tách gần như mọi cặp thành hạt tự do [77].",
      },
      {
        title: "Hữu cơ thì không được thế",
        body: "Bán dẫn hữu cơ có năng lượng liên kết hàng trăm meV, nên pin hữu cơ phải trộn hai vật liệu thành tiếp xúc dị thể khối (bulk heterojunction). Perovskite không cần. Cấu trúc pin đơn giản hơn nhiều.",
      },
    ],
  },
  {
    id: "defects",
    chapter: "c3",
    section: "3.4",
    title: "Lý do 4 — khuyết tật phổ biến ít gây hại",
    scene: "defects",
    cam: "crystal",
    legend: [
      { swatch: "warn", label: "Bẫy sâu" },
      { swatch: "good", label: "Bẫy nông" },
    ],
    steps: [
      {
        title: "Không tinh thể nào hoàn hảo",
        body: "Luôn có chỗ trống (vacancy), nguyên tử thừa chen khe (interstitial), hoặc nguyên tử đứng sai chỗ (antisite). Ở nhiều bán dẫn, khuyết tật tạo mức giữa vùng cấm.",
      },
      {
        title: "Bẫy sâu nuốt điện tử",
        body: "Bẫy sâu (deep trap) là nơi điện tử rơi vào, gặp lỗ trống và mất năng lượng. Đó là tái hợp Shockley–Read–Hall. Điện áp của pin chết ở đây.",
      },
      {
        title: "Bẫy nông chỉ giữ tạm",
        body: "Bẫy nông sát mép vùng. Nhiệt đẩy điện tử ra lại. Yin, Shi và Yan (2014) tính được ở MAPbI₃, chỗ trống iod Vᵢ và chỗ trống chì Vₚb — những khuyết tật dễ hình thành — chỉ tạo bẫy nông. Khuyết tật gây bẫy sâu thì năng lượng hình thành cao, nên hiếm [15][16].",
      },
      {
        title: "Vì vậy dung dịch vẫn cho pin tốt",
        body: "Tính chất này gọi là dung thứ khuyết tật (defect tolerance). Đó là lý do một màng phủ đơn giản vẫn đạt hiệu suất cao.",
        note: warn("Dung thứ không có nghĩa miễn nhiễm. Khuyết tật bề mặt và ranh giới hạt vẫn ăn điện áp. Mọi pin kỷ lục đều phải thụ động hóa bề mặt."),
      },
    ],
  },
  {
    id: "tune",
    chapter: "c3",
    section: "3.5",
    title: "Lý do 5 — vùng cấm chỉnh được theo thành phần",
    scene: "tune",
    cam: "default",
    controls: ["eg"],
    tune: [{ eg: 1.53 }, { eg: 1.53 }, { eg: 1.7 }, { eg: 1.25 }, { eg: 2.3 }, { eg: 1.12 }],
    steps: [
      {
        title: "Một núm, một dải rộng",
        body: "Chỉ cần đổi tỉ lệ thành phần, Eg chạy liên tục khoảng 1,2–3,0 eV. Silicon thì khóa cứng ở 1,12 eV.",
      },
      {
        title: "Pin một lớp ≈ 1,5 eV",
        body: "Gần đáy của giới hạn Shockley–Queisser. Lõi FA/Cs thuần iod trong đề xuất chương 5 nằm quanh 1,53 eV.",
      },
      {
        title: "Lớp trên tandem ≈ 1,7 eV",
        body: "Nuốt phần xanh và lục, để đỏ và hồng ngoại cho silicon hoặc cho lớp thiếc–chì phía dưới.",
      },
      {
        title: "Lớp dưới thiếc–chì ≈ 1,25 eV",
        body: "Tandem toàn perovskite cần một Eg thấp mà silicon không tự đổi được. Sn/Pb là núm đó.",
      },
      {
        title: "Và cả đèn nhiều màu",
        body: "Cùng họ vật liệu có thể thành LED. Kéo Eg lên vùng brom là màu chuyển từ nâu sang cam, rồi tới những màu sáng hơn.",
      },
    ],
  },
  {
    id: "ink",
    chapter: "c3",
    section: "3.6",
    title: "Lý do 6 — phủ từ mực, dưới 150 °C",
    scene: "ink",
    cam: "wide",
    steps: [
      {
        title: "Pha thành mực",
        body: "Hòa muối PbI₂ và muối hữu cơ trong dung môi như DMF/DMSO, phủ lên đế như sơn, sấy 100–150 °C.",
      },
      {
        title: "Silicon phải vào lò",
        body: "Silicon được nấu trên 1400 °C để kéo tinh thể. Hai nhiệt độ ấy đang đứng cạnh nhau trên bàn thí nghiệm.",
      },
      {
        title: "Ít vật liệu, nhiều loại đế",
        body: "Lớp chỉ dày khoảng 0,5 µm. Phủ được lên kính, nhựa dẻo, hoặc trực tiếp lên pin silicon có sẵn. Hiếm vật liệu nào gom đủ sáu ưu điểm cùng lúc.",
      },
    ],
  },
  {
    id: "plqy",
    chapter: "c3",
    section: "3.7",
    title: "Hệ quả — pin tốt cũng phát sáng tốt",
    scene: "plqy",
    cam: "default",
    controls: ["plqy"],
    tune: [{ plqy: 0.1 }, { plqy: 0.01 }, { plqy: 0.0001 }, { plqy: 0.05 }],
    steps: [
      {
        title: "Quan hệ thuận nghịch Rau",
        body: "Voc = Voc,rad + (kT/q)·ln(PLQY) [71]. Voc,rad là điện áp khi chỉ còn tái hợp phát sáng. PLQY là tỉ lệ cặp điện tử–lỗ trống tái hợp bằng cách nhả photon.",
      },
      {
        title: "Mỗi thập phân mất khoảng 60 mV",
        body: "(kT/q)·ln(10) ≈ 60 mV ở 300 K. PLQY giảm 10 lần thì pin mất khoảng 60 mV. Mô hình lấy Voc,rad minh họa = 1,32 V.",
      },
      {
        title: "Hai thập phân là khoảng 120 mV",
        body: "Từ 1% xuống 0,01% là hai lần chia 10. Đó chính là câu tự kiểm tra số 4 ở cuối tài liệu.",
      },
      {
        title: "Thụ động hóa để kéo Voc",
        body: "Phủ phân tử lấp bẫy làm tăng PLQY. Voc nhờ đó tới khoảng 1,2 V — ví dụ 1,203 V ở pin 26,9% trên 1 cm² [2].",
      },
    ],
  },
  {
    id: "compare",
    chapter: "c3",
    section: "3.8",
    title: "Bảng so sánh với silicon, CdTe và pin hữu cơ",
    scene: "compare",
    cam: "wide",
    steps: [
      {
        title: "Bốn cột",
        body: "Silicon tinh thể, CdTe màng mỏng, pin hữu cơ (OPV), và perovskite halide. Chiều cao cột là hiệu suất kỷ lục mà tài liệu nêu, ở mức gần đúng.",
        caption: "Bốn cột. Chiều cao là hiệu suất một lớp gần đúng. Cột perovskite không dùng số tandem 35%.",
      },
      {
        title: "Hiệu suất và độ dày",
        body: "Silicon ≈ 27–28% nhưng dày 150–180 µm. CdTe ≈ 23%, dày vài µm. OPV ≈ 20%, dày ≈ 0,1 µm. Perovskite 27,3% một lớp và 35% tandem, dày ≈ 0,5 µm.",
        caption: "Nhãn dưới cột là độ dày. Silicon cao về hiệu suất nhưng dày hơn perovskite khoảng 300 lần.",
      },
      {
        title: "Nhiệt độ và núm vùng cấm",
        body: "Silicon trên 1400 °C, không chỉnh Eg. CdTe khoảng 500–600 °C, chỉnh Eg hạn chế. OPV và perovskite đều dưới 150 °C; perovskite chỉnh Eg rất rộng.",
        caption: "Nhãn tiếp theo là nhiệt độ chế tạo. Perovskite nằm dưới 150 °C.",
      },
      {
        title: "Bền và độc",
        body: "Silicon và CdTe đã có 25 năm ngoài trời; CdTe vướng cadmium. OPV còn hạn chế về bền. Perovskite đang cải thiện, và vướng chì — lượng nhỏ, nhưng hòa tan được trong nước.",
        caption: "Bước cuối nhắc độ bền: silicon và CdTe đã có khoảng 25 năm ngoài trời. Perovskite chưa có mức ấy.",
      },
    ],
  },
  {
    id: "enemies",
    chapter: "c3",
    section: "3.9",
    title: "Năm kẻ thù sẽ bị chặn ở chương 5",
    scene: "enemies",
    cam: "default",
    controls: ["enemy"],
    tune: [
      { enemy: 1, defense: false },
      { enemy: 2, defense: false },
      { enemy: 3, defense: false },
      { enemy: 4, defense: false },
      { enemy: 5, defense: false },
      { enemy: 5, defense: true },
    ],
    steps: [
      {
        title: "1 · Hơi ẩm",
        body: "Nước len vào ranh giới hạt, phân hủy perovskite thành PbI₂ màu vàng. Chống bằng lớp 2D kỵ nước và đóng gói kín.",
      },
      {
        title: "2 · Oxy và ánh sáng",
        body: "Oxy tạo gốc superoxide (O₂⁻) tại chỗ trống iod [27]. Cần thụ động hóa và đóng gói.",
      },
      {
        title: "3 · Nhiệt",
        body: "Phân tử MA dễ bay hơi khi tấm pin nóng. Cách chống trong tài liệu: bỏ MA, dùng FA cộng Cs.",
      },
      {
        title: "4 · Tia cực tím",
        body: "Lớp TiO₂ bị kích hoạt dưới UV và tạo bẫy sâu [26]. Dùng kính lọc UV hoặc đổi lớp vận chuyển.",
      },
      {
        title: "5 · Ion iod di chuyển",
        body: "Ion iod nhảy qua chỗ trống, hàng rào năng lượng khoảng 0,6 eV, rồi ăn mòn điện cực và gây tách pha [25]. Cần lớp rào và giảm chỗ trống.",
      },
      {
        title: "Bật phòng thủ",
        body: "Mạng ion mềm vừa giúp tinh thể tự vá, vừa mở cửa cho cả năm kẻ thù. Nút phòng thủ trên màn hình cho thấy ý chương 5: chặn đồng thời, không chặn từng cái một.",
        note: base("Chính liên kết yếu tạo hiệu suất cao cũng là gốc của sự kém bền."),
      },
    ],
  },
  {
    id: "methods",
    chapter: "c4",
    section: "4.0",
    title: "Bản đồ bảy cách chế tạo",
    scene: "methods",
    cam: "wide",
    steps: [
      {
        title: "Bảy lối, cùng hai giai đoạn",
        body: "Trước khi đi từng nhịp, hãy nhìn cả bản đồ. Mọi cách dưới đây đều có tạo mầm rồi lớn lên. Khác nhau ở chỗ mầm được ép xuất hiện: bằng dung môi đối, bằng nhiệt, bằng chân không, hay bằng dao khí.",
        more: "Ba cách đầu dành cho màng trong phòng thí nghiệm (vài cm²). Hai cách tiếp theo làm đơn tinh thể và chấm lượng tử. Hai cách cuối thay quay phủ khi lên diện tích lớn — quay phủ không phủ đều được tấm hàng mét.",
        caption: "Sơ đồ tổng quan bảy cách chế tạo halide perovskite. Mỗi thẻ là một lộ trình sẽ được mở từng nhịp ở các mục 4.2–4.4. Màu tím là màng hấp thụ, vàng là PbI₂ chưa chuyển pha, lam là buồng chân không.",
      },
      {
        title: "1 · Quay phủ + dung môi đối",
        body: "Nhỏ mực lên đế, quay vài nghìn vòng/phút, rồi nhỏ chlorobenzene để cả màng kết tinh cùng lúc. Sấy 100–150 °C. Đây là cách làm tế bào nhỏ trong phòng thí nghiệm [47].",
        caption: "Thẻ 1 trên bản đồ: quay phủ một bước kèm dung môi đối. Dùng cho tế bào cỡ centimet, không dùng cho tấm mét vuông.",
      },
      {
        title: "2 · Lắng đọng hai bước",
        body: "Phủ PbI₂ vàng trước, rồi nhúng hoặc phủ muối hữu cơ MAI/FAI. Màng chuyển từ vàng sang đen khi perovskite hình thành [46].",
        caption: "Thẻ 2: hai lớp xếp lần lượt. Vàng = PbI₂, đen = perovskite sau khi gặp muối hữu cơ.",
      },
      {
        title: "3 · Bay hơi chân không",
        body: "Không dung môi. Muối bị đốt trong buồng hút chân không, hơi bám lên đế — kể cả bề mặt nhám của silicon. Năm 2026 tài liệu dẫn tandem Oxford làm hoàn toàn bằng chân không, 27,2% [51].",
        caption: "Thẻ 3: nguồn nóng ở dưới, đế ở trên. Hạt hơi đi theo đường thẳng trong chân không nên lấp được chỗ lồi lõm.",
      },
      {
        title: "4 · Kết tinh nhiệt độ ngược",
        body: "Độ tan của MAPbX₃ trong một số dung môi giảm khi nóng. Đun dung dịch đã hòa tan thì tinh thể lớn mọc ra, nhanh hơn khoảng 10 lần các cách cũ [49]. Dùng cho đầu dò tia X và đo đạc cơ bản.",
        caption: "Thẻ 4: lọ dung dịch, nhiệt độ tăng, một tinh thể lớn — không phải màng mỏng.",
      },
      {
        title: "5 · Chích nóng",
        body: "Đun muối chì halide với oleic acid và oleylamine ở 140–200 °C, chích nhanh cesium. Mầm bùng cùng lúc theo mô hình LaMer [73], rồi làm lạnh bằng nước đá. Ra chấm khoảng 10 nm, phát từ 410 đến 700 nm [45].",
        caption: "Thẻ 5: nhiều hạt nano đồng kích thước. Màu phát sáng đổi theo halide, không phải màu của mực pin.",
      },
      {
        title: "6 · Dao gạt và dao khí",
        body: "Lưỡi dao kéo một lớp mực mỏng trên kính hoặc nhựa. Dao khí nitơ thổi khô ngay, thay vai trò của dung môi đối, để mầm ra cùng lúc trên diện rộng [50].",
        caption: "Thẻ 6: lưỡi dao định độ dày ướt; luồng N₂ phía sau làm khô tức thì. Mũi tên chỉ chiều chạy của đế.",
      },
      {
        title: "7 · Phủ khe và cuộn-sang-cuộn",
        body: "Slot-die đẩy mực qua một khe hẹp lên tấm chạy liên tục, giống in báo. Tài liệu ghi pin cuộn-sang-cuộn đã khoảng 10–14%. Chân không cũng phủ được diện lớn, và ngành màn hình đã quen thiết bị này [50].",
        caption: "Thẻ 7: đầu phủ khe đứng yên, cuộn đế chạy bên dưới. Con số 10–14% là mức tài liệu ghi cho pin cuộn, không phải kỷ lục tế bào nhỏ.",
      },
    ],
  },
  {
    id: "nucleation",
    chapter: "c4",
    section: "4.1",
    title: "Nguyên tắc chung — mầm cùng lúc, rồi lớn đều",
    scene: "nucleation",
    cam: "wide",
    steps: [
      {
        title: "Hai giai đoạn",
        body: "Mọi cách nuôi tinh thể đều có tạo mầm (nucleation) — những mầm tí hon xuất hiện — và lớn lên (growth).",
        caption: "Hai giai đoạn của mọi cách nuôi tinh thể: tạo mầm, rồi lớn lên.",
      },
      {
        title: "Mầm cùng một lúc",
        body: "Bí quyết của màng mịn, hạt đều: mọi mầm xuất hiện đồng loạt, rồi lớn với tốc độ như nhau.",
        caption: "Mầm cùng cỡ nghĩa là chúng xuất hiện cùng lúc và lớn cùng tốc độ.",
      },
      {
        title: "Mầm rải rác thì thủng lỗ kim",
        body: "Nếu mầm xuất hiện lúc có lúc không, màng có lỗ kim (pinhole) và hạt to nhỏ lẫn lộn. Một lỗ kim trên tấm pin lớn có thể thành đường chập.",
        caption: "Chấm cam là lỗ kim. Trên tấm lớn, một lỗ có thể thành đường chập cả mô-đun.",
      },
    ],
  },
  {
    id: "films",
    chapter: "c4",
    section: "4.2",
    title: "Cách 1–3 — quay phủ, hai bước, chân không",
    scene: "films",
    cam: "wide",
    steps: [
      {
        title: "Nhịp 1 — nhỏ mực lên đế",
        body: "Mực là muối PbI₂ và muối hữu cơ hòa trong DMF/DMSO. Nhỏ một giọt lên giữa đế thủy tinh hoặc đế đã có lớp dẫn, khi đế còn đứng yên hoặc vừa bắt đầu quay.",
        more: "Lượng giọt quyết định có đủ vật liệu cho lớp khoảng 0,5 µm hay không. Thừa thì văng ra khi quay; thiếu thì màng thủng.",
        caption: "Hình động nhịp 1 của quay phủ: giọt mực rơi xuống tâm đế tròn. Đế chưa quay nhanh. Chú thích màu: vàng nhạt = mực chưa kết tinh.",
      },
      {
        title: "Nhịp 2 — quay vài nghìn vòng/phút",
        body: "Đế quay rất nhanh. Lực ly tâm trải mực thành màng ướt và hất phần thừa. Dung môi bắt đầu bay, nhưng nếu chỉ chờ tự khô thì mầm xuất hiện lúc có lúc không.",
        more: "Vài nghìn vòng/phút là tốc độ phòng thí nghiệm điển hình cho tế bào nhỏ, không phải tốc độ của dây chuyền mét vuông.",
        caption: "Nhịp 2: đế quay, màng ướt mỏng dần từ tâm ra rìa. Các vòng cung là quỹ đạo mực bị văng.",
      },
      {
        title: "Nhịp 3 — nhỏ dung môi đối",
        body: "Vài giây sau, nhỏ chlorobenzene hoặc một dung môi không hòa tan perovskite. Độ tan tụt đột ngột, nên mầm xuất hiện gần như cùng một lúc trên cả mặt đế [47].",
        more: "Đây là mẹo then chốt của màng mịn: không phải quay cho khô tự nhiên, mà ép kết tinh đồng loạt.",
        caption: "Nhịp 3: giọt dung môi đối (lam) rơi lên màng đang quay. Màng đổi từ vàng nhạt sang tím đen khi tinh thể perovskite hình thành đồng loạt.",
      },
      {
        title: "Nhịp 4 — sấy 100–150 °C",
        body: "Đưa đế lên bàn nhiệt. Dung môi còn lại ra hết, hạt tinh thể lớn thêm một chút, màng ổn định màu đen. Nhiệt này thấp hơn rất nhiều so với lò silicon trên 1400 °C.",
        caption: "Nhịp 4: bàn nhiệt dưới đế. Màng đã đen. Nhiệt độ ghi trên nhãn là khoảng sấy của perovskite, không phải nhiệt độ nóng chảy.",
      },
      {
        title: "Hai bước — phủ PbI₂ vàng",
        body: "Cách thứ hai tách phản ứng làm hai lớp. Trước hết phủ PbI₂. Màng có màu vàng đặc trưng, chưa phải perovskite [46].",
        caption: "Lắng đọng hai bước, nhịp A: lớp PbI₂ vàng trên đế. Chưa có cation A trong màng.",
      },
      {
        title: "Hai bước — cho MAI hoặc FAI vào",
        body: "Nhúng đế vào dung dịch muối hữu cơ, hoặc phủ MAI/FAI lên trên. Ion hữu cơ khuếch tán vào mạng PbI₂, màng chuyển từ vàng sang đen khi thành ABX₃.",
        more: "Thời gian nhúng quyết định phản ứng có chạy hết chiều dày hay còn lõi PbI₂ vàng.",
        caption: "Nhịp B: các chấm lục là muối hữu cơ đi xuống lớp vàng. Vùng đã phản ứng chuyển đen từ trên xuống.",
      },
      {
        title: "Chân không — đốt nguồn, đế ở trên",
        body: "Bỏ dung môi. Trong buồng đã hút khí, thuyền kim loại chứa muối được đốt nóng. Hơi bay lên và bám vào đế lạnh hơn treo phía trên.",
        caption: "Bay hơi nhiệt trong chân không: nguồn sáng ở dưới, đế ở trên, các hạt là hơi tiền chất. Buồng vẽ dạng khung dây, không theo tỉ lệ thiết bị thật.",
      },
      {
        title: "Chân không — bám cả mặt gồ ghề",
        body: "Hạt hơi đi gần như thẳng trong chân không, nên phủ được lên bề mặt nhám của pin silicon có sẵn. Tài liệu dẫn tandem Oxford làm hoàn toàn bằng chân không đạt 27,2% năm 2026 [51].",
        note: warn("Mốc 27,2% được tài liệu đánh dấu là cần đối chiếu bài gốc [51]."),
        caption: "Đế silicon vẽ có gờ. Màng perovskite bám theo gờ chứ không chỉ nằm trên mặt phẳng. Số 27,2% là mốc tài liệu dẫn, không phải số đo của mô hình.",
      },
    ],
  },
  {
    id: "grow",
    chapter: "c4",
    section: "4.3",
    title: "Cách 4–5 — đơn tinh thể và chấm lượng tử",
    scene: "grow",
    cam: "default",
    steps: [
      {
        title: "Hòa tan khi còn nguội",
        body: "Kết tinh nhiệt độ ngược bắt đầu ngược với trực giác: MAPbX₃ tan nhiều hơn khi dung dịch lạnh, trong một số dung môi như GBL. Ta hòa hết muối ở nhiệt độ thấp, trong lọ kín [49].",
        caption: "Nhịp 1 của kết tinh nhiệt độ ngược: lọ dung dịch trong, chưa có tinh thể. Nhiệt độ nhãn còn thấp.",
      },
      {
        title: "Đun — độ tan giảm, mầm xuất hiện",
        body: "Tăng nhiệt. Độ tan giảm nên dung dịch trở nên quá bão hòa. Vài mầm tinh thể xuất hiện trong lòng chất lỏng, không cần đế quay.",
        caption: "Nhịp 2: lọ ấm lên (quầng cam). Những chấm tím là mầm vừa xuất hiện trong dung dịch.",
      },
      {
        title: "Giữ nóng cho tinh thể lớn",
        body: "Giữ nhiệt ổn định. Mầm ăn ion trong dung dịch và lớn thành tinh thể milimet, nhanh hơn khoảng 10 lần các cách nuôi cũ [49]. Không có ranh giới hạt như màng đa tinh thể.",
        caption: "Nhịp 3: một bát diện lớn trong lọ. Kích thước vẽ phóng đại so với lọ để thấy hình khối, không phải tinh thể thật chiếm hết thể tích.",
      },
      {
        title: "Dùng để đo và làm đầu dò",
        body: "Đơn tinh thể ít ranh giới hạt nên điện tích đi được rất xa — có báo cáo trên 175 µm [11]. Người ta dùng chúng cho đầu dò tia X và để đo tính chất gốc, không phải để cán thành tấm pin mái nhà.",
        caption: "Nhịp 4: tinh thể đặt trên đế đo. Mũi tên là tia X tới; tín hiệu ra ở điện cực. Đây là vai trò của đơn tinh thể, khác màng 0,5 µm của pin.",
      },
      {
        title: "Chích nóng — đun muối chì với phối tử",
        body: "Trong khí trơ, đun muối chì halide cùng oleic acid và oleylamine ở 140–200 °C. Phối tử sẽ bọc bề mặt hạt nano, không cho chúng dính vào nhau [45].",
        caption: "Nhịp 1 của chích nóng: bình cầu, dung dịch chì nóng. Chưa chích cesium nên chưa có màu phát quang.",
      },
      {
        title: "Chích cesium — mầm bùng cùng lúc",
        body: "Bơm nhanh dung dịch cesium oleate. Nồng độ vọt qua ngưỡng, hàng loạt mầm ra cùng một lúc theo mô hình LaMer [73]. Vì ra cùng lúc, các hạt có kích thước gần nhau.",
        more: "Nếu chích chậm, mầm ra trước sẽ lớn hơn mầm ra sau — màu phát sáng sẽ lẫn.",
        caption: "Nhịp 2: kim bơm cesium vào bình. Đám chấm cùng kích thước là mầm vừa bùng. LaMer là mô hình cổ điển của sự bùng mầm [73].",
      },
      {
        title: "Nước đá — chấm khoảng 10 nm, đủ màu",
        body: "Sau vài giây, nhúng bình vào nước đá để dừng lớn lên. Hạt khoảng 10 nm. Đổi I/Br/Cl thì màu phát đi từ đỏ 700 nm tới tím 410 nm [45].",
        caption: "Nhịp 3: dãy lọ phát quang 410–700 nm. Mỗi lọ là một thành phần halide, không phải bảy bước của cùng một phản ứng.",
      },
    ],
  },
  {
    id: "scale",
    chapter: "c4",
    section: "4.4",
    title: "Cách 6–7 — dao gạt, phủ khe, lên tấm lớn",
    scene: "scale",
    cam: "wide",
    steps: [
      {
        title: "Tế bào kỷ lục thường rất nhỏ",
        body: "Nhiều kỷ lục đo trên diện tích dưới 1 cm², có khi chỉ 0,05 cm². Lên tấm hàng mét vuông, một lỗ kim cũng có thể thành đường chập. Quay phủ không trải đều được cỡ đó, nên phải đổi cách đưa mực lên đế.",
        caption: "Trái: tế bào nhỏ. Phải: tấm lớn với một chấm cam là lỗ kim. Chú thích: một lỗ trên tấm lớn nguy hiểm hơn cùng một lỗ trên tế bào 0,05 cm² vì nó có thể chập cả mô-đun.",
      },
      {
        title: "Dao gạt trải mực",
        body: "Lưỡi dao cách đế một khe cố định và chạy dọc. Khe ấy đặt độ dày ướt. Mực perovskite bị kéo thành một dải đều, không cần đế quay [50].",
        caption: "Nhịp 1 của phủ dao gạt: lưỡi xám chạy sang phải, vệt tím là mực vừa được trải. Mũi tên là chiều dao. Độ dày vẽ phóng đại.",
      },
      {
        title: "Dao khí nitơ làm khô tức thì",
        body: "Ngay sau lưỡi dao, một khe thổi khí N₂. Dung môi bay rất nhanh, giống vai trò của chlorobenzene ở quay phủ: mầm ra cùng lúc trên cả chiều rộng tấm.",
        caption: "Nhịp 2: luồng lam là N₂. Vùng vừa bị thổi đổi sang đen vì kết tinh đồng loạt. Không còn giọt dung môi đối.",
      },
      {
        title: "Phủ khe — mực đi qua một khe hẹp",
        body: "Slot-die giữ đầu phủ đứng yên. Mực được bơm qua một khe, tạo cầu lỏng giữa đầu phủ và đế đang chạy. Tốc độ bơm và tốc độ đế cùng quyết định độ dày.",
        caption: "Đầu phủ khe ở trên, đế chạy bên dưới. Cầu chất lỏng nối hai bên là chỗ mực thoát ra. Đây là lát cắt ngang, không phải nhìn từ trên.",
      },
      {
        title: "Cuộn sang cuộn — chạy như in báo",
        body: "Đế nhựa đi từ cuộn này sang cuộn kia, qua đầu phủ khe rồi qua vùng sấy. Tài liệu ghi hiệu suất pin làm theo kiểu này khoảng 10–14% — thấp hơn tế bào nhỏ, nhưng làm được diện dài.",
        caption: "Hai trục cuộn, dải đế chạy liên tục, vùng tím là màng vừa phủ. Con số 10–14% là mức tài liệu ghi cho quy trình cuộn, không phải kỷ lục 27% của tế bào nhỏ.",
      },
      {
        title: "Chân không cho mặt lớn và mặt nhám",
        body: "Bay hơi chân không không phụ thuộc vào mực chảy. Nó phủ đều tấm lớn và cả bề mặt kim tự tháp của silicon. Ngành màn hình và bán dẫn đã có sẵn lò loại này.",
        caption: "Buồng chân không khổ lớn. Các hạt hơi rơi đều lên tấm. So với phủ ướt, không có vệt dao hay mép giọt.",
      },
    ],
  },
  {
    id: "apps",
    chapter: "c4",
    section: "4.5",
    title: "Cùng vật liệu ấy, nhiều ứng dụng",
    scene: "apps",
    cam: "default",
    steps: [
      {
        title: "Pin một lớp",
        body: "Tận dụng hấp thụ mạnh và quãng đường điện tích dài. Mức trưởng thành mà tài liệu ghi: thí điểm.",
      },
      {
        title: "Tandem perovskite/silicon",
        body: "Eg khoảng 1,7 eV, phủ được lên silicon có sẵn. Thí điểm, và đã chạm cửa thương mại.",
      },
      {
        title: "Pin trong nhà và pin dẻo",
        body: "Eg chỉnh được, phủ nhiệt độ thấp lên nhựa. Vẫn là thí điểm.",
      },
      {
        title: "Lớp chuyển màu cho màn hình",
        body: "Nano tinh thể phát sáng mạnh, màu thuần. Tài liệu xếp gần thương mại.",
      },
      {
        title: "Đèn PeLED",
        body: "PLQY cao. Tài liệu dẫn hiệu suất lượng tử ngoài khoảng 31% với màu lục [55], nhưng lam còn yếu, và nguồn ấy được đánh dấu cần kiểm chứng.",
      },
      {
        title: "Cảm biến quang",
        body: "Nhạy sáng, dòng tối thấp [56]. Còn trong phòng thí nghiệm.",
      },
      {
        title: "Đầu dò tia X và chất phát quang",
        body: "Pb và Cs nặng nên nuốt tia X mạnh [57][58]. Phòng thí nghiệm đến thí điểm.",
      },
      {
        title: "Nhiên liệu mặt trời",
        body: "Pin cấp điện áp cho tách nước hoặc khử CO₂ [59]. Vẫn là nghiên cứu.",
      },
    ],
  },
  {
    id: "market",
    chapter: "c4",
    section: "4.6",
    title: "Thị trường 2024–2026 — đường gần nhất là tandem",
    scene: "market",
    cam: "wide",
    steps: [
      {
        title: "6/2024 · Oxford PV",
        body: "Module tandem 60 tế bào, khoảng 1,6 m², hiệu suất 26,9% do Fraunhofer chứng nhận [61].",
      },
      {
        title: "4/2025 · LONGi 34,85%",
        body: "Pin tandem silicon/perovskite, NREL chứng nhận theo thông cáo được tài liệu dẫn [4].",
      },
      {
        title: "7/2025 · Caelux",
        body: "Giao lô kính phủ perovskite thương mại đầu tiên để gắn lên tấm silicon [62].",
      },
      {
        title: "2026 · Biểu đồ và module",
        body: "Tài liệu ghi biểu đồ NREL: một lớp 27,3%, tandem 35% [1]; bảng hiệu suất ghi module tandem LONGi 29,4% trên khoảng 1,7 m² [2].",
      },
      {
        title: "7/2026 · 35,5% chưa lên biểu đồ",
        body: "LONGi công bố 35,5%. Tài liệu nói rõ đó là thông cáo công ty, chưa lên biểu đồ NREL [5].",
        note: warn("Thông cáo và dự báo là tuyên bố của bên thứ ba, chưa phải số chứng nhận độc lập."),
      },
      {
        title: "Con đường gần nhất",
        body: "Đặt một lớp perovskite mỏng lên dây chuyền silicon sẵn có, kéo module từ khoảng 22–24% lên gần 30%. IDTechEx ước doanh thu khoảng 12 tỷ USD/năm vào 2035 [63] — đây là dự báo, không phải đo đạc.",
      },
    ],
  },
  {
    id: "lead",
    chapter: "c4",
    section: "4.7",
    title: "Chì — ít gam, nhưng phải khóa lại",
    scene: "lead",
    cam: "plot",
    steps: [
      {
        title: "Vài gam trên một mét vuông",
        body: "Một tấm pin perovskite chứa chì cỡ vài gam mỗi mét vuông, ít hơn nhiều so với một ắc quy ô tô. Nhưng chì hòa tan trong nước, nên vẫn phải ngăn rò rỉ.",
        caption: "Cột ngang là hiệu suất tài liệu dùng để so họ vật liệu, không phải bảng thị trường.",
      },
      {
        title: "Thiếc cùng nhóm, dễ bị oxy hóa",
        body: "Sn²⁺ dễ thành Sn⁴⁺, thừa lỗ trống, pin bị rò điện. Tài liệu nêu kỷ lục khoảng 16–17%. Cột Sn–Pb cao hơn, khoảng 24% trong hình minh họa của tài liệu, vẫn dưới chì 27,3%.",
        caption: "Cột thiếc thấp hơn chì vì Sn²⁺ dễ thành Sn⁴⁺ và pin bị rò.",
      },
      {
        title: "Perovskite kép",
        body: "Cs₂AgBiBr₆ thay hai Pb bằng một Ag và một Bi xếp xen kẽ. Bền, nhưng vùng cấm gián tiếp, hấp thụ kém, hiệu suất khoảng 6% [36].",
        caption: "Cs₂AgBiBr₆ bền hơn nhưng vùng cấm gián tiếp, hấp thụ kém, nên cột ngắn.",
      },
      {
        title: "Việc làm được ngay",
        body: "Giảm lượng chì, đóng gói chống rò, thêm lớp hấp phụ chì, và thiết kế để tái chế. Thay chì hoàn toàn vẫn còn kém xa về hiệu suất.",
        caption: "Việc làm được ngay là khóa chì lại. Cột ngắn không có nghĩa chất ấy đã thay được chì.",
        note: warn("Các cột là số tài liệu dùng để so sánh họ vật liệu, không phải một bảng xếp hạng thị trường."),
      },
    ],
  },
  {
    id: "pin",
    chapter: "c5",
    section: "5.1",
    title: "Bước 1 — chọn kiến trúc p-i-n",
    scene: "pin",
    cam: "stack",
    controls: ["architecture"],
    tune: [{ architecture: "nip" }, { architecture: "pin" }, { architecture: "pin" }, { architecture: "pin" }],
    legend: [
      { swatch: "etl", label: "Đường của điện tử" },
      { swatch: "htl", label: "Đường của lỗ trống" },
    ],
    steps: [
      {
        title: "n-i-p, ánh sáng vào cửa điện tử",
        body: "Kiến trúc kinh điển (regular): ánh sáng đi qua lớp vận chuyển điện tử trước. Nhiều pin đời đầu dùng lớp lỗ trống có phụ gia, như Spiro-OMeTAD pha muối lithium.",
      },
      {
        title: "p-i-n, ánh sáng vào cửa lỗ trống",
        body: "Kiến trúc đảo (inverted): ánh sáng đi qua lớp lỗ trống. Hầu hết pin trên 27% hiện là p-i-n, vì NiOₓ, SAM và C₆₀ bền hơn và ít tổn thất hơn [39].",
        caption: "Hai cách xếp cùng một lớp hấp thụ. p-i-n đón nắng ở cửa lỗ trống. Hầu hết pin trên 27% hiện là kiểu này [39].",
      },
      {
        title: "Đổi chiều ánh sáng",
        body: "Nút trên màn hình lật hai cách xếp. Cùng một lớp hấp thụ, thứ tự cửa chọn lọc đổi vai trò của mặt đón nắng.",
        caption: "Hình: bên trái n-i-p, bên phải p-i-n. Mũi tên vàng là chiều ánh sáng. Bấm nút để đổi kiểu đang được nói tới.",
      },
      {
        title: "Bậc thang năng lượng",
        body: "Các mức được xếp thành bậc. Điện tử chỉ có đường xuống dốc về phía ETL. Lỗ trống chỉ có đường về phía HTL. Không cần chúng «chọn đúng» bằng ý chí.",
        caption: "Hình: khối lam là cửa điện tử, khối cam là cửa lỗ trống. Các hạt chạy về đúng cửa của mình.",
      },
    ],
  },
  {
    id: "stack",
    chapter: "c5",
    section: "5.2",
    title: "Bước 2 — mỗi lớp một việc",
    scene: "stack",
    cam: "stack",
    controls: ["explode"],
    tune: [
      { explode: 0.15 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
      { explode: 0.85 },
    ],
    steps: [
      {
        title: "Không phát minh một chất mới",
        body: "Đề xuất chương 5 ghép những gì đã được chứng minh riêng lẻ, để chặn cùng lúc năm kẻ thù ở mục 3.9. Bấm từng lát trên mô hình để nhảy tới lời dẫn của lát đó.",
        caption: "Hình: chồng lớp của đề xuất. Lớp đang sáng là lớp đang được nói tới. Độ dày vẽ không theo tỉ lệ thật.",
      },
      {
        title: "Kính lọc UV",
        body: "Chặn tia cực tím trước khi vào pin. Nhắm kẻ thù số 4 [26].",
        caption: "Kính trên cùng chặn tia cực tím trước khi vào pin.",
      },
      {
        title: "ITO + NiOₓ + SAM",
        body: "Điện cực trong suốt, lớp lấy lỗ trống, và đơn lớp tự sắp xếp tạo mặt tiếp xúc ít khuyết tật [39].",
        caption: "ITO trong suốt lấy dòng. NiOₓ và SAM là cửa lỗ trống, ít phụ gia hơn các lớp lỗ trống đời đầu.",
      },
      {
        title: "Lớp 2D mặt dưới",
        body: "Thụ động hóa giao diện dưới, cản ion và đỡ tổn thất điện áp [30].",
        caption: "Lớp 2D mặt dưới lấp bẫy và cản ion ở giao diện dưới.",
      },
      {
        title: "Lõi Cs₀.₀₅FA₀.₉₅PbI₃",
        body: "Không MA nên bền nhiệt hơn. Thuần iod nên không tách pha kiểu Hoke. Hệ số dung hạn nằm vùng chịu được [19][22][24].",
        caption: "Lõi không có methylammonium, chỉ iod, thêm khoảng 5% cesium để khung khỏi đổ sang pha vàng.",
      },
      {
        title: "Lớp 2D mặt trên",
        body: "Lấp bẫy, kỵ nước, chặn ion. Nhắm ẩm và di chuyển ion [29][30].",
        caption: "Lớp 2D mặt trên kỵ nước và chặn ion đi lên.",
      },
      {
        title: "C₆₀",
        body: "Lấy điện tử, đưa chúng ra khỏi perovskite [39].",
        caption: "C₆₀ nhận điện tử và đưa chúng ra khỏi perovskite.",
      },
      {
        title: "SnO₂ phủ từng lớp nguyên tử",
        body: "ALD cho một lớp ô-xít mỏng nhưng đặc khít, ngăn iod đi lên ăn điện cực kim loại [39][40].",
        caption: "SnO₂ phủ từng lớp nguyên tử là một tấm chắn đặc, để iod không ăn điện cực kim loại.",
      },
      {
        title: "Điện cực Cu/Ag",
        body: "Thu điện tử sau khi chúng đã qua rào SnO₂. Kim loại không được chạm trực tiếp dòng iod.",
        caption: "Kim loại chỉ gặp điện tử sau khi chúng đã qua rào SnO₂.",
      },
      {
        title: "Kính–kính và gioăng mép",
        body: "Đóng gói kín, chặn ẩm và oxy [38]. Kéo thanh «tách lớp» để xem từng lát; hình không theo tỉ lệ bề dày thật.",
        caption: "Kéo thanh tách lớp để xem từng lát. Kính dưới và gioăng mép khóa ẩm với oxy.",
      },
    ],
  },
  {
    id: "why",
    chapter: "c5",
    section: "5.3",
    title: "Bước 3 — vì sao đúng những chất ấy",
    scene: "why",
    cam: "default",
    steps: [
      {
        title: "Bỏ MA",
        body: "Methylammonium bay hơi ở nhiệt độ tấm pin ngoài trời, khoảng 65–85 °C. FA và Cs bền nhiệt hơn nhiều.",
      },
      {
        title: "Chỉ iod",
        body: "Tránh hiệu ứng Hoke. Eg khoảng 1,53 eV vẫn gần tối ưu cho pin một lớp.",
      },
      {
        title: "5% cesium",
        body: "Kéo hệ số dung hạn trung bình của FAPbI₃ về giữa vùng bền, hạn chế pha vàng lục giác.",
      },
      {
        title: "2D cả hai mặt",
        body: "Nhóm Azmi (2024) cho thấy kẹp 2D hai mặt vừa tăng điện áp vừa tăng độ bền [30]. Cùng hướng nghiên cứu đã vượt phép thử 85 °C / 85% độ ẩm năm 2022 [29].",
      },
      {
        title: "Rào ALD",
        body: "SnO₂ đặc khít chặn iod khuếch tán tới điện cực kim loại — một kiểu hỏng phổ biến của pin p-i-n.",
      },
    ],
  },
  {
    id: "verify",
    chapter: "c5",
    section: "5.4",
    title: "Bước 4 — chứng minh bằng chuẩn ISOS",
    scene: "verify",
    cam: "plot",
    steps: [
      {
        title: "Một con số bền phải kèm điều kiện",
        body: "Cộng đồng đã thống nhất bộ giao thức ISOS, đăng trên Nature Energy năm 2020 [38]. Không có điều kiện thử thì một câu «bền 1000 giờ» không nói được gì.",
        caption: "Trục ngang là giờ chiếu, trục dọc là phần trăm hiệu suất còn lại.",
      },
      {
        title: "Mức đề xuất: ISOS-L-3",
        body: "Chiếu sáng liên tục, nhiệt độ 65–85 °C, có độ ẩm. Ba mũi tên trên mô hình là đèn, nhiệt và ẩm cùng lúc.",
        caption: "Mức đề xuất là đèn, nhiệt 65–85 °C và ẩm cùng lúc — ISOS-L-3.",
      },
      {
        title: "Thước T80",
        body: "T80 là thời gian cho tới khi hiệu suất còn 80% giá trị ban đầu. Đường đỏ là pin chưa tối ưu. Đường xanh là mục tiêu thiết kế.",
        caption: "Đường cam giảm nhanh. Đường lục là mục tiêu thiết kế, chưa phải số đo của đúng tổ hợp này.",
      },
      {
        title: "Mục tiêu của đề xuất",
        body: "Hiệu suất ban đầu ≥ 26% trên tế bào 1 cm². Giữ trên 90% sau 2000 giờ ISOS-L-3. Dấu sao nhắc mức tài liệu nêu cho pin 27,3%: khoảng 93% sau 2000 giờ [39] — đó là số đã báo cáo cho một pin khác, không phải cho đúng tổ hợp này.",
        caption: "Mốc 93% sau 2000 giờ là số đã báo cáo cho một pin khác [39], đặt lên hình để có thước so.",
      },
      {
        title: "Phép đo đi kèm",
        body: "PLQY để theo dõi Voc. Nhiễu xạ tia X để xem pha còn nguyên không. Phổ khối hoặc XPS để bắt iod đã bò tới điện cực hay chưa.",
        caption: "PLQY, nhiễu xạ tia X và phổ khối là ba phép đo đi kèm. Chúng không vẽ thành đường thứ ba.",
      },
      {
        title: "Bỏ lần lượt từng lớp",
        body: "Đối chứng: tháo lớp 2D trên, lớp 2D dưới, rồi lớp ALD, để biết mỗi lớp đóng góp bao nhiêu. Không làm đối chứng thì không biết lớp nào đang gánh.",
        caption: "Tháo lần lượt lớp 2D và lớp ALD mới biết mỗi lớp đóng góp bao nhiêu.",
      },
      {
        title: "Và đây vẫn là giả thuyết",
        body: "Từng mảnh đã có bài báo. Chưa có nghiên cứu nào kiểm chứng đúng tổ hợp này. Các lớp có thể cãi nhau: lớp 2D làm giảm dẫn, quy trình ALD có thể hỏng bề mặt perovskite.",
        caption: "Nhãn giả thuyết nghĩa là hình này chưa phải một pin đã chế tạo.",
        note: idea(
          "Đừng đọc chương 5 như một bản thiết kế đã chạy ra pin. Tài liệu gọi đúng tên của nó: một giả thuyết hợp lý.",
        ),
      },
    ],
  },
  {
    id: "finale",
    chapter: "c6",
    section: "6",
    title: "Bảy kết luận của cả hành trình",
    scene: "finale",
    cam: "wide",
    steps: [
      {
        title: "Kết luận 1 — Bốn bước biến ánh sáng thành điện",
        body: "Photon rơi vào lớp tím. Điện tử đi lên vùng dẫn, lỗ trống ở lại, rồi hai hạt ra hai cửa. Không có máy quay, không đốt nhiên liệu.",
        caption: "Hình: một photon, một lần tách, hai mũi tên ra mạch ngoài. Đây là cả pin mặt trời, thu gọn vào bốn động tác.",
      },
      {
        title: "Kết luận 2 — ABX₃ là ba núm vặn trên một khung",
        body: "A là cation lớn trong hốc, B là chì hoặc thiếc ở tâm bát diện, X là I, Br hoặc Cl ở đỉnh. Đổi một ion là đổi vùng cấm và độ bền.",
        caption: "Hình: một ô mạng. Nhãn A, B, X là ba núm vặn, không phải ba chất rời nhau.",
      },
      {
        title: "Kết luận 3 — Tổ hợp hiếm: 3,8% lên 27,3% rồi tandem",
        body: "Vùng cấm thẳng, hấp thụ mạnh trong lớp mỏng cỡ 0,5 µm, điện tích đi được xa hơn bề dày lớp, và chế tạo dưới 150 °C. Vì vậy hiệu suất tài liệu dẫn đi từ 3,8% năm 2009 lên 27,3% một lớp, và tandem được ghi 35% [1][7].",
        caption: "Hình: hai mốc trên cùng một cột thời gian. 27,3% là mức một lớp được tài liệu dẫn, không phải chiều cao của tandem.",
      },
      {
        title: "Kết luận 4 — Mạng mềm là cả ưu điểm lẫn năm kẻ thù",
        body: "Cùng liên kết yếu cho tinh thể tự vá và cho ion iod nhảy, cho ẩm, oxy, nhiệt và tia cực tím làm hỏng pin. Năm kẻ thù ấy không phải chuyện phụ của hiệu suất cao.",
        caption: "Hình: tinh thể ở giữa, năm chấm cảnh báo quay quanh. Mỗi chấm là một kẻ thù đã gặp ở mục 3.9.",
      },
      {
        title: "Kết luận 5 — Bảy cách chế tạo, một quy tắc mầm",
        body: "Quay phủ, hai bước, chân không, kết tinh nhiệt độ ngược, chích nóng, dao gạt và phủ khe khác nhau ở chỗ ép mầm ra. Chúng giống nhau ở quy tắc: mầm phải xuất hiện cùng lúc, rồi lớn đều, nếu không thì thủng lỗ kim.",
        caption: "Hình: nhiều mầm cùng cỡ bung ra, rồi khép thành một màng. Ảnh thực của từng cách nằm ở chương phương pháp chế tạo.",
      },
      {
        title: "Kết luận 6 — Đề xuất cải tiến chặn kẻ thù bằng từng lớp",
        body: "Không cần một chất mới. Kính lọc UV, cửa lỗ trống NiOₓ và SAM, lớp 2D hai mặt, lõi FA/Cs thuần iod, C₆₀, rào SnO₂ và kính kín — mỗi lớp gánh một kẻ thù. Đây vẫn là giả thuyết ghép từ các bài đã công bố, chưa phải pin đã làm.",
        caption: "Hình: chồng lớp của đề xuất. Lớp đang sáng là lớp đang được nói tới. Độ dày vẽ không theo tỉ lệ thật.",
      },
      {
        title: "Kết luận 7 — Việc còn lại là độ bền; đường gần là tandem",
        body: "Số bền chỉ có nghĩa khi kèm điều kiện. Mục tiêu đề xuất là giữ trên 90% sau 2000 giờ ISOS-L-3, trên tế bào khoảng 1 cm², rồi mới nói tới tấm lớn. Con đường thương mại gần nhất vẫn là trải perovskite lên silicon có sẵn.",
        caption: "Hình: lớp perovskite mỏng nằm trên lát silicon dày. Đồng hồ là phép thử T80, chưa phải một pin đã qua 2000 giờ.",
      },
    ],
  },
  {
    id: "quiz",
    chapter: "c6",
    section: "Tự kiểm",
    title: "Tự kiểm — sáu câu ôn cả hành trình",
    scene: "quiz",
    cam: "default",
    steps: [
      {
        title: "Câu 1 · Photon 900 nm",
        body: "Vì sao photon hồng ngoại 900 nm đi xuyên qua lớp MAPbI₃? Gợi ý của tài liệu: tính E = 1240/λ rồi so với 1,57 eV.",
      },
      {
        title: "Câu 2 · Đếm trong ô lập phương",
        body: "Đếm số ion A, B, X trong một ô cơ sở. Vì sao ion ở góc chỉ tính một phần tám?",
      },
      {
        title: "Câu 3 · Hai pha vàng, hai lý do",
        body: "CsPbI₃ và FAPbI₃ cùng dễ chuyển sang pha vàng, nhưng vì hai lý do ngược nhau. Giải bằng hệ số dung hạn.",
      },
      {
        title: "Câu 4 · PLQY và Voc",
        body: "Nếu PLQY giảm từ 1% xuống 0,01%, Voc giảm khoảng bao nhiêu?",
      },
      {
        title: "Câu 5 · Vượt 33,7%",
        body: "Vì sao pin tandem có thể vượt giới hạn Shockley–Queisser của pin một lớp?",
      },
      {
        title: "Câu 6 · Chặn ion iod",
        body: "Trong đề xuất chương 5, lớp nào chặn kẻ thù di chuyển ion, và bằng cách nào?",
      },
    ],
  },
];

export const chapters: Chapter[] = [
  { id: "c0", num: "0", title: "Mở đầu cùng một hành trình", lessonIds: ["intro"] },
  {
    id: "c1",
    num: "1",
    title: "Từ ánh sáng đến điện",
    lessonIds: ["foundation", "photon", "bands", "cell", "metrics", "sq", "silicon", "ideal"],
  },
  {
    id: "c2",
    num: "2",
    title: "Khung ABX₃",
    lessonIds: ["origin", "parts", "build", "tolerance", "phases", "orbitals", "alloy", "nano", "props"],
  },
  {
    id: "c3",
    num: "3",
    title: "Vì sao hợp làm pin",
    lessonIds: ["race", "absorb", "diffusion", "exciton", "defects", "tune", "ink", "plqy", "compare", "enemies"],
  },
  {
    id: "c4",
    num: "4",
    title: "Phương pháp chế tạo",
    lessonIds: ["methods", "nucleation", "films", "grow", "scale", "apps", "market", "lead"],
  },
  { id: "c5", num: "5", title: "Đề xuất cải tiến", lessonIds: ["pin", "stack", "why", "verify"] },
  { id: "c6", num: "6", title: "Kết luận", lessonIds: ["finale", "quiz"] },
  { id: "cA", num: "A", title: "Phụ lục", lessonIds: ["glossary", "refs"] },
];

export type GlossaryEntry = {
  vi: string;
  en: string;
  blurb: string;
  focus: "A" | "B" | "X" | "band" | "cell" | "defect" | "nano";
};

export const GLOSSARY: GlossaryEntry[] = [
  { vi: "Bán dẫn", en: "semiconductor", blurb: "Chất có vùng cấm vừa phải, dẫn điện khi được kích thích.", focus: "band" },
  { vi: "Bát diện", en: "octahedron", blurb: "Khối tám mặt. BX₆ là viên gạch của perovskite.", focus: "B" },
  { vi: "Bẫy nông / bẫy sâu", en: "shallow / deep trap", blurb: "Mức năng lượng do khuyết tật, sát mép vùng hoặc giữa vùng cấm.", focus: "defect" },
  { vi: "Bờ hấp thụ", en: "absorption edge", blurb: "Vùng năng lượng nơi độ hấp thụ tăng vọt.", focus: "band" },
  { vi: "Dung thứ khuyết tật", en: "defect tolerance", blurb: "Khuyết tật phổ biến ít gây hại.", focus: "defect" },
  { vi: "Điện áp hở mạch", en: "open-circuit voltage, Voc", blurb: "Điện áp lớn nhất của pin khi không lấy dòng.", focus: "cell" },
  { vi: "Độ dài khuếch tán", en: "diffusion length", blurb: "Quãng đường trung bình của hạt tải trước khi tái hợp.", focus: "cell" },
  { vi: "Exciton", en: "exciton", blurb: "Cặp điện tử và lỗ trống còn hút nhau.", focus: "band" },
  { vi: "Giếng lượng tử", en: "quantum well", blurb: "Lớp mỏng nhốt điện tử theo một chiều.", focus: "nano" },
  { vi: "Hệ số dung hạn", en: "tolerance factor", blurb: "So kích thước ion A với hốc trống của khung.", focus: "A" },
  { vi: "Hiệu suất chuyển đổi", en: "power conversion efficiency", blurb: "Tỉ lệ năng lượng ánh sáng biến thành điện.", focus: "cell" },
  { vi: "Khuếch tán", en: "diffusion", blurb: "Chuyển động ngẫu nhiên của hạt.", focus: "cell" },
  { vi: "Lỗ trống", en: "hole", blurb: "Chỗ thiếu điện tử, mang điện dương.", focus: "band" },
  { vi: "ETL / HTL", en: "electron / hole transport layer", blurb: "Lớp chọn lọc chỉ cho một loại hạt đi qua.", focus: "cell" },
  { vi: "Nano tinh thể", en: "nanocrystal", blurb: "Tinh thể cỡ vài nm đến vài chục nm.", focus: "nano" },
  { vi: "Phối tử", en: "ligand", blurb: "Phân tử bám trên bề mặt nano tinh thể.", focus: "nano" },
  { vi: "Pin song song", en: "tandem cell", blurb: "Nhiều lớp hấp thụ với vùng cấm khác nhau.", focus: "cell" },
  { vi: "Ranh giới hạt", en: "grain boundary", blurb: "Đường tiếp giáp giữa hai hạt tinh thể.", focus: "defect" },
  { vi: "Tách pha", en: "phase segregation", blurb: "Hỗn hợp tự tách thành vùng giàu từng thành phần.", focus: "X" },
  { vi: "Tái hợp", en: "recombination", blurb: "Điện tử gặp lỗ trống và mất năng lượng.", focus: "band" },
  { vi: "Tạo mầm", en: "nucleation", blurb: "Giai đoạn tinh thể tí hon xuất hiện.", focus: "nano" },
  { vi: "Thụ động hóa", en: "passivation", blurb: "Phủ phân tử để lấp bẫy bề mặt.", focus: "defect" },
  { vi: "Tổn thất nhiệt hóa", en: "thermalization loss", blurb: "Năng lượng dư của photon biến thành nhiệt.", focus: "band" },
  { vi: "Vùng cấm", en: "bandgap", blurb: "Năng lượng tối thiểu để giải phóng điện tử.", focus: "band" },
  { vi: "Vùng cấm thẳng / gián tiếp", en: "direct / indirect bandgap", blurb: "Hấp thụ mạnh, hoặc phải mượn dao động mạng nên hấp thụ yếu.", focus: "band" },
  { vi: "Vùng dẫn / vùng hóa trị", en: "conduction / valence band", blurb: "Tầng trên và tầng dưới của thang năng lượng.", focus: "band" },
];

export type RefItem = { n: string; cite: string };

export const REFS: RefItem[] = [
  { n: "1", cite: "NREL. Best Research-Cell Efficiency Chart, Rev. 03-19-2026." },
  { n: "2", cite: "Green, M. A. et al. Solar cell efficiency tables (Version 68). Joule 2026. DOI: 10.1016/j.joule.2026.102494" },
  { n: "4", cite: "LONGi. 34,85% tandem silicon/perovskite, thông cáo 15/4/2025." },
  { n: "5", cite: "LONGi. 35,5%, thông cáo 14/7/2026 — tài liệu ghi chưa lên biểu đồ NREL." },
  { n: "7", cite: "Kojima, Miyasaka et al. J. Am. Chem. Soc. 2009, 131, 6050. DOI: 10.1021/ja809598r" },
  { n: "9", cite: "Stranks et al. Science 2013, 342, 341. DOI: 10.1126/science.1243982" },
  { n: "10", cite: "Xing et al. Science 2013, 342, 344. DOI: 10.1126/science.1243167" },
  { n: "11", cite: "Dong et al. Science 2015, 347, 967. L > 175 µm. DOI: 10.1126/science.aaa5760" },
  { n: "12", cite: "Shi et al. Science 2015, 347, 519. DOI: 10.1126/science.aaa2725" },
  { n: "13", cite: "De Wolf et al. J. Phys. Chem. Lett. 2014, 5, 1035. Urbach. DOI: 10.1021/jz500279b" },
  { n: "14", cite: "Miyata et al. Nature Physics 2015, 11, 582. Exciton. DOI: 10.1038/nphys3357" },
  { n: "15", cite: "Yin, Shi, Yan. Appl. Phys. Lett. 2014, 104, 063903. DOI: 10.1063/1.4864778" },
  { n: "16", cite: "Yin, Shi, Yan. Adv. Mater. 2014, 26, 4653. DOI: 10.1002/adma.201306281" },
  { n: "18", cite: "Noh et al. Nano Lett. 2013, 13, 1764. Trộn halide. DOI: 10.1021/nl400349b" },
  { n: "19", cite: "Eperon et al. Energy Environ. Sci. 2014, 7, 982. FAPbI₃." },
  { n: "20", cite: "Goldschmidt, V. M. Naturwissenschaften 1926, 14, 477." },
  { n: "21", cite: "Bartel et al. Science Advances 2019, 5, eaav0693. DOI: 10.1126/sciadv.aav0693" },
  { n: "22", cite: "Saliba et al. Energy Environ. Sci. 2016, 9, 1989. Triple cation. DOI: 10.1039/C5EE03874J" },
  { n: "24", cite: "Hoke et al. Chem. Sci. 2015, 6, 613. Tách pha. DOI: 10.1039/C4SC03141E" },
  { n: "25", cite: "Eames et al. Nat. Commun. 2015, 6, 7497. Ion iod. DOI: 10.1038/ncomms8497" },
  { n: "26", cite: "Leijtens et al. Nat. Commun. 2013, 4, 2885. UV và TiO₂. DOI: 10.1038/ncomms3885" },
  { n: "27", cite: "Aristidou et al. Nat. Commun. 2017, 8, 15218. Oxy. Tài liệu ghi cần kiểm chứng." },
  { n: "29", cite: "Azmi et al. Science 2022, 376, 73. 85 °C/85% RH. DOI: 10.1126/science.abm5784" },
  { n: "30", cite: "Azmi et al. Nature 2024, 628, 93. 2D hai mặt. DOI: 10.1038/s41586-024-07189-3" },
  { n: "34", cite: "He et al. Nature Nanotechnology 2025. Sn, 16,65% — tài liệu ghi cần kiểm chứng." },
  { n: "36", cite: "Cs₂AgBiBr₆ hydrogenated. Nat. Commun. 2022, 13. DOI: 10.1038/s41467-022-31016-w" },
  { n: "38", cite: "Khenkin et al. Nature Energy 2020, 5, 35. ISOS. DOI: 10.1038/s41560-019-0529-5" },
  { n: "39", cite: "Viewpoint, ACS Energy Lett. 2026, 11, 2378. Quy tắc thiết kế pin một lớp." },
  { n: "40", cite: "LONGi et al. Nature 2024. Thụ động hóa giao diện tandem — tài liệu ghi cần kiểm chứng." },
  { n: "41", cite: "Pin thiếc–chì không thiếc fluoride. Nat. Commun. PMC12796181." },
  { n: "43", cite: "Galkowski et al. Energy Environ. Sci. 2016, 9, 962. Exciton MA và FA." },
  { n: "45", cite: "Protesescu et al. Nano Lett. 2015, 15, 3692. CsPbX₃ nanocrystal. DOI: 10.1021/nl5048779" },
  { n: "46", cite: "Burschka et al. Nature 2013, 499, 316. Lắng đọng hai bước. DOI: 10.1038/nature12340" },
  { n: "47", cite: "Jeon et al. Nature Materials 2014, 13, 897. Dung môi đối. DOI: 10.1038/nmat4014" },
  { n: "49", cite: "Saidaminov et al. Nat. Commun. 2015, 6, 8586. Kết tinh nhiệt độ ngược." },
  { n: "50", cite: "Khorasani et al. Adv. Energy Sustain. Res. 2024. Phủ diện tích lớn." },
  { n: "51", cite: "Shen et al. Nature Materials 2026. Tandem chân không — tài liệu ghi cần kiểm chứng." },
  { n: "55", cite: "PeLED, EQE lục. Tài liệu dẫn Wikipedia và yêu cầu kiểm chứng bài gốc." },
  { n: "56", cite: "Wang et al. Nanomaterials 2022, 12, 4390. Cảm biến quang." },
  { n: "57", cite: "He et al. Adv. Funct. Mater. 2022, 2112925. Đầu dò tia X CsPbBr₃." },
  { n: "58", cite: "Yang et al. Nat. Commun. 2024, 15. Chất phát quang nano CsPbBr₃." },
  { n: "59", cite: "Nhiên liệu mặt trời. Inorg. Chem. Front. 2023. DOI: 10.1039/d3qi00714f" },
  { n: "61", cite: "Optics.org, 2024. Oxford PV, module 26,9%." },
  { n: "62", cite: "Solar Power World, 2025. Caelux giao kính phủ perovskite." },
  { n: "63", cite: "IDTechEx / Perovskite-Info. Dự báo doanh thu ~12 tỷ USD/năm vào 2035." },
  { n: "64", cite: "Shannon, R. D. Acta Cryst. 1976, A32, 751. Bán kính ion." },
  { n: "65", cite: "Kieslich, Sun, Cheetham. Chem. Sci. 2014, 5, 4712. Bán kính hiệu dụng MA, FA." },
  { n: "67", cite: "Poglitsch, Weber. J. Chem. Phys. 1987, 87, 6373. Ba pha MAPbI₃." },
  { n: "68", cite: "Filip et al. Nat. Commun. 2014, 5, 5757. Nghiêng bát diện và Eg." },
  { n: "69", cite: "Stoumpos et al. Chem. Mater. 2016, 28, 2852. Chuỗi 2D." },
  { n: "70", cite: "Shockley, Queisser. J. Appl. Phys. 1961, 32, 510." },
  { n: "71", cite: "Rau, U. Phys. Rev. B 2007, 76, 085303. Thuận nghịch pin và đèn." },
  { n: "73", cite: "LaMer, Dinegar. J. Am. Chem. Soc. 1950, 72, 4847. Bùng mầm." },
  { n: "77", cite: "D'Innocenzo et al. Nat. Commun. 2014, 5, 3586. Exciton và điện tích tự do." },
];

export const QUIZ: {
  prompt: string;
  options: string[];
  answer: number;
  why: string;
}[] = [
  {
    prompt: "Photon 900 nm gặp MAPbI₃ thì sao?",
    options: [
      "Bị phản xạ vì quá mạnh",
      "E ≈ 1,38 eV, thấp hơn Eg ≈ 1,57 eV, nên đi xuyên",
      "Bị hấp thụ hết vì nằm trong vùng nhìn thấy",
      "Chỉ bị chặn nếu lớp dày hơn 180 µm",
    ],
    answer: 1,
    why: "1240/900 ≈ 1,38 eV. MAPbI₃ có Eg khoảng 1,57 eV. Photon yếu hơn vùng cấm không tạo được cặp điện tích.",
  },
  {
    prompt: "Trong một ô lập phương có bao nhiêu A, B, X?",
    options: [
      "8 A, 6 B, 1 X",
      "1 A, 1 B, 3 X — góc chỉ tính 1/8 vì tám ô dùng chung",
      "1 A, 3 B, 1 X",
      "4 A, 4 B, 4 X",
    ],
    answer: 1,
    why: "Góc thuộc về 8 ô, tâm mặt thuộc về 2 ô, tâm ô thuộc trọn về một ô. 8×1/8 + 1 + 6×1/2 = ABX₃.",
  },
  {
    prompt: "Vì sao CsPbI₃ và FAPbI₃ đều dễ hóa vàng?",
    options: [
      "Cả hai đều có t ≈ 1,00",
      "Cs quá nhỏ (t ≈ 0,85) nên sụp cạnh; FA quá lớn (t ≈ 0,99) nên chuyển lục giác dùng chung mặt",
      "Cả hai đều mất chì khi gặp nước",
      "Vì cùng vùng cấm 1,12 eV",
    ],
    answer: 1,
    why: "Hai lý do ngược nhau quanh hốc trống: A nhỏ làm khung sụp, A lớn làm khung chuyển sang cách nối khác.",
  },
  {
    prompt: "PLQY từ 1% xuống 0,01%. Voc đổi thế nào?",
    options: [
      "Tăng khoảng 60 mV",
      "Giảm khoảng 120 mV",
      "Không đổi vì Voc chỉ phụ thuộc Eg",
      "Giảm một nửa",
    ],
    answer: 1,
    why: "Hai lần chia mười. Mỗi lần khoảng 60 mV, vì (kT/q)·ln(10) ≈ 60 mV ở 300 K.",
  },
  {
    prompt: "Tandem vượt 33,7% bằng cách nào?",
    options: [
      "Dùng lớp dày hơn silicon",
      "Nhiều lớp có Eg khác nhau, mỗi lớp xử lý một phần phổ, nên không còn là pin một lớp",
      "Bỏ tái hợp bằng cách tắt ánh sáng",
      "Đo dưới phổ mạnh hơn AM1.5G nên trần đổi",
    ],
    answer: 1,
    why: "Trần 33,7% là cho một vùng cấm. Xếp chồng các vùng cấm khác nhau né được đồng thời cả tổn thất nhiệt hóa và photon bỏ đi.",
  },
  {
    prompt: "Lớp nào trong đề xuất chặn ion iod?",
    options: [
      "Chỉ kính lọc UV",
      "Lớp 2D hai mặt chặn và kỵ nước; SnO₂ ALD thành rào đặc trước điện cực; lõi thuần iod giảm tách pha",
      "Chỉ điện cực bạc",
      "Lớp Spiro-OMeTAD pha lithium",
    ],
    answer: 1,
    why: "Tài liệu gán kẻ thù số 5 cho lớp 2D, rào ALD, và việc giảm chỗ trống. UV kính nhắm kẻ thù khác.",
  },
];

function glossaryLesson(): Lesson {
  return {
    id: "glossary",
    chapter: "cA",
    section: "Phụ lục A",
    title: "Bảng màu thuật ngữ Việt – Anh",
    scene: "glossary",
    cam: "crystal",
    steps: GLOSSARY.map((g) => ({
      title: g.vi,
      body: `${g.en}. ${g.blurb}`,
    })),
  };
}

function refsLesson(): Lesson {
  return {
    id: "refs",
    chapter: "cA",
    section: "Phụ lục B",
    title: "Nguồn được trích khi rê chuột vào [n]",
    scene: "refs",
    cam: "wide",
    steps: REFS.map((r) => ({
      title: `[${r.n}]`,
      body: r.cite,
    })),
  };
}

lessons.push(glossaryLesson(), refsLesson());

const byId = new Map(lessons.map((l) => [l.id, l]));

export function getLesson(id: string): Lesson {
  return byId.get(id) ?? lessons[0]!;
}

export function lessonIndex(id: string): number {
  return lessons.findIndex((l) => l.id === id);
}

export function nextLessonId(id: string): string | null {
  const i = lessonIndex(id);
  return i >= 0 && i < lessons.length - 1 ? lessons[i + 1]!.id : null;
}

export function prevLessonId(id: string): string | null {
  const i = lessonIndex(id);
  return i > 0 ? lessons[i - 1]!.id : null;
}
