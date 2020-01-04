import { assert, assertValidAngle } from "../util/assert";
import {
  AnyObject,
  Brand,
  isDynamic,
  map,
  NonEmptyArray,
  pipe,
  sum,
} from "../util/util";

export enum PartType {
  Circle = "circle",
  Gap = "gap",
  Ring = "ring",
  Sector = "sector",
  Menu = "menu",
}

export type StaticAngle = Brand<number, "StaticAngle">;
export type MenuPart = Circle | Gap | Ring;
export type Content = string | SVGElement;

interface Part {
  type: PartType;
  attrs: Object;
  content: Content | undefined;
}

export interface Circle extends Part {
  type: PartType.Circle;
  radius: number;
}

interface Gap extends Omit<Part, "attrs" | "content"> {
  type: PartType.Gap;
  width: number;
}

export interface Ring extends Omit<Part, "content"> {
  type: PartType.Ring;
  width: number;
  sectors: StaticSector[];
}

interface Sector extends Part {
  type: PartType.Sector;
  angle: Angle;
  offset?: Angle;
}

export interface StaticSector extends Sector {
  angle: StaticAngle;
  offset: StaticAngle;
}

type MenuStructure = [Circle, ...Array<Gap | Ring>] | NonEmptyArray<Gap | Ring>;

export interface Menu extends Omit<Part, "content"> {
  type: PartType.Menu;
  structure: MenuStructure;
}

export interface Dynamic {
  __dynamic: true;
  factor: number;
}

type Angle = number | Dynamic;

export function dynamic(factor: number): Dynamic {
  assert(factor > 0, "A dynamic value must have a positive factor.");
  return { __dynamic: true, factor };
}

export function resolveAngle(...unresolved: Angle[]) {
  for (const angle of unresolved) {
    if (!isDynamic(angle)) {
      return angle;
    }
  }
  throw new Error("Last angle in resolution chain must be static.");
}

export function calculateDynamicUnit(separator: Angle, sectors: Sector[]) {
  const FULL_ANGLE = 360;
  const staticAngleSum = pipe(
    sectors,
    map(x => resolveAngle(x.angle, 0)),
    sum,
  );

  const staticOffsetSum = pipe(
    sectors,
    map(x => resolveAngle(x.offset ?? separator, 0)),
    sum,
  );

  assertValidAngle(staticAngleSum, "Sum of static angles");
  assertValidAngle(staticOffsetSum, "Sum of static offsets");
  assertValidAngle(
    staticAngleSum + staticOffsetSum,
    "Sum of static angles and static offsets",
  );

  const dynamicSectorFactorCount = sectors.reduce((acc, sector) => {
    acc += isDynamic(sector.angle) ? sector.angle.factor : 0;
    const offset = sector.offset ?? separator;
    acc += isDynamic(offset) ? offset.factor : 0;
    return acc;
  }, 0);
  const dynamicAngleSum = FULL_ANGLE - staticAngleSum - staticOffsetSum;
  const dynamicUnit =
    dynamicSectorFactorCount > 0
      ? dynamicAngleSum / dynamicSectorFactorCount
      : 0;
  return dynamicUnit as StaticAngle;
}

export function resolveSectors(
  ringOffset: Angle,
  separator: Angle,
  sectors: Sector[],
): StaticSector[] {
  const dynamicUnit = calculateDynamicUnit(separator, sectors);
  const dynamicAngle = (angle: Angle) =>
    isDynamic(angle) ? dynamicUnit * angle.factor : angle;

  const staticSectors = sectors.map<StaticSector>(sec => ({
    ...sec,
    angle: dynamicAngle(sec.angle) as StaticAngle,
    offset: dynamicAngle(sec.offset ?? separator) as StaticAngle,
  }));

  let currentAngle = dynamicAngle(ringOffset);
  const sectorsWithAbsoluteOffset = staticSectors.map((sec: StaticSector) => {
    const oldOffset = sec.offset;
    sec.offset = currentAngle as StaticAngle;
    currentAngle += oldOffset + sec.angle;
    return sec;
  });

  return sectorsWithAbsoluteOffset;
}

export function circle(
  radius: number,
  content?: Content,
  attrs: AnyObject = {},
): Circle {
  assert(radius > 0, "Circle radius must be a positive number.");
  return { type: PartType.Circle, radius, attrs, content };
}

export function gap(width: number): Gap {
  assert(width > 0, "Gap width must be a positive number.");
  return { type: PartType.Gap, width };
}

export function ring(
  width: number,
  offset: Angle,
  separator: Angle,
  sectors: NonEmptyArray<Sector>,
  attrs: AnyObject = {},
): Ring {
  assert(sectors.length > 0, "A ring must have at least one sector.");
  const staticSectors = resolveSectors(offset, separator, sectors);
  return { type: PartType.Ring, width, sectors: staticSectors, attrs };
}

export function sector(
  angle: Angle,
  offset?: Angle,
  content?: Content,
  attrs: AnyObject = {},
): Sector {
  assertValidAngle(angle, "Sector angle");
  if (offset !== undefined) {
    assertValidAngle(offset, "Sector offset");
  }
  return { type: PartType.Sector, angle, offset, attrs, content };
}

export function dsector(
  angleFactor: number,
  offsetFactor?: number,
  content?: Content,
  attrs: AnyObject = {},
): Sector {
  return sector(
    dynamic(angleFactor),
    offsetFactor && dynamic(offsetFactor),
    content,
    attrs,
  );
}

export function menu(structure: MenuStructure, attrs: AnyObject = {}): Menu {
  assert(structure.length > 0, "Menu cannot be empty.");
  structure.forEach((el, i) => {
    assert(
      i === 0 || el.type !== PartType.Circle,
      "A circle can only be found in the center of the menu.",
    );
  });

  return { type: PartType.Menu, structure, attrs };
}
