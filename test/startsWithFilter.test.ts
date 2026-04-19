import { StartsWithFilter } from '../src/expressions';

describe('StartsWithFilter', () => {
  it('should serialize to correct dict', () => {
    // Arrange
    const f = new StartsWithFilter('name', 'Bat');

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: 'name', op: 'startswith', value: 'Bat' });
  });

  it('op field should be startswith', () => {
    // Arrange / Act
    const dict = new StartsWithFilter('f', 'v').toDict();

    // Assert
    expect(dict['op']).toBe('startswith');
  });

  it('should be equivalent to itself', () => {
    // Arrange
    const f = new StartsWithFilter('name', 'Bat');

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should be equivalent to another StartsWithFilter with same values', () => {
    // Arrange
    const f1 = new StartsWithFilter('name', 'Bat');
    const f2 = new StartsWithFilter('name', 'Bat');

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not be equivalent to a different StartsWithFilter', () => {
    // Arrange
    const f1 = new StartsWithFilter('name', 'Bat');
    const f2 = new StartsWithFilter('name', 'Super');

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
