import { AndFilter, EqualsFilter, OrFilter } from "../src/expressions";

const isEquivalentTo = (left: unknown, right: unknown): boolean => {
  return (
    left as { isEquivalentTo: (other: unknown) => boolean }
  ).isEquivalentTo(right);
};

describe("EqualsFilter", () => {
  it("should serialize to correct dict", () => {
    // Arrange
    const f = new EqualsFilter("name", "Batman");

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: "name", op: "eq", value: "Batman" });
  });

  it("should store field and value", () => {
    // Arrange / Act
    const f = new EqualsFilter("age", 30);

    // Assert
    expect(f.field).toBe("age");
    expect(f.value).toBe(30);
  });

  it("op field should be eq", () => {
    // Arrange / Act
    const dict = new EqualsFilter("f", "v").toDict();

    // Assert
    expect(dict["op"]).toBe("eq");
  });

  describe("isEquivalentTo", () => {
    it("should be reflexive for EqualsFilter", () => {
      // Arrange
      const filter = new EqualsFilter("name", "Batman");

      // Act
      const result = isEquivalentTo(filter, filter);

      // Assert
      expect(result).toBe(true);
    });

    it("should be reflexive for AndFilter", () => {
      // Arrange
      const filter = new AndFilter([
        new EqualsFilter("name", "Batman"),
        new EqualsFilter("city", "Gotham"),
      ]);

      // Act
      const result = isEquivalentTo(filter, filter);

      // Assert
      expect(result).toBe(true);
    });

    it("should be symmetric for equivalent EqualsFilter instances", () => {
      // Arrange
      const left = new EqualsFilter("name", "Batman");
      const right = new EqualsFilter("name", "Batman");

      // Act
      const leftToRight = isEquivalentTo(left, right);
      const rightToLeft = isEquivalentTo(right, left);

      // Assert
      expect(leftToRight).toBe(true);
      expect(rightToLeft).toBe(true);
    });

    it("should treat EqualsFilter and AndFilter([equalFilter, equalFilter]) as equivalent in both directions", () => {
      // Arrange
      const equalFilter = new EqualsFilter("name", "Batman");
      const andFilter = new AndFilter([equalFilter, equalFilter]);

      // Act
      const equalsToAnd = isEquivalentTo(equalFilter, andFilter);
      const andToEquals = isEquivalentTo(andFilter, equalFilter);

      // Assert
      expect(equalsToAnd).toBeTruthy();
      expect(andToEquals).toBeTruthy();
    });

    it("should not be equivalent to a different EqualsFilter", () => {
      // Arrange
      const left = new EqualsFilter("name", "Batman");
      const right = new EqualsFilter("name", "Superman");

      // Act
      const result = left.isEquivalentTo(right);

      // Assert
      expect(result).toBeFalsy();
    });

    it("should be equivalent to an OrFilter if it only contains filters equivalent to this EqualsFilter", () => {
      // Arrange
      const f1 = new EqualsFilter("status", "active");
      const f2 = new OrFilter(
        new EqualsFilter("status", "active"),
        new EqualsFilter("status", "active"),
      );

      // Act
      const result = f1.isEquivalentTo(f2);

      // Assert
      expect(result).toBeTruthy();
    });
  });
});
