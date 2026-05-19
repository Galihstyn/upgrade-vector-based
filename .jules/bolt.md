## $(date +%Y-%m-%d) - Lazy initialization of expensive refs in AppContent
**Learning:** Found that expensive initialization logic, like generating themes or contexts, passed into `useRef(getThemeBootstrap())` in `AppContent` (a hot path) triggers re-evaluation on every React render, wasting valuable CPU cycles since the initial value is only used on the first render.
**Action:** Use the `useRef` and `isInitialized.current` lazy initialization pattern for setting up expensive refs like themes or bootstrap data in React components, rather than calling the functions inline within `useRef(...)`.
