import { Angle, Sector, StaticAngle } from "./parts";
import { pipe, map, sum } from "../util/util";
import { dynamic as isDynamic } from "../util/is";
import { assertValidAngle } from "../util/assert";

export interface StaticSector extends Sector {
  angle: StaticAngle;
  offset: StaticAngle;
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
