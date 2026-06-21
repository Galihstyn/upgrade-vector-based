## 2024-06-25 - React array mapping with Set for O(1) Lookups
**Learning:** Checking for selection within high-frequency `.map`, `.filter`, or `.forEach` loops using an array `.includes()` operation generates $O(N \times M)$ complexity.
**Action:** Always replace `.includes()` with `.has()` by wrapping the array in a `useMemo(() => new Set(arr), [arr])` closure when looping through DOM/Canvas rendering routines for an immediate $O(N + M)$ performance gain.
