## 2024-05-25 - Avoid useRef(expensiveFunction())
**Learning:** Found `useRef(getThemeBootstrap())` in a hot React component path (`AppContent`), which evaluates `getThemeBootstrap()` on every render even though `useRef` only needs the initial value.
**Action:** Replace `useRef(getThemeBootstrap())` with lazy initialization pattern or extract it if it's purely initial state.
