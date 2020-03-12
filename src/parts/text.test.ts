import { text, PartType } from "./parts";
import { AssertError } from "../util/assert";

it("text()", () => {
  const defaults = {
    type: PartType.Text,
    attrs: {},
  };

  expect(text("Hello"), "Content only").toEqual({
    ...defaults,
    text: "Hello",
  });

  expect(text("Foo", { fill: "red" }), "Content + attributes").toEqual({
    ...defaults,
    text: "Foo",
    attrs: { fill: "red" },
  });

  expect(() => text(123 as any), "Denies non-string content").toThrow(
    AssertError,
  );
});
