## 2024-05-18 - Vite Dev Server Bound to 0.0.0.0
**Vulnerability:** The Vite development server was configured to bind to `0.0.0.0`, exposing the dev server to the entire local network.
**Learning:** This is a security risk as it allows anyone on the local network to access the development environment, which may contain sensitive data, debug tools, or unauthenticated endpoints intended only for local use.
**Prevention:** Always bind development servers to `127.0.0.1` or `localhost` to ensure they are only accessible from the host machine.
