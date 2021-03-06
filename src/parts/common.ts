import { Brand, AnyObject } from "../util/util";
import { Text } from "./text";
import { assert } from "../util/assert";

export enum PartType {
  Text = "text",
  Circle = "circle",
  Gap = "gap",
  Ring = "ring",
  Sector = "sector",
  Menu = "menu",
}

export type StaticAngle = Brand<number, "StaticAngle">;
export type Content = string | Text | SVGElement;

export interface Part {
  type: PartType;
  attrs: AnyObject;
  content: Content | undefined;
}

export interface Dynamic {
  __dynamic: true;
  factor: number;
}

export type Angle = number | Dynamic;

export function dynamic(factor: number): Dynamic {
  assert(factor > 0, "A dynamic value must have a positive factor.");
  return { __dynamic: true, factor };
}
