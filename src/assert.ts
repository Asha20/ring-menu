import { ValidAngle } from "./parts";

export function assert(x: boolean, message: string): asserts x {
  if (!x) {
    throw new Error(message);
  }
}

export function assertValidAngle(
  x: number,
  subject: string,
): asserts x is ValidAngle {
  if (x < 0 || x > 360) {
    throw new Error(`${subject} must be a valid angle from 0 to 360 degrees.`);
  }
}
