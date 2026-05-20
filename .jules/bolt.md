
## 2024-05-18 - Avoid array allocations and redundant math in rendering loops
**Learning:** In performance-critical functions like `getWarpMetrics` that run iteratively over many characters during text warp rendering, using intermediate arrays, `.map()`, and `.forEach()` within the inner loop causes unnecessary garbage collection overhead and repeated trigonometric calculations.
**Action:** Always hoist invariant math (e.g., `Math.cos` and `Math.sin`) and calculate positions inline, comparing minimums and maximums directly without allocating temporary structures in hot rendering paths.
