## 2024-06-08 - Optimize selectedIds lookups
**Learning:** In a heavily interactive canvas app like this, React component bodies can execute frequently on state changes. An unmemoized array `includes` check inside a loop (especially one like `elements.map` or `elements.forEach` for z-index synchronization) scales at $O(n \times m)$, where $n$ is total elements and $m$ is selected elements.
**Action:** Always prefer memoizing a `Set` via `useMemo` for any subset checks (like `selectedIds`) in hot paths to drop the lookup to $O(1)$.
