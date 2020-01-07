import { Content, dynamic } from "./common";
import { AnyObject, matchTuple } from "../util/util";
import { Sector, _sector } from "./sector";
import * as is from "../util/is";

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
