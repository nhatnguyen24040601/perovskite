export type Cation = "Cs" | "MA" | "FA";
export type Architecture = "nip" | "pin";

export type Tune = Partial<{
  wavelength: number;
  voc: number;
  jsc: number;
  ff: number;
  eg: number;
  br: number;
  sn: number;
  cation: Cation;
  mixCs: boolean;
  temp: number;
  tau: number;
  singleCrystal: boolean;
  plqy: number;
  enemy: number;
  defense: boolean;
  explode: number;
  light: boolean;
  nWell: number;
  architecture: Architecture;
}>;
