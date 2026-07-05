## 2024-05-24 - Avoid spread syntax for large point arrays
**Learning:** Using `Math.max(...array)` or `Math.min(...array)` on potentially large arrays of geometric points can trigger 'Maximum call stack size exceeded' errors and cause high garbage collection pressure.
**Action:** Always use standard `for` loops to compute min/max values over arrays of coordinates or geometric points.
