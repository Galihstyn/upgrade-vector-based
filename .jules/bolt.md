## 2024-04-16 - Expensive Initialization in `useRef`

**Learning:** Passing the result of a function call directly into `useRef` (e.g., `useRef(expensiveFunction())`) causes the expensive function to be executed on *every render*, even though React discards the result on subsequent renders and only uses the value from the initial render. This leads to severe CPU overhead in hot paths or top-level app components when the function performs DOM queries, hashing, or deep cloning (as seen with `getThemeBootstrap()`).
**Action:** Always use the lazy initialization pattern for `useRef` when the initial value requires computation: initialize the ref with `null`, and calculate the value inside an `if (ref.current === null)` block.
