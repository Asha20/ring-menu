import { renderCircle, renderMenu, renderRing, renderSector } from "./builder";
import {
  circle,
  Content,
  dsector,
  dynamic as d,
  gap,
  menu,
  ring,
  sector,
  StaticSector,
} from "../parts/parts";
import * as h from "./h";
import { AnyObject } from "../util/util";

const ssector = (angle: number, offset?: number, content?: Content) =>
  sector(angle, offset, content) as StaticSector;

it("renderCircle()", () => {
  const c1 = renderCircle(circle(30), 0, 0);
  expect(c1).toMatchInlineSnapshot(`
    <circle
      cx="0"
      cy="0"
      r="30"
    />
  `);
});

it("renderCircle() with content", () => {
  const c1 = renderCircle(circle(30, "Hello"), 0, 0);
  expect(c1).toMatchInlineSnapshot(`
    <g>
      <circle
        cx="0"
        cy="0"
        r="30"
      />
      <text
        dominant-baseline="middle"
        fill="white"
        style="user-select: none; webkit-user-select: none;"
        text-anchor="middle"
        x="0"
        y="0"
      >
        Hello
      </text>
    </g>
  `);

  const c2 = renderCircle(
    circle(30, h.circle(0, 0, 10, { fill: "red" })),
    0,
    0,
  );
  expect(c2).toMatchInlineSnapshot(`
    <g>
      <circle
        cx="0"
        cy="0"
        r="30"
      />
      <g
        transform="translate(0, 0)"
      >
        <circle
          cx="0"
          cy="0"
          fill="red"
          r="10"
        />
      </g>
    </g>
  `);
});

it("renderSector()", () => {
  const s1 = renderSector(100, 30, ssector(90, 0));
  expect(s1).toMatchInlineSnapshot(`
    <path
      d="
        M 0 -30
        L 0 -130
        a 130 130 0 0 1 130 129.987
        l -100 0.01
        A 30 30 0 0 0 0 -30
      "
      transform="rotate(0, 0, 0)"
    />
  `);

  const s2 = renderSector(50, 0, ssector(120, 60));
  expect(s2).toMatchInlineSnapshot(`
    <path
      d="
        M 0 0
        L 0 -50
        a 50 50 0 0 1 43.304 74.996
        l -43.304 -24.996
        A 0 0 0 0 0 0 0
      "
      transform="rotate(60, 0, 0)"
    />
  `);
});

it("renderSector() with content", () => {
  const s1 = renderSector(100, 30, ssector(90, 0, "Foo"));
  expect(s1).toMatchInlineSnapshot(`
    <g>
      <path
        d="
        M 0 -30
        L 0 -130
        a 130 130 0 0 1 130 129.987
        l -100 0.01
        A 30 30 0 0 0 0 -30
      "
        transform="rotate(0, 0, 0)"
      />
      <text
        dominant-baseline="middle"
        fill="white"
        style="user-select: none; webkit-user-select: none;"
        text-anchor="middle"
        x="56.569"
        y="-56.569"
      >
        Foo
      </text>
    </g>
  `);

  const s2 = renderSector(
    100,
    30,
    ssector(90, 0, h.circle(0, 0, 10, { fill: "blue" })),
  );
  expect(s2).toMatchInlineSnapshot(`
    <g>
      <path
        d="
        M 0 -30
        L 0 -130
        a 130 130 0 0 1 130 129.987
        l -100 0.01
        A 30 30 0 0 0 0 -30
      "
        transform="rotate(0, 0, 0)"
      />
      <g
        transform="translate(56.569, -56.569)"
      >
        <circle
          cx="0"
          cy="0"
          fill="blue"
          r="10"
        />
      </g>
    </g>
  `);
});

it("renderRing()", () => {
  const r1 = renderRing(ring(100, 0, 0, [dsector(1, 0), dsector(2, 1)]), 0);
  expect(r1).toMatchInlineSnapshot(`
    <g>
      <path
        d="
        M 0 0
        L 0 -100
        a 100 100 0 0 1 100 99.99
        l -100 0.01
        A 0 0 0 0 0 0 0
      "
        transform="rotate(0, 0, 0)"
      />
      <path
        d="
        M 0 0
        L 0 -100
        a 100 100 0 0 1 0.01 200
        l -0.01 -100
        A 0 0 0 0 0 0 0
      "
        transform="rotate(90, 0, 0)"
      />
    </g>
  `);

  const r2 = renderRing(ring(100, d(1), 30, [dsector(2), sector(30, 60)]), 0);
  expect(r2).toMatchInlineSnapshot(`
    <g>
      <path
        d="
        M 0 0
        L 0 -100
        a 100 100 0 1 1 -86.598 150.009
        l 86.598 -50.009
        A 0 0 0 1 0 0 0
      "
        transform="rotate(120, 0, 0)"
      />
      <path
        d="
        M 0 0
        L 0 -100
        a 100 100 0 0 1 49.991 13.392
        l -49.991 86.608
        A 0 0 0 0 0 0 0
      "
        transform="rotate(390, 0, 0)"
      />
    </g>
  `);
});

it("build()", () => {
  const m1 = renderMenu(
    menu([
      circle(25),
      gap(50),
      ring(50, 0, 0, [sector(90), sector(30), sector(50, 20)]),
    ]),
  );

  expect(m1).toMatchInlineSnapshot(`
    <svg
      height="250"
      viewBox="0 0 250 250"
      width="250"
    >
      <g
        transform="translate(125, 125)"
      >
        <circle
          cx="0"
          cy="0"
          r="25"
        />
        <g>
          <path
            d="
        M 0 -75
        L 0 -125
        a 125 125 0 0 1 125 124.988
        l -50 0.005
        A 75 75 0 0 0 0 -75
      "
            transform="rotate(0, 0, 0)"
          />
          <path
            d="
        M 0 -75
        L 0 -125
        a 125 125 0 0 1 62.489 16.741
        l -24.996 43.304
        A 75 75 0 0 0 0 -75
      "
            transform="rotate(90, 0, 0)"
          />
          <path
            d="
        M 0 -75
        L 0 -125
        a 125 125 0 0 1 95.748 44.642
        l -38.299 32.143
        A 75 75 0 0 0 0 -75
      "
            transform="rotate(120, 0, 0)"
          />
        </g>
      </g>
    </svg>
  `);

  const m2 = renderMenu(
    menu([circle(50), ring(100, d(0.5), d(1), [sector(30), sector(d(1))])]),
  );

  expect(m2).toMatchInlineSnapshot(`
    <svg
      height="300"
      viewBox="0 0 300 300"
      width="300"
    >
      <g
        transform="translate(150, 150)"
      >
        <circle
          cx="0"
          cy="0"
          r="50"
        />
        <g>
          <path
            d="
        M 0 -50
        L 0 -150
        a 150 150 0 0 1 74.987 20.089
        l -49.991 86.608
        A 50 50 0 0 0 0 -50
      "
            transform="rotate(55, 0, 0)"
          />
          <path
            d="
        M 0 -50
        L 0 -150
        a 150 150 0 0 1 140.959 201.289
        l -93.973 -34.193
        A 50 50 0 0 0 0 -50
      "
            transform="rotate(195, 0, 0)"
          />
        </g>
      </g>
    </svg>
  `);
});

it("Rendering a menu part with attributes", () => {
  const circleWithAttributes = (attrs: AnyObject) =>
    renderCircle(circle(50, undefined, attrs), 0, 0);

  const c1 = circleWithAttributes({ id: 3 });
  expect(c1.getAttribute("id"), "Plain id attribute").toBe("3");

  const c2 = circleWithAttributes({ style: "fill: red;" });
  expect(c2.getAttribute("style"), "style as a string").toBe("fill: red;");

  const c3 = circleWithAttributes({ style: { stroke: "red" } });
  expect(c3.getAttribute("style"), "style as an object").toBe("stroke: red;");

  const c4 = circleWithAttributes({ class: "foo bar" });
  expect(c4.getAttribute("class"), "Classes separated by one space").toBe(
    "foo bar",
  );

  const c5 = circleWithAttributes({ className: "one    two three-four" });
  expect(c5.getAttribute("class"), "Classes separated by multiple spaces").toBe(
    "one two three-four",
  );

  const c6 = circleWithAttributes({ textContent: "foo" });
  expect(c6.textContent, "Special handling of textContent").toBe("foo");
});
