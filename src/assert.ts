import { Dynamic, StaticAngle } from "./parts";

export function assert(x: boolean, message: string): asserts x {
  if (!x) {
    throw new Error(message);
  }
}

export function assertValidAngle(
  x: number | Dynamic,
  subject: string,
): asserts x is StaticAngle | Dynamic {
  if (typeof x === "number" && (x < 0 || x > 360)) {
    throw new Error(`${subject} must be a valid angle from 0 to 360 degrees.`);
  }
  if (typeof x === "object" && x.factor < 0) {
    throw new Error(`${subject} dynamic factor cannot be negative.`);
  }
}
