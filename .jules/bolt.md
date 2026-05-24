
## 2025-02-27 - Layout calculations bottleneck with arrays
**Learning:** Hot functions dealing with bounds calculations (`getElementBounds` and `getWarpMetrics`) create major allocation/GC overhead when using multiple array `.map()` chains combined with spread operators (e.g., `Math.max(...arrays)`).
**Action:** Replace `.map()` and spread syntax with standard `for` loops inside frequently executed geometric functions to prevent excess memory allocation and optimize runtime iterations. Also, hoist repetitive loop-invariant Math calculations (`Math.sin()`, `Math.cos()`).
