## 2024-05-18 - Client-Side Navigation Path Traversal
**Vulnerability:** Path traversal and open redirect via unsanitized `window.location.href = \`/products/\${sourceHandle}\`` in React.
**Learning:** While React handles encoding in JSX, manual DOM assignments like `window.location.href` bypass these protections.
**Prevention:** Always use `encodeURIComponent()` for URL parameters mapped to internal paths or external redirects before interpolation.
