## 2024-04-16 - Path Traversal & Open Redirect via URL Parameters in Routing
**Vulnerability:** The `productHandle` value, derived from `window.location.search` (query parameter), was concatenated directly into a path (`/products/${sourceHandle}`) and then assigned to `window.location.href` without URL encoding.
**Learning:** Even internal-looking state values (like a "product handle") can be fully user-controlled via URL parameters, leading to path traversal or open redirects if assigned directly to `window.location.href`.
**Prevention:** Always use `encodeURIComponent()` on user-controlled inputs when constructing URLs, even for values expected to be safe handles or slugs, before passing them to routing sinks.
