# Session Notes - 2026-04-20T18:05:25Z

Requested by: Cyrille NDOUMBE
Role: Scribe

- Logged the OrFilter equivalence regression outcome and closure.
- Context captured:
  - Changed source file: `src/equivalence.ts`.
  - Symptom: `OrFilter` with duplicate equivalent children was not equivalent to an equivalent simple filter.
- Validation captured:
  - `npm test -- test/orFilter.test.ts` => PASS.
  - `npm test` => PASS.
- Decision inbox merge result:
  - `copilot-directive-2026-04-19T00-00-00Z.md` matched an existing active decision in `.squad/decisions.md` (branching policy), so no duplicate decision was added.
