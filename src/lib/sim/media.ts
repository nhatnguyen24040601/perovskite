import type { Locale } from "./store";

export type Photo = {
  src: string;
  alt: { vi: string; en: string };
  credit: string;
  href: string;
};

const cell: Photo = {
  src: "/photos/cell-hand.jpg",
  alt: {
    vi: "Tế bào pin mặt trời màng mỏng trên kính, các ngón tay kim loại thu dòng.",
    en: "A thin-film solar cell on glass, with metal fingers collecting current.",
  },
  credit: "Wikimedia Commons — Perovskite solar cell",
  href: "https://commons.wikimedia.org/wiki/File:Perovskite_solar_cell.jpg",
};
const dark: Photo = {
  src: "/photos/cells-dark.jpg",
  alt: {
    vi: "Các tấm kính phủ màng tối, đúng màu perovskite iod sau khi kết tinh.",
    en: "Glass coupons coated with a dark film, the color of an iodide perovskite after it crystallizes.",
  },
  credit: "UC San Diego Today",
  href: "https://today.ucsd.edu/story/a-temporary-melting-liquid-could-help-build-better-perovskite-solar-cells-and-leds",
};
const spin: Photo = {
  src: "/photos/spin.jpg",
  alt: {
    vi: "Đế trong máy quay phủ. Màu tím là vân giao thoa của màng mỏng, không phải màu phát sáng.",
    en: "A substrate in a spin coater. The purple is thin-film interference, not luminescence.",
  },
  credit: "Ossila — spin coating",
  href: "https://www.ossila.com/pages/spin-coating",
};
const drop: Photo = {
  src: "/photos/spin-drop.jpg",
  alt: {
    vi: "Nhỏ dung dịch lên đế trước khi quay — đúng nhịp 1 của quay phủ.",
    en: "Dispensing solution onto a substrate before the spin — step 1 of spin coating.",
  },
  credit: "Ossila — spin coating",
  href: "https://www.ossila.com/pages/spin-coating",
};
const waferSpin: Photo = {
  src: "/photos/spin-wafer.jpg",
  alt: {
    vi: "Nhỏ chất lỏng lên tâm một đĩa tròn trên máy quay.",
    en: "A drop landing at the center of a round chuck.",
  },
  credit: "Cost Effective Equipment",
  href: "https://www.costeffectiveequipment.com/blog-spin-coat-theory/",
};
const si: Photo = {
  src: "/photos/silicon.jpg",
  alt: {
    vi: "Pin silicon tinh thể (xanh, có điện cực) cạnh tấm silicon trần.",
    en: "Crystalline-silicon cells beside bare silicon wafers.",
  },
  credit: "Wikimedia — Crystalline silicon",
  href: "https://en.wikipedia.org/wiki/Crystalline_silicon",
};
const line: Photo = {
  src: "/photos/silicon-line.jpg",
  alt: {
    vi: "Tế bào silicon trên dây chuyền, dày hơn lớp perovskite khoảng 300 lần.",
    en: "Silicon cells on a production line — roughly 300× thicker than a perovskite film.",
  },
  credit: "PV-Manufacturing.org",
  href: "https://pv-manufacturing.org/silicon-heterojunction-solar-cells/",
};
const dots: Photo = {
  src: "/photos/qdots.jpg",
  alt: {
    vi: "Lọ chấm lượng tử phát từ tím đến đỏ dưới đèn cực tím — cùng dải 410–700 nm của mục chích nóng.",
    en: "Quantum-dot vials glowing from violet to red under UV — the 410–700 nm range of hot injection.",
  },
  credit: "Fluxim",
  href: "https://www.fluxim.com/research-blogs/light-conversion-perovskite-quantum-dots",
};
const dots2: Photo = {
  src: "/photos/qdots2.jpg",
  alt: {
    vi: "Dung dịch nano tinh thể phát quang trong chai.",
    en: "Colloidal nanocrystals photoluminescing in bottles.",
  },
  credit: "Nature Research Custom",
  href: "https://www.nature.com/articles/d42473-025-00002-3",
};
const vac: Photo = {
  src: "/photos/vacuum.jpg",
  alt: {
    vi: "Buồng bay hơi nhiệt: nguồn nóng ở dưới, đế treo phía trên. Ảnh minh họa nguyên lý, nguồn trong ảnh không phải muối perovskite.",
    en: "A thermal evaporator: hot source below, substrate above. The charge in the photo is not a perovskite salt; the geometry is the point.",
  },
  credit: "Kintek Solution",
  href: "https://kindle-tech.com/faqs/what-is-the-principle-of-thermal-evaporation-method",
};
const flex: Photo = {
  src: "/photos/flexible.jpg",
  alt: {
    vi: "Pin perovskite uốn trên đế nhựa — hệ quả của lớp mỏng phủ ở nhiệt độ thấp.",
    en: "A flexible perovskite cell on plastic — what a low-temperature thin film makes possible.",
  },
  credit: "Perovskite-Info",
  href: "https://www.perovskite-info.com/researchers-fabricate-flexible-roll-roll-perovskite-solar-cells-167-efficiency",
};
const sem: Photo = {
  src: "/photos/sem.jpg",
  alt: {
    vi: "Ảnh kính hiển vi điện tử quét cắt lớp: perovskite nằm trên cùng, mỏng hơn các lớp bên dưới.",
    en: "Cross-section electron micrograph: the perovskite is the thin top layer.",
  },
  credit: "TechXplore",
  href: "https://techxplore.com/news/2025-04-ultralight-flexible-solar-cells-efficiency.html",
};
const peled: Photo = {
  src: "/photos/peled.jpg",
  alt: {
    vi: "Màng perovskite phát lục theo số lớp n. Ảnh bài báo, kèm giản đồ và phổ — không chỉ là ảnh đèn.",
    en: "Green perovskite films versus well thickness n, from a paper figure with spectra.",
  },
  credit: "Nature Communications, 2018",
  href: "https://www.nature.com/articles/s41467-018-02978-7",
};
const module: Photo = {
  src: "/photos/module.jpg",
  alt: {
    vi: "Mô-đun pin cầm tay, các tế bào nối thành tấm — bậc thang từ cm² lên sản phẩm.",
    en: "A handheld module: cells strung into a plate, the step beyond a square centimetre.",
  },
  credit: "Solar Power World",
  href: "https://www.solarpowerworldonline.com/2025/08/us-perovskite-startups-make-moves-into-tandem-panel-manufacturing/",
};
const minis: Photo = {
  src: "/photos/mini-modules.jpg",
  alt: {
    vi: "Các mô-đun nhỏ xếp cạnh nhau khi thử nghiệm tandem.",
    en: "Mini-modules laid out during tandem development.",
  },
  credit: "pv magazine USA",
  href: "https://pv-magazine-usa.com/2025/01/09/u-s-made-perovskite-silicon-tandem-solar-modules-could-be-produced-at-around-0-35-w/",
};
const color: Photo = {
  src: "/photos/film-color.jpg",
  alt: {
    vi: "Màng mỏng trên kính để trước một tấm pin. Ánh màu là giao thoa bề dày, cho thấy lớp chỉ dày cỡ bước sóng ánh sáng.",
    en: "A thin film on glass in front of a module. The color is interference — the layer is only about as thick as a wavelength of light.",
  },
  credit: "Glass on Web",
  href: "https://www.glassonweb.com/article/thin-film-solar-cells-low-cost-glass-substrates",
};

const itc: Photo = {
  src: "/photos/itc-vials.jpg",
  alt: {
    vi: "Bốn lọ thật trong bài kết tinh nhanh: dung dịch trong, mầm đỏ, dung dịch vàng, và tinh thể đen nằm đáy lọ.",
    en: "Four real vials from a rapid-growth paper: clear solution, red seeds, a yellow solution, and black crystals at the bottom.",
  },
  credit: "Nature Communications, 2016 — rapid growth of halide perovskite crystals",
  href: "https://www.nature.com/articles/ncomms13303",
};
const bladeLab: Photo = {
  src: "/photos/blade-lab.jpg",
  alt: {
    vi: "Trên là sơ đồ dao gạt: nhỏ mực, lưỡi chạy, màng ướt, rồi sấy. Dưới là ảnh máy thật, lưỡi trên bàn nhiệt.",
    en: "Top: blade-coating steps — dispense, blade motion, wet film, dry. Bottom: a real blade coater sitting on a hot plate.",
  },
  credit: "Springer — Doctor blade coating, laboratory photograph in the figure",
  href: "https://link.springer.com/chapter/10.1007/978-981-99-0961-2_12",
};
const r2r: Photo = {
  src: "/photos/r2r-coater.jpg",
  alt: {
    vi: "Máy phủ cuộn-sang-cuộn thật: cuộn thả bên trái, đầu phủ ở giữa, lò, rồi cuộn thu bên phải.",
    en: "A real roll-to-roll coater: unwind on the left, coating head in the middle, oven, then rewind on the right.",
  },
  credit: "infinityPV — LR2RC roll-to-roll coater",
  href: "https://www.infinitypv.com/r2r-academy/roll-to-roll-processing",
};
const evapReal: Photo = {
  src: "/photos/evap-chamber.jpg",
  alt: {
    vi: "Buồng bay hơi nhiệt đang chạy: nguồn sáng ở dưới, đế treo phía trên. Chất trong ảnh không phải muối perovskite; hình cho thấy đúng hình học của cách 3.",
    en: "A thermal evaporator running: hot source below, substrate hung above. The charge in the photo is not a perovskite salt; the geometry is what method 3 uses.",
  },
  credit: "Kintek Solution — thermal evaporation",
  href: "https://kindle-tech.com/faqs/what-is-the-principle-of-thermal-evaporation-method",
};
const slotFig: Photo = {
  src: "/photos/slotdie-fig.jpg",
  alt: {
    vi: "Sơ đồ dây chuyền phủ khe: mực perovskite, lớp vận chuyển, điện cực, rồi sấy hồng ngoại. Ảnh góc là màng thật — lỗ kim khi mặt đế không thấm, và màng kín khi thấm tốt.",
    en: "A slot-die line diagram: perovskite ink, transport layers, electrode, then infrared drying. The corner photos are real films — pinholes on a poorly wetting surface, and a dense film when wetting is good.",
  },
  credit: "infinityPV — slot-die coating of perovskite cells",
  href: "https://www.infinitypv.com/news/slot-die-coating-advances-for-high-performance-perovskite-solar-cells-a-study-on-interface-roughness",
};
const antiLab: Photo = {
  src: "/photos/antisolvent-lab.jpg",
  alt: {
    vi: "Hình từ một bài chế tạo: nhỏ dung môi đối, rồi trải màng. Hai ảnh dưới là pipette thật và tấm đã phủ, sấy trên bàn nhiệt.",
    en: "A fabrication figure: antisolvent drops, then spreading the film. The lower two frames are a real pipette and a coated sheet dried on a hot plate.",
  },
  credit: "TechXplore — perovskite fabrication figure with laboratory photos",
  href: "https://techxplore.com/news/2022-01-fabrication-perovskite-solar-cells-piece.html",
};

const lab = [cell, dark, color];
const make = [spin, drop, waferSpin, vac];
const nano = [dots, dots2, peled];
const big = [module, minis, flex, sem];
const sun = [line, si, module];

export const PHOTO_SETS: Record<string, Photo[]> = {
  intro: [module, line, cell],
  foundation: lab,
  photon: [color, module, cell],
  bands: lab,
  cell: [cell, sem, dark],
  metrics: [cell, module],
  sq: [module, line],
  silicon: [si, line, module],
  ideal: [cell, dark, si],
  origin: [dark, cell],
  parts: [dark, sem],
  build: [dark, sem, cell],
  tolerance: [dark, cell],
  phases: [dark, cell],
  orbitals: [sem, dark],
  alloy: [dots, dark, cell],
  nano: [...nano, sem],
  props: [sem, dark],
  race: [module, cell, minis],
  absorb: [sem, color, dark],
  diffusion: [sem, cell],
  exciton: [peled, dots],
  defects: [sem, dark],
  tune: [dots, dots2, dark],
  ink: [drop, spin, flex],
  plqy: [peled, dots],
  compare: [si, line, cell, module],
  enemies: [dark, sem, cell],
  methods: [...make, flex, dots],
  nucleation: [spin, dark, sem],
  films: [drop, spin, waferSpin, vac, dark],
  grow: [dots, dots2, peled],
  scale: [flex, module, vac, sem, minis],
  apps: [flex, peled, dots, module, cell],
  market: [module, minis, cell],
  lead: [cell, dark],
  pin: [sem, cell, module],
  stack: [sem, cell],
  why: [sem, dark],
  verify: [module, cell],
  finale: [cell, module, dots],
  quiz: [cell, dark],
  glossary: [dark, dots, sem],
  refs: [cell],
};

const STEP_PHOTOS: Record<string, Photo[][]> = {
  methods: [
    [spin, bladeLab, evapReal, itc, dots, r2r],
    [drop, spin, waferSpin],
    [dark, antiLab],
    [evapReal, vac],
    [itc],
    [dots, dots2],
    [bladeLab],
    [slotFig, r2r, flex],
  ],
  nucleation: [[spin, dark], [sem, dark], [sem]],
  films: [
    [drop, waferSpin],
    [spin, waferSpin],
    [antiLab, spin],
    [dark, color],
    [itc, dark],
    [dark, cell],
    [evapReal, vac],
    [evapReal, sem],
  ],
  grow: [[itc], [itc], [itc], [sem, itc], [dots2], [dots], [dots, dots2, peled]],
  scale: [[cell, module], [bladeLab], [bladeLab, slotFig], [slotFig], [r2r, flex], [evapReal]],
  pin: [[sem, cell], [sem, cell], [sem], [sem, cell]],
  stack: [[sem], [sem], [sem, cell], [sem], [dark], [sem], [sem], [cell], [sem], [module]],
  finale: [[cell, color], [dark, sem], [module, cell], [dark], [spin, bladeLab], [sem, cell], [module, minis]],
};

export function photosFor(id: string, step?: number): Photo[] {
  if (typeof step === "number") {
    const row = STEP_PHOTOS[id]?.[step];
    if (row && row.length > 0) return row;
  }
  return PHOTO_SETS[id] ?? lab;
}

export function photoAlt(photo: Photo, locale: Locale): string {
  return photo.alt[locale];
}
