import { AndFilter, EqualsFilter } from "../src/expressions";

describe("AndFilter", () => {
  it("should serialize with logic and nested filters", () => {
    // Arrange
    const f = new AndFilter([
      new EqualsFilter("a", 1),
      new EqualsFilter("b", 2),
    ]);

    // Act
    const result = f.toDict();

    // Assert
    expect(result["logic"]).toBe("and");
    expect((result["filters"] as unknown[]).length).toBe(2);
  });

  it("should be equivalent to itself", () => {
    // Arrange
    const f = new AndFilter([
      new EqualsFilter("a", 1),
      new EqualsFilter("b", 2),
    ]);

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should be equivalent to another AndFilter with same filters", () => {
    // Arrange
    const f1 = new AndFilter([
      new EqualsFilter("a", 1),
      new EqualsFilter("b", 2),
    ]);
    const f2 = new AndFilter([
      new EqualsFilter("a", 1),
      new EqualsFilter("b", 2),
    ]);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should not be equivalent to a different AndFilter", () => {
    // Arrange
    const f1 = new AndFilter([
      new EqualsFilter("a", 1),
      new EqualsFilter("b", 2),
    ]);
    const f2 = new AndFilter([
      new EqualsFilter("a", 1),
      new EqualsFilter("b", 3), // different value
    ]);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
