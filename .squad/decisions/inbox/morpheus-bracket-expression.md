### 2026-04-16T00:00:00Z: Bracket expressions in parser values

**By:** Morpheus
**What:** Treat `[abc]` and `[a-z]` as literal value expressions (Equals/Contains/StartsWith/EndsWith/Not/OR contexts) while keeping `[min TO max]` family reserved for range parsing.
**Why:** The feature request adds bracket-expression syntax wherever values are accepted, but existing range grammar must remain compatible and unambiguous.
**Notes:** Range detection was made "range-like" (not purely prefix-based) to keep historical parse-error behavior for malformed range patterns.
