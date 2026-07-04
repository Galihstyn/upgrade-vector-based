## 2024-07-04 - Path Traversal via Client-Side Navigation
**Vulnerability:** The application used an unsanitized URL parameter (`productHandle`) directly in a client-side string interpolation (`window.location.href`), which could lead to path traversal or open redirect vulnerabilities.
**Learning:** Because the app directly modifies `window.location.href` for fallback navigation, it bypasses React's automatic JSX encoding protections, exposing the string interpolation to injection.
**Prevention:** Always manually sanitize URL parameters using `encodeURIComponent()` when interpolating them into client-side navigation strings.
