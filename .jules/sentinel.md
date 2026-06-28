## 2024-06-28 - Client-Side Navigation String Interpolation
**Vulnerability:** User-controlled strings used in client-side navigation (e.g., `window.location.href`) without encoding.
**Learning:** While React automatically handles encoding in JSX rendering, string interpolations for client-side navigation bypass React's protections.
**Prevention:** Always manually sanitize user-controlled strings using `encodeURIComponent()` when interpolating them into URLs for client-side navigation to prevent path traversal and open redirects.
