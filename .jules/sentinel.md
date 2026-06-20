## 2024-06-20 - URL Path Injection in React Router/Window Location
**Vulnerability:** User-controlled property (`productHandle`) was directly interpolated into a string path and assigned to `window.location.href`, creating a potential path traversal and open redirect risk.
**Learning:** React inherently prevents XSS when rendering variables in JSX, but raw string interpolation for client-side navigation (e.g., `window.location.href = ...`) bypasses React's automatic encoding.
**Prevention:** Always wrap dynamically generated URL path segments with `encodeURIComponent()` before assigning them to routing or `window.location`.
