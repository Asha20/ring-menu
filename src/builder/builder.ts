import * as h from "./h";
import {
  Circle,
  Content,
  Menu,
  PartType,
  Ring,
  StaticSector,
} from "../parts/parts";

function radians(degrees: number) {
  return (degrees / 180) * Math.PI;
}

function toFixed(x: number, digits: number) {
  return Number(x.toFixed(digits));
}

export function renderContent(content: Content, x: number, y: number) {
  if (typeof content === "string") {
    const el = h.text(content, x, y, {
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      fill: "white",
      style: {
        userSelect: "none",
        msUserSelect: "none",
        webkitUserSelect: "none",
      },
    });
    return el;
  }

  return h.g({ transform: `translate(${x}, ${y})` }, [content]);
}

export function renderCircle(circle: Circle, x: number, y: number) {
  const el = h.circle(x, y, circle.radius, circle.attrs);
  if (circle.content === undefined) {
    return el;
  }
  return h.g({}, [el, renderContent(circle.content, x, y)]);
}

export function renderRing(ring: Ring, pos: number) {
  const sectors = ring.sectors.map(x => renderSector(ring.width, pos, x));
  return h.g(ring.attrs, sectors);
}

export function renderSector(
  width: number,
  innerRadius: number,
  sector: StaticSector,
) {
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
  });
  if (sector.content === undefined) {
    return el;
  }

  const centerAngle = radians(sector.offset + sector.angle / 2);
  const centerX = toFixed((r + width / 2) * Math.sin(centerAngle), 3);
  const centerY = toFixed((r + width / 2) * -Math.cos(centerAngle), 3);
  return h.g({}, [el, renderContent(sector.content, centerX, centerY)]);
}

export function renderMenu(menu: Menu) {
  let pos = 0;
  const elements = [];
  for (const el of menu.structure) {
    switch (el.type) {
      case PartType.Circle:
        elements.push(renderCircle(el, 0, 0));
        pos += el.radius;
        break;
      case PartType.Gap:
        pos += el.width;
        break;
      case PartType.Ring:
        elements.push(renderRing(el, pos));
        pos += el.width;
        break;
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
  return el;
}
