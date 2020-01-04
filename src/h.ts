import { AnyObject } from "./util";

function hs<T extends keyof SVGElementTagNameMap>(tagName: T) {
  return function _h(attrs: AnyObject, children: SVGElement[] = []) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    for (const key of Object.keys(attrs)) {
      el.setAttribute(key, attrs[key]);
    }
    children.forEach(child => el.appendChild(child));
    return el;
  };
}

export function applyAttributes<T extends Element>(el: T, attrs: AnyObject) {
  Object.keys(attrs).forEach(key => {
    const value = attrs[key];
    if (key === "class" || key === "className") {
      el.classList.add(...value.split(/\s+/));
      return;
    }
    el.setAttribute(key, value);
  });
  return el;
}

export function circle(cx: number, cy: number, r: number) {
  return hs("circle")({ cx, cy, r });
}

export function path(d: string, attrs: AnyObject = {}) {
  return hs("path")({ d, ...attrs });
}

export const g = hs("g");
export const svg = hs("svg");
