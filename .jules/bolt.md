## 2025-02-18 - Replacing Math.max(...array) with Loops for Bounding Boxes
**Learning:** Using `Math.max(...array)` on large arrays (like transformed coordinate points for SVG/canvas shapes) introduces significant garbage collection pressure due to `map()` closures and can crash the JavaScript engine with "Maximum call stack size exceeded".
**Action:** Always use simple `for` loops to iterate over coordinates when calculating `minX`, `maxX`, `minY`, and `maxY` for arrays of objects in performance-critical bounds calculation functions like `getElementBounds` and `getCustomPointBounds`.
