## 2024-06-25 - Path Traversal & Open Redirect in Client-Side Navigation
**Vulnerability:** String interpolation in `window.location.href = '/products/' + sourceHandle` allowed path traversal and open redirect if `sourceHandle` was malicious.
**Learning:** While React handles encoding in JSX rendering automatically, string interpolations for client-side navigation bypass React's protections and must be manually sanitized.
**Prevention:** Always use `encodeURIComponent()` when interpolating dynamic user-controlled data into URLs for client-side routing or navigation.
