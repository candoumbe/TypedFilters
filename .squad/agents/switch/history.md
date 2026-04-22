# Project Context

- **Project:** DataFilters-typescript
- **Created:** 2026-04-15
- **Requested by:** Cyrille NDOUMBE
- **Goal:** Create a TypeScript library for parsing filter expressions with a React test interface
- **Stack:** Jest, TypeScript

## Core Context

Switch initialized to secure evolution through tests.

## Learnings

- The repository already has a foundation of unit tests for filters.
- Test coverage should focus on edge cases and error handling.
- Parser error scenarios are critical to validate.
- Equivalence coverage should assert reflexivity and symmetry explicitly, including cross-shape equivalence like `EqualsFilter` vs `AndFilter([equalFilter, equalFilter])` in both directions.
- Delivery note (2026-04-19): focused verification completed with `npm test -- test/equalsFilter.test.ts test/andFilter.test.ts --runInBand` passing.
- Delivery note (2026-04-19): extended equivalence coverage pattern (self, same-shape equivalent, different-shape non-equivalent) across all concrete filter tests and added dedicated `OneOfFilter` test suite.
- Delivery note (2026-04-22): added `complexity` describe blocks to all 12 concrete filter test files (issue #32). Leaf filters assert complexity=1 and >0; NotFilter asserts 2 (wrapping Equals) and 3 (double-nested); AndFilter asserts 2, 3, and 3 for nested [Equals, Not(Equals)]; OrFilter asserts 2 and >0; OneOfFilter asserts count=3, >=1, and >0. Added `NotFilter` import to andFilter.test.ts.
