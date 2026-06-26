## 2024-05-23 - Avoid spread syntax and .map() chains for bounds calculations
**Learning:** Using `Math.min(...array.map())` over potentially large arrays of geometric points causes excessive intermediate allocations (GC pressure) and can trigger "Maximum call stack size exceeded" errors in JavaScript engines when the array is large.
**Action:** Use standard `for` loops to compute min/max bounds and hoist loop-invariant math (like `Math.cos`/`Math.sin`) outside the loop to optimize performance and memory usage.
