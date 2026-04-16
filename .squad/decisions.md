# Squad Decisions

## Active Decisions

- 2026-04-15T00:00:00Z | Documentation language
  - By: Cyrille NDOUMBE (via Copilot)
  - Decision: All user/developer-facing documentation must be written in English.
  - Reason: Direct user directive captured for team continuity.

- 2026-04-15T21:12:22Z | Unbounded range syntax validation
  - By: Morpheus
  - Decision: Enforce strict delimiter semantics for unbounded bounds in parser ranges.
  - Rules:
    - Lower unbounded (`* TO x`) must open with `]`.
    - Upper unbounded (`x TO *`) must close with `[`.
  - Effect: Invalid forms such as `[* TO x]` and `[x TO *]` must fail with parse error.
  - Rationale: Remove ambiguity and keep wildcard-bound semantics directionally explicit.

- 2026-04-15T22:00:00Z | README scope for TypeScript port
  - By: Tank
  - Decision: Document README content against actual TypeScript parser and builder behavior.
  - Scope:
    - Do not document curly-brace any-of syntax as supported in this port.
    - Document that literal spaces must be escaped in filter values.
  - Rationale: Keep documentation aligned with real implementation behavior.

- 2026-04-16T00:00:00Z | Bracket expressions in parser values
  - By: Morpheus
  - Decision: Treat `[abc]` and `[a-z]` as literal value expressions in value-accepting contexts.
  - Constraint: Keep `[min TO max]` forms reserved for range parsing.
  - Note: Range detection remains range-like to preserve historical parse-error behavior for malformed range patterns.
  - Rationale: Add bracket-expression support without breaking range compatibility.

- 2026-04-16T00:00:00Z | Conventional commit cadence during feature work
  - By: Cyrille NDOUMBE (via Copilot)
  - Decision: Use small iterative conventional commits while working on this feature.
  - Rationale: User directive captured for team continuity.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
