import { assert, assertValidAngle } from "../util/assert";
import {
  AnyObject,
  Brand,
  isDynamic,
  map,
  NonEmptyArray,
  pipe,
  sum,
  matchTuple,
} from "../util/util";
import * as is from "../util/is";

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

export type Angle = number | Dynamic;

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

function _circle(
  radius: number,
  content?: Content,
  attrs: AnyObject = {},
): Circle {
  assert(radius > 0, "Circle radius must be a positive number.");
  return { type: PartType.Circle, radius, attrs, content };
}

export function circle(radius: number): Circle;
export function circle(radius: number, attrs?: AnyObject): Circle;
export function circle(
  radius: number,
  content?: Content,
  attrs?: AnyObject,
): Circle;
export function circle(...args: any[]): Circle {
  const [a, b, c] = args;
  return matchTuple<Circle>([
    [[is.number], () => _circle(a)],
    [[is.number, is.object], () => _circle(a, undefined, b)],
    [[is.number, is.content], () => _circle(a, b)],
    [[is.number, is.content, is.object], () => _circle(a, b, c)],
  ])(args);
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

function _sector(
  content?: Content,
  angle: Angle = dynamic(1),
  offset?: Angle,
  attrs: AnyObject = {},
): Sector {
  assertValidAngle(angle, "Sector angle");
  if (offset !== undefined) {
    assertValidAngle(offset, "Sector offset");
  }
  return { type: PartType.Sector, angle, offset, attrs, content };
}

export function sector(): Sector;
export function sector(content: Content, attrs?: AnyObject): Sector;
export function sector(angle: Angle, offset?: Angle, attrs?: AnyObject): Sector;
export function sector(
  content?: Content,
  angle?: Angle,
  offset?: Angle,
  attrs?: AnyObject,
): Sector;
export function sector(...args: any[]): Sector {
  const [a, b, c, d] = args;
  return matchTuple<Sector>([
    [[], () => _sector()],
    [[is.content], () => _sector(a)],
    [[is.content, is.object], () => _sector(a, undefined, undefined, b)],
    [[is.angle], () => _sector(undefined, a)],
    [[is.angle, is.angle], () => _sector(undefined, a, b)],
    [[is.angle, is.angle, is.object], () => _sector(undefined, a, b, c)],
    [[is.content, is.angle], () => _sector(a, b)],
    [[is.content, is.angle, is.angle], () => _sector(a, b, c)],
    [[is.content, is.angle, is.angle, is.object], () => _sector(a, b, c, d)],
  ])(args);
}

function _dsector(
  content?: Content,
  angleFactor: number = 1,
  offsetFactor?: number,
  attrs: AnyObject = {},
): Sector {
  return _sector(
    content,
    dynamic(angleFactor),
    offsetFactor && dynamic(offsetFactor),
    attrs,
  );
}

export function dsector(): Sector;
export function dsector(content: Content, attrs?: AnyObject): Sector;
export function dsector(
  angleFactor: number,
  offsetFactor?: number,
  attrs?: AnyObject,
): Sector;
export function dsector(
  content?: Content,
  angleFactor?: number,
  offsetFactor?: number,
  attrs?: AnyObject,
): Sector;
export function dsector(...args: any[]): Sector {
  const [a, b, c, d] = args;
  return matchTuple<Sector>([
    [[], () => _dsector()],
    [[is.content], () => _dsector(a)],
    [[is.content, is.object], () => _dsector(a, undefined, undefined, b)],
    [[is.number], () => _dsector(undefined, a)],
    [[is.number, is.number], () => _dsector(undefined, a, b)],
    [[is.number, is.number, is.object], () => _dsector(undefined, a, b, c)],
    [[is.content, is.number], () => _dsector(a, b)],
    [[is.content, is.number, is.number], () => _dsector(a, b, c)],
    [[is.content, is.number, is.number, is.object], () => _dsector(a, b, c, d)],
  ])(args);
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
