## 2024-07-02 - Open Redirect via Client-Side Navigation
**Vulnerability:** Client-side navigation via string interpolation without sanitization (e.g., `/products/${sourceHandle}`).
**Learning:** While React handles encoding in JSX, string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections and must be manually sanitized.
**Prevention:** Always use `encodeURIComponent()` when embedding user input into URLs for client-side navigation to prevent path traversal and open redirect vulnerabilities.
