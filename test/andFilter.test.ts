import { AndFilter, EqualsFilter, NotFilter } from "../src/expressions";

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

  describe("complexity", () => {
    it("should encode AndFilter type with 2 EqualsFilters", () => {
      // Arrange
      const f = new AndFilter([
        new EqualsFilter("a", 1),
        new EqualsFilter("b", 2),
      ]);

      // Act / Assert
      expect(f.complexity).toBe(210);
    });

    it("should encode AndFilter type with 3 EqualsFilters", () => {
      // Arrange
      const f = new AndFilter([
        new EqualsFilter("a", 1),
        new EqualsFilter("b", 2),
        new EqualsFilter("c", 3),
      ]);

      // Act / Assert
      expect(f.complexity).toBe(310);
    });

    it("should encode AndFilter type for nested NotFilter", () => {
      // Arrange
      const f = new AndFilter([
        new EqualsFilter("a", 1),
        new NotFilter(new EqualsFilter("b", 2)),
      ]);

      // Act / Assert
      expect(f.complexity).toBe(11010);
    });

    it("should never be 0", () => {
      // Arrange
      const f = new AndFilter([new EqualsFilter("a", 1)]);

      // Act / Assert
      expect(f.complexity).toBeGreaterThan(0);
    });
  });
});
