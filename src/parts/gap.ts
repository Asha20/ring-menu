import { Part, PartType } from "./common";
import { assert } from "../util/assert";

export interface Gap extends Omit<Part, "attrs" | "content"> {
  type: PartType.Gap;
  width: number;
}

export function gap(width: number): Gap {
  assert(width > 0, "Gap width must be a positive number.");
  return { type: PartType.Gap, width };
}
