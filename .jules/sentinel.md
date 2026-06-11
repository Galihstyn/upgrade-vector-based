## 2024-06-11 - Path Traversal in Client-Side Navigation
**Vulnerability:** URL parameters mapped to internal paths (e.g., `productHandle` used to build `/products/{handle}`) were interpolated directly into `window.location.href` without sanitization.
**Learning:** While React handles encoding in JSX rendering automatically, string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections and must be manually sanitized. This is particularly risky when properties like `productHandle` are derived from URL parameters or external context.
**Prevention:** Always use `encodeURIComponent()` when interpolating dynamic data into URLs for client-side navigation or API requests.
