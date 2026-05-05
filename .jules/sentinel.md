## 2024-06-18 - [Fix Open Redirect]
**Vulnerability:** Insecure handling of internal redirects via `document.referrer` and open redirect/path traversal risks using user-controlled parameters (`productHandle`).
**Learning:** `document.referrer` can sometimes bypass simple same-origin checks, or construct insecure references. Furthermore, user-controlled parameters must be URL-encoded before being appended to URLs. Protocol-relative URLs (e.g. `//evil.com`) must be blocked.
**Prevention:** Always validate that `URL` origin matches `window.location.origin` and isn't "null". Only redirect using the path components (`pathname + search + hash`), ensuring `pathname` starts with a single `/` and not `//`. Additionally, apply `encodeURIComponent()` to any user-controlled URL segment.
