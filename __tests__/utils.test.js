const { capitalizeName } = require("../utils/capitalizeName");

describe("capitalizeName", () => {
  test("returns a single word capitalized", () => {
    expect(capitalizeName("test")).toBe("Test");
  });
  test("returns two or more words capitalized", () => {
    expect(capitalizeName("test test")).toBe("Test Test");
    expect(capitalizeName("testing Testing Testing")).toBe(
      "Testing Testing Testing"
    );
  });
  test("flattens incorrectly formatted words", () => {
    expect(capitalizeName("teSt tESt")).toBe("Test Test");
  });
  test("replaces double spaced or more words with a single space", () => {
    expect(capitalizeName("test  test")).toBe("Test Test");
    expect(capitalizeName("test                   test")).toBe("Test Test");
  });
});
