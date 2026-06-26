## 2024-05-15 - Prevent Path Traversal in Client-Side Navigation
**Vulnerability:** Path traversal and open redirect in client-side navigation using `window.location.href` with unsanitized `productHandle`.
**Learning:** While React handles encoding in JSX rendering automatically, string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections and must be manually sanitized.
**Prevention:** Always use `encodeURIComponent()` when interpolating variables into client-side navigation URLs.
