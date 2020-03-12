import { Part, PartType } from "./common";
import { AnyObject } from "../util/util";
import { assert } from "../util/assert";

export interface Text extends Omit<Part, "content"> {
  type: PartType.Text;
  text: string;
}

export function text(content: string, attrs: AnyObject = {}): Text {
  assert(typeof content === "string", "Content of a Text must be a string.");
  return { type: PartType.Text, text: content, attrs };
}
