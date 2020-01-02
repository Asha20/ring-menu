import { assert, assertValidAngle } from "./assert";
import { Brand, isDynamic, isNotDynamic, map, pipe, sum } from "./util";

enum PartType {
  Circle = "circle",
  Gap = "gap",
  Ring = "ring",
  Sector = "sector",
}

export type StaticAngle = Brand<number, "StaticAngle">;

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
  sectors: StaticSector[];
}

interface Sector extends Part {
  type: PartType.Sector;
  angle: Angle;
  offset?: Angle;
}

interface StaticSector extends Sector {
  angle: StaticAngle;
  offset: StaticAngle;
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

function resolveAngle(...unresolved: Angle[]) {
  for (const angle of unresolved) {
    if (isNotDynamic(angle)) {
      return angle;
    }
  }
  throw new Error("Last angle in resolution chain must be static.");
}

function resolveSectors(
  ringOffset: Angle,
  separator: Angle,
  sectors: Sector[],
): StaticSector[] {
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
  const dynamicUnit = (dynamicAngleSum /
    dynamicSectorFactorCount) as StaticAngle;

  const dynamicAngle = (angle: Angle) =>
    isDynamic(angle) ? dynamicUnit * angle.factor : angle;

  const staticSectors = sectors.map<StaticSector>(sec => ({
    ...sec,
    angle: dynamicAngle(sec.angle) as StaticAngle,
    offset: dynamicAngle(sec.offset ?? separator) as StaticAngle,
  }));

  let currentAngle = resolveAngle(ringOffset, dynamicUnit / 2);
  const sectorsWithAbsoluteOffset = staticSectors.map((sec: StaticSector) => {
    const oldOffset = sec.offset;
    sec.offset = currentAngle as StaticAngle;
    currentAngle += oldOffset + sec.angle;
    return sec;
  });

  return sectorsWithAbsoluteOffset;
}

export function circle(radius: number): Circle {
  assert(radius > 0, "Circle radius must be a positive number.");
  return { type: PartType.Circle, radius };
}

export function gap(width: number): Gap {
  assert(width > 0, "Gap width must be a positive number.");
  return { type: PartType.Gap, width };
}

export function ring(
  width: number,
  offset: Angle,
  separator: Angle,
  sectors: Sector[],
): Ring {
  const staticSectors = resolveSectors(offset, separator, sectors);
  return { type: PartType.Ring, width, sectors: staticSectors };
}

export function sector(angle: Angle, offset?: Angle): Sector {
  assertValidAngle(angle, "Sector angle");
  if (offset !== undefined) {
    assertValidAngle(offset, "Sector offset");
  }
  return { type: PartType.Sector, angle, offset };
}
