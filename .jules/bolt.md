## 2024-05-24 - Optimize selected element checks
**Learning:** `app32825_FIXED.jsx` uses `selectedIds.includes(el.id)` inside array operations (map, filter) and the `useEffect` render cycle for Fabric.js synchronization. In a project that allows multiple elements, this changes the time complexity of the lookups from O(M) to O(1) if we memoize a `Set`.
**Action:** Create a `selectedSet` using `useMemo` from `selectedIds` in `app32825_FIXED.jsx`. Update array `map` and `filter` iterations to use `selectedSet.has(el.id)` instead of `selectedIds.includes(el.id)` to improve lookup performance.
