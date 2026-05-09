## 2024-05-09 - Math.min/max with spread operator and map allocations
**Learning:** Using `Math.min(...points.map(p => p.x))` on arrays allocates an intermediate array via `.map()`, uses a costly spread operator `...` that throws `Maximum call stack size exceeded` for large arrays, and must iterate four separate times to calculate `minX`, `maxX`, `minY`, and `maxY` bounds.
**Action:** Replace these calls with a single custom helper like `getPointsBounds(points)` that performs a single $O(N)$ loop, reducing both execution time and avoiding GC overhead from multiple maps.
