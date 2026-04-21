## 2025-04-21 - Unsanitized User Input in URL Path
**Vulnerability:** Path traversal / Open redirect risk via unsanitized `sourceHandle` variable used in fallback URL construction (`/products/${sourceHandle}`) before redirecting the window location.
**Learning:** The `themeBootstrapRef.current?.productHandle` can contain user-controlled input. Using this directly to build a path without encoding it can lead to path traversal vulnerabilities and potential XSS if the value is crafted maliciously (e.g. `../` or similar injections).
**Prevention:** Always use `encodeURIComponent()` when appending user-controlled or external variables into URL paths before passing them to sinks like `window.location.href`.
