## 2024-07-01 - Avoid Spread Syntax for Min/Max of Coordinate Arrays
**Learning:** Using `Math.min(...points.map(p => p.x))` on arrays of coordinates causes excessive GC pressure from intermediate map arrays and risks 'Maximum call stack size exceeded' errors on large polygons/custom shapes in the canvas.
**Action:** Use a single-pass `for` loop to compute `minX`, `maxX`, `minY`, and `maxY` simultaneously, avoiding intermediate arrays and spread syntax.
