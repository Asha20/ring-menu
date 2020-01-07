import { Angle, Content } from "../parts/parts";
import { isDynamic } from "./util";

export function number(x: unknown): x is number {
  return typeof x === "number";
}

export function object(x: unknown): x is object {
  return (
    typeof x === "object" &&
    !Array.isArray(x) &&
    x !== null &&
    !(x instanceof Element)
  );
}

export function array(x: unknown): x is unknown[] {
  return Array.isArray(x);
}

export function angle(x: unknown): x is Angle {
  return typeof x === "number" || isDynamic(x);
}

export function content(x: unknown): x is Content {
  return typeof x === "string" || x instanceof SVGElement;
}
