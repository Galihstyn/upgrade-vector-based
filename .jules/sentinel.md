## 2024-06-22 - Unsanitized URL Interpolation Risk
**Vulnerability:** `window.location.href` assignment with an unsanitized `sourceHandle` dynamically retrieved from `themeBootstrapRef` or URL search params.
**Learning:** Even internal routing paths (like `/products/${sourceHandle}`) can lead to path traversal or open redirects if the interpolated string can be controlled via query parameters and includes `../` or `//`.
**Prevention:** Always use `encodeURIComponent()` on user-controlled string fragments before interpolating them into a URL path, especially before client-side navigation.
