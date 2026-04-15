# Project Context

- **Project:** DataFilters-typescript
- **Created:** 2026-04-15
- **Requested by:** Cyrille NDOUMBE
- **Goal:** Create a TypeScript library for parsing filter expressions with a React test interface
- **Stack:** TypeScript, Markdown

## Core Context

Tank initialized to document the library and playground.

## Learnings

- The docs/ folder exists and can host a playground guide.
- Documentation should include API reference and usage examples.
- Clear examples help adoption and reduce support queries.
- The playground README should document both root-level scripts and direct playground commands to reduce setup friction.
- The TypeScript parser supports OR with `|`, but curly-brace any-of syntax from the C# project should not be documented here.
- Literal spaces in parsed values must be escaped because decoded whitespace is skipped by the lexer.
- The package root does not export `OneOfFilter`, so README examples should treat it as internal behavior rather than public API.
