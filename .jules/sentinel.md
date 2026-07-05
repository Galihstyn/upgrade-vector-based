## 2024-05-24 - Path Traversal via Unsanitized Client-Side Navigation
**Vulnerability:** The application used unsanitized string interpolation for client-side navigation (`window.location.href = "/products/" + sourceHandle`), which could allow path traversal or open redirect vulnerabilities if the `sourceHandle` variable contains malicious input like `../`.
**Learning:** While React handles encoding in JSX rendering automatically, string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections and must be manually sanitized.
**Prevention:** Always use `encodeURIComponent()` when interpolating variables into URL paths for client-side navigation to prevent path traversal and open redirect vulnerabilities.
