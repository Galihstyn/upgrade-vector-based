## 2024-05-24 - Optimizing React to Imperative Canvas Sync
**Learning:** When syncing an immutable React state array to an imperative canvas library (like Fabric.js), iterating and setting properties on all canvas objects on every render becomes an O(N) bottleneck.
**Action:** Use React's immutable reference equality (`__reactElementRef === el`) on the canvas objects to early-return and bypass property updates for objects that haven't changed.
