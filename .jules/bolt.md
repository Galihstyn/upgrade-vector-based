## 2024-05-24 - Memoizing selectedIds using a Set

**Learning:** When selectedIds is a simple array, lookups like `selectedIds.includes(el.id)` occur frequently during renders, loops, and callbacks. For a complex app with potentially many elements, this is an $O(N)$ operation inside an $O(M)$ loop, leading to $O(N \times M)$ complexity.
**Action:** Use `useMemo(() => new Set(selectedIds), [selectedIds])` early in the component so a `selectedSet` is available for $O(1)$ lookups globally without needing to recreate it in multiple functions, improving loop/filter performance to $O(M)$.
