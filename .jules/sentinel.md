## 2024-06-29 - Client-Side Navigation Path Traversal
**Vulnerability:** The `handleBackNavigation` function interpolated an unsanitized variable (`sourceHandle`) directly into a URL path string (`/products/${sourceHandle}`) before assigning it to `window.location.href`.
**Learning:** While React automatically sanitizes variables rendered in JSX, string interpolations for client-side navigation bypass React's protections and can expose the application to path traversal or open redirect if the input is untrusted.
**Prevention:** Always manually sanitize user-influenced inputs using `encodeURIComponent()` before interpolating them into URL paths for client-side navigation.
