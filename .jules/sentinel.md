
## 2024-05-18 - Path Traversal & Open Redirect via URL Construction
**Vulnerability:** User-controlled values (like `productHandle`) were directly interpolated into URL paths and assigned to `window.location.href`. This could allow attackers to use strings like `../` to navigate to unintended paths or use `//attacker.com` to create an open redirect.
**Learning:** Even internal-looking paths (`/products/${handle}`) can become open redirects or path traversal vectors if the interpolated value contains directory traversal characters or scheme-relative slashes.
**Prevention:** Always sanitize and encode user-controlled URL segments using `encodeURIComponent()` before appending them to paths.
