import { EqualsFilter, OrFilter } from "../src/expressions";

describe("OrFilter", () => {
  it("should serialize with logic and nested filters", () => {
    // Arrange
    const f = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    );

    // Act
    const result = f.toDict();

    // Assert
    expect(result["logic"]).toBe("or");
    expect((result["filters"] as unknown[]).length).toBe(2);
  });

  it("should be equivalent to itself", () => {
    // Arrange
    const f = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    );

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should be equivalent to another OrFilter with same filters", () => {
    // Arrange
    const f1 = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    );
    const f2 = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    );

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should not be equivalent to a different OrFilter", () => {
    // Arrange
    const f1 = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    );
    const f2 = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "disabled"),
    );

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });

  it("should be equivalent to another OrFilter with same filters in different order", () => {
    // Arrange
    const f1 = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "pending"),
    );
    const f2 = new OrFilter(
      new EqualsFilter("status", "pending"),
      new EqualsFilter("status", "active"),
    );

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should be equivalent to an EqualsFilter if it only contains filters equivalent to that EqualsFilter", () => {
    // Arrange
    const f1 = new OrFilter(
      new EqualsFilter("status", "active"),
      new EqualsFilter("status", "active"),
    );
    const f2 = new EqualsFilter("status", "active");

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });
});
