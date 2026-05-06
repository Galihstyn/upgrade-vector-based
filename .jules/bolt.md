
## 2026-05-06 - Array Allocations in Calculation Loops
**Learning:** Intermediate array allocations and method chains (like `.map` and `.forEach`) inside hot calculation loops (e.g., character positioning in `getWarpMetrics`) cause unnecessary garbage collection spikes and duplicate calculations.
**Action:** Replace map/forEach loops inside render paths with inline variable declarations to prevent object creation overhead, and hoist repeated calculations (e.g., `Math.sin`/`Math.cos`).
