import { EqualsFilter, NotFilter } from '../src/expressions';

describe('NotFilter', () => {
  it('should serialize with logic not', () => {
    // Arrange
    const f = new NotFilter(new EqualsFilter('deleted', true));

    // Act
    const result = f.toDict();

    // Assert
    expect(result['logic']).toBe('not');
    expect((result['filters'] as unknown[]).length).toBe(1);
  });

  it('should wrap the inner filter', () => {
    // Arrange
    const inner = new EqualsFilter('active', false);

    // Act
    const f = new NotFilter(inner);

    // Assert
    expect(f.filter).toBe(inner);
  });

  it('should be equivalent to itself', () => {
    // Arrange
    const f = new NotFilter(new EqualsFilter('deleted', true));

    // Act
    const result = f.isEquivalentTo(f);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should be equivalent to another NotFilter with same filter', () => {
    // Arrange
    const f1 = new NotFilter(new EqualsFilter('deleted', true));
    const f2 = new NotFilter(new EqualsFilter('deleted', true));

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not be equivalent to a different NotFilter', () => {
    // Arrange
    const f1 = new NotFilter(new EqualsFilter('deleted', true));
    const f2 = new NotFilter(new EqualsFilter('deleted', false));

    // Act
    const result = f1.isEquivalentTo(f2);

    // Assert
    expect(result).toBeFalsy();
  });
});
