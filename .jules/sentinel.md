## 2025-03-02 - Fix path traversal risk in fallback product URL
**Vulnerability:** The `sourceHandle` variable retrieved from query parameters was concatenated into the `safeFallbackProductUrl` string (`/products/${sourceHandle}`) without URL encoding.
**Learning:** React handles encoding in JSX rendering, but JavaScript variables explicitly used to construct paths like `window.location.href = ...` must still be manually sanitized. The query string mapping behavior in Shopify fallback logic poses an open redirect or traversal risk if tampered with.
**Prevention:** Always apply `encodeURIComponent()` to untrusted inputs injected directly into URL paths or `window.location` assignments.
