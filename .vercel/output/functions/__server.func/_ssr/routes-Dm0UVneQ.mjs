import { i as __toESM } from "../_runtime.mjs";
import { a as useFrame, c as EdgesGeometry, d as OctahedronGeometry, f as Quaternion, i as Canvas, l as MathUtils, m as Vector3, n as OrbitControls, o as useThree, p as SphereGeometry, r as Html, s as BoxGeometry, t as Grid, u as Object3D, v as require_jsx_runtime, y as require_react } from "../_libs/@react-three/drei+[...].mjs";
import { a as Pause, c as Image, d as ChevronLeft, f as BookOpen, i as Play, l as CircleHelp, o as Minimize2, r as RotateCcw, s as Maximize2, t as X, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dm0UVneQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var base = (text) => ({
	kind: "base",
	title: "Kiến thức nền",
	text
});
var warn = (text) => ({
	kind: "warn",
	title: "Lưu ý",
	text
});
var idea = (text) => ({
	kind: "idea",
	title: "Giả thuyết, chưa phải kết quả",
	text
});
var lessons = [
	{
		id: "intro",
		chapter: "c0",
		section: "Mở đầu",
		title: "Nắng 1000 W/m² — điểm xuất phát",
		scene: "sun",
		cam: "wide",
		legend: [{
			swatch: "sun",
			label: "Photon mặt trời"
		}, {
			swatch: "iodine",
			label: "Tấm pin"
		}],
		steps: [
			{
				title: "Nắng gắt mang khoảng 1000 W/m²",
				body: "Mỗi giây, khi trời quang, Mặt Trời gửi tới mỗi mét vuông mặt đất khoảng 1000 oát năng lượng ánh sáng. Pin mặt trời biến một phần năng lượng đó trực tiếp thành điện."
			},
			{
				title: "Không máy, không nhiên liệu",
				body: "Pin mặt trời (solar cell) không cần bộ phận chuyển động và không đốt nhiên liệu. Muốn hiểu vì sao perovskite được chú ý, trước hết phải thấy pin đòi hỏi gì ở vật liệu hấp thụ."
			},
			{
				title: "Cách đọc phòng thí nghiệm này",
				body: "Mỗi mục đi từ trực giác, tới khái niệm, rồi con số. Bật «Giải thích từng bước» để đọc lời dẫn; tắt đi để chỉ xem mô hình. Kéo để xoay, cuộn để phóng.",
				note: base("Hộp này là kiến thức nền — ion, electron-vôn, vùng năng lượng. Hộp cam là chỗ số liệu cần dè chừng. Số trong ngoặc vuông trỏ tới phụ lục tài liệu.")
			}
		]
	},
	{
		id: "foundation",
		chapter: "c1",
		section: "1 · nền",
		title: "Hạt mang điện: nguyên tử, ion, eV",
		scene: "foundation",
		cam: "default",
		legend: [
			{
				swatch: "electron",
				label: "Điện tử"
			},
			{
				swatch: "hole",
				label: "Hạt nhân / ion dương"
			},
			{
				swatch: "iodine",
				label: "Ion âm"
			}
		],
		steps: [
			{
				title: "Nguyên tử",
				body: "Mọi chất được tạo từ nguyên tử (atom): hạt nhân mang điện dương và các điện tử (electron) mang điện âm quay quanh.",
				note: base("Phần này giải thích từ vựng. Nếu bạn đã biết, nhảy sang mục photon.")
			},
			{
				title: "Mất điện tử thì thành cation",
				body: "Khi nguyên tử mất điện tử, nó thành ion dương (cation). Pb²⁺ là chì đã mất 2 điện tử. Khi nhận thêm điện tử, nó thành ion âm (anion), ví dụ I⁻."
			},
			{
				title: "Dòng điện là dòng hạt mang điện",
				body: "Dòng điện (electric current) chỉ là các hạt mang điện chuyển động có hướng. Trong pin, đó là điện tử đi một chiều và lỗ trống đi chiều kia."
			},
			{
				title: "Electron-vôn",
				body: "Năng lượng ở thang nguyên tử đo bằng electron-vôn (eV): năng lượng một điện tử nhận được khi đi qua hiệu điện thế 1 vôn. 1 meV = 0,001 eV."
			}
		]
	},
	{
		id: "photon",
		chapter: "c1",
		section: "1.1",
		title: "Photon — gói năng lượng của ánh sáng",
		scene: "photon",
		cam: "wide",
		controls: ["wavelength"],
		tune: [
			{ wavelength: 500 },
			{ wavelength: 700 },
			{ wavelength: 1100 },
			{ wavelength: 550 }
		],
		legend: [{
			swatch: "sun",
			label: "Photon"
		}],
		steps: [
			{
				title: "Sóng, và cũng là hạt",
				body: "Ánh sáng là dòng các hạt năng lượng gọi là photon. Năng lượng mỗi photon phụ thuộc màu, tức bước sóng: xanh tím mang nhiều năng lượng hơn đỏ."
			},
			{
				title: "Công thức tiện dụng",
				body: "E (eV) ≈ 1240 / λ (nm). Ánh sáng lục 500 nm ≈ 2,48 eV. Đỏ 700 nm ≈ 1,77 eV. Hồng ngoại gần 1100 nm ≈ 1,13 eV."
			},
			{
				title: "Phổ mặt trời trải rất rộng",
				body: "Phổ mặt trời đi từ tử ngoại, qua vùng nhìn thấy, tới hồng ngoại. Gần một nửa năng lượng nằm ở hồng ngoại — nơi nhiều vật liệu hấp thụ bỏ qua."
			},
			{
				title: "Tự kéo bước sóng",
				body: "Thanh trượt đổi màu và năng lượng của photon. So sánh một gói xanh với một gói hồng ngoại trước khi sang vùng cấm."
			}
		]
	},
	{
		id: "bands",
		chapter: "c1",
		section: "1.2",
		title: "Vùng cấm — bậc thang điện tử phải nhảy",
		scene: "bands",
		cam: "default",
		legend: [
			{
				swatch: "htl",
				label: "Vùng hóa trị"
			},
			{
				swatch: "electron",
				label: "Vùng dẫn"
			},
			{
				swatch: "sun",
				label: "Vùng cấm Eg"
			}
		],
		steps: [
			{
				title: "Tòa nhà hai tầng",
				body: "Trong chất rắn, điện tử chỉ được nằm trong những dải năng lượng cho phép. Hãy hình dung một tòa nhà hai tầng."
			},
			{
				title: "Tầng dưới chật kín",
				body: "Vùng hóa trị (valence band) chật điện tử. Chúng bị giữ trong liên kết hóa học nên không dẫn điện."
			},
			{
				title: "Tầng trên gần như trống",
				body: "Vùng dẫn (conduction band) gần như trống. Điện tử lên được đây thì tự do di chuyển và dẫn điện."
			},
			{
				title: "Khoảng giữa là vùng cấm",
				body: "Vùng cấm (bandgap, Eg) không có bậc thang. Điện tử muốn lên tầng trên phải nhận ít nhất một năng lượng bằng Eg."
			},
			{
				title: "Kim loại, cách điện, bán dẫn",
				body: "Kim loại không có vùng cấm. Chất cách điện có Eg trên khoảng 4 eV, ánh sáng thường không đủ kích thích. Bán dẫn có Eg khoảng 0,5–3 eV, đúng cỡ photon mặt trời. Mọi pin mặt trời đều dùng chất bán dẫn."
			}
		]
	},
	{
		id: "cell",
		chapter: "c1",
		section: "1.3",
		title: "Bốn bước của pin: hấp thụ, sinh cặp, tách, thu",
		scene: "cell",
		cam: "stack",
		legend: [
			{
				swatch: "sun",
				label: "Photon"
			},
			{
				swatch: "electron",
				label: "Điện tử"
			},
			{
				swatch: "hole",
				label: "Lỗ trống"
			},
			{
				swatch: "etl",
				label: "ETL"
			},
			{
				swatch: "htl",
				label: "HTL"
			}
		],
		steps: [
			{
				title: "Bước 1 — Hấp thụ",
				body: "Photon có năng lượng lớn hơn hoặc bằng Eg bị vật liệu nuốt. Photon yếu hơn Eg đi xuyên qua và bị lãng phí."
			},
			{
				title: "Bước 2 — Sinh cặp điện tử–lỗ trống",
				body: "Điện tử nhảy lên vùng dẫn, để lại một chỗ trống ở vùng hóa trị. Chỗ trống hành xử như hạt mang điện dương: lỗ trống (hole). Năng lượng dư của photon nhanh chóng thành nhiệt — tổn thất nhiệt hóa (thermalization)."
			},
			{
				title: "Bước 3 — Tách trước khi tái hợp",
				body: "Điện tử và lỗ trống hút nhau. Nếu gặp lại, năng lượng mất thành nhiệt hoặc ánh sáng: tái hợp (recombination). Pin silicon dùng tiếp giáp p-n. Pin perovskite dùng hai lớp chọn lọc: ETL chỉ cho điện tử qua, HTL chỉ cho lỗ trống qua."
			},
			{
				title: "Bước 4 — Thu vào mạch ngoài",
				body: "Điện tử tới một điện cực, lỗ trống tới điện cực kia. Nối qua một bóng đèn, điện tử chạy mạch ngoài để gặp lại lỗ trống — đó là dòng điện có ích."
			}
		]
	},
	{
		id: "metrics",
		chapter: "c1",
		section: "1.4",
		title: "Bốn số đo của pin: Voc, Jsc, FF, hiệu suất",
		scene: "metrics",
		cam: "plot",
		controls: ["iv"],
		tune: [{
			voc: 1.19,
			jsc: 25.8,
			ff: .86
		}],
		steps: [
			{
				title: "Điện áp hở mạch Voc",
				body: "Voc là điện áp lớn nhất khi không lấy dòng. Nó phụ thuộc Eg và mức độ tái hợp. Pin perovskite tốt thường khoảng 1,15–1,20 V.",
				caption: "Đường dòng–áp. Trục ngang là điện áp, trục dọc là dòng trên mỗi cm². Voc nằm trên trục điện áp khi dòng bằng không."
			},
			{
				title: "Dòng ngắn mạch Jsc",
				body: "Jsc là dòng lớn nhất trên mỗi cm² khi nối tắt hai cực. Nó phụ thuộc số photon bị hấp thụ. Mức điển hình khoảng 25–26 mA/cm².",
				caption: "Jsc là chỗ đường cong cắt trục dòng, khi điện áp bằng không."
			},
			{
				title: "Hệ số lấp đầy FF",
				body: "FF đo độ «vuông» của đường dòng–áp. Góc bị tròn vì điện trở. Pin tốt nằm khoảng 0,83–0,87. Hình chữ nhật công suất cực đại nằm trong đường cong.",
				caption: "Hình chữ nhật trong đường cong là công suất lớn nhất. FF là tỉ lệ hình chữ nhật ấy so với Voc nhân Jsc."
			},
			{
				title: "PCE = Voc × Jsc × FF / Pin",
				body: "Với Pin = 100 mW/cm² (phổ AM1.5G). Ví dụ Voc 1,19 V, Jsc 25,8 mA/cm², FF 0,86 cho PCE ≈ 26,4%. Kỷ lục một lớp trong tài liệu khoảng 26–27%.",
				caption: "Hiệu suất đọc từ công thức trên hình. 26,4% là ví dụ khi kéo thanh, không phải một kỷ lục mới."
			}
		]
	},
	{
		id: "sq",
		chapter: "c1",
		section: "1.5",
		title: "Trần một lớp: Shockley–Queisser",
		scene: "sq",
		cam: "plot",
		controls: ["eg"],
		tune: [
			{ eg: 1.34 },
			{ eg: .9 },
			{ eg: 2.2 },
			{ eg: 1.34 },
			{ eg: 1.7 }
		],
		steps: [
			{
				title: "Trần khoảng 33,7%",
				body: "Năm 1961, Shockley và Queisser chỉ ra một pin một lớp hấp thụ không vượt khoảng 33,7% dưới ánh nắng chuẩn, dù vật liệu hoàn hảo [70]. Đường trên màn hình là dạng minh họa, đỉnh được giữ đúng 33,7%.",
				caption: "Đường trần một lớp theo vùng cấm. Đỉnh được giữ ở 33,7%. Dạng đường là minh họa, không phải từng điểm tính lại từ phổ mặt trời."
			},
			{
				title: "Vùng cấm nhỏ",
				body: "Hấp thụ được nhiều photon nên dòng lớn, nhưng mỗi photon chỉ cho năng lượng cỡ Eg, phần dư thành nhiệt, điện áp thấp.",
				caption: "Eg thấp: dòng lớn, điện áp thấp, phần dư của photon thành nhiệt."
			},
			{
				title: "Vùng cấm lớn",
				body: "Mỗi điện tử mang nhiều năng lượng, điện áp cao, nhưng bỏ phí nhiều photon đỏ và hồng ngoại, dòng nhỏ.",
				caption: "Eg cao: điện áp cao, nhưng nhiều photon đỏ và hồng ngoại không đủ năng lượng."
			},
			{
				title: "Điểm cân bằng",
				body: "Tối ưu nằm quanh Eg ≈ 1,1–1,4 eV. Từ khoảng 1,0 đến 1,6 eV, trần vẫn trên 30%.",
				caption: "Đỉnh đường nằm quanh 1,1–1,4 eV. Từ 1,0 đến 1,6 eV, trần vẫn trên 30%."
			},
			{
				title: "Muốn vượt trần thì phải xếp chồng",
				body: "Pin song song (tandem) đặt nhiều lớp có vùng cấm khác nhau: lớp trên nuốt photon năng lượng cao, lớp dưới nhặt phần còn lại. Sẽ gặp lại ở chương 3 và phần đề xuất cải tiến.",
				caption: "Tandem vượt một đường trần vì lớp trên và lớp dưới chia nhau phổ."
			}
		]
	},
	{
		id: "silicon",
		chapter: "c1",
		section: "1.6",
		title: "Silicon đã gần trần một lớp",
		scene: "silicon",
		cam: "wide",
		legend: [{
			swatch: "metal",
			label: "Silicon dày"
		}, {
			swatch: "iodine",
			label: "Perovskite mỏng"
		}],
		steps: [
			{
				title: "Hơn 95% thị trường",
				body: "Silicon tinh thể có Eg 1,12 eV, rất gần tối ưu, rẻ, bền 25–30 năm. Kỷ lục phòng thí nghiệm khoảng 27–28%, sát trần thực tế của chính nó (~29,4%)."
			},
			{
				title: "Vùng cấm gián tiếp",
				body: "Silicon hấp thụ yếu vì vùng cấm gián tiếp (indirect bandgap): điện tử cần thêm một dao động mạng. Lớp silicon phải dày khoảng 150–180 µm, cỡ 300 lần lớp perovskite."
			},
			{
				title: "Nấu trên 1400 °C",
				body: "Phải nấu chảy silicon trên 1400 °C và tinh chế tới độ sạch 99,9999%. Tốn rất nhiều năng lượng ngay từ lúc chế tạo."
			},
			{
				title: "Đã gần chạm trần",
				body: "Muốn tăng hiệu suất thêm một bước đáng kể, cần một vật liệu thứ hai xếp lên trên silicon. Đó là chỗ perovskite bước vào."
			}
		]
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
				body: "Vùng cấm hợp (khoảng 1,1–1,7 eV), hấp thụ mạnh, hạt tải đi xa, ít khuyết tật gây hại, rẻ và dễ làm, rồi bền nhiều năm và không độc."
			},
			{
				title: "Perovskite halide gật đầu gần hết",
				body: "Chỉnh được Eg khoảng 1,2–3,0 eV. Lớp 0,5 µm hấp thụ gần hết ánh sáng nhìn thấy. Độ dài khuếch tán từ khoảng 1 µm tới hơn 100 µm ở đơn tinh thể. Dung thứ khuyết tật. Phủ từ dung dịch dưới 150 °C."
			},
			{
				title: "Còn vướng độ bền và chì",
				body: "Cả tài liệu xoay quanh câu này: hiệu năng thì perovskite đáp ứng gần như mọi tiêu chí, nhưng độ bền ngoài trời và độc tính của chì vẫn là điểm yếu chính.",
				note: warn("Dòng «Chưa» trên mô hình không phải lời kết án — đó là bài toán các chương 3 đến 5 cố gắng xử lý.")
			}
		]
	},
	{
		id: "origin",
		chapter: "c2",
		section: "2.1",
		title: "Từ tên khoáng vật đến công thức ABX₃",
		scene: "origin",
		cam: "crystal",
		legend: [
			{
				swatch: "oxide",
				label: "Oxy trong CaTiO₃"
			},
			{
				swatch: "iodine",
				label: "Halide I/Br/Cl"
			},
			{
				swatch: "ma",
				label: "Cation hữu cơ"
			}
		],
		steps: [
			{
				title: "1839, dãy Ural",
				body: "Gustav Rose tìm thấy khoáng CaTiO₃ và đặt tên theo Lev Perovski. Về sau perovskite là tên của một kiểu sắp xếp nguyên tử, không phải một chất duy nhất."
			},
			{
				title: "Công thức ABX₃",
				body: "Hợp chất nào có dạng ABX₃ và cách xếp ion giống CaTiO₃ đều gọi là perovskite. X là oxy thì đó là perovskite oxit, dùng làm tụ điện, vật liệu áp điện."
			},
			{
				title: "Đổi oxy lấy halogen",
				body: "Khi X là iod, brom hoặc clo, ta có perovskite halide — nhân vật chính. Nếu A là phân tử hữu cơ như methylammonium, vật liệu là perovskite lai hữu cơ–vô cơ."
			}
		]
	},
	{
		id: "parts",
		chapter: "c2",
		section: "2.2",
		title: "A, B, X — ba vai trong cùng một khung",
		scene: "parts",
		cam: "crystal",
		legend: [
			{
				swatch: "ma",
				label: "A · cation lớn +1"
			},
			{
				swatch: "lead",
				label: "B · Pb²⁺ hoặc Sn²⁺"
			},
			{
				swatch: "iodine",
				label: "X · I⁻, Br⁻, Cl⁻"
			}
		],
		steps: [
			{
				title: "B ngồi tâm bát diện",
				body: "Cation kim loại B, thường Pb²⁺, đôi khi Sn²⁺ hoặc Ge²⁺, quyết định chủ yếu vùng dẫn. Chì cho hiệu suất cao nhất nhưng độc."
			},
			{
				title: "X là đỉnh bát diện",
				body: "Anion halide quyết định chủ yếu vùng hóa trị. Iod cho vùng cấm nhỏ; brom và clo làm vùng cấm lớn hơn, màu sáng hơn."
			},
			{
				title: "A lấp khoảng trống",
				body: "MA⁺ = CH₃NH₃⁺, FA⁺ = HC(NH₂)₂⁺, hoặc Cs⁺. A không tạo vùng cấm trực tiếp; nó làm khung nghiêng và qua đó đổi Eg."
			},
			{
				title: "Điện tích phải về không",
				body: "A(+1) + B(+2) + 3×X(−1) = 0. Ví dụ quen nhất là MAPbI₃, tức CH₃NH₃PbI₃. Bấm vào từng ion trên mô hình để khóa camera vào nó."
			}
		]
	},
	{
		id: "build",
		chapter: "c2",
		section: "2.3",
		title: "Dựng khung: bát diện, nối góc, đếm ABX₃",
		scene: "build",
		cam: "crystal",
		legend: [
			{
				swatch: "lead",
				label: "Pb²⁺"
			},
			{
				swatch: "iodine",
				label: "I⁻"
			},
			{
				swatch: "fa",
				label: "Cation A"
			}
		],
		steps: [
			{
				title: "Bước 1 — Viên gạch bát diện",
				body: "Một ion Pb²⁺ được sáu ion I⁻ bao theo sáu hướng. Nối sáu iod được khối tám mặt: bát diện (octahedron) PbI₆."
			},
			{
				title: "Bước 2 — Nối góc",
				body: "Các bát diện dùng chung đỉnh (corner-sharing). Mỗi iod là đỉnh chung của hai bát diện kề nhau. Lặp theo ba chiều thành một khung giàn."
			},
			{
				title: "Bước 3 — Thả cation A vào hốc",
				body: "Giữa tám bát diện có một hốc lớn. MA⁺ và FA⁺ là phân tử, có thể xoay tương đối tự do trong hốc. Cs⁺ là ion đơn, không xoay như một phân tử."
			},
			{
				title: "Bước 4 — Đếm ra ABX₃",
				body: "Trong một ô cơ sở: A ở 8 góc, mỗi góc chia cho 8 ô nên 8×1/8 = 1. B ở tâm = 1. X ở 6 tâm mặt, mỗi mặt chia 2 ô nên 6×1/2 = 3. Cộng lại là ABX₃."
			}
		]
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
			{
				cation: "Cs",
				mixCs: false
			},
			{
				cation: "Cs",
				mixCs: false
			},
			{
				cation: "MA",
				mixCs: false
			},
			{
				cation: "FA",
				mixCs: false
			},
			{
				cation: "FA",
				mixCs: true
			},
			{
				cation: "FA",
				mixCs: true
			}
		],
		steps: [
			{
				title: "Ion A có vừa hốc không?",
				body: "Không phải bộ ba A, B, X nào cũng thành perovskite 3D. Năm 1926 Goldschmidt đề xuất hệ số dung hạn t = (rA + rX) / [√2 (rB + rX)] [20]. t = 1 là vừa khít. Perovskite 3D thường nằm khoảng 0,8 đến 1,0."
			},
			{
				title: "CsPbI₃, t ≈ 0,85",
				body: "Cs hơi nhỏ. Khung dễ sụp thành pha delta màu vàng, các bát diện dùng chung cạnh (edge-sharing), hấp thụ kém. Bán kính Shannon: Pb²⁺ 1,19 Å, I⁻ 2,20 Å, Cs⁺ 1,88 Å [64]."
			},
			{
				title: "MAPbI₃, t ≈ 0,91",
				body: "Nằm giữa vùng an toàn. Về mặt hình học, đây là perovskite 3D dễ chịu. Bán kính hiệu dụng MA⁺ ≈ 2,17 Å [65]."
			},
			{
				title: "FAPbI₃, t ≈ 0,99",
				body: "FA hơi lớn (≈ 2,53 Å). Ở nhiệt độ phòng dễ chuyển sang pha lục giác màu vàng, các bát diện dùng chung mặt (face-sharing)."
			},
			{
				title: "Trộn khoảng 5% Cs",
				body: "Pha FA với một ít Cs kéo kích thước trung bình về vùng an toàn. FA₀.₉₅Cs₀.₀₅PbI₃ là lõi của nhiều pin trên 27% [39]."
			},
			{
				title: "t chỉ là sàng lọc gần đúng",
				body: "Bán kính hiệu dụng của ion hữu cơ là ước lượng. Bartel và cộng sự (2019) thấy ngưỡng t chỉ đoán đúng khoảng 74% trường hợp; hệ số τ của họ đúng khoảng 92% [21].",
				note: warn("Đừng coi t = 0,91 là một lời đảm bảo bền ngoài trời. Nó chỉ nói hình học có chịu không.")
			}
		]
	},
	{
		id: "phases",
		chapter: "c2",
		section: "2.5",
		title: "Khung nghiêng thì vùng cấm đổi",
		scene: "phases",
		cam: "default",
		controls: ["temperature"],
		tune: [
			{ temp: 70 },
			{ temp: 25 },
			{ temp: -130 },
			{ temp: 25 }
		],
		steps: [
			{
				title: "A nhỏ thì khung khom lại",
				body: "Khi ion A hơi nhỏ so với hốc, các bát diện xoay và nghiêng (octahedral tilting) để ôm lấy A. Góc liên kết Pb–I–Pb lệch khỏi 180°."
			},
			{
				title: "MAPbI₃ có ba pha theo nhiệt độ",
				body: "Trên khoảng 54 °C: lập phương, không nghiêng, Pb–I–Pb = 180°. Từ khoảng −111 °C đến 54 °C: tứ phương, bát diện kề xoay ngược quanh một trục — đây là nhiệt độ phòng. Dưới khoảng −111 °C: trực thoi, nghiêng cả ba trục [67]."
			},
			{
				title: "Kéo xuống trực thoi",
				body: "Thanh nhiệt độ đi từ pha bạn đang sống (tứ phương) xuống pha lạnh. Mô hình phóng đại góc nghiêng để mắt thấy được; trong tinh thể thật độ nghiêng nhỏ hơn hình vẽ."
			},
			{
				title: "Nghiêng nhiều thì vùng cấm rộng",
				body: "Góc càng lệch 180°, quỹ đạo của Pb và I càng chồng lấp kém, Eg càng rộng [68]. CsPbI₃ (A nhỏ, nghiêng nhiều) có Eg ≈ 1,73 eV. FAPbI₃ (A lớn, ít nghiêng) chỉ ≈ 1,48 eV. A điều khiển Eg gián tiếp qua hình học khung."
			}
		]
	},
	{
		id: "orbitals",
		chapter: "c2",
		section: "2.6",
		title: "Vì sao chì cho vùng cấm thẳng",
		scene: "orbitals",
		cam: "default",
		legend: [{
			swatch: "htl",
			label: "Đỉnh vùng hóa trị · I 5p + Pb 6s"
		}, {
			swatch: "electron",
			label: "Đáy vùng dẫn · Pb 6p"
		}],
		steps: [
			{
				title: "Cấu hình đảo ngược",
				body: "Ở perovskite chì iod, đỉnh vùng hóa trị đến từ quỹ đạo 5p của iod trộn với 6s của chì — cặp điện tử 6s² đơn độc (lone pair). Đáy vùng dẫn chủ yếu là quỹ đạo 6p của chì [16]."
			},
			{
				title: "Vùng cấm thẳng",
				body: "Điện tử nhảy lên vùng dẫn không cần mượn dao động mạng. Đó là vùng cấm thẳng (direct bandgap), nên hấp thụ rất mạnh — ngược với silicon."
			},
			{
				title: "Khối lượng hiệu dụng nhỏ",
				body: "Cả điện tử và lỗ trống đều «nhẹ», di chuyển dễ. Đây là một nửa lý do điện tích đi được rất xa ở chương 3."
			},
			{
				title: "Khuyết tật phổ biến chỉ nông",
				body: "Các khuyết tật dễ hình thành thường chỉ tạo mức nông, sát mép vùng. Phần dung thứ khuyết tật được kể kỹ ở mục 3.4."
			},
			{
				title: "Spin–quỹ đạo hạ đáy vùng dẫn",
				body: "Chì nặng nên tương tác spin–quỹ đạo (spin–orbit coupling) mạnh, kéo đáy vùng dẫn xuống đáng kể. Mô phỏng mà bỏ hiệu ứng này sẽ đoán Eg sai.",
				note: base("Mục này nâng cao hơn các mục trước. Bạn có thể xem chuyển động rồi đọc lại.")
			}
		]
	},
	{
		id: "alloy",
		chapter: "c2",
		section: "2.7",
		title: "Trộn A, B, X để vặn tính chất",
		scene: "alloy",
		cam: "crystal",
		controls: [
			"bromide",
			"sn",
			"light"
		],
		tune: [
			{
				br: 0,
				sn: 0,
				light: false
			},
			{
				br: 45,
				sn: 0,
				light: false
			},
			{
				br: 100,
				sn: 0,
				light: false
			},
			{
				br: 40,
				sn: 0,
				light: true
			},
			{
				br: 0,
				sn: 0,
				light: false
			},
			{
				br: 0,
				sn: 50,
				light: false
			}
		],
		legend: [
			{
				swatch: "iodine",
				label: "Giàu iod"
			},
			{
				swatch: "br",
				label: "Giàu brom"
			},
			{
				swatch: "tin",
				label: "Thiếc trên vị trí B"
			}
		],
		steps: [
			{
				title: "Trộn ở vị trí X",
				body: "Tăng tỉ lệ brom làm mạng co lại. Eg đi từ khoảng 1,57 eV (thuần iod) tới ≈ 2,3 eV (thuần brom). Màu chuyển từ nâu đen sang cam [18]."
			},
			{
				title: "Kéo thanh brom",
				body: "Mô hình đổi màu theo tỉ lệ Br. Đây là núm vặn thô nhất: cùng một khung tinh thể, chỉ đổi halogen là đổi màu và đổi Eg liên tục."
			},
			{
				title: "Thuần brom",
				body: "Eg lớn hợp đèn và lớp màu, nhưng hấp thụ ít photon đỏ hơn. Pin một lớp thường không muốn Eg quá cao."
			},
			{
				title: "Hiệu ứng Hoke",
				body: "Khi chiếu sáng, perovskite trộn I/Br có thể tự tách pha: iod gom thành vùng giàu iod, Eg thấp hơn. Điện tích dồn về đó, ánh sáng phát ra lệch về ≈ 1,68 eV, điện áp bị kéo xuống. Tắt đèn, ion trộn lại — hiện tượng thuận nghịch [24].",
				note: warn("Bài học thực hành: pin một lớp nên dùng thuần iod. Khi cần Eg cao, giữ brom vừa phải và ổn định giao diện.")
			},
			{
				title: "Trộn ở vị trí A",
				body: "Trộn ba cation Cs/MA/FA giúp màng bền hơn và lặp lại tốt. Saliba và Grätzel đạt 21,1% năm 2016 với triple cation [22]."
			},
			{
				title: "Trộn Sn/Pb ở vị trí B",
				body: "Thay một phần chì bằng thiếc kéo Eg xuống ≈ 1,2–1,3 eV — hợp làm lớp dưới của tandem toàn perovskite. Thiếc có bài toán oxy hóa riêng, xem mục chì."
			}
		]
	},
	{
		id: "nano",
		chapter: "c2",
		section: "2.8",
		title: "Ba dạng nano: màng, chấm lượng tử, lớp 2D",
		scene: "nano",
		cam: "default",
		controls: ["nwell"],
		tune: [
			{ nWell: 99 },
			{ nWell: 99 },
			{ nWell: 1 },
			{ nWell: 2 },
			{ nWell: 99 }
		],
		steps: [
			{
				title: "Vài nanomét quyết định pin",
				body: "Một nanomét là một phần tỷ mét. Perovskite được gọi là vật liệu nano vì những gì xảy ra từ vài nm đến vài trăm nm quyết định pin tốt hay xấu."
			},
			{
				title: "Màng đa tinh thể",
				body: "Lớp hấp thụ trong pin dày khoảng 0,5 µm, hạt tinh thể vài trăm nm. Ranh giới hạt và bề mặt là nơi khuyết tật tập trung."
			},
			{
				title: "Chấm lượng tử",
				body: "Nano tinh thể cỡ 5–15 nm, bọc bởi phối tử hữu cơ. Chúng phát sáng rất mạnh, màu tùy thành phần, khoảng 410–700 nm [45]. Dùng cho màn hình và LED."
			},
			{
				title: "Giếng lượng tử 2D",
				body: "Perovskite Ruddlesden–Popper: ion hữu cơ lớn như butylammonium cắt khung 3D thành lớp. Điện tử bị nhốt trong lớp vô cơ — giếng lượng tử. n = 1 cho 2,43 eV, n = 2 cho 2,17 eV, 3D (n = ∞) ≈ 1,5 eV [69]."
			},
			{
				title: "Chỉ nên mặc một lớp áo mỏng",
				body: "Lớp 2D bền với nước nên dùng làm áo bảo vệ bề mặt. Điện tích khó xuyên lớp hữu cơ, nên áo phải thật mỏng."
			}
		]
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
				body: "Khoảng 1,48 eV với FAPbI₃, 1,57 eV với MAPbI₃, tới 2,3 eV với MAPbBr₃."
			},
			{
				title: "Hấp thụ nông, bờ rất dốc",
				body: "Độ sâu hấp thụ vùng nhìn thấy chỉ khoảng 100 nm, nên lớp mỏng là đủ. Năng lượng Urbach ≈ 15 meV [13]: bờ hấp thụ dốc, ít mất điện áp."
			},
			{
				title: "Exciton yếu, điện tích đi xa",
				body: "Năng lượng liên kết exciton chỉ vài meV ở nhiệt độ phòng [14]. Độ dài khuếch tán ≈ 0,1–1 µm trong màng, và hơn 10 µm tới hơn 175 µm trong đơn tinh thể [9][11]."
			},
			{
				title: "Ion iod cũng đi được — và đó là vấn đề",
				body: "Năng lượng hoạt hóa di chuyển của ion iod ≈ 0,6 eV [25]. Ion dễ nhảy nên vật liệu kém bền. Nhiệt độ xử lý chỉ 100–150 °C, nên chế tạo rẻ.",
				note: warn("Cùng một mạng ion «mềm» tạo ra cả ưu điểm lẫn nhược điểm. Đừng tách hai chuyện này ra.")
			}
		]
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
				caption: "Mốc 3,8% năm 2009. Đường cam là một lớp. Đường lục ngang là mức 33,7%."
			},
			{
				title: "Đường một lớp",
				body: "Trong khoảng 17 năm, pin một lớp leo tới 27,3% trên biểu đồ NREL 2026 được tài liệu dẫn [1]. Đường vẽ ở đây là minh họa các mốc tài liệu nêu, không phải từng điểm gốc.",
				caption: "Đường cam nối các mốc tài liệu nêu cho pin một lớp, tới 27,3%. Không phải số đo gốc từng năm.",
				note: warn("Số thị trường và thông cáo công ty ở chương 4 cần đối chiếu biểu đồ gốc tại nrel.gov trước khi trích dẫn.")
			},
			{
				title: "Tandem vượt trần một lớp",
				body: "Tandem perovskite/silicon được tài liệu ghi 35% [1]. Nó được phép vượt 33,7% vì không còn là pin một lớp.",
				caption: "Đường lam là tandem và được phép vượt 33,7% vì không còn là pin một lớp."
			},
			{
				title: "Sáu lý do phía sau tốc độ ấy",
				body: "Hấp thụ mạnh, điện tích đi xa, exciton tự tách, dung thứ khuyết tật, chỉnh Eg dễ, chế tạo rẻ. Các mục sau lần lượt mở từng lý do.",
				caption: "Sáu lý do mở ở mục 3.1 đến 3.6. Hình chỉ giữ các đường để thấy chỗ đứng."
			}
		]
	},
	{
		id: "absorb",
		chapter: "c3",
		section: "3.1",
		title: "Lý do 1 — lớp mỏng vẫn hấp thụ gần hết",
		scene: "absorb",
		cam: "default",
		legend: [
			{
				swatch: "electron",
				label: "Xanh lam, chết ở mặt"
			},
			{
				swatch: "warn",
				label: "Đỏ, đi sâu hơn"
			},
			{
				swatch: "sun",
				label: "Hồng ngoại dài, xuyên qua"
			}
		],
		steps: [
			{
				title: "Mỏng hơn sợi tóc khoảng 100 lần",
				body: "Nhờ vùng cấm thẳng, độ sâu hấp thụ ở vùng nhìn thấy chỉ cỡ 100 nm. Lớp dày 500 nm đã giữ gần hết ánh sáng nhìn thấy."
			},
			{
				title: "Xanh chết sớm, đỏ đi sâu, hồng ngoại thoát",
				body: "Ánh sáng xanh lam bị nuốt sát bề mặt. Đỏ đi sâu hơn nhưng vẫn bị giữ phần lớn. Chỉ hồng ngoại dài hơn khoảng 790 nm — năng lượng dưới 1,57 eV — mới xuyên qua lớp MAPbI₃."
			},
			{
				title: "Bờ Urbach dốc như GaAs",
				body: "Năng lượng Urbach chỉ ≈ 15 meV, ngang bán dẫn đơn tinh thể chất lượng cao, dù màng được phủ từ dung dịch [13]. Bờ dốc nghĩa là rất ít trạng thái đuôi trong vùng cấm, nên ít mất điện áp."
			}
		]
	},
	{
		id: "diffusion",
		chapter: "c3",
		section: "3.2",
		title: "Lý do 2 — điện tích kịp tới điện cực",
		scene: "diffusion",
		cam: "default",
		controls: ["lifetime"],
		tune: [
			{
				tau: 273,
				singleCrystal: false
			},
			{
				tau: 273,
				singleCrystal: false
			},
			{
				tau: 273,
				singleCrystal: false
			},
			{
				tau: 4e5,
				singleCrystal: true
			}
		],
		steps: [
			{
				title: "Không chạy thẳng",
				body: "Sau khi sinh ra, điện tử đi ngẫu nhiên. Đó là khuếch tán (diffusion). Quãng đường trung bình trước khi tái hợp là độ dài khuếch tán."
			},
			{
				title: "L = √(D·τ)",
				body: "D là hệ số khuếch tán, τ là thời gian sống. Pin tốt khi L lớn hơn bề dày lớp hấp thụ. Màn hình vẽ quả cầu bán kính L cạnh một lát màng 0,5 µm. Công thức dùng D minh họa 0,05 cm²/s cho màng và 0,8 cm²/s khi bật đơn tinh thể."
			},
			{
				title: "Hai bài Science năm 2013",
				body: "Perovskite chứa clo có L vượt 1 µm, gấp đôi bề dày lớp, thời gian sống 273 ns [9][10]. Hai bài ấy là cột mốc khiến cả ngành bùng lên."
			},
			{
				title: "Đơn tinh thể còn dài hơn",
				body: "Không còn ranh giới hạt, L vượt 10 µm, có phép đo hơn 175 µm [11][12]. Kéo thời gian sống, hoặc bật đơn tinh thể, để quả cầu nuốt gọn lát màng."
			}
		]
	},
	{
		id: "exciton",
		chapter: "c3",
		section: "3.3",
		title: "Lý do 3 — cặp điện tích tự tách ở nhiệt phòng",
		scene: "exciton",
		cam: "default",
		legend: [{
			swatch: "electron",
			label: "Điện tử"
		}, {
			swatch: "hole",
			label: "Lỗ trống"
		}],
		steps: [
			{
				title: "Exciton là một cặp bị hút",
				body: "Điện tử và lỗ trống có thể dính thành một cặp gọi là exciton. Năng lượng cần để tách chúng là năng lượng liên kết exciton."
			},
			{
				title: "Vài meV thua nhiệt phòng",
				body: "Ở perovskite, năng lượng liên kết chỉ vài meV ở nhiệt độ phòng [14][43]. Dao động nhiệt kT ở 300 K khoảng 26 meV. Nhiệt độ phòng đủ lắc để tách gần như mọi cặp thành hạt tự do [77]."
			},
			{
				title: "Hữu cơ thì không được thế",
				body: "Bán dẫn hữu cơ có năng lượng liên kết hàng trăm meV, nên pin hữu cơ phải trộn hai vật liệu thành tiếp xúc dị thể khối (bulk heterojunction). Perovskite không cần. Cấu trúc pin đơn giản hơn nhiều."
			}
		]
	},
	{
		id: "defects",
		chapter: "c3",
		section: "3.4",
		title: "Lý do 4 — khuyết tật phổ biến ít gây hại",
		scene: "defects",
		cam: "crystal",
		legend: [{
			swatch: "warn",
			label: "Bẫy sâu"
		}, {
			swatch: "good",
			label: "Bẫy nông"
		}],
		steps: [
			{
				title: "Không tinh thể nào hoàn hảo",
				body: "Luôn có chỗ trống (vacancy), nguyên tử thừa chen khe (interstitial), hoặc nguyên tử đứng sai chỗ (antisite). Ở nhiều bán dẫn, khuyết tật tạo mức giữa vùng cấm."
			},
			{
				title: "Bẫy sâu nuốt điện tử",
				body: "Bẫy sâu (deep trap) là nơi điện tử rơi vào, gặp lỗ trống và mất năng lượng. Đó là tái hợp Shockley–Read–Hall. Điện áp của pin chết ở đây."
			},
			{
				title: "Bẫy nông chỉ giữ tạm",
				body: "Bẫy nông sát mép vùng. Nhiệt đẩy điện tử ra lại. Yin, Shi và Yan (2014) tính được ở MAPbI₃, chỗ trống iod Vᵢ và chỗ trống chì Vₚb — những khuyết tật dễ hình thành — chỉ tạo bẫy nông. Khuyết tật gây bẫy sâu thì năng lượng hình thành cao, nên hiếm [15][16]."
			},
			{
				title: "Vì vậy dung dịch vẫn cho pin tốt",
				body: "Tính chất này gọi là dung thứ khuyết tật (defect tolerance). Đó là lý do một màng phủ đơn giản vẫn đạt hiệu suất cao.",
				note: warn("Dung thứ không có nghĩa miễn nhiễm. Khuyết tật bề mặt và ranh giới hạt vẫn ăn điện áp. Mọi pin kỷ lục đều phải thụ động hóa bề mặt.")
			}
		]
	},
	{
		id: "tune",
		chapter: "c3",
		section: "3.5",
		title: "Lý do 5 — vùng cấm chỉnh được theo thành phần",
		scene: "tune",
		cam: "default",
		controls: ["eg"],
		tune: [
			{ eg: 1.53 },
			{ eg: 1.53 },
			{ eg: 1.7 },
			{ eg: 1.25 },
			{ eg: 2.3 },
			{ eg: 1.12 }
		],
		steps: [
			{
				title: "Một núm, một dải rộng",
				body: "Chỉ cần đổi tỉ lệ thành phần, Eg chạy liên tục khoảng 1,2–3,0 eV. Silicon thì khóa cứng ở 1,12 eV."
			},
			{
				title: "Pin một lớp ≈ 1,5 eV",
				body: "Gần đáy của giới hạn Shockley–Queisser. Lõi FA/Cs thuần iod trong đề xuất chương 5 nằm quanh 1,53 eV."
			},
			{
				title: "Lớp trên tandem ≈ 1,7 eV",
				body: "Nuốt phần xanh và lục, để đỏ và hồng ngoại cho silicon hoặc cho lớp thiếc–chì phía dưới."
			},
			{
				title: "Lớp dưới thiếc–chì ≈ 1,25 eV",
				body: "Tandem toàn perovskite cần một Eg thấp mà silicon không tự đổi được. Sn/Pb là núm đó."
			},
			{
				title: "Và cả đèn nhiều màu",
				body: "Cùng họ vật liệu có thể thành LED. Kéo Eg lên vùng brom là màu chuyển từ nâu sang cam, rồi tới những màu sáng hơn."
			}
		]
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
				body: "Hòa muối PbI₂ và muối hữu cơ trong dung môi như DMF/DMSO, phủ lên đế như sơn, sấy 100–150 °C."
			},
			{
				title: "Silicon phải vào lò",
				body: "Silicon được nấu trên 1400 °C để kéo tinh thể. Hai nhiệt độ ấy đang đứng cạnh nhau trên bàn thí nghiệm."
			},
			{
				title: "Ít vật liệu, nhiều loại đế",
				body: "Lớp chỉ dày khoảng 0,5 µm. Phủ được lên kính, nhựa dẻo, hoặc trực tiếp lên pin silicon có sẵn. Hiếm vật liệu nào gom đủ sáu ưu điểm cùng lúc."
			}
		]
	},
	{
		id: "plqy",
		chapter: "c3",
		section: "3.7",
		title: "Hệ quả — pin tốt cũng phát sáng tốt",
		scene: "plqy",
		cam: "default",
		controls: ["plqy"],
		tune: [
			{ plqy: .1 },
			{ plqy: .01 },
			{ plqy: 1e-4 },
			{ plqy: .05 }
		],
		steps: [
			{
				title: "Quan hệ thuận nghịch Rau",
				body: "Voc = Voc,rad + (kT/q)·ln(PLQY) [71]. Voc,rad là điện áp khi chỉ còn tái hợp phát sáng. PLQY là tỉ lệ cặp điện tử–lỗ trống tái hợp bằng cách nhả photon."
			},
			{
				title: "Mỗi thập phân mất khoảng 60 mV",
				body: "(kT/q)·ln(10) ≈ 60 mV ở 300 K. PLQY giảm 10 lần thì pin mất khoảng 60 mV. Mô hình lấy Voc,rad minh họa = 1,32 V."
			},
			{
				title: "Hai thập phân là khoảng 120 mV",
				body: "Từ 1% xuống 0,01% là hai lần chia 10. Đó chính là câu tự kiểm tra số 4 ở cuối tài liệu."
			},
			{
				title: "Thụ động hóa để kéo Voc",
				body: "Phủ phân tử lấp bẫy làm tăng PLQY. Voc nhờ đó tới khoảng 1,2 V — ví dụ 1,203 V ở pin 26,9% trên 1 cm² [2]."
			}
		]
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
				caption: "Bốn cột. Chiều cao là hiệu suất một lớp gần đúng. Cột perovskite không dùng số tandem 35%."
			},
			{
				title: "Hiệu suất và độ dày",
				body: "Silicon ≈ 27–28% nhưng dày 150–180 µm. CdTe ≈ 23%, dày vài µm. OPV ≈ 20%, dày ≈ 0,1 µm. Perovskite 27,3% một lớp và 35% tandem, dày ≈ 0,5 µm.",
				caption: "Nhãn dưới cột là độ dày. Silicon cao về hiệu suất nhưng dày hơn perovskite khoảng 300 lần."
			},
			{
				title: "Nhiệt độ và núm vùng cấm",
				body: "Silicon trên 1400 °C, không chỉnh Eg. CdTe khoảng 500–600 °C, chỉnh Eg hạn chế. OPV và perovskite đều dưới 150 °C; perovskite chỉnh Eg rất rộng.",
				caption: "Nhãn tiếp theo là nhiệt độ chế tạo. Perovskite nằm dưới 150 °C."
			},
			{
				title: "Bền và độc",
				body: "Silicon và CdTe đã có 25 năm ngoài trời; CdTe vướng cadmium. OPV còn hạn chế về bền. Perovskite đang cải thiện, và vướng chì — lượng nhỏ, nhưng hòa tan được trong nước.",
				caption: "Bước cuối nhắc độ bền: silicon và CdTe đã có khoảng 25 năm ngoài trời. Perovskite chưa có mức ấy."
			}
		]
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
			{
				enemy: 1,
				defense: false
			},
			{
				enemy: 2,
				defense: false
			},
			{
				enemy: 3,
				defense: false
			},
			{
				enemy: 4,
				defense: false
			},
			{
				enemy: 5,
				defense: false
			},
			{
				enemy: 5,
				defense: true
			}
		],
		steps: [
			{
				title: "1 · Hơi ẩm",
				body: "Nước len vào ranh giới hạt, phân hủy perovskite thành PbI₂ màu vàng. Chống bằng lớp 2D kỵ nước và đóng gói kín."
			},
			{
				title: "2 · Oxy và ánh sáng",
				body: "Oxy tạo gốc superoxide (O₂⁻) tại chỗ trống iod [27]. Cần thụ động hóa và đóng gói."
			},
			{
				title: "3 · Nhiệt",
				body: "Phân tử MA dễ bay hơi khi tấm pin nóng. Cách chống trong tài liệu: bỏ MA, dùng FA cộng Cs."
			},
			{
				title: "4 · Tia cực tím",
				body: "Lớp TiO₂ bị kích hoạt dưới UV và tạo bẫy sâu [26]. Dùng kính lọc UV hoặc đổi lớp vận chuyển."
			},
			{
				title: "5 · Ion iod di chuyển",
				body: "Ion iod nhảy qua chỗ trống, hàng rào năng lượng khoảng 0,6 eV, rồi ăn mòn điện cực và gây tách pha [25]. Cần lớp rào và giảm chỗ trống."
			},
			{
				title: "Bật phòng thủ",
				body: "Mạng ion mềm vừa giúp tinh thể tự vá, vừa mở cửa cho cả năm kẻ thù. Nút phòng thủ trên màn hình cho thấy ý chương 5: chặn đồng thời, không chặn từng cái một.",
				note: base("Chính liên kết yếu tạo hiệu suất cao cũng là gốc của sự kém bền.")
			}
		]
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
				caption: "Sơ đồ tổng quan bảy cách chế tạo halide perovskite. Mỗi thẻ là một lộ trình sẽ được mở từng nhịp ở các mục 4.2–4.4. Màu tím là màng hấp thụ, vàng là PbI₂ chưa chuyển pha, lam là buồng chân không."
			},
			{
				title: "1 · Quay phủ + dung môi đối",
				body: "Nhỏ mực lên đế, quay vài nghìn vòng/phút, rồi nhỏ chlorobenzene để cả màng kết tinh cùng lúc. Sấy 100–150 °C. Đây là cách làm tế bào nhỏ trong phòng thí nghiệm [47].",
				caption: "Thẻ 1 trên bản đồ: quay phủ một bước kèm dung môi đối. Dùng cho tế bào cỡ centimet, không dùng cho tấm mét vuông."
			},
			{
				title: "2 · Lắng đọng hai bước",
				body: "Phủ PbI₂ vàng trước, rồi nhúng hoặc phủ muối hữu cơ MAI/FAI. Màng chuyển từ vàng sang đen khi perovskite hình thành [46].",
				caption: "Thẻ 2: hai lớp xếp lần lượt. Vàng = PbI₂, đen = perovskite sau khi gặp muối hữu cơ."
			},
			{
				title: "3 · Bay hơi chân không",
				body: "Không dung môi. Muối bị đốt trong buồng hút chân không, hơi bám lên đế — kể cả bề mặt nhám của silicon. Năm 2026 tài liệu dẫn tandem Oxford làm hoàn toàn bằng chân không, 27,2% [51].",
				caption: "Thẻ 3: nguồn nóng ở dưới, đế ở trên. Hạt hơi đi theo đường thẳng trong chân không nên lấp được chỗ lồi lõm."
			},
			{
				title: "4 · Kết tinh nhiệt độ ngược",
				body: "Độ tan của MAPbX₃ trong một số dung môi giảm khi nóng. Đun dung dịch đã hòa tan thì tinh thể lớn mọc ra, nhanh hơn khoảng 10 lần các cách cũ [49]. Dùng cho đầu dò tia X và đo đạc cơ bản.",
				caption: "Thẻ 4: lọ dung dịch, nhiệt độ tăng, một tinh thể lớn — không phải màng mỏng."
			},
			{
				title: "5 · Chích nóng",
				body: "Đun muối chì halide với oleic acid và oleylamine ở 140–200 °C, chích nhanh cesium. Mầm bùng cùng lúc theo mô hình LaMer [73], rồi làm lạnh bằng nước đá. Ra chấm khoảng 10 nm, phát từ 410 đến 700 nm [45].",
				caption: "Thẻ 5: nhiều hạt nano đồng kích thước. Màu phát sáng đổi theo halide, không phải màu của mực pin."
			},
			{
				title: "6 · Dao gạt và dao khí",
				body: "Lưỡi dao kéo một lớp mực mỏng trên kính hoặc nhựa. Dao khí nitơ thổi khô ngay, thay vai trò của dung môi đối, để mầm ra cùng lúc trên diện rộng [50].",
				caption: "Thẻ 6: lưỡi dao định độ dày ướt; luồng N₂ phía sau làm khô tức thì. Mũi tên chỉ chiều chạy của đế."
			},
			{
				title: "7 · Phủ khe và cuộn-sang-cuộn",
				body: "Slot-die đẩy mực qua một khe hẹp lên tấm chạy liên tục, giống in báo. Tài liệu ghi pin cuộn-sang-cuộn đã khoảng 10–14%. Chân không cũng phủ được diện lớn, và ngành màn hình đã quen thiết bị này [50].",
				caption: "Thẻ 7: đầu phủ khe đứng yên, cuộn đế chạy bên dưới. Con số 10–14% là mức tài liệu ghi cho pin cuộn, không phải kỷ lục tế bào nhỏ."
			}
		]
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
				caption: "Hai giai đoạn của mọi cách nuôi tinh thể: tạo mầm, rồi lớn lên."
			},
			{
				title: "Mầm cùng một lúc",
				body: "Bí quyết của màng mịn, hạt đều: mọi mầm xuất hiện đồng loạt, rồi lớn với tốc độ như nhau.",
				caption: "Mầm cùng cỡ nghĩa là chúng xuất hiện cùng lúc và lớn cùng tốc độ."
			},
			{
				title: "Mầm rải rác thì thủng lỗ kim",
				body: "Nếu mầm xuất hiện lúc có lúc không, màng có lỗ kim (pinhole) và hạt to nhỏ lẫn lộn. Một lỗ kim trên tấm pin lớn có thể thành đường chập.",
				caption: "Chấm cam là lỗ kim. Trên tấm lớn, một lỗ có thể thành đường chập cả mô-đun."
			}
		]
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
				caption: "Hình động nhịp 1 của quay phủ: giọt mực rơi xuống tâm đế tròn. Đế chưa quay nhanh. Chú thích màu: vàng nhạt = mực chưa kết tinh."
			},
			{
				title: "Nhịp 2 — quay vài nghìn vòng/phút",
				body: "Đế quay rất nhanh. Lực ly tâm trải mực thành màng ướt và hất phần thừa. Dung môi bắt đầu bay, nhưng nếu chỉ chờ tự khô thì mầm xuất hiện lúc có lúc không.",
				more: "Vài nghìn vòng/phút là tốc độ phòng thí nghiệm điển hình cho tế bào nhỏ, không phải tốc độ của dây chuyền mét vuông.",
				caption: "Nhịp 2: đế quay, màng ướt mỏng dần từ tâm ra rìa. Các vòng cung là quỹ đạo mực bị văng."
			},
			{
				title: "Nhịp 3 — nhỏ dung môi đối",
				body: "Vài giây sau, nhỏ chlorobenzene hoặc một dung môi không hòa tan perovskite. Độ tan tụt đột ngột, nên mầm xuất hiện gần như cùng một lúc trên cả mặt đế [47].",
				more: "Đây là mẹo then chốt của màng mịn: không phải quay cho khô tự nhiên, mà ép kết tinh đồng loạt.",
				caption: "Nhịp 3: giọt dung môi đối (lam) rơi lên màng đang quay. Màng đổi từ vàng nhạt sang tím đen khi tinh thể perovskite hình thành đồng loạt."
			},
			{
				title: "Nhịp 4 — sấy 100–150 °C",
				body: "Đưa đế lên bàn nhiệt. Dung môi còn lại ra hết, hạt tinh thể lớn thêm một chút, màng ổn định màu đen. Nhiệt này thấp hơn rất nhiều so với lò silicon trên 1400 °C.",
				caption: "Nhịp 4: bàn nhiệt dưới đế. Màng đã đen. Nhiệt độ ghi trên nhãn là khoảng sấy của perovskite, không phải nhiệt độ nóng chảy."
			},
			{
				title: "Hai bước — phủ PbI₂ vàng",
				body: "Cách thứ hai tách phản ứng làm hai lớp. Trước hết phủ PbI₂. Màng có màu vàng đặc trưng, chưa phải perovskite [46].",
				caption: "Lắng đọng hai bước, nhịp A: lớp PbI₂ vàng trên đế. Chưa có cation A trong màng."
			},
			{
				title: "Hai bước — cho MAI hoặc FAI vào",
				body: "Nhúng đế vào dung dịch muối hữu cơ, hoặc phủ MAI/FAI lên trên. Ion hữu cơ khuếch tán vào mạng PbI₂, màng chuyển từ vàng sang đen khi thành ABX₃.",
				more: "Thời gian nhúng quyết định phản ứng có chạy hết chiều dày hay còn lõi PbI₂ vàng.",
				caption: "Nhịp B: các chấm lục là muối hữu cơ đi xuống lớp vàng. Vùng đã phản ứng chuyển đen từ trên xuống."
			},
			{
				title: "Chân không — đốt nguồn, đế ở trên",
				body: "Bỏ dung môi. Trong buồng đã hút khí, thuyền kim loại chứa muối được đốt nóng. Hơi bay lên và bám vào đế lạnh hơn treo phía trên.",
				caption: "Bay hơi nhiệt trong chân không: nguồn sáng ở dưới, đế ở trên, các hạt là hơi tiền chất. Buồng vẽ dạng khung dây, không theo tỉ lệ thiết bị thật."
			},
			{
				title: "Chân không — bám cả mặt gồ ghề",
				body: "Hạt hơi đi gần như thẳng trong chân không, nên phủ được lên bề mặt nhám của pin silicon có sẵn. Tài liệu dẫn tandem Oxford làm hoàn toàn bằng chân không đạt 27,2% năm 2026 [51].",
				note: warn("Mốc 27,2% được tài liệu đánh dấu là cần đối chiếu bài gốc [51]."),
				caption: "Đế silicon vẽ có gờ. Màng perovskite bám theo gờ chứ không chỉ nằm trên mặt phẳng. Số 27,2% là mốc tài liệu dẫn, không phải số đo của mô hình."
			}
		]
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
				caption: "Nhịp 1 của kết tinh nhiệt độ ngược: lọ dung dịch trong, chưa có tinh thể. Nhiệt độ nhãn còn thấp."
			},
			{
				title: "Đun — độ tan giảm, mầm xuất hiện",
				body: "Tăng nhiệt. Độ tan giảm nên dung dịch trở nên quá bão hòa. Vài mầm tinh thể xuất hiện trong lòng chất lỏng, không cần đế quay.",
				caption: "Nhịp 2: lọ ấm lên (quầng cam). Những chấm tím là mầm vừa xuất hiện trong dung dịch."
			},
			{
				title: "Giữ nóng cho tinh thể lớn",
				body: "Giữ nhiệt ổn định. Mầm ăn ion trong dung dịch và lớn thành tinh thể milimet, nhanh hơn khoảng 10 lần các cách nuôi cũ [49]. Không có ranh giới hạt như màng đa tinh thể.",
				caption: "Nhịp 3: một bát diện lớn trong lọ. Kích thước vẽ phóng đại so với lọ để thấy hình khối, không phải tinh thể thật chiếm hết thể tích."
			},
			{
				title: "Dùng để đo và làm đầu dò",
				body: "Đơn tinh thể ít ranh giới hạt nên điện tích đi được rất xa — có báo cáo trên 175 µm [11]. Người ta dùng chúng cho đầu dò tia X và để đo tính chất gốc, không phải để cán thành tấm pin mái nhà.",
				caption: "Nhịp 4: tinh thể đặt trên đế đo. Mũi tên là tia X tới; tín hiệu ra ở điện cực. Đây là vai trò của đơn tinh thể, khác màng 0,5 µm của pin."
			},
			{
				title: "Chích nóng — đun muối chì với phối tử",
				body: "Trong khí trơ, đun muối chì halide cùng oleic acid và oleylamine ở 140–200 °C. Phối tử sẽ bọc bề mặt hạt nano, không cho chúng dính vào nhau [45].",
				caption: "Nhịp 1 của chích nóng: bình cầu, dung dịch chì nóng. Chưa chích cesium nên chưa có màu phát quang."
			},
			{
				title: "Chích cesium — mầm bùng cùng lúc",
				body: "Bơm nhanh dung dịch cesium oleate. Nồng độ vọt qua ngưỡng, hàng loạt mầm ra cùng một lúc theo mô hình LaMer [73]. Vì ra cùng lúc, các hạt có kích thước gần nhau.",
				more: "Nếu chích chậm, mầm ra trước sẽ lớn hơn mầm ra sau — màu phát sáng sẽ lẫn.",
				caption: "Nhịp 2: kim bơm cesium vào bình. Đám chấm cùng kích thước là mầm vừa bùng. LaMer là mô hình cổ điển của sự bùng mầm [73]."
			},
			{
				title: "Nước đá — chấm khoảng 10 nm, đủ màu",
				body: "Sau vài giây, nhúng bình vào nước đá để dừng lớn lên. Hạt khoảng 10 nm. Đổi I/Br/Cl thì màu phát đi từ đỏ 700 nm tới tím 410 nm [45].",
				caption: "Nhịp 3: dãy lọ phát quang 410–700 nm. Mỗi lọ là một thành phần halide, không phải bảy bước của cùng một phản ứng."
			}
		]
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
				caption: "Trái: tế bào nhỏ. Phải: tấm lớn với một chấm cam là lỗ kim. Chú thích: một lỗ trên tấm lớn nguy hiểm hơn cùng một lỗ trên tế bào 0,05 cm² vì nó có thể chập cả mô-đun."
			},
			{
				title: "Dao gạt trải mực",
				body: "Lưỡi dao cách đế một khe cố định và chạy dọc. Khe ấy đặt độ dày ướt. Mực perovskite bị kéo thành một dải đều, không cần đế quay [50].",
				caption: "Nhịp 1 của phủ dao gạt: lưỡi xám chạy sang phải, vệt tím là mực vừa được trải. Mũi tên là chiều dao. Độ dày vẽ phóng đại."
			},
			{
				title: "Dao khí nitơ làm khô tức thì",
				body: "Ngay sau lưỡi dao, một khe thổi khí N₂. Dung môi bay rất nhanh, giống vai trò của chlorobenzene ở quay phủ: mầm ra cùng lúc trên cả chiều rộng tấm.",
				caption: "Nhịp 2: luồng lam là N₂. Vùng vừa bị thổi đổi sang đen vì kết tinh đồng loạt. Không còn giọt dung môi đối."
			},
			{
				title: "Phủ khe — mực đi qua một khe hẹp",
				body: "Slot-die giữ đầu phủ đứng yên. Mực được bơm qua một khe, tạo cầu lỏng giữa đầu phủ và đế đang chạy. Tốc độ bơm và tốc độ đế cùng quyết định độ dày.",
				caption: "Đầu phủ khe ở trên, đế chạy bên dưới. Cầu chất lỏng nối hai bên là chỗ mực thoát ra. Đây là lát cắt ngang, không phải nhìn từ trên."
			},
			{
				title: "Cuộn sang cuộn — chạy như in báo",
				body: "Đế nhựa đi từ cuộn này sang cuộn kia, qua đầu phủ khe rồi qua vùng sấy. Tài liệu ghi hiệu suất pin làm theo kiểu này khoảng 10–14% — thấp hơn tế bào nhỏ, nhưng làm được diện dài.",
				caption: "Hai trục cuộn, dải đế chạy liên tục, vùng tím là màng vừa phủ. Con số 10–14% là mức tài liệu ghi cho quy trình cuộn, không phải kỷ lục 27% của tế bào nhỏ."
			},
			{
				title: "Chân không cho mặt lớn và mặt nhám",
				body: "Bay hơi chân không không phụ thuộc vào mực chảy. Nó phủ đều tấm lớn và cả bề mặt kim tự tháp của silicon. Ngành màn hình và bán dẫn đã có sẵn lò loại này.",
				caption: "Buồng chân không khổ lớn. Các hạt hơi rơi đều lên tấm. So với phủ ướt, không có vệt dao hay mép giọt."
			}
		]
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
				body: "Tận dụng hấp thụ mạnh và quãng đường điện tích dài. Mức trưởng thành mà tài liệu ghi: thí điểm."
			},
			{
				title: "Tandem perovskite/silicon",
				body: "Eg khoảng 1,7 eV, phủ được lên silicon có sẵn. Thí điểm, và đã chạm cửa thương mại."
			},
			{
				title: "Pin trong nhà và pin dẻo",
				body: "Eg chỉnh được, phủ nhiệt độ thấp lên nhựa. Vẫn là thí điểm."
			},
			{
				title: "Lớp chuyển màu cho màn hình",
				body: "Nano tinh thể phát sáng mạnh, màu thuần. Tài liệu xếp gần thương mại."
			},
			{
				title: "Đèn PeLED",
				body: "PLQY cao. Tài liệu dẫn hiệu suất lượng tử ngoài khoảng 31% với màu lục [55], nhưng lam còn yếu, và nguồn ấy được đánh dấu cần kiểm chứng."
			},
			{
				title: "Cảm biến quang",
				body: "Nhạy sáng, dòng tối thấp [56]. Còn trong phòng thí nghiệm."
			},
			{
				title: "Đầu dò tia X và chất phát quang",
				body: "Pb và Cs nặng nên nuốt tia X mạnh [57][58]. Phòng thí nghiệm đến thí điểm."
			},
			{
				title: "Nhiên liệu mặt trời",
				body: "Pin cấp điện áp cho tách nước hoặc khử CO₂ [59]. Vẫn là nghiên cứu."
			}
		]
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
				body: "Module tandem 60 tế bào, khoảng 1,6 m², hiệu suất 26,9% do Fraunhofer chứng nhận [61]."
			},
			{
				title: "4/2025 · LONGi 34,85%",
				body: "Pin tandem silicon/perovskite, NREL chứng nhận theo thông cáo được tài liệu dẫn [4]."
			},
			{
				title: "7/2025 · Caelux",
				body: "Giao lô kính phủ perovskite thương mại đầu tiên để gắn lên tấm silicon [62]."
			},
			{
				title: "2026 · Biểu đồ và module",
				body: "Tài liệu ghi biểu đồ NREL: một lớp 27,3%, tandem 35% [1]; bảng hiệu suất ghi module tandem LONGi 29,4% trên khoảng 1,7 m² [2]."
			},
			{
				title: "7/2026 · 35,5% chưa lên biểu đồ",
				body: "LONGi công bố 35,5%. Tài liệu nói rõ đó là thông cáo công ty, chưa lên biểu đồ NREL [5].",
				note: warn("Thông cáo và dự báo là tuyên bố của bên thứ ba, chưa phải số chứng nhận độc lập.")
			},
			{
				title: "Con đường gần nhất",
				body: "Đặt một lớp perovskite mỏng lên dây chuyền silicon sẵn có, kéo module từ khoảng 22–24% lên gần 30%. IDTechEx ước doanh thu khoảng 12 tỷ USD/năm vào 2035 [63] — đây là dự báo, không phải đo đạc."
			}
		]
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
				caption: "Cột ngang là hiệu suất tài liệu dùng để so họ vật liệu, không phải bảng thị trường."
			},
			{
				title: "Thiếc cùng nhóm, dễ bị oxy hóa",
				body: "Sn²⁺ dễ thành Sn⁴⁺, thừa lỗ trống, pin bị rò điện. Tài liệu nêu kỷ lục khoảng 16–17%. Cột Sn–Pb cao hơn, khoảng 24% trong hình minh họa của tài liệu, vẫn dưới chì 27,3%.",
				caption: "Cột thiếc thấp hơn chì vì Sn²⁺ dễ thành Sn⁴⁺ và pin bị rò."
			},
			{
				title: "Perovskite kép",
				body: "Cs₂AgBiBr₆ thay hai Pb bằng một Ag và một Bi xếp xen kẽ. Bền, nhưng vùng cấm gián tiếp, hấp thụ kém, hiệu suất khoảng 6% [36].",
				caption: "Cs₂AgBiBr₆ bền hơn nhưng vùng cấm gián tiếp, hấp thụ kém, nên cột ngắn."
			},
			{
				title: "Việc làm được ngay",
				body: "Giảm lượng chì, đóng gói chống rò, thêm lớp hấp phụ chì, và thiết kế để tái chế. Thay chì hoàn toàn vẫn còn kém xa về hiệu suất.",
				caption: "Việc làm được ngay là khóa chì lại. Cột ngắn không có nghĩa chất ấy đã thay được chì.",
				note: warn("Các cột là số tài liệu dùng để so sánh họ vật liệu, không phải một bảng xếp hạng thị trường.")
			}
		]
	},
	{
		id: "pin",
		chapter: "c5",
		section: "5.1",
		title: "Bước 1 — chọn kiến trúc p-i-n",
		scene: "pin",
		cam: "stack",
		controls: ["architecture"],
		tune: [
			{ architecture: "nip" },
			{ architecture: "pin" },
			{ architecture: "pin" },
			{ architecture: "pin" }
		],
		legend: [{
			swatch: "etl",
			label: "Đường của điện tử"
		}, {
			swatch: "htl",
			label: "Đường của lỗ trống"
		}],
		steps: [
			{
				title: "n-i-p, ánh sáng vào cửa điện tử",
				body: "Kiến trúc kinh điển (regular): ánh sáng đi qua lớp vận chuyển điện tử trước. Nhiều pin đời đầu dùng lớp lỗ trống có phụ gia, như Spiro-OMeTAD pha muối lithium."
			},
			{
				title: "p-i-n, ánh sáng vào cửa lỗ trống",
				body: "Kiến trúc đảo (inverted): ánh sáng đi qua lớp lỗ trống. Hầu hết pin trên 27% hiện là p-i-n, vì NiOₓ, SAM và C₆₀ bền hơn và ít tổn thất hơn [39].",
				caption: "Hai cách xếp cùng một lớp hấp thụ. p-i-n đón nắng ở cửa lỗ trống. Hầu hết pin trên 27% hiện là kiểu này [39]."
			},
			{
				title: "Đổi chiều ánh sáng",
				body: "Nút trên màn hình lật hai cách xếp. Cùng một lớp hấp thụ, thứ tự cửa chọn lọc đổi vai trò của mặt đón nắng.",
				caption: "Hình: bên trái n-i-p, bên phải p-i-n. Mũi tên vàng là chiều ánh sáng. Bấm nút để đổi kiểu đang được nói tới."
			},
			{
				title: "Bậc thang năng lượng",
				body: "Các mức được xếp thành bậc. Điện tử chỉ có đường xuống dốc về phía ETL. Lỗ trống chỉ có đường về phía HTL. Không cần chúng «chọn đúng» bằng ý chí.",
				caption: "Hình: khối lam là cửa điện tử, khối cam là cửa lỗ trống. Các hạt chạy về đúng cửa của mình."
			}
		]
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
			{ explode: .15 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 },
			{ explode: .85 }
		],
		steps: [
			{
				title: "Không phát minh một chất mới",
				body: "Đề xuất chương 5 ghép những gì đã được chứng minh riêng lẻ, để chặn cùng lúc năm kẻ thù ở mục 3.9. Bấm từng lát trên mô hình để nhảy tới lời dẫn của lát đó.",
				caption: "Hình: chồng lớp của đề xuất. Lớp đang sáng là lớp đang được nói tới. Độ dày vẽ không theo tỉ lệ thật."
			},
			{
				title: "Kính lọc UV",
				body: "Chặn tia cực tím trước khi vào pin. Nhắm kẻ thù số 4 [26].",
				caption: "Kính trên cùng chặn tia cực tím trước khi vào pin."
			},
			{
				title: "ITO + NiOₓ + SAM",
				body: "Điện cực trong suốt, lớp lấy lỗ trống, và đơn lớp tự sắp xếp tạo mặt tiếp xúc ít khuyết tật [39].",
				caption: "ITO trong suốt lấy dòng. NiOₓ và SAM là cửa lỗ trống, ít phụ gia hơn các lớp lỗ trống đời đầu."
			},
			{
				title: "Lớp 2D mặt dưới",
				body: "Thụ động hóa giao diện dưới, cản ion và đỡ tổn thất điện áp [30].",
				caption: "Lớp 2D mặt dưới lấp bẫy và cản ion ở giao diện dưới."
			},
			{
				title: "Lõi Cs₀.₀₅FA₀.₉₅PbI₃",
				body: "Không MA nên bền nhiệt hơn. Thuần iod nên không tách pha kiểu Hoke. Hệ số dung hạn nằm vùng chịu được [19][22][24].",
				caption: "Lõi không có methylammonium, chỉ iod, thêm khoảng 5% cesium để khung khỏi đổ sang pha vàng."
			},
			{
				title: "Lớp 2D mặt trên",
				body: "Lấp bẫy, kỵ nước, chặn ion. Nhắm ẩm và di chuyển ion [29][30].",
				caption: "Lớp 2D mặt trên kỵ nước và chặn ion đi lên."
			},
			{
				title: "C₆₀",
				body: "Lấy điện tử, đưa chúng ra khỏi perovskite [39].",
				caption: "C₆₀ nhận điện tử và đưa chúng ra khỏi perovskite."
			},
			{
				title: "SnO₂ phủ từng lớp nguyên tử",
				body: "ALD cho một lớp ô-xít mỏng nhưng đặc khít, ngăn iod đi lên ăn điện cực kim loại [39][40].",
				caption: "SnO₂ phủ từng lớp nguyên tử là một tấm chắn đặc, để iod không ăn điện cực kim loại."
			},
			{
				title: "Điện cực Cu/Ag",
				body: "Thu điện tử sau khi chúng đã qua rào SnO₂. Kim loại không được chạm trực tiếp dòng iod.",
				caption: "Kim loại chỉ gặp điện tử sau khi chúng đã qua rào SnO₂."
			},
			{
				title: "Kính–kính và gioăng mép",
				body: "Đóng gói kín, chặn ẩm và oxy [38]. Kéo thanh «tách lớp» để xem từng lát; hình không theo tỉ lệ bề dày thật.",
				caption: "Kéo thanh tách lớp để xem từng lát. Kính dưới và gioăng mép khóa ẩm với oxy."
			}
		]
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
				body: "Methylammonium bay hơi ở nhiệt độ tấm pin ngoài trời, khoảng 65–85 °C. FA và Cs bền nhiệt hơn nhiều."
			},
			{
				title: "Chỉ iod",
				body: "Tránh hiệu ứng Hoke. Eg khoảng 1,53 eV vẫn gần tối ưu cho pin một lớp."
			},
			{
				title: "5% cesium",
				body: "Kéo hệ số dung hạn trung bình của FAPbI₃ về giữa vùng bền, hạn chế pha vàng lục giác."
			},
			{
				title: "2D cả hai mặt",
				body: "Nhóm Azmi (2024) cho thấy kẹp 2D hai mặt vừa tăng điện áp vừa tăng độ bền [30]. Cùng hướng nghiên cứu đã vượt phép thử 85 °C / 85% độ ẩm năm 2022 [29]."
			},
			{
				title: "Rào ALD",
				body: "SnO₂ đặc khít chặn iod khuếch tán tới điện cực kim loại — một kiểu hỏng phổ biến của pin p-i-n."
			}
		]
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
				caption: "Trục ngang là giờ chiếu, trục dọc là phần trăm hiệu suất còn lại."
			},
			{
				title: "Mức đề xuất: ISOS-L-3",
				body: "Chiếu sáng liên tục, nhiệt độ 65–85 °C, có độ ẩm. Ba mũi tên trên mô hình là đèn, nhiệt và ẩm cùng lúc.",
				caption: "Mức đề xuất là đèn, nhiệt 65–85 °C và ẩm cùng lúc — ISOS-L-3."
			},
			{
				title: "Thước T80",
				body: "T80 là thời gian cho tới khi hiệu suất còn 80% giá trị ban đầu. Đường đỏ là pin chưa tối ưu. Đường xanh là mục tiêu thiết kế.",
				caption: "Đường cam giảm nhanh. Đường lục là mục tiêu thiết kế, chưa phải số đo của đúng tổ hợp này."
			},
			{
				title: "Mục tiêu của đề xuất",
				body: "Hiệu suất ban đầu ≥ 26% trên tế bào 1 cm². Giữ trên 90% sau 2000 giờ ISOS-L-3. Dấu sao nhắc mức tài liệu nêu cho pin 27,3%: khoảng 93% sau 2000 giờ [39] — đó là số đã báo cáo cho một pin khác, không phải cho đúng tổ hợp này.",
				caption: "Mốc 93% sau 2000 giờ là số đã báo cáo cho một pin khác [39], đặt lên hình để có thước so."
			},
			{
				title: "Phép đo đi kèm",
				body: "PLQY để theo dõi Voc. Nhiễu xạ tia X để xem pha còn nguyên không. Phổ khối hoặc XPS để bắt iod đã bò tới điện cực hay chưa.",
				caption: "PLQY, nhiễu xạ tia X và phổ khối là ba phép đo đi kèm. Chúng không vẽ thành đường thứ ba."
			},
			{
				title: "Bỏ lần lượt từng lớp",
				body: "Đối chứng: tháo lớp 2D trên, lớp 2D dưới, rồi lớp ALD, để biết mỗi lớp đóng góp bao nhiêu. Không làm đối chứng thì không biết lớp nào đang gánh.",
				caption: "Tháo lần lượt lớp 2D và lớp ALD mới biết mỗi lớp đóng góp bao nhiêu."
			},
			{
				title: "Và đây vẫn là giả thuyết",
				body: "Từng mảnh đã có bài báo. Chưa có nghiên cứu nào kiểm chứng đúng tổ hợp này. Các lớp có thể cãi nhau: lớp 2D làm giảm dẫn, quy trình ALD có thể hỏng bề mặt perovskite.",
				caption: "Nhãn giả thuyết nghĩa là hình này chưa phải một pin đã chế tạo.",
				note: idea("Đừng đọc chương 5 như một bản thiết kế đã chạy ra pin. Tài liệu gọi đúng tên của nó: một giả thuyết hợp lý.")
			}
		]
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
				caption: "Hình: một photon, một lần tách, hai mũi tên ra mạch ngoài. Đây là cả pin mặt trời, thu gọn vào bốn động tác."
			},
			{
				title: "Kết luận 2 — ABX₃ là ba núm vặn trên một khung",
				body: "A là cation lớn trong hốc, B là chì hoặc thiếc ở tâm bát diện, X là I, Br hoặc Cl ở đỉnh. Đổi một ion là đổi vùng cấm và độ bền.",
				caption: "Hình: một ô mạng. Nhãn A, B, X là ba núm vặn, không phải ba chất rời nhau."
			},
			{
				title: "Kết luận 3 — Tổ hợp hiếm: 3,8% lên 27,3% rồi tandem",
				body: "Vùng cấm thẳng, hấp thụ mạnh trong lớp mỏng cỡ 0,5 µm, điện tích đi được xa hơn bề dày lớp, và chế tạo dưới 150 °C. Vì vậy hiệu suất tài liệu dẫn đi từ 3,8% năm 2009 lên 27,3% một lớp, và tandem được ghi 35% [1][7].",
				caption: "Hình: hai mốc trên cùng một cột thời gian. 27,3% là mức một lớp được tài liệu dẫn, không phải chiều cao của tandem."
			},
			{
				title: "Kết luận 4 — Mạng mềm là cả ưu điểm lẫn năm kẻ thù",
				body: "Cùng liên kết yếu cho tinh thể tự vá và cho ion iod nhảy, cho ẩm, oxy, nhiệt và tia cực tím làm hỏng pin. Năm kẻ thù ấy không phải chuyện phụ của hiệu suất cao.",
				caption: "Hình: tinh thể ở giữa, năm chấm cảnh báo quay quanh. Mỗi chấm là một kẻ thù đã gặp ở mục 3.9."
			},
			{
				title: "Kết luận 5 — Bảy cách chế tạo, một quy tắc mầm",
				body: "Quay phủ, hai bước, chân không, kết tinh nhiệt độ ngược, chích nóng, dao gạt và phủ khe khác nhau ở chỗ ép mầm ra. Chúng giống nhau ở quy tắc: mầm phải xuất hiện cùng lúc, rồi lớn đều, nếu không thì thủng lỗ kim.",
				caption: "Hình: nhiều mầm cùng cỡ bung ra, rồi khép thành một màng. Ảnh thực của từng cách nằm ở chương phương pháp chế tạo."
			},
			{
				title: "Kết luận 6 — Đề xuất cải tiến chặn kẻ thù bằng từng lớp",
				body: "Không cần một chất mới. Kính lọc UV, cửa lỗ trống NiOₓ và SAM, lớp 2D hai mặt, lõi FA/Cs thuần iod, C₆₀, rào SnO₂ và kính kín — mỗi lớp gánh một kẻ thù. Đây vẫn là giả thuyết ghép từ các bài đã công bố, chưa phải pin đã làm.",
				caption: "Hình: chồng lớp của đề xuất. Lớp đang sáng là lớp đang được nói tới. Độ dày vẽ không theo tỉ lệ thật."
			},
			{
				title: "Kết luận 7 — Việc còn lại là độ bền; đường gần là tandem",
				body: "Số bền chỉ có nghĩa khi kèm điều kiện. Mục tiêu đề xuất là giữ trên 90% sau 2000 giờ ISOS-L-3, trên tế bào khoảng 1 cm², rồi mới nói tới tấm lớn. Con đường thương mại gần nhất vẫn là trải perovskite lên silicon có sẵn.",
				caption: "Hình: lớp perovskite mỏng nằm trên lát silicon dày. Đồng hồ là phép thử T80, chưa phải một pin đã qua 2000 giờ."
			}
		]
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
				body: "Vì sao photon hồng ngoại 900 nm đi xuyên qua lớp MAPbI₃? Gợi ý của tài liệu: tính E = 1240/λ rồi so với 1,57 eV."
			},
			{
				title: "Câu 2 · Đếm trong ô lập phương",
				body: "Đếm số ion A, B, X trong một ô cơ sở. Vì sao ion ở góc chỉ tính một phần tám?"
			},
			{
				title: "Câu 3 · Hai pha vàng, hai lý do",
				body: "CsPbI₃ và FAPbI₃ cùng dễ chuyển sang pha vàng, nhưng vì hai lý do ngược nhau. Giải bằng hệ số dung hạn."
			},
			{
				title: "Câu 4 · PLQY và Voc",
				body: "Nếu PLQY giảm từ 1% xuống 0,01%, Voc giảm khoảng bao nhiêu?"
			},
			{
				title: "Câu 5 · Vượt 33,7%",
				body: "Vì sao pin tandem có thể vượt giới hạn Shockley–Queisser của pin một lớp?"
			},
			{
				title: "Câu 6 · Chặn ion iod",
				body: "Trong đề xuất chương 5, lớp nào chặn kẻ thù di chuyển ion, và bằng cách nào?"
			}
		]
	}
];
var chapters = [
	{
		id: "c0",
		num: "0",
		title: "Mở đầu cùng một hành trình",
		lessonIds: ["intro"]
	},
	{
		id: "c1",
		num: "1",
		title: "Từ ánh sáng đến điện",
		lessonIds: [
			"foundation",
			"photon",
			"bands",
			"cell",
			"metrics",
			"sq",
			"silicon",
			"ideal"
		]
	},
	{
		id: "c2",
		num: "2",
		title: "Khung ABX₃",
		lessonIds: [
			"origin",
			"parts",
			"build",
			"tolerance",
			"phases",
			"orbitals",
			"alloy",
			"nano",
			"props"
		]
	},
	{
		id: "c3",
		num: "3",
		title: "Vì sao hợp làm pin",
		lessonIds: [
			"race",
			"absorb",
			"diffusion",
			"exciton",
			"defects",
			"tune",
			"ink",
			"plqy",
			"compare",
			"enemies"
		]
	},
	{
		id: "c4",
		num: "4",
		title: "Phương pháp chế tạo",
		lessonIds: [
			"methods",
			"nucleation",
			"films",
			"grow",
			"scale",
			"apps",
			"market",
			"lead"
		]
	},
	{
		id: "c5",
		num: "5",
		title: "Đề xuất cải tiến",
		lessonIds: [
			"pin",
			"stack",
			"why",
			"verify"
		]
	},
	{
		id: "c6",
		num: "6",
		title: "Kết luận",
		lessonIds: ["finale", "quiz"]
	},
	{
		id: "cA",
		num: "A",
		title: "Phụ lục",
		lessonIds: ["glossary", "refs"]
	}
];
var GLOSSARY = [
	{
		vi: "Bán dẫn",
		en: "semiconductor",
		blurb: "Chất có vùng cấm vừa phải, dẫn điện khi được kích thích.",
		focus: "band"
	},
	{
		vi: "Bát diện",
		en: "octahedron",
		blurb: "Khối tám mặt. BX₆ là viên gạch của perovskite.",
		focus: "B"
	},
	{
		vi: "Bẫy nông / bẫy sâu",
		en: "shallow / deep trap",
		blurb: "Mức năng lượng do khuyết tật, sát mép vùng hoặc giữa vùng cấm.",
		focus: "defect"
	},
	{
		vi: "Bờ hấp thụ",
		en: "absorption edge",
		blurb: "Vùng năng lượng nơi độ hấp thụ tăng vọt.",
		focus: "band"
	},
	{
		vi: "Dung thứ khuyết tật",
		en: "defect tolerance",
		blurb: "Khuyết tật phổ biến ít gây hại.",
		focus: "defect"
	},
	{
		vi: "Điện áp hở mạch",
		en: "open-circuit voltage, Voc",
		blurb: "Điện áp lớn nhất của pin khi không lấy dòng.",
		focus: "cell"
	},
	{
		vi: "Độ dài khuếch tán",
		en: "diffusion length",
		blurb: "Quãng đường trung bình của hạt tải trước khi tái hợp.",
		focus: "cell"
	},
	{
		vi: "Exciton",
		en: "exciton",
		blurb: "Cặp điện tử và lỗ trống còn hút nhau.",
		focus: "band"
	},
	{
		vi: "Giếng lượng tử",
		en: "quantum well",
		blurb: "Lớp mỏng nhốt điện tử theo một chiều.",
		focus: "nano"
	},
	{
		vi: "Hệ số dung hạn",
		en: "tolerance factor",
		blurb: "So kích thước ion A với hốc trống của khung.",
		focus: "A"
	},
	{
		vi: "Hiệu suất chuyển đổi",
		en: "power conversion efficiency",
		blurb: "Tỉ lệ năng lượng ánh sáng biến thành điện.",
		focus: "cell"
	},
	{
		vi: "Khuếch tán",
		en: "diffusion",
		blurb: "Chuyển động ngẫu nhiên của hạt.",
		focus: "cell"
	},
	{
		vi: "Lỗ trống",
		en: "hole",
		blurb: "Chỗ thiếu điện tử, mang điện dương.",
		focus: "band"
	},
	{
		vi: "ETL / HTL",
		en: "electron / hole transport layer",
		blurb: "Lớp chọn lọc chỉ cho một loại hạt đi qua.",
		focus: "cell"
	},
	{
		vi: "Nano tinh thể",
		en: "nanocrystal",
		blurb: "Tinh thể cỡ vài nm đến vài chục nm.",
		focus: "nano"
	},
	{
		vi: "Phối tử",
		en: "ligand",
		blurb: "Phân tử bám trên bề mặt nano tinh thể.",
		focus: "nano"
	},
	{
		vi: "Pin song song",
		en: "tandem cell",
		blurb: "Nhiều lớp hấp thụ với vùng cấm khác nhau.",
		focus: "cell"
	},
	{
		vi: "Ranh giới hạt",
		en: "grain boundary",
		blurb: "Đường tiếp giáp giữa hai hạt tinh thể.",
		focus: "defect"
	},
	{
		vi: "Tách pha",
		en: "phase segregation",
		blurb: "Hỗn hợp tự tách thành vùng giàu từng thành phần.",
		focus: "X"
	},
	{
		vi: "Tái hợp",
		en: "recombination",
		blurb: "Điện tử gặp lỗ trống và mất năng lượng.",
		focus: "band"
	},
	{
		vi: "Tạo mầm",
		en: "nucleation",
		blurb: "Giai đoạn tinh thể tí hon xuất hiện.",
		focus: "nano"
	},
	{
		vi: "Thụ động hóa",
		en: "passivation",
		blurb: "Phủ phân tử để lấp bẫy bề mặt.",
		focus: "defect"
	},
	{
		vi: "Tổn thất nhiệt hóa",
		en: "thermalization loss",
		blurb: "Năng lượng dư của photon biến thành nhiệt.",
		focus: "band"
	},
	{
		vi: "Vùng cấm",
		en: "bandgap",
		blurb: "Năng lượng tối thiểu để giải phóng điện tử.",
		focus: "band"
	},
	{
		vi: "Vùng cấm thẳng / gián tiếp",
		en: "direct / indirect bandgap",
		blurb: "Hấp thụ mạnh, hoặc phải mượn dao động mạng nên hấp thụ yếu.",
		focus: "band"
	},
	{
		vi: "Vùng dẫn / vùng hóa trị",
		en: "conduction / valence band",
		blurb: "Tầng trên và tầng dưới của thang năng lượng.",
		focus: "band"
	}
];
var REFS = [
	{
		n: "1",
		cite: "NREL. Best Research-Cell Efficiency Chart, Rev. 03-19-2026."
	},
	{
		n: "2",
		cite: "Green, M. A. et al. Solar cell efficiency tables (Version 68). Joule 2026. DOI: 10.1016/j.joule.2026.102494"
	},
	{
		n: "4",
		cite: "LONGi. 34,85% tandem silicon/perovskite, thông cáo 15/4/2025."
	},
	{
		n: "5",
		cite: "LONGi. 35,5%, thông cáo 14/7/2026 — tài liệu ghi chưa lên biểu đồ NREL."
	},
	{
		n: "7",
		cite: "Kojima, Miyasaka et al. J. Am. Chem. Soc. 2009, 131, 6050. DOI: 10.1021/ja809598r"
	},
	{
		n: "9",
		cite: "Stranks et al. Science 2013, 342, 341. DOI: 10.1126/science.1243982"
	},
	{
		n: "10",
		cite: "Xing et al. Science 2013, 342, 344. DOI: 10.1126/science.1243167"
	},
	{
		n: "11",
		cite: "Dong et al. Science 2015, 347, 967. L > 175 µm. DOI: 10.1126/science.aaa5760"
	},
	{
		n: "12",
		cite: "Shi et al. Science 2015, 347, 519. DOI: 10.1126/science.aaa2725"
	},
	{
		n: "13",
		cite: "De Wolf et al. J. Phys. Chem. Lett. 2014, 5, 1035. Urbach. DOI: 10.1021/jz500279b"
	},
	{
		n: "14",
		cite: "Miyata et al. Nature Physics 2015, 11, 582. Exciton. DOI: 10.1038/nphys3357"
	},
	{
		n: "15",
		cite: "Yin, Shi, Yan. Appl. Phys. Lett. 2014, 104, 063903. DOI: 10.1063/1.4864778"
	},
	{
		n: "16",
		cite: "Yin, Shi, Yan. Adv. Mater. 2014, 26, 4653. DOI: 10.1002/adma.201306281"
	},
	{
		n: "18",
		cite: "Noh et al. Nano Lett. 2013, 13, 1764. Trộn halide. DOI: 10.1021/nl400349b"
	},
	{
		n: "19",
		cite: "Eperon et al. Energy Environ. Sci. 2014, 7, 982. FAPbI₃."
	},
	{
		n: "20",
		cite: "Goldschmidt, V. M. Naturwissenschaften 1926, 14, 477."
	},
	{
		n: "21",
		cite: "Bartel et al. Science Advances 2019, 5, eaav0693. DOI: 10.1126/sciadv.aav0693"
	},
	{
		n: "22",
		cite: "Saliba et al. Energy Environ. Sci. 2016, 9, 1989. Triple cation. DOI: 10.1039/C5EE03874J"
	},
	{
		n: "24",
		cite: "Hoke et al. Chem. Sci. 2015, 6, 613. Tách pha. DOI: 10.1039/C4SC03141E"
	},
	{
		n: "25",
		cite: "Eames et al. Nat. Commun. 2015, 6, 7497. Ion iod. DOI: 10.1038/ncomms8497"
	},
	{
		n: "26",
		cite: "Leijtens et al. Nat. Commun. 2013, 4, 2885. UV và TiO₂. DOI: 10.1038/ncomms3885"
	},
	{
		n: "27",
		cite: "Aristidou et al. Nat. Commun. 2017, 8, 15218. Oxy. Tài liệu ghi cần kiểm chứng."
	},
	{
		n: "29",
		cite: "Azmi et al. Science 2022, 376, 73. 85 °C/85% RH. DOI: 10.1126/science.abm5784"
	},
	{
		n: "30",
		cite: "Azmi et al. Nature 2024, 628, 93. 2D hai mặt. DOI: 10.1038/s41586-024-07189-3"
	},
	{
		n: "34",
		cite: "He et al. Nature Nanotechnology 2025. Sn, 16,65% — tài liệu ghi cần kiểm chứng."
	},
	{
		n: "36",
		cite: "Cs₂AgBiBr₆ hydrogenated. Nat. Commun. 2022, 13. DOI: 10.1038/s41467-022-31016-w"
	},
	{
		n: "38",
		cite: "Khenkin et al. Nature Energy 2020, 5, 35. ISOS. DOI: 10.1038/s41560-019-0529-5"
	},
	{
		n: "39",
		cite: "Viewpoint, ACS Energy Lett. 2026, 11, 2378. Quy tắc thiết kế pin một lớp."
	},
	{
		n: "40",
		cite: "LONGi et al. Nature 2024. Thụ động hóa giao diện tandem — tài liệu ghi cần kiểm chứng."
	},
	{
		n: "41",
		cite: "Pin thiếc–chì không thiếc fluoride. Nat. Commun. PMC12796181."
	},
	{
		n: "43",
		cite: "Galkowski et al. Energy Environ. Sci. 2016, 9, 962. Exciton MA và FA."
	},
	{
		n: "45",
		cite: "Protesescu et al. Nano Lett. 2015, 15, 3692. CsPbX₃ nanocrystal. DOI: 10.1021/nl5048779"
	},
	{
		n: "46",
		cite: "Burschka et al. Nature 2013, 499, 316. Lắng đọng hai bước. DOI: 10.1038/nature12340"
	},
	{
		n: "47",
		cite: "Jeon et al. Nature Materials 2014, 13, 897. Dung môi đối. DOI: 10.1038/nmat4014"
	},
	{
		n: "49",
		cite: "Saidaminov et al. Nat. Commun. 2015, 6, 8586. Kết tinh nhiệt độ ngược."
	},
	{
		n: "50",
		cite: "Khorasani et al. Adv. Energy Sustain. Res. 2024. Phủ diện tích lớn."
	},
	{
		n: "51",
		cite: "Shen et al. Nature Materials 2026. Tandem chân không — tài liệu ghi cần kiểm chứng."
	},
	{
		n: "55",
		cite: "PeLED, EQE lục. Tài liệu dẫn Wikipedia và yêu cầu kiểm chứng bài gốc."
	},
	{
		n: "56",
		cite: "Wang et al. Nanomaterials 2022, 12, 4390. Cảm biến quang."
	},
	{
		n: "57",
		cite: "He et al. Adv. Funct. Mater. 2022, 2112925. Đầu dò tia X CsPbBr₃."
	},
	{
		n: "58",
		cite: "Yang et al. Nat. Commun. 2024, 15. Chất phát quang nano CsPbBr₃."
	},
	{
		n: "59",
		cite: "Nhiên liệu mặt trời. Inorg. Chem. Front. 2023. DOI: 10.1039/d3qi00714f"
	},
	{
		n: "61",
		cite: "Optics.org, 2024. Oxford PV, module 26,9%."
	},
	{
		n: "62",
		cite: "Solar Power World, 2025. Caelux giao kính phủ perovskite."
	},
	{
		n: "63",
		cite: "IDTechEx / Perovskite-Info. Dự báo doanh thu ~12 tỷ USD/năm vào 2035."
	},
	{
		n: "64",
		cite: "Shannon, R. D. Acta Cryst. 1976, A32, 751. Bán kính ion."
	},
	{
		n: "65",
		cite: "Kieslich, Sun, Cheetham. Chem. Sci. 2014, 5, 4712. Bán kính hiệu dụng MA, FA."
	},
	{
		n: "67",
		cite: "Poglitsch, Weber. J. Chem. Phys. 1987, 87, 6373. Ba pha MAPbI₃."
	},
	{
		n: "68",
		cite: "Filip et al. Nat. Commun. 2014, 5, 5757. Nghiêng bát diện và Eg."
	},
	{
		n: "69",
		cite: "Stoumpos et al. Chem. Mater. 2016, 28, 2852. Chuỗi 2D."
	},
	{
		n: "70",
		cite: "Shockley, Queisser. J. Appl. Phys. 1961, 32, 510."
	},
	{
		n: "71",
		cite: "Rau, U. Phys. Rev. B 2007, 76, 085303. Thuận nghịch pin và đèn."
	},
	{
		n: "73",
		cite: "LaMer, Dinegar. J. Am. Chem. Soc. 1950, 72, 4847. Bùng mầm."
	},
	{
		n: "77",
		cite: "D'Innocenzo et al. Nat. Commun. 2014, 5, 3586. Exciton và điện tích tự do."
	}
];
var QUIZ = [
	{
		prompt: "Photon 900 nm gặp MAPbI₃ thì sao?",
		options: [
			"Bị phản xạ vì quá mạnh",
			"E ≈ 1,38 eV, thấp hơn Eg ≈ 1,57 eV, nên đi xuyên",
			"Bị hấp thụ hết vì nằm trong vùng nhìn thấy",
			"Chỉ bị chặn nếu lớp dày hơn 180 µm"
		],
		answer: 1,
		why: "1240/900 ≈ 1,38 eV. MAPbI₃ có Eg khoảng 1,57 eV. Photon yếu hơn vùng cấm không tạo được cặp điện tích."
	},
	{
		prompt: "Trong một ô lập phương có bao nhiêu A, B, X?",
		options: [
			"8 A, 6 B, 1 X",
			"1 A, 1 B, 3 X — góc chỉ tính 1/8 vì tám ô dùng chung",
			"1 A, 3 B, 1 X",
			"4 A, 4 B, 4 X"
		],
		answer: 1,
		why: "Góc thuộc về 8 ô, tâm mặt thuộc về 2 ô, tâm ô thuộc trọn về một ô. 8×1/8 + 1 + 6×1/2 = ABX₃."
	},
	{
		prompt: "Vì sao CsPbI₃ và FAPbI₃ đều dễ hóa vàng?",
		options: [
			"Cả hai đều có t ≈ 1,00",
			"Cs quá nhỏ (t ≈ 0,85) nên sụp cạnh; FA quá lớn (t ≈ 0,99) nên chuyển lục giác dùng chung mặt",
			"Cả hai đều mất chì khi gặp nước",
			"Vì cùng vùng cấm 1,12 eV"
		],
		answer: 1,
		why: "Hai lý do ngược nhau quanh hốc trống: A nhỏ làm khung sụp, A lớn làm khung chuyển sang cách nối khác."
	},
	{
		prompt: "PLQY từ 1% xuống 0,01%. Voc đổi thế nào?",
		options: [
			"Tăng khoảng 60 mV",
			"Giảm khoảng 120 mV",
			"Không đổi vì Voc chỉ phụ thuộc Eg",
			"Giảm một nửa"
		],
		answer: 1,
		why: "Hai lần chia mười. Mỗi lần khoảng 60 mV, vì (kT/q)·ln(10) ≈ 60 mV ở 300 K."
	},
	{
		prompt: "Tandem vượt 33,7% bằng cách nào?",
		options: [
			"Dùng lớp dày hơn silicon",
			"Nhiều lớp có Eg khác nhau, mỗi lớp xử lý một phần phổ, nên không còn là pin một lớp",
			"Bỏ tái hợp bằng cách tắt ánh sáng",
			"Đo dưới phổ mạnh hơn AM1.5G nên trần đổi"
		],
		answer: 1,
		why: "Trần 33,7% là cho một vùng cấm. Xếp chồng các vùng cấm khác nhau né được đồng thời cả tổn thất nhiệt hóa và photon bỏ đi."
	},
	{
		prompt: "Lớp nào trong đề xuất chặn ion iod?",
		options: [
			"Chỉ kính lọc UV",
			"Lớp 2D hai mặt chặn và kỵ nước; SnO₂ ALD thành rào đặc trước điện cực; lõi thuần iod giảm tách pha",
			"Chỉ điện cực bạc",
			"Lớp Spiro-OMeTAD pha lithium"
		],
		answer: 1,
		why: "Tài liệu gán kẻ thù số 5 cho lớp 2D, rào ALD, và việc giảm chỗ trống. UV kính nhắm kẻ thù khác."
	}
];
function glossaryLesson() {
	return {
		id: "glossary",
		chapter: "cA",
		section: "Phụ lục A",
		title: "Bảng màu thuật ngữ Việt – Anh",
		scene: "glossary",
		cam: "crystal",
		steps: GLOSSARY.map((g) => ({
			title: g.vi,
			body: `${g.en}. ${g.blurb}`
		}))
	};
}
function refsLesson() {
	return {
		id: "refs",
		chapter: "cA",
		section: "Phụ lục B",
		title: "Nguồn được trích khi rê chuột vào [n]",
		scene: "refs",
		cam: "wide",
		steps: REFS.map((r) => ({
			title: `[${r.n}]`,
			body: r.cite
		}))
	};
}
lessons.push(glossaryLesson(), refsLesson());
var byId = new Map(lessons.map((l) => [l.id, l]));
function getLesson(id) {
	return byId.get(id) ?? lessons[0];
}
function lessonIndex(id) {
	return lessons.findIndex((l) => l.id === id);
}
function nextLessonId(id) {
	const i = lessonIndex(id);
	return i >= 0 && i < lessons.length - 1 ? lessons[i + 1].id : null;
}
function prevLessonId(id) {
	const i = lessonIndex(id);
	return i > 0 ? lessons[i - 1].id : null;
}
/** Short on-screen labels (3D tags, legends, chart axes). Keys are the Vietnamese source. */
var LABELS_EN = {
	"1 · nền": "1 · basics",
	"Mở đầu": "Opening",
	"Phụ lục A": "Appendix A",
	"Phụ lục B": "Appendix B",
	"Tự kiểm": "Check",
	"Photon mặt trời": "Solar photon",
	"Tấm pin": "The cell",
	"Điện tử": "Electron",
	"Hạt nhân / ion dương": "Nucleus / positive ion",
	"Ion âm": "Negative ion",
	"Vùng hóa trị": "Valence band",
	"Vùng dẫn": "Conduction band",
	"Vùng cấm Eg": "Bandgap Eg",
	"Lỗ trống": "Hole",
	"Silicon dày": "Thick silicon",
	"Perovskite mỏng": "Thin perovskite",
	"Oxy trong CaTiO₃": "Oxygen in CaTiO₃",
	"Halide I/Br/Cl": "Halide I/Br/Cl",
	"Cation hữu cơ": "Organic cation",
	"A · cation lớn +1": "A · large +1 cation",
	"B · Pb²⁺ hoặc Sn²⁺": "B · Pb²⁺ or Sn²⁺",
	"X · I⁻, Br⁻, Cl⁻": "X · I⁻, Br⁻, Cl⁻",
	"Cation A": "A cation",
	"Đỉnh vùng hóa trị · I 5p + Pb 6s": "Valence-band top · I 5p + Pb 6s",
	"Đáy vùng dẫn · Pb 6p": "Conduction-band bottom · Pb 6p",
	"Giàu iod": "Iodide-rich",
	"Giàu brom": "Bromide-rich",
	"Thiếc trên vị trí B": "Tin on the B site",
	"Xanh lam, chết ở mặt": "Blue, dies at the surface",
	"Đỏ, đi sâu hơn": "Red, goes deeper",
	"Hồng ngoại dài, xuyên qua": "Long infrared, passes through",
	"Bẫy sâu": "Deep trap",
	"Bẫy nông": "Shallow trap",
	"Đường của điện tử": "Electron path",
	"Đường của lỗ trống": "Hole path",
	"Pin mặt trời": "Solar cell",
	"Không máy · không nhiên liệu": "No engine · no fuel",
	"Kiến thức nền": "Background",
	"Lưu ý": "Watch the number",
	"Từng bước": "Step by step",
	"Nguyên tử": "Atom",
	"mất 2 điện tử": "loses 2 electrons",
	"nhận 1 điện tử": "gains 1 electron",
	"Dòng điện = hạt mang điện có hướng": "Current = charged particles with a direction",
	"nhìn thấy": "visible",
	"Gần nửa năng lượng nằm ở hồng ngoại": "Nearly half the energy is infrared",
	"hóa trị": "valence",
	dẫn: "conduction",
	"chật, không dẫn": "packed, does not conduct",
	"trống, dẫn được": "empty, can conduct",
	"hấp thụ": "absorber",
	"kim loại": "metal",
	"e⁻ lên vùng dẫn": "e⁻ climbs to the conduction band",
	"lỗ trống ở lại": "a hole is left behind",
	"tách trước khi tái hợp": "separate before they recombine",
	"mạch ngoài": "outside circuit",
	"Si · 150–180 µm": "Si · 150–180 µm",
	"perovskite · 0,5 µm": "perovskite · 0.5 µm",
	"1400 °C": "1400 °C",
	"một lớp": "single junction",
	"tandem 35%": "tandem 35%",
	"bờ Urbach dốc": "steep Urbach edge",
	"lỗ kim": "pinhole",
	"tạo mầm → lớn lên": "nucleate → then grow",
	"1 quay phủ": "1 spin coat",
	"2 hai bước": "2 two-step",
	"3 chân không": "3 vacuum",
	"4 đơn tinh thể": "4 single crystal",
	"5 chấm lượng tử": "5 quantum dots",
	"6 dao gạt": "6 blade",
	"7 phủ khe": "7 slot-die",
	"chọn một lối — các mục sau đi từng nhịp": "pick a route — the next sections walk it beat by beat",
	"đang xem lối": "now on route",
	"1 nhỏ mực": "1 drop the ink",
	"2 quay ly tâm": "2 spin",
	"3 dung môi đối": "3 antisolvent",
	"4 sấy 100–150 °C": "4 anneal 100–150 °C",
	"mực thừa văng ra": "extra ink flies off",
	"chlorobenzene · kết tinh đồng loạt": "chlorobenzene · crystals form all at once",
	"PbI₂ vàng, chưa có A": "yellow PbI₂, no A yet",
	"MAI/FAI đi vào · vàng → đen": "MAI/FAI goes in · yellow → black",
	"nguồn nóng · hơi đi lên": "hot source · vapor rises",
	"bám theo gờ silicon": "coats the silicon texture",
	"lạnh · tan hết · trong": "cold · fully dissolved · clear",
	"đầu dò tia X": "X-ray detector",
	"độ tan cao khi lạnh": "high solubility when cold",
	"đun · quá bão hòa": "heat · supersaturated",
	"tinh thể lớn dần": "the crystal grows",
	"đo và đầu dò": "measurement and detectors",
	"140–200 °C · phối tử": "140–200 °C · ligands",
	"chích Cs · LaMer": "inject Cs · LaMer",
	"nước đá · ~10 nm · 410–700 nm": "ice bath · ~10 nm · 410–700 nm",
	"một lỗ kim có thể chập cả tấm": "one pinhole can short the whole plate",
	"dao gạt · khe cố định độ dày": "blade · a fixed wet gap",
	"dao khí N₂ khô tức thì": "N₂ knife · dries at once",
	"đầu phủ đứng yên": "the die stays still",
	"đế chạy →": "substrate runs →",
	"cuộn → phủ khe → sấy · 10–14%": "roll → slot-die → dry · 10–14%",
	"chân không · phủ đều, kể cả mặt nhám": "vacuum · even coat, even on texture",
	"vài µm": "a few µm",
	"~0,1 µm": "~0.1 µm",
	"~0,5 µm": "~0.5 µm",
	"27,3%": "27.3%",
	năm: "year",
	"hiệu suất": "efficiency",
	"Hoke · điện tích dồn về vùng iod": "Hoke · charge piles into iodide-rich regions",
	"giàu I · Eg thấp": "I-rich · low Eg",
	"giàu Br": "Br-rich",
	"thuần iod · không Hoke": "pure iodide · no Hoke",
	"màng đa tinh thể · ranh giới hạt": "polycrystalline film · grain boundaries",
	"chấm lượng tử + phối tử": "quantum dots + ligands",
	"2D hai mặt": "2D on both faces",
	"ETL · điện tử xuống dốc": "ETL · electrons go downhill",
	"HTL · lỗ trống": "HTL · holes",
	"SnO₂ ALD chặn iod": "SnO₂ ALD blocks iodide",
	"bẫy nông · nhiệt thả ra": "shallow trap · heat lets it go",
	"bẫy sâu nuốt điện tử": "deep trap swallows the electron",
	"nhảy thẳng": "direct jump",
	"cần dao động mạng": "needs a lattice vibration",
	"nhẹ, đi nhanh": "light, so it moves fast",
	"nối góc": "corner-sharing",
	"pha delta · chung cạnh": "delta phase · edge-sharing",
	"lục giác · chung mặt": "hexagonal · face-sharing",
	"A rơi vào hốc": "A drops into the cavity",
	"Cs nhỏ": "Cs is small",
	"FA lớn": "FA is large",
	"kéo t về vùng bền": "pull t back into the safe window",
	"8×1/8 + 1 + 6×1/2 = ABX₃": "8×1/8 + 1 + 6×1/2 = ABX₃",
	"bấm vào ion": "click an ion",
	"chỗ trống": "empty site",
	"sai chỗ": "wrong site",
	"O₂ + ánh sáng": "O₂ + light",
	"TiO₂ + UV": "TiO₂ + UV",
	"MA bay": "MA leaves",
	"FA + Cs ở lại": "FA + Cs stay",
	"thụ động hóa bề mặt": "passivate the surface",
	"đèn + nhiệt + ẩm": "light + heat + moisture",
	"giả thuyết": "hypothesis",
	"hai Eg, một nắng": "two gaps, one sun",
	"lớp trên cho tandem": "top cell for a tandem",
	"màng 0,5 µm": "0.5 µm film",
	"bền: Si, CdTe đã có 25 năm": "lifetime: Si and CdTe already have 25 years",
	"1% → 0,01%": "1% → 0.01%",
	"2 × 60 mV ≈ 120 mV": "2 × 60 mV ≈ 120 mV",
	"2013 · L hơn 1 µm": "2013 · L beyond 1 µm",
	"≈ 1000 W/m²": "≈ 1000 W/m²",
	"900 nm · 1,38 eV": "900 nm · 1.38 eV",
	"SQ 33,7%": "SQ 33.7%",
	"93% · 2000 h đã báo cáo": "93% · 2000 h reported",
	"mạng mềm là cả hai mặt": "the soft lattice is both sides",
	"chen khe": "slot-die",
	"mầm cùng lúc": "nuclei all at once",
	"bulk heterojunction": "bulk heterojunction",
	Pin: "Cell",
	Tandem: "Tandem",
	Dẻo: "Flexible",
	"Màn hình": "Display",
	"Cảm biến": "Sensor",
	"Tia X": "X-ray",
	"Nhiên liệu": "Fuel",
	"CaTiO₃ · 1839": "CaTiO₃ · 1839",
	"Perovskite halide": "Halide perovskite",
	"Lai hữu cơ – vô cơ": "Organic–inorganic hybrid",
	exciton: "exciton",
	"kT ≈ 26 meV thắng vài meV": "kT ≈ 26 meV beats a few meV",
	"hữu cơ: hàng trăm meV": "organic: hundreds of meV"
};
/** English for the fabrication chapter — exact Vietnamese keys. */
var FAB_EN = {
	"Trước khi đi từng nhịp, hãy nhìn cả bản đồ. Mọi cách dưới đây đều có tạo mầm rồi lớn lên. Khác nhau ở chỗ mầm được ép xuất hiện: bằng dung môi đối, bằng nhiệt, bằng chân không, hay bằng dao khí.": "Before the beat-by-beat walk, look at the whole map. Every route below nucleates, then grows. They differ in what forces the nuclei to appear: an antisolvent, heat, vacuum, or an air knife.",
	"Ba cách đầu dành cho màng trong phòng thí nghiệm (vài cm²). Hai cách tiếp theo làm đơn tinh thể và chấm lượng tử. Hai cách cuối thay quay phủ khi lên diện tích lớn — quay phủ không phủ đều được tấm hàng mét.": "The first three routes make laboratory films (a few cm²). The next two grow single crystals and quantum dots. The last two replace spin coating once the area gets large — spinning cannot coat a metre-scale plate evenly.",
	"Sơ đồ tổng quan bảy cách chế tạo halide perovskite. Mỗi thẻ là một lộ trình sẽ được mở từng nhịp ở các mục 4.2–4.4. Màu tím là màng hấp thụ, vàng là PbI₂ chưa chuyển pha, lam là buồng chân không.": "Overview of seven ways to make a halide perovskite. Each card is a route that sections 4.2–4.4 open beat by beat. Purple is the absorber, yellow is PbI₂ that has not converted, blue is the vacuum chamber.",
	"Nhỏ mực lên đế, quay vài nghìn vòng/phút, rồi nhỏ chlorobenzene để cả màng kết tinh cùng lúc. Sấy 100–150 °C. Đây là cách làm tế bào nhỏ trong phòng thí nghiệm [47].": "Drop the ink, spin at a few thousand rpm, then drop chlorobenzene so the whole film crystallizes at once. Anneal at 100–150 °C. This is how small laboratory cells are made [47].",
	"Thẻ 1 trên bản đồ: quay phủ một bước kèm dung môi đối. Dùng cho tế bào cỡ centimet, không dùng cho tấm mét vuông.": "Card 1 on the map: one-step spin coating with an antisolvent. Used for centimetre cells, not for square-metre plates.",
	"Phủ PbI₂ vàng trước, rồi nhúng hoặc phủ muối hữu cơ MAI/FAI. Màng chuyển từ vàng sang đen khi perovskite hình thành [46].": "Coat yellow PbI₂ first, then dip or coat the organic salt MAI/FAI. The film turns from yellow to black as the perovskite forms [46].",
	"Thẻ 2: hai lớp xếp lần lượt. Vàng = PbI₂, đen = perovskite sau khi gặp muối hữu cơ.": "Card 2: two layers, one after the other. Yellow = PbI₂, black = perovskite after it meets the organic salt.",
	"Không dung môi. Muối bị đốt trong buồng hút chân không, hơi bám lên đế — kể cả bề mặt nhám của silicon. Năm 2026 tài liệu dẫn tandem Oxford làm hoàn toàn bằng chân không, 27,2% [51].": "No solvent. The salt is heated in a vacuum chamber and the vapor sticks to the substrate — including the rough surface of silicon. The source cited for 2026 is an all-vacuum Oxford tandem at 27.2% [51].",
	"Thẻ 3: nguồn nóng ở dưới, đế ở trên. Hạt hơi đi theo đường thẳng trong chân không nên lấp được chỗ lồi lõm.": "Card 3: hot source below, substrate above. Vapor travels in straight lines in vacuum, so it fills the texture.",
	"Độ tan của MAPbX₃ trong một số dung môi giảm khi nóng. Đun dung dịch đã hòa tan thì tinh thể lớn mọc ra, nhanh hơn khoảng 10 lần các cách cũ [49]. Dùng cho đầu dò tia X và đo đạc cơ bản.": "The solubility of MAPbX₃ in some solvents falls as it gets hotter. Heating a solution that was already dissolved grows a large crystal, about 10× faster than older routes [49]. Used for X-ray detectors and basic measurements.",
	"Thẻ 4: lọ dung dịch, nhiệt độ tăng, một tinh thể lớn — không phải màng mỏng.": "Card 4: a vial of solution, temperature rising, one large crystal — not a thin film.",
	"Đun muối chì halide với oleic acid và oleylamine ở 140–200 °C, chích nhanh cesium. Mầm bùng cùng lúc theo mô hình LaMer [73], rồi làm lạnh bằng nước đá. Ra chấm khoảng 10 nm, phát từ 410 đến 700 nm [45].": "Heat the lead-halide salt with oleic acid and oleylamine at 140–200 °C, then inject cesium quickly. Nuclei burst together on the LaMer picture [73], then an ice bath stops the growth. The dots are about 10 nm and emit from 410 to 700 nm [45].",
	"Thẻ 5: nhiều hạt nano đồng kích thước. Màu phát sáng đổi theo halide, không phải màu của mực pin.": "Card 5: many nanocrystals of one size. The glow changes with the halide; it is not the color of solar-cell ink.",
	"Lưỡi dao kéo một lớp mực mỏng trên kính hoặc nhựa. Dao khí nitơ thổi khô ngay, thay vai trò của dung môi đối, để mầm ra cùng lúc trên diện rộng [50].": "A blade drags a thin ink layer across glass or plastic. A nitrogen knife dries it at once, taking the role of the antisolvent, so nuclei appear together over a wide area [50].",
	"Thẻ 6: lưỡi dao định độ dày ướt; luồng N₂ phía sau làm khô tức thì. Mũi tên chỉ chiều chạy của đế.": "Card 6: the blade sets the wet thickness; the N₂ stream behind dries it at once. The arrow is the direction the substrate travels.",
	"Slot-die đẩy mực qua một khe hẹp lên tấm chạy liên tục, giống in báo. Tài liệu ghi pin cuộn-sang-cuộn đã khoảng 10–14%. Chân không cũng phủ được diện lớn, và ngành màn hình đã quen thiết bị này [50].": "Slot-die pushes ink through a narrow slot onto a plate that keeps moving, like a printing press. Roll-to-roll cells in the literature are about 10–14%. Vacuum also coats large areas, and the display industry already knows that equipment [50].",
	"Thẻ 7: đầu phủ khe đứng yên, cuộn đế chạy bên dưới. Con số 10–14% là mức tài liệu ghi cho pin cuộn, không phải kỷ lục tế bào nhỏ.": "Card 7: the slot die stays still and the substrate roll runs underneath. 10–14% is the literature figure for roll-to-roll cells, not the small-cell record.",
	"Mọi cách nuôi tinh thể đều có tạo mầm (nucleation) — những mầm tí hon xuất hiện — và lớn lên (growth).": "Every way of growing a crystal has nucleation — tiny seeds appearing — and then growth.",
	"Bí quyết của màng mịn, hạt đều: mọi mầm xuất hiện đồng loạt, rồi lớn với tốc độ như nhau.": "The secret of a smooth film with even grains: every nucleus appears together, then they all grow at the same speed.",
	"Nếu mầm xuất hiện lúc có lúc không, màng có lỗ kim (pinhole) và hạt to nhỏ lẫn lộn. Một lỗ kim trên tấm pin lớn có thể thành đường chập.": "If nuclei appear at random times, the film has pinholes and mixed grain sizes. One pinhole on a large plate can become a short.",
	"Mực là muối PbI₂ và muối hữu cơ hòa trong DMF/DMSO. Nhỏ một giọt lên giữa đế thủy tinh hoặc đế đã có lớp dẫn, khi đế còn đứng yên hoặc vừa bắt đầu quay.": "The ink is PbI₂ and the organic salt dissolved in DMF/DMSO. One drop lands at the center of glass, or of a substrate that already has a contact, while the chuck is still or just starting to spin.",
	"Lượng giọt quyết định có đủ vật liệu cho lớp khoảng 0,5 µm hay không. Thừa thì văng ra khi quay; thiếu thì màng thủng.": "The drop size decides whether there is enough material for a layer of about 0.5 µm. Too much flies off in the spin; too little leaves holes.",
	"Hình động nhịp 1 của quay phủ: giọt mực rơi xuống tâm đế tròn. Đế chưa quay nhanh. Chú thích màu: vàng nhạt = mực chưa kết tinh.": "Spin-coating beat 1: the ink drop falls onto the center of the round chuck. The chuck is not spinning fast yet. Color key: pale yellow = ink that has not crystallized.",
	"Đế quay rất nhanh. Lực ly tâm trải mực thành màng ướt và hất phần thừa. Dung môi bắt đầu bay, nhưng nếu chỉ chờ tự khô thì mầm xuất hiện lúc có lúc không.": "The chuck spins very fast. Centrifugal force spreads a wet film and throws off the excess. Solvent starts to leave, but if you only wait for it to dry, nuclei appear at random times.",
	"Vài nghìn vòng/phút là tốc độ phòng thí nghiệm điển hình cho tế bào nhỏ, không phải tốc độ của dây chuyền mét vuông.": "A few thousand rpm is a typical laboratory speed for a small cell, not the speed of a square-metre line.",
	"Nhịp 2: đế quay, màng ướt mỏng dần từ tâm ra rìa. Các vòng cung là quỹ đạo mực bị văng.": "Beat 2: the chuck spins and the wet film thins from the center to the edge. The arcs are the path of ink thrown off.",
	"Vài giây sau, nhỏ chlorobenzene hoặc một dung môi không hòa tan perovskite. Độ tan tụt đột ngột, nên mầm xuất hiện gần như cùng một lúc trên cả mặt đế [47].": "A few seconds later, drop chlorobenzene or another solvent that does not dissolve the perovskite. Solubility crashes, so nuclei appear almost together across the chuck [47].",
	"Đây là mẹo then chốt của màng mịn: không phải quay cho khô tự nhiên, mà ép kết tinh đồng loạt.": "This is the key trick for a smooth film: do not spin until it dries on its own — force every crystal to form together.",
	"Nhịp 3: giọt dung môi đối (lam) rơi lên màng đang quay. Màng đổi từ vàng nhạt sang tím đen khi tinh thể perovskite hình thành đồng loạt.": "Beat 3: the antisolvent drop (blue) falls onto the spinning film. The film turns from pale yellow to purple-black as perovskite crystals form together.",
	"Đưa đế lên bàn nhiệt. Dung môi còn lại ra hết, hạt tinh thể lớn thêm một chút, màng ổn định màu đen. Nhiệt này thấp hơn rất nhiều so với lò silicon trên 1400 °C.": "Move the substrate onto a hot plate. The last solvent leaves, the grains grow a little, and the film settles to black. This heat is far below a silicon furnace above 1400 °C.",
	"Nhịp 4: bàn nhiệt dưới đế. Màng đã đen. Nhiệt độ ghi trên nhãn là khoảng sấy của perovskite, không phải nhiệt độ nóng chảy.": "Beat 4: a hot plate under the substrate. The film is already black. The temperature on the label is the perovskite anneal, not a melting point.",
	"Cách thứ hai tách phản ứng làm hai lớp. Trước hết phủ PbI₂. Màng có màu vàng đặc trưng, chưa phải perovskite [46].": "The second route splits the reaction into two layers. First coat PbI₂. The film is the characteristic yellow; it is not perovskite yet [46].",
	"Lắng đọng hai bước, nhịp A: lớp PbI₂ vàng trên đế. Chưa có cation A trong màng.": "Two-step deposition, beat A: a yellow PbI₂ layer on the substrate. No A cation in the film yet.",
	"Nhúng đế vào dung dịch muối hữu cơ, hoặc phủ MAI/FAI lên trên. Ion hữu cơ khuếch tán vào mạng PbI₂, màng chuyển từ vàng sang đen khi thành ABX₃.": "Dip the substrate into the organic salt, or coat MAI/FAI on top. The organic ion diffuses into the PbI₂ lattice and the film turns from yellow to black as it becomes ABX₃.",
	"Thời gian nhúng quyết định phản ứng có chạy hết chiều dày hay còn lõi PbI₂ vàng.": "The dip time decides whether the reaction runs through the thickness or leaves a yellow PbI₂ core.",
	"Nhịp B: các chấm lục là muối hữu cơ đi xuống lớp vàng. Vùng đã phản ứng chuyển đen từ trên xuống.": "Beat B: the green dots are the organic salt moving down into the yellow layer. The reacted region turns black from the top downward.",
	"Bỏ dung môi. Trong buồng đã hút khí, thuyền kim loại chứa muối được đốt nóng. Hơi bay lên và bám vào đế lạnh hơn treo phía trên.": "Leave the solvent out. In a pumped-down chamber a metal boat of salt is heated. Vapor rises and sticks to the cooler substrate hung above.",
	"Bay hơi nhiệt trong chân không: nguồn sáng ở dưới, đế ở trên, các hạt là hơi tiền chất. Buồng vẽ dạng khung dây, không theo tỉ lệ thiết bị thật.": "Thermal evaporation in vacuum: the glowing source is below, the substrate above, and the particles are precursor vapor. The chamber is drawn as a wireframe, not to the scale of a real tool.",
	"Hạt hơi đi gần như thẳng trong chân không, nên phủ được lên bề mặt nhám của pin silicon có sẵn. Tài liệu dẫn tandem Oxford làm hoàn toàn bằng chân không đạt 27,2% năm 2026 [51].": "Vapor travels almost in straight lines in vacuum, so it coats the textured surface of a silicon cell that is already there. The cited all-vacuum Oxford tandem reached 27.2% in 2026 [51].",
	"Đế silicon vẽ có gờ. Màng perovskite bám theo gờ chứ không chỉ nằm trên mặt phẳng. Số 27,2% là mốc tài liệu dẫn, không phải số đo của mô hình.": "The drawn silicon has ridges. The perovskite film follows the ridges instead of sitting only on a flat face. 27.2% is the cited milestone, not a measurement of this model.",
	"Kết tinh nhiệt độ ngược bắt đầu ngược với trực giác: MAPbX₃ tan nhiều hơn khi dung dịch lạnh, trong một số dung môi như GBL. Ta hòa hết muối ở nhiệt độ thấp, trong lọ kín [49].": "Inverse-temperature crystallization starts against intuition: MAPbX₃ dissolves more when the solution is cold, in solvents such as GBL. Dissolve all of the salt at low temperature, in a closed vial [49].",
	"Nhịp 1 của kết tinh nhiệt độ ngược: lọ dung dịch trong, chưa có tinh thể. Nhiệt độ nhãn còn thấp.": "Inverse-temperature beat 1: a clear vial, no crystal yet. The labeled temperature is still low.",
	"Tăng nhiệt. Độ tan giảm nên dung dịch trở nên quá bão hòa. Vài mầm tinh thể xuất hiện trong lòng chất lỏng, không cần đế quay.": "Raise the temperature. Solubility falls, so the solution becomes supersaturated. A few crystal nuclei appear inside the liquid. No spinning chuck is needed.",
	"Nhịp 2: lọ ấm lên (quầng cam). Những chấm tím là mầm vừa xuất hiện trong dung dịch.": "Beat 2: the vial warms (orange glow). The purple dots are nuclei that have just appeared in the solution.",
	"Giữ nhiệt ổn định. Mầm ăn ion trong dung dịch và lớn thành tinh thể milimet, nhanh hơn khoảng 10 lần các cách nuôi cũ [49]. Không có ranh giới hạt như màng đa tinh thể.": "Hold the temperature. The nuclei eat ions from the solution and grow into millimetre crystals, about 10× faster than older growth methods [49]. There are no grain boundaries like those in a polycrystalline film.",
	"Nhịp 3: một bát diện lớn trong lọ. Kích thước vẽ phóng đại so với lọ để thấy hình khối, không phải tinh thể thật chiếm hết thể tích.": "Beat 3: one large octahedron in the vial. It is drawn larger than the vial so the shape is visible; a real crystal does not fill the volume.",
	"Đơn tinh thể ít ranh giới hạt nên điện tích đi được rất xa — có báo cáo trên 175 µm [11]. Người ta dùng chúng cho đầu dò tia X và để đo tính chất gốc, không phải để cán thành tấm pin mái nhà.": "A single crystal has few grain boundaries, so charge travels very far — reports above 175 µm [11]. They are used for X-ray detectors and for measuring the intrinsic properties, not rolled into a rooftop module.",
	"Nhịp 4: tinh thể đặt trên đế đo. Mũi tên là tia X tới; tín hiệu ra ở điện cực. Đây là vai trò của đơn tinh thể, khác màng 0,5 µm của pin.": "Beat 4: the crystal sits on a measurement stage. The arrow is incoming X-rays; the signal leaves at the electrode. That is the job of a single crystal, unlike the 0.5 µm film in a cell.",
	"Trong khí trơ, đun muối chì halide cùng oleic acid và oleylamine ở 140–200 °C. Phối tử sẽ bọc bề mặt hạt nano, không cho chúng dính vào nhau [45].": "Under inert gas, heat the lead-halide salt with oleic acid and oleylamine at 140–200 °C. The ligands coat the nanocrystal surface so the particles do not stick together [45].",
	"Nhịp 1 của chích nóng: bình cầu, dung dịch chì nóng. Chưa chích cesium nên chưa có màu phát quang.": "Hot-injection beat 1: a flask of hot lead solution. Cesium has not been injected, so there is no glow yet.",
	"Bơm nhanh dung dịch cesium oleate. Nồng độ vọt qua ngưỡng, hàng loạt mầm ra cùng một lúc theo mô hình LaMer [73]. Vì ra cùng lúc, các hạt có kích thước gần nhau.": "Inject cesium oleate quickly. The concentration jumps past the threshold and a burst of nuclei appears together, on the LaMer picture [73]. Because they appear together, the particles are nearly the same size.",
	"Nếu chích chậm, mầm ra trước sẽ lớn hơn mầm ra sau — màu phát sáng sẽ lẫn.": "If the injection is slow, early nuclei grow larger than later ones — the emission color mixes.",
	"Nhịp 2: kim bơm cesium vào bình. Đám chấm cùng kích thước là mầm vừa bùng. LaMer là mô hình cổ điển của sự bùng mầm [73].": "Beat 2: a needle injects cesium into the flask. The same-sized dots are the nuclei that just burst. LaMer is the classic model of that burst [73].",
	"Sau vài giây, nhúng bình vào nước đá để dừng lớn lên. Hạt khoảng 10 nm. Đổi I/Br/Cl thì màu phát đi từ đỏ 700 nm tới tím 410 nm [45].": "After a few seconds, quench the flask in ice to stop the growth. The particles are about 10 nm. Changing I/Br/Cl moves the emission from red 700 nm to violet 410 nm [45].",
	"Nhịp 3: dãy lọ phát quang 410–700 nm. Mỗi lọ là một thành phần halide, không phải bảy bước của cùng một phản ứng.": "Beat 3: a row of vials glowing from 410 to 700 nm. Each vial is a different halide composition, not seven steps of one reaction.",
	"Nhiều kỷ lục đo trên diện tích dưới 1 cm², có khi chỉ 0,05 cm². Lên tấm hàng mét vuông, một lỗ kim cũng có thể thành đường chập. Quay phủ không trải đều được cỡ đó, nên phải đổi cách đưa mực lên đế.": "Many records are measured on less than 1 cm², sometimes only 0.05 cm². On a square-metre plate one pinhole can short the module. Spin coating cannot spread ink evenly at that size, so the way ink meets the substrate has to change.",
	"Trái: tế bào nhỏ. Phải: tấm lớn với một chấm cam là lỗ kim. Chú thích: một lỗ trên tấm lớn nguy hiểm hơn cùng một lỗ trên tế bào 0,05 cm² vì nó có thể chập cả mô-đun.": "Left: a small cell. Right: a large plate with one orange pinhole. A hole on the large plate is more dangerous than the same hole on a 0.05 cm² cell, because it can short the whole module.",
	"Lưỡi dao cách đế một khe cố định và chạy dọc. Khe ấy đặt độ dày ướt. Mực perovskite bị kéo thành một dải đều, không cần đế quay [50].": "The blade holds a fixed gap above the substrate and travels along it. That gap sets the wet thickness. The perovskite ink is drawn into an even stripe. The substrate does not spin [50].",
	"Nhịp 1 của phủ dao gạt: lưỡi xám chạy sang phải, vệt tím là mực vừa được trải. Mũi tên là chiều dao. Độ dày vẽ phóng đại.": "Blade-coating beat 1: the gray blade moves to the right and the purple streak is ink just laid down. The arrow is the blade direction. Thickness is exaggerated.",
	"Ngay sau lưỡi dao, một khe thổi khí N₂. Dung môi bay rất nhanh, giống vai trò của chlorobenzene ở quay phủ: mầm ra cùng lúc trên cả chiều rộng tấm.": "Just behind the blade, a slot blows N₂. Solvent leaves very fast, the same job chlorobenzene does in spin coating: nuclei appear together across the width of the plate.",
	"Nhịp 2: luồng lam là N₂. Vùng vừa bị thổi đổi sang đen vì kết tinh đồng loạt. Không còn giọt dung môi đối.": "Beat 2: the blue stream is N₂. The region just blown turns black because it crystallizes all at once. There is no antisolvent drop.",
	"Slot-die giữ đầu phủ đứng yên. Mực được bơm qua một khe, tạo cầu lỏng giữa đầu phủ và đế đang chạy. Tốc độ bơm và tốc độ đế cùng quyết định độ dày.": "Slot-die holds the head still. Ink is pumped through a slot and forms a liquid bridge between the head and the moving substrate. Pump speed and substrate speed together set the thickness.",
	"Đầu phủ khe ở trên, đế chạy bên dưới. Cầu chất lỏng nối hai bên là chỗ mực thoát ra. Đây là lát cắt ngang, không phải nhìn từ trên.": "The slot head is above and the substrate runs below. The liquid bridge between them is where the ink leaves. This is a cross-section, not a top view.",
	"Đế nhựa đi từ cuộn này sang cuộn kia, qua đầu phủ khe rồi qua vùng sấy. Tài liệu ghi hiệu suất pin làm theo kiểu này khoảng 10–14% — thấp hơn tế bào nhỏ, nhưng làm được diện dài.": "Plastic substrate runs from one roll to the other, past the slot die and then a drying zone. Cells made this way are reported around 10–14% — below small cells, but the area is long.",
	"Hai trục cuộn, dải đế chạy liên tục, vùng tím là màng vừa phủ. Con số 10–14% là mức tài liệu ghi cho quy trình cuộn, không phải kỷ lục 27% của tế bào nhỏ.": "Two rolls, a substrate web running continuously, purple where the film was just coated. 10–14% is the literature figure for the roll process, not the 27% small-cell record.",
	"Bay hơi chân không không phụ thuộc vào mực chảy. Nó phủ đều tấm lớn và cả bề mặt kim tự tháp của silicon. Ngành màn hình và bán dẫn đã có sẵn lò loại này.": "Vacuum evaporation does not depend on ink flowing. It coats a large plate evenly, including the pyramid texture of silicon. Display and semiconductor factories already have this kind of tool.",
	"Buồng chân không khổ lớn. Các hạt hơi rơi đều lên tấm. So với phủ ướt, không có vệt dao hay mép giọt.": "A large vacuum chamber. Vapor particles fall evenly onto the plate. Unlike wet coating, there is no blade streak and no drop edge."
};
/** New figure captions, conclusion copy, and chart words. Keys are the Vietnamese source. */
var EXTRA_EN = {
	năm: "year",
	giờ: "hours",
	"% còn lại": "% left",
	"bốn bước": "four steps",
	"hấp thụ": "absorb",
	"thu điện": "collect",
	"núm A": "knob A",
	"núm B": "knob B",
	"núm X": "knob X",
	"3,8%": "3.8%",
	"năm kẻ thù": "five threats",
	"mầm cùng lúc": "nuclei together",
	"mỗi lớp một việc": "one job per layer",
	tandem: "tandem",
	"đo T80": "measure T80",
	"Kính UV": "UV glass",
	"2D dưới": "2D, bottom",
	"Lõi FA/Cs": "FA/Cs core",
	"2D trên": "2D, top",
	"Kính kín": "Sealed glass",
	"Đề xuất cải tiến": "Proposed improvement",
	"Phương pháp chế tạo": "Fabrication methods",
	"Kết luận": "Conclusions",
	"Bảy kết luận của cả hành trình": "Seven conclusions from the whole path",
	"Bước 1 — chọn kiến trúc p-i-n": "Step 1 — choose a p-i-n stack",
	"Bước 2 — mỗi lớp một việc": "Step 2 — one job per layer",
	"Bước 3 — vì sao đúng những chất ấy": "Step 3 — why those ingredients",
	"Bước 4 — chứng minh bằng chuẩn ISOS": "Step 4 — prove it with ISOS",
	"Kết luận 1 — Bốn bước biến ánh sáng thành điện": "Conclusion 1 — four steps turn light into electricity",
	"Kết luận 2 — ABX₃ là ba núm vặn trên một khung": "Conclusion 2 — ABX₃ is three knobs on one frame",
	"Kết luận 3 — Tổ hợp hiếm: 3,8% lên 27,3% rồi tandem": "Conclusion 3 — a rare mix: 3.8% to 27.3%, then a tandem",
	"Kết luận 4 — Mạng mềm là cả ưu điểm lẫn năm kẻ thù": "Conclusion 4 — the soft lattice is the advantage and the five threats",
	"Kết luận 5 — Bảy cách chế tạo, một quy tắc mầm": "Conclusion 5 — seven fabrication routes, one nucleation rule",
	"Kết luận 6 — Đề xuất cải tiến chặn kẻ thù bằng từng lớp": "Conclusion 6 — the proposal blocks each threat with a layer",
	"Kết luận 7 — Việc còn lại là độ bền; đường gần là tandem": "Conclusion 7 — what remains is lifetime; the near path is the tandem",
	"Photon rơi vào lớp tím. Điện tử đi lên vùng dẫn, lỗ trống ở lại, rồi hai hạt ra hai cửa. Không có máy quay, không đốt nhiên liệu.": "A photon falls into the purple layer. The electron climbs into the conduction band, the hole stays, and the two carriers leave by opposite doors. No engine, no fuel.",
	"Hình: một photon, một lần tách, hai mũi tên ra mạch ngoài. Đây là cả pin mặt trời, thu gọn vào bốn động tác.": "Figure: one photon, one separation, two arrows into the outside circuit. The whole solar cell, reduced to four motions.",
	"A là cation lớn trong hốc, B là chì hoặc thiếc ở tâm bát diện, X là I, Br hoặc Cl ở đỉnh. Đổi một ion là đổi vùng cấm và độ bền.": "A is the large cation in the cavity, B is lead or tin at the center of the octahedron, X is I, Br or Cl at the corners. Change one ion and you change the gap and the lifetime.",
	"Hình: một ô mạng. Nhãn A, B, X là ba núm vặn, không phải ba chất rời nhau.": "Figure: one unit cell. The labels A, B and X are three knobs, not three unrelated chemicals.",
	"Vùng cấm thẳng, hấp thụ mạnh trong lớp mỏng cỡ 0,5 µm, điện tích đi được xa hơn bề dày lớp, và chế tạo dưới 150 °C. Vì vậy hiệu suất tài liệu dẫn đi từ 3,8% năm 2009 lên 27,3% một lớp, và tandem được ghi 35% [1][7].": "A direct gap, strong absorption in a film about 0.5 µm thick, carriers that travel farther than the film is thick, and fabrication below 150 °C. That is why the cited record runs from 3.8% in 2009 to 27.3% for a single junction, with tandems listed at 35% [1][7].",
	"Hình: hai mốc trên cùng một cột thời gian. 27,3% là mức một lớp được tài liệu dẫn, không phải chiều cao của tandem.": "Figure: two milestones on one timeline. 27.3% is the cited single-junction mark, not the tandem height.",
	"Cùng liên kết yếu cho tinh thể tự vá và cho ion iod nhảy, cho ẩm, oxy, nhiệt và tia cực tím làm hỏng pin. Năm kẻ thù ấy không phải chuyện phụ của hiệu suất cao.": "The same weak bonds let the crystal heal itself and let iodide ions hop, and they let moisture, oxygen, heat and ultraviolet light damage the cell. Those five threats are not a footnote to the high efficiency.",
	"Hình: tinh thể ở giữa, năm chấm cảnh báo quay quanh. Mỗi chấm là một kẻ thù đã gặp ở mục 3.9.": "Figure: the crystal in the center, five warning dots around it. Each dot is a threat already met in section 3.9.",
	"Quay phủ, hai bước, chân không, kết tinh nhiệt độ ngược, chích nóng, dao gạt và phủ khe khác nhau ở chỗ ép mầm ra. Chúng giống nhau ở quy tắc: mầm phải xuất hiện cùng lúc, rồi lớn đều, nếu không thì thủng lỗ kim.": "Spin coating, two-step, vacuum, inverse-temperature growth, hot injection, blade and slot-die differ in how they force nuclei to appear. They share one rule: the nuclei must appear together and then grow evenly, or the film gets pinholes.",
	"Hình: nhiều mầm cùng cỡ bung ra, rồi khép thành một màng. Ảnh thực của từng cách nằm ở chương phương pháp chế tạo.": "Figure: many nuclei of one size burst out, then close into a film. Real photos of each route sit in the fabrication chapter.",
	"Không cần một chất mới. Kính lọc UV, cửa lỗ trống NiOₓ và SAM, lớp 2D hai mặt, lõi FA/Cs thuần iod, C₆₀, rào SnO₂ và kính kín — mỗi lớp gánh một kẻ thù. Đây vẫn là giả thuyết ghép từ các bài đã công bố, chưa phải pin đã làm.": "No new material is required. UV-filter glass, a NiOₓ and SAM hole contact, 2D layers on both faces, an iodide-only FA/Cs core, C₆₀, an SnO₂ barrier and a glass seal — each layer carries one threat. This is still a hypothesis assembled from published pieces, not a cell that has been built.",
	"Hình: chồng lớp của đề xuất. Lớp đang sáng là lớp đang được nói tới. Độ dày vẽ không theo tỉ lệ thật.": "Figure: the proposed stack. The bright layer is the one being discussed. Drawn thicknesses are not to scale.",
	"Số bền chỉ có nghĩa khi kèm điều kiện. Mục tiêu đề xuất là giữ trên 90% sau 2000 giờ ISOS-L-3, trên tế bào khoảng 1 cm², rồi mới nói tới tấm lớn. Con đường thương mại gần nhất vẫn là trải perovskite lên silicon có sẵn.": "A lifetime number means something only with its test conditions. The proposal’s target is to keep more than 90% after 2000 hours of ISOS-L-3, on a cell of about 1 cm², before anyone talks about a large module. The nearest commercial path is still perovskite spread onto silicon that already exists.",
	"Hình: lớp perovskite mỏng nằm trên lát silicon dày. Đồng hồ là phép thử T80, chưa phải một pin đã qua 2000 giờ.": "Figure: a thin perovskite layer on a thick silicon slice. The clock is the T80 test, not a cell that has already passed 2000 hours.",
	"Đường dòng–áp. Trục ngang là điện áp, trục dọc là dòng trên mỗi cm². Voc nằm trên trục điện áp khi dòng bằng không.": "Current–voltage curve. Horizontal axis is voltage, vertical axis is current per square centimetre. Voc sits on the voltage axis where current is zero.",
	"Jsc là chỗ đường cong cắt trục dòng, khi điện áp bằng không.": "Jsc is where the curve meets the current axis, where voltage is zero.",
	"Hình chữ nhật trong đường cong là công suất lớn nhất. FF là tỉ lệ hình chữ nhật ấy so với Voc nhân Jsc.": "The rectangle inside the curve is the maximum power. FF is that rectangle compared with Voc times Jsc.",
	"Hiệu suất đọc từ công thức trên hình. 26,4% là ví dụ khi kéo thanh, không phải một kỷ lục mới.": "Efficiency is read from the formula on the figure. 26.4% is the example on the sliders, not a new record.",
	"Đường trần một lớp theo vùng cấm. Đỉnh được giữ ở 33,7%. Dạng đường là minh họa, không phải từng điểm tính lại từ phổ mặt trời.": "The single-junction ceiling against bandgap. The peak is held at 33.7%. The shape is illustrative, not every point recomputed from the solar spectrum.",
	"Eg thấp: dòng lớn, điện áp thấp, phần dư của photon thành nhiệt.": "A low gap: large current, low voltage, the leftover photon energy becomes heat.",
	"Eg cao: điện áp cao, nhưng nhiều photon đỏ và hồng ngoại không đủ năng lượng.": "A high gap: high voltage, but many red and infrared photons do not have enough energy.",
	"Đỉnh đường nằm quanh 1,1–1,4 eV. Từ 1,0 đến 1,6 eV, trần vẫn trên 30%.": "The peak sits near 1.1–1.4 eV. From 1.0 to 1.6 eV the ceiling stays above 30%.",
	"Tandem vượt một đường trần vì lớp trên và lớp dưới chia nhau phổ.": "A tandem may cross the single ceiling because the top and bottom layers split the spectrum.",
	"Mốc 3,8% năm 2009. Đường cam là một lớp. Đường lục ngang là mức 33,7%.": "The 3.8% mark in 2009. The orange line is the single junction. The horizontal green line is 33.7%.",
	"Đường cam nối các mốc tài liệu nêu cho pin một lớp, tới 27,3%. Không phải số đo gốc từng năm.": "The orange line joins cited single-junction milestones, up to 27.3%. It is not an original measurement for every year.",
	"Đường lam là tandem và được phép vượt 33,7% vì không còn là pin một lớp.": "The blue line is the tandem and may cross 33.7% because it is no longer a single junction.",
	"Sáu lý do mở ở mục 3.1 đến 3.6. Hình chỉ giữ các đường để thấy chỗ đứng.": "The six reasons open in sections 3.1 to 3.6. The figure keeps the lines so you can see where things stand.",
	"Bốn cột. Chiều cao là hiệu suất một lớp gần đúng. Cột perovskite không dùng số tandem 35%.": "Four columns. Height is the approximate single-junction efficiency. The perovskite column does not use the 35% tandem number.",
	"Nhãn dưới cột là độ dày. Silicon cao về hiệu suất nhưng dày hơn perovskite khoảng 300 lần.": "The label under each column is thickness. Silicon is high in efficiency but about 300 times thicker than perovskite.",
	"Nhãn tiếp theo là nhiệt độ chế tạo. Perovskite nằm dưới 150 °C.": "The next label is the fabrication temperature. Perovskite sits below 150 °C.",
	"Bước cuối nhắc độ bền: silicon và CdTe đã có khoảng 25 năm ngoài trời. Perovskite chưa có mức ấy.": "The last step adds lifetime: silicon and CdTe already have about 25 years outdoors. Perovskite does not have that yet.",
	"Cột ngang là hiệu suất tài liệu dùng để so họ vật liệu, không phải bảng thị trường.": "The horizontal bars are efficiencies the source uses to compare material families, not a market table.",
	"Cột thiếc thấp hơn chì vì Sn²⁺ dễ thành Sn⁴⁺ và pin bị rò.": "The tin bar is lower than lead because Sn²⁺ readily becomes Sn⁴⁺ and the cell leaks.",
	"Cs₂AgBiBr₆ bền hơn nhưng vùng cấm gián tiếp, hấp thụ kém, nên cột ngắn.": "Cs₂AgBiBr₆ is more stable but its gap is indirect and absorption is weak, so the bar is short.",
	"Việc làm được ngay là khóa chì lại. Cột ngắn không có nghĩa chất ấy đã thay được chì.": "What can be done now is to lock the lead in. A short bar does not mean that material already replaces lead.",
	"Trục ngang là giờ chiếu, trục dọc là phần trăm hiệu suất còn lại.": "Horizontal axis is hours under light, vertical axis is the percent of efficiency still left.",
	"Mức đề xuất là đèn, nhiệt 65–85 °C và ẩm cùng lúc — ISOS-L-3.": "The proposed level is light, 65–85 °C and humidity together — ISOS-L-3.",
	"Đường cam giảm nhanh. Đường lục là mục tiêu thiết kế, chưa phải số đo của đúng tổ hợp này.": "The orange curve falls quickly. The green curve is the design target, not a measurement of this exact stack.",
	"Mốc 93% sau 2000 giờ là số đã báo cáo cho một pin khác [39], đặt lên hình để có thước so.": "The 93% after 2000 hours is a number reported for a different cell [39], drawn here as a ruler to compare against.",
	"PLQY, nhiễu xạ tia X và phổ khối là ba phép đo đi kèm. Chúng không vẽ thành đường thứ ba.": "PLQY, X-ray diffraction and mass spectrometry are the three companion measurements. They are not drawn as a third curve.",
	"Tháo lần lượt lớp 2D và lớp ALD mới biết mỗi lớp đóng góp bao nhiêu.": "Only removing the 2D layers and the ALD layer one at a time tells you how much each one contributes.",
	"Nhãn giả thuyết nghĩa là hình này chưa phải một pin đã chế tạo.": "The hypothesis label means this figure is not a cell that has been built.",
	"Hai giai đoạn của mọi cách nuôi tinh thể: tạo mầm, rồi lớn lên.": "The two stages of every crystal-growth route: nucleate, then grow.",
	"Mầm cùng cỡ nghĩa là chúng xuất hiện cùng lúc và lớn cùng tốc độ.": "Nuclei of one size mean they appeared together and grew at the same rate.",
	"Chấm cam là lỗ kim. Trên tấm lớn, một lỗ có thể thành đường chập cả mô-đun.": "The orange dot is a pinhole. On a large plate, one hole can short the whole module.",
	"Hai cách xếp cùng một lớp hấp thụ. p-i-n đón nắng ở cửa lỗ trống. Hầu hết pin trên 27% hiện là kiểu này [39].": "Two orders for the same absorber. p-i-n lets the sunlight in through the hole contact. Most cells above 27% are now this way [39].",
	"Hình: bên trái n-i-p, bên phải p-i-n. Mũi tên vàng là chiều ánh sáng. Bấm nút để đổi kiểu đang được nói tới.": "Figure: n-i-p on the left, p-i-n on the right. The gold arrow is the direction of the light. Use the button to switch which one is being discussed.",
	"Điện tử chỉ đi xuống dốc về ETL. Lỗ trống chỉ đi về HTL. Bậc thang năng lượng làm việc chọn hộ, không cần hạt «chọn đúng».": "Electrons only roll downhill toward the ETL. Holes only move toward the HTL. The energy staircase does the choosing.",
	"Hình: khối lam là cửa điện tử, khối cam là cửa lỗ trống. Các hạt chạy về đúng cửa của mình.": "Figure: the blue block is the electron door, the orange block is the hole door. Carriers run to their own door.",
	"Kính trên cùng chặn tia cực tím trước khi vào pin.": "The top glass stops ultraviolet light before it enters the cell.",
	"ITO trong suốt lấy dòng. NiOₓ và SAM là cửa lỗ trống, ít phụ gia hơn các lớp lỗ trống đời đầu.": "Transparent ITO collects current. NiOₓ and the SAM are the hole door, with fewer additives than the early hole layers.",
	"Lớp 2D mặt dưới lấp bẫy và cản ion ở giao diện dưới.": "The bottom 2D layer fills traps and slows ions at the lower interface.",
	"Lõi không có methylammonium, chỉ iod, thêm khoảng 5% cesium để khung khỏi đổ sang pha vàng.": "The core has no methylammonium, iodide only, plus about 5% cesium so the frame does not fall into the yellow phase.",
	"Lớp 2D mặt trên kỵ nước và chặn ion đi lên.": "The top 2D layer sheds water and stops ions from climbing.",
	"C₆₀ nhận điện tử và đưa chúng ra khỏi perovskite.": "C₆₀ takes the electrons and carries them out of the perovskite.",
	"SnO₂ phủ từng lớp nguyên tử là một tấm chắn đặc, để iod không ăn điện cực kim loại.": "SnO₂ grown atomic layer by atomic layer is a dense shield, so iodide does not eat the metal electrode.",
	"Kim loại chỉ gặp điện tử sau khi chúng đã qua rào SnO₂.": "The metal meets the electrons only after they have passed the SnO₂ barrier.",
	"Kéo thanh tách lớp để xem từng lát. Kính dưới và gioăng mép khóa ẩm với oxy.": "Drag the split slider to see each slice. The bottom glass and the edge seal lock out moisture and oxygen."
};
/** Filled with exact Vietnamese → English for lesson paragraphs. Fabrication copy also lives in fab-en.ts. */
var BODY_EN = {};
var UI = {
	vi: {
		brand: "Phòng thí nghiệm perovskite",
		sub: "Halide · ABX₃ · cùng một hành trình",
		journey: "Ánh sáng → điện → khung ABX₃ → vì sao hợp pin → phương pháp chế tạo → đề xuất cải tiến → kết luận",
		explainOn: "Giải thích từng bước",
		help: "Cách đọc",
		photos: "Ảnh thực",
		photosHide: "Đóng ảnh",
		present: "Trình chiếu",
		presentExit: "Thoát trình chiếu",
		rotate: "Xoay",
		step: "Bước",
		of: "/",
		searchTerms: "Tìm thuật ngữ",
		searchRefs: "Tìm nguồn",
		correct: "Đúng",
		more: "Giải thích thêm",
		figure: "Chú thích hình",
		table: "Bảng",
		building: "Đang dựng mô hình…",
		lang: "Ngôn ngữ",
		size: "Cỡ chữ",
		sizeHint: "Nhãn 3D, biểu đồ và bảng",
		credit: "Nguồn ảnh",
		close: "Đóng",
		helpTitle: "Cách xem bài",
		enter: "Vào bài",
		prev: "Bước trước",
		next: "Bước sau",
		play: "Phát",
		pause: "Tạm dừng",
		replay: "Xem lại bước",
		wave: "Bước sóng",
		green: "Lục 500",
		red: "Đỏ 700",
		ir: "Hồng ngoại 1100",
		example: "Ví dụ 26,4%",
		bromine: "Brom",
		tin: "Thiếc trên vị trí B",
		hokeOn: "Đang chiếu — tắt đèn",
		hokeOff: "Chiếu sáng (hiệu ứng Hoke)",
		crystal: "Đơn tinh thể",
		film: "Màng mỏng",
		enemy: "Kẻ thù và phòng thủ",
		defense: "Phòng thủ",
		split: "Tách lớp",
		wells: "Số lớp vô cơ n",
		sqCap: "trần một lớp trên sơ đồ",
		shownEg: "Eg trên sơ đồ"
	},
	en: {
		brand: "Perovskite Lab",
		sub: "Halide · ABX₃ · one continuous path",
		journey: "Light → electricity → the ABX₃ frame → why it makes a cell → fabrication methods → proposed improvement → conclusions",
		explainOn: "Step-by-step notes",
		help: "How to read",
		photos: "Real photos",
		photosHide: "Hide photos",
		present: "Present",
		presentExit: "Exit presentation",
		rotate: "Spin",
		step: "Step",
		of: "/",
		searchTerms: "Search terms",
		searchRefs: "Search sources",
		correct: "Score",
		more: "A closer look",
		figure: "Figure caption",
		table: "Table",
		building: "Building the model…",
		lang: "Language",
		size: "Text size",
		sizeHint: "3D labels, charts and tables",
		credit: "Photo credit",
		close: "Close",
		helpTitle: "How this lesson is organized",
		enter: "Start",
		prev: "Previous step",
		next: "Next step",
		play: "Play",
		pause: "Pause",
		replay: "Replay step",
		wave: "Wavelength",
		green: "Green 500",
		red: "Red 700",
		ir: "IR 1100",
		example: "Example 26.4%",
		bromine: "Bromide",
		tin: "Tin on the B site",
		hokeOn: "Lamp on — turn off",
		hokeOff: "Turn the lamp on (Hoke effect)",
		crystal: "Single crystal",
		film: "Thin film",
		enemy: "Threat and defense",
		defense: "Defense",
		split: "Layer split",
		wells: "Inorganic layers n",
		sqCap: "single-junction ceiling on this plot",
		shownEg: "Gap on this plot"
	}
};
function ui(locale, key) {
	return UI[locale][key];
}
var PHRASE = {
	"Kiến thức nền": "Background",
	"Lưu ý": "Watch the number",
	"Giả thuyết, chưa phải kết quả": "A hypothesis, not a measured cell",
	"Mở đầu cùng một hành trình": "One path, from the start",
	"Từ ánh sáng đến điện": "From light to electricity",
	"Khung ABX₃": "The ABX₃ frame",
	"Vì sao hợp làm pin": "Why it suits a solar cell",
	"Làm ra vật liệu rồi làm ra tấm pin": "Make the material, then the module",
	"Ghép thành pin bền hơn": "Assemble a tougher cell",
	"Khép vòng": "Close the loop",
	"Phụ lục": "Appendix",
	"Nắng 1000 W/m² — điểm xuất phát": "1000 W/m² of sunlight — where we start",
	"Nắng gắt mang khoảng 1000 W/m²": "Harsh sun brings about 1000 W/m²",
	"Không máy, không nhiên liệu": "No engine, no fuel",
	"Cách đọc phòng thí nghiệm này": "How to read this lab",
	"Hạt mang điện: nguyên tử, ion, eV": "Charge carriers: atoms, ions, eV",
	"Nguyên tử": "The atom",
	"Mất điện tử thì thành cation": "Lose electrons and you get a cation",
	"Dòng điện là dòng hạt mang điện": "Current is a flow of charged particles",
	"Electron-vôn": "The electron-volt",
	"Photon — gói năng lượng của ánh sáng": "The photon — a packet of light energy",
	"Sóng, và cũng là hạt": "A wave, and also a particle",
	"Công thức tiện dụng": "A handy formula",
	"Phổ mặt trời trải rất rộng": "The solar spectrum is very wide",
	"Tự kéo bước sóng": "Drag the wavelength yourself",
	"Vùng cấm — bậc thang điện tử phải nhảy": "The bandgap — the step an electron must climb",
	"Tòa nhà hai tầng": "A two-storey building",
	"Tầng dưới chật kín": "The ground floor is packed",
	"Tầng trên gần như trống": "The upper floor is almost empty",
	"Khoảng giữa là vùng cấm": "The gap between is the bandgap",
	"Kim loại, cách điện, bán dẫn": "Metal, insulator, semiconductor",
	"Bốn bước của pin: hấp thụ, sinh cặp, tách, thu": "Four steps of a cell: absorb, create a pair, separate, collect",
	"Bước 1 — Hấp thụ": "Step 1 — Absorb",
	"Bước 2 — Sinh cặp điện tử–lỗ trống": "Step 2 — Create an electron–hole pair",
	"Bước 3 — Tách trước khi tái hợp": "Step 3 — Separate them before they recombine",
	"Bước 4 — Thu vào mạch ngoài": "Step 4 — Collect them in the outside circuit",
	"Bốn số đo của pin: Voc, Jsc, FF, hiệu suất": "Four numbers: Voc, Jsc, FF, efficiency",
	"Điện áp hở mạch Voc": "Open-circuit voltage, Voc",
	"Dòng ngắn mạch Jsc": "Short-circuit current, Jsc",
	"Hệ số lấp đầy FF": "Fill factor, FF",
	"PCE = Voc × Jsc × FF / Pin": "PCE = Voc × Jsc × FF / Pin",
	"Trần một lớp: Shockley–Queisser": "The single-junction ceiling: Shockley–Queisser",
	"Trần khoảng 33,7%": "A ceiling near 33.7%",
	"Vùng cấm nhỏ": "A small gap",
	"Vùng cấm lớn": "A large gap",
	"Điểm cân bằng": "The balance point",
	"Muốn vượt trần thì phải xếp chồng": "To beat the ceiling, stack the gaps",
	"Silicon đã gần trần một lớp": "Silicon is already near that ceiling",
	"Hơn 95% thị trường": "More than 95% of the market",
	"Vùng cấm gián tiếp": "An indirect gap",
	"Nấu trên 1400 °C": "Melted above 1400 °C",
	"Đã gần chạm trần": "Already near the ceiling",
	"Vật liệu lý tưởng cần gì — perovskite đáp ứng thế nào": "What an ideal absorber needs — and how perovskite answers",
	"Sáu tiêu chí": "Six requirements",
	"Perovskite halide gật đầu gần hết": "Halide perovskite meets almost all of them",
	"Còn vướng độ bền và chì": "Still stuck on lifetime and lead",
	"Từ tên khoáng vật đến công thức ABX₃": "From a mineral’s name to the formula ABX₃",
	"1839, dãy Ural": "1839, the Ural mountains",
	"Công thức ABX₃": "The formula ABX₃",
	"Đổi oxy lấy halogen": "Swap oxygen for a halogen",
	"A, B, X — ba vai trong cùng một khung": "A, B and X — three roles in one frame",
	"B ngồi tâm bát diện": "B sits at the center of the octahedron",
	"X là đỉnh bát diện": "X is a corner of the octahedron",
	"A lấp khoảng trống": "A fills the cavity",
	"Điện tích phải về không": "The charges must sum to zero",
	"Dựng khung: bát diện, nối góc, đếm ABX₃": "Build the frame: octahedron, corner sharing, count ABX₃",
	"Bước 1 — Viên gạch bát diện": "Step 1 — The octahedron brick",
	"Bước 2 — Nối góc": "Step 2 — Share the corners",
	"Bước 3 — Thả cation A vào hốc": "Step 3 — Drop cation A into the cavity",
	"Bước 4 — Đếm ra ABX₃": "Step 4 — The count is ABX₃",
	"Hệ số t — ion A có vừa hốc không": "Tolerance factor t — does ion A fit?",
	"Ion A có vừa hốc không?": "Does ion A fit the cavity?",
	"CsPbI₃, t ≈ 0,85": "CsPbI₃, t ≈ 0.85",
	"MAPbI₃, t ≈ 0,91": "MAPbI₃, t ≈ 0.91",
	"FAPbI₃, t ≈ 0,99": "FAPbI₃, t ≈ 0.99",
	"Trộn khoảng 5% Cs": "Mix in about 5% Cs",
	"t chỉ là sàng lọc gần đúng": "t is only a rough screen",
	"Khung nghiêng thì vùng cấm đổi": "When the frame tilts, the gap changes",
	"A nhỏ thì khung khom lại": "A small A makes the frame bend",
	"MAPbI₃ có ba pha theo nhiệt độ": "MAPbI₃ has three phases with temperature",
	"Kéo xuống trực thoi": "Cool it into the orthorhombic phase",
	"Nghiêng nhiều thì vùng cấm rộng": "More tilt, a wider gap",
	"Vì sao chì cho vùng cấm thẳng": "Why lead gives a direct gap",
	"Cấu hình đảo ngược": "An inverted orbital picture",
	"Vùng cấm thẳng": "A direct gap",
	"Khối lượng hiệu dụng nhỏ": "A small effective mass",
	"Khuyết tật phổ biến chỉ nông": "Common defects stay shallow",
	"Spin–quỹ đạo hạ đáy vùng dẫn": "Spin–orbit coupling lowers the conduction edge",
	"Trộn A, B, X để vặn tính chất": "Mix A, B or X to turn the properties",
	"Trộn ở vị trí X": "Mixing on the X site",
	"Kéo thanh brom": "Drag the bromide slider",
	"Thuần brom": "Pure bromide",
	"Hiệu ứng Hoke": "The Hoke effect",
	"Trộn ở vị trí A": "Mixing on the A site",
	"Trộn Sn/Pb ở vị trí B": "Mixing Sn/Pb on the B site",
	"Ba dạng nano: màng, chấm lượng tử, lớp 2D": "Three nano forms: film, quantum dot, 2D layer",
	"Vài nanomét quyết định pin": "A few nanometres decide the cell",
	"Màng đa tinh thể": "A polycrystalline film",
	"Chấm lượng tử": "Quantum dots",
	"Giếng lượng tử 2D": "A 2D quantum well",
	"Chỉ nên mặc một lớp áo mỏng": "Wear only a thin coat",
	"Bảng tính chất sẽ dùng lại ở các chương sau": "The property table we will reuse later",
	"Vùng cấm chỉnh được": "A tunable gap",
	"Hấp thụ nông, bờ rất dốc": "Shallow absorption, a steep edge",
	"Exciton yếu, điện tích đi xa": "A weak exciton, carriers that travel far",
	"Ion iod cũng đi được — và đó là vấn đề": "Iodide ions move too — and that is the problem",
	"Lý do tổng: từ 3,8% năm 2009 lên 27,3%": "The headline: 3.8% in 2009 to 27.3%",
	"2009, Miyasaka": "2009, Miyasaka",
	"Đường một lớp": "The single-junction line",
	"Tandem vượt trần một lớp": "Tandems cross the single-junction ceiling",
	"Sáu lý do phía sau tốc độ ấy": "Six reasons behind that speed",
	"Lý do 1 — lớp mỏng vẫn hấp thụ gần hết": "Reason 1 — a thin layer still absorbs almost everything",
	"Mỏng hơn sợi tóc khoảng 100 lần": "About 100× thinner than a hair",
	"Xanh chết sớm, đỏ đi sâu, hồng ngoại thoát": "Blue dies early, red goes deep, infrared escapes",
	"Bờ Urbach dốc như GaAs": "An Urbach edge as steep as GaAs",
	"Lý do 2 — điện tích kịp tới điện cực": "Reason 2 — charges reach the electrodes in time",
	"Không chạy thẳng": "They do not fly in a straight line",
	"L = √(D·τ)": "L = √(D·τ)",
	"Hai bài Science năm 2013": "Two Science papers in 2013",
	"Đơn tinh thể còn dài hơn": "A single crystal goes even farther",
	"Lý do 3 — cặp điện tích tự tách ở nhiệt phòng": "Reason 3 — the pair splits on its own at room temperature",
	"Exciton là một cặp bị hút": "An exciton is a pair still holding on",
	"Vài meV thua nhiệt phòng": "A few meV loses to room-temperature heat",
	"Hữu cơ thì không được thế": "Organic cells do not get this for free",
	"Lý do 4 — khuyết tật phổ biến ít gây hại": "Reason 4 — common defects do little harm",
	"Không tinh thể nào hoàn hảo": "No crystal is perfect",
	"Bẫy sâu nuốt điện tử": "A deep trap swallows the electron",
	"Bẫy nông chỉ giữ tạm": "A shallow trap only holds it briefly",
	"Vì vậy dung dịch vẫn cho pin tốt": "That is why a solution-made film can still be a good cell",
	"Lý do 5 — vùng cấm chỉnh được theo thành phần": "Reason 5 — the gap follows the composition",
	"Một núm, một dải rộng": "One knob, a wide range",
	"Pin một lớp ≈ 1,5 eV": "A single junction wants ≈ 1.5 eV",
	"Lớp trên tandem ≈ 1,7 eV": "The tandem top cell wants ≈ 1.7 eV",
	"Lớp dưới thiếc–chì ≈ 1,25 eV": "The tin–lead bottom cell wants ≈ 1.25 eV",
	"Và cả đèn nhiều màu": "And lamps of many colors",
	"Lý do 6 — phủ từ mực, dưới 150 °C": "Reason 6 — coated from ink, below 150 °C",
	"Pha thành mực": "Mixed into an ink",
	"Silicon phải vào lò": "Silicon has to enter a furnace",
	"Ít vật liệu, nhiều loại đế": "Little material, many kinds of substrate",
	"Hệ quả — pin tốt cũng phát sáng tốt": "A consequence — a good cell is also a good lamp",
	"Quan hệ thuận nghịch Rau": "Rau’s reciprocity",
	"Mỗi thập phân mất khoảng 60 mV": "Each decade costs about 60 mV",
	"Hai thập phân là khoảng 120 mV": "Two decades are about 120 mV",
	"Thụ động hóa để kéo Voc": "Passivate to pull Voc up",
	"Bảng so sánh với silicon, CdTe và pin hữu cơ": "Set beside silicon, CdTe and organic cells",
	"Bốn cột": "Four columns",
	"Hiệu suất và độ dày": "Efficiency and thickness",
	"Nhiệt độ và núm vùng cấm": "Temperature and the gap knob",
	"Bền và độc": "Lifetime and toxicity",
	"Năm kẻ thù sẽ bị chặn ở chương 5": "Five threats that chapter 5 will block",
	"1 · Hơi ẩm": "1 · Moisture",
	"2 · Oxy và ánh sáng": "2 · Oxygen and light",
	"3 · Nhiệt": "3 · Heat",
	"4 · Tia cực tím": "4 · Ultraviolet",
	"5 · Ion iod di chuyển": "5 · Mobile iodide ions",
	"Bật phòng thủ": "Turn the defense on",
	"Bản đồ bảy cách chế tạo": "A map of seven ways to make it",
	"Bảy lối, cùng hai giai đoạn": "Seven routes, the same two stages",
	"1 · Quay phủ + dung môi đối": "1 · Spin coating + antisolvent",
	"2 · Lắng đọng hai bước": "2 · Two-step deposition",
	"3 · Bay hơi chân không": "3 · Vacuum evaporation",
	"4 · Kết tinh nhiệt độ ngược": "4 · Inverse-temperature crystallization",
	"5 · Chích nóng": "5 · Hot injection",
	"6 · Dao gạt và dao khí": "6 · Blade and air knife",
	"7 · Phủ khe và cuộn-sang-cuộn": "7 · Slot-die and roll-to-roll",
	"Nguyên tắc chung — mầm cùng lúc, rồi lớn đều": "The shared rule — nucleate together, then grow evenly",
	"Hai giai đoạn": "Two stages",
	"Mầm cùng một lúc": "Nuclei all at once",
	"Mầm rải rác thì thủng lỗ kim": "Scattered nuclei leave pinholes",
	"Cách 1–3 — quay phủ, hai bước, chân không": "Routes 1–3 — spin, two-step, vacuum",
	"Nhịp 1 — nhỏ mực lên đế": "Beat 1 — drop the ink",
	"Nhịp 2 — quay vài nghìn vòng/phút": "Beat 2 — spin at a few thousand rpm",
	"Nhịp 3 — nhỏ dung môi đối": "Beat 3 — drop the antisolvent",
	"Nhịp 4 — sấy 100–150 °C": "Beat 4 — anneal at 100–150 °C",
	"Hai bước — phủ PbI₂ vàng": "Two-step — coat yellow PbI₂",
	"Hai bước — cho MAI hoặc FAI vào": "Two-step — add MAI or FAI",
	"Chân không — đốt nguồn, đế ở trên": "Vacuum — heat the source, substrate above",
	"Chân không — bám cả mặt gồ ghề": "Vacuum — it coats the rough surface too",
	"Cách 4–5 — đơn tinh thể và chấm lượng tử": "Routes 4–5 — single crystals and quantum dots",
	"Hòa tan khi còn nguội": "Dissolve it while it is still cold",
	"Đun — độ tan giảm, mầm xuất hiện": "Heat — solubility falls, nuclei appear",
	"Giữ nóng cho tinh thể lớn": "Hold the heat and let the crystal grow",
	"Dùng để đo và làm đầu dò": "Use it to measure, and as a detector",
	"Chích nóng — đun muối chì với phối tử": "Hot injection — heat the lead salt with ligands",
	"Chích cesium — mầm bùng cùng lúc": "Inject cesium — nuclei burst together",
	"Nước đá — chấm khoảng 10 nm, đủ màu": "Ice bath — ~10 nm dots, every color",
	"Cách 6–7 — dao gạt, phủ khe, lên tấm lớn": "Routes 6–7 — blade, slot-die, up to a module",
	"Tế bào kỷ lục thường rất nhỏ": "Record cells are usually tiny",
	"Dao gạt trải mực": "The blade spreads the ink",
	"Dao khí nitơ làm khô tức thì": "A nitrogen knife dries it at once",
	"Phủ khe — mực đi qua một khe hẹp": "Slot-die — ink leaves through a narrow slot",
	"Cuộn sang cuộn — chạy như in báo": "Roll-to-roll — it runs like a printing press",
	"Chân không cho mặt lớn và mặt nhám": "Vacuum for large and textured surfaces",
	"Cùng vật liệu ấy, nhiều ứng dụng": "The same material, many uses",
	"Pin một lớp": "A single-junction cell",
	"Tandem perovskite/silicon": "Perovskite/silicon tandem",
	"Pin trong nhà và pin dẻo": "Indoor cells and flexible cells",
	"Lớp chuyển màu cho màn hình": "A color-conversion layer for displays",
	"Đèn PeLED": "A perovskite LED",
	"Cảm biến quang": "A photodetector",
	"Đầu dò tia X và chất phát quang": "An X-ray detector and a scintillator",
	"Nhiên liệu mặt trời": "Solar fuel",
	"Thị trường 2024–2026 — đường gần nhất là tandem": "The 2024–2026 market — the near path is the tandem",
	"6/2024 · Oxford PV": "June 2024 · Oxford PV",
	"4/2025 · LONGi 34,85%": "April 2025 · LONGi 34.85%",
	"7/2025 · Caelux": "July 2025 · Caelux",
	"2026 · Biểu đồ và module": "2026 · the chart and the module",
	"7/2026 · 35,5% chưa lên biểu đồ": "July 2026 · 35.5% not yet on the chart",
	"Con đường gần nhất": "The nearest commercial path",
	"Chì — ít gam, nhưng phải khóa lại": "Lead — a few grams, but it must be locked in",
	"Vài gam trên một mét vuông": "A few grams per square metre",
	"Thiếc cùng nhóm, dễ bị oxy hóa": "Tin is in the same group, and oxidizes easily",
	"Perovskite kép": "The double perovskite",
	"Việc làm được ngay": "What can be done now",
	"Nền đề xuất — xếp lớp kiểu p-i-n": "The proposal starts with a p-i-n stack",
	"n-i-p, ánh sáng vào cửa điện tử": "n-i-p, light enters through the electron side",
	"p-i-n, ánh sáng vào cửa lỗ trống": "p-i-n, light enters through the hole side",
	"Đổi chiều ánh sáng": "Flip the direction of the light",
	"Bậc thang năng lượng": "An energy staircase",
	"Xếp từng lớp để chặn năm kẻ thù": "Stack one layer per threat",
	"Không phát minh một chất mới": "Not a new material — a new combination",
	"Kính lọc UV": "UV-filter glass",
	"ITO + NiOₓ + SAM": "ITO + NiOₓ + SAM",
	"Lớp 2D mặt dưới": "2D layer, bottom face",
	"Lõi Cs₀.₀₅FA₀.₉₅PbI₃": "Cs₀.₀₅FA₀.₉₅PbI₃ core",
	"Lớp 2D mặt trên": "2D layer, top face",
	"C₆₀": "C₆₀",
	"SnO₂ phủ từng lớp nguyên tử": "SnO₂ grown atomic layer by atomic layer",
	"Điện cực Cu/Ag": "Cu/Ag electrode",
	"Kính–kính và gioăng mép": "Glass–glass and an edge seal",
	"Vì sao chọn đúng những thành phần ấy": "Why each of those ingredients",
	"Bỏ MA": "Leave MA out",
	"Chỉ iod": "Iodide only",
	"5% cesium": "5% cesium",
	"2D cả hai mặt": "2D on both faces",
	"Rào ALD": "The ALD barrier",
	"Cách kiểm chứng đề xuất — chuẩn ISOS": "How to test the proposal — the ISOS protocol",
	"Một con số bền phải kèm điều kiện": "A lifetime number needs its test conditions",
	"Mức đề xuất: ISOS-L-3": "The proposed level: ISOS-L-3",
	"Thước T80": "The T80 ruler",
	"Mục tiêu của đề xuất": "Targets of the proposal",
	"Phép đo đi kèm": "Measurements that must come with it",
	"Bỏ lần lượt từng lớp": "Remove one layer at a time",
	"Và đây vẫn là giả thuyết": "And this is still a hypothesis",
	"Khép vòng — cấu trúc, tính chất, pin, thiết kế lại": "Close the loop — structure, properties, cell, redesign",
	"Cấu trúc → tính chất → hiệu năng → thiết kế lại": "Structure → properties → performance → redesign",
	"Pin cần gì": "What the cell needs",
	"ABX₃ cho ta núm vặn": "ABX₃ gives us the knobs",
	"Một tổ hợp hiếm": "A rare combination",
	"Mạng mềm là cả hai mặt": "The soft lattice is both sides of the coin",
	"Đích bây giờ là độ bền": "The target now is lifetime",
	"Tự kiểm — sáu câu ôn cả hành trình": "Check yourself — six questions over the whole path",
	"Câu 1 · Photon 900 nm": "Question 1 · a 900 nm photon",
	"Câu 2 · Đếm trong ô lập phương": "Question 2 · counting the cubic cell",
	"Câu 3 · Hai pha vàng, hai lý do": "Question 3 · two yellow phases, two reasons",
	"Câu 4 · PLQY và Voc": "Question 4 · PLQY and Voc",
	"Câu 5 · Vượt 33,7%": "Question 5 · beating 33.7%",
	"Câu 6 · Chặn ion iod": "Question 6 · stopping iodide ions",
	"Bảng màu thuật ngữ Việt – Anh": "A color-coded Vietnamese–English glossary",
	"Nguồn được trích khi rê chuột vào [n]": "Sources appear when you hover a [n]"
};
function tr(locale, text) {
	if (locale === "vi" || !text) return text;
	return PHRASE[text] ?? LABELS_EN[text] ?? FAB_EN[text] ?? EXTRA_EN[text] ?? BODY_EN[text] ?? text;
}
var HELP = {
	vi: [
		"Cột trái là các chương của cùng một hành trình: ánh sáng thành điện, khung ABX₃, vì sao hợp pin, phương pháp chế tạo, đề xuất cải tiến, rồi kết luận.",
		"Mỗi mục có mô hình 3D. Bấm một bước để nhảy đúng hình của bước đó. Mũi tên chuyển bước, phím cách phát hoặc dừng, phím E bật lời giải thích.",
		"«Ảnh thực» mở ảnh chụp thiết bị và vật liệu tương ứng với mục đang xem. Chú thích ghi rõ ảnh minh họa cái gì.",
		"Số trong ngoặc [n] là nguồn. Rê chuột hoặc chạm vào số để xem trích dẫn đầy đủ.",
		"Cỡ chữ đổi nhãn trên mô hình, chữ trong biểu đồ và chữ trong bảng. «Trình chiếu» phóng toàn màn hình và giấu mục lục.",
		"Hộp tím là kiến thức nền, hộp cam là chỗ cần dè số liệu, hộp xanh là giả thuyết chương 5 — chưa phải pin đã làm ra."
	],
	en: [
		"The left column is one path: light into electricity, the ABX₃ frame, why it suits a cell, fabrication methods, the proposed improvement, then the conclusions.",
		"Each section has a 3D model. Click a step to jump to that picture. Arrow keys change steps, space plays or pauses, E toggles the notes.",
		"“Real photos” opens photographs of the matching equipment and materials. The caption says what the photo is actually showing.",
		"A number in brackets [n] is a source. Hover or tap it to read the full citation.",
		"Text size changes the 3D labels, the chart labels and the tables. “Present” goes fullscreen and hides the contents.",
		"A purple box is background, an orange box flags a number to treat carefully, a green box is the chapter 5 hypothesis — not a cell that has been built."
	]
};
var GLOSS_EN = {
	"Bán dẫn": "A material with a moderate gap that conducts once it is excited.",
	"Bát diện": "An eight-faced solid. BX₆ is the brick of a perovskite.",
	"Bẫy nông / bẫy sâu": "A defect energy near a band edge, or deep in the gap.",
	"Bờ hấp thụ": "The energy where absorption suddenly rises.",
	"Dung thứ khuyết tật": "Common defects do little harm.",
	"Điện áp hở mạch": "The highest voltage, measured when no current is drawn.",
	"Độ dài khuếch tán": "How far a carrier typically travels before recombining.",
	Exciton: "An electron and a hole that are still attracting each other.",
	"Giếng lượng tử": "A thin layer that confines electrons in one direction.",
	"Hệ số dung hạn": "Compares the size of ion A with the cavity of the frame.",
	"Hiệu suất chuyển đổi": "The fraction of light energy that becomes electricity.",
	"Khuếch tán": "Random motion of a particle.",
	"Lỗ trống": "A missing electron, which behaves as a positive charge.",
	"ETL / HTL": "A selective layer that lets only one carrier through.",
	"Nano tinh thể": "A crystal a few to a few tens of nanometres across.",
	"Phối tử": "A molecule stuck to the surface of a nanocrystal.",
	"Pin song song": "Several absorbers with different gaps, stacked.",
	"Ranh giới hạt": "The boundary where two crystal grains meet.",
	"Tách pha": "A mixture splitting into regions rich in one ingredient.",
	"Tái hợp": "An electron meets a hole and the energy is lost.",
	"Tạo mầm": "The moment tiny crystals first appear.",
	"Thụ động hóa": "Coating molecules on to fill surface traps.",
	"Tổn thất nhiệt hóa": "The leftover energy of a photon, turned into heat.",
	"Vùng cấm": "The minimum energy that frees an electron.",
	"Vùng cấm thẳng / gián tiếp": "Absorbs strongly, or must borrow a lattice vibration and absorbs weakly.",
	"Vùng dẫn / vùng hóa trị": "The upper and lower floors of the energy ladder."
};
var TABLES = {
	metrics: {
		caption: {
			vi: "Bảng bốn số đo của một pin perovskite tốt. Pin là công suất ánh sáng chuẩn 100 mW/cm² (AM1.5G). Hiệu suất = Voc × Jsc × FF / Pin. Cột giữa là ý nghĩa; cột phải là khoảng điển hình mà tài liệu nêu, không phải một tế bào duy nhất.",
			en: "The four numbers of a good perovskite cell. Pin is the standard 100 mW/cm² (AM1.5G). Efficiency = Voc × Jsc × FF / Pin. The right column is the typical range in the notes, not one unique cell."
		},
		headers: {
			vi: [
				"Thông số",
				"Ý nghĩa",
				"Khoảng điển hình"
			],
			en: [
				"Quantity",
				"Meaning",
				"Typical range"
			]
		},
		rows: {
			vi: [
				[
					"Voc",
					"Điện áp khi không lấy dòng",
					"≈ 1,15–1,20 V"
				],
				[
					"Jsc",
					"Dòng trên mỗi cm² khi nối tắt",
					"≈ 25–26 mA/cm²"
				],
				[
					"FF",
					"Độ vuông của đường dòng–áp",
					"≈ 0,83–0,87"
				],
				[
					"PCE",
					"Phần trăm ánh sáng thành điện",
					"≈ 26–27%"
				]
			],
			en: [
				[
					"Voc",
					"Voltage when no current is drawn",
					"≈ 1.15–1.20 V"
				],
				[
					"Jsc",
					"Current per cm² when shorted",
					"≈ 25–26 mA/cm²"
				],
				[
					"FF",
					"How square the current–voltage curve is",
					"≈ 0.83–0.87"
				],
				[
					"PCE",
					"Percent of light turned into electricity",
					"≈ 26–27%"
				]
			]
		}
	},
	ideal: {
		caption: {
			vi: "Sáu yêu cầu của vật liệu hấp thụ, và chỗ perovskite halide đạt hay chưa. Hàng cuối là điểm yếu xuyên suốt bài: bền và độc tính chì. Các hàng trên là lý do chương 3 sẽ đi lần lượt.",
			en: "Six requirements of an absorber, and whether a halide perovskite meets them. The last row is the weakness the whole lesson keeps: lifetime and lead. The rows above are the reasons chapter 3 walks through."
		},
		headers: {
			vi: [
				"Yêu cầu",
				"Vì sao",
				"Perovskite halide"
			],
			en: [
				"Requirement",
				"Why",
				"Halide perovskite"
			]
		},
		rows: {
			vi: [
				[
					"Eg ≈ 1,1–1,7 eV",
					"Cân dòng và áp; ~1,7 eV cho lớp trên tandem",
					"Có — chỉnh 1,2–3,0 eV"
				],
				[
					"Hấp thụ mạnh",
					"Lớp mỏng, ít vật liệu",
					"Có — ~0,5 µm"
				],
				[
					"Điện tích đi xa",
					"Tới điện cực trước khi tái hợp",
					"Có — L từ ~1 µm đến >100 µm"
				],
				[
					"Ít bẫy sâu",
					"Giữ điện áp cao",
					"Có — dung thứ khuyết tật"
				],
				[
					"Rẻ, nhiệt độ thấp",
					"Giá điện",
					"Có — mực, <150 °C"
				],
				[
					"Bền, không độc",
					"25 năm ngoài trời",
					"Chưa — điểm yếu chính"
				]
			],
			en: [
				[
					"Eg ≈ 1.1–1.7 eV",
					"Balance current and voltage; ~1.7 eV for a tandem top cell",
					"Yes — tunable 1.2–3.0 eV"
				],
				[
					"Strong absorption",
					"A thin layer, little material",
					"Yes — ~0.5 µm"
				],
				[
					"Long carrier travel",
					"Reach the contact before recombining",
					"Yes — L from ~1 µm to >100 µm"
				],
				[
					"Few deep traps",
					"Keep the voltage high",
					"Yes — defect tolerance"
				],
				[
					"Cheap, low temperature",
					"The price of electricity",
					"Yes — ink, <150 °C"
				],
				[
					"Stable and non-toxic",
					"25 years outdoors",
					"Not yet — the main weakness"
				]
			]
		}
	},
	compare: {
		caption: {
			vi: "Bốn công nghệ đặt cạnh nhau. Cột hiệu suất là kỷ lục gần đúng mà tài liệu nêu (silicon 27–28%, CdTe ~23%, pin hữu cơ ~20%, perovskite một lớp 27,3%). Cột perovskite không dùng 35% tandem để khỏi so lệch với pin một lớp. Độ dày và nhiệt độ là thang chế tạo, không phải nhiệt độ lúc pin chạy.",
			en: "Four technologies side by side. Efficiency is the approximate record cited in the notes (silicon 27–28%, CdTe ~23%, organic ~20%, single-junction perovskite 27.3%). The perovskite column does not use the 35% tandem, so it is not compared against a single junction unfairly. Thickness and temperature are process scales, not the temperature of a working module."
		},
		headers: {
			vi: [
				"",
				"Hiệu suất",
				"Độ dày",
				"Nhiệt chế tạo",
				"Chỉnh Eg",
				"Điểm vướng"
			],
			en: [
				"",
				"Efficiency",
				"Thickness",
				"Process heat",
				"Tunable gap",
				"The catch"
			]
		},
		rows: {
			vi: [
				[
					"Silicon",
					"27–28%",
					"150–180 µm",
					">1400 °C",
					"Không",
					"Đã gần trần"
				],
				[
					"CdTe",
					"~23%",
					"vài µm",
					"500–600 °C",
					"Hạn chế",
					"Cadmium"
				],
				[
					"Pin hữu cơ",
					"~20%",
					"~0,1 µm",
					"<150 °C",
					"Có",
					"Độ bền"
				],
				[
					"Perovskite",
					"27,3% một lớp",
					"~0,5 µm",
					"100–150 °C",
					"Rất rộng",
					"Bền và chì"
				]
			],
			en: [
				[
					"Silicon",
					"27–28%",
					"150–180 µm",
					">1400 °C",
					"No",
					"Near its ceiling"
				],
				[
					"CdTe",
					"~23%",
					"a few µm",
					"500–600 °C",
					"Limited",
					"Cadmium"
				],
				[
					"Organic",
					"~20%",
					"~0.1 µm",
					"<150 °C",
					"Yes",
					"Lifetime"
				],
				[
					"Perovskite",
					"27.3% single junction",
					"~0.5 µm",
					"100–150 °C",
					"Very wide",
					"Lifetime and lead"
				]
			]
		}
	},
	parts: {
		caption: {
			vi: "Ba vị trí trong ABX₃. Màu trong mô hình 3D trùng cột màu này: B xám chì, X tím iod, A vàng FA / lục MA / lam Cs. Điện tích: (+1) + (+2) + 3×(−1) = 0.",
			en: "The three sites in ABX₃. The 3D colors match this key: B lead-grey, X iodine-purple, A gold for FA / green for MA / blue for Cs. Charge: (+1) + (+2) + 3×(−1) = 0."
		},
		headers: {
			vi: [
				"Vị trí",
				"Vai trò",
				"Lựa chọn",
				"Hệ quả"
			],
			en: [
				"Site",
				"Role",
				"Usual choice",
				"What it changes"
			]
		},
		rows: {
			vi: [
				[
					"B +2",
					"Tâm bát diện, đáy vùng dẫn",
					"Pb²⁺, Sn²⁺, Ge²⁺",
					"Chì hiệu suất cao, độc"
				],
				[
					"X −1",
					"Đỉnh bát diện, đỉnh vùng hóa trị",
					"I⁻, Br⁻, Cl⁻",
					"I gap nhỏ; Br, Cl gap lớn"
				],
				[
					"A +1",
					"Lấp hốc, nghiêng khung",
					"MA⁺, FA⁺, Cs⁺",
					"Đổi gap gián tiếp qua hình học"
				]
			],
			en: [
				[
					"B +2",
					"Octahedron center, conduction edge",
					"Pb²⁺, Sn²⁺, Ge²⁺",
					"Lead is efficient and toxic"
				],
				[
					"X −1",
					"Octahedron corner, valence edge",
					"I⁻, Br⁻, Cl⁻",
					"I small gap; Br, Cl larger"
				],
				[
					"A +1",
					"Fills the cavity, tilts the frame",
					"MA⁺, FA⁺, Cs⁺",
					"Changes the gap through geometry"
				]
			]
		}
	},
	phases: {
		caption: {
			vi: "Ba pha của MAPbI₃ theo nhiệt độ [67]. Góc Pb–I–Pb càng lệch 180°, quỹ đạo chồng lấp càng kém, vùng cấm càng rộng [68]. Nhiệt độ phòng nằm ở pha tứ phương.",
			en: "The three phases of MAPbI₃ versus temperature [67]. The farther the Pb–I–Pb angle is from 180°, the weaker the orbital overlap and the wider the gap [68]. Room temperature sits in the tetragonal phase."
		},
		headers: {
			vi: [
				"Pha",
				"Nhiệt độ",
				"Khung"
			],
			en: [
				"Phase",
				"Temperature",
				"Frame"
			]
		},
		rows: {
			vi: [
				[
					"Lập phương",
					"trên ≈ 54 °C",
					"Không nghiêng, Pb–I–Pb = 180°"
				],
				[
					"Tứ phương",
					"≈ −111 °C đến 54 °C",
					"Bát diện xoay quanh một trục"
				],
				[
					"Trực thoi",
					"dưới ≈ −111 °C",
					"Nghiêng cả ba trục"
				]
			],
			en: [
				[
					"Cubic",
					"above ≈ 54 °C",
					"No tilt, Pb–I–Pb = 180°"
				],
				[
					"Tetragonal",
					"≈ −111 °C to 54 °C",
					"Octahedra rotate about one axis"
				],
				[
					"Orthorhombic",
					"below ≈ −111 °C",
					"Tilted on all three axes"
				]
			]
		}
	},
	props: {
		caption: {
			vi: "Các con số sẽ được nhắc lại ở chương 3 và 4. Nguồn trong ngoặc là số ở phụ lục B; rê chuột vào [n] trong lời dẫn để xem bài báo.",
			en: "Numbers reused in chapters 3 and 4. Bracketed sources are listed in appendix B; hover a [n] in the notes to see the paper."
		},
		headers: {
			vi: [
				"Tính chất",
				"Giá trị tiêu biểu",
				"Nghĩa trong pin"
			],
			en: [
				"Property",
				"Typical value",
				"What it means in a cell"
			]
		},
		rows: {
			vi: [
				[
					"Vùng cấm",
					"1,48 eV (FAPbI₃) – 2,3 eV (MAPbBr₃)",
					"Chỉnh bằng thành phần"
				],
				[
					"Độ sâu hấp thụ",
					"≈ 100 nm ở vùng nhìn thấy",
					"Lớp mỏng là đủ"
				],
				[
					"Năng lượng Urbach",
					"≈ 15 meV [13]",
					"Bờ dốc, ít mất điện áp"
				],
				[
					"Liên kết exciton",
					"vài meV ở nhiệt phòng [14]",
					"Cặp tự tách"
				],
				[
					"Độ dài khuếch tán",
					"0,1–1 µm (màng); >10 đến >175 µm (đơn tinh thể) [9][11]",
					"Điện tích đi xa"
				],
				[
					"Hoạt hóa ion iod",
					"≈ 0,6 eV [25]",
					"Ion di chuyển → kém bền"
				],
				[
					"Nhiệt độ xử lý",
					"100–150 °C",
					"Chế tạo rẻ"
				]
			],
			en: [
				[
					"Bandgap",
					"1.48 eV (FAPbI₃) – 2.3 eV (MAPbBr₃)",
					"Set by composition"
				],
				[
					"Absorption depth",
					"≈ 100 nm in the visible",
					"A thin film is enough"
				],
				[
					"Urbach energy",
					"≈ 15 meV [13]",
					"A steep edge, little voltage loss"
				],
				[
					"Exciton binding",
					"a few meV at room temperature [14]",
					"The pair splits itself"
				],
				[
					"Diffusion length",
					"0.1–1 µm (film); >10 to >175 µm (crystal) [9][11]",
					"Charges travel far"
				],
				[
					"Iodide migration barrier",
					"≈ 0.6 eV [25]",
					"Ions move → poor stability"
				],
				[
					"Process temperature",
					"100–150 °C",
					"Cheap to make"
				]
			]
		}
	},
	apps: {
		caption: {
			vi: "Cùng một họ vật liệu, mỗi ứng dụng dùng một tính chất khác nhau. Cột cuối là mức trưởng thành mà tài liệu xếp, không phải lịch bán hàng.",
			en: "One family of materials; each use leans on a different property. The last column is the maturity the notes assign, not a sales calendar."
		},
		headers: {
			vi: [
				"Ứng dụng",
				"Tính chất được dùng",
				"Mức trưởng thành"
			],
			en: [
				"Use",
				"Property used",
				"Maturity in the notes"
			]
		},
		rows: {
			vi: [
				[
					"Pin một lớp",
					"Hấp thụ mạnh, điện tích đi xa",
					"Thí điểm"
				],
				[
					"Tandem / silicon",
					"Eg ≈ 1,7 eV, phủ lên silicon",
					"Thí điểm – đầu thương mại"
				],
				[
					"Trong nhà, pin dẻo",
					"Eg chỉnh được, nhiệt độ thấp",
					"Thí điểm"
				],
				[
					"Chuyển màu màn hình",
					"Chấm phát sáng, màu thuần",
					"Gần thương mại"
				],
				[
					"PeLED",
					"PLQY cao; lục ≈ 31% [55]",
					"Phòng thí nghiệm"
				],
				[
					"Cảm biến quang",
					"Nhạy, dòng tối thấp [56]",
					"Phòng thí nghiệm"
				],
				[
					"Tia X, nhấp nháy",
					"Pb, Cs nặng [57][58]",
					"Phòng thí nghiệm – thí điểm"
				],
				[
					"Nhiên liệu mặt trời",
					"Điện áp cho tách nước / CO₂ [59]",
					"Nghiên cứu"
				]
			],
			en: [
				[
					"Single-junction cell",
					"Strong absorption, long diffusion",
					"Pilot"
				],
				[
					"Tandem on silicon",
					"Eg ≈ 1.7 eV, coats silicon",
					"Pilot to early commercial"
				],
				[
					"Indoor and flexible",
					"Tunable gap, low temperature",
					"Pilot"
				],
				[
					"Display conversion",
					"Bright, pure-color dots",
					"Near commercial"
				],
				[
					"PeLED",
					"High PLQY; green ≈ 31% [55]",
					"Laboratory"
				],
				[
					"Photodetector",
					"Sensitive, low dark current [56]",
					"Laboratory"
				],
				[
					"X-ray, scintillator",
					"Heavy Pb and Cs [57][58]",
					"Laboratory to pilot"
				],
				[
					"Solar fuel",
					"Voltage for water or CO₂ [59]",
					"Research"
				]
			]
		}
	},
	market: {
		caption: {
			vi: "Mốc 2024–2026 trong tài liệu. Thông cáo công ty không thay chứng nhận độc lập: rê chuột vào [n] để thấy nguồn. 35,5% được ghi là chưa lên biểu đồ NREL [5].",
			en: "The 2024–2026 marks in the notes. A company announcement is not an independent certificate: hover [n] for the source. 35.5% is recorded as not yet on the NREL chart [5]."
		},
		headers: {
			vi: [
				"Thời điểm",
				"Sự kiện",
				"Nguồn"
			],
			en: [
				"When",
				"Event",
				"Source"
			]
		},
		rows: {
			vi: [
				[
					"6/2024",
					"Oxford PV, module tandem ≈ 1,6 m², 26,9%",
					"[61]"
				],
				[
					"4/2025",
					"LONGi tandem 34,85%",
					"[4]"
				],
				[
					"7/2025",
					"Caelux giao kính phủ perovskite",
					"[62]"
				],
				[
					"2026",
					"NREL: một lớp 27,3%, tandem 35%; module LONGi 29,4% trên ≈ 1,7 m²",
					"[1][2]"
				],
				[
					"7/2026",
					"LONGi công bố 35,5%, chưa lên biểu đồ NREL",
					"[5]"
				],
				[
					"Dự báo",
					"IDTechEx ≈ 12 tỷ USD/năm vào 2035",
					"[63]"
				]
			],
			en: [
				[
					"June 2024",
					"Oxford PV tandem module ≈ 1.6 m², 26.9%",
					"[61]"
				],
				[
					"April 2025",
					"LONGi tandem 34.85%",
					"[4]"
				],
				[
					"July 2025",
					"Caelux ships perovskite-coated glass",
					"[62]"
				],
				[
					"2026",
					"NREL: 27.3% single junction, 35% tandem; LONGi module 29.4% on ≈ 1.7 m²",
					"[1][2]"
				],
				[
					"July 2026",
					"LONGi announces 35.5%, not yet on the NREL chart",
					"[5]"
				],
				[
					"Forecast",
					"IDTechEx ≈ 12 billion USD/year by 2035",
					"[63]"
				]
			]
		}
	},
	lead: {
		caption: {
			vi: "Hiệu suất pin một lớp của các họ ít chì hoặc không chì so với perovskite chì, theo các mốc tài liệu dẫn [34][36][41]. Trục ngang là phần trăm. Thiếc–chì vẫn là hợp kim có chì.",
			en: "Single-junction efficiency of lower-lead and lead-free families versus lead perovskite, using the marks cited in the notes [34][36][41]. The horizontal axis is percent. Tin–lead is still a lead alloy."
		},
		headers: {
			vi: [
				"Họ",
				"Hiệu suất nêu trong tài liệu",
				"Vướng mắc"
			],
			en: [
				"Family",
				"Efficiency cited",
				"The problem"
			]
		},
		rows: {
			vi: [
				[
					"Chì Pb",
					"27,3%",
					"Độc, tan trong nước"
				],
				[
					"Thiếc–chì",
					"24,8%",
					"Vẫn còn chì"
				],
				[
					"Thiếc Sn",
					"16,65%",
					"Sn²⁺ dễ thành Sn⁴⁺, pin rò"
				],
				[
					"Kép Cs₂AgBiBr₆",
					"6,37%",
					"Vùng cấm gián tiếp, hấp thụ kém"
				]
			],
			en: [
				[
					"Lead Pb",
					"27.3%",
					"Toxic, water-soluble"
				],
				[
					"Tin–lead",
					"24.8%",
					"Still contains lead"
				],
				[
					"Tin Sn",
					"16.65%",
					"Sn²⁺ oxidizes to Sn⁴⁺, the cell leaks"
				],
				[
					"Double Cs₂AgBiBr₆",
					"6.37%",
					"Indirect gap, weak absorption"
				]
			]
		}
	},
	stack: {
		caption: {
			vi: "Các lớp của đề xuất p-i-n, theo thứ tự ánh sáng đi từ kính lọc UV lên điện cực kim loại (trong mô hình 3D ánh sáng đi từ dưới). Bề dày không theo tỉ lệ thật. Cột «chặn» trỏ về năm kẻ thù ở mục 3.9. Cơ sở là số tài liệu [n].",
			en: "Layers of the proposed p-i-n cell, in the order light travels from the UV glass toward the metal (in the 3D model light comes from below). Thicknesses are not to scale. The “blocks” column points at the five threats in section 3.9. The basis is citation [n]."
		},
		headers: {
			vi: [
				"Lớp",
				"Việc của lớp",
				"Chặn",
				"Cơ sở"
			],
			en: [
				"Layer",
				"Job",
				"Blocks",
				"Basis"
			]
		},
		rows: {
			vi: [
				[
					"Kính lọc UV",
					"Chặn tia cực tím",
					"4 UV",
					"[26]"
				],
				[
					"ITO + NiOₓ + SAM",
					"Điện cực trong suốt, lấy lỗ trống",
					"Tổn thất áp",
					"[39]"
				],
				[
					"2D mặt dưới",
					"Thụ động hóa giao diện dưới",
					"Áp, ion",
					"[30]"
				],
				[
					"Lõi FA/Cs thuần iod",
					"Hấp thụ; không MA; không Hoke",
					"3 nhiệt",
					"[19][22][24]"
				],
				[
					"2D mặt trên",
					"Kỵ nước, chặn ion",
					"1 ẩm, 5 ion",
					"[29][30]"
				],
				[
					"C₆₀",
					"Lấy điện tử",
					"—",
					"[39]"
				],
				[
					"SnO₂ ALD",
					"Rào đặc, chặn iod",
					"5 ion, 1 ẩm",
					"[39][40]"
				],
				[
					"Cu/Ag",
					"Thu điện tử",
					"—",
					"—"
				],
				[
					"Kính và gioăng mép",
					"Đóng gói kín",
					"1 ẩm, 2 oxy",
					"[38]"
				]
			],
			en: [
				[
					"UV glass",
					"Stop ultraviolet before the cell",
					"4 UV",
					"[26]"
				],
				[
					"ITO + NiOₓ + SAM",
					"Transparent contact, collect holes",
					"Voltage loss",
					"[39]"
				],
				[
					"Bottom 2D",
					"Passivate the lower interface",
					"Voltage, ions",
					"[30]"
				],
				[
					"Pure-iodide FA/Cs core",
					"Absorb; no MA; no Hoke",
					"3 heat",
					"[19][22][24]"
				],
				[
					"Top 2D",
					"Repel water, block ions",
					"1 moisture, 5 ions",
					"[29][30]"
				],
				[
					"C₆₀",
					"Collect electrons",
					"—",
					"[39]"
				],
				[
					"SnO₂ ALD",
					"Dense barrier against iodide",
					"5 ions, 1 moisture",
					"[39][40]"
				],
				[
					"Cu/Ag",
					"Collect electrons",
					"—",
					"—"
				],
				[
					"Glass and edge seal",
					"A sealed package",
					"1 moisture, 2 oxygen",
					"[38]"
				]
			]
		}
	},
	verify: {
		caption: {
			vi: "Mục tiêu đề xuất để kiểm chứng, chưa phải kết quả đã đo trên đúng tổ hợp này. Đường trên mô hình: cam là pin chưa tối ưu, lục là mục tiêu giữ trên 90% sau 2000 giờ. Sao vàng là mốc 93% / 2000 giờ đã được báo cáo cho một pin 27,3% [39], không phải số của tổ hợp giả thuyết.",
			en: "Proposed targets to test, not results already measured on this exact stack. On the model: orange is an unoptimized cell, green is the goal of staying above 90% after 2000 hours. The gold mark is the reported 93% / 2000 h for a 27.3% cell [39], not a measurement of the hypothetical stack."
		},
		headers: {
			vi: ["Hạng mục", "Mục tiêu"],
			en: ["Item", "Target"]
		},
		rows: {
			vi: [
				["Hiệu suất ban đầu, 1 cm²", "≥ 26%"],
				["ISOS-L-3", "> 90% sau 2000 giờ"],
				["Phép đo kèm", "PLQY, nhiễu xạ tia X, phổ khối hoặc XPS"],
				["Đối chứng", "Bỏ lần lượt 2D trên, 2D dưới, lớp ALD"]
			],
			en: [
				["Initial efficiency, 1 cm²", "≥ 26%"],
				["ISOS-L-3", "> 90% after 2000 hours"],
				["Accompanying tests", "PLQY, X-ray diffraction, mass spectrometry or XPS"],
				["Controls", "Remove top 2D, bottom 2D, and the ALD layer one at a time"]
			]
		}
	},
	sq: {
		caption: {
			vi: "Sơ đồ trần Shockley–Queisser cho một lớp hấp thụ [70]. Trục ngang là vùng cấm, trục đứng là hiệu suất trần. Đỉnh nằm quanh 1,1–1,4 eV, gần 33,7% dưới phổ mặt trời chuẩn. Đường là đường tính minh họa của mô hình, các mốc 33,7% và vùng 1,0–1,6 eV là số của bài báo.",
			en: "The Shockley–Queisser ceiling for one absorber [70]. Horizontal axis: bandgap. Vertical axis: limiting efficiency. The peak sits near 1.1–1.4 eV, about 33.7% under the standard solar spectrum. The curve is the model’s calculated shape; 33.7% and the 1.0–1.6 eV window are the paper’s numbers."
		},
		headers: {
			vi: ["Vùng cấm", "Hệ quả"],
			en: ["Gap", "Consequence"]
		},
		rows: {
			vi: [
				["Nhỏ", "Nhiều photon, nhưng mỗi photon cho ít năng lượng — áp thấp"],
				["Lớn", "Mỗi điện tử mang nhiều năng lượng, nhưng bỏ photon đỏ và hồng ngoại"],
				["1,1–1,4 eV", "Cân bằng, trần cao nhất"],
				["1,0–1,6 eV", "Vẫn trên 30%"]
			],
			en: [
				["Small", "Many photons, but each gives little energy — low voltage"],
				["Large", "Each electron carries more energy, but red and infrared photons are wasted"],
				["1.1–1.4 eV", "The balance, the highest ceiling"],
				["1.0–1.6 eV", "Still above 30%"]
			]
		}
	},
	race: {
		caption: {
			vi: "Hiệu suất theo năm. Đường cam: pin một lớp, các mốc tài liệu từ 3,8% (2009) [7] tới 27,3% (2026) [1]. Đường lam: tandem. Đường lục nằm ngang: trần một lớp ≈ 33,7% [70]. Các điểm được nối thẳng, không phải số đo của từng năm ở giữa.",
			en: "Efficiency versus year. Orange: single junction, from 3.8% (2009) [7] to 27.3% (2026) [1]. Blue: tandems. The horizontal green line is the single-junction ceiling ≈ 33.7% [70]. Points are joined by straight segments, not a measurement for every year in between."
		},
		headers: {
			vi: [
				"Năm",
				"Một lớp",
				"Tandem"
			],
			en: [
				"Year",
				"Single junction",
				"Tandem"
			]
		},
		rows: {
			vi: [
				[
					"2009",
					"3,8%",
					"—"
				],
				[
					"2013",
					"16%",
					"—"
				],
				[
					"2016",
					"22%",
					"18%"
				],
				[
					"2024",
					"—",
					"33,5%"
				],
				[
					"2026",
					"27,3%",
					"35%"
				]
			],
			en: [
				[
					"2009",
					"3.8%",
					"—"
				],
				[
					"2013",
					"16%",
					"—"
				],
				[
					"2016",
					"22%",
					"18%"
				],
				[
					"2024",
					"—",
					"33.5%"
				],
				[
					"2026",
					"27.3%",
					"35%"
				]
			]
		}
	}
};
var QUIZ_EN = [
	{
		prompt: "A 900 nm photon meets MAPbI₃. What happens?",
		options: [
			"It is reflected because it is too strong",
			"E ≈ 1.38 eV, below Eg ≈ 1.57 eV, so it passes through",
			"It is fully absorbed because it is visible",
			"It is stopped only if the layer is thicker than 180 µm"
		],
		why: "1240/900 ≈ 1.38 eV. MAPbI₃ has Eg near 1.57 eV. A photon below the gap does not create a charge pair."
	},
	{
		prompt: "How many A, B and X are in one cubic cell?",
		options: [
			"8 A, 6 B, 1 X",
			"1 A, 1 B, 3 X — a corner counts as 1/8 because eight cells share it",
			"1 A, 3 B, 1 X",
			"4 A, 4 B, 4 X"
		],
		why: "A corner belongs to 8 cells, a face center to 2, the body center to 1. 8×1/8 + 1 + 6×1/2 = ABX₃."
	},
	{
		prompt: "Why do both CsPbI₃ and FAPbI₃ turn yellow easily?",
		options: [
			"Both have t ≈ 1.00",
			"Cs is too small (t ≈ 0.85) and the frame collapses; FA is too large (t ≈ 0.99) and it turns hexagonal, face-sharing",
			"Both lose lead in water",
			"They share silicon’s 1.12 eV gap"
		],
		why: "Two opposite size problems around the same cavity: a small A collapses the frame, a large A switches how the octahedra connect."
	},
	{
		prompt: "PLQY falls from 1% to 0.01%. What happens to Voc?",
		options: [
			"It rises by about 60 mV",
			"It falls by about 120 mV",
			"It is unchanged because Voc depends only on Eg",
			"It is cut in half"
		],
		why: "Two factors of ten. Each costs about 60 mV, because (kT/q)·ln(10) ≈ 60 mV at 300 K."
	},
	{
		prompt: "How does a tandem beat 33.7%?",
		options: [
			"By using a layer thicker than silicon",
			"Several layers with different gaps each take part of the spectrum, so it is no longer a single-junction cell",
			"By turning the light off to stop recombination",
			"By measuring under a spectrum stronger than AM1.5G"
		],
		why: "33.7% is the limit for one gap. Stacking different gaps avoids both thermalization loss and the photons that were passing through."
	},
	{
		prompt: "Which part of the proposal stops iodide ions?",
		options: [
			"Only the UV-filter glass",
			"2D layers on both faces, plus a dense SnO₂ ALD barrier, plus a pure-iodide core that avoids phase segregation",
			"Only a silver electrode",
			"A lithium-doped Spiro-OMeTAD layer"
		],
		why: "Threat 5 is assigned to the 2D layers, the ALD barrier, and fewer vacancies. The UV glass aims at a different threat."
	}
];
var cell = {
	src: "/photos/cell-hand.jpg",
	alt: {
		vi: "Tế bào pin mặt trời màng mỏng trên kính, các ngón tay kim loại thu dòng.",
		en: "A thin-film solar cell on glass, with metal fingers collecting current."
	},
	credit: "Wikimedia Commons — Perovskite solar cell",
	href: "https://commons.wikimedia.org/wiki/File:Perovskite_solar_cell.jpg"
};
var dark = {
	src: "/photos/cells-dark.jpg",
	alt: {
		vi: "Các tấm kính phủ màng tối, đúng màu perovskite iod sau khi kết tinh.",
		en: "Glass coupons coated with a dark film, the color of an iodide perovskite after it crystallizes."
	},
	credit: "UC San Diego Today",
	href: "https://today.ucsd.edu/story/a-temporary-melting-liquid-could-help-build-better-perovskite-solar-cells-and-leds"
};
var spin = {
	src: "/photos/spin.jpg",
	alt: {
		vi: "Đế trong máy quay phủ. Màu tím là vân giao thoa của màng mỏng, không phải màu phát sáng.",
		en: "A substrate in a spin coater. The purple is thin-film interference, not luminescence."
	},
	credit: "Ossila — spin coating",
	href: "https://www.ossila.com/pages/spin-coating"
};
var drop = {
	src: "/photos/spin-drop.jpg",
	alt: {
		vi: "Nhỏ dung dịch lên đế trước khi quay — đúng nhịp 1 của quay phủ.",
		en: "Dispensing solution onto a substrate before the spin — step 1 of spin coating."
	},
	credit: "Ossila — spin coating",
	href: "https://www.ossila.com/pages/spin-coating"
};
var waferSpin = {
	src: "/photos/spin-wafer.jpg",
	alt: {
		vi: "Nhỏ chất lỏng lên tâm một đĩa tròn trên máy quay.",
		en: "A drop landing at the center of a round chuck."
	},
	credit: "Cost Effective Equipment",
	href: "https://www.costeffectiveequipment.com/blog-spin-coat-theory/"
};
var si = {
	src: "/photos/silicon.jpg",
	alt: {
		vi: "Pin silicon tinh thể (xanh, có điện cực) cạnh tấm silicon trần.",
		en: "Crystalline-silicon cells beside bare silicon wafers."
	},
	credit: "Wikimedia — Crystalline silicon",
	href: "https://en.wikipedia.org/wiki/Crystalline_silicon"
};
var line = {
	src: "/photos/silicon-line.jpg",
	alt: {
		vi: "Tế bào silicon trên dây chuyền, dày hơn lớp perovskite khoảng 300 lần.",
		en: "Silicon cells on a production line — roughly 300× thicker than a perovskite film."
	},
	credit: "PV-Manufacturing.org",
	href: "https://pv-manufacturing.org/silicon-heterojunction-solar-cells/"
};
var dots = {
	src: "/photos/qdots.jpg",
	alt: {
		vi: "Lọ chấm lượng tử phát từ tím đến đỏ dưới đèn cực tím — cùng dải 410–700 nm của mục chích nóng.",
		en: "Quantum-dot vials glowing from violet to red under UV — the 410–700 nm range of hot injection."
	},
	credit: "Fluxim",
	href: "https://www.fluxim.com/research-blogs/light-conversion-perovskite-quantum-dots"
};
var dots2 = {
	src: "/photos/qdots2.jpg",
	alt: {
		vi: "Dung dịch nano tinh thể phát quang trong chai.",
		en: "Colloidal nanocrystals photoluminescing in bottles."
	},
	credit: "Nature Research Custom",
	href: "https://www.nature.com/articles/d42473-025-00002-3"
};
var vac = {
	src: "/photos/vacuum.jpg",
	alt: {
		vi: "Buồng bay hơi nhiệt: nguồn nóng ở dưới, đế treo phía trên. Ảnh minh họa nguyên lý, nguồn trong ảnh không phải muối perovskite.",
		en: "A thermal evaporator: hot source below, substrate above. The charge in the photo is not a perovskite salt; the geometry is the point."
	},
	credit: "Kintek Solution",
	href: "https://kindle-tech.com/faqs/what-is-the-principle-of-thermal-evaporation-method"
};
var flex = {
	src: "/photos/flexible.jpg",
	alt: {
		vi: "Pin perovskite uốn trên đế nhựa — hệ quả của lớp mỏng phủ ở nhiệt độ thấp.",
		en: "A flexible perovskite cell on plastic — what a low-temperature thin film makes possible."
	},
	credit: "Perovskite-Info",
	href: "https://www.perovskite-info.com/researchers-fabricate-flexible-roll-roll-perovskite-solar-cells-167-efficiency"
};
var sem = {
	src: "/photos/sem.jpg",
	alt: {
		vi: "Ảnh kính hiển vi điện tử quét cắt lớp: perovskite nằm trên cùng, mỏng hơn các lớp bên dưới.",
		en: "Cross-section electron micrograph: the perovskite is the thin top layer."
	},
	credit: "TechXplore",
	href: "https://techxplore.com/news/2025-04-ultralight-flexible-solar-cells-efficiency.html"
};
var peled = {
	src: "/photos/peled.jpg",
	alt: {
		vi: "Màng perovskite phát lục theo số lớp n. Ảnh bài báo, kèm giản đồ và phổ — không chỉ là ảnh đèn.",
		en: "Green perovskite films versus well thickness n, from a paper figure with spectra."
	},
	credit: "Nature Communications, 2018",
	href: "https://www.nature.com/articles/s41467-018-02978-7"
};
var module = {
	src: "/photos/module.jpg",
	alt: {
		vi: "Mô-đun pin cầm tay, các tế bào nối thành tấm — bậc thang từ cm² lên sản phẩm.",
		en: "A handheld module: cells strung into a plate, the step beyond a square centimetre."
	},
	credit: "Solar Power World",
	href: "https://www.solarpowerworldonline.com/2025/08/us-perovskite-startups-make-moves-into-tandem-panel-manufacturing/"
};
var minis = {
	src: "/photos/mini-modules.jpg",
	alt: {
		vi: "Các mô-đun nhỏ xếp cạnh nhau khi thử nghiệm tandem.",
		en: "Mini-modules laid out during tandem development."
	},
	credit: "pv magazine USA",
	href: "https://pv-magazine-usa.com/2025/01/09/u-s-made-perovskite-silicon-tandem-solar-modules-could-be-produced-at-around-0-35-w/"
};
var color = {
	src: "/photos/film-color.jpg",
	alt: {
		vi: "Màng mỏng trên kính để trước một tấm pin. Ánh màu là giao thoa bề dày, cho thấy lớp chỉ dày cỡ bước sóng ánh sáng.",
		en: "A thin film on glass in front of a module. The color is interference — the layer is only about as thick as a wavelength of light."
	},
	credit: "Glass on Web",
	href: "https://www.glassonweb.com/article/thin-film-solar-cells-low-cost-glass-substrates"
};
var itc = {
	src: "/photos/itc-vials.jpg",
	alt: {
		vi: "Bốn lọ thật trong bài kết tinh nhanh: dung dịch trong, mầm đỏ, dung dịch vàng, và tinh thể đen nằm đáy lọ.",
		en: "Four real vials from a rapid-growth paper: clear solution, red seeds, a yellow solution, and black crystals at the bottom."
	},
	credit: "Nature Communications, 2016 — rapid growth of halide perovskite crystals",
	href: "https://www.nature.com/articles/ncomms13303"
};
var bladeLab = {
	src: "/photos/blade-lab.jpg",
	alt: {
		vi: "Trên là sơ đồ dao gạt: nhỏ mực, lưỡi chạy, màng ướt, rồi sấy. Dưới là ảnh máy thật, lưỡi trên bàn nhiệt.",
		en: "Top: blade-coating steps — dispense, blade motion, wet film, dry. Bottom: a real blade coater sitting on a hot plate."
	},
	credit: "Springer — Doctor blade coating, laboratory photograph in the figure",
	href: "https://link.springer.com/chapter/10.1007/978-981-99-0961-2_12"
};
var r2r = {
	src: "/photos/r2r-coater.jpg",
	alt: {
		vi: "Máy phủ cuộn-sang-cuộn thật: cuộn thả bên trái, đầu phủ ở giữa, lò, rồi cuộn thu bên phải.",
		en: "A real roll-to-roll coater: unwind on the left, coating head in the middle, oven, then rewind on the right."
	},
	credit: "infinityPV — LR2RC roll-to-roll coater",
	href: "https://www.infinitypv.com/r2r-academy/roll-to-roll-processing"
};
var evapReal = {
	src: "/photos/evap-chamber.jpg",
	alt: {
		vi: "Buồng bay hơi nhiệt đang chạy: nguồn sáng ở dưới, đế treo phía trên. Chất trong ảnh không phải muối perovskite; hình cho thấy đúng hình học của cách 3.",
		en: "A thermal evaporator running: hot source below, substrate hung above. The charge in the photo is not a perovskite salt; the geometry is what method 3 uses."
	},
	credit: "Kintek Solution — thermal evaporation",
	href: "https://kindle-tech.com/faqs/what-is-the-principle-of-thermal-evaporation-method"
};
var slotFig = {
	src: "/photos/slotdie-fig.jpg",
	alt: {
		vi: "Sơ đồ dây chuyền phủ khe: mực perovskite, lớp vận chuyển, điện cực, rồi sấy hồng ngoại. Ảnh góc là màng thật — lỗ kim khi mặt đế không thấm, và màng kín khi thấm tốt.",
		en: "A slot-die line diagram: perovskite ink, transport layers, electrode, then infrared drying. The corner photos are real films — pinholes on a poorly wetting surface, and a dense film when wetting is good."
	},
	credit: "infinityPV — slot-die coating of perovskite cells",
	href: "https://www.infinitypv.com/news/slot-die-coating-advances-for-high-performance-perovskite-solar-cells-a-study-on-interface-roughness"
};
var antiLab = {
	src: "/photos/antisolvent-lab.jpg",
	alt: {
		vi: "Hình từ một bài chế tạo: nhỏ dung môi đối, rồi trải màng. Hai ảnh dưới là pipette thật và tấm đã phủ, sấy trên bàn nhiệt.",
		en: "A fabrication figure: antisolvent drops, then spreading the film. The lower two frames are a real pipette and a coated sheet dried on a hot plate."
	},
	credit: "TechXplore — perovskite fabrication figure with laboratory photos",
	href: "https://techxplore.com/news/2022-01-fabrication-perovskite-solar-cells-piece.html"
};
var lab = [
	cell,
	dark,
	color
];
var make = [
	spin,
	drop,
	waferSpin,
	vac
];
var PHOTO_SETS = {
	intro: [
		module,
		line,
		cell
	],
	foundation: lab,
	photon: [
		color,
		module,
		cell
	],
	bands: lab,
	cell: [
		cell,
		sem,
		dark
	],
	metrics: [cell, module],
	sq: [module, line],
	silicon: [
		si,
		line,
		module
	],
	ideal: [
		cell,
		dark,
		si
	],
	origin: [dark, cell],
	parts: [dark, sem],
	build: [
		dark,
		sem,
		cell
	],
	tolerance: [dark, cell],
	phases: [dark, cell],
	orbitals: [sem, dark],
	alloy: [
		dots,
		dark,
		cell
	],
	nano: [...[
		dots,
		dots2,
		peled
	], sem],
	props: [sem, dark],
	race: [
		module,
		cell,
		minis
	],
	absorb: [
		sem,
		color,
		dark
	],
	diffusion: [sem, cell],
	exciton: [peled, dots],
	defects: [sem, dark],
	tune: [
		dots,
		dots2,
		dark
	],
	ink: [
		drop,
		spin,
		flex
	],
	plqy: [peled, dots],
	compare: [
		si,
		line,
		cell,
		module
	],
	enemies: [
		dark,
		sem,
		cell
	],
	methods: [
		...make,
		flex,
		dots
	],
	nucleation: [
		spin,
		dark,
		sem
	],
	films: [
		drop,
		spin,
		waferSpin,
		vac,
		dark
	],
	grow: [
		dots,
		dots2,
		peled
	],
	scale: [
		flex,
		module,
		vac,
		sem,
		minis
	],
	apps: [
		flex,
		peled,
		dots,
		module,
		cell
	],
	market: [
		module,
		minis,
		cell
	],
	lead: [cell, dark],
	pin: [
		sem,
		cell,
		module
	],
	stack: [sem, cell],
	why: [sem, dark],
	verify: [module, cell],
	finale: [
		cell,
		module,
		dots
	],
	quiz: [cell, dark],
	glossary: [
		dark,
		dots,
		sem
	],
	refs: [cell]
};
var STEP_PHOTOS = {
	methods: [
		[
			spin,
			bladeLab,
			evapReal,
			itc,
			dots,
			r2r
		],
		[
			drop,
			spin,
			waferSpin
		],
		[dark, antiLab],
		[evapReal, vac],
		[itc],
		[dots, dots2],
		[bladeLab],
		[
			slotFig,
			r2r,
			flex
		]
	],
	nucleation: [
		[spin, dark],
		[sem, dark],
		[sem]
	],
	films: [
		[drop, waferSpin],
		[spin, waferSpin],
		[antiLab, spin],
		[dark, color],
		[itc, dark],
		[dark, cell],
		[evapReal, vac],
		[evapReal, sem]
	],
	grow: [
		[itc],
		[itc],
		[itc],
		[sem, itc],
		[dots2],
		[dots],
		[
			dots,
			dots2,
			peled
		]
	],
	scale: [
		[cell, module],
		[bladeLab],
		[bladeLab, slotFig],
		[slotFig],
		[r2r, flex],
		[evapReal]
	],
	pin: [
		[sem, cell],
		[sem, cell],
		[sem],
		[sem, cell]
	],
	stack: [
		[sem],
		[sem],
		[sem, cell],
		[sem],
		[dark],
		[sem],
		[sem],
		[cell],
		[sem],
		[module]
	],
	finale: [
		[cell, color],
		[dark, sem],
		[module, cell],
		[dark],
		[spin, bladeLab],
		[sem, cell],
		[module, minis]
	]
};
function photosFor(id, step) {
	if (typeof step === "number") {
		const row = STEP_PHOTOS[id]?.[step];
		if (row && row.length > 0) return row;
	}
	return PHOTO_SETS[id] ?? lab;
}
function photoAlt(photo, locale) {
	return photo.alt[locale];
}
function wavelengthRGB(nm) {
	let r = 0;
	let g = 0;
	let b = 0;
	if (nm < 380) {
		r = .45;
		b = 1;
	} else if (nm < 440) {
		r = -(nm - 440) / 60;
		b = 1;
	} else if (nm < 490) {
		g = (nm - 440) / 50;
		b = 1;
	} else if (nm < 510) {
		g = 1;
		b = -(nm - 510) / 20;
	} else if (nm < 580) {
		r = (nm - 510) / 70;
		g = 1;
	} else if (nm < 645) {
		r = 1;
		g = -(nm - 645) / 65;
	} else if (nm <= 780) r = 1;
	else {
		r = .55;
		g = .08;
		b = .08;
	}
	let f = 1;
	if (nm >= 380 && nm < 420) f = .35 + .65 * (nm - 380) / 40;
	else if (nm > 700 && nm <= 780) f = .35 + .65 * (780 - nm) / 80;
	else if (nm < 380 || nm > 780) f = .55;
	return {
		r: Math.max(0, r) * f,
		g: Math.max(0, g) * f,
		b: Math.max(0, b) * f
	};
}
function wavelengthHex(nm) {
	const c = wavelengthRGB(nm);
	const h = (n) => Math.round(Math.min(255, Math.max(0, n * 255))).toString(16).padStart(2, "0");
	return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}
function photonEnergy(nm) {
	return 1240 / nm;
}
function pce(voc, jsc, ff) {
	return voc * jsc * ff / 100;
}
/** J = Jsc * (1 - (V/Voc)^n), n chosen so the fill factor matches. */
function exponentForFill(ff) {
	const target = Math.min(.92, Math.max(.3, ff));
	let lo = .35;
	let hi = 48;
	for (let i = 0; i < 28; i++) {
		const n = (lo + hi) / 2;
		if ((1 / (n + 1)) ** (1 / n) * (n / (n + 1)) < target) lo = n;
		else hi = n;
	}
	return (lo + hi) / 2;
}
function ivCurve(voc, jsc, ff, samples = 48) {
	const n = exponentForFill(ff);
	const pts = [];
	for (let i = 0; i <= samples; i++) {
		const v = voc * i / samples;
		const j = jsc * (1 - (v / voc) ** n);
		pts.push({
			v,
			j: Math.max(0, j)
		});
	}
	const x = (1 / (n + 1)) ** (1 / n);
	return {
		pts,
		vmp: x * voc,
		jmp: jsc * (1 - x ** n),
		n
	};
}
var SQ = [
	[.5, 10],
	[.7, 19],
	[.9, 27],
	[1.05, 31.5],
	[1.15, 33],
	[1.34, 33.7],
	[1.5, 31.8],
	[1.7, 28.2],
	[2, 22.5],
	[2.3, 16.5],
	[2.6, 11],
	[3, 6.5]
];
/** Illustrative single-junction detailed-balance shape. Peak fixed at 33.7%. */
function sqEfficiency(eg) {
	if (eg <= SQ[0][0]) return SQ[0][1];
	const last = SQ[SQ.length - 1];
	if (last && eg >= last[0]) return last[1];
	for (let i = 1; i < SQ.length; i++) {
		const right = SQ[i];
		const left = SQ[i - 1];
		if (!right || !left) continue;
		if (eg <= right[0]) {
			const t = (eg - left[0]) / (right[0] - left[0]);
			return left[1] + t * (right[1] - left[1]);
		}
	}
	return 33.7;
}
var ION = {
	pb: 1.19,
	i: 2.2,
	cs: 1.88,
	ma: 2.17,
	fa: 2.53
};
function tolerance(rA, rB = ION.pb, rX = ION.i) {
	return (rA + rX) / (Math.SQRT2 * (rB + rX));
}
function diffusionUm(tauNs, singleCrystal) {
	return 1e4 * Math.sqrt((singleCrystal ? .8 : .05) * tauNs * 1e-9);
}
function vocFromPlqy(plqy, vocRad = 1.32) {
	return vocRad + .02585 * Math.log(Math.min(1, Math.max(1e-8, plqy)));
}
function phaseFromTemp(tempC) {
	if (tempC >= 54) return {
		name: "Lập phương",
		en: "cubic",
		tilt: 0,
		axes: 0,
		range: "trên ≈ 54 °C"
	};
	if (tempC >= -111) return {
		name: "Tứ phương",
		en: "tetragonal",
		tilt: .34,
		axes: 1,
		range: "≈ −111 °C đến 54 °C"
	};
	return {
		name: "Trực thoi",
		en: "orthorhombic",
		tilt: .58,
		axes: 3,
		range: "dưới ≈ −111 °C"
	};
}
function egFromHalide(brPct, snPct) {
	const halide = 1.57 + (2.3 - 1.57) * (brPct / 100);
	return halide - (halide - 1.22) * (snPct / 100) * .9;
}
function egHex(eg) {
	const t = Math.min(1, Math.max(0, (eg - 1.15) / 1.7));
	if (t < .35) return mixHex("#2a2144", "#6d4bd6", t / .35);
	if (t < .7) return mixHex("#6d4bd6", "#e07a32", (t - .35) / .35);
	return mixHex("#e07a32", "#79b0ff", (t - .7) / .3);
}
function mixHex(a, b, t) {
	const pa = hexRgb(a);
	const pb = hexRgb(b);
	const h = (n) => Math.round(n).toString(16).padStart(2, "0");
	return `#${h(pa.r + (pb.r - pa.r) * t)}${h(pa.g + (pb.g - pa.g) * t)}${h(pa.b + (pb.b - pa.b) * t)}`;
}
function hexRgb(hex) {
	const n = hex.replace("#", "");
	return {
		r: parseInt(n.slice(0, 2), 16),
		g: parseInt(n.slice(2, 4), 16),
		b: parseInt(n.slice(4, 6), 16)
	};
}
var WELL_EG = {
	1: 2.43,
	2: 2.17,
	3: 2.03,
	4: 1.91,
	99: 1.52
};
var useSim = create((set, get) => ({
	lessonId: "intro",
	step: 0,
	playing: false,
	explain: true,
	autoRotate: true,
	replay: 0,
	help: false,
	visited: ["intro"],
	query: "",
	wavelength: 500,
	voc: 1.19,
	jsc: 25.8,
	ff: .86,
	eg: 1.34,
	br: 0,
	sn: 0,
	cation: "MA",
	mixCs: false,
	temp: 25,
	tau: 273,
	singleCrystal: false,
	plqy: .05,
	enemy: 1,
	defense: false,
	explode: .75,
	light: false,
	nWell: 2,
	architecture: "pin",
	inspect: null,
	quiz: [
		null,
		null,
		null,
		null,
		null,
		null
	],
	locale: "vi",
	textScale: 1,
	presenting: false,
	photos: false,
	setLesson: (id) => {
		const lesson = getLesson(id);
		set((s) => ({
			lessonId: lesson.id,
			step: 0,
			playing: false,
			inspect: null,
			query: "",
			explain: lesson.id === "glossary" || lesson.id === "refs" || lesson.id === "quiz" ? true : s.explain,
			visited: s.visited.includes(lesson.id) ? s.visited : [...s.visited, lesson.id]
		}));
		const tune = lesson.tune?.[0];
		if (tune) set(tune);
	},
	setStep: (n) => {
		const lesson = getLesson(get().lessonId);
		const step = Math.max(0, Math.min(lesson.steps.length - 1, n));
		set({
			step,
			inspect: null
		});
		const tune = lesson.tune?.[step];
		if (tune) set(tune);
	},
	next: () => {
		const { lessonId, step } = get();
		if (step < getLesson(lessonId).steps.length - 1) get().setStep(step + 1);
		else {
			const nxt = nextLessonId(lessonId);
			if (nxt) get().setLesson(nxt);
			else set({ playing: false });
		}
	},
	prev: () => {
		const { lessonId, step } = get();
		if (step > 0) get().setStep(step - 1);
		else {
			const prev = prevLessonId(lessonId);
			if (!prev) return;
			const lesson = getLesson(prev);
			get().setLesson(prev);
			get().setStep(lesson.steps.length - 1);
		}
	},
	togglePlay: () => set((s) => ({ playing: !s.playing })),
	toggleExplain: () => set((s) => ({ explain: !s.explain })),
	toggleRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),
	bumpReplay: () => set((s) => ({ replay: s.replay + 1 })),
	toggleHelp: () => set((s) => ({ help: !s.help })),
	patch: (p) => set(p),
	answerQuiz: (q, choice) => set((s) => {
		const quiz = s.quiz.slice();
		quiz[q] = choice;
		return { quiz };
	}),
	setLocale: (locale) => set({ locale }),
	setTextScale: (n) => set({ textScale: Math.min(1.45, Math.max(.85, n)) }),
	togglePresent: () => set((s) => ({ presenting: !s.presenting })),
	togglePhotos: () => set((s) => ({ photos: !s.photos }))
}));
function RichText({ text }) {
	const [hot, setHot] = (0, import_react.useState)(null);
	const parts = text.split(/(\[\d+\])/g);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts.map((part, i) => {
		const m = /^\[(\d+)\]$/.exec(part);
		if (!m) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: hot === i + 1 ? "cited" : void 0,
			children: part
		}, i);
		const ref = REFS.find((r) => r.n === m[1]);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "cite",
			tabIndex: 0,
			onMouseEnter: () => setHot(i),
			onMouseLeave: () => setHot(null),
			onFocus: () => setHot(i),
			onBlur: () => setHot(null),
			children: [part, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cite-tip",
				role: "tooltip",
				children: ref ? ref.cite : `[${m[1]}]`
			})]
		}, i);
	}) });
}
var SPHERE = new SphereGeometry(1, 28, 18);
var OCTA = new OctahedronGeometry(1, 0);
var OCTA_EDGES = new EdgesGeometry(OCTA);
var CORNERS = [
	[
		-1,
		-1,
		-1
	],
	[
		-1,
		-1,
		1
	],
	[
		-1,
		1,
		-1
	],
	[
		-1,
		1,
		1
	],
	[
		1,
		-1,
		-1
	],
	[
		1,
		-1,
		1
	],
	[
		1,
		1,
		-1
	],
	[
		1,
		1,
		1
	]
];
var FACES = [
	[
		1,
		0,
		0
	],
	[
		-1,
		0,
		0
	],
	[
		0,
		1,
		0
	],
	[
		0,
		-1,
		0
	],
	[
		0,
		0,
		1
	],
	[
		0,
		0,
		-1
	]
];
function Tag({ position, children, accent = false }) {
	const textScale = useSim((s) => s.textScale);
	const locale = useSim((s) => s.locale);
	const shown = typeof children === "string" ? tr(locale, children) : children;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
		position,
		center: true,
		distanceFactor: 8.5 / textScale,
		zIndexRange: [30, 0],
		wrapperClass: "tag-wrap",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: accent ? "float-label accent" : "float-label",
			style: { fontSize: `${12 * textScale}px` },
			children: shown
		})
	});
}
function Pop({ children }) {
	const ref = (0, import_react.useRef)(null);
	const t = (0, import_react.useRef)(0);
	(0, import_react.useLayoutEffect)(() => {
		ref.current?.scale.setScalar(.04);
	}, []);
	useFrame((_, dt) => {
		t.current = Math.min(1, t.current + Math.min(dt, .05) * 2.2);
		const e = 1 - (1 - t.current) ** 3;
		ref.current?.scale.setScalar(Math.max(.04, e));
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		children
	});
}
function Seg({ a, b, color = "#9aa6b4", radius = .035 }) {
	const geo = (0, import_react.useMemo)(() => {
		const A = new Vector3(...a);
		const B = new Vector3(...b);
		return {
			len: Math.max(.001, A.distanceTo(B)),
			mid: A.clone().lerp(B, .5),
			q: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), B.clone().sub(A).normalize())
		};
	}, [a, b]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: geo.mid,
		quaternion: geo.q,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			radius,
			radius,
			geo.len,
			7
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			roughness: .45
		})]
	});
}
function Ion({ position, color, radius, label, accent = false, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry: SPHERE,
			scale: radius,
			onClick: onPick ? (e) => {
				e.stopPropagation();
				onPick();
			} : void 0,
			onPointerOver: onPick ? (e) => {
				e.stopPropagation();
				document.body.style.cursor = "pointer";
			} : void 0,
			onPointerOut: onPick ? () => document.body.style.cursor = "" : void 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .32,
				metalness: .22,
				emissive: color,
				emissiveIntensity: accent ? .35 : .08
			})
		}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				radius + .22,
				0
			],
			children: label
		}) : null]
	});
}
function OctaMesh({ color, scale = 1, opacity = .28 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		scale,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry: OCTA,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				transparent: true,
				opacity,
				roughness: .18,
				metalness: .05,
				side: 2,
				depthWrite: false
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
			geometry: OCTA_EDGES,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
				color,
				transparent: true,
				opacity: .85
			})
		})]
	});
}
function Molecule({ position = [
	0,
	0,
	0
], color = "#3cba84", scale = 1 }) {
	const ref = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (!ref.current) return;
		ref.current.rotation.y = clock.elapsedTime * .9;
		ref.current.rotation.z = Math.sin(clock.elapsedTime * .7) * .45;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		position,
		scale,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.16,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.14,
				18,
				14
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				roughness: .35
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.14,
				.04,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.11,
				18,
				14
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#f4efe6",
				roughness: .4
			})]
		})]
	});
}
function UnitCell({ a = "#3cba84", b = "#c5ccd6", x = "#6d4bd6", aLabel, bLabel, xLabel, organic = false, ghost = false, highlight = "none", onPick }) {
	const edges = (0, import_react.useMemo)(() => new EdgesGeometry(new BoxGeometry(2, 2, 2)), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		scale: .92,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineSegments", {
				geometry: edges,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("lineBasicMaterial", {
					color: "#d5dde6",
					transparent: true,
					opacity: ghost ? .25 : .75
				})
			}),
			CORNERS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: p,
				color: a,
				radius: highlight === "A" ? .2 : .16,
				label: i === 0 ? aLabel : void 0,
				accent: highlight === "A",
				onPick: onPick ? () => onPick("A") : void 0
			}, `a${i}`)),
			organic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Molecule, {
				position: [
					1,
					1,
					1
				],
				color: a,
				scale: .85
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: [
					0,
					0,
					0
				],
				color: b,
				radius: highlight === "B" ? .34 : .28,
				label: bLabel,
				accent: highlight === "B",
				onPick: onPick ? () => onPick("B") : void 0
			}),
			FACES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: p,
				color: x,
				radius: highlight === "X" ? .2 : .15,
				label: i === 0 ? xLabel : void 0,
				accent: highlight === "X",
				onPick: onPick ? () => onPick("X") : void 0
			}, `x${i}`)),
			FACES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
				a: [
					0,
					0,
					0
				],
				b: p,
				color: x,
				radius: .03
			}, `b${i}`))
		]
	});
}
function Slab({ position = [
	0,
	0,
	0
], size, color, opacity = 1, emissive = 0, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position,
		onClick: onClick ? (e) => {
			e.stopPropagation();
			onClick();
		} : void 0,
		onPointerOver: onClick ? (e) => {
			e.stopPropagation();
			document.body.style.cursor = "pointer";
		} : void 0,
		onPointerOut: onClick ? () => document.body.style.cursor = "" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: size }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			transparent: opacity < 1,
			opacity,
			roughness: .42,
			metalness: .12,
			emissive: color,
			emissiveIntensity: emissive
		})]
	});
}
function FlowDots({ count, color, path, speed = .35 }) {
	const ref = (0, import_react.useRef)(null);
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	useFrame(({ clock }) => {
		const mesh = ref.current;
		if (!mesh) return;
		for (let i = 0; i < count; i++) {
			const p = path((clock.elapsedTime * speed + i / count) % 1);
			dummy.position.set(p[0], p[1], p[2]);
			dummy.scale.setScalar(.07);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		}
		mesh.instanceMatrix.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("instancedMesh", {
		ref,
		args: [
			SPHERE,
			void 0,
			count
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color,
			emissive: color,
			emissiveIntensity: .45
		})
	});
}
function OriginScene({ step }) {
	const oxide = step === 0;
	const organic = step >= 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
		a: oxide ? "#f4efe6" : organic ? "#3cba84" : "#79b0ff",
		b: oxide ? "#8aa0b4" : "#c5ccd6",
		x: oxide ? "#e15b4c" : "#6d4bd6",
		aLabel: oxide ? "Ca" : organic ? "MA⁺ / FA⁺ / Cs⁺" : "A",
		bLabel: oxide ? "Ti" : "Pb",
		xLabel: oxide ? "O" : "I / Br / Cl",
		organic
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			2.15,
			0
		],
		accent: true,
		children: oxide ? "CaTiO₃ · 1839" : step === 1 ? "Perovskite halide" : "Lai hữu cơ – vô cơ"
	})] });
}
function PartsScene(_props) {
	const inspect = useSim((s) => s.inspect);
	const pick = (which) => {
		const text = which === "B" ? "B · Pb²⁺ hoặc Sn²⁺ · quyết định vùng dẫn" : which === "X" ? "X · I⁻ Br⁻ Cl⁻ · quyết định vùng hóa trị" : "A · MA⁺ FA⁺ Cs⁺ · giữ khung, đổi Eg gián tiếp";
		useSim.getState().patch({ inspect: text });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
		a: "#3cba84",
		b: "#c5ccd6",
		x: "#6d4bd6",
		aLabel: "A +1",
		bLabel: "B +2",
		xLabel: "X −1",
		highlight: inspect?.startsWith("A") ? "A" : inspect?.startsWith("B") ? "B" : inspect?.startsWith("X") ? "X" : "none",
		organic: true,
		onPick: pick
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			-1.7,
			0
		],
		children: "bấm vào ion"
	})] });
}
function BuildScene({ step }) {
	const ions = (0, import_react.useRef)(null);
	const shell = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const k = 1 - (1 - (step === 0 ? Math.min(1, clock.elapsedTime / 1.7) : 1)) ** 3;
		ions.current?.children.forEach((child, i) => {
			const p = FACES[i];
			if (!p) return;
			const far = 2.7 - 1.7 * k;
			child.position.set(p[0] * far, p[1] * far, p[2] * far);
		});
		if (shell.current) shell.current.scale.setScalar(.2 + .8 * k);
	});
	if (step >= 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
		a: "#e6c15a",
		b: "#c5ccd6",
		x: "#6d4bd6",
		aLabel: "A ×1/8",
		bLabel: "B ×1",
		xLabel: "X ×1/2",
		highlight: "A"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			2.2,
			0
		],
		accent: true,
		children: "8×1/8 + 1 + 6×1/2 = ABX₃"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				0,
				0,
				0
			],
			color: "#c5ccd6",
			radius: .28,
			label: "Pb²⁺"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: shell,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, { color: "#6d4bd6" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: ions,
			children: FACES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: p,
				color: "#6d4bd6",
				radius: .16,
				label: i === 0 ? "I⁻" : void 0
			}, i))
		}),
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pop, { children: [[-1.15, 1.15].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			position: [
				x,
				0,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: "#8a74e0",
				scale: .72,
				opacity: .2
			})
		}, x)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.7,
				0
			],
			children: "nối góc"
		})] }) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pop, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Molecule, {
			position: [
				0,
				1.15,
				0
			],
			color: "#e6c15a"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.7,
				.4
			],
			children: "A rơi vào hốc"
		})] }) : null
	] });
}
function ToleranceScene({ step }) {
	const cation = useSim((s) => s.cation);
	const mixCs = useSim((s) => s.mixCs);
	const rA = cation === "Cs" ? ION.cs : cation === "MA" ? ION.ma : ION.fa;
	const t = tolerance(mixCs ? ION.fa * .95 + ION.cs * .05 : rA);
	const danger = t < .88 || t > .98;
	const x = (t - .7) / .4 * 4 - 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				.35,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: danger ? "#e6c15a" : "#6d4bd6",
				scale: 1.15
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: [
					0,
					0,
					0
				],
				color: cation === "Cs" ? "#79b0ff" : cation === "MA" ? "#3cba84" : "#e6c15a",
				radius: .22 + (rA - 1.8) * .28,
				label: mixCs ? "FA + 5% Cs" : cation
			})]
		}),
		t < .88 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				2.1,
				.2,
				0
			],
			rotation: [
				.4,
				.2,
				.6
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
					color: "#e6c15a",
					scale: .55
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
					position: [
						.45,
						0,
						0
					],
					rotation: [
						0,
						0,
						Math.PI / 2
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
						color: "#e6c15a",
						scale: .55
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						.3,
						1.1,
						0
					],
					children: "pha delta · chung cạnh"
				})
			]
		}) : null,
		t > .98 && !mixCs ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				2.1,
				.2,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
					color: "#e6c15a",
					scale: .6
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
					position: [
						.15,
						.45,
						0
					],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
						color: "#e08a55",
						scale: .6
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						.2,
						1.25,
						0
					],
					children: "lục giác · chung mặt"
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-1.35,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				4.2,
				.08,
				.08
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1e2832" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-1.35,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2.1,
				.12,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8fd0a8" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				-1.35,
				.1
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.12,
				14,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e4a23a",
				emissive: "#e4a23a",
				emissiveIntensity: .7
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				-1.75,
				0
			],
			accent: true,
			children: [
				"t ≈ ",
				t.toFixed(2),
				" ",
				step >= 5 ? "· t chỉ là sàng lọc" : ""
			]
		})
	] });
}
function PhasesScene(_props) {
	const phase = phaseFromTemp(useSim((s) => s.temp));
	const left = (0, import_react.useRef)(null);
	const right = (0, import_react.useRef)(null);
	const ang = (0, import_react.useRef)(0);
	useFrame((_, dt) => {
		ang.current += (phase.tilt - ang.current) * (1 - Math.exp(-4 * Math.min(dt, .05)));
		if (left.current) {
			left.current.rotation.z = ang.current;
			left.current.rotation.x = phase.axes === 3 ? ang.current * .8 : 0;
		}
		if (right.current) {
			right.current.rotation.z = -ang.current;
			right.current.rotation.y = phase.axes === 3 ? ang.current : 0;
		}
	});
	const angle = 180 - phase.tilt * 180 / Math.PI;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: left,
			position: [
				-.85,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: "#6d4bd6",
				scale: .85
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: [
					0,
					0,
					0
				],
				color: "#c5ccd6",
				radius: .16
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: right,
			position: [
				.85,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: "#8a74e0",
				scale: .85
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: [
					0,
					0,
					0
				],
				color: "#c5ccd6",
				radius: .16
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				0,
				0,
				0
			],
			color: "#6d4bd6",
			radius: .14,
			label: "I"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				1.6,
				0
			],
			accent: true,
			children: [
				phase.name,
				" · Pb–I–Pb ≈ ",
				angle.toFixed(0),
				"°"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.45,
				0
			],
			children: phase.range
		})
	] });
}
function OrbitalsScene({ step }) {
	const drop = step >= 4 ? .45 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.8,
				0
			],
			size: [
				3.4,
				.28,
				1.2
			],
			color: "#c46a45"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.25,
				0
			],
			children: step === 0 ? "I 5p + Pb 6s²" : "đỉnh vùng hóa trị"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.85 - drop,
				0
			],
			size: [
				3.4,
				.28,
				1.2
			],
			color: "#4d86d6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.35 - drop,
				0
			],
			children: step >= 4 ? "Pb 6p bị spin–quỹ đạo kéo xuống" : "đáy vùng dẫn · Pb 6p"
		}),
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pop, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.05,
				.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.04,
				.04,
				1.3,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e4a23a",
				emissive: "#e4a23a",
				emissiveIntensity: .5
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.5,
				.1,
				0
			],
			children: "nhảy thẳng"
		})] }) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-1.3,
				.95 - drop,
				.4
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.1,
				14,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#79b0ff",
				emissive: "#79b0ff",
				emissiveIntensity: .7
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.3,
				1.55 - drop,
				0
			],
			children: "nhẹ, đi nhanh"
		})] }) : null,
		step >= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				1.2,
				-.45,
				.45
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.08,
				12,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8fd0a8",
				emissive: "#8fd0a8",
				emissiveIntensity: .5
			})]
		}) : null
	] });
}
function AlloyScene({ step }) {
	const br = useSim((s) => s.br);
	const sn = useSim((s) => s.sn);
	const light = useSim((s) => s.light);
	const eg = egFromHalide(br, sn);
	const hoke = light && br > 12 && br < 88;
	const color = egHex(eg);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: hoke ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-1.15,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, { color: "#6d4bd6" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
					position: [
						0,
						0,
						0
					],
					color: "#c5ccd6",
					radius: .22
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						1.35,
						0
					],
					children: "giàu I · Eg thấp"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				1.15,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, { color: "#e07a32" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
					position: [
						0,
						0,
						0
					],
					color: "#c5ccd6",
					radius: .22
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						1.35,
						0
					],
					children: "giàu Br"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.45,
				0
			],
			accent: true,
			children: "Hoke · điện tích dồn về vùng iod"
		})
	] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
			color,
			scale: 1.2
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				0,
				0,
				0
			],
			color: sn > 20 ? "#d2a36a" : "#c5ccd6",
			radius: .26,
			label: sn > 20 ? "Sn/Pb" : "B"
		}),
		step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Molecule, { position: [
			0,
			1.25,
			0
		] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				1.7,
				0
			],
			accent: true,
			children: [
				"Eg minh họa ",
				eg.toFixed(2),
				" eV"
			]
		})
	] }) });
}
function NanoScene({ step }) {
	const nWell = useSim((s) => s.nWell);
	if (step <= 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [[
		-1.1,
		0,
		1.1
	].map((x) => [-.55, .55].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			x,
			0,
			z
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				.95,
				.35,
				.85
			],
			color: "#3a2a55"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.48,
				.05,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.06,
				.4,
				.9
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e08a55",
				emissive: "#e08a55",
				emissiveIntensity: .25
			})]
		})]
	}, `${x}${z}`))), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			1.15,
			0
		],
		children: "màng đa tinh thể · ranh giới hạt"
	})] });
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [Array.from({ length: 8 }).map((_, i) => {
		const ang = i / 8 * Math.PI * 2;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				Math.cos(ang) * 1.5,
				Math.sin(i) * .25,
				Math.sin(ang) * 1.5
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: i % 2 ? "#6d4bd6" : "#e07a32",
				scale: .28
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.25,
					.2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.015,
					.015,
					.35,
					5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#8fd0a8" })]
			})]
		}, i);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			1.5,
			0
		],
		children: "chấm lượng tử + phối tử"
	})] });
	const n = nWell >= 90 ? 4 : nWell;
	const eg = WELL_EG[nWell] ?? 1.52;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		Array.from({ length: n }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.55 + i * .38,
				0
			],
			size: [
				2.2,
				.16,
				1.1
			],
			color: "#6d4bd6",
			emissive: .15
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.85,
				0
			],
			size: [
				2.5,
				.08,
				1.3
			],
			color: "#3cba84"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.55 + n * .38,
				0
			],
			size: [
				2.5,
				.08,
				1.3
			],
			color: "#3cba84"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				1.35,
				0
			],
			accent: true,
			children: [
				"n = ",
				nWell >= 90 ? "∞ (3D)" : n,
				" · Eg ",
				eg.toFixed(2),
				" eV"
			]
		})
	] });
}
var PROP_CARDS = [
	["1,48–2,3 eV", "vùng cấm"],
	["~100 nm", "độ sâu hấp thụ"],
	["15 meV", "Urbach"],
	["vài meV", "exciton"],
	["µm → 100 µm", "khuếch tán"],
	["0,6 eV", "ion iod nhảy"]
];
function PropsScene({ step }) {
	const shown = step === 0 ? 1 : step === 1 ? 3 : step === 2 ? 5 : 6;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
		a: "#e6c15a",
		b: "#c5ccd6",
		x: "#6d4bd6"
	}), PROP_CARDS.slice(0, shown).map(([value, label], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
		position: [
			Math.cos(i) * 2.1,
			.8 - i % 3 * .7,
			Math.sin(i) * 1.6
		],
		accent: i === shown - 1,
		children: [
			value,
			" · ",
			label
		]
	}) }, label))] });
}
var FOCUS_HEX = {
	A: "#e6c15a",
	B: "#c5ccd6",
	X: "#6d4bd6",
	band: "#79b0ff",
	cell: "#e4a23a",
	defect: "#e08a55",
	nano: "#e07a32"
};
function GlossaryScene({ step }) {
	const g = GLOSSARY[step] ?? GLOSSARY[0];
	const focus = g.focus;
	const hex = FOCUS_HEX[focus] ?? "#e4a23a";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [focus === "nano" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
		color: hex,
		scale: .5
	}) : focus === "defect" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
		color: "#6d4bd6",
		scale: .7
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			.85,
			.2,
			.4
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.16,
			16,
			12
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: hex,
			emissive: hex,
			emissiveIntensity: .6
		})]
	})] }) : focus === "cell" || focus === "band" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.45,
				0
			],
			size: [
				2.4,
				.25,
				.8
			],
			color: "#c46a45"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.55,
				0
			],
			size: [
				2.4,
				.25,
				.8
			],
			color: focus === "band" ? hex : "#4d86d6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.7,
				.05,
				0
			],
			accent: true,
			children: "Eg"
		})
	] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
		a: focus === "A" ? hex : "#3cba84",
		b: focus === "B" ? hex : "#c5ccd6",
		x: focus === "X" ? hex : "#6d4bd6",
		highlight: focus === "A" || focus === "B" || focus === "X" ? focus : "none",
		aLabel: focus === "A" ? g.en : void 0,
		bLabel: focus === "B" ? g.en : void 0,
		xLabel: focus === "X" ? g.en : void 0
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			2.05,
			0
		],
		accent: true,
		children: g.en
	})] });
}
var crystalScenes = {
	origin: OriginScene,
	parts: PartsScene,
	build: BuildScene,
	tolerance: ToleranceScene,
	phases: PhasesScene,
	orbitals: OrbitalsScene,
	alloy: AlloyScene,
	nano: NanoScene,
	props: PropsScene,
	glossary: GlossaryScene
};
function PlotFrame({ x0, x1, y0, y1, w = 6.2, h = 3.4, xLabel, yLabel, children }) {
	const map = (x, y) => [
		((x - x0) / (x1 - x0) - .5) * w,
		(y - y0) / (y1 - y0) * h - h * .35,
		0
	];
	const origin = map(x0, y0);
	const xEnd = map(x1, y0);
	const yEnd = map(x0, y1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
			a: origin,
			b: xEnd,
			color: "#93a0ac",
			radius: .018
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
			a: origin,
			b: yEnd,
			color: "#93a0ac",
			radius: .018
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				xEnd[0],
				xEnd[1] - .28,
				0
			],
			children: xLabel
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				yEnd[0] - .15,
				yEnd[1] + .28,
				0
			],
			children: yLabel
		}),
		children(map)
	] });
}
function Polyline({ pts, color, radius = .03 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: pts.slice(1).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seg, {
		a: pts[i],
		b: p,
		color,
		radius
	}, i)) });
}
function SunScene({ step }) {
	const ref = (0, import_react.useRef)(null);
	useFrame((_, dt) => {
		if (ref.current) ref.current.rotation.y += Math.min(dt, .05) * .15;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					1.5,
					-1.2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.72,
					32,
					24
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e4a23a",
					emissive: "#e4a23a",
					emissiveIntensity: .85
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					2.45,
					-1.2
				],
				accent: true,
				children: "≈ 1000 W/m²"
			}),
			Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-1.5 + i * .5,
					.55,
					-.2
				],
				rotation: [
					.2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.02,
					.02,
					1.3,
					6
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e4a23a",
					emissive: "#e4a23a",
					emissiveIntensity: .4
				})]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					-.55,
					.4
				],
				size: [
					2.4,
					.08,
					1.4
				],
				color: "#241c33",
				emissive: .15
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					-.68,
					.4
				],
				size: [
					2.6,
					.12,
					1.55
				],
				color: "#9eb4c6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					-.95,
					.4
				],
				children: "Pin mặt trời"
			}),
			step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					2.1,
					.2,
					.2
				],
				children: "Không máy · không nhiên liệu"
			}) }) : null,
			step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					-2.3,
					.3,
					.6
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
						position: [
							0,
							.55,
							0
						],
						size: [
							1.1,
							.35,
							.08
						],
						color: "#1e2832"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						position: [
							0,
							.55,
							.2
						],
						children: "Kiến thức nền"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
						position: [
							0,
							0,
							0
						],
						size: [
							1.1,
							.35,
							.08
						],
						color: "#3a2a22"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						position: [
							0,
							0,
							.2
						],
						children: "Lưu ý"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
						position: [
							0,
							-.55,
							0
						],
						size: [
							1.1,
							.35,
							.08
						],
						color: "#243028"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						position: [
							0,
							-.55,
							.2
						],
						children: "Từng bước"
					})
				]
			}) }) : null
		]
	});
}
function FoundationScene({ step }) {
	const electrons = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (electrons.current) electrons.current.rotation.y = clock.elapsedTime * .8;
	});
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.38,
			28,
			20
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#e08a55",
			emissive: "#e08a55",
			emissiveIntensity: .25
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: electrons,
			children: [
				.9,
				1.25,
				1.6
			].map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				rotation: [
					.4 * i,
					i,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
					r,
					.012,
					8,
					48
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#79b0ff",
					transparent: true,
					opacity: .45
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						r,
						0,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.08,
						16,
						12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#79b0ff",
						emissive: "#79b0ff",
						emissiveIntensity: .6
					})]
				})]
			}, r))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				2.1,
				0
			],
			children: "Nguyên tử"
		})
	] });
	if (step === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			-1.4,
			0,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				0,
				0,
				0
			],
			color: "#c5ccd6",
			radius: .38,
			label: "Pb²⁺ cation"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-.85,
				0
			],
			children: "mất 2 điện tử"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			1.4,
			0,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				0,
				0,
				0
			],
			color: "#6d4bd6",
			radius: .42,
			label: "I⁻ anion"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-.9,
				0
			],
			children: "nhận 1 điện tử"
		})]
	})] });
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				0,
				0,
				Math.PI / 2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.08,
				.08,
				4.2,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#d7dde6",
				metalness: .6,
				roughness: .3
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 8,
			color: "#79b0ff",
			speed: .28,
			path: (t) => [
				-2.1 + t * 4.2,
				.22,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				.8,
				0
			],
			children: "Dòng điện = hạt mang điện có hướng"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				-1.5,
				0,
				0
			],
			size: [
				.12,
				1.6,
				1.1
			],
			color: "#d7dde6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				1.5,
				0,
				0
			],
			size: [
				.12,
				1.6,
				1.1
			],
			color: "#c46a45"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.5,
				1.15,
				0
			],
			children: "0 V"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.5,
				1.15,
				0
			],
			children: "1 V"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 1,
			color: "#79b0ff",
			speed: .22,
			path: (t) => [
				-1.3 + t * 2.6,
				0,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.15,
				0
			],
			accent: true,
			children: "1 eV"
		})
	] });
}
function PhotonScene({ step }) {
	const nm = useSim((s) => s.wavelength);
	const color = wavelengthHex(nm);
	const e = photonEnergy(nm);
	const bars = (0, import_react.useMemo)(() => Array.from({ length: 28 }, (_, i) => {
		const w = 320 + i / 27 * 880;
		return {
			w,
			c: wavelengthHex(w),
			x: -3.2 + i / 27 * 6.4
		};
	}), []);
	const x = -3.2 + (nm - 320) / 880 * 6.4;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		bars.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				b.x,
				-.7,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.2,
				.7 + (b.w < 780 && b.w > 400 ? .8 : .25),
				.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: b.c,
				emissive: b.c,
				emissiveIntensity: .35
			})]
		}, b.w)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-3.2,
				-1.45,
				0
			],
			children: "UV"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.45,
				0
			],
			children: "nhìn thấy"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				3.1,
				-1.45,
				0
			],
			children: "IR"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.85,
				.4
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.28,
				24,
				18
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color,
				emissive: color,
				emissiveIntensity: .9
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				x,
				1.45,
				.4
			],
			accent: true,
			children: [
				nm.toFixed(0),
				" nm · ",
				e.toFixed(2),
				" eV"
			]
		}),
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				2.05,
				0
			],
			children: "Gần nửa năng lượng nằm ở hồng ngoại"
		}) }) : null
	] });
}
function BandBuilding({ gap, label, position = [
	0,
	0,
	0
], jump = false }) {
	const e = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (!e.current || !jump) return;
		const t = (Math.sin(clock.elapsedTime * 1.4) + 1) / 2;
		e.current.position.y = .15 + t * (.55 + gap);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					0,
					0
				],
				size: [
					2.2,
					.35,
					1.15
				],
				color: "#c46a45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					-.2,
					-.45,
					.7
				],
				children: "hóa trị"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					.7 + gap,
					0
				],
				size: [
					2.2,
					.35,
					1.15
				],
				color: "#4d86d6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					-.15,
					1.15 + gap,
					.7
				],
				children: "dẫn"
			}),
			Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.8 + i * .4,
					.02,
					.15
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.08,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#79b0ff",
					emissive: "#79b0ff",
					emissiveIntensity: .4
				})]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: e,
				position: [
					.7,
					.15,
					.35
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.1,
					14,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e4a23a",
					emissive: "#e4a23a",
					emissiveIntensity: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					1.55,
					.4 + gap / 2,
					0
				],
				accent: true,
				children: label
			})
		]
	});
}
function BandsScene({ step }) {
	if (step >= 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandBuilding, {
			gap: .02,
			label: "kim loại",
			position: [
				-2.4,
				-.2,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandBuilding, {
			gap: .7,
			label: "bán dẫn",
			position: [
				.3,
				-.2,
				0
			],
			jump: true
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandBuilding, {
			gap: 1.7,
			label: "cách điện",
			position: [
				3.1,
				-.2,
				0
			]
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandBuilding, {
			gap: .85,
			label: step >= 3 ? "Eg" : " ",
			jump: step >= 3
		}),
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.7,
				-.7,
				0
			],
			children: "chật, không dẫn"
		}) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.7,
				1.7,
				0
			],
			children: "trống, dẫn được"
		}) : null
	] });
}
function CellScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-1.15,
				0
			],
			size: [
				2.3,
				.14,
				1.35
			],
			color: "#d5e2ea"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.45,
				-1.15,
				0
			],
			children: "ITO"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.9,
				0
			],
			size: [
				2.2,
				.22,
				1.25
			],
			color: "#c46a45"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.45,
				-.9,
				0
			],
			children: "HTL"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.25,
				0
			],
			size: [
				2.1,
				.85,
				1.15
			],
			color: "#2a2140",
			emissive: .18
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.55,
				-.25,
				0
			],
			children: "hấp thụ"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.42,
				0
			],
			size: [
				2.2,
				.2,
				1.25
			],
			color: "#4d86d6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.45,
				.42,
				0
			],
			children: "ETL"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.68,
				0
			],
			size: [
				2.3,
				.12,
				1.35
			],
			color: "#e0b15a"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.5,
				.68,
				0
			],
			children: "kim loại"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 5,
			color: "#e4a23a",
			speed: step === 0 ? .22 : .12,
			path: (t) => {
				const y = -1.8 + t * 2.5;
				const pass = t > .55 && Math.floor(t * 20) % 2 === 0 && step === 0;
				return [
					pass ? .35 : -.25,
					Math.min(y, step === 0 && !pass ? -.1 : y),
					.2
				];
			}
		}),
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-2.6,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						0,
						-.45,
						0
					],
					size: [
						1.3,
						.22,
						.2
					],
					color: "#c46a45"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						0,
						.55,
						0
					],
					size: [
						1.3,
						.22,
						.2
					],
					color: "#4d86d6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
					count: 1,
					color: "#79b0ff",
					speed: .3,
					path: (t) => [
						.2,
						-.3 + t * .8,
						.2
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						1.05,
						0
					],
					children: "e⁻ lên vùng dẫn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						-.85,
						0
					],
					children: "lỗ trống ở lại"
				})
			]
		}) }) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pop, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
				count: 3,
				color: "#79b0ff",
				speed: .25,
				path: (t) => [
					.15,
					-.2 + t * .85,
					.35
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
				count: 3,
				color: "#e08a55",
				speed: .25,
				path: (t) => [
					-.15,
					-.15 - t * .7,
					.35
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.2,
					.5
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.08,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#f4efe6",
					transparent: true,
					opacity: .35
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1.15,
					0
				],
				children: "tách trước khi tái hợp"
			})
		] }) : null,
		step >= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pop, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					2.3,
					-.2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.28,
					20,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#e4a23a",
					emissive: "#e4a23a",
					emissiveIntensity: 1.1
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					2.3,
					.35,
					0
				],
				children: "mạch ngoài"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
				count: 4,
				color: "#79b0ff",
				speed: .2,
				path: (t) => [
					1.15 + Math.sin(t * Math.PI) * 1.15,
					.68 - t * 1.83,
					.8
				]
			})
		] }) : null
	] });
}
function MetricsScene(_props) {
	const voc = useSim((s) => s.voc);
	const jsc = useSim((s) => s.jsc);
	const ff = useSim((s) => s.ff);
	const curve = (0, import_react.useMemo)(() => ivCurve(voc, jsc, ff, 28), [
		voc,
		jsc,
		ff
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotFrame, {
		x0: 0,
		x1: 1.35,
		y0: 0,
		y1: 30,
		xLabel: "V (Voc)",
		yLabel: "mA/cm²",
		children: (map) => {
			const pts = curve.pts.map((p) => map(p.v, p.j));
			const a = map(0, 0);
			const b = map(curve.vmp, 0);
			const c = map(curve.vmp, curve.jmp);
			const d = map(0, curve.jmp);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
					pts,
					color: "#e4a23a",
					radius: .035
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
					pts: [
						a,
						b,
						c,
						d,
						a
					],
					color: "#8fd0a8",
					radius: .02
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
					position: map(voc, 1.2),
					accent: true,
					children: [
						"Voc ",
						voc.toFixed(2),
						" V"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: map(.08, jsc),
					children: jsc.toFixed(1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
					position: map(curve.vmp, curve.jmp + 1.5),
					children: ["FF ", ff.toFixed(2)]
				})
			] });
		}
	});
}
function SqScene(_props) {
	const eg = useSim((s) => s.eg);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotFrame, {
		x0: .5,
		x1: 3,
		y0: 0,
		y1: 40,
		xLabel: "Eg (eV)",
		yLabel: "%",
		children: (map) => {
			const line = [];
			for (let i = 0; i <= 32; i++) {
				const x = .5 + i / 32 * 2.5;
				line.push(map(x, sqEfficiency(x)));
			}
			const y = sqEfficiency(eg);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
					pts: line,
					color: "#79b0ff"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SegMark, {
					at: map(1.34, 33.7),
					label: "33,7%"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: map(eg, y),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.12,
						16,
						12
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#e4a23a",
						emissive: "#e4a23a",
						emissiveIntensity: .8
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
					position: map(eg, y + 3),
					accent: true,
					children: [
						eg.toFixed(2),
						" eV · ~",
						y.toFixed(1),
						"%"
					]
				})
			] });
		}
	});
}
function SegMark({ at, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: at,
		children: label
	});
}
function SiliconScene({ step }) {
	const wobble = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (wobble.current) wobble.current.rotation.z = Math.sin(clock.elapsedTime * 6) * .08;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-1.5,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						0,
						0,
						0
					],
					size: [
						1.5,
						1.7,
						1.1
					],
					color: "#b7c3ce"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						1.15,
						0
					],
					children: "Si · 150–180 µm"
				}),
				step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
					ref: wobble,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
						position: [
							0,
							-1.2,
							0
						],
						children: "cần dao động mạng"
					})
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				1.5,
				-.7,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					0,
					0
				],
				size: [
					1.5,
					.06,
					1.1
				],
				color: "#3a2a55",
				emissive: .2
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					.4,
					0
				],
				children: "perovskite · 0,5 µm"
			})]
		}),
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				1.45,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						-.8,
						0,
						0
					],
					size: [
						1.1,
						.45,
						.4
					],
					color: "#e08a55",
					emissive: .45
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						-.8,
						.55,
						0
					],
					children: "1400 °C"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						.9,
						0,
						0
					],
					size: [
						1.1,
						.45,
						.4
					],
					color: "#e4a23a",
					emissive: .2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						.9,
						.55,
						0
					],
					children: "150 °C"
				})
			]
		}) }) : null,
		step >= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				1.5,
				.15,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					.28,
					0
				],
				size: [
					1.5,
					.08,
					1.1
				],
				color: "#6d4bd6"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					.7,
					0
				],
				children: "lớp trên cho tandem"
			})]
		}) }) : null
	] });
}
var CHECKS = [
	"Eg hợp",
	"Hấp thụ mạnh",
	"Đi xa",
	"Ít bẫy",
	"Rẻ",
	"Bền, không độc"
];
function IdealScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
		a: "#e6c15a",
		b: "#c5ccd6",
		x: "#6d4bd6",
		bLabel: "ABX₃"
	}), CHECKS.map((label, i) => {
		const ok = i < 5 ? step >= 1 : false;
		if (!(step === 0 || i < 5 || step >= 2 || step >= 1)) return null;
		const ang = i / CHECKS.length * Math.PI * 2;
		const x = Math.cos(ang) * 2.3;
		const z = Math.sin(ang) * 2.3;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				x,
				-.4,
				z
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						0,
						.3,
						0
					],
					size: [
						.9,
						.42,
						.12
					],
					color: i === 5 ? "#e08a55" : ok || step === 0 ? step === 0 ? "#1e2832" : "#8fd0a8" : "#1e2832",
					emissive: i === 5 ? .25 : 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						.85,
						0
					],
					children: i === 5 ? "Chưa" : step >= 1 ? "Có" : label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						-.15,
						0
					],
					children: label
				})
			]
		}, label);
	})] });
}
var earlyScenes = {
	sun: SunScene,
	foundation: FoundationScene,
	photon: PhotonScene,
	bands: BandsScene,
	cell: CellScene,
	metrics: MetricsScene,
	sq: SqScene,
	silicon: SiliconScene,
	ideal: IdealScene
};
var RACE_SINGLE = [
	[2009, 3.8],
	[2012, 10],
	[2013, 16],
	[2016, 22],
	[2019, 25.2],
	[2023, 26.1],
	[2026, 27.3]
];
var RACE_TANDEM = [
	[2016, 18],
	[2019, 26],
	[2022, 31],
	[2024, 33.5],
	[2026, 35]
];
function RaceScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotFrame, {
		x0: 2009,
		x1: 2026,
		y0: 0,
		y1: 40,
		xLabel: "năm",
		yLabel: "%",
		w: 6.4,
		children: (map) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
				pts: RACE_SINGLE.map(([x, y]) => map(x, y)),
				color: "#e08a55"
			}),
			step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
				pts: RACE_TANDEM.map(([x, y]) => map(x, y)),
				color: "#79b0ff"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
				pts: [map(2009, 33.7), map(2026, 33.7)],
				color: "#8fd0a8",
				radius: .015
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: map(2012, 36),
				children: "SQ 33,7%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: map(2018, 3.8),
				children: step === 0 ? "3,8% · 2009" : "một lớp"
			}),
			step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: map(2024, 35),
				children: "tandem 35%"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: map(2026, 27.3),
				accent: true,
				children: "27,3%"
			})
		] })
	});
}
function AbsorbScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				2.2,
				1.5,
				1.2
			],
			color: "#2a2140",
			opacity: .85
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.6,
				.8,
				0
			],
			children: "500 nm"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 3,
			color: "#79b0ff",
			speed: .35,
			path: (t) => [
				-.5,
				1.3 - t * 1.1,
				.3
			]
		}),
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 3,
			color: "#e08a55",
			speed: .28,
			path: (t) => [
				.15,
				1.3 - t * 2.2,
				.2
			]
		}) : null,
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 2,
			color: "#7a3030",
			speed: .22,
			path: (t) => [
				.7,
				1.4 - t * 2.8,
				.1
			]
		}) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				2.4,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						0,
						-.4,
						0
					],
					size: [
						.7,
						.9,
						.15
					],
					color: "#1e2832"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						0,
						.15,
						0
					],
					size: [
						.7,
						.08,
						.2
					],
					color: "#e4a23a",
					emissive: .6
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						.85,
						0
					],
					children: "bờ Urbach dốc"
				})
			]
		}) }) : null
	] });
}
function Walkers({ span }) {
	const ref = (0, import_react.useRef)(null);
	const dummy = (0, import_react.useMemo)(() => new Object3D(), []);
	const pos = (0, import_react.useMemo)(() => Array.from({ length: 28 }, () => new Vector3((Math.random() - .5) * span, (Math.random() - .5) * .3, (Math.random() - .5) * .6)), [span]);
	useFrame((_, dt) => {
		const mesh = ref.current;
		if (!mesh) return;
		const hop = Math.sqrt(Math.min(dt, .05)) * .22;
		pos.forEach((p, i) => {
			p.x = MathUtils.clamp(p.x + (Math.random() - .5) * hop, -span / 2, span / 2);
			p.y = MathUtils.clamp(p.y + (Math.random() - .5) * hop, -.2, .2);
			p.z = MathUtils.clamp(p.z + (Math.random() - .5) * hop, -.35, .35);
			dummy.position.copy(p);
			dummy.scale.setScalar(.05);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		mesh.instanceMatrix.needsUpdate = true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref,
		args: [
			void 0,
			void 0,
			pos.length
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			10,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#79b0ff",
			emissive: "#79b0ff",
			emissiveIntensity: .5
		})]
	});
}
function DiffusionScene({ step }) {
	const L = diffusionUm(useSim((s) => s.tau), useSim((s) => s.singleCrystal));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.6,
				.5,
				.9
			],
			color: "#3a2a55",
			opacity: .9
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-.7,
				0
			],
			children: "màng 0,5 µm"
		}),
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			Math.min(2.6, Math.max(.2, L)),
			28,
			18
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#e4a23a",
			wireframe: true,
			transparent: true,
			opacity: .45
		})] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Walkers, { span: 1.4 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				1.7,
				0
			],
			accent: true,
			children: [
				"L ≈ ",
				L < 10 ? L.toFixed(2) : L.toFixed(0),
				" µm"
			]
		}),
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				2.1,
				.4,
				0
			],
			children: "2013 · L hơn 1 µm"
		}) : null
	] });
}
function ExcitonScene({ step }) {
	const pair = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (!pair.current) return;
		const amp = step === 0 || step >= 2 ? .18 : .85 + Math.sin(clock.elapsedTime * 2) * .15;
		pair.current.children[0]?.position.set(-amp, 0, 0);
		pair.current.children[1]?.position.set(amp, 0, 0);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: pair,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: [
					-.2,
					0,
					0
				],
				color: "#79b0ff",
				radius: .18,
				label: "e⁻"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
				position: [
					.2,
					0,
					0
				],
				color: "#e08a55",
				radius: .18,
				label: "h⁺"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.3,
				0
			],
			accent: true,
			children: step === 0 ? "exciton" : step === 1 ? "kT ≈ 26 meV thắng vài meV" : "hữu cơ: hàng trăm meV"
		}),
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				-1.2,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						-.6,
						0,
						0
					],
					size: [
						.7,
						.35,
						.5
					],
					color: "#4d86d6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						.6,
						0,
						0
					],
					size: [
						.7,
						.35,
						.5
					],
					color: "#c46a45"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						.55,
						0
					],
					children: "bulk heterojunction"
				})
			]
		}) }) : null
	] });
}
function DefectsScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
			a: "#3cba84",
			b: "#c5ccd6",
			x: "#6d4bd6",
			ghost: step === 0
		}),
		step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					-1.6,
					1.4,
					0
				],
				children: "chỗ trống"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1.6,
					0
				],
				children: "chen khe"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					1.6,
					1.4,
					0
				],
				children: "sai chỗ"
			})
		] }) : null,
		step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.15,
				1.1
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.12,
				14,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e08a55",
				emissive: "#e08a55",
				emissiveIntensity: .8
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				.7,
				1.2
			],
			accent: true,
			children: "bẫy sâu nuốt điện tử"
		})] }) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.9,
				.85,
				.9
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.1,
				14,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#8fd0a8",
				emissive: "#8fd0a8",
				emissiveIntensity: .7
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				.2,
				1.45,
				0
			],
			children: "bẫy nông · nhiệt thả ra"
		})] }) : null,
		step >= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pop, { children: [[
			-.8,
			0,
			.8
		].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				1.05,
				.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.08,
				12,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e6c15a" })]
		}, x)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.6,
				0
			],
			children: "thụ động hóa bề mặt"
		})] }) : null
	] });
}
function TuneScene(_props) {
	const eg = useSim((s) => s.eg);
	const color = egHex(eg);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
			color,
			scale: 1.25
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				0,
				0,
				0
			],
			color: "#c5ccd6",
			radius: .24
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				1.7,
				0
			],
			accent: true,
			children: [
				"Eg ",
				eg.toFixed(2),
				" eV"
			]
		}),
		[
			{
				eg: 1.25,
				label: "đáy tandem"
			},
			{
				eg: 1.53,
				label: "một lớp"
			},
			{
				eg: 1.7,
				label: "nóctandem"
			},
			{
				eg: 2.3,
				label: "LED / Br"
			}
		].map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.8 + i * 1.2,
				-1.4,
				0
			],
			accent: Math.abs(eg - u.eg) < .12,
			children: u.label
		}, u.label))
	] });
}
function InkScene({ step }) {
	const drop = (0, import_react.useRef)(null);
	const film = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const t = clock.elapsedTime % 3 / 3;
		if (drop.current) drop.current.position.y = 1.3 - t * 1.1;
		if (film.current) {
			const mat = film.current.material;
			const k = Math.min(1, Math.max(0, (t - .55) / .4));
			mat.color.set(k > .4 ? "#2a2140" : "#e6c15a");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-1.6,
				.55,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.38,
				.32,
				.7,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#9ec9ea",
				transparent: true,
				opacity: .45
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: drop,
			position: [
				-.2,
				1.1,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.1,
				14,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e6c15a" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: film,
			position: [
				.4,
				-.35,
				0
			],
			rotation: [
				-.4,
				.2,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.4,
				.06,
				1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e6c15a" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				.4,
				.15,
				0
			],
			children: step === 0 ? "mực 100–150 °C" : step === 1 ? "lò silicon" : "kính · nhựa · silicon"
		}),
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pop, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				2,
				.2,
				0
			],
			size: [
				.9,
				.9,
				.9
			],
			color: "#e08a55",
			emissive: .55
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				2,
				1,
				0
			],
			children: "1400 °C"
		})] }) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pop, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				0,
				-1.3,
				.4
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						-1,
						0,
						0
					],
					size: [
						.7,
						.08,
						.5
					],
					color: "#d5e2ea"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						.05,
						0
					],
					rotation: [
						0,
						0,
						.4
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.7,
						.04,
						.5
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3cba84" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						1,
						0,
						0
					],
					size: [
						.7,
						.2,
						.5
					],
					color: "#b7c3ce"
				})
			]
		}) }) : null
	] });
}
function PlqyScene(_props) {
	const plqy = useSim((s) => s.plqy);
	const voc = vocFromPlqy(plqy);
	const glow = Math.min(1.4, .15 + Math.sqrt(plqy) * 1.3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.8,
				.22,
				1.2
			],
			color: "#2a2140"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.35,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.34,
				22,
				16
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e4a23a",
				emissive: "#e4a23a",
				emissiveIntensity: glow,
				transparent: true,
				opacity: .85
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				1.15,
				0
			],
			accent: true,
			children: [
				"Voc ≈ ",
				voc.toFixed(3),
				" V"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				-.7,
				0
			],
			children: [
				"PLQY ",
				(plqy * 100).toFixed(plqy < .01 ? 3 : 2),
				"%"
			]
		})
	] });
}
var TECHS = [
	{
		name: "Silicon",
		h: 2.75,
		color: "#b7c3ce",
		pce: "27–28%",
		thick: "150–180 µm",
		heat: ">1400 °C"
	},
	{
		name: "CdTe",
		h: 2.3,
		color: "#3cba84",
		pce: "~23%",
		thick: "vài µm",
		heat: "500–600 °C"
	},
	{
		name: "OPV",
		h: 2,
		color: "#79b0ff",
		pce: "~20%",
		thick: "~0,1 µm",
		heat: "<150 °C"
	},
	{
		name: "Perovskite",
		h: 2.73,
		color: "#6d4bd6",
		pce: "27,3%",
		thick: "~0,5 µm",
		heat: "100–150 °C"
	}
];
function CompareScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-2.7,
				-1.15,
				0
			],
			children: "0%"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-2.7,
				1.7,
				0
			],
			children: "hiệu suất"
		}),
		TECHS.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-2.1 + i * 1.45,
				-1.15,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						0,
						t.h / 2,
						0
					],
					size: [
						.9,
						t.h,
						.7
					],
					color: t.color,
					emissive: i === 3 ? .25 : .04
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						t.h + .28,
						0
					],
					children: t.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						t.h + .62,
						0
					],
					accent: true,
					children: t.pce
				}),
				step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						-.28,
						.2
					],
					children: t.thick
				}) : null,
				step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						-.58,
						.2
					],
					children: t.heat
				}) : null
			]
		}, t.name)),
		step >= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				2.2,
				1.55,
				0
			],
			children: "bền: Si, CdTe đã có 25 năm"
		}) : null
	] });
}
function EnemiesScene({ step }) {
	const enemy = useSim((s) => s.enemy);
	const defense = useSim((s) => s.defense);
	const which = step >= 5 ? enemy : step + 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		[
			-.7,
			.15,
			.95
		].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				x,
				0,
				0
			],
			size: [
				.7,
				.45,
				.8
			],
			color: which === 1 && !defense ? "#e6c15a" : "#3a2a55"
		}, x)),
		which === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 6,
			color: "#79b0ff",
			speed: defense ? .05 : .3,
			path: (t) => [
				-1.4 + t * (defense ? .4 : 2.6),
				.7 - t * .5,
				.4
			]
		}) : null,
		which === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Molecule, {
			position: [
				0,
				.8,
				.4
			],
			color: "#e15b4c",
			scale: .7
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.3,
				0
			],
			children: "O₂ + ánh sáng"
		})] }) : null,
		which === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Molecule, {
			position: [
				0,
				defense ? .45 : 1.1,
				0
			],
			color: "#3cba84"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.45,
				0
			],
			children: defense ? "FA/Cs ở lại" : "MA bay hơi"
		})] }) : null,
		which === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					-.55,
					0
				],
				size: [
					2.4,
					.12,
					1
				],
				color: "#d7dde6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					-.9,
					0
				],
				children: "TiO₂ + UV"
			}),
			!defense ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					.85,
					0
				],
				accent: true,
				children: "bẫy sâu"
			}) : null
		] }) : null,
		which === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 5,
			color: "#6d4bd6",
			speed: defense ? .04 : .25,
			path: (t) => [
				-.8 + t * (defense ? .3 : 1.8),
				.15,
				.45
			]
		}) : null,
		defense ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1.7,
			24,
			16
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#9ec9ea",
			wireframe: true,
			transparent: true,
			opacity: .35
		})] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				-1.45,
				0
			],
			children: [
				"kẻ thù ",
				which,
				"/5 ",
				defense ? "· có phòng thủ" : ""
			]
		})
	] });
}
function NucleationScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-1.6,
				0,
				0
			],
			children: [[
				-.45,
				.05,
				.55
			].map((x) => [-.35, .25].map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					x,
					0,
					z
				],
				size: [
					.42,
					.28,
					.42
				],
				color: "#3a2a55"
			}, `${x}${z}`))), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1,
					0
				],
				accent: step === 1,
				children: "mầm cùng lúc"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				1.6,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						-.4,
						0,
						0
					],
					size: [
						.55,
						.4,
						.5
					],
					color: "#3a2a55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
					position: [
						.45,
						0,
						.2
					],
					size: [
						.3,
						.18,
						.3
					],
					color: "#5a4a78"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.05,
						.05,
						-.15
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [.16, 16] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#0b0f13" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: [
						0,
						1,
						0
					],
					accent: step === 2,
					children: "lỗ kim"
				})
			]
		}),
		step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.3,
				0
			],
			children: "tạo mầm → lớn lên"
		}) : null
	] });
}
function MethodsScene({ step }) {
	const locale = useSim((s) => s.locale);
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodCards, { step: 0 });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinTour, {}) : null,
		step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					-.25,
					0
				],
				size: [
					2.2,
					.16,
					1.3
				],
				color: "#e6c15a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					.02,
					0
				],
				size: [
					2.2,
					.18,
					1.3
				],
				color: "#2a2140"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
				count: 8,
				color: "#3cba84",
				speed: .4,
				path: (t) => [
					-.9 + t * 1.8,
					1.1 - t * .9,
					.2
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1.35,
					0
				],
				accent: true,
				children: "MAI/FAI đi vào · vàng → đen"
			})
		] }) : null,
		step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				2.4,
				1.6,
				1.5
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#79b0ff",
				wireframe: true,
				transparent: true,
				opacity: .4
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					-.55,
					0
				],
				size: [
					1.2,
					.08,
					.6
				],
				color: "#e0b15a",
				emissive: .8
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
				count: 10,
				color: "#f4efe6",
				speed: .35,
				path: (t) => [
					(t - .5) * .8,
					-.4 + t * .9,
					0
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1.25,
					0
				],
				accent: true,
				children: "nguồn nóng · hơi đi lên"
			})
		] }) : null,
		step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.7,
				.62,
				1.3,
				24
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#9ec9ea",
				transparent: true,
				opacity: .28
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: "#6d4bd6",
				scale: .55
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1.25,
					0
				],
				accent: true,
				children: "tinh thể lớn dần"
			})
		] }) : null,
		step === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			position: [
				-1.8 + i * .6,
				0,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: [
					"#6d4bd6",
					"#4d86d6",
					"#3ec4c4",
					"#3cba84",
					"#e6c15a",
					"#e07a32",
					"#e15b4c"
				][i],
				scale: .28
			})
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.15,
				0
			],
			accent: true,
			children: "nước đá · ~10 nm · 410–700 nm"
		})] }) : null,
		step === 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BladeTour, {}) : null,
		step === 7 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			[-1.5, 1.5].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					x,
					0,
					0
				],
				rotation: [
					0,
					0,
					Math.PI / 2
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.32,
					.32,
					.25,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#9aa6b4" })]
			}, x)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					0,
					0
				],
				size: [
					2.4,
					.05,
					.8
				],
				color: "#3a2a55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1.05,
					0
				],
				accent: true,
				children: "cuộn → phủ khe → sấy · 10–14%"
			})
		] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				-1.45,
				0
			],
			children: [
				tr(locale, "đang xem lối"),
				" ",
				step
			]
		})
	] });
}
function MethodCards({ step }) {
	const locale = useSim((s) => s.locale);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [[
		{
			name: "1 quay phủ",
			color: "#6d4bd6"
		},
		{
			name: "2 hai bước",
			color: "#e6c15a"
		},
		{
			name: "3 chân không",
			color: "#79b0ff"
		},
		{
			name: "4 đơn tinh thể",
			color: "#b07adf"
		},
		{
			name: "5 chấm lượng tử",
			color: "#e07a32"
		},
		{
			name: "6 dao gạt",
			color: "#8fd0a8"
		},
		{
			name: "7 phủ khe",
			color: "#e4a23a"
		}
	].map((c, i) => {
		const col = i % 4;
		const row = Math.floor(i / 4);
		const x = -2.25 + col * 1.5;
		const y = .85 - row * 1.55;
		const on = step === 0 || step === i + 1;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				x,
				y,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					0,
					0
				],
				size: [
					1.25,
					.72,
					.12
				],
				color: on ? c.color : "#1e2832",
				emissive: on ? .28 : 0
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					0,
					.2
				],
				accent: step === i + 1,
				children: c.name
			})]
		}, c.name);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			-1.55,
			0
		],
		accent: true,
		children: tr(locale, "chọn một lối — các mục sau đi từng nhịp")
	})] });
}
function SpinTour() {
	const [phase, setPhase] = (0, import_react.useState)(0);
	useFrame(({ clock }) => {
		const p = Math.floor(clock.elapsedTime % 8 / 2);
		setPhase((cur) => cur === p ? cur : p);
	});
	const labels = [
		"1 nhỏ mực",
		"2 quay ly tâm",
		"3 dung môi đối",
		"4 sấy 100–150 °C"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinRig, { phase }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			1.55,
			0
		],
		accent: true,
		children: labels[phase] ?? labels[0]
	})] });
}
function BladeTour() {
	const blade = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const t = clock.elapsedTime % 3 / 3;
		if (blade.current) blade.current.position.x = -1.2 + t * 2.4;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.4,
				0
			],
			size: [
				3.1,
				.06,
				1.15
			],
			color: "#d5e2ea"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.32,
				0
			],
			size: [
				2.8,
				.05,
				.95
			],
			color: "#6d4bd6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: blade,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					.15,
					0
				],
				size: [
					.1,
					.5,
					1.25
				],
				color: "#d7dde6"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					.25,
					.28,
					0
				],
				size: [
					.08,
					.2,
					1.25
				],
				color: "#79b0ff",
				emissive: .35
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.15,
				0
			],
			accent: true,
			children: "dao gạt · khe cố định độ dày"
		})
	] });
}
function SpinRig({ phase }) {
	const spin = (0, import_react.useRef)(null);
	const drop = (0, import_react.useRef)(null);
	const anti = (0, import_react.useRef)(null);
	const film = (0, import_react.useRef)(null);
	useFrame(({ clock }, dt) => {
		const t = clock.elapsedTime % 4 / 4;
		if (spin.current && phase >= 1 && phase <= 2) spin.current.rotation.y += dt * (phase === 1 ? 2.4 : 3.2);
		if (drop.current) drop.current.position.y = phase === 0 ? 1.15 - t % 1 * .9 : 1.3;
		if (drop.current) drop.current.visible = phase === 0;
		if (anti.current) {
			anti.current.visible = phase === 2;
			anti.current.position.y = 1.05 - (t + .2) % 1 * .85;
		}
		if (film.current) {
			const mat = film.current.material;
			if (phase === 0) mat.color.set("#e6c15a");
			else if (phase === 1) mat.color.set("#c9a24a");
			else if (phase === 2) mat.color.set(t > .45 ? "#2a2140" : "#8a6a30");
			else mat.color.set("#1a1428");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: spin,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					-.42,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					1.35,
					1.35,
					.08,
					40
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2c3946" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: film,
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					-.36,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.72,
					.72,
					.04,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e6c15a" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: drop,
				position: [
					0,
					.9,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.1,
					16,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e6c15a" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: anti,
				position: [
					.15,
					.9,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.09,
					16,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#79b0ff" })]
			}),
			phase === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					-.62,
					0
				],
				size: [
					1.8,
					.08,
					1.8
				],
				color: "#e08a55",
				emissive: .45
			}) : null
		]
	});
}
function FilmsScene({ step }) {
	if (step <= 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinRig, { phase: step }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.45,
				0
			],
			accent: true,
			children: [
				"1 nhỏ mực",
				"2 quay ly tâm",
				"3 dung môi đối",
				"4 sấy 100–150 °C"
			][step]
		}),
		step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.7,
				.2,
				0
			],
			children: "mực thừa văng ra"
		}) : null,
		step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.7,
				.2,
				0
			],
			children: "chlorobenzene · kết tinh đồng loạt"
		}) : null
	] });
	if (step === 4 || step === 5) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.35,
				0
			],
			size: [
				2.2,
				.08,
				1.4
			],
			color: "#d5e2ea"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.22,
				0
			],
			size: [
				2.05,
				.12,
				1.25
			],
			color: "#e6c15a"
		}),
		step === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.05,
				0
			],
			size: [
				2.05,
				step === 5 ? .16 : .02,
				1.25
			],
			color: "#2a2140",
			emissive: .2
		}) : null,
		step === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 10,
			color: "#3cba84",
			speed: .35,
			path: (t) => [
				-.9 + t * 1.8,
				.95 - t * 1.05,
				.2
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.15,
				0
			],
			accent: true,
			children: step === 4 ? "PbI₂ vàng, chưa có A" : "MAI/FAI đi vào · vàng → đen"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			2.6,
			1.7,
			1.7
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#79b0ff",
			wireframe: true,
			transparent: true,
			opacity: .45
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.55,
				0
			],
			size: [
				1.5,
				.08,
				.7
			],
			color: "#e0b15a",
			emissive: .7
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.55,
				0
			],
			rotation: [
				.15,
				0,
				.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.35,
				.08,
				.9
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: step === 7 ? "#6d4bd6" : "#b7c3ce" })]
		}),
		step === 7 ? [
			-.45,
			0,
			.45
		].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.62,
				.15
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.22,
				.12,
				.18
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#9aa6b4" })]
		}, x)) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 12,
			color: "#f4efe6",
			speed: .28,
			path: (t) => [
				(t - .5) * 1.1,
				-.35 + t * .85,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.35,
				0
			],
			accent: true,
			children: step === 6 ? "nguồn nóng · hơi đi lên" : "bám theo gờ silicon"
		})
	] });
}
function GrowScene({ step }) {
	const crystal = (0, import_react.useRef)(null);
	const seeds = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (crystal.current && step === 2) {
			const s = .35 + .85 * (Math.sin(clock.elapsedTime * .7) * .5 + .5);
			crystal.current.scale.setScalar(s);
		}
		if (seeds.current && step === 1) seeds.current.rotation.y = clock.elapsedTime * .3;
	});
	if (step <= 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.05,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.78,
				.7,
				1.25,
				28
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#9ec9ea",
				transparent: true,
				opacity: .32
			})]
		}),
		step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.25,
				0
			],
			children: "lạnh · tan hết · trong"
		}) : null,
		step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: seeds,
			children: [
				[
					-.2,
					.1,
					.1
				],
				[
					.18,
					-.05,
					-.12
				],
				[
					.02,
					.22,
					.16
				]
			].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: p,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.06,
					12,
					10
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#6d4bd6",
					emissive: "#6d4bd6",
					emissiveIntensity: .4
				})]
			}, i))
		}) : null,
		step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: crystal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color: "#6d4bd6",
				scale: .85
			})
		}) : null,
		step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.7,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.9,
				.9,
				.08,
				24
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e08a55",
				emissive: "#e08a55",
				emissiveIntensity: .6
			})]
		}) : null,
		step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 4,
			color: "#f4efe6",
			speed: .4,
			path: (t) => [
				-1.4 + t * .8,
				.4,
				0
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.3,
				.2,
				0
			],
			children: "đầu dò tia X"
		})] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.35,
				0
			],
			accent: true,
			children: [
				"độ tan cao khi lạnh",
				"đun · quá bão hòa",
				"tinh thể lớn dần",
				"đo và đầu dò"
			][step]
		})
	] });
	if (step === 4 || step === 5) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.85,
				28,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e08a55",
				transparent: true,
				opacity: .28
			})]
		}),
		step === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 8,
			color: "#79b0ff",
			speed: .5,
			path: (t) => [
				1.3 - t * 1.1,
				1.1 - t * .9,
				0
			]
		}) : null,
		step === 5 ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				i % 4 * .22 - .33,
				Math.floor(i / 4) * .22 - .1,
				.2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.05,
				10,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#e6c15a" })]
		}, i)) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.35,
				0
			],
			accent: true,
			children: step === 4 ? "140–200 °C · phối tử" : "chích Cs · LaMer"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [Array.from({ length: 7 }).map((_, i) => {
		const nm = 410 + i * 48;
		const color = [
			"#6d4bd6",
			"#4d86d6",
			"#3ec4c4",
			"#3cba84",
			"#e6c15a",
			"#e07a32",
			"#e15b4c"
		][i];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				-2.1 + i * .7,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
				color,
				scale: .32
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					.75,
					0
				],
				children: nm
			})]
		}, nm);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			-1.15,
			0
		],
		accent: true,
		children: "nước đá · ~10 nm · 410–700 nm"
	})] });
}
function ScaleScene({ step }) {
	const blade = (0, import_react.useRef)(null);
	const web = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const t = clock.elapsedTime % 3 / 3;
		if (blade.current && (step === 1 || step === 2)) blade.current.position.x = -1.3 + t * 2.6;
		if (web.current && step === 4) web.current.position.x = clock.elapsedTime * .35 % 1.2 - .6;
	});
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				-1.5,
				0,
				0
			],
			size: [
				.7,
				.08,
				.5
			],
			color: "#3a2a55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.5,
				.55,
				0
			],
			children: "0,05–1 cm²"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				.9,
				0,
				0
			],
			size: [
				2.3,
				.08,
				1.35
			],
			color: "#3a2a55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				1.45,
				.1,
				.25
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.08,
				12,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#e08a55",
				emissive: "#e08a55",
				emissiveIntensity: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				.9,
				.75,
				0
			],
			children: "một lỗ kim có thể chập cả tấm"
		})
	] });
	if (step === 1 || step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.45,
				0
			],
			size: [
				3.3,
				.06,
				1.25
			],
			color: "#d5e2ea"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.36,
				0
			],
			size: [
				3.1,
				.05,
				1.05
			],
			color: step === 2 ? "#2a2140" : "#6d4bd6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: blade,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					.05,
					0
				],
				size: [
					.12,
					.55,
					1.35
				],
				color: "#d7dde6"
			}), step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					.28,
					.2,
					0
				],
				size: [
					.08,
					.22,
					1.35
				],
				color: "#79b0ff",
				emissive: .3
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.05,
				0
			],
			accent: true,
			children: step === 1 ? "dao gạt · khe cố định độ dày" : "dao khí N₂ khô tức thì"
		})
	] });
	if (step === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.4,
				0
			],
			size: [
				3.1,
				.06,
				1.1
			],
			color: "#1a1428"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.35,
				0
			],
			size: [
				.7,
				.28,
				1.15
			],
			color: "#d7dde6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				-.05,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.18,
				.55,
				.9
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#6d4bd6",
				transparent: true,
				opacity: .85
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.5,
				.35,
				0
			],
			children: "đầu phủ đứng yên"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.4,
				-.75,
				0
			],
			children: "đế chạy →"
		})
	] });
	if (step === 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		[-1.6, 1.6].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				0,
				0
			],
			rotation: [
				0,
				0,
				Math.PI / 2
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
				.38,
				.38,
				.28,
				20
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#9aa6b4" })]
		}, x)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: web,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					0,
					0
				],
				size: [
					2.6,
					.05,
					.9
				],
				color: "#3a2a55"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.45,
				0
			],
			size: [
				.35,
				.2,
				1
			],
			color: "#d7dde6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.05,
				0
			],
			accent: true,
			children: "cuộn → phủ khe → sấy · 10–14%"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			2.8,
			1.6,
			1.6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#79b0ff",
			wireframe: true
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.45,
				0
			],
			size: [
				2,
				.08,
				1.1
			],
			color: "#2a2140"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 14,
			color: "#f4efe6",
			speed: .2,
			path: (t) => [
				(t - .5) * 1.8,
				.7 - t * 1.05,
				(t - .5) * .4
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.2,
				0
			],
			children: "chân không · phủ đều, kể cả mặt nhám"
		})
	] });
}
function AppsScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.8,
				.12,
				1.2
			],
			color: "#2a2140"
		}) : null,
		step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.15,
				0
			],
			size: [
				1.8,
				.25,
				1.2
			],
			color: "#b7c3ce"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.15,
				0
			],
			size: [
				1.8,
				.08,
				1.2
			],
			color: "#6d4bd6"
		})] }) : null,
		step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				.4,
				.3,
				.5
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.8,
				.04,
				.9
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#3cba84" })]
		}) : null,
		step === 3 ? [
			-.6,
			0,
			.6
		].map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.4,
				.4,
				.08
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: [
					"#e15b4c",
					"#8fd0a8",
					"#4d86d6"
				][i],
				emissive: [
					"#e15b4c",
					"#8fd0a8",
					"#4d86d6"
				][i],
				emissiveIntensity: .7
			})]
		}, x)) : null,
		step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.45,
			24,
			18
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#8fd0a8",
			emissive: "#8fd0a8",
			emissiveIntensity: 1.2
		})] }) : null,
		step === 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.4,
				.2,
				.8
			],
			color: "#1e2832",
			emissive: .3
		}) : null,
		step === 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, { color: "#e6c15a" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 2,
			color: "#f4efe6",
			speed: .4,
			path: (t) => [
				-1.4 + t * 1.5,
				.8 - t * .8,
				0
			]
		})] }) : null,
		step === 7 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					-1.1,
					.3,
					0
				],
				size: [
					.8,
					.1,
					.6
				],
				color: "#6d4bd6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.7,
					-.2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.45,
					.45,
					.7,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#79b0ff",
					transparent: true,
					opacity: .35
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
				count: 4,
				color: "#f4efe6",
				speed: .2,
				path: (t) => [
					.7,
					-.2 + t * .6,
					0
				]
			})
		] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.35,
				0
			],
			accent: true,
			children: [
				"Pin một lớp",
				"Tandem",
				"Dẻo",
				"Màn hình",
				"PeLED",
				"Cảm biến",
				"Tia X",
				"Nhiên liệu"
			][step] ?? ""
		})
	] });
}
var MARKET = [
	["6/2024", "Oxford PV 26,9%"],
	["4/2025", "LONGi 34,85%"],
	["7/2025", "Caelux"],
	["2026", "NREL 27,3 / 35"],
	["7/2026", "35,5% chưa NREL"],
	["2035", "dự báo"]
];
function MarketScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			-.8,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			6.2,
			.04,
			.04
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#93a0ac" })]
	}), MARKET.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			-2.6 + i * 1.05,
			-.8,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				i === step ? .45 : .2,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				i === step ? .16 : .08,
				14,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: i === step ? "#e4a23a" : "#1e2832",
				emissive: i === step ? "#e4a23a" : "#000",
				emissiveIntensity: .6
			})]
		}), i === step ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
			position: [
				0,
				1.05,
				0
			],
			accent: true,
			children: [
				m[0],
				" · ",
				m[1]
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				.55,
				0
			],
			children: m[0]
		})]
	}, m[0]))] });
}
var BARS = [
	{
		name: "Pb",
		v: 27.3,
		color: "#6d4bd6"
	},
	{
		name: "Sn–Pb",
		v: 24,
		color: "#d2a36a"
	},
	{
		name: "Sn",
		v: 16.65,
		color: "#e6c15a"
	},
	{
		name: "Cs₂AgBiBr₆",
		v: 6.37,
		color: "#e08a55"
	}
];
function LeadScene({ step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: BARS.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			1.1 - i * .7,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					-2.2 + b.v / 20,
					0,
					0
				],
				size: [
					b.v / 10,
					.32,
					.32
				],
				color: b.color,
				emissive: step === i ? .35 : .05
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					-2.6,
					0,
					0
				],
				children: b.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
				position: [
					b.v / 10 - 1.6,
					.35,
					0
				],
				accent: step === i,
				children: [b.v, "%"]
			})
		]
	}, b.name)) });
}
function MiniStack({ nip, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		scale: active ? 1 : .82,
		children: [
			(nip ? [
				"#e0b15a",
				"#4d86d6",
				"#2a2140",
				"#c46a45",
				"#d5e2ea"
			] : [
				"#d5e2ea",
				"#c46a45",
				"#2a2140",
				"#4d86d6",
				"#e0b15a"
			]).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
				position: [
					0,
					-.8 + i * .32,
					0
				],
				size: [
					1.3,
					i === 2 ? .4 : .18,
					.8
				],
				color: c
			}, c + i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
				position: [
					0,
					1.15,
					0
				],
				children: nip ? "n-i-p" : "p-i-n"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
				count: 3,
				color: "#e4a23a",
				speed: .2,
				path: (t) => [
					0,
					nip ? 1 - t * 1.6 : -1.1 + t * 1.6,
					.5
				]
			})
		]
	});
}
function PinScene({ step }) {
	const architecture = useSim((s) => s.architecture);
	if (step >= 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				-1.4,
				.4,
				0
			],
			size: [
				1.1,
				.3,
				.5
			],
			color: "#4d86d6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				1.4,
				-.3,
				0
			],
			size: [
				1.1,
				.3,
				.5
			],
			color: "#c46a45"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.4,
				.9,
				0
			],
			children: "ETL · điện tử xuống dốc"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.4,
				.2,
				0
			],
			children: "HTL · lỗ trống"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 4,
			color: "#79b0ff",
			speed: .25,
			path: (t) => [
				.4 - t * 1.6,
				.9 - t * .5,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 4,
			color: "#e08a55",
			speed: .25,
			path: (t) => [
				-.2 + t * 1.4,
				.2 - t * .45,
				0
			]
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			-1.5,
			0,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStack, {
			nip: true,
			active: architecture === "nip" || step === 0
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			1.5,
			0,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStack, {
			nip: false,
			active: architecture === "pin" || step >= 1
		})
	})] });
}
var STACK = [
	{
		name: "Kính UV",
		color: "#9ec9ea",
		h: .18
	},
	{
		name: "ITO",
		color: "#d5e2ea",
		h: .07
	},
	{
		name: "NiOx",
		color: "#6d8f62",
		h: .1
	},
	{
		name: "SAM",
		color: "#e6c15a",
		h: .04
	},
	{
		name: "2D dưới",
		color: "#b07adf",
		h: .06
	},
	{
		name: "Lõi FA/Cs",
		color: "#3a2a55",
		h: .42
	},
	{
		name: "2D trên",
		color: "#b07adf",
		h: .06
	},
	{
		name: "C60",
		color: "#8b939e",
		h: .08
	},
	{
		name: "SnO2",
		color: "#d9d3c8",
		h: .06
	},
	{
		name: "Cu/Ag",
		color: "#e0b15a",
		h: .12
	},
	{
		name: "Kính kín",
		color: "#b7daf2",
		h: .18
	}
];
function stackFocus(step) {
	if (step <= 0) return [];
	if (step === 1) return [0];
	if (step === 2) return [
		1,
		2,
		3
	];
	return [Math.min(STACK.length - 1, step + 1)];
}
function StackScene({ step }) {
	const explode = useSim((s) => s.explode);
	const focus = stackFocus(step);
	const gap = explode * .2;
	let y = -(STACK.reduce((s, l) => s + l.h, 0) + gap * (STACK.length - 1)) / 2;
	const setStep = useSim((s) => s.setStep);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [STACK.map((layer, i) => {
		const center = y + layer.h / 2;
		y += layer.h + gap;
		const on = focus.includes(i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				center,
				0
			],
			size: [
				1.8,
				layer.h,
				1.15
			],
			color: layer.color,
			emissive: on ? .45 : .05,
			onClick: () => setStep(i === 0 ? 1 : i <= 3 ? 2 : i - 1)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.4,
				center,
				.15
			],
			accent: on,
			children: layer.name
		})] }, layer.name);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
		count: 4,
		color: "#e4a23a",
		speed: .18,
		path: (t) => [
			0,
			-1.6 + t * 1.2,
			.7
		]
	})] });
}
function WhyScene({ step }) {
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Molecule, {
			position: [
				-.8,
				.9,
				0
			],
			color: "#e08a55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-.8,
				1.5,
				0
			],
			children: "MA bay"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Molecule, {
			position: [
				.7,
				0,
				0
			],
			color: "#e6c15a"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				1.3,
				.1,
				0
			],
			color: "#79b0ff",
			radius: .16,
			label: "Cs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				.9,
				-.7,
				0
			],
			children: "FA + Cs ở lại"
		})
	] });
	if (step === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, { color: "#6d4bd6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			1.5,
			0
		],
		children: "thuần iod · không Hoke"
	})] });
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				0,
				.2,
				0
			],
			color: "#e6c15a",
			radius: .45,
			label: "FA"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ion, {
			position: [
				.7,
				.35,
				0
			],
			color: "#79b0ff",
			radius: .2,
			label: "5% Cs"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-.8,
				0
			],
			children: "kéo t về vùng bền"
		})
	] });
	if (step === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.8,
				.4,
				1.1
			],
			color: "#3a2a55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.32,
				0
			],
			size: [
				1.9,
				.06,
				1.2
			],
			color: "#b07adf"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.32,
				0
			],
			size: [
				1.9,
				.06,
				1.2
			],
			color: "#b07adf"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1,
				0
			],
			children: "2D hai mặt"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.4,
				0
			],
			size: [
				1.8,
				.08,
				1.1
			],
			color: "#d9d3c8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.85,
				0
			],
			size: [
				1.8,
				.12,
				1.1
			],
			color: "#e0b15a"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 5,
			color: "#6d4bd6",
			speed: .2,
			path: (t) => [
				(t - .5) * 1.2,
				-.6 + Math.min(.85, t * 1.3),
				.3
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.1,
				0
			],
			children: "SnO₂ ALD chặn iod"
		})
	] });
}
function VerifyScene({ step }) {
	const good = (t) => 92 + 8 * Math.exp(-t / 500);
	const bad = (t) => 38 + 62 * Math.exp(-t / 420);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotFrame, {
		x0: 0,
		x1: 2500,
		y0: 40,
		y1: 100,
		xLabel: "giờ",
		yLabel: "% còn lại",
		children: (map) => {
			const gPts = [];
			const bPts = [];
			for (let i = 0; i <= 24; i++) {
				const t = i / 24 * 2500;
				gPts.push(map(t, good(t)));
				bPts.push(map(t, bad(t)));
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
					pts: bPts,
					color: "#e08a55"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
					pts: gPts,
					color: "#8fd0a8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: map(2e3, 93),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.09,
						12,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#e4a23a",
						emissive: "#e4a23a",
						emissiveIntensity: .8
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: map(2e3, 97),
					children: "93% · 2000 h đã báo cáo"
				}),
				step >= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: map(400, 48),
					children: "đèn + nhiệt + ẩm"
				}) : null,
				step >= 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					position: map(1250, 70),
					accent: true,
					children: "giả thuyết"
				}) : null
			] });
		}
	});
}
function FinaleScene({ step }) {
	const ring = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (ring.current) ring.current.rotation.y = clock.elapsedTime * .35;
	});
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.8,
				.28,
				1.1
			],
			color: "#3a2a55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 3,
			color: "#e4a23a",
			speed: .45,
			path: (t) => [
				0,
				1.3 - t * 1.15,
				.35
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 3,
			color: "#79b0ff",
			speed: .3,
			path: (t) => [
				-.2 - t * 1.1,
				.15,
				.2
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 3,
			color: "#e08a55",
			speed: .3,
			path: (t) => [
				.2 + t * 1.1,
				-.15,
				.2
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.45,
				0
			],
			accent: true,
			children: "bốn bước"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.5,
				.2,
				0
			],
			children: "hấp thụ"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.55,
				0,
				0
			],
			children: "thu điện"
		})
	] });
	if (step === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
			aLabel: "A",
			bLabel: "B",
			xLabel: "X",
			highlight: "A"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.5,
				1.2,
				0
			],
			children: "núm A"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.45,
				0
			],
			accent: true,
			children: "núm B"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.5,
				1.2,
				0
			],
			children: "núm X"
		})
	] });
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				-1.1,
				.15,
				0
			],
			size: [
				.7,
				.45,
				.5
			],
			color: "#e08a55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				1.1,
				.85,
				0
			],
			size: [
				.7,
				1.7,
				.5
			],
			color: "#6d4bd6",
			emissive: .25
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.1,
				.7,
				0
			],
			children: "3,8%"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.1,
				1.95,
				0
			],
			accent: true,
			children: "27,3%"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.15,
				0
			],
			children: "một lớp"
		})
	] });
	if (step === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
			color: "#6d4bd6",
			scale: .7
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: ring,
			children: [
				0,
				1,
				2,
				3,
				4
			].map((i) => {
				const a = i / 5 * Math.PI * 2;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						Math.cos(a) * 1.35,
						Math.sin(a) * .85,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.12,
						12,
						10
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: "#e08a55",
						emissive: "#e08a55",
						emissiveIntensity: .45
					})]
				}, i);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.55,
				0
			],
			accent: true,
			children: "năm kẻ thù"
		})
	] });
	if (step === 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				i % 4 * .45 - .7,
				Math.floor(i / 4) * .4 - .1,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.1,
				12,
				10
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#6d4bd6",
				emissive: "#6d4bd6",
				emissiveIntensity: .35
			})]
		}, i)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.85,
				0
			],
			size: [
				2.2,
				.08,
				1.2
			],
			color: "#2a2140"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.2,
				0
			],
			accent: true,
			children: "mầm cùng lúc"
		})
	] });
	if (step === 5) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [[
		"#9ec9ea",
		"#c46a45",
		"#b07adf",
		"#3a2a55",
		"#8b939e",
		"#d9d3c8",
		"#b7daf2"
	].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
		position: [
			0,
			-1.05 + i * .32,
			0
		],
		size: [
			1.7,
			i === 3 ? .28 : .16,
			1
		],
		color: c,
		emissive: i === 3 ? .35 : .04
	}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			1.5,
			0,
			0
		],
		accent: true,
		children: "mỗi lớp một việc"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.25,
				0
			],
			size: [
				2.2,
				.35,
				1.2
			],
			color: "#b7c3ce"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.12,
				0
			],
			size: [
				2.2,
				.08,
				1.2
			],
			color: "#6d4bd6",
			emissive: .3
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				-1.3,
				.7,
				0
			],
			children: "Si · 150–180 µm"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				1.15,
				.7,
				0
			],
			accent: true,
			children: "tandem"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				-1.15,
				0
			],
			children: "đo T80"
		})
	] });
}
function QuizScene({ step }) {
	const q = QUIZ[step];
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.6,
				.7,
				1
			],
			color: "#2a2140"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowDots, {
			count: 1,
			color: "#7a3030",
			speed: .15,
			path: (t) => [
				0,
				1.2 - t * 2.2,
				.4
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.3,
				0
			],
			children: "900 nm · 1,38 eV"
		})
	] });
	if (step === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitCell, {
		aLabel: "1/8",
		bLabel: "1",
		xLabel: "1/2",
		highlight: "A"
	});
	if (step === 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			-1.2,
			0,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
			color: "#e6c15a",
			scale: .7
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.1,
				0
			],
			children: "Cs nhỏ"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			1.2,
			0,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctaMesh, {
			color: "#e08a55",
			scale: .7
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.1,
				0
			],
			children: "FA lớn"
		})]
	})] });
	if (step === 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			.4,
			0
		],
		accent: true,
		children: "2 × 60 mV ≈ 120 mV"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		position: [
			0,
			-.4,
			0
		],
		children: "1% → 0,01%"
	})] });
	if (step === 4) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.25,
				0
			],
			size: [
				1.6,
				.1,
				1
			],
			color: "#6d4bd6"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				-.15,
				0
			],
			size: [
				1.6,
				.28,
				1
			],
			color: "#b7c3ce"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				.8,
				0
			],
			children: "hai Eg, một nắng"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				0,
				0
			],
			size: [
				1.7,
				.35,
				1
			],
			color: "#3a2a55"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.28,
				0
			],
			size: [
				1.8,
				.06,
				1.1
			],
			color: "#b07adf"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slab, {
			position: [
				0,
				.5,
				0
			],
			size: [
				1.8,
				.08,
				1.1
			],
			color: "#d9d3c8"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			position: [
				0,
				1.1,
				0
			],
			children: q ? "2D + SnO₂" : ""
		})
	] });
}
function RefsScene({ step }) {
	const safe = (step % REFS.length + REFS.length) % REFS.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [REFS.map((r, i) => {
		const ang = (i - safe) / REFS.length * Math.PI * 2;
		const active = i === safe;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				Math.sin(ang) * 2.6,
				active ? .4 : -.2,
				Math.cos(ang) * 2.6
			],
			scale: active ? 1.35 : .55,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.42,
				.62,
				.08
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: active ? "#e4a23a" : "#24303a" })]
		}, r.n);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
		position: [
			0,
			1.45,
			0
		],
		accent: true,
		children: [
			"[",
			REFS[safe]?.n,
			"] ",
			REFS[safe]?.cite.slice(0, 48)
		]
	})] });
}
var lateScenes = {
	race: RaceScene,
	absorb: AbsorbScene,
	diffusion: DiffusionScene,
	exciton: ExcitonScene,
	defects: DefectsScene,
	tune: TuneScene,
	ink: InkScene,
	plqy: PlqyScene,
	compare: CompareScene,
	enemies: EnemiesScene,
	nucleation: NucleationScene,
	methods: MethodsScene,
	films: FilmsScene,
	grow: GrowScene,
	scale: ScaleScene,
	apps: AppsScene,
	market: MarketScene,
	lead: LeadScene,
	pin: PinScene,
	stack: StackScene,
	why: WhyScene,
	verify: VerifyScene,
	finale: FinaleScene,
	quiz: QuizScene,
	refs: RefsScene
};
var CAM = {
	default: [
		4.4,
		2.5,
		5.2
	],
	crystal: [
		3.4,
		2.15,
		4.1
	],
	wide: [
		6.4,
		3.2,
		7.2
	],
	plot: [
		.2,
		1.5,
		7.4
	],
	stack: [
		4.6,
		1.8,
		6.1
	]
};
var SCENES = {
	...earlyScenes,
	...crystalScenes,
	...lateScenes
};
function CameraRig({ cam }) {
	const { camera, controls } = useThree();
	const applied = (0, import_react.useRef)("");
	useFrame(() => {
		if (applied.current === cam) return;
		const orbit = controls;
		if (!orbit?.target) return;
		const p = CAM[cam] ?? CAM.default;
		camera.position.set(p?.[0] ?? 4.4, p?.[1] ?? 2.5, p?.[2] ?? 5.2);
		orbit.target.set(0, 0, 0);
		orbit.update?.();
		applied.current = cam;
	});
	return null;
}
function World({ scene, step }) {
	const Cmp = SCENES[scene] ?? earlyScenes.sun;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cmp, { step });
}
function Stage() {
	const lessonId = useSim((s) => s.lessonId);
	const step = useSim((s) => s.step);
	const replay = useSim((s) => s.replay);
	const autoRotate = useSim((s) => s.autoRotate);
	const lesson = getLesson(lessonId);
	const locale = useSim((s) => s.locale);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "stage-wait",
		children: ui(locale, "building")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		camera: {
			position: CAM[lesson.cam] ?? CAM.default,
			fov: 42
		},
		dpr: [1, 1.6],
		gl: { antialias: true },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: ["#0b0f13"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .55 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
				"#f4efe6",
				"#1a140e",
				.45
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					4.5,
					6,
					3
				],
				intensity: 1.45
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					-4,
					2,
					-3
				],
				intensity: .35,
				color: "#8ea2ff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
				args: [24, 24],
				cellSize: .5,
				cellThickness: .55,
				sectionSize: 2,
				sectionThickness: 1,
				fadeDistance: 18,
				fadeStrength: 1.5,
				cellColor: "#24303a",
				sectionColor: "#314555",
				position: [
					0,
					-1.65,
					0
				],
				infiniteGrid: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
				makeDefault: true,
				enableDamping: true,
				dampingFactor: .08,
				autoRotate,
				autoRotateSpeed: .45,
				maxDistance: 16,
				minDistance: 1.6
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, { cam: lesson.cam }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {
				scene: lesson.scene,
				step
			}, `${lesson.scene}-${replay}`)
		]
	});
}
var FOCUS_SWATCH = {
	A: "fa",
	B: "lead",
	X: "iodine",
	band: "electron",
	cell: "sun",
	defect: "warn",
	nano: "br"
};
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "brand-mark",
		viewBox: "0 0 36 36",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "36",
				height: "36",
				rx: "8",
				fill: "#151c24"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M18 5 30 18 18 31 6 18Z",
				fill: "none",
				stroke: "#e4a23a",
				strokeWidth: "1.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M6 18h24M18 5l7 13-7 13-7-13Z",
				fill: "none",
				stroke: "#6d4bd6",
				strokeWidth: "1.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "18",
				cy: "18",
				r: "2.2",
				fill: "#c5ccd6"
			})
		]
	});
}
function SimApp() {
	const lessonId = useSim((s) => s.lessonId);
	const step = useSim((s) => s.step);
	const explain = useSim((s) => s.explain);
	const playing = useSim((s) => s.playing);
	const help = useSim((s) => s.help);
	const query = useSim((s) => s.query);
	const inspect = useSim((s) => s.inspect);
	const quiz = useSim((s) => s.quiz);
	const locale = useSim((s) => s.locale);
	const textScale = useSim((s) => s.textScale);
	const presenting = useSim((s) => s.presenting);
	const photos = useSim((s) => s.photos);
	const setLocale = useSim((s) => s.setLocale);
	const setTextScale = useSim((s) => s.setTextScale);
	const togglePresent = useSim((s) => s.togglePresent);
	const togglePhotos = useSim((s) => s.togglePhotos);
	const lesson = getLesson(lessonId);
	const current = lesson.steps[step] ?? lesson.steps[0];
	const setLesson = useSim((s) => s.setLesson);
	const setStep = useSim((s) => s.setStep);
	const next = useSim((s) => s.next);
	const prev = useSim((s) => s.prev);
	const togglePlay = useSim((s) => s.togglePlay);
	const toggleExplain = useSim((s) => s.toggleExplain);
	const toggleRotate = useSim((s) => s.toggleRotate);
	const autoRotate = useSim((s) => s.autoRotate);
	const bumpReplay = useSim((s) => s.bumpReplay);
	const toggleHelp = useSim((s) => s.toggleHelp);
	const answerQuiz = useSim((s) => s.answerQuiz);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem("perovskite-lab-v1");
			if (!raw) return;
			const saved = JSON.parse(raw);
			if (saved.lessonId && lessons.some((l) => l.id === saved.lessonId)) useSim.getState().setLesson(saved.lessonId);
			if (saved.locale === "vi" || saved.locale === "en") useSim.setState({ locale: saved.locale });
			if (typeof saved.textScale === "number") useSim.getState().setTextScale(saved.textScale);
			if (typeof saved.explain === "boolean") {
				const id = useSim.getState().lessonId;
				const force = id === "glossary" || id === "refs" || id === "quiz";
				useSim.setState({ explain: force ? true : saved.explain });
			}
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		return useSim.subscribe((s) => {
			localStorage.setItem("perovskite-lab-v1", JSON.stringify({
				lessonId: s.lessonId,
				explain: s.explain,
				locale: s.locale,
				textScale: s.textScale
			}));
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) useSim.setState({
			autoRotate: false,
			playing: false
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const id = window.setInterval(() => useSim.getState().next(), 8e3);
		return () => window.clearInterval(id);
	}, [
		playing,
		lessonId,
		step
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key === "ArrowRight") next();
			if (e.key === "ArrowLeft") prev();
			if (e.key === " ") {
				e.preventDefault();
				togglePlay();
			}
			if (e.key === "e" || e.key === "E") toggleExplain();
			if (e.key === "Escape") {
				if (useSim.getState().photos) useSim.getState().togglePhotos();
				else if (useSim.getState().presenting && !document.fullscreenElement) useSim.getState().togglePresent();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		next,
		prev,
		toggleExplain,
		togglePlay
	]);
	const onPresent = () => {
		const go = async () => {
			try {
				if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
				else await document.exitFullscreen();
			} catch {
				togglePresent();
			}
		};
		go();
	};
	(0, import_react.useEffect)(() => {
		const sync = () => {
			const on = Boolean(document.fullscreenElement);
			if (on !== useSim.getState().presenting) useSim.setState({ presenting: on });
		};
		document.addEventListener("fullscreenchange", sync);
		return () => document.removeEventListener("fullscreenchange", sync);
	}, []);
	const filtered = lesson.steps.map((s, i) => ({
		s,
		i
	})).filter(({ s }) => {
		if (!query.trim()) return true;
		return `${s.title} ${s.body}`.toLowerCase().includes(query.trim().toLowerCase());
	});
	const quizItem = lesson.id === "quiz" ? QUIZ[step] : void 0;
	const quizEn = lesson.id === "quiz" ? QUIZ_EN[step] : void 0;
	const quizScore = QUIZ.reduce((n, q, i) => n + (quiz[i] === q.answer ? 1 : 0), 0);
	const table = TABLES[lesson.id];
	const figure = current.caption ? tr(locale, current.caption) : table?.caption[locale];
	const gloss = lesson.id === "glossary" ? GLOSSARY[step] : void 0;
	const appClass = [
		"app",
		explain ? "" : "explain-off",
		presenting ? "presenting" : ""
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: appClass,
		style: { ["--type"]: String(textScale) },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "brand-name",
							children: ui(locale, "brand")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "brand-sub",
							children: ui(locale, "sub")
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-title",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker",
								children: tr(locale, lesson.section)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tr(locale, lesson.title) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "journey",
								children: ui(locale, "journey")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "seg",
								role: "group",
								"aria-label": ui(locale, "lang"),
								children: ["vi", "en"].map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: locale === code ? "btn on" : "btn",
									onClick: () => setLocale(code),
									children: code === "vi" ? "VI" : "EN"
								}, code))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "seg",
								role: "group",
								"aria-label": ui(locale, "size"),
								children: [
									.85,
									1,
									1.2,
									1.45
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: textScale === n ? "btn on" : "btn",
									onClick: () => setTextScale(n),
									children: n === .85 ? "A−" : n === 1 ? "A" : n === 1.2 ? "A+" : "A++"
								}, n))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: photos ? "btn on" : "btn",
								onClick: togglePhotos,
								"aria-label": ui(locale, "photos"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "btn-label",
									children: photos ? ui(locale, "photosHide") : ui(locale, "photos")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: presenting ? "btn on" : "btn",
								onClick: onPresent,
								"aria-label": ui(locale, "present"),
								children: [presenting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "btn-label",
									children: presenting ? ui(locale, "presentExit") : ui(locale, "present")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-icon",
								onClick: toggleHelp,
								"aria-label": ui(locale, "help"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { size: 18 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: explain ? "btn on" : "btn",
								"aria-pressed": explain,
								onClick: toggleExplain,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "btn-label",
									children: ui(locale, "explainOn")
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "nav",
				"aria-label": "Mục lục",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "nav-scroll",
					children: chapters.map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "chapter-block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "chapter-label",
							children: [
								chapter.num,
								" ",
								tr(locale, chapter.title)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lesson-list",
							children: chapter.lessonIds.map((id) => {
								const item = getLesson(id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: id === lessonId ? "lesson-btn active" : "lesson-btn",
									onClick: () => setLesson(id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "lesson-idx",
										children: tr(locale, item.section)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "lesson-name",
										children: tr(locale, item.title)
									})]
								}, id);
							})
						})]
					}, chapter.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stage-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "stage",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "stage-caption",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								ui(locale, "step"),
								" ",
								step + 1,
								"/",
								lesson.steps.length,
								inspect ? ` · ${inspect}` : ""
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tr(locale, current.title) }),
							figure ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
								className: "figure-cap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: figure })
							}) : null
						]
					}),
					lesson.legend ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "legend",
						children: lesson.legend.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "legend-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `swatch swatch-${item.swatch}` }), tr(locale, item.label)]
						}, item.label))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlDock, { kinds: lesson.controls ?? [] }),
					photos && !explain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoDrawer, {
						lessonId,
						locale,
						onClose: togglePhotos
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "playback",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						onClick: prev,
						"aria-label": ui(locale, "prev"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						onClick: togglePlay,
						"aria-label": playing ? ui(locale, "pause") : ui(locale, "play"),
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 18 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 18 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						onClick: bumpReplay,
						"aria-label": ui(locale, "replay"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: autoRotate ? "btn on" : "btn",
						onClick: toggleRotate,
						children: ui(locale, "rotate")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "step-count",
						children: [
							step + 1,
							"/",
							lesson.steps.length
						]
					}),
					lesson.steps.length <= 16 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "dots",
						children: lesson.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: i === step ? "dot on" : i < step ? "dot seen" : "dot",
							"aria-label": s.title,
							onClick: () => setStep(i)
						}, s.title))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						onClick: next,
						"aria-label": ui(locale, "next"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 18 })
					})
				]
			}),
			explain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "panel",
				"aria-label": "Giải thích",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel-scroll",
					children: [
						photos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoDrawer, {
							lessonId,
							locale,
							onClose: togglePhotos,
							embedded: true
						}) : null,
						lesson.id === "glossary" || lesson.id === "refs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "search",
							value: query,
							placeholder: lesson.id === "glossary" ? ui(locale, "searchTerms") : ui(locale, "searchRefs"),
							onChange: (e) => useSim.getState().patch({ query: e.target.value })
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "kicker",
							children: [
								ui(locale, "step"),
								" ",
								step + 1,
								" · ",
								tr(locale, lesson.section)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: tr(locale, current.title) }),
						gloss ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "term-line",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `swatch swatch-${FOCUS_SWATCH[gloss.focus] ?? "sun"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: gloss.en })]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "prose",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: gloss && locale === "en" ? `${gloss.en}. ${GLOSS_EN[gloss.vi] ?? gloss.blurb}` : lesson.id === "quiz" && locale === "en" && quizEn ? quizEn.prompt : tr(locale, current.body) })
						}),
						current.more ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "prose more",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker",
								children: ui(locale, "more")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: tr(locale, current.more) })]
						}) : null,
						current.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `callout ${current.note.kind === "base" ? "" : current.note.kind}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "call-label",
								children: tr(locale, current.note.title)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: tr(locale, current.note.text) })]
						}) : null,
						table ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
							className: "data-fig",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker",
								children: ui(locale, "table")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: table.caption[locale] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "table-wrap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: table.headers[locale].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: table.rows[locale].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: row.map((cell, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: cell }) }, `${cell}-${i}`)) }, row.join("|"))) })] })
							})]
						}) : null,
						quizItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "quiz",
							children: [
								(locale === "en" && quizEn ? quizEn.options : quizItem.options).map((opt, i) => {
									const picked = quiz[step];
									const cls = picked === null ? "btn" : i === quizItem.answer ? "btn good" : i === picked ? "btn bad" : "btn";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: cls,
										onClick: () => answerQuiz(step, i),
										children: opt
									}, opt);
								}),
								quiz[step] !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "prose",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: locale === "en" && quizEn ? quizEn.why : quizItem.why })
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "score",
									children: [
										ui(locale, "correct"),
										" ",
										quizScore,
										"/6"
									]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "step-jump",
							children: filtered.map(({ s, i }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: i === step ? "on" : "",
								onClick: () => setStep(i),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: lesson.id === "refs" || lesson.id === "glossary" ? tr(locale, s.title) : `${ui(locale, "step")} ${i + 1}` }), lesson.id === "refs" ? s.body : tr(locale, s.title)]
							}, `${s.title}-${i}`))
						})
					]
				})
			}) : null,
			help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "help-layer",
				onClick: toggleHelp,
				role: "presentation",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "help-card",
					onClick: (e) => e.stopPropagation(),
					role: "dialog",
					"aria-labelledby": "help-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "kicker",
							children: ui(locale, "help")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "help-title",
							children: ui(locale, "helpTitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: HELP[locale].map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-accent",
							onClick: toggleHelp,
							children: ui(locale, "enter")
						})
					]
				})
			}) : null
		]
	});
}
function PhotoDrawer({ lessonId, locale, onClose, embedded = false }) {
	const step = useSim((s) => s.step);
	const shots = photosFor(lessonId, step);
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => setIndex(0), [lessonId, step]);
	const photo = shots[Math.min(index, Math.max(0, shots.length - 1))] ?? shots[0];
	const n = shots.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: embedded ? "photo-dock embedded" : "photo-dock",
		role: "dialog",
		"aria-label": ui(locale, "photos"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "photo-bar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "kicker",
					children: [
						ui(locale, "photos"),
						" ",
						Math.min(index, n - 1) + 1,
						"/",
						n
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-icon",
					onClick: onClose,
					"aria-label": ui(locale, "close"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: "photo-img",
				src: photo.src,
				alt: photoAlt(photo, locale)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "photo-alt",
				children: photoAlt(photo, locale)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "photo-bar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						"aria-label": ui(locale, "prev"),
						onClick: () => setIndex((i) => (i - 1 + n) % n),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "photo-credit",
						href: photo.href,
						target: "_blank",
						rel: "noreferrer",
						children: [
							ui(locale, "credit"),
							": ",
							photo.credit
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-icon",
						"aria-label": ui(locale, "next"),
						onClick: () => setIndex((i) => (i + 1) % n),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })
					})
				]
			})
		]
	});
}
function ControlDock({ kinds }) {
	const s = useSim();
	const locale = s.locale;
	if (kinds.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "dock",
		children: [
			kinds.includes("wavelength") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "ctrl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						ui(locale, "wave"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.wavelength.toFixed(0), " nm"] }),
						" · E ≈ ",
						photonEnergy(s.wavelength).toFixed(2),
						" eV"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 320,
						max: 1200,
						value: s.wavelength,
						onChange: (e) => s.patch({ wavelength: Number(e.target.value) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "chip-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => s.patch({ wavelength: 500 }),
								children: ui(locale, "green")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => s.patch({ wavelength: 700 }),
								children: ui(locale, "red")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => s.patch({ wavelength: 1100 }),
								children: ui(locale, "ir")
							})
						]
					})
				]
			}) : null,
			kinds.includes("iv") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ctrl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"PCE ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [pce(s.voc, s.jsc, s.ff).toFixed(1), "%"] }),
						" = ",
						s.voc.toFixed(2),
						" × ",
						s.jsc.toFixed(1),
						" × ",
						s.ff.toFixed(2),
						" / 100"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Voc ",
						s.voc.toFixed(2),
						" V"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 80,
						max: 135,
						value: Math.round(s.voc * 100),
						onChange: (e) => s.patch({ voc: Number(e.target.value) / 100 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Jsc ",
						s.jsc.toFixed(1),
						" mA/cm²"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 10,
						max: 30,
						step: .1,
						value: s.jsc,
						onChange: (e) => s.patch({ jsc: Number(e.target.value) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["FF ", s.ff.toFixed(2)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 40,
						max: 90,
						value: Math.round(s.ff * 100),
						onChange: (e) => s.patch({ ff: Number(e.target.value) / 100 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn",
						onClick: () => s.patch({
							voc: 1.19,
							jsc: 25.8,
							ff: .86
						}),
						children: ui(locale, "example")
					})
				]
			}) : null,
			kinds.includes("eg") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					ui(locale, "shownEg"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.eg.toFixed(2), " eV"] }),
					" · ",
					ui(locale, "sqCap"),
					" ~",
					sqEfficiency(s.eg).toFixed(1),
					"%"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 50,
					max: 300,
					value: Math.round(s.eg * 100),
					onChange: (e) => s.patch({ eg: Number(e.target.value) / 100 })
				})]
			}) : null,
			kinds.includes("cation") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"t ≈",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tolerance(s.mixCs ? ION.fa * .95 + ION.cs * .05 : s.cation === "Cs" ? ION.cs : s.cation === "MA" ? ION.ma : ION.fa).toFixed(2) })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "chip-row",
					children: [[
						"Cs",
						"MA",
						"FA"
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: s.cation === c && !s.mixCs ? "btn on" : "btn",
						onClick: () => s.patch({
							cation: c,
							mixCs: false
						}),
						children: c
					}, c)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: s.mixCs ? "btn on" : "btn",
						onClick: () => s.patch({
							mixCs: true,
							cation: "FA"
						}),
						children: "FA₀.₉₅Cs₀.₀₅"
					})]
				})]
			}) : null,
			kinds.includes("bromide") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					ui(locale, "bromine"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.br.toFixed(0), "%"] }),
					" · Eg ",
					egFromHalide(s.br, s.sn).toFixed(2),
					" eV"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 100,
					value: s.br,
					onChange: (e) => s.patch({ br: Number(e.target.value) })
				})]
			}) : null,
			kinds.includes("sn") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					ui(locale, "tin"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.sn.toFixed(0), "%"] })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 100,
					value: s.sn,
					onChange: (e) => s.patch({ sn: Number(e.target.value) })
				})]
			}) : null,
			kinds.includes("light") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: s.light ? "btn on" : "btn",
				onClick: () => s.patch({ light: !s.light }),
				children: s.light ? ui(locale, "hokeOn") : ui(locale, "hokeOff")
			}) : null,
			kinds.includes("temperature") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					phaseFromTemp(s.temp).name,
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [s.temp.toFixed(0), " °C"] }),
					" · ",
					phaseFromTemp(s.temp).en
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: -150,
					max: 90,
					value: s.temp,
					onChange: (e) => s.patch({ temp: Number(e.target.value) })
				})]
			}) : null,
			kinds.includes("lifetime") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ctrl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"τ ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: s.tau < 1e3 ? `${s.tau.toFixed(0)} ns` : `${(s.tau / 1e3).toFixed(1)} µs` }),
						" · L ≈ ",
						diffusionUm(s.tau, s.singleCrystal).toFixed(s.singleCrystal ? 0 : 2),
						" µm"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 1e3,
						value: Math.round((Math.log(s.tau) - Math.log(10)) / (Math.log(6e6) - Math.log(10)) * 1e3),
						onChange: (e) => {
							const u = Number(e.target.value) / 1e3;
							const tau = Math.exp(Math.log(10) + u * (Math.log(6e6) - Math.log(10)));
							s.patch({ tau });
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: s.singleCrystal ? "btn on" : "btn",
						onClick: () => s.patch({ singleCrystal: !s.singleCrystal }),
						children: s.singleCrystal ? ui(locale, "crystal") : ui(locale, "film")
					})
				]
			}) : null,
			kinds.includes("plqy") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"PLQY ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(s.plqy * 100).toFixed(s.plqy < .01 ? 3 : 2), "%"] }),
					" · Voc ≈ ",
					vocFromPlqy(s.plqy).toFixed(3),
					" V"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 1e3,
					value: Math.round((Math.log(s.plqy) - Math.log(1e-6)) / (0 - Math.log(1e-6)) * 1e3),
					onChange: (e) => {
						const u = Number(e.target.value) / 1e3;
						const plqy = Math.exp(Math.log(1e-6) + u * (0 - Math.log(1e-6)));
						s.patch({ plqy });
					}
				})]
			}) : null,
			kinds.includes("enemy") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ui(locale, "enemy") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "chip-row",
					children: [[
						1,
						2,
						3,
						4,
						5
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: s.enemy === n ? "btn on" : "btn",
						onClick: () => s.patch({ enemy: n }),
						children: n
					}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: s.defense ? "btn on" : "btn",
						onClick: () => s.patch({ defense: !s.defense }),
						children: ui(locale, "defense")
					})]
				})]
			}) : null,
			kinds.includes("explode") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					ui(locale, "split"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [Math.round(s.explode * 100), "%"] })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 100,
					value: Math.round(s.explode * 100),
					onChange: (e) => s.patch({ explode: Number(e.target.value) / 100 })
				})]
			}) : null,
			kinds.includes("nwell") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ctrl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ui(locale, "wells") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "chip-row",
					children: [
						1,
						2,
						3,
						4,
						99
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: s.nWell === n ? "btn on" : "btn",
						onClick: () => s.patch({ nWell: n }),
						children: n === 99 ? "3D" : `n=${n}`
					}, n))
				})]
			}) : null,
			kinds.includes("architecture") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chip-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: s.architecture === "nip" ? "btn on" : "btn",
					onClick: () => s.patch({ architecture: "nip" }),
					children: "n-i-p"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: s.architecture === "pin" ? "btn on" : "btn",
					onClick: () => s.patch({ architecture: "pin" }),
					children: "p-i-n"
				})]
			}) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimApp, {});
}
//#endregion
export { Home as component };
