import { LessThanOrEqualFilter } from "../src/expressions";

describe("LessThanOrEqualFilter", () => {
  it("should serialize to correct dict", () => {
    // Arrange
    const f = new LessThanOrEqualFilter("age", 65);

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: "age", op: "lte", value: 65 });
  });

  it("op field should be lte", () => {
    // Arrange / Act
    const dict = new LessThanOrEqualFilter("f", 0).toDict();

    // Assert
    expect(dict["op"]).toBe("lte");
  });

  it("should be equivalent to itself", () => {
    // Arrange
    const f = new LessThanOrEqualFilter("age", 65);

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should be equivalent to another LessThanOrEqualFilter with same values", () => {
    // Arrange
    const f1 = new LessThanOrEqualFilter("age", 65);
    const f2 = new LessThanOrEqualFilter("age", 65);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should not be equivalent to a different LessThanOrEqualFilter", () => {
    // Arrange
    const f1 = new LessThanOrEqualFilter("age", 65);
    const f2 = new LessThanOrEqualFilter("age", 50);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });

  describe("complexity", () => {
    it("should be 1", () => {
      // Arrange
      const f = new LessThanOrEqualFilter("age", 65);

      // Act / Assert
      expect(f.complexity).toBe(8);
    });

    it("should never be 0", () => {
      // Arrange
      const f = new LessThanOrEqualFilter("age", 65);

      // Act / Assert
      expect(f.complexity).toBeGreaterThan(0);
    });
  });
});
