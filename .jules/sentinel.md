## 2024-05-18 - Fix Open Redirect and Path Traversal in back navigation
**Vulnerability:** Unencoded URL parameter interpolation in `handleBackNavigation` (`/products/${sourceHandle}`).
**Learning:** URL parameters mapped to internal paths must always be sanitized using `encodeURIComponent()`.
**Prevention:** Use `encodeURIComponent()` before interpolation to prevent path traversal and open redirect vulnerabilities.
