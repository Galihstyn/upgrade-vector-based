## 2024-05-21 - Eliminate Array Allocations in Drag/Warp Hot Loop
**Learning:** In performance-critical functions that are called frequently during UI interaction (such as `getWarpMetrics` used when rendering curved text or dragging), using array map and forEach methods to transform objects (e.g., coordinates) creates significant garbage collection overhead.
**Action:** Always hoist loop-invariant math calculations (like `Math.cos` and `Math.sin`) and unroll array iterations into flat, inline variable updates (`c1x`, `c1y`, etc.) in hot paths to minimize allocations and maximize FPS.
