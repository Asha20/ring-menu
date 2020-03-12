import { gap } from "./parts";
import { AssertError } from "../util/assert";

it("gap()", () => {
  expect(() => gap(100), "Accepts positive width").not.toThrow();
  expect(() => gap(0), "Denies non-positive width").toThrow(AssertError);
  expect(() => gap("a" as any), "Denies non-number argument").toThrow(
    AssertError,
  );
});
