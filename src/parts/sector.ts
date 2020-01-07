import { Part, PartType, Angle, Content, dynamic } from "./common";
import { AnyObject, matchTuple } from "../util/util";
import { assertValidAngle } from "../util/assert";
import * as is from "../util/is";

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
