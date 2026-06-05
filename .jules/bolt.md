## 2025-01-20 - Lazy Initialize Expensive useRef Values
**Learning:** `useRef(expensiveFunction())` executes `expensiveFunction()` on every single render in React. In hot paths like canvas rendering or high-frequency state updates, this can severely impact performance. In `app32825_FIXED.jsx`, `getThemeBootstrap()` was being called on every render, querying the DOM and creating URLSearchParams.
**Action:** Use an explicit boolean guard `const isInitialized = useRef(false); if (!isInitialized.current) { ...; isInitialized.current = true; }` to lazily initialize expensive references only once.
