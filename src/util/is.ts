import { Angle, Content, PartType, Dynamic } from "../parts/common";
import { Text } from "../parts/text";

export function dynamic<T>(x: T | Dynamic): x is Dynamic {
  return typeof x === "object" && (x as Dynamic).__dynamic === true;
}

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
  return typeof x === "number" || dynamic(x);
}

export function text(x: unknown): x is Text {
  return (
    typeof x === "object" && x !== null && (x as any).type === PartType.Text
  );
}

export function content(x: unknown): x is Content {
  return typeof x === "string" || text(x) || x instanceof SVGElement;
}
