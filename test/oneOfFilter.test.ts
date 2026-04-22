import { EqualsFilter, OneOfFilter } from "../src/expressions";

describe("OneOfFilter", () => {
  it("should serialize with logic and nested filters", () => {
    // Arrange
    const f = new OneOfFilter([
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    ]);

    // Act
    const result = f.toDict();

    // Assert
    expect(result["logic"]).toBe("or");
    expect((result["filters"] as unknown[]).length).toBe(2);
  });

  it("should be equivalent to itself", () => {
    // Arrange
    const f = new OneOfFilter([
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    ]);

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should be equivalent to another OneOfFilter with same filters", () => {
    // Arrange
    const f1 = new OneOfFilter([
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    ]);
    const f2 = new OneOfFilter([
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    ]);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should not be equivalent to a different OneOfFilter", () => {
    // Arrange
    const f1 = new OneOfFilter([
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    ]);
    const f2 = new OneOfFilter([
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "disabled"),
    ]);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });

  describe("complexity", () => {
    it("should encode OneOfFilter type and include children complexities", () => {
      // Arrange
      const f = new OneOfFilter([
        new EqualsFilter("status", "active"),
        new EqualsFilter("status", "pending"),
        new EqualsFilter("status", "disabled"),
      ]);

      // Act / Assert
      expect(f.complexity).toBe(312);
    });

    it("should be at least 1", () => {
      // Arrange
      const f = new OneOfFilter([new EqualsFilter("status", "active")]);

      // Act / Assert
      expect(f.complexity).toBeGreaterThanOrEqual(1);
    });

    it("should never be 0", () => {
      // Arrange
      const f = new OneOfFilter([
        new EqualsFilter("status", "active"),
        new EqualsFilter("status", "pending"),
      ]);

      // Act / Assert
      expect(f.complexity).toBeGreaterThan(0);
    });
  });
});
