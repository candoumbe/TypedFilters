import { EndsWithFilter } from '../src/expressions';

describe('EndsWithFilter', () => {
  it('should serialize to correct dict', () => {
    // Arrange
    const f = new EndsWithFilter('name', 'man');

    // Act
    const result = f.toDict();

    // Assert
    expect(result).toEqual({ field: 'name', op: 'endswith', value: 'man' });
  });

  it('op field should be endswith', () => {
    // Arrange / Act
    const dict = new EndsWithFilter('f', 'v').toDict();

    // Assert
    expect(dict['op']).toBe('endswith');
  });

  it('should be equivalent to itself', () => {
    // Arrange
    const f = new EndsWithFilter('name', 'man');

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should be equivalent to another EndsWithFilter with same values', () => {
    // Arrange
    const f1 = new EndsWithFilter('name', 'man');
    const f2 = new EndsWithFilter('name', 'man');

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not be equivalent to a different EndsWithFilter', () => {
    // Arrange
    const f1 = new EndsWithFilter('name', 'man');
    const f2 = new EndsWithFilter('name', 'bat');

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
