## 2024-05-24 - Avoiding Stack Overflow in Geometric Calculations
**Learning:** Using `Math.min(...array)` or `Math.max(...array)` with spread syntax on arrays of geometric points or coordinates causes "Maximum call stack size exceeded" errors in JavaScript engines and wastes memory due to extra mapping iterations.
**Action:** Always compute min/max over potentially large coordinate arrays using standard `for` loops.
