import { ring, PartType, dynamic as d } from "./parts";
import { AssertError } from "../util/assert";
import { sector } from "./sector";

it("Correct function overloading", () => {
  const defaults = {
    type: PartType.Ring,
    attrs: {},
  };

  expect(ring(50, [sector(20)])).toEqual({
    ...defaults,
    width: 50,
    sectors: [sector(20, 0)],
  });

  expect(ring(30, [sector(20)], { fill: "green" })).toEqual({
    ...defaults,
    width: 30,
    sectors: [sector(20, 0)],
    attrs: { fill: "green" },
  });

  expect(ring(30, 10, [sector(20), sector(40)])).toEqual({
    ...defaults,
    width: 30,
    sectors: [sector(20, 0), sector(40, 20 + 10)],
  });

  expect(ring(30, 10, [sector(20), sector(40)], { fill: "red" })).toEqual({
    ...defaults,
    width: 30,
    sectors: [sector(20, 0), sector(40, 20 + 10)],
    attrs: { fill: "red" },
  });

  expect(ring(5, 10, 20, [sector(40), sector(50)])).toEqual({
    ...defaults,
    width: 5,
    sectors: [sector(40, 20), sector(50, 20 + 40 + 10)],
  });

  expect(ring(5, 10, 20, [sector(40), sector(50)], { fill: "blue" })).toEqual({
    ...defaults,
    width: 5,
    sectors: [sector(40, 20), sector(50, 20 + 40 + 10)],
    attrs: { fill: "blue" },
  });
});

it("Incorrect function overloading", () => {
  // We're intentionally passing wrong arguments for these tests,
  // so this function helps supress TS errors.
  const ring1 = (...args: any[]) => (ring as any)(...args);

  const sec = sector();

  expect(() => ring1(() => {}), "Passing a function").toThrow();
  expect(() => ring1("a", [sec]), "Width of incorrect type").toThrow();
  expect(() => ring1(3, [sec], {}, 4), "Too many arguments").toThrow();
  expect(() => ring1(40, {}, [sec]), "Arguments in wrong order").toThrow();
});

it("ring()", () => {
  expect(() => ring(10, 0, 0, [] as any), "No sectors provided").toThrow(
    AssertError,
  );
});
