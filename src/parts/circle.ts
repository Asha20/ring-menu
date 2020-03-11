import { Content, Part, PartType } from "./common";
import { AnyObject, matchTuple, ArgumentType as Arg } from "../util/util";
import { assert } from "../util/assert";

export interface Circle extends Part {
  type: PartType.Circle;
  radius: number;
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
    [[Arg.Number], () => _circle(a)],
    [[Arg.Number, Arg.Content], () => _circle(a, b)],
    [[Arg.Number, Arg.Object], () => _circle(a, undefined, b)],
    [[Arg.Number, Arg.Content, Arg.Object], () => _circle(a, b, c)],
  ])(args);
}
