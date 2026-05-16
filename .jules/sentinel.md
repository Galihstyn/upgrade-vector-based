
## 2024-05-18 - Secure Internal Redirects via document.referrer and URL Params
**Vulnerability:** Open redirect possible when navigating using `document.referrer` by failing to securely validate origin and pathname, allowing protocol-relative URL injection. Path traversal possible by interpolating an unsanitized URL parameter (`sourceHandle`) into the pathname.
**Learning:** `new URL(document.referrer, window.location.origin)` isn't fully safe to use directly via `referrerUrl.href`. `referrerUrl.origin` can be `"null"` for certain URLs (like `javascript:`). Using `href` might accidentally include protocol-relative URLs (`//evil.com`) if not carefully checked.
**Prevention:**
1. Always validate `referrerUrl.origin !== "null"` and `referrerUrl.origin === window.location.origin`.
2. Check that `referrerUrl.pathname` starts with `/` and crucially **does not** start with `//`.
3. Construct the destination safe path explicitly: `referrerUrl.pathname + referrerUrl.search + referrerUrl.hash`.
4. Always wrap URL parameters injected into paths with `encodeURIComponent()`.
