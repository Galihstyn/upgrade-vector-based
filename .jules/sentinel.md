## 2024-06-25 - Prevent Path Traversal in Client-Side Navigation
**Vulnerability:** Path traversal and open redirect vulnerabilities via unsanitized string interpolation in `window.location.href` assignment.
**Learning:** While React handles encoding in JSX rendering automatically, string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections.
**Prevention:** Always manually sanitize untrusted inputs in client-side navigation string interpolation using `encodeURIComponent()`.
