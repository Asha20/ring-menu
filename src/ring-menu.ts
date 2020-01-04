import { renderMenu as build } from "./builder/builder";
import {
  circle,
  dynamic as d,
  menu,
  ring,
  sector,
  Content,
} from "./parts/parts";
import * as h from "./builder/h";

const dsector = (
  angleFactor: number,
  offsetFactor?: number,
  content?: Content,
) => sector(d(angleFactor), offsetFactor && d(offsetFactor), content);

// prettier-ignore
const m = menu([
  circle(50, "Hello"),
  ring(200, d(1), 30, [
    dsector(2, 0, h.circle(0, 0, 10, {fill: "red"})),
    sector(30, 60, "Hello"),
  ])
]);

const a = build(m);
document.body.appendChild(a);
