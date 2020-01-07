import { Circle } from "./circle";
import { Ring } from "./ring";
import { NonEmptyArray, AnyObject } from "../util/util";
import { assert } from "../util/assert";
import { PartType, Part } from "./common";
import { Gap } from "./gap";

type MenuStructure = [Circle, ...Array<Gap | Ring>] | NonEmptyArray<Gap | Ring>;

export interface Menu extends Omit<Part, "content"> {
  type: PartType.Menu;
  structure: MenuStructure;
}

export function menu(structure: MenuStructure, attrs: AnyObject = {}): Menu {
  assert(structure.length > 0, "Menu cannot be empty.");
  structure.forEach((el, i) => {
    assert(
      i === 0 || el.type !== PartType.Circle,
      "A circle can only be found in the center of the menu.",
    );
  });

  return { type: PartType.Menu, structure, attrs };
}
