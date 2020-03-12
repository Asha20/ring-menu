import { Content, dynamic } from "./common";
import { AnyObject, matchTuple, ArgumentType as Arg } from "../util/util";
import { Sector, _sector } from "./sector";

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

export function dsector(attrs?: AnyObject): Sector;
export function dsector(content: Content, attrs?: AnyObject): Sector;
export function dsector(
  angleFactor: number,
  offsetFactor?: number,
  attrs?: AnyObject,
): Sector;
export function dsector(
  content?: Content,
  angleFactor?: number,
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
    [[Arg.Object], () => _dsector(undefined, undefined, undefined, a)],
    [[Arg.Content], () => _dsector(a)],
    [[Arg.Content, Arg.Object], () => _dsector(a, undefined, undefined, b)],
    [[Arg.Number], () => _dsector(undefined, a)],
    [[Arg.Number, Arg.Number], () => _dsector(undefined, a, b)],
    [[Arg.Number, Arg.Number, Arg.Object], () => _dsector(undefined, a, b, c)],
    [[Arg.Content, Arg.Number], () => _dsector(a, b)],
    [[Arg.Content, Arg.Number, Arg.Number], () => _dsector(a, b, c)],
    [[Arg.Content, Arg.Number, Arg.Object], () => _dsector(a, b, undefined, c)],
    [
      [Arg.Content, Arg.Number, Arg.Number, Arg.Object],
      () => _dsector(a, b, c, d),
    ],
  ])(args);
}
