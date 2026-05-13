## 2025-02-12 - Optimize bounding box calculations with single-pass loop
**Learning:** Spread operators (e.g. `Math.min(...array)`) on large arrays pose a stack overflow risk and repeatedly loop the data (O(N) per call).
**Action:** Replace `Math.min/max(...array)` with an optimized single-pass loop helper `getPointsBounds(points)` to compute bounds and avoid stack size limits.
