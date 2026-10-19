import { tr } from "@/lib/sim/i18n";
import { useSim } from "@/lib/sim/store";

const SINGLE: [number, number][] = [
  [2009, 3.8],
  [2012, 10],
  [2013, 16],
  [2016, 22],
  [2019, 25.2],
  [2023, 26.1],
  [2026, 27.3],
];
const TANDEM: [number, number][] = [
  [2016, 18],
  [2019, 26],
  [2022, 31],
  [2024, 33.5],
  [2026, 35],
];

const REASONS = [
  ["3.1", "hấp thụ mạnh"],
  ["3.2", "điện tích đi xa"],
  ["3.3", "exciton tự tách"],
  ["3.4", "dung thứ khuyết tật"],
  ["3.5", "chỉnh Eg"],
  ["3.6", "chế tạo rẻ"],
] as const;

function xy(year: number, pct: number): [number, number] {
  const x = 86 + ((year - 2009) / 17) * 760;
  const y = 318 - (pct / 40) * 250;
  return [x, y];
}

function line(pts: [number, number][]) {
  return pts.map(([year, pct]) => xy(year, pct).join(",")).join(" ");
}

export function RaceDiagram(_props: { step: number }) {
  const locale = useSim((s) => s.locale);
  const t = (s: string) => tr(locale, s);
  const sq = xy(2009, 33.7);
  const sqEnd = xy(2026, 33.7);
  const endSingle = xy(2026, 27.3);
  const endTandem = xy(2026, 35);
  const first = xy(2009, 3.8);

  return (
    <svg className="race-svg" viewBox="0 0 920 500" role="img" aria-label={t("sơ đồ hiệu suất theo năm")}>
      <line x1={86} y1={318} x2={846} y2={318} stroke="#93a0ac" strokeWidth="2" />
      <line x1={86} y1={318} x2={86} y2={58} stroke="#93a0ac" strokeWidth="2" />
      {[0, 10, 20, 30, 40].map((pct) => {
        const [, y] = xy(2009, pct);
        return (
          <g key={pct}>
            <line x1={80} y1={y} x2={86} y2={y} stroke="#93a0ac" strokeWidth="2" />
            <text x={72} y={y + 4} textAnchor="end" fill="#c5d0da" fontSize="14">
              {pct}
            </text>
          </g>
        );
      })}
      {[2009, 2016, 2026].map((year) => {
        const [x] = xy(year, 0);
        return (
          <text key={year} x={x} y={342} textAnchor="middle" fill="#c5d0da" fontSize="14">
            {year}
          </text>
        );
      })}
      <text x={466} y={372} textAnchor="middle" fill="#9aa6b4" fontSize="15">
        {t("năm")}
      </text>
      <text x={28} y={188} textAnchor="middle" fill="#9aa6b4" fontSize="15" transform="rotate(-90 28 188)">
        %
      </text>

      <line x1={sq[0]} y1={sq[1]} x2={sqEnd[0]} y2={sqEnd[1]} stroke="#8fd0a8" strokeWidth="3" />
      <text x={sq[0] + 8} y={sq[1] - 10} fill="#8fd0a8" fontSize="16">
        {t("SQ 33,7%")}
      </text>

      <polyline points={line(SINGLE)} fill="none" stroke="#e08a55" strokeWidth="4" strokeLinejoin="round" />
      {SINGLE.map(([year, pct]) => {
        const [x, y] = xy(year, pct);
        return <circle key={year} cx={x} cy={y} r={year === 2009 || year === 2026 ? 6 : 4} fill="#e08a55" />;
      })}
      <text x={first[0] + 12} y={first[1] + 22} fill="#f4efe6" fontSize="16">
        {t("3,8% · 2009")}
      </text>
      <text x={endSingle[0] - 8} y={endSingle[1] + 28} textAnchor="end" fill="#e08a55" fontSize="18">
        27,3%
      </text>

      <g>
        <polyline points={line(TANDEM)} fill="none" stroke="#79b0ff" strokeWidth="4" strokeLinejoin="round" />
        {TANDEM.map(([year, pct]) => {
          const [x, y] = xy(year, pct);
          return <circle key={year} cx={x} cy={y} r={year === 2026 ? 6 : 4} fill="#79b0ff" />;
        })}
        <text x={endTandem[0] - 8} y={endTandem[1] - 12} textAnchor="end" fill="#79b0ff" fontSize="18">
          {t("tandem 35%")}
        </text>
      </g>

      <g>
        <line x1="100" y1="28" x2="132" y2="28" stroke="#e08a55" strokeWidth="4" />
        <text x="140" y="33" fill="#f4efe6" fontSize="15">
          {t("một lớp")}
        </text>
        <line x1="250" y1="28" x2="282" y2="28" stroke="#8fd0a8" strokeWidth="4" />
        <text x="290" y="33" fill="#f4efe6" fontSize="15">
          33,7%
        </text>
        <line x1="400" y1="28" x2="432" y2="28" stroke="#79b0ff" strokeWidth="4" />
        <text x="440" y="33" fill="#f4efe6" fontSize="15">
          tandem
        </text>
      </g>

      <g>
        {REASONS.map(([num, label], i) => {
          const x = 70 + (i % 3) * 280;
          const y = 424 + Math.floor(i / 3) * 30;
          return (
            <text key={num} x={x} y={y} fill="#f4efe6" fontSize="15">
              <tspan fill="#e4a23a">{num}</tspan>
              <tspan> {t(label)}</tspan>
            </text>
          );
        })}
      </g>
    </svg>
  );
}
