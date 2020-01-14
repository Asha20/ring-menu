import { AnyObject } from "../util/util";

function hs<T extends keyof SVGElementTagNameMap>(tagName: T) {
  return function _h(attrs: AnyObject, children: SVGElement[] = []) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    setAttributes(el, attrs);
    children.forEach(child => el.appendChild(child));
    return el;
  };
}

export function setAttributes<T extends SVGElement>(el: T, attrs: AnyObject) {
  Object.keys(attrs).forEach(key => {
    const value = attrs[key];
    if (key === "ref") {
      return;
    }
    if (key === "class" || key === "className") {
      el.classList.add(...value.split(/\s+/));
      return;
    }
    if (key === "textContent") {
      el.textContent = value;
      return;
    }
    if (key === "style" && typeof value === "object") {
      Object.assign(el.style, value);
      return;
    }
    el.setAttribute(key, value);
  });
  return el;
}

export function circle(
  cx: number,
  cy: number,
  r: number,
  attrs: AnyObject = {},
) {
  return hs("circle")({ cx, cy, r, ...attrs });
}

export function path(d: string, attrs: AnyObject = {}) {
  return hs("path")({ d, ...attrs });
}

export function text(
  textContent: string,
  x: number,
  y: number,
  attrs: AnyObject = {},
) {
  return hs("text")({ textContent, x, y, ...attrs });
}

export const g = hs("g");
export const svg = hs("svg");
