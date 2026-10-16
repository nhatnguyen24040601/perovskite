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
  cam: "default" | "crystal" | "wide" | "plot" | "stack" | "module";
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
    cam: "module",
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
    tune: [{ wavelength: 500 }, { wavelength: 700 }, { wavelength: 1100 }],
    legend: [{ swatch: "sun", label: "Photon" }],
    steps: [
      {
        title: "Sóng, và cũng là hạt",
        body: "Ánh sáng là dòng các hạt năng lượng gọi là photon. Năng lượng mỗi photon phụ thuộc màu, tức bước sóng: xanh tím mang nhiều năng lượng hơn đỏ.",
        caption: "Hai sóng cùng kiểu. Sóng đỏ dài, mỗi photon mang ít năng lượng. Sóng xanh tím ngắn, mỗi photon mang nhiều năng lượng hơn.",
      },
      {
        title: "Công thức tiện dụng",
        body: "E (eV) ≈ 1240 / λ (nm). Ánh sáng lục 500 nm ≈ 2,48 eV. Đỏ 700 nm ≈ 1,77 eV. Hồng ngoại gần 1100 nm ≈ 1,13 eV.",
        caption: "Khoảng cách giữa hai đỉnh kề nhau là bước sóng λ. Cột bên phải là năng lượng E ≈ 1240/λ.",
      },
      {
        title: "Phổ mặt trời trải rất rộng",
        body: "Phổ mặt trời đi từ tử ngoại, qua vùng nhìn thấy, tới hồng ngoại. Gần một nửa năng lượng nằm ở hồng ngoại — nơi nhiều vật liệu hấp thụ bỏ qua.",
        caption: "Phổ điện từ xếp theo năng lượng tăng: radio, vi sóng, hồng ngoại, nhìn thấy, tử ngoại, tia X, tia gamma. Gạch vàng là nắng tới mặt đất. Gần nửa năng lượng nắng nằm ở hồng ngoại.",
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
        caption:
          "Thước chung: mỗi vạch 1 eV, cột vàng là cùng một photon mặt trời cao đúng 1,5 eV. Kim loại: hai vùng chồng nhau, Eg = 0, điện tử đã tự do. Bán dẫn: Eg ≈ 1,5 eV, nằm trong khoảng 0,5–3 eV, đúng bằng photon nên điện tử lên tới vùng dẫn — pin mặt trời dùng chất này. Cách điện: vùng dẫn bắt đầu khoảng 5 eV, trên vạch 4 eV; photon dừng ở 1,5 eV và điện tử rơi lại.",
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
        body: "Ánh sáng chiếu từ phía trên xuống. Photon tím có năng lượng lớn hơn hoặc bằng vùng cấm Eg thì bị lớp hấp thụ nuốt, nên nó dừng giữa lớp đó. Photon đỏ có năng lượng nhỏ hơn Eg không mở được vùng cấm, nên không bị nuốt: nó đi xuyên lớp hấp thụ và bị lãng phí, không sinh ra điện.",
        caption:
          "Lát cắt pin, ánh sáng từ trên. Quả cầu tím dừng giữa lớp hấp thụ (E ≥ Eg). Quả cầu đỏ không dừng: nó xuyên lớp hấp thụ rồi mờ dần phía dưới pin (E < Eg), nên không sinh cặp.",
      },
      {
        title: "Bước 2 — Sinh cặp điện tử–lỗ trống",
        body: "Photon bị nuốt giao năng lượng cho một điện tử ở vùng hóa trị. Điện tử nhảy lên vùng dẫn và dừng đúng ở đó, chưa sang HTL hay ETL. Chỗ vừa trống trên vùng hóa trị là lỗ trống, mang điện dương, và ở lại. Phần năng lượng của photon cao hơn Eg không kéo điện tử lên thêm; nó tách ngang thành nhiệt. Đó là tổn thất nhiệt hóa.",
        caption:
          "Trong lớp hấp thụ: vạch cam là vùng hóa trị, vạch lam là vùng dẫn, khoảng giữa là Eg. Photon vàng rơi tới vạch cam rồi tắt. Điện tử lam nhảy lên đúng vạch lam và dừng. Lỗ trống cam ở lại vạch dưới. Hạt cam bay sang trái là phần dư thành nhiệt, không phải một mức năng lượng cao hơn.",
      },
      {
        title: "Bước 3 — Tách trước khi tái hợp",
        body: "Điện tử âm và lỗ trống dương hút nhau. Nếu chúng gặp lại trong lớp hấp thụ, cặp mất: năng lượng thành nhiệt hoặc ánh sáng, gọi là tái hợp, và không có dòng. Pin silicon dùng tiếp giáp p-n để ngăn việc này. Pin perovskite dùng hai lớp chọn lọc. HTL ở trên chỉ nhận lỗ trống — điện tử đi lên thì bị chặn. ETL ở dưới chỉ nhận điện tử — lỗ trống đi xuống thì bị chặn. Hạt đúng cửa thì ra hai phía trước khi kịp gặp lại.",
        caption:
          "Nhịp 1: điện tử và lỗ trống tiến vào nhau, chạm giữa lớp hấp thụ, rồi một chớp sáng và cả hai biến mất — tái hợp. Nhịp 2, bên trái: lỗ trống đi lên vào HTL, điện tử đi xuống vào ETL. Bên phải: điện tử đi lên thì dừng trước HTL, lỗ trống đi xuống thì dừng trước ETL. Hình vẽ lớp chọn lọc của perovskite, không vẽ tiếp giáp p-n của silicon.",
      },
      {
        title: "Bước 4 — Thu vào mạch ngoài",
        body: "Lỗ trống đã tách thì đi tiếp lên điện cực trong suốt ITO. Điện tử đi tiếp xuống điện cực kim loại. Nối hai điện cực bằng dây qua một bóng đèn: điện tử rời kim loại, chạy trên dây, qua đèn, rồi tới ITO để gặp lỗ trống. Chỗ gặp lại ấy khép dòng — đó là dòng điện có ích. Đèn sáng vì điện tử chạy trên dây, không phải vì photon đập vào đèn.",
        caption:
          "Lỗ trống cam đi từ lớp hấp thụ lên ITO và chờ ở đó. Điện tử lam đi xuống kim loại, rồi theo dây bạc bên phải, xuyên bóng đèn, tới đúng chỗ lỗ trống. Khi chúng chạm nhau, cả hai tắt: gặp lại và khép mạch. Đèn chỉ sáng trong lúc điện tử đang ở trên dây.",
      },
      {
        title: "Bước 5 — Cả bốn bước một vòng",
        body: "Ghép bốn bước thành một vòng, chỉ đường thành công. Photon vàng đủ năng lượng bị nuốt trong lớp hấp thụ. Điện tử nhảy lên vùng dẫn, lỗ trống ở lại vùng hóa trị, phần dư tách ngang thành nhiệt. Lỗ trống đi lên HTL rồi tới ITO. Điện tử đi xuống ETL rồi kim loại, chạy dây qua đèn và gặp lỗ trống ở ITO. Vòng này không vẽ photon đỏ bị lãng phí, cũng không vẽ tái hợp — hai việc ấy ở bước 1 và bước 3.",
        caption:
          "Một vòng, một nhãn đổi theo nhịp. 1 hấp thụ: photon vàng rơi vào lớp hấp thụ rồi tắt. 2 sinh cặp: điện tử lên vạch lam, lỗ trống ở vạch cam, hạt cam bay sang trái là nhiệt. 3 tách: lỗ trống vào HTL, điện tử vào ETL. 4 thu: lỗ trống tới ITO, điện tử xuống kim loại rồi chạy dây qua đèn để gặp lại. Đèn chỉ sáng ở nhịp 4.",
      },
    ],
  },
  {
    id: "sq",
    chapter: "c1",
    section: "1.5",
    title: "Trần một lớp: Shockley–Queisser",
    scene: "sq",
    cam: "wide",
    controls: ["eg"],
    tune: [{ eg: 1.34 }, { eg: 0.9 }, { eg: 2.2 }, { eg: 1.34 }, { eg: 1.7 }],
    steps: [
      {
        title: "Vì sao một lớp dừng ở khoảng 33,7%",
        body: "Năm 1961, Shockley và Queisser tính trần của một lớp hấp thụ dưới nắng chuẩn: khoảng 33,7%, dù vật liệu không còn bẫy [70]. Hai tổn thất không tránh được. Photon yếu hơn Eg đi xuyên, không sinh cặp. Photon mạnh hơn Eg chỉ nộp đúng Eg, phần dư thành nhiệt. Phần còn lại mới thành điện. Đường bên phải là trần theo Eg. Đỉnh được giữ ở 33,7%. Dạng đường là minh họa, không phải từng điểm tính lại từ phổ mặt trời.",
        caption:
          "Bên trái là một lớp. Quả cầu đỏ và cam yếu hơn Eg thì xuyên xuống và mờ. Quả cầu vàng, xanh, tím dừng trong lớp; hạt bay sang trái là phần dư thành nhiệt, hạt tím to hơn vì dư nhiều hơn. Cột lam là áp, theo Eg. Cột lục là phần giữ lại, đọc cùng chấm vàng trên đường. Đỉnh đường là 33,7%.",
      },
      {
        title: "Vùng cấm nhỏ — dòng lớn, áp thấp",
        body: "Eg khoảng 0,9 eV nuốt gần hết các photon trên hình, nên dòng lớn. Nhưng mỗi photon chỉ được tính bằng Eg. Quả cầu tím khoảng 3 eV nộp 0,9 eV và gần 2 eV thành nhiệt. Điện áp đi theo Eg nên cột áp thấp. Trần minh họa còn khoảng 27%, dưới đỉnh.",
        caption:
          "Eg = 0,9 eV. Cả năm quả cầu dừng trong lớp — dòng lớn. Hạt nhiệt của quả cầu tím là to nhất. Cột áp thấp. Chấm vàng nằm bên trái đỉnh, khoảng 27%.",
      },
      {
        title: "Vùng cấm lớn — áp cao, dòng nhỏ",
        body: "Eg khoảng 2,2 eV cho điện áp cao, vì mỗi điện tử mang nhiều năng lượng. Photon đỏ, cam và vàng yếu hơn 2,2 eV không mở được vùng cấm, nên xuyên qua. Chỉ quả cầu xanh và tím bị nuốt, dòng nhỏ. Trần minh họa tụt xuống khoảng 19%.",
        caption:
          "Eg = 2,2 eV. Quả cầu đỏ, cam và vàng xuyên lớp rồi mờ phía dưới. Chỉ quả cầu xanh và tím dừng. Cột áp cao, nhãn ghi nuốt 2/5. Chấm vàng nằm bên phải đỉnh, khoảng 19%.",
      },
      {
        title: "Điểm cân bằng quanh 1,1–1,4 eV",
        body: "Hai tổn thất đổi chỗ cho nhau. Eg quá nhỏ thì nhiệt nhiều. Eg quá lớn thì bỏ nhiều photon. Chúng cân bằng quanh 1,1–1,4 eV. Đỉnh 33,7% nằm ở khoảng 1,34 eV trên đường minh họa. Từ 1,0 đến 1,6 eV, trần vẫn trên 30%. Perovskite chỉnh được Eg trong cửa sổ này.",
        caption:
          "Eg = 1,34 eV, đúng đỉnh. Một phần quả cầu đỏ xuyên, phần dư của quả cầu tím thành nhiệt, nhưng cột lục là cao nhất và chấm vàng đứng trên 33,7%. Vùng tô lục trên đường là 1,0–1,6 eV, vẫn trên 30%.",
      },
      {
        title: "Hai lớp thì hết bị kẹt ở trần này",
        body: "Trần 33,7% chỉ buộc một lớp. Pin song song xếp hai lớp. Lớp trên Eg khoảng 1,7 eV nuốt photon xanh và tím, để photon đỏ hơn đi qua. Lớp dưới Eg khoảng 1,1 eV nhặt đúng phần đó. Photon yếu hơn cả hai lớp thì vẫn xuyên. Mỗi lớp chỉ gánh một khúc phổ, nên nhiệt và phần đi xuyên đều bớt. Cùng kiểu tính cân bằng chi tiết, hai lớp đẩy trần lên khoảng 42% dưới nắng không hội tụ — vẫn là trần lý thuyết, không phải một pin đã đo. Chương 3 và phần đề xuất cải tiến sẽ gặp lại cách xếp này.",
        caption:
          "Lớp trên ≈ 1,7 eV: quả cầu xanh và tím dừng ở đó. Quả cầu cam và vàng xuyên qua rồi dừng ở lớp dưới ≈ 1,1 eV. Quả cầu đỏ yếu hơn cả hai thì vẫn xuyên. Đường bên phải vẫn là trần của một lớp, để thấy hai lớp không bị buộc theo đường ấy.",
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
        body: "Năm 1839, ở dãy Ural, Gustav Rose tìm thấy khoáng CaTiO₃ và đặt tên theo Lev Perovski. Trên hình mới chỉ có một chất: Ca ngồi góc ô, Ti ngồi tâm, O nằm giữa mỗi mặt.",
        caption:
          "Một ô lập phương. Quả cầu nhạt ở góc là Ca, quả cầu xám ở tâm là Ti, quả cầu đỏ giữa các mặt là O. Công thức trên đỉnh là CaTiO₃. Dòng dưới: khoáng · 1839 · một chất. Chưa viết ABX₃, chưa có halogen.",
      },
      {
        title: "Công thức ABX₃",
        body: "Giữ nguyên ô đó và đổi tên các chỗ. A là ion ở góc, B là ion ở tâm, X là ion ở giữa mặt. Hợp chất nào xếp giống CaTiO₃ đều gọi là perovskite — tên của một kiểu sắp xếp, không phải một chất. Ở bước này X vẫn là oxy, nên đây là perovskite oxit, dùng làm tụ điện và vật liệu áp điện.",
        caption:
          "Cùng các quả cầu của bước trước, màu không đổi. Nhãn trên ion đổi thành A, B và X = O. Công thức trên đỉnh thành ABX₃. Dòng dưới: cùng ô ấy · X vẫn là oxy. Chưa đổi sang iod, brom hay clo.",
      },
      {
        title: "Đổi oxy lấy halogen",
        body: "Giữ khung, đổi chỗ X. Oxy ra, halogen vào: iod, brom hoặc clo. B thường là chì. Nếu A là phân tử hữu cơ như methylammonium, vật liệu là perovskite lai hữu cơ–vô cơ. Ví dụ trên hình là MAPbI₃ — nhân vật chính của bài.",
        caption:
          "Quả cầu đỏ thành quả cầu tím, nhãn I / Br / Cl. Tâm đổi từ Ti thành Pb. Một góc không còn là quả cầu Ca: đó là phân tử xanh MA⁺. Công thức trên đỉnh là MAPbI₃. Dòng dưới: halide · A có thể là phân tử.",
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
        body: "Quả cầu xám ở giữa lớn lên, các quả khác mờ đi. Đó là B, thường là Pb²⁺. Điện tử chạy ở vùng dẫn, và vùng dẫn này chủ yếu do B quyết định. Chì cho hiệu suất cao nhất, nhưng độc.",
        caption:
          "Cùng ô halide của bài 2.1, thêm khối bát diện mờ. Chỉ quả xám B ở tâm được phóng to. Dòng dưới: B quyết định vùng dẫn.",
      },
      {
        title: "X là đỉnh bát diện",
        body: "Giờ quả cầu tím lớn lên, quả xám thu nhỏ. Đó là X: I⁻, Br⁻ hoặc Cl⁻. Lỗ trống ở lại vùng hóa trị, và vùng hóa trị chủ yếu do X quyết định. Iod cho vùng cấm nhỏ; brom và clo làm vùng cấm lớn hơn.",
        caption:
          "B thu nhỏ và mờ đi. X tím ở các mặt được phóng to. Dòng dưới đổi thành: X quyết định vùng hóa trị.",
      },
      {
        title: "A lấp khoảng trống",
        body: "Quả cầu lục ở góc lớn lên. Đó là A: MA⁺, FA⁺ hoặc Cs⁺. A không tạo vùng cấm trực tiếp. Nó chỉ làm cả khung nghiêng, và khung nghiêng thì vùng cấm đổi — bài 2.5 vẽ độ nghiêng ấy.",
        caption:
          "X thu nhỏ. A lục ở góc ô được phóng to. A ngồi ở góc, không ngồi ở tâm Pb. Dòng dưới: A đổi Eg gián tiếp, qua độ nghiêng của khung.",
      },
      {
        title: "Điện tích phải về không",
        body: "Nhãn đổi thành điện tích và mọi quả cầu trở lại cùng cỡ. A mang +1, B mang +2, ba X mỗi ion mang −1. Cộng lại bằng 0, nên ô này không tích điện. Ví dụ quen là MAPbI₃, tức CH₃NH₃PbI₃.",
        caption:
          "Không còn quả nào được phóng to. Nhãn là A +1, B +2 và X −1. Dòng dưới: A+1 + B+2 + 3×(X−1) = 0.",
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
        title: "Viên gạch là gì?",
        body: "Tách riêng phần giữa ô vừa rồi: một Pb xám và sáu I tím thành một khối tám mặt. Đây là viên gạch. Phần này chỉ hỏi ba câu: khung xếp từ gì, ai ngồi trong hốc, và đổi B hay X thì pin đổi gì.",
        caption:
          "Chỉ một khối tám mặt. Tâm xám là Pb²⁺. Sáu đỉnh tím là I⁻. Chưa có khối thứ hai, chưa có A.",
      },
      {
        title: "Hai viên chạm nhau ở đâu?",
        body: "Thêm một viên nữa. Chúng chạm nhau ở đúng một I tím — một iod thuộc cả hai viên. Lặp kiểu chạm này theo ba chiều thì thành khung của pin.",
        caption:
          "Xuất hiện khối thứ hai. Giữa hai khối là một I⁻ ghi «chung». Mỗi khối vẫn một Pb. Chưa phải nối cạnh hay nối mặt.",
      },
      {
        title: "A ngồi vào chỗ nào?",
        body: "Quả cầu vàng rơi vào vòng trống cạnh I chung, không chui vào tâm Pb. Chỗ trống ấy là hốc — A ngồi giữa các viên gạch.",
        caption:
          "Một vòng xuất hiện cạnh I chung, quả cầu vàng A nằm trong vòng ấy. Tâm mỗi khối vẫn là Pb.",
        note: base("MA⁺ và FA⁺ là phân tử, có thể xoay trong hốc. Cs⁺ là một ion đơn, không xoay như phân tử."),
      },
      {
        title: "Một ô đếm được mấy ion?",
        body: "Gói các viên gạch vào một ô lập phương. Đếm thì ra một A, một B và ba X — đúng công thức ABX₃. Bài sau chỉ hỏi một việc: hốc ấy có vừa A không. Không vừa thì khung này không thành lớp hút sáng của pin.",
        caption:
          "Hai khối được thay bằng một ô. Bát diện tím nằm trong ô. Nhãn góc A ×1/8, tâm B ×1, mặt X ×1/2.",
        note: base("A ở 8 góc, mỗi góc chia 8 ô: 8×1/8 = 1. B ở tâm = 1. X ở 6 mặt, mỗi mặt chia 2 ô: 6×1/2 = 3."),
      },
    ],
  },
  {
    id: "tolerance",
    chapter: "c2",
    section: "2.4",
    title: "Hệ số Goldschmidt và kiểu nối của bát diện",
    scene: "tolerance",
    cam: "default",
    controls: ["cation"],
    tune: [
      { cation: "MA", mixCs: false },
      { cation: "Cs", mixCs: false },
      { cation: "FA", mixCs: false },
      { cation: "FA", mixCs: true },
    ],
    steps: [
      {
        title: "MA⁺ vừa hốc, khung nối góc",
        body: "Bài 2.3 đặt cation A vào hốc của khung nối góc. Với MA⁺, hệ số Goldschmidt t nằm trong khoảng bền của perovskite 3D, nên hai bát diện PbI₆ tiếp tục dùng chung một I⁻. Đó là cấu trúc của lớp hấp thụ.",
        caption:
          "Hai khối tím chạm nhau đúng một iod, thanh vàng đi qua iod đó. Vòng xám nằm trong chỗ lõm, quả lục MA vừa khít vòng. Chấm vàng nằm trong đoạn xanh. Chưa có khối bên phải.",
        note: base(
          "Chấm vàng là hệ số Goldschmidt t = (rA + rX) / [√2 (rB + rX)] [20]. t gần 1 thì A vừa hốc. Perovskite 3D thường nằm khoảng 0,8 đến 1,0. MA⁺ ≈ 2,17 Å [65], t ≈ 0,91.",
        ),
      },
      {
        title: "Cs⁺ nhỏ, khung chuyển sang nối cạnh",
        body: "Cs⁺ nhỏ hơn bán kính cân bằng của hốc, t rơi khỏi vùng bền. Hai bát diện không còn nối góc: chúng nối cạnh và dùng chung hai I⁻. Pha δ này hấp thụ kém, không dùng làm lớp hấp thụ.",
        caption:
          "Trái, quả lam nhỏ lọt trong vòng, chấm vàng ra ngoài đoạn xanh. Phải, hai khối chạm nhau đúng hai iod to, một thanh vàng nối hai iod đó.",
        note: base(
          "CsPbI₃ có t ≈ 0,85. Bán kính Shannon: Pb²⁺ 1,19 Å, I⁻ 2,20 Å, Cs⁺ 1,88 Å [64]. Pha sụp này gọi là pha delta, màu vàng.",
        ),
      },
      {
        title: "FA⁺ lớn, khung chuyển sang nối mặt",
        body: "FA⁺ lớn hơn hốc, t sát trên biên vùng bền. Hai bát diện chuyển sang nối mặt và dùng chung ba I⁻. Đó là pha lục giác, thường màu vàng, không còn là perovskite 3D của pin.",
        caption:
          "Trái, quả vàng tràn khỏi vòng, chấm vàng nằm sát mép phải và vừa ra khỏi đoạn xanh. Phải, ba iod to tạo một tam giác vàng: hai khối chung một mặt.",
        note: base("FA⁺ ≈ 2,53 Å, t ≈ 0,99. Ở nhiệt độ phòng FAPbI₃ dễ sang pha lục giác màu vàng."),
      },
      {
        title: "5% Cs⁺ kéo FA⁺ về nối góc",
        body: "Khối nối mặt biến mất. Trộn một ít Cs⁺ làm giảm bán kính cation trung bình, khung FAPbI₃ trở lại nối góc. Hỗn hợp FA₀.₉₅Cs₀.₀₅PbI₃ là lõi của nhiều pin hiệu suất cao. Bài 2.5 xét khung vẫn nối góc nhưng góc Pb–I–Pb không còn bằng 180°.",
        caption:
          "Khối chung mặt biến mất. Chỉ còn hai khối chạm một iod. Quả A vừa vòng, cạnh nó có một chấm lam nhỏ. Chấm vàng trên thanh trở vào trong đoạn xanh.",
        note: warn(
          "Hình vẽ thu quả A lại cho dễ thấy. Trong tinh thể thật, 5% Cs chỉ kéo t từ khoảng 0,99 về khoảng 0,98. FA₀.₉₅Cs₀.₀₅PbI₃ là lõi của nhiều pin trên 27% [39]. Trộn Cs/MA/FA cùng ý ấy: Saliba và Grätzel đạt 21,1% năm 2016 [22]. t chỉ là sàng lọc: Bartel và cộng sự (2019) thấy ngưỡng t đúng khoảng 74% trường hợp, hệ số τ của họ đúng khoảng 92% [21]. Đừng coi t vừa hốc là lời hứa pin bền ngoài trời.",
        ),
      },
    ],
  },
  {
    id: "phases",
    chapter: "c2",
    section: "2.5",
    title: "Góc Pb–I–Pb quyết định vùng cấm",
    scene: "phases",
    cam: "default",
    steps: [
      {
        title: "Đây là góc giữa hai khối",
        body: "Một iod có thể làm cầu nối giữa hai chì. Gần thẳng thì Pb–I–Pb gần 180°. Khi iod rời khỏi đường nối hai chì, góc nhỏ hơn 180°. Góc này nằm giữa hai khối. Góc I–Pb–I bên trong một khối là góc khác, không dùng ở bài này.",
        caption:
          "Trái: hai Pb²⁺ và I⁻ nằm trên một đường, góc 180°. Phải: I⁻ thật nằm phía trên đường đứt, quả iod mờ trên đường là vị trí 180°, hai thanh vàng gặp nhau tại I⁻ ấy. Phía dưới, một khối riêng có góc xám tại chì bị gạch đỏ: đó là góc I–Pb–I trong một khối.",
        note: base(
          "Hình đẩy iod xa hơn tinh thể thật để thấy chỗ gập. A hơi nhỏ so với hốc thì iod bị đẩy, nhưng các khối vẫn nối góc như bài 2.4. Góc thẳng là pha lập phương, trên khoảng 54 °C. Pin chạy ở nhiệt độ phòng, pha tứ phương, góc đã lệch một trục [67]. Quả mờ không phải ion thứ hai.",
        ),
      },
      {
        title: "Vì sao góc đổi vùng cấm?",
        body: "Giữ các yếu tố khác gần như nhau. Góc gần 180° thì Pb 6s và I 5p chồng lấp mạnh, tương tác thuận lợi, vùng cấm thường hẹp hơn. Đỉnh vùng hóa trị là tổ hợp phản liên kết của Pb 6s với I 5p, nên tương tác mạnh đẩy mức này lên cao. Bát diện nghiêng, góc nhỏ, tương tác yếu, đỉnh ấy không còn bị đẩy cao: nó hạ xuống và khoảng cách tới đáy vùng dẫn tăng lên.",
        caption:
          "Trái: Pb–I–Pb thẳng. Quả xám là Pb²⁺, lớp lam trong là Pb 6s, hai thùy đồng từ iod là I 5p và chạm lớp lam, có chấm sáng. Cột dưới: thanh lam Pb 6p, thanh đồng sát bên dưới ghi phản liên kết, mũi tên vàng đẩy thanh đồng từ mức thấp lên, nhãn Eg hẹp. Phải: iod rời đường đứt, thùy đồng ngắn không chạm Pb 6s, góc nhỏ hơn. Thanh lam cùng một đường đứt với bên trái. Thanh đồng mờ là mức 180°, thanh đồng đặc nằm thấp hơn, mũi tên đỏ chỉ xuống, nhãn Eg rộng.",
        note: base(
          "Phản liên kết nghĩa là tổ hợp Pb 6s–I 5p nằm cao hơn mức khi hai orbital không tương tác [16]. Đáy vùng dẫn, chủ yếu Pb 6p, được vẽ đứng yên để thấy phần rộng thêm của Eg đến từ đỉnh hóa trị hạ xuống. Cột là sơ đồ, không phải phổ đo. Hình phóng đại độ lệch.",
        ),
      },
      {
        title: "Pin dùng góc này thế nào?",
        body: "Vùng cấm hẹp, như FAPbI₃ khoảng 1,48 eV, nuốt được photon đỏ và hồng ngoại gần. Vùng cấm rộng, như CsPbI₃ khoảng 1,73 eV, bỏ nhiều photon ấy, nhưng có thể cho điện áp cao hơn nên hợp làm lớp trên của pin hai lớp. Góc không phải yếu tố duy nhất: mạng co lại thì liên kết ngắn hơn, tương tác có thể mạnh lên và vùng cấm giảm. Hai hiệu ứng có thể ngược nhau.",
        caption:
          "Trái: FA⁺, iod gần trục, cột hẹp ghi 1,48 eV, mũi tên đỏ dừng tại lớp tối. Phải: Cs⁺, iod lệch xa trục, cột rộng ghi 1,73 eV, mũi tên đỏ đi xuyên lớp tối, nhãn lớp trên. Hình không vẽ độ dài liên kết.",
        note: warn(
          "1,48 eV và 1,73 eV là số liệu [68], không đọc từ góc vẽ. Hình phóng đại độ lệch. Eg rộng hơn không có nghĩa pin một lớp tốt hơn: nó bỏ bớt photon năng lượng thấp. Lớp trên của pin hai lớp thì Eg rộng lại có ích.",
        ),
      },
    ],
  },
  {
    id: "orbitals",
    chapter: "c2",
    section: "2.6",
    title: "Vùng cấm trực tiếp của mạng Pb–I",
    scene: "orbitals",
    cam: "default",
    legend: [
      { swatch: "lead", label: "Pb²⁺ · màu trên hình" },
      { swatch: "iodine", label: "I⁻ · màu trên hình" },
      { swatch: "electron", label: "electron" },
      { swatch: "hole", label: "lỗ trống" },
      { swatch: "sun", label: "photon" },
    ],
    steps: [
      {
        title: "Từ một bát diện tới cả mạng",
        body: "Pb²⁺ nằm giữa sáu I⁻. Khối ấy có tám mặt tam giác, nên là bát diện, không phải khối lập phương. Khi nhiều bát diện nối đỉnh, các trạng thái electron tương tác và tạo thành những vùng năng lượng của cả vật liệu. Vùng ấy không thuộc riêng một nguyên tử Pb hay một nguyên tử I.",
        caption:
          "Trái: một Pb²⁺ xám ở tâm, sáu I⁻ tím theo sáu hướng, lưới tím là tám mặt tam giác, nhãn khối xây dựng. Phải: mạng 3×3×3. Iod ở chỗ hai khối chạm nhau là cùng một quả, không vẽ hai quả chồng. Ion A được ẩn. Góc trên có nhãn Minh họa giản lược.",
        note: base(
          "Đây là phần khung Pb–I của perovskite ABX₃. Ion A đã được ẩn. Màu xám và tím chỉ để phân biệt nguyên tử trên hình, không phải màu thật của chì và iod. Bấm một quả để xem nó chỉ là một ion trong mạng.",
        ),
      },
      {
        title: "Hai vùng năng lượng của mạng",
        body: "Bên trái vẫn là mạng, trong không gian của tinh thể. Bên phải là biểu đồ năng lượng: vùng hóa trị ở dưới, vùng dẫn ở trên. Electron cần nhận đủ năng lượng để lên vùng dẫn. Năng lượng tối thiểu giữa hai mép gọi là bandgap, ký hiệu Eg. Hình không ghi một số Eg, vì số ấy phụ thuộc thành phần và pha.",
        caption:
          "Trái là mạng Pb–I. Phải là hai thanh. Thanh dưới có các chấm lam, nhãn VBM ở mép trên của thanh ấy. Thanh trên trống, nhãn CBM ở mép dưới. Khoảng giữa ghi Eg, không có số. Dòng dưới nhắc độ cao là năng lượng.",
        note: base(
          "Độ cao trên biểu đồ là năng lượng, không phải chỗ electron ngồi trong tinh thể. Nếu nói quỹ đạo: đỉnh vùng hóa trị có đóng góp lớn từ I 5p và Pb 6s, đáy vùng dẫn chủ yếu mang tính Pb 6p [16]. Đó là đặc tính của cả mạng, không phải của một nguyên tử.",
        ),
      },
      {
        title: "Hai mép vùng nằm cùng k",
        body: "Trục đứng là năng lượng E, trục ngang là k — động lượng của tinh thể. Đỉnh vùng hóa trị và đáy vùng dẫn nằm cùng một giá trị k. Photon vàng đủ năng lượng thì electron chuyển lên theo mũi tên thẳng đứng trên biểu đồ, và để lại một lỗ trống. Không cần phonon để bù động lượng.",
        caption:
          "Trái, một mạng nhỏ, nhãn không gian tinh thể. Phải là một bảng tối, không phải tinh thể: trục đứng E, trục ngang k. Đường đồng có đỉnh, ghi VBM. Đường lam có đáy, ghi CBM. Hai mép nằm trên cùng một vạch đứt xám, nhãn Cùng k. Quả vàng đi từ trái vào khe là photon. Mũi tên trắng đứng nối đúng hai mép ấy. Chấm lam đi lên dọc mũi tên, vẫn trên vạch đứt. Vòng cam rỗng ở lại tại VBM.",
        note: base(
          "Hai đường cong chỉ vẽ quanh mép vùng, không phải kết quả tính toán. Mũi tên thẳng đứng là chuyển tiếp trên biểu đồ, không phải đường bay của electron trong vật liệu. Góc Pb–I–Pb ở bài 2.5 đổi bề rộng vùng cấm. Góc ấy không phải điều kiện để vùng cấm là trực tiếp.",
        ),
      },
      {
        title: "Gián tiếp thì cần thêm phonon",
        body: "Bảng trái là trực tiếp: đỉnh vùng hóa trị và đáy vùng dẫn cùng một giá trị k, mũi tên trắng đứng nối hai mép. Bảng phải là gián tiếp: đỉnh và đáy ở hai giá trị k khác nhau. Photon chỉ đưa năng lượng và giữ nguyên k của đỉnh, nên mũi tên vàng không chạm đường dẫn. Phonon mới đổi k. Không có mũi tên chéo từ đỉnh sang đáy.",
        caption:
          "Hai bảng tối. Trái, nhãn trực tiếp: đường đồng và đường lam gặp nhau trên một vạch đứt xám, mũi tên trắng đứng, nhãn cùng k. Phải, nhãn gián tiếp: đỉnh đồng nằm bên trái, đáy lam nằm bên phải. Quả vàng và mũi tên vàng ngắn đứng tại đỉnh, nhãn photon, không chạm đường lam. Nét sóng xám nằm trên trục k, nhãn phonon · Δk, chỉ nối hai giá trị k. Phía dưới, một lớp mạng Pb–I dao động quanh chỗ đứng, không thêm nguyên tử.",
        note: base(
          "Đây là minh họa cơ chế chuyển tiếp, không phải hai vật liệu có cùng cấu trúc nguyên tử. Dao động nhỏ là phonon. Minh họa giản lược.",
        ),
      },
      {
        title: "Màng mỏng hấp thụ, rồi phải thu điện tích",
        body: "Vùng cấm trực tiếp giúp mạng Pb–I hấp thụ ánh sáng mạnh ngay trong một màng mỏng. Photon vàng đi vào lớp perovskite rồi tắt. Ngay chỗ ấy sinh một electron và một lỗ trống. Electron được thu xuống lớp chọn lọc electron, lỗ trống lên lớp chọn lọc lỗ trống. Nếu chúng gặp lại nhau trước khi tới lớp ấy thì không thành dòng điện.",
        caption:
          "Trái là một bát diện PbI₆, nhãn khối trong màng. Phải là ba lớp. Lớp trên đồng, nhãn chọn lọc lỗ trống. Lớp giữa nhìn thấy các ion Pb xám và I tím, nhãn perovskite. Lớp dưới lam, nhãn chọn lọc electron. Quả vàng đi vào lớp giữa rồi tắt. Chấm lam và vòng cam sinh ra tại chỗ ấy. Chấm lam xuống lớp dưới, vòng cam lên lớp trên. Chúng đi phía trước mạng, không chạy dọc liên kết.",
        note: base(
          "Trực tiếp nghĩa là cùng k trên biểu đồ E–k, không phải cùng một đường trong không gian tinh thể. Hình không ghi số Eg.",
        ),
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
    lessonIds: ["foundation", "photon", "bands", "cell", "sq", "silicon", "ideal"],
  },
  {
    id: "c2",
    num: "2",
    title: "Khung ABX₃",
    lessonIds: ["origin", "parts", "build", "tolerance", "phases", "orbitals"],
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
