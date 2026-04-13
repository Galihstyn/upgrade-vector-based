## 2024-05-24 - Fabric.js Canvas Sync Optimization
**Learning:** When synchronizing an immutable React state array to an imperative canvas library (like Fabric.js), we can utilize referential equality checks by caching React state references and related states directly on the canvas objects (e.g., `__reactStateRef`, `__isSelected`, `__index`). This permits skipping O(N) property updates and rearranging operations for unmodified elements.
**Action:** Always implement this early return strategy when updating a heavy, imperative 3rd party object list from a React array of elements.
