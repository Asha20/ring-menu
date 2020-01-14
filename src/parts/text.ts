import { Part, PartType } from "./common";
import { AnyObject } from "../util/util";

export interface Text extends Omit<Part, "content"> {
  type: PartType.Text;
  text: string;
}

export function text(content: string, attrs: AnyObject = {}): Text {
  return { type: PartType.Text, text: content, attrs };
}
