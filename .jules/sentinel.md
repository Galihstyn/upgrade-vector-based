## 2024-05-18 - Missing URL Encoding on productHandle Navigation
**Vulnerability:** `productHandle` from `themeBootstrapRef` was concatenated directly into a path (`/products/${sourceHandle}`) and assigned to `window.location.href`, potentially allowing path traversal.
**Learning:** Unencoded user-controlled variables (like `productHandle`) passed to URL sinks can result in unintended navigations or vulnerabilities, even when prefixed with a fixed path.
**Prevention:** Always apply `encodeURIComponent()` to user-controlled parameters before incorporating them into URLs or passing them to sinks like `window.location.href`.
