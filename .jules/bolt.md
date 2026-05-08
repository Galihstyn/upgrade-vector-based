## 2025-05-18 - Avoid expensive DOM/JSON operations in useRef initialization
**Learning:** Initializing `useRef(expensiveFunction())` executes the function on every render, even though the ref value is only set once. In this codebase, `getThemeBootstrap()` was performing DOM queries and `JSON.parse` on every render (e.g. 60+ times a second during dragging).
**Action:** Use the lazy initialization pattern `if (ref.current === null) { ref.current = expensiveFunction(); }` for expensive setup functions to ensure they run only once.
