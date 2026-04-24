## 2024-05-24 - Unsanitized URL Parameters in Redirects
**Vulnerability:** The application was constructing a fallback redirect URL (`window.location.href`) by directly concatenating a user-influenced variable (`sourceHandle` derived from `productHandle`) without URL encoding, introducing potential risks of path traversal or open redirects.
**Learning:** React ref states or bootstrap variables like `productHandle` often originate from URL queries or unverified DOM attributes. Assuming these are safe for direct string concatenation in URL routing leads to subtle injection vulnerabilities.
**Prevention:** Always apply `encodeURIComponent()` when appending variables to URL paths before passing them to sinks like `window.location.href`.
