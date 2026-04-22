1. *Optimize expensive initialization in `AppContent`*
   - Change `themeBootstrapRef`, `bootBackgroundRef`, `editorContextSignatureRef`, and `projectStorageKeyRef` to use lazy initialization instead of calling expensive functions like `getThemeBootstrap()`, `safeClone()`, and `buildProjectStorageKey()` directly in `useRef()`.
   - This avoids running expensive DOM queries and JSON parsing on every single re-render of `AppContent`.

2. *Complete pre commit steps*
   - Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.

3. *Submit the change.*
   - Once all tests pass, I will submit the change with a descriptive commit message.
