## 2025-02-18 - Optimize Geometric Bounds Calculations
**Learning:** Using spread syntax `Math.min(...array)` on potentially large geometric arrays can trigger call stack size limits, and intermediate `.map()` allocations inside render or layout functions cause unnecessary garbage collection pressure.
**Action:** Use standard `for` loops to compute min/max and fuse coordinate transformations to avoid intermediate array allocations. Hoist invariant calculations (like trigonometry) outside these loops.
