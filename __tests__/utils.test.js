const { formatName } = require("../utils/formatName.js");
const { generateNewId } = require("../utils/generateNewId.js");

describe("capitalizeName", () => {
  test("returns a single word capitalized", () => {
    expect(formatName("test")).toBe("Test");
  });
  test("returns two or more words capitalized", () => {
    expect(formatName("test test")).toBe("Test Test");
    expect(formatName("testing Testing Testing")).toBe(
      "Testing Testing Testing"
    );
  });
  test("if a word starts with a special character capitalize the second letter", () => {
    expect(formatName("(test test)")).toBe("(Test Test)");
  });
  test("flattens incorrectly formatted words", () => {
    expect(formatName("teSt tESt")).toBe("Test Test");
  });
  test("replaces double spaced or more words with a single space", () => {
    expect(formatName("test  test")).toBe("Test Test");
    expect(formatName("test                   test")).toBe("Test Test");
  });
  test("replaces incorrectly formatted scientific names into the first words without special characters", () => {
    expect(formatName("Test testus 'test'", "scientific")).toBe("Test Testus");
    expect(formatName("Test 'testus 'test' test", "scientific")).toBe("Test");
    expect(formatName("Test testus 'test' test", "scientific")).toBe(
      "Test Testus"
    );
    expect(formatName("'Test test", "scientific")).toBe("");
  });
});

describe("generateNewId()", () => {
  it("returns the maximum number in an array with one added", () => {
    expect(generateNewId([1, 2, 3])).toBe(4);
  });
  it("returns 1 if the array is empty", () => {
    expect(generateNewId([])).toBe(1);
  });
});
