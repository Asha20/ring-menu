import { AssertError } from "../util/assert";
import {
  circle,
  dsector,
  dynamic as d,
  gap,
  menu,
  resolveAngle,
  resolveSectors,
  ring,
  sector,
  calculateDynamicUnit,
} from "./parts";

const FULL_ANGLE = 360;

it("dynamic()", () => {
  expect(() => d(1), "Accepts positive factor").not.toThrow(AssertError);
  expect(() => d(0), "Denies non-positive factor").toThrow(AssertError);
});

it("resolveAngle()", () => {
  expect(resolveAngle(d(1), 2), "2 item long resolution chain").toBe(2);
  expect(resolveAngle(d(1), d(2), 3), "3 item long resolution chain").toBe(3);
  expect(resolveAngle(d(1), 2, 3), "Resolves on first static value").toBe(2);
  expect(
    () => resolveAngle(d(1), d(2)),
    "Last angle in chain must be static",
  ).toThrow();
});

it("circle()", () => {
  expect(() => circle(100), "Accepts positive radius").not.toThrow();
  expect(() => circle(0), "Denies non-positive radius").toThrow(AssertError);
});

it("gap()", () => {
  expect(() => gap(100), "Accepts positive width").not.toThrow();
  expect(() => gap(0), "Denies non-positive width").toThrow(AssertError);
});

it("sector()", () => {
  expect(() => sector(100), "Accepts angle in range 0-360").not.toThrow();
  expect(() => sector(-10), "Denies negative angle").toThrow(AssertError);
  expect(() => sector(400), "Denies angle over 360").toThrow(AssertError);

  expect(() => sector(100, 20), "Accepts offset in range 0-360").not.toThrow();
  expect(() => sector(100, -3), "Denies negative offset").toThrow(AssertError);
  expect(() => sector(100, 500), "Denies offset over 360").toThrow(AssertError);
});

it("ring()", () => {
  expect(() => ring(10, 0, 0, [] as any)).toThrow(AssertError);
});

it("menu()", () => {
  expect(() => menu([] as any), "Denies empty structure").toThrow(AssertError);
  expect(
    () => menu([circle(10), gap(10)]),
    "Accepts valid structure",
  ).not.toThrow(AssertError);
  expect(
    () => menu([gap(10), circle(10)] as any),
    "Circle can only be in the center",
  ).toThrow(AssertError);
});

it("calculateDynamicUnit()", () => {
  const u1 = calculateDynamicUnit(10, [sector(30)]);
  expect(u1, "Dynamic unit is 0 if there are 0 dynamic factors").toBe(0);

  const u2 = calculateDynamicUnit(20, [dsector(1)]);
  expect(u2, "Claims all space that isn't static 1").toBe(FULL_ANGLE - 20);

  const u3 = calculateDynamicUnit(20, [sector(10), sector(d(1), 30)]);
  expect(u3, "Claims all space that isn't static 2").toBe(
    FULL_ANGLE - 10 - 20 - 30,
  );

  const u4 = calculateDynamicUnit(30, [dsector(2)]);
  expect(u4, "Distributes equally over all factors").toBe(
    (FULL_ANGLE - 30) / 2,
  );
});

it("resolveSectors() with static angles", () => {
  expect(
    resolveSectors(0, 0, [sector(30), sector(40), sector(50)]),
    "Offset accumulates as sectors are traversed",
  ).toEqual([sector(30, 0), sector(40, 30), sector(50, 70)]);

  expect(
    resolveSectors(30, 0, [sector(20), sector(30)]),
    "Ring offset shifts the entire ring",
  ).toEqual([sector(20, 30), sector(30, 50)]);

  expect(
    resolveSectors(0, 20, [sector(10), sector(10), sector(10)]),
    "Separator acts as a default value for sector offsets if missing",
  ).toEqual([sector(10, 0), sector(10, 30), sector(10, 60)]);

  expect(
    resolveSectors(0, 20, [sector(10), sector(30, 50), sector(10)]),
    "Offset of a sector overrides separator when present",
  ).toEqual([sector(10, 0), sector(30, 30), sector(10, 110)]);
});

it("resolveSectors() with dynamic angles", () => {
  expect(
    resolveSectors(0, 0, [dsector(1)]),
    "Single sector expands to fill the entire ring",
  ).toEqual([sector(360, 0)]);

  expect(
    resolveSectors(0, 0, [dsector(1), dsector(1)]),
    "Two sectors of factor 1 divide the ring equally",
  ).toEqual([sector(180, 0), sector(180, 180)]);

  expect(
    resolveSectors(0, 0, [dsector(2), dsector(1)]),
    "Sector with double the factor has double the size",
  ).toEqual([sector(240, 0), sector(120, 240)]);

  expect(
    resolveSectors(0, 0, [dsector(1, 1), dsector(1)]),
    "Sectors can have a dynamic offset",
  ).toEqual([sector(120, 0), sector(120, 240)]);

  expect(
    resolveSectors(0, d(1), [dsector(1), dsector(1)]),
    "Dynamic separator acts as a default value for sector offsets if missing",
  ).toEqual([sector(90, 0), sector(90, 180)]);

  expect(
    resolveSectors(d(1), 0, [dsector(1), dsector(2)]),
    "Ring offset can be dynamic",
  ).toEqual([sector(120, 120), sector(240, 240)]);

  expect(
    resolveSectors(0, 60, [dsector(1), dsector(1)]),
    "Dynamic angles distribute over the full angle minus sum of static angles 1",
  ).toEqual([sector(120, 0), sector(120, 180)]);

  expect(
    resolveSectors(0, 60, [dsector(1), sector(d(1), 30), dsector(1)]),
    "Dynamic angles distribute over the full angle minus sum of static angles 2",
  ).toEqual([sector(70, 0), sector(70, 130), sector(70, 230)]);
});
