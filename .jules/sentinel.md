## 2024-07-01 - Path Traversal in Client-Side Navigation
**Vulnerability:** Path traversal risk during client-side navigation fallback (e.g., window.location.href = `/products/${sourceHandle}`) due to unsanitized product handle input.
**Learning:** While React automatically handles encoding during JSX rendering, string interpolations for direct browser API interactions bypass these protections.
**Prevention:** Always manually sanitize user or dynamic inputs using `encodeURIComponent()` when interpolating strings for browser location URLs.
