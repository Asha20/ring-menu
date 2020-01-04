import { renderMenu as build } from "./builder";
import { circle, dynamic as d, menu, ring, sector } from "./parts";

const dsector = (
  angleFactor: number,
  offsetFactor?: number,
  content?: string,
) => sector(d(angleFactor), offsetFactor && d(offsetFactor), content);

// prettier-ignore
const m = menu([
  circle(50, "Hello"),
  ring(200, d(1), 30, [
    dsector(2, undefined, "Foo bar"),
    sector(30, 60, "Hello"),
  ])
]);

const a = build(m);
document.body.appendChild(a);
