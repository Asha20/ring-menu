import { AssertError } from "../util/assert";
import { circle, gap, menu } from "./parts";

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
