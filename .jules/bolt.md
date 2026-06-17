## 2024-05-18 - Optimize element selection array lookup
**Learning:** Checking element selection membership using `selectedIds.includes(el.id)` inside nested loops or array filters across large element sets is an O(n) operation per element, creating a performance bottleneck when selecting, updating, deleting, or aligning shapes.
**Action:** Replace `includes()` lookups with a React `useMemo` backed `Set` (`selectedSet`) mapping `selectedIds`, reducing the lookup to an O(1) operation (`selectedSet.has(el.id)`) to improve responsiveness and reduce CPU burn during render and state mutations.
