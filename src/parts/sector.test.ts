import { circle as hCircle } from "../builder/h";
import { PartType, sector, dynamic as d } from "./parts";
import { AssertError } from "../util/assert";

it("Correct function overloading", () => {
  const defaults = {
    type: PartType.Sector,
    angle: d(1),
    offset: undefined,
    content: undefined,
    attrs: {},
  };

  expect(sector()).toEqual(defaults);

  expect(sector("One")).toEqual({
    ...defaults,
    content: "One",
  });

  expect(sector(hCircle(10, 10, 20))).toEqual({
    ...defaults,
    content: hCircle(10, 10, 20),
  });

  expect(sector("One")).toEqual({
    ...defaults,
    content: "One",
  });

  expect(sector("Two", { fill: "red" })).toEqual({
    ...defaults,
    content: "Two",
    attrs: { fill: "red" },
  });

  expect(sector(30)).toEqual({
    ...defaults,
    angle: 30,
  });

  expect(sector(d(2))).toEqual({
    ...defaults,
    angle: d(2),
  });

  expect(sector(30, 40)).toEqual({
    ...defaults,
    angle: 30,
    offset: 40,
  });

  expect(sector(30, d(2), { stroke: "blue" })).toEqual({
    ...defaults,
    angle: 30,
    offset: d(2),
    attrs: { stroke: "blue" },
  });

  expect(sector("Three", 10)).toEqual({
    ...defaults,
    content: "Three",
    angle: 10,
  });

  expect(sector("Four", 10, 20)).toEqual({
    ...defaults,
    content: "Four",
    angle: 10,
    offset: 20,
  });

  expect(sector("Five", 10, 20, { fill: "pink" })).toEqual({
    ...defaults,
    content: "Five",
    angle: 10,
    offset: 20,
    attrs: { fill: "pink" },
  });
});

it("Incorrect function overloading", () => {
  // We're intentionally passing wrong arguments for these tests,
  // so this function helps supress TS errors.
  const sector1 = (...args: any[]) => sector(...args);

  expect(() => sector1(() => {}), "Passing a function").toThrow();
  expect(() => sector1(1, 2, 3, 4), "Content of incorrect type").toThrow();
  expect(() => sector1("Hi", {}, 3), "Too many arguments").toThrow();
  expect(() => sector1(2, 3, "Hi", {}), "Arguments in wrong order").toThrow();
});

it("Usage", () => {
  expect(() => sector(100), "Accepts angle in range 0-360").not.toThrow();
  expect(() => sector(-10), "Denies negative angle").toThrow(AssertError);
  expect(() => sector(400), "Denies angle over 360").toThrow(AssertError);

  expect(() => sector(100, 20), "Accepts offset in range 0-360").not.toThrow();
  expect(() => sector(100, -3), "Denies negative offset").toThrow(AssertError);
  expect(() => sector(100, 500), "Denies offset over 360").toThrow(AssertError);
});
