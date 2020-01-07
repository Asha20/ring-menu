import { Angle, Content } from "../parts/parts";
import { isDynamic } from "./util";

export function number(x: any): x is number {
  return typeof x === "number";
}

export function object(x: any): x is object {
  return (
    typeof x === "object" &&
    !Array.isArray(x) &&
    x !== null &&
    !(x instanceof Element)
  );
}

export function angle(x: any): x is Angle {
  return typeof x === "number" || isDynamic(x);
}

export function content(x: any): x is Content {
  return typeof x === "string" || x instanceof SVGElement;
}
