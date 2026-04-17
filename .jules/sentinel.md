## 2026-04-17 - Path Traversal & XSS via Unsanitized Product Handle in Routing
**Vulnerability:** The `sourceHandle` parameter, extracted from an internal state variable, was interpolated directly into a fallback route string (`/products/${sourceHandle}`) without URL encoding.
**Learning:** In frontend routing logic, even internal state derived from user input or query parameters can lead to path traversal or pseudo-protocol injections if appended to URL paths unsanitized.
**Prevention:** Always use `encodeURIComponent` when injecting dynamic variables into URL path segments or query parameters to ensure special characters are safely escaped.
