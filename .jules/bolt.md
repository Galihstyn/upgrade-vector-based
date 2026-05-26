## 2024-05-26 - Optimize selection lookups
**Learning:** Using memoized Sets for selection state lookup in hot loops (like canvas rendering synchronization) prevents O(M) lookups, reducing them to O(1).
**Action:** Use useMemo to memoize a Set of selected items for faster lookups.
