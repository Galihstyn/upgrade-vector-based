## 2024-05-17 - O(1) set operations in loops
**Learning:** Using `selectedIds.includes` inside map/filter/forEach loops results in $O(N \cdot M)$ complexity.
**Action:** Always memoize an array into a `Set` via `useMemo` when performing membership checks inside a loop to bring the complexity down to $O(N)$.
