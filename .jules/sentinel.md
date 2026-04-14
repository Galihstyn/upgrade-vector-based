## 2025-02-12 - Prevent Open Redirects via URL Sinks
**Vulnerability:** The application was directly using user-controlled URL parameters (like `productHandle`) without URL encoding when constructing the `window.location.href` fallback URLs.
**Learning:** This architectural gap allows path traversals, open redirects, or XSS via the `javascript:` pseudo protocol. These issues exist because inputs passed into sinks like `window.location.href` lack implicit sanitization or encoding checks.
**Prevention:** Always apply `encodeURIComponent()` or validate the pattern of user-provided URL components (e.g., handles, paths, search parameters) before interpolating them into paths passed to navigation APIs.
