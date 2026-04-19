import { GreaterThanFilter } from '../src/expressions';

describe('GreaterThanFilter', () => {
  it('should serialize to correct dict', () => {
    // Arrange
    const f = new GreaterThanFilter('age', 18);

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: 'age', op: 'gt', value: 18 });
  });

  it('op field should be gt', () => {
    // Arrange / Act
    const dict = new GreaterThanFilter('f', 0).toDict();

    // Assert
    expect(dict['op']).toBe('gt');
  });

  it('should be equivalent to itself', () => {
    // Arrange
    const f = new GreaterThanFilter('age', 18);

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should be equivalent to another GreaterThanFilter with same values', () => {
    // Arrange
    const f1 = new GreaterThanFilter('age', 18);
    const f2 = new GreaterThanFilter('age', 18);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not be equivalent to a different GreaterThanFilter', () => {
    // Arrange
    const f1 = new GreaterThanFilter('age', 18);
    const f2 = new GreaterThanFilter('age', 21);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
