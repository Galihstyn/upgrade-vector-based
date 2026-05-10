## 2024-05-10 - Protocol-Relative URL Open Redirect
**Vulnerability:** Open Redirect in back navigation via document.referrer.
**Learning:** `new URL(referrer)` parses `//attacker.com` with a valid origin but a pathname of `//attacker.com`. Setting `location.href` to this path creates a protocol-relative redirect to the attacker's site.
**Prevention:** Always validate that the `pathname` starts with `/` and NOT `//`. Reconstruct safe relative paths using `pathname + search + hash` rather than reusing `href`.
