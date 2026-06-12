## 2024-05-24 - Path Traversal in Client-Side Navigation
**Vulnerability:** Client-side path traversal and potential open redirect in `handleBackNavigation`.
**Learning:** `sourceHandle` was read from bootstrap configuration and interpolated directly into `window.location.href = \`/products/${sourceHandle}\``. While React protects JSX, it doesn't protect raw DOM APIs.
**Prevention:** Always sanitize dynamically constructed URLs using `encodeURIComponent()` before assigning them to `window.location.href` or similar navigation APIs.
