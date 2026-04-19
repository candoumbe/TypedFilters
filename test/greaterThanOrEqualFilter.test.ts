import { GreaterThanOrEqualFilter } from "../src/expressions";

describe("GreaterThanOrEqualFilter", () => {
  it("should serialize to correct dict", () => {
    // Arrange
    const f = new GreaterThanOrEqualFilter("age", 18);

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: "age", op: "gte", value: 18 });
  });

  it("op field should be gte", () => {
    // Arrange / Act
    const dict = new GreaterThanOrEqualFilter("f", 0).toDict();

    // Assert
    expect(dict["op"]).toBe("gte");
  });

  it("should be equivalent to itself", () => {
    // Arrange
    const f = new GreaterThanOrEqualFilter("age", 18);

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should be equivalent to another GreaterThanOrEqualFilter with same values", () => {
    // Arrange
    const f1 = new GreaterThanOrEqualFilter("age", 18);
    const f2 = new GreaterThanOrEqualFilter("age", 18);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should not be equivalent to a different GreaterThanOrEqualFilter", () => {
    // Arrange
    const f1 = new GreaterThanOrEqualFilter("age", 18);
    const f2 = new GreaterThanOrEqualFilter("age", 21);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
