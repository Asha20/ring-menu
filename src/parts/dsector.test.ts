import { circle as hCircle } from "../builder/h";
import { PartType, dsector, dynamic as d } from "./parts";

it("Correct usage", () => {
  const defaults = {
    type: PartType.Sector,
    angle: d(1),
    offset: undefined,
    content: undefined,
    attrs: {},
  };

  expect(dsector()).toEqual(defaults);

  expect(dsector("One")).toEqual({
    ...defaults,
    content: "One",
  });

  expect(dsector(hCircle(10, 10, 20))).toEqual({
    ...defaults,
    content: hCircle(10, 10, 20),
  });

  expect(dsector("One")).toEqual({
    ...defaults,
    content: "One",
  });

  expect(dsector("Two", { fill: "red" })).toEqual({
    ...defaults,
    content: "Two",
    attrs: { fill: "red" },
  });

  expect(dsector(4)).toEqual({
    ...defaults,
    angle: d(4),
  });

  expect(dsector(3, 4)).toEqual({
    ...defaults,
    angle: d(3),
    offset: d(4),
  });

  expect(dsector(3, 2, { stroke: "blue" })).toEqual({
    ...defaults,
    angle: d(3),
    offset: d(2),
    attrs: { stroke: "blue" },
  });

  expect(dsector("Three", 10)).toEqual({
    ...defaults,
    content: "Three",
    angle: d(10),
  });

  expect(dsector("Four", 10, 20)).toEqual({
    ...defaults,
    content: "Four",
    angle: d(10),
    offset: d(20),
  });

  expect(dsector("Five", 10, 20, { fill: "pink" })).toEqual({
    ...defaults,
    content: "Five",
    angle: d(10),
    offset: d(20),
    attrs: { fill: "pink" },
  });
});

it("Incorrect usage", () => {
  // We're intentionally passing wrong arguments for these tests,
  // so this function helps supress TS errors.
  const dsector1 = (...args: any[]) => dsector(...args);

  expect(() => dsector1(() => {}), "Passing a function").toThrow();
  expect(() => dsector1(1, 2, 3, 4), "Content of incorrect type").toThrow();
  expect(() => dsector1("Hi", {}, 3), "Too many arguments").toThrow();
  expect(() => dsector1(2, 3, "Hi", {}), "Arguments in wrong order").toThrow();
  expect(() => dsector1("Hi", 2, d(3)), "Passing dynamic offset").toThrow();
});
