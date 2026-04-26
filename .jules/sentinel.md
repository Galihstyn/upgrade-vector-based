## 2025-02-21 - Fix Path Traversal / Open Redirect Risk in `handleBackNavigation`
**Vulnerability:** The `sourceHandle` variable (derived from user-controlled URL parameters) was being appended directly to the `/products/` URL string without being URL-encoded. This could allow for path traversal or open redirects if a malicious payload was provided.
**Learning:** All user input that is appended to a URL must be properly URL-encoded.
**Prevention:** Use `encodeURIComponent()` when appending user-controlled variables to URL paths before passing them to sinks like `window.location.href`.
