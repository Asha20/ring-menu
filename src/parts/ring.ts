import { assert } from "../util/assert";
import { AnyObject, NonEmptyArray } from "../util/util";
import { Angle, Part, PartType } from "./common";
import { resolveSectors, StaticSector } from "./resolve-sectors";
import { Sector } from "./sector";

export interface Ring extends Omit<Part, "content"> {
  type: PartType.Ring;
  width: number;
  sectors: StaticSector[];
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
