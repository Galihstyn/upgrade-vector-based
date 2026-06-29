## 2025-02-18 - Optimize geometric boundaries calculation
**Learning:** Spread operators on large coordinate arrays trigger GC pressure and call stack limits; loop-invariant math functions inside nested `.map()` calls degrade geometry calculation performance.
**Action:** Use single-pass `for` loops and hoist trigonometric calculations like `Math.cos(rad)` outside loops for intensive geometry bounding functions.
