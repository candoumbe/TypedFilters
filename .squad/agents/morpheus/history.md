# Project Context

- **Project:** DataFilters-typescript
- **Created:** 2026-04-15
- **Requested by:** Cyrille NDOUMBE
- **Goal:** Create a TypeScript library for parsing filter expressions with a React test interface
- **Stack:** TypeScript, Jest

## Core Context

Morpheus initialized to evolve the library and its integration.

## Learnings

- The project core is already structured under src/ with parser and filters.
- Library must maintain backward compatibility.
- Type definitions and public exports are critical for external consumption.
- Unbounded range bounds with `*` must use directional delimiters only:
  - lower unbounded: `]` (example: `]* TO x]`)
  - upper unbounded: `[` (example: `[x TO *[`)
- Invalid forms like `[* TO x]` and `[x TO *]` should fail fast with a parse error to avoid ambiguous API behavior.
