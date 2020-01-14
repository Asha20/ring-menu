import {
  renderCircle,
  renderMenu,
  renderRing,
  renderSector,
  defaultOptions,
} from "./builder";
import {
  circle,
  dsector,
  dynamic as d,
  gap,
  menu,
  ring,
  sector,
  StaticSector,
  text,
} from "../parts/parts";
import * as h from "./h";
import { AnyObject } from "../util/util";
import { AssertError } from "../util/assert";

it("renderCircle()", () => {
  const c1 = renderCircle(circle(30), 0, 0, defaultOptions);
  expect(c1.el).toMatchInlineSnapshot(`
    <circle
      cx="0"
      cy="0"
      r="30"
    />
  `);
});

it("renderCircle() with content", () => {
  const c1 = renderCircle(circle(30, "Hello"), 0, 0, defaultOptions);
  expect(c1.el).toMatchInlineSnapshot(`
    <g>
      <circle
        cx="0"
        cy="0"
        r="30"
      />
      <text
        dominant-baseline="middle"
        fill="black"
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
    defaultOptions,
  );
  expect(c2.el).toMatchInlineSnapshot(`
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
  const s1 = renderSector(
    100,
    30,
    sector(90, 0) as StaticSector,
    defaultOptions,
  );
  expect(s1.el).toMatchInlineSnapshot(`
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

  const s2 = renderSector(
    50,
    0,
    sector(120, 60) as StaticSector,
    defaultOptions,
  );
  expect(s2.el).toMatchInlineSnapshot(`
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
  const s1 = renderSector(
    100,
    30,
    sector("Foo", 90, 0) as StaticSector,
    defaultOptions,
  );
  expect(s1.el).toMatchInlineSnapshot(`
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
        fill="black"
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
    sector(h.circle(0, 0, 10, { fill: "blue" }), 90, 0) as StaticSector,
    defaultOptions,
  );
  expect(s2.el).toMatchInlineSnapshot(`
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
  const r1 = renderRing(
    ring(100, 0, 0, [dsector(1, 0), dsector(2, 1)]),
    0,
    defaultOptions,
  );
  expect(r1.el).toMatchInlineSnapshot(`
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

  const r2 = renderRing(
    ring(100, 30, d(1), [dsector(2), sector(30, 60)]),
    0,
    defaultOptions,
  );
  expect(r2.el).toMatchInlineSnapshot(`
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

it("renderMenu()", () => {
  const m1 = renderMenu(
    menu([
      circle(25),
      gap(50),
      ring(50, 0, 0, [sector(90), sector(30), sector(50, 20)]),
    ]),
  );

  expect(m1.el).toMatchInlineSnapshot(`
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
    menu([circle(50), ring(100, d(1), d(0.5), [sector(30), sector(d(1))])]),
  );

  expect(m2.el).toMatchInlineSnapshot(`
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

it("Refs", () => {
  const m1 = renderMenu(
    menu(
      [
        circle(30, { ref: "circle", class: "circle" }),
        ring(40, [sector("Sec1", { ref: "sector1", class: "sector1" })], {
          ref: "ring",
          class: "ring",
        }),
        ring(50, [
          sector(text("text", { ref: "text", class: "text" }), {
            ref: "sector2",
            class: "sector2",
          }),
        ]),
      ],
      { ref: "menu", class: "menu" },
    ),
  );

  expect(m1.refs.circle.classList.contains("circle")).toBeTruthy();
  expect(m1.refs.sector1.classList.contains("sector1")).toBeTruthy();
  expect(m1.refs.sector2.classList.contains("sector2")).toBeTruthy();
  expect(m1.refs.text.classList.contains("text")).toBeTruthy();
  expect(m1.refs.ring.classList.contains("ring")).toBeTruthy();
  expect(m1.refs.menu.classList.contains("menu")).toBeTruthy();

  expect(
    () => renderMenu(menu([circle(50, { ref: "foo" })], { ref: "foo" })),
    "Duplicate refs",
  ).toThrow(AssertError);

  expect(
    () => renderMenu(menu([circle(50)], { ref: 123 })),
    "Non-string ref",
  ).toThrow(AssertError);
});

it("Rendering a menu part with attributes", () => {
  const circleWithAttributes = (attrs: AnyObject) =>
    renderCircle(circle(50, attrs), 0, 0, defaultOptions);

  const c1 = circleWithAttributes({ id: 3 });
  expect(c1.el.getAttribute("id"), "Plain id attribute").toBe("3");

  const c2 = circleWithAttributes({ style: "fill: red;" });
  expect(c2.el.getAttribute("style"), "style as a string").toBe("fill: red;");

  const c3 = circleWithAttributes({ style: { stroke: "red" } });
  expect(c3.el.getAttribute("style"), "style as an object").toBe(
    "stroke: red;",
  );

  const c4 = circleWithAttributes({ class: "foo bar" });
  expect(c4.el.getAttribute("class"), "Classes separated by one space").toBe(
    "foo bar",
  );

  const c5 = circleWithAttributes({ className: "one    two three-four" });
  expect(
    c5.el.getAttribute("class"),
    "Classes separated by multiple spaces",
  ).toBe("one two three-four");

  const c6 = circleWithAttributes({ textContent: "foo" });
  expect(c6.el.textContent, "Special handling of textContent").toBe("foo");
});

it("tabIndexes", () => {
  const m1 = renderMenu(
    menu([
      circle(50, { ref: "circle" }),
      ring(50, [
        sector("1", { ref: "sector1" }),
        sector("2", { ref: "sector2" }),
      ]),
    ]),
    { includeTabIndexes: true },
  );

  expect(m1.refs.circle.getAttribute("tabindex")).toBe("0");
  expect(m1.refs.sector1.getAttribute("tabindex")).toBe("0");
  expect(m1.refs.sector2.getAttribute("tabindex")).toBe("0");
});
