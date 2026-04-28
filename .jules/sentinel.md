## 2025-02-13 - Unencoded URL Parameter in Navigation Sink
**Vulnerability:** The `productHandle` (derived from URL parameters) was appended directly to a path string (`/products/${sourceHandle}`) and used in `window.location.href`, creating a risk of path traversal and potential open redirect/XSS.
**Learning:** Even internal routing paths constructed from user input must be sanitized. React's built-in XSS protections do not apply when directly manipulating `window.location.href`.
**Prevention:** Always use `encodeURIComponent()` when appending user-controlled variables to URL paths or query parameters before passing them to URL sinks.
