## 2024-05-24 - Fix Open Redirect and Path Traversal in Back Navigation
**Vulnerability:** Open redirect via `document.referrer` and path traversal via unencoded `productHandle` in URL assignment.
**Learning:** `new URL(document.referrer)` can produce `"null"` origin for `javascript:` URIs. Reassigning `window.location.href = referrerUrl.href` without strictly limiting to path components and checking for protocol-relative paths (`//`) allows XSS or open redirect. Unsanitized strings in template literals for paths allow traversal.
**Prevention:** Always encode URI components before interpolating into pathnames. Restrict redirects to `pathname + search + hash`, check `origin !== "null"`, and ensure `pathname` strictly starts with `/` and not `//`.
