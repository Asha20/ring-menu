import { circle, PartType } from "./parts";
import { circle as hCircle } from "../builder/h";

it("Correct usage", () => {
  const defaults = {
    type: PartType.Circle,
    content: undefined,
    attrs: {},
  };

  expect(circle(30)).toEqual({
    ...defaults,
    radius: 30,
  });

  expect(circle(20, { fill: "red" })).toEqual({
    ...defaults,
    radius: 20,
    attrs: { fill: "red" },
  });

  expect(circle(10, "Hi")).toEqual({
    ...defaults,
    radius: 10,
    content: "Hi",
  });

  expect(circle(50, hCircle(0, 0, 10))).toEqual({
    ...defaults,
    radius: 50,
    content: hCircle(0, 0, 10),
  });

  expect(circle(50, "Hi", { stroke: "black" })).toEqual({
    ...defaults,
    radius: 50,
    content: "Hi",
    attrs: { stroke: "black" },
  });
});
