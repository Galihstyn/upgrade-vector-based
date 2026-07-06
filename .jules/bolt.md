## 2023-10-25 - Coordinate bounds spread syntax
**Learning:** Using \`Math.min(...points.map(...))\` and \`Math.max(...points.map(...))\` for potentially large arrays of geometric points can trigger 'Maximum call stack size exceeded' errors in V8 and causes unnecessary array allocations leading to GC pressure.
**Action:** Always use standard \`for\` loops to calculate min/max over arrays of coordinates to improve reliability and performance, especially in canvas or coordinate transformation contexts.
