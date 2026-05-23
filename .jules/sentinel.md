## 2024-05-25 - Secure Internal Redirects & Path Parameter Encoding
**Vulnerability:** Path traversal risk due to unencoded `productHandle` interpolation and open redirect/XSS risk from insecure `document.referrer` redirects.
**Learning:** URL parameters mapped to internal paths must be sanitized using `encodeURIComponent()`. Internal redirects using `document.referrer` must validate that the parsed URL origin matches `window.location.origin` (and is not `"null"`), and should only redirect using relative path components (`pathname + search + hash`) while ensuring `pathname` starts with a single `/` and not `//`.
**Prevention:** Always use `encodeURIComponent` for URL path segments and explicitly reconstruct relative URLs from `document.referrer` with strict validation.
