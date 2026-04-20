## 2025-02-28 - [Path Traversal / DOM-based XSS via window.location.href]
**Vulnerability:** User-controlled URL parameter (productHandle) was used to dynamically construct a URL (`/products/${sourceHandle}`) which was then assigned directly to `window.location.href`. This is an injection vulnerability that could result in path traversal or DOM-based Cross-Site Scripting (XSS).
**Learning:** Even internal redirects or fallback URLs require encoding when they incorporate untrusted user input, especially when being passed to dangerous sinks like `window.location.href`.
**Prevention:** Always use `encodeURIComponent()` on user-controlled inputs when appending them to URL paths or parameters before they hit a sink like `window.location.href`.
