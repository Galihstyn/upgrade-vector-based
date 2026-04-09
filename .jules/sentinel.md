## 2024-04-09 - Vite Development Server Binding
**Vulnerability:** Vite development server was bound to `0.0.0.0`.
**Learning:** Binding to `0.0.0.0` exposes the development server to the local network, allowing anyone on the network to access it. This could potentially expose sensitive development configuration, source code, or unreleased features.
**Prevention:** Bind the Vite development server to `127.0.0.1` or `localhost` to ensure it is only accessible from the local machine.