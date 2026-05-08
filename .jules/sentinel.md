## 2025-02-28 - Secure Internal Redirects
**Vulnerability:** Open redirect and potential XSS via `document.referrer` combined with an unsanitized internal redirect.
**Learning:** `new URL(document.referrer, window.location.origin)` isn't enough to prevent protocol-relative (e.g. `//evil.com`) or `javascript:` URI (whose origin returns `"null"`) injections if you just use `window.location.href = referrerUrl.href`. Also, product handles must be URL encoded when embedded in redirect paths.
**Prevention:**
1. Always validate `referrerUrl.origin === window.location.origin` AND `referrerUrl.origin !== "null"`.
2. Construct the redirect path manually using only path components (`pathname + search + hash`).
3. Explicitly check that the constructed path starts with `/` and NOT `//`.
4. URL encode user inputs (like handles) before appending them to URL paths.
