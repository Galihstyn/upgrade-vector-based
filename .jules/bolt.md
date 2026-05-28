## 2024-05-23 - Optimization of Selection Lookup
**Learning:** In FabricJS and React synchronization, finding element selection using `array.includes(id)` in loops causes O(N) or O(M) complexity, leading to O(N * M) overall complexity during rendering and updates, slowing down the editor, especially with many objects.
**Action:** Use a `Set` created via `useMemo` for selection lookups (e.g. `selectedSet.has(id)`) to reduce complexity to O(1) in tight render loops and mapping functions. Same applies for element removals during FabricJS synchronizations.
