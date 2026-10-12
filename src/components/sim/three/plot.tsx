import type { ReactNode } from "react";
import { Seg, Tag } from "./kit";

export function PlotFrame({
  x0,
  x1,
  y0,
  y1,
  w = 6.2,
  h = 3.4,
  xLabel,
  yLabel,
  children,
}: {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  w?: number;
  h?: number;
  xLabel: string;
  yLabel: string;
  children: (map: (x: number, y: number) => [number, number, number]) => ReactNode;
}) {
  const map = (x: number, y: number): [number, number, number] => [
    ((x - x0) / (x1 - x0) - 0.5) * w,
    ((y - y0) / (y1 - y0)) * h - h * 0.35,
    0,
  ];
  const origin = map(x0, y0);
  const xEnd = map(x1, y0);
  const yEnd = map(x0, y1);
  return (
    <group>
      <Seg a={origin} b={xEnd} color="#93a0ac" radius={0.018} />
      <Seg a={origin} b={yEnd} color="#93a0ac" radius={0.018} />
      <Tag position={[xEnd[0], xEnd[1] - 0.28, 0]}>{xLabel}</Tag>
      <Tag position={[yEnd[0] - 0.15, yEnd[1] + 0.28, 0]}>{yLabel}</Tag>
      {children(map)}
    </group>
  );
}

export function Polyline({
  pts,
  color,
  radius = 0.03,
}: {
  pts: [number, number, number][];
  color: string;
  radius?: number;
}) {
  return (
    <group>
      {pts.slice(1).map((p, i) => (
        <Seg key={i} a={pts[i]!} b={p} color={color} radius={radius} />
      ))}
    </group>
  );
}
