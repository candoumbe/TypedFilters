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
});
