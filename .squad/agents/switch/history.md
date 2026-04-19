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
