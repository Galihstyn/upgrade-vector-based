## 2026-04-15 - [Path Traversal in URL Construction]
**Vulnerability:** The application was using an unencoded user-controlled `productHandle` string to construct a fallback redirect URL (`/products/${sourceHandle}`) in `handleBackNavigation`. This allowed for open redirection or path traversal.
**Learning:** `window.location.href` assignments that depend on unencoded variables read from themes or queries are an architectural gap where user input can directly manipulate browser navigation paths.
**Prevention:** Always wrap dynamically sourced URL path parameters with `encodeURIComponent` before inserting them into string templates that will be assigned to a redirect sink.
