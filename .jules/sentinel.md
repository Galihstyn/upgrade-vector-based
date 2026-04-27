## 2024-05-24 - [DOM XSS / Path Traversal via productHandle]
**Vulnerability:** User-controlled `productHandle` from URL parameters was appended to `safeFallbackProductUrl` and assigned to `window.location.href` without URL encoding in `app32825_FIXED.jsx`. This allowed for potential DOM XSS (via the `javascript:` pseudo-protocol) or path traversal.
**Learning:** React elements inherently escape output, but sinks like `window.location.href` bypass this protection. When constructing URLs from user-provided data, encoding is critical.
**Prevention:** Always use `encodeURIComponent()` to sanitize user-controlled parameters before appending them to URL paths or using them in DOM sinks.
