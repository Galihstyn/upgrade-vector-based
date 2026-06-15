## 2024-06-15 - Open Redirect / Path Traversal in Client-Side Navigation
**Vulnerability:** The `sourceHandle` variable (derived from `themeBootstrapRef.current?.productHandle`) was interpolated directly into a URL string (`/products/${sourceHandle}`) and assigned to `window.location.href` without sanitization.
**Learning:** React automatically escapes output in JSX, but string interpolations passed directly to DOM sink attributes (like `window.location.href`) bypass React's protections and are vulnerable to path traversal (e.g., `../`) or open redirect attacks.
**Prevention:** Always use `encodeURIComponent()` when incorporating external or user-provided data into URL paths or search parameters, especially when assigning to navigation sinks.
