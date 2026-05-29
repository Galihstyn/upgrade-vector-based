## 2024-05-29 - Array Map Chains in Hot Paths
**Learning:** `getElementBounds` is called extensively (e.g. during marquee selection and overlap checks) and its internal use of `.map()` chains and `Math.max(...arr)` on temporary arrays creates measurable garbage collection and execution overhead. Using hoisted trig values and a single loop reduces execution time for 100k calls from ~410ms to ~11ms.
**Action:** Always inspect geometric utility functions for array allocations and spread operators, replacing them with imperative loops and cached trig values.
