import { Part, PartType, Angle, Content, dynamic } from "./common";
import { AnyObject, matchTuple, ArgumentType as Arg } from "../util/util";
import { assertValidAngle } from "../util/assert";

export interface Sector extends Part {
  type: PartType.Sector;
  angle: Angle;
  offset?: Angle;
}

export function _sector(
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

export function sector(attrs?: AnyObject): Sector;
export function sector(content: Content, attrs?: AnyObject): Sector;
export function sector(angle: Angle, offset?: Angle, attrs?: AnyObject): Sector;
export function sector(
  content?: Content,
  angle?: Angle,
  attrs?: AnyObject,
): Sector;
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
    [[Arg.Object], () => _sector(undefined, undefined, undefined, a)],
    [[Arg.Content], () => _sector(a)],
    [[Arg.Content, Arg.Object], () => _sector(a, undefined, undefined, b)],
    [[Arg.Angle], () => _sector(undefined, a)],
    [[Arg.Angle, Arg.Angle], () => _sector(undefined, a, b)],
    [[Arg.Angle, Arg.Angle, Arg.Object], () => _sector(undefined, a, b, c)],
    [[Arg.Content, Arg.Angle], () => _sector(a, b)],
    [[Arg.Content, Arg.Angle, Arg.Angle], () => _sector(a, b, c)],
    [[Arg.Content, Arg.Angle, Arg.Object], () => _sector(a, b, undefined, c)],
    [
      [Arg.Content, Arg.Angle, Arg.Angle, Arg.Object],
      () => _sector(a, b, c, d),
    ],
  ])(args);
}
