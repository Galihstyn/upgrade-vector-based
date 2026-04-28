## 2024-06-25 - Avoid Executing Expensive Logic in `useRef` Initializers

**Learning:** Initializing `useRef` directly with functions that perform expensive DOM queries or JSON parsing (e.g., `useRef(getThemeBootstrap())`) executes that expensive logic on *every single render*. This happens because React evaluates the argument passed to `useRef` before checking if the ref already holds a value, leading to severe performance bottlenecks in hot paths.

**Action:** Always use the lazy initialization pattern for expensive reference values: initialize `useRef(null)` and populate `ref.current` conditionally inside an `if (ref.current === null) { ... }` block during the component body, or inside an effect for values that don't need to be available during the initial render.
