## 2024-05-24 - Path Traversal & Open Redirect via URL Parameters
**Vulnerability:** Unsanitized URL parameters used to build internal redirect paths (e.g., `/products/${sourceHandle}`).
**Learning:** URL query parameters can contain path traversal characters (like `../` or `//`) which could manipulate client-side navigation.
**Prevention:** Always use `encodeURIComponent()` when interpolating URL parameters into internal paths.
