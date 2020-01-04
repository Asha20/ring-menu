import { renderMenu as build } from "./builder";
import { dynamic as d, menu, ring, sector } from "./parts";

const dsector = (angleFactor: number, offsetFactor?: number) =>
  sector(d(angleFactor), offsetFactor && d(offsetFactor));

// prettier-ignore
const m = menu([
  ring(100, d(1), 30, [
    dsector(2),
    sector(30, 60),
  ])
]);

const a = build(m);
document.body.appendChild(a);
