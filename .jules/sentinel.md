## 2024-05-15 - Unencoded URL Variables Causing Path Traversal Risk
**Vulnerability:** User-controlled values like `productHandle` were being directly interpolated into fallback URLs (e.g., `/products/${sourceHandle}`) without encoding, creating a path traversal or open redirect risk if the handle contained malicious characters.
**Learning:** URL parameters and user-controlled strings must always be safely encoded when constructing internal application paths or redirects to prevent injection attacks and pseudo-protocol (like `javascript:`) execution via sinks like `window.location.href`.
**Prevention:** Always wrap user-controlled path segments or query parameters with `encodeURIComponent()` before appending them to URLs.
