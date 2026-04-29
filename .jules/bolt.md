## 2024-04-29 - Lazy Initialization for `useRef` in Hot Paths
**Learning:** `useRef(expensiveFunction())` calculates the result of the `expensiveFunction()` on *every* render, even though the returned value is only used for the initial assignment. In a hot path like a canvas rendering application, this can cause major performance issues due to redundant DOM queries (`getThemeBootstrap()`), JSON parsing (`safeClone`), etc.
**Action:** Always implement lazy initialization using `if (ref.current === null) { ref.current = expensiveFunction(); }` for initial values that are expensive to compute.
