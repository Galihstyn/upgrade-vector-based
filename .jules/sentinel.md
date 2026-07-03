## 2024-07-03 - Client-Side Navigation Interpolation Vulnerability
**Vulnerability:** Path traversal and open redirect in client-side navigation via unsanitized string interpolation.
**Learning:** While React handles encoding in JSX rendering automatically, it does not protect string interpolations for client-side navigation (e.g., `window.location.href`), allowing unvalidated paths to bypass standard React protections.
**Prevention:** Always manually sanitize dynamic variables in client-side URLs using `encodeURIComponent()` before passing them to navigation APIs.
