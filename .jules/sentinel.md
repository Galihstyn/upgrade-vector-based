## 2024-06-16 - Prevent Path Traversal / Open Redirect Risk in Client-Side Navigation
**Vulnerability:** Unsanitized URL parameter interpolation (`themeBootstrapRef.current?.productHandle`) was directly passed to `window.location.href`, creating a path traversal or open redirect vulnerability.
**Learning:** React handles encoding in JSX rendering automatically, but string interpolations for client-side navigation (e.g., `window.location.href = ...`) bypass React's protections and must be manually sanitized.
**Prevention:** Use `encodeURIComponent()` to sanitize user input when dynamically generating URLs for client-side navigation.
