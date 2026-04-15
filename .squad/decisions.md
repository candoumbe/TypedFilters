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

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
