# Decision: Complexity property on IFilter (issue #32)

- **Date:** 2026-04-22
- **By:** Morpheus

## Decision

Add a `readonly complexity: number` getter to the `IFilter` interface and implement it on every concrete filter class.

## Rules

| Filter class | Complexity formula |
|---|---|
| Leaf filters (Equals, Contains, StartsWith, EndsWith, Gt, Gte, Lt, Lte) | `1` |
| `OneOfFilter` | `Math.max(1, filters.length)` |
| `NotFilter` | `1 + inner.complexity` |
| `AndFilter` | `Math.max(1, sum of children complexities)` |
| `OrFilter` | `left.complexity + right.complexity` |

## Rationale

- Complexity must never be 0 (enforced by `Math.max(1, ...)` on composite filters).
- `EqualsFilter.complexity === 1` is the baseline for all comparisons.
- Additive composition for AND/OR ensures that nesting always increases complexity monotonically.
- This follows the C# DataFilters reference implementation.
