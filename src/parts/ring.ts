import { assert } from "../util/assert";
import {
  AnyObject,
  NonEmptyArray,
  matchTuple,
  ArgumentType as Arg,
} from "../util/util";
import { Angle, Part, PartType } from "./common";
import { resolveSectors, StaticSector } from "./resolve-sectors";
import { Sector } from "./sector";

export interface Ring extends Omit<Part, "content"> {
  type: PartType.Ring;
  width: number;
  sectors: StaticSector[];
}

type Sectors = NonEmptyArray<Sector>;

function _ring(
  width: number,
  separator: Angle = 0,
  offset: Angle = 0,
  sectors: Sectors,
  attrs: AnyObject = {},
): Ring {
  assert(sectors.length > 0, "A ring must have at least one sector.");
  const staticSectors = resolveSectors(offset, separator, sectors);
  return { type: PartType.Ring, width, sectors: staticSectors, attrs };
}

export function ring(width: number, sectors: Sectors, attrs?: AnyObject): Ring;
export function ring(
  width: number,
  separator: Angle,
  sectors: Sectors,
  attrs?: AnyObject,
): Ring;
export function ring(
  width: number,
  separator: Angle,
  offset: Angle,
  sectors: Sectors,
  attrs?: AnyObject,
): Ring;
export function ring(...args: any[]): Ring {
  const [a, b, c, d, e] = args;
  return matchTuple([
    [[Arg.Number, Arg.Array], () => _ring(a, undefined, undefined, b)],
    [
      [Arg.Number, Arg.Array, Arg.Object],
      () => _ring(a, undefined, undefined, b, c),
    ],
    [[Arg.Number, Arg.Angle, Arg.Array], () => _ring(a, b, undefined, c)],
    [
      [Arg.Number, Arg.Angle, Arg.Array, Arg.Object],
      () => _ring(a, b, undefined, c, d),
    ],
    [[Arg.Number, Arg.Angle, Arg.Angle, Arg.Array], () => _ring(a, b, c, d)],
    [
      [Arg.Number, Arg.Angle, Arg.Angle, Arg.Array, Arg.Object],
      () => _ring(a, b, c, d, e),
    ],
  ])(args);
}
