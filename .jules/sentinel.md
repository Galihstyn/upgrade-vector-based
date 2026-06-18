## 2024-05-24 - Unencoded URL Path Interpolation
**Vulnerability:** Client-side navigation to `/products/${sourceHandle}` allowed arbitrary path traversal when `sourceHandle` was malformed or maliciously crafted.
**Learning:** While React handles encoding in JSX rendering automatically, string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections and must be manually sanitized.
**Prevention:** Always use `encodeURIComponent()` when interpolating dynamic data into URL paths or query parameters.
