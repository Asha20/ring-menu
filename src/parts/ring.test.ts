import { ring } from "./parts";
import { AssertError } from "../util/assert";

it("ring()", () => {
  expect(() => ring(10, 0, 0, [] as any)).toThrow(AssertError);
});
