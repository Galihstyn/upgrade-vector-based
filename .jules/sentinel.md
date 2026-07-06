## 2023-10-25 - Path Traversal in Client-Side Navigation
**Vulnerability:** Unsanitized user input (`sourceHandle`) directly interpolated into `window.location.href` via `/products/${sourceHandle}` inside the `handleBackNavigation` function in `app32825_FIXED.jsx`.
**Learning:** While React handles XSS in JSX automatically, string interpolation for raw client-side navigation completely bypasses these protections, leaving the app open to path traversal or open redirects if the input originates from URL parameters.
**Prevention:** Always manually sanitize any variable interpolated into client-side navigation strings using `encodeURIComponent()`.
