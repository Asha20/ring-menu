import { dynamic as d } from "./parts";
import { AssertError } from "../util/assert";

it("dynamic()", () => {
  expect(() => d(1), "Accepts positive factor").not.toThrow(AssertError);
  expect(() => d(0), "Denies non-positive factor").toThrow(AssertError);
});
