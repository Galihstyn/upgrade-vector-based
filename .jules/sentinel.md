## 2024-05-24 - Client-side Navigation Path Traversal
**Vulnerability:** The `sourceHandle` variable (derived from user/context input) was interpolated directly into `window.location.href = \`/products/${sourceHandle}\`` without sanitization, allowing path traversal and open redirects (e.g., via `../../`).
**Learning:** While React automatically handles encoding in JSX rendering, manual string interpolations for client-side navigation bypass React's XSS/traversal protections and must be explicitly sanitized.
**Prevention:** Always sanitize user-provided or dynamic context variables using `encodeURIComponent()` before interpolating them into client-side navigation URLs or `window.location.href`.
