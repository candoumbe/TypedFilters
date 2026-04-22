### 2026-04-22T11:49:17Z: User directives — coding standards & language policy

**By:** Cyrille NDOUMBE (via Copilot)

**What:**

1. **Single Entry Single Exit (SESE):** Always use the single entry single exit principle when writing code. Functions and methods must have one entry point and one exit point.

2. **No infinite-loop literals:** Never use constant loop conditions such as `while(true) { ... }` or equivalent (`for(;;)`, `while(1)`, etc.). Use explicit termination conditions instead.

3. **Explicit types:** Always use explicit type annotations. Avoid implicit inference where types can be stated clearly (function parameters, return types, variable declarations where type is not immediately obvious).

4. **English for all user-facing text:** All user-facing content must be written in English — this includes documentation, commit titles, commit descriptions, PR titles, PR descriptions, comments, changelog entries, and any other text visible to contributors or consumers of this open-source project.

**Why:** User request — captured for team memory and applied to all future work in this repository.
