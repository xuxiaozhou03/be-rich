import { greet } from "../index";

describe("greet function", () => {
  test("should greet with name", () => {
    expect(greet("World")).toBe("Hello, World!");
  });

  test("should greet with custom name", () => {
    expect(greet("TypeScript")).toBe("Hello, TypeScript!");
  });
});
