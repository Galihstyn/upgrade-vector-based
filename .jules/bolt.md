## 2025-01-24 - Avoid Eager Initialization in useRef
**Learning:** `useRef(expensiveFunction())` inside a React component will execute `expensiveFunction` on *every single render*, even though the initial value is only used during the first render. This can be a major performance bottleneck in a large component that re-renders frequently (like a canvas editor reacting to mouse moves).
**Action:** Always use the lazy initialization pattern for expensive operations in `useRef`: `const ref = useRef(null); if (ref.current === null) { ref.current = expensiveFunction(); }`
