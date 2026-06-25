## 2024-05-20 - Avoid spread operator for calculating min/max over arrays
**Learning:** Using `Math.min(...array)` or `Math.max(...array)` on potentially large arrays can cause "Maximum call stack size exceeded" errors and allocates intermediate memory when chained with `.map()`.
**Action:** Iterate with a standard `for` loop to compute limits in performance-critical code paths to avoid these issues.
