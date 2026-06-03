## 2024-06-03 - Prevent Path Traversal in Back Navigation
**Vulnerability:** Unsanitized `sourceHandle` interpolated directly into `/products/${sourceHandle}` for `window.location.href` assignment, risking path traversal (e.g., if handle contains `../`).
**Learning:** URL parameters mapped to internal paths (e.g., `productHandle` used to build `/products/{handle}`) must always be sanitized using `encodeURIComponent()` before interpolation to prevent path traversal and open redirect vulnerabilities.
**Prevention:** Always use `encodeURIComponent()` when interpolating potentially user-controlled state or configuration variables into URLs and paths.
