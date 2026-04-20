## 2024-05-24 - Lazy Initialization for Expensive DOM Operations
**Learning:** `useRef(expensiveFunction())` executes the function on every single render, even though React discards the value after the first render. This is particularly problematic in React hot paths (like main components) when `expensiveFunction` involves DOM queries (`document.getElementById`) or JSON parsing.
**Action:** Always use the lazy initialization pattern: `if (ref.current === null) { ref.current = expensiveFunction(); }` or a dedicated `initialized` ref flag to avoid executing expensive logic on re-renders.
