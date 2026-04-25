## 2026-04-25 - React useRef Lazy Initialization Optimization
**Learning:** `useRef(expensiveFunction())` in a React component directly executes the expensive function on every render, even though the ref's current value is ignored after the initial render. This caused performance issues in the main `AppContent` hot path.
**Action:** Use the lazy initialization pattern for expensive operations: `const myRef = useRef(null); if (myRef.current === null) { myRef.current = expensiveFunction(); }` to ensure it only runs once.
