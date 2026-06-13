## 2025-06-13 - Prevent Path Traversal and Open Redirects via encodeURIComponent
**Vulnerability:** The client-side navigation interpolation `safeFallbackProductUrl` inside `app32825_FIXED.jsx` directly interpolated the string value from `themeBootstrapRef.current?.productHandle`, allowing a malicious product handle to execute a path traversal to unrelated paths or even potentially open redirects.
**Learning:** React handles encoding in JSX rendering automatically, but string interpolations for client-side navigation bypass those protections and require manual sanitization.
**Prevention:** Always use `encodeURIComponent()` to sanitize URL parameters mapped to internal paths before performing string interpolation to construct navigational URLs.
