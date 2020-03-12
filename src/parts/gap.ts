import { Part, PartType } from "./common";
import { assert } from "../util/assert";
import { number as isNumber } from "../util/is";

export interface Gap extends Omit<Part, "attrs" | "content"> {
  type: PartType.Gap;
  width: number;
}

export function gap(width: number): Gap {
  assert(isNumber(width) && width > 0, "Gap width must be a positive number.");
  return { type: PartType.Gap, width };
}
