## 2024-07-07 - Path Traversal in Client-Side Navigation
**Vulnerability:** Unsanitized string interpolation in `window.location.href` assignment.
**Learning:** While React handles encoding in JSX rendering automatically, string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections, creating path traversal and open redirect vulnerabilities.
**Prevention:** Always manually sanitize external or untrusted variables used in client-side navigation assignments using `encodeURIComponent()` to prevent path traversal and open redirect vulnerabilities.
