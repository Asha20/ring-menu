import * as h from "./h";
import {
  Text,
  Circle,
  Content,
  Menu,
  PartType,
  Ring,
  StaticSector,
  Gap,
} from "../parts/parts";
import { assert } from "../util/assert";

type Refs = Record<string, { wrapper: SVGElement; self: SVGElement }>;
interface Rendered {
  el: SVGElement;
  refs: Refs;
}

interface RenderOptions {
  includeTabIndexes: boolean;
}

function radians(degrees: number) {
  return (degrees / 180) * Math.PI;
}

function toFixed(x: number, digits: number) {
  return Number(x.toFixed(digits));
}

function addRef(
  refs: Refs,
  name: unknown,
  wrapper: SVGElement,
  self: SVGElement,
): Refs {
  if (name === undefined) {
    return refs;
  }
  assert(typeof name === "string", "A ref must be a string.");
  assert(!refs.hasOwnProperty(name), "Duplicate ref: " + name);
  const ref = name as string;
  refs[ref] = { wrapper, self };
  return refs;
}

function mergeRefs(baseRefs: Refs, otherRefs: Refs) {
  Object.keys(otherRefs).forEach(ref => {
    const other = otherRefs[ref];
    addRef(baseRefs, ref, other.wrapper, other.self);
  });
  return baseRefs;
}

function isText(x: unknown): x is Text {
  return (
    typeof x === "object" && x !== null && (x as any).type === PartType.Text
  );
}

export function renderContent(content: Content, x: number, y: number) {
  if (typeof content === "string" || isText(content)) {
    const text = isText(content) ? content.text : content;
    const attrs = isText(content) ? content.attrs : {};

    const el = h.text(text, x, y, {
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      fill: "black",
      style: {
        userSelect: "none",
        msUserSelect: "none",
        webkitUserSelect: "none",
      },
      ...attrs,
    });
    return el;
  }

  return h.g({ transform: `translate(${x}, ${y})` }, [content]);
}

export function renderCircle(
  circle: Circle,
  x: number,
  y: number,
  options: RenderOptions,
): Rendered {
  const el = h.circle(x, y, circle.radius, {
    ...circle.attrs,
    tabindex: options.includeTabIndexes ? 0 : undefined,
  });

  if (circle.content === undefined) {
    return { el, refs: addRef({}, circle.attrs.ref, el, el) };
  }

  const content = renderContent(circle.content, x, y);
  const group = h.g({}, [el, content]);
  const refs = addRef({}, circle.attrs.ref, group, el);
  if (isText(circle.content)) {
    addRef(refs, circle.content.attrs.ref, group, content);
  }
  return { el: group, refs };
}

export function renderRing(
  ring: Ring,
  pos: number,
  options: RenderOptions,
): Rendered {
  const allRefs: Refs = {};
  const sectors = ring.sectors.map(x => {
    const { el, refs } = renderSector(ring.width, pos, x, options);
    mergeRefs(allRefs, refs);
    return el;
  });

  const el = h.g(ring.attrs, sectors);
  addRef(allRefs, ring.attrs.ref, el, el);
  return { el, refs: allRefs };
}

export function renderSector(
  width: number,
  innerRadius: number,
  sector: StaticSector,
  options: RenderOptions,
): Rendered {
  const R = innerRadius + width;
  const r = innerRadius;

  // SVG paths have trouble rendering an arc of 360 degrees,
  // so we subtract a small value to make sure the angle is never quite 360.
  const SMALL_VALUE = 0.0001;
  const a = radians(sector.angle) - SMALL_VALUE;

  const x1 = toFixed(R * Math.sin(a), 3);
  const y1 = toFixed(R - R * Math.cos(a), 3);
  const x2 = toFixed(width * Math.sin(a), 3);
  const y2 = toFixed(width * Math.cos(a), 3);
  const arc = a > Math.PI ? 1 : 0;

  const d = `
    M 0 ${-r}
    L 0 ${-R}
    a ${R} ${R} 0 ${arc} 1 ${x1} ${y1}
    l ${-x2} ${y2}
    A ${r} ${r} 0 ${arc} 0 0 ${-r}
  `;

  const el = h.path(d, {
    transform: `rotate(${sector.offset}, 0, 0)`,
    ...sector.attrs,
    tabindex: options.includeTabIndexes ? 0 : undefined,
  });
  if (sector.content === undefined) {
    return { el, refs: addRef({}, sector.attrs.ref, el, el) };
  }

  const centerAngle = radians(sector.offset + sector.angle / 2);
  const centerX = toFixed((r + width / 2) * Math.sin(centerAngle), 3);
  const centerY = toFixed((r + width / 2) * -Math.cos(centerAngle), 3);
  const content = renderContent(sector.content, centerX, centerY);

  const group = h.g({}, [el, content]);
  const refs = addRef({}, sector.attrs.ref, group, el);
  if (isText(sector.content)) {
    addRef(refs, sector.content.attrs.ref, group, content);
  }
  return { el: group, refs };
}

function renderPart(
  part: Circle | Gap | Ring,
  pos: number,
  options: RenderOptions,
): { el: SVGElement | undefined; refs: Refs; newPos: number } {
  switch (part.type) {
    case PartType.Circle:
      return {
        ...renderCircle(part, 0, 0, options),
        newPos: pos + part.radius,
      };
    case PartType.Gap:
      return { el: undefined, refs: {}, newPos: pos + part.width };
    case PartType.Ring:
      return { ...renderRing(part, pos, options), newPos: pos + part.width };
  }
}

export const defaultOptions: RenderOptions = {
  includeTabIndexes: false,
};

export function renderMenu(
  menu: Menu,
  options: Partial<RenderOptions> = {},
): Rendered {
  const mergedOptions: RenderOptions = { ...defaultOptions, ...options };
  let pos = 0;
  const elements = [];
  const allRefs: Refs = {};
  for (const part of menu.structure) {
    const { el, refs, newPos } = renderPart(part, pos, mergedOptions);
    mergeRefs(allRefs, refs);
    pos = newPos;
    if (el) {
      elements.push(el);
    }
  }

  const size = pos * 2;
  const el = h.svg(
    {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      ...menu.attrs,
    },
    [h.g({ transform: `translate(${size / 2}, ${size / 2})` }, elements)],
  );
  addRef(allRefs, menu.attrs.ref, el, el);

  return { el, refs: allRefs };
}
