## 2024-06-23 - Optimize Array Min/Max spread patterns in geometric bounds
**Learning:** Using `Math.min(...array.map())` and `Math.max(...array.map())` in hot paths like geometric bounds calculation (e.g., `getElementBounds`) triggers intermediate array allocations and can cause 'Maximum call stack size exceeded' errors on large path arrays.
**Action:** Replace `...array.map()` spread syntax with standard `for` loops and hoist loop-invariant math (like `Math.cos`/`Math.sin`) outside the loop to improve performance and reliability.
