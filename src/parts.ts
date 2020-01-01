import { assertValidAngle } from "./assert";

enum PartType {
  Circle = "circle",
  Gap = "gap",
  Ring = "ring",
  Sector = "sector",
}

type Brand<T, N> = T & { __brand: N };
export type StaticAngle = Brand<number, "ValidAngle">;

interface Part {
  type: PartType;
}

interface Circle extends Part {
  type: PartType.Circle;
  radius: number;
}

interface Gap extends Part {
  type: PartType.Gap;
  width: number;
}

interface Ring extends Part {
  type: PartType.Ring;
  width: number;
  sectors: Sector[];
}

interface Sector extends Part {
  type: PartType.Sector;
  angle: Angle;
}

export interface Dynamic {
  __dynamic: true;
  factor: number;
}

type Angle = number | Dynamic;

function dynamic(factor: number): Dynamic {
  return { __dynamic: true, factor };
}

function circle(radius: number): Circle {
  assertValidAngle(radius, "Circle radius");
  return { type: PartType.Circle, radius };
}

function gap(width: number): Gap {
  return { type: PartType.Gap, width };
}

function ring(width: number, sectors: Sector[]): Ring {
  return { type: PartType.Ring, width, sectors };
}

function sector(angle: Angle): Sector {
  assertValidAngle(angle, "Sector angle");
  return { type: PartType.Sector, angle };
}
