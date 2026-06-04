## 2024-06-04 - Fix path traversal/open redirect in URL fallback
**Vulnerability:** Unsanitized user input (`productHandle` from URL parameters/Bootstrap) interpolated directly into `safeFallbackProductUrl` and assigned to `window.location.href`.
**Learning:** Legacy URL construction relied on `.trim()` without proper sanitization, exposing a path traversal/open redirect vulnerability if the handle contained paths like `../` or malicious schemes like `javascript:`.
**Prevention:** Always use `encodeURIComponent()` on unvalidated string data (e.g., from query strings or generic store configuration) before interpolating it into path parameters, especially for navigation tasks.
