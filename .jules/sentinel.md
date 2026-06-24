## 2026-06-24 - Fix Path Traversal in Client-Side Navigation
**Vulnerability:** String interpolations for client-side navigation bypass React's auto-escaping, leading to path traversal or open redirect.
**Learning:** `window.location.href` assignments with unsanitized state (like product handles) can be exploited if the user crafts malicious URLs.
**Prevention:** Always manually encode user-controlled URL segments using `encodeURIComponent()` before interpolating them into client-side navigation strings.
