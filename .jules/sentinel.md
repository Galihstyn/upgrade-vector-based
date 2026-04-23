## 2024-05-24 - [Path Traversal in URL Construction]
**Vulnerability:** The application was appending `sourceHandle` directly into the path `/products/${sourceHandle}` and redirecting to it without URL encoding.
**Learning:** This exposes the application to path traversal or open redirect vulnerabilities, where a carefully crafted handle with `../` characters could direct the user to arbitrary, unintended paths or domains. This codebase frequently constructs URLs with user-controlled parameters.
**Prevention:** Always use `encodeURIComponent()` when interpolating URL parameters or handles into route segments (like `/products/` or `/collections/`) to sanitize special characters and avoid path manipulation.
