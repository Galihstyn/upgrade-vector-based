## 2024-05-24 - Missing client-side navigation sanitization
**Vulnerability:** Path traversal and open redirect vulnerabilities via unsanitized string interpolations for `window.location.href`.
**Learning:** While React automatically handles encoding during JSX rendering, manual DOM manipulation and client-side navigation assignments (like `window.location.href`) completely bypass these built-in protections, leaving interpolations vulnerable.
**Prevention:** Always manually sanitize dynamic values using `encodeURIComponent()` when constructing URLs or paths for client-side navigations and manual DOM injections.
