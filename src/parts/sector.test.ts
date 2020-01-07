import { sector, dynamic as d, PartType } from "./parts";
import { circle as hCircle } from "../builder/h";

it("Correct usage", () => {
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

it("Incorrect usage", () => {
  // We're intentionally passing wrong arguments for these tests,
  // so this function helps supress TS errors.
  const sector1 = (...args: any[]) => sector(...args);

  expect(() => sector1(() => {}), "Passing a function").toThrow();
  expect(() => sector1(1, 2, 3, 4), "Content of incorrect type").toThrow();
  expect(() => sector1("Hi", {}, 3), "Too many arguments").toThrow();
  expect(() => sector1(2, 3, "Hi", {}), "Arguments in wrong order").toThrow();
});
