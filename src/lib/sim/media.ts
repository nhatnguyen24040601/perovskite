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

export function photosFor(id: string): Photo[] {
  return PHOTO_SETS[id] ?? lab;
}

export function photoAlt(photo: Photo, locale: Locale): string {
  return photo.alt[locale];
}
