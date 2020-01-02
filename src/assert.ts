import { Dynamic, StaticAngle } from "./parts";

export function assert(x: boolean, message: string): asserts x {
  if (!x) {
    throw new AssertError(message);
  }
}

export class AssertError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssertError";
    Object.setPrototypeOf(this, AssertError.prototype);
  }
}

export function assertValidAngle(
  x: number | Dynamic,
  subject: string,
): asserts x is StaticAngle | Dynamic {
  if (typeof x === "number" && (x < 0 || x > 360)) {
    throw new AssertError(
      `${subject} must be a valid angle from 0 to 360 degrees.`,
    );
  }
}
