## 2024-05-02 - Hoist Trigonometry and Eliminate Array Allocations in Text Rendering
**Learning:** In performance-critical text rendering paths (like `getWarpMetrics`), intermediate array allocations via `.map()` and `.forEach()` combined with repeated trigonometric calculations (`Math.sin`/`Math.cos` inside loops) create garbage collection overhead and waste CPU cycles.
**Action:** Replace map/forEach chains that calculate corner points with direct scalar math variables and hoist invariant trigonometric functions outside the array allocations for each character loop.
