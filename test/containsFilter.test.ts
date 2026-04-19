import { ContainsFilter } from "../src/expressions";

describe("ContainsFilter", () => {
  it("should serialize to correct dict", () => {
    // Arrange
    const f = new ContainsFilter("name", "bat");

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: "name", op: "contains", value: "bat" });
  });

  it("op field should be contains", () => {
    // Arrange / Act
    const dict = new ContainsFilter("f", "v").toDict();

    // Assert
    expect(dict["op"]).toBe("contains");
  });

  it("should create from dict", () => {
    // Arrange
    const dict = { field: "name", op: "contains", value: "bat" };

    // Act
    const filter = ContainsFilter.fromDict(dict);

    // Assert
    expect(filter).toBeInstanceOf(ContainsFilter);
    expect(filter.field).toBe("name");
    expect(filter.value).toBe("bat");
  });

  it("should throw error for invalid operator in fromDict", () => {
    // Arrange
    const dict = { field: "name", op: "equals", value: "bat" };

    // Act / Assert
    expect(() => ContainsFilter.fromDict(dict)).toThrow(
      "Invalid operator for ContainsFilter: equals",
    );
  });

  describe("ContainsFilter", () => {
    // Arrange
    const cases: {
      input: { field: unknown; op: unknown; value: unknown };
      reason: string;
    }[] = [
      {
        input: { field: 123, op: "contains", value: "bat" },
        reason: "field is not a string",
      },
    ];

    test.each(cases)(
      "fromDict(%j) should throw an exception when input is not a valid ContainsFilter",
      (input) => {
        // Act / Assert
        expect(() => ContainsFilter.fromDict(input)).toThrow();
      },
    );
  });

  it("should be equivalent to itself", () => {
    // Arrange
    const f = new ContainsFilter("name", "bat");

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should be equivalent to another ContainsFilter with same values", () => {
    // Arrange
    const f1 = new ContainsFilter("name", "bat");
    const f2 = new ContainsFilter("name", "bat");

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should not be equivalent to a different ContainsFilter", () => {
    // Arrange
    const f1 = new ContainsFilter("name", "bat");
    const f2 = new ContainsFilter("name", "man");

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
