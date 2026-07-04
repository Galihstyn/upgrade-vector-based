## 2024-07-04 - Spread Operator on Large Arrays

**Learning:** Using `Math.min(...array)` and `Math.max(...array)` on dynamically generated arrays (like geometric points in canvas graphics) works fine for small shapes but fails with "Maximum call stack size exceeded" when user input creates hundreds or thousands of nodes, and creates excessive GC pressure due to intermediate `.map()` allocations.
**Action:** Always compute bounding boxes or min/max values on dynamic coordinate sets using traditional `for` loops initialized to `Infinity` / `-Infinity` instead of relying on the spread operator.
