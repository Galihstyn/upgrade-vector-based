## 2024-05-24 - Array Spread Performance in Canvas Dragging
**Learning:** Using `Math.min(...array)` and `Math.max(...array)` with `.map()` on potentially large arrays of geometric points inside frequently called functions during canvas object dragging causes high Garbage Collection pressure and risks 'Maximum call stack size exceeded' errors.
**Action:** Use standard `for` loops to calculate min/max over large arrays in performance-critical paths to avoid call stack limits and reduce memory allocations.
