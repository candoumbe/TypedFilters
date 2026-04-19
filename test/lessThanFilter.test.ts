import { LessThanFilter } from '../src/expressions';

describe('LessThanFilter', () => {
  it('should serialize to correct dict', () => {
    // Arrange
    const f = new LessThanFilter('age', 65);

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: 'age', op: 'lt', value: 65 });
  });

  it('op field should be lt', () => {
    // Arrange / Act
    const dict = new LessThanFilter('f', 0).toDict();

    // Assert
    expect(dict['op']).toBe('lt');
  });

  it('should be equivalent to itself', () => {
    // Arrange
    const f = new LessThanFilter('age', 65);

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should be equivalent to another LessThanFilter with same values', () => {
    // Arrange
    const f1 = new LessThanFilter('age', 65);
    const f2 = new LessThanFilter('age', 65);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not be equivalent to a different LessThanFilter', () => {
    // Arrange
    const f1 = new LessThanFilter('age', 65);
    const f2 = new LessThanFilter('age', 50);

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
