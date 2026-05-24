## 2026-05-24 - Secure Internal URL Redirects
**Vulnerability:** Open redirect and path traversal via `document.referrer` and unsanitized URL parameters (`sourceHandle`).
**Learning:** `window.location.href` assignment is dangerous if URL components like origin aren't validated against "null" (javascript: URIs), and dynamic paths aren't encoded or checked against protocol-relative injections (`//`).
**Prevention:** Always encode URI components in paths, validate `URL.origin !== "null"`, and restrict redirects to safe local paths (`pathname + search + hash` starting with exactly one `/`).
