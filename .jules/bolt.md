## 2024-05-24 - Prevent call stack size errors with spread syntax
**Learning:** Using spread syntax (`Math.min(...array)`) on potentially large arrays like geometric points can trigger 'Maximum call stack size exceeded' errors in JavaScript engines and increases GC pressure.
**Action:** Use standard `for` loops to iterate over points and compute min/max instead of spread syntax.
