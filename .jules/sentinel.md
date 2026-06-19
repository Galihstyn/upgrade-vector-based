## 2024-05-18 - Path Traversal in Fallback URL Generation
**Vulnerability:** Client-side path traversal and potential open redirect vulnerability due to unsanitized product handle in the fallback URL generation for back navigation.
**Learning:** URL parameters mapped to internal paths (e.g., `productHandle` used to build `/products/{handle}`) bypass React's encoding protections when concatenated directly in strings for window.location assignment.
**Prevention:** Always use `encodeURIComponent()` to sanitize variables used as path segments in URL interpolation to prevent path traversal vectors.
