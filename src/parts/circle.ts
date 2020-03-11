import { Content, Part, PartType } from "./common";
import { AnyObject, matchTuple } from "../util/util";
import { assert } from "../util/assert";
import * as is from "../util/is";

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
    [[is.number], () => _circle(a)],
    [[is.number, is.content], () => _circle(a, b)],
    [[is.number, is.object], () => _circle(a, undefined, b)],
    [[is.number, is.content, is.object], () => _circle(a, b, c)],
  ])(args);
}
