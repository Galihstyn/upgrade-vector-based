## 2024-03-24 - Optimize AppContent selectedIds O(M*N) lookup
**Learning:** Checking for element inclusion using `selectedIds.includes(el.id)` within `map` and `filter` iterations over the entire elements list creates a hidden $O(M \times N)$ performance trap during renders, where $N$ is the number of canvas elements and $M$ is the number of selected items.
**Action:** Always derive a `Set` via `useMemo` from arrays meant for inclusion checks inside loops in React rendering cycles, changing the complexity to $O(N)$ with an $O(1)$ presence check per element.
