# Decision: complexity property test coverage

- **Date:** 2026-04-22
- **By:** Switch (Tester)
- **Related issue:** #32 — add `complexity` property

## Decision

Add `describe("complexity", ...)` blocks to all 12 concrete filter test files.

## Rules encoded in tests

| Filter | Expected complexity |
|---|---|
| EqualsFilter, ContainsFilter, StartsWithFilter, EndsWithFilter, GreaterThanFilter, GreaterThanOrEqualFilter, LessThanFilter, LessThanOrEqualFilter | 1 |
| NotFilter(EqualsFilter) | 2 |
| NotFilter(NotFilter(EqualsFilter)) | 3 |
| AndFilter([Equals, Equals]) | 2 |
| AndFilter([Equals, Equals, Equals]) | 3 |
| AndFilter([Equals, Not(Equals)]) | 3 |
| OrFilter([Equals, Equals]) | 2 |
| OneOfFilter([e1, e2, e3]) | 3 |
| OneOfFilter([e1]) | 1 |

## Invariant asserted in every file

`complexity` is always greater than 0 (never 0).

## Side effect

`andFilter.test.ts` now imports `NotFilter` alongside `AndFilter` and `EqualsFilter` to support the nested complexity test case.
