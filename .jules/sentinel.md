
## 2024-05-24 - Path Traversal in Client Navigation
**Vulnerability:** Found an open redirect/path traversal risk in `handleBackNavigation` where an unsanitized `sourceHandle` variable was directly interpolated into a URL (`/products/${sourceHandle}`).
**Learning:** React doesn't automatically encode user input when used inside `window.location.href`. This is a risk because `sourceHandle` is derived from an unverified URL parameter.
**Prevention:** Always use `encodeURIComponent()` to sanitize user inputs before placing them in paths.
