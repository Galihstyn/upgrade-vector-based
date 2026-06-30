## 2024-05-30 - Prevent Stack Overflow in Geometric Calculations
**Learning:** Using spread syntax (`...`) combined with array iteration methods like `.map()` inside `Math.min()` or `Math.max()` can cause "Maximum call stack size exceeded" errors for large arrays, such as custom shape paths. It also hurts performance by creating intermediate arrays.
**Action:** Always use standard `for` loops to calculate min/max over geometric point arrays. This ensures single-pass O(N) execution with no intermediate array allocations and prevents stack overflow crashes.
